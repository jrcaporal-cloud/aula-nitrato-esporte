import { memo, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Label3D } from '../shared/Label3D';
import { CameraDirector } from './CameraDirector';
import { Dust } from './Dust';
import type { ClockRef } from './clock';
import { HumanStation } from './HumanStation';
import { LimbStation } from './LimbStation';
import { CursorSync, PickLayer } from './PickLayer';
import { StationA } from './StationA';
import { STATION_X } from './layout';
import { SARCO_STEPS } from './steps';

/** Avisa quando os primeiros quadros foram desenhados (tira o véu de carregamento). */
const ReadyProbe = ({ onReady }: { onReady: () => void }) => {
    const frames = useRef(0);
    useFrame(() => {
        frames.current += 1;
        if (frames.current === 3) onReady();
    });
    return null;
};

/** Fundo: degradê arroxeado quase preto, igual ao palco da aula. */
const Backdrop = () => {
    const mat = useMemo(() => new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `varying vec3 vP; void main(){
            float h = vP.y * 0.5 + 0.5;
            vec3 c = mix(vec3(0.020,0.012,0.032), vec3(0.058,0.030,0.082), smoothstep(0.2, 0.95, h));
            gl_FragColor = vec4(c, 1.0);
        }`,
    }), []);
    return <mesh material={mat} scale={150} raycast={() => undefined}><sphereGeometry args={[1, 32, 16]} /></mesh>;
};

export interface SceneProps {
    step: number;
    settled: number;
    recenterKey: number;
    reduced: boolean;
    onSettled: (step: number) => void;
    onReady: () => void;
    clockRef: ClockRef;
}

const SceneImpl = ({ step, settled, recenterKey, reduced, onSettled, onReady, clockRef }: SceneProps) => {
    const timeRef = useRef({ t: 0 });
    const data = SARCO_STEPS[step];
    const labels = settled === step ? data.labels : [];
    return (
        <>
            <Backdrop />
            <fog attach="fog" args={['#07050B', 14, 52]} />
            <Environment resolution={256} frames={1} environmentIntensity={0.85}>
                <Lightformer form="rect" intensity={2.4} position={[-4, 5, 6]} scale={[9, 4, 1]} color="#ffffff" />
                <Lightformer form="rect" intensity={1.3} position={[7, 1, 4]} scale={[3, 7, 1]} color="#c4b5fd" />
                <Lightformer form="rect" intensity={1.1} position={[0, 4, -8]} scale={[12, 3, 1]} color="#ffd6e8" />
                <Lightformer form="rect" intensity={0.9} position={[0, -5, 3]} scale={[10, 2, 1]} color="#7fd8ff" />
            </Environment>
            <ambientLight intensity={0.25} color="#d8ccff" />
            <directionalLight position={[4, 9, 12]} intensity={1.7} color="#ffffff" />
            <directionalLight position={[-10, 3, 6]} intensity={0.6} color="#b9a8ff" />
            <directionalLight position={[0, 2, -10]} intensity={1.2} color="#9ec5ff" />
            <Dust x={STATION_X.a} />
            <Dust x={STATION_X.c} spread={[10, 6, 8]} />
            <Dust x={STATION_X.d} spread={[10, 6, 8]} />
            <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={3} maxDistance={26} />
            <CameraDirector step={step} pose={data.pose} recenterKey={recenterKey} reduced={reduced} onSettled={onSettled} />
            <PickLayer />
            <CursorSync />
            <ReadyProbe onReady={onReady} />
            <StationA clockRef={clockRef} showFibers={step === 2} />
            <LimbStation clockRef={clockRef} />
            <HumanStation clockRef={clockRef} />
            {labels.map((l, i) => <Label3D key={`${step}-${l.id}`} spec={l} timeRef={timeRef} delay={0.05 + i * 0.12} />)}
        </>
    );
};

/** `memo`: o modal re-renderiza a cada hover, e a cena não depende disso. */
export const Scene = memo(SceneImpl);
