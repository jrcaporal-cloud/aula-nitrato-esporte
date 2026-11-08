import { memo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Label3D } from '../shared/Label3D';
import { Atmosphere } from './Atmosphere';
import { CameraDirector } from './CameraDirector';
import type { StructureId } from './content';
import { STEP_LABELS } from './director';
import { Fiber } from './Fiber';
import { Particles } from './Particles';
import { PickLayer } from './PickLayer';
import { SlowSystem } from './SlowSystem';
import { stepSim } from './sim';
import { driveUniforms } from './uniforms';
import type { CtlRef, SimRef } from './types';
import { Vessel } from './Vessel';

/** Avança a simulação uma vez por quadro. Primeiro filho: os `useFrame` rodam na ordem de montagem. */
const SimClock = ({ simRef, ctlRef }: { simRef: SimRef; ctlRef: CtlRef }) => {
    useFrame((_, dt) => {
        stepSim(simRef.current, ctlRef.current, dt);
        driveUniforms(simRef.current, ctlRef.current);
    });
    return null;
};

/** Avisa quando os primeiros quadros foram desenhados (tira o véu de carregamento). */
const ReadyProbe = ({ onReady }: { onReady: () => void }) => {
    const frames = useRef(0);
    useFrame(() => {
        frames.current += 1;
        if (frames.current === 3) onReady();
    });
    return null;
};

export interface VasoSceneProps {
    step: number;
    settled: number;
    pin: StructureId | null;
    recenterKey: number;
    reduced: boolean;
    onSettled: (step: number) => void;
    onReady: () => void;
    simRef: SimRef;
    ctlRef: CtlRef;
}

const VasoSceneImpl = ({ step, settled, pin, recenterKey, reduced, onSettled, onReady, simRef, ctlRef }: VasoSceneProps) => {
    const timeRef = useRef({ t: 0 });
    const labels = settled === step && !pin ? STEP_LABELS[step] : [];
    return (
        <>
            <SimClock simRef={simRef} ctlRef={ctlRef} />
            <color attach="background" args={['#07050B']} />
            <fog attach="fog" args={['#07050B', 38, 80]} />
            <Atmosphere />
            <directionalLight position={[4, 14, 16]} intensity={2.1} color="#ffffff" />
            <directionalLight position={[-12, 2, 8]} intensity={0.7} color="#c4b5fd" />
            <pointLight position={[0, 1.5, 4]} intensity={7} distance={12} color="#fde2e4" />

            <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={4} maxDistance={44} />
            <CameraDirector step={step} pin={pin} recenterKey={recenterKey} reduced={reduced} onSettled={onSettled} />
            <PickLayer />
            <ReadyProbe onReady={onReady} />

            <Vessel simRef={simRef} />
            <Fiber simRef={simRef} ctlRef={ctlRef} />
            <SlowSystem simRef={simRef} />
            <Particles simRef={simRef} />

            {labels.map((l, i) => <Label3D key={`${step}-${l.id}`} spec={l} timeRef={timeRef} delay={0.05 + i * 0.12} />)}
        </>
    );
};

/** `memo`: o modal re-renderiza a cada hover, e a cena não depende disso. */
export const VasoScene = memo(VasoSceneImpl);
