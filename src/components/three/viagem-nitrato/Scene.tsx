import { memo, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Label3D, type TimeRef } from '../shared/Label3D';
import { Bacteria } from './Bacteria';
import { BodyShell, Glass, MouthParts } from './Body';
import { buildCameraPath } from './camera';
import { CameraDirector } from './CameraDirector';
import { Dust } from './Dust';
import { FX_TIME } from './fx';
import { STEPS } from './content';
import { Glands } from './Glands';
import { Ions } from './Ions';
import { labelsForStep } from './labels';
import { Muscle } from './Muscle';
import { Organs } from './Organs';
import { PickLayer } from './PickLayer';
import { Sparks } from './Sparks';
import { Spotlight } from './Spotlight';
import { writeFrame, type VnStateRef } from './state';
import type { StructureId } from './structures';
import { Tongue } from './Tongue';

/*
 * Raiz da cena. O relógio (primeiro filho: os `useFrame` rodam na ordem de montagem) escreve o
 * quadro que todos leem; depois vêm câmera, anatomia, partículas e rótulos.
 */

const SceneClock = ({ stateRef, timeRef }: { stateRef: VnStateRef; timeRef: TimeRef }) => {
    useFrame(({ clock }, delta) => {
        FX_TIME.value = clock.elapsedTime;
        writeFrame(stateRef.current, timeRef.current.t, Math.min(delta, 0.1));
    });
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
            <Spotlight path={path} timeRef={timeRef} />
            <Dust />
            <fog attach="fog" args={['#07050B', 55, 140]} />
            <Environment resolution={128} frames={1} environmentIntensity={0.6}>
                <Lightformer form="rect" intensity={2.4} color="#ffd9ec" position={[-7, 6, 8]} scale={[10, 8, 1]} />
                <Lightformer form="rect" intensity={1.6} color="#b9b2ff" position={[9, 2, 6]} rotation-y={-Math.PI / 3} scale={[8, 10, 1]} />
                <Lightformer form="ring" intensity={1.2} color="#f0437e" position={[0, -4, -9]} scale={14} />
                <Lightformer form="rect" intensity={1.0} color="#ffffff" position={[0, 12, 2]} rotation-x={Math.PI / 2} scale={[14, 6, 1]} />
            </Environment>
            <ambientLight intensity={0.32} color="#d8d0e0" />
            <hemisphereLight args={['#f5e6ff', '#120a18', 0.4]} />
            <directionalLight position={[6, 14, 20]} intensity={1.7} color="#fff7fb" />
            <directionalLight position={[-10, 8, -14]} intensity={1.1} color="#a5b4fc" />

            <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={3.5} maxDistance={70} />
            <CameraDirector step={step} reduced={reduced} pin={pin} recenterKey={recenterKey} onSettled={onSettled} timeRef={timeRef} path={path} />
            <PickLayer />
            <ReadyProbe onReady={onReady} />

            <BodyShell />
            <MouthParts />
            <Glass stateRef={stateRef} />
            <Tongue stateRef={stateRef} />
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
