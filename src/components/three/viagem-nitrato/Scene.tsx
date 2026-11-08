import { memo, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Label3D, type TimeRef } from '../shared/Label3D';
import { Bacteria } from './Bacteria';
import { BodyShell, Glass, MouthParts } from './Body';
import { buildCameraPath } from './camera';
import { CameraDirector } from './CameraDirector';
import { STEPS } from './content';
import { Glands } from './Glands';
import { Ions } from './Ions';
import { labelsForStep } from './labels';
import { Muscle } from './Muscle';
import { Organs } from './Organs';
import { PickLayer } from './PickLayer';
import { Sparks } from './Sparks';
import { writeFrame, type VnStateRef } from './state';
import type { StructureId } from './structures';
import { Tongue } from './Tongue';

/*
 * Raiz da cena. O relógio (primeiro filho: os `useFrame` rodam na ordem de montagem) escreve o
 * quadro que todos leem; depois vêm câmera, anatomia, partículas e rótulos.
 */

const SceneClock = ({ stateRef, timeRef }: { stateRef: VnStateRef; timeRef: TimeRef }) => {
    useFrame((_, delta) => writeFrame(stateRef.current, timeRef.current.t, Math.min(delta, 0.1)));
    return null;
};

/** Avisa quando os primeiros quadros foram desenhados. */
const ReadyProbe = ({ onReady }: { onReady: () => void }) => {
    const frames = useRef(0);
    useFrame(() => {
        frames.current += 1;
        if (frames.current === 3) onReady();
    });
    return null;
};

/** Fundo: degradê escuro da aula com um véu magenta bem suave no alto. */
const Backdrop = () => {
    const mat = useMemo(() => new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `varying vec3 vP; void main(){
            float h = vP.y * 0.5 + 0.5;
            vec3 c = mix(vec3(0.027,0.020,0.043), vec3(0.052,0.034,0.075), smoothstep(0.2, 0.95, h));
            c += vec3(0.05,0.0,0.03) * pow(max(vP.y, 0.0), 2.0) * 0.5;
            gl_FragColor = vec4(c, 1.0);
        }`,
    }), []);
    return <mesh material={mat} scale={180}><sphereGeometry args={[1, 32, 16]} /></mesh>;
};

export interface SceneProps {
    step: number;
    settled: number;
    reduced: boolean;
    pin: StructureId | null;
    recenterKey: number;
    onSettled: (step: number) => void;
    onReady: () => void;
    stateRef: VnStateRef;
    timeRef: TimeRef;
}

const SceneImpl = ({ step, settled, reduced, pin, recenterKey, onSettled, onReady, stateRef, timeRef }: SceneProps) => {
    const path = useMemo(() => buildCameraPath(STEPS.map(s => s.pose)), []);
    // com algo fixado, os rótulos da etapa sairiam na frente do close-up
    const labels = useMemo(() => (settled === step && !pin ? labelsForStep(step) : []), [settled, step, pin]);

    return (
        <>
            <SceneClock stateRef={stateRef} timeRef={timeRef} />
            <Backdrop />
            <fog attach="fog" args={['#07050B', 55, 140]} />
            <ambientLight intensity={0.55} color="#d8d0e0" />
            <hemisphereLight args={['#f5e6ff', '#120a18', 0.5]} />
            <directionalLight position={[6, 14, 20]} intensity={2.0} color="#fff7fb" />
            <directionalLight position={[-14, 2, 10]} intensity={0.7} color="#f9a8d4" />
            <directionalLight position={[10, -10, 14]} intensity={0.5} color="#a5b4fc" />

            <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={3.5} maxDistance={70} />
            <CameraDirector step={step} reduced={reduced} pin={pin} recenterKey={recenterKey} onSettled={onSettled} timeRef={timeRef} path={path} />
            <PickLayer />
            <ReadyProbe onReady={onReady} />

            <BodyShell />
            <MouthParts />
            <Glass stateRef={stateRef} />
            <Tongue />
            <Bacteria stateRef={stateRef} />
            <Glands stateRef={stateRef} />
            <Organs stateRef={stateRef} />
            <Muscle stateRef={stateRef} />
            <Ions stateRef={stateRef} />
            <Sparks stateRef={stateRef} />

            {labels.map((l, i) => <Label3D key={`${step}-${l.id}`} spec={l} timeRef={timeRef} delay={0.08 + i * 0.1} />)}
        </>
    );
};

/** `memo`: o modal re-renderiza no hover, e a cena não depende disso. */
export const Scene = memo(SceneImpl);
