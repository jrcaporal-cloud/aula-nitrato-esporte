import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';
import { clamp01 } from '../shared/math';
import { N_CA, N_SPARK, makeSparks, stepSparks, writeCalcium } from './cloudMath';
import type { ClockRef } from './clock';
import { COL } from './colors';
import { halfLen, type UnitSpec } from './layout';
import { unitDim, unitIdle, unitSignals } from './look';
import { noRaycast, usePointCloud } from './points';

/* Ca²⁺ (pontos azuis que saem das cisternas e voltam) e faíscas brancas de ATP gasto, de um sarcômero. */

interface Props { spec: UnitSpec; clockRef: ClockRef }

export const CalciumCloud = ({ spec, clockRef }: Props) => {
    const { cloud, geometry, material, flush } = usePointCloud(N_CA, COL.ca, 0.1, 0.95);
    useFrame(state => {
        const c = clockRef.current;
        if (unitIdle(c, spec, state.camera.position.x)) return;
        const sig = unitSignals(c, spec);
        const frac = clamp01(sig.act * sig.amp * 0.55);
        writeCalcium(cloud, halfLen(sig.act), frac, 1 + 0.35 * (sig.amp - 1), state.clock.elapsedTime);
        flush(state, unitDim(c, spec, sig.fatigue));
    });
    return <points geometry={geometry} material={material} frustumCulled={false} raycast={noRaycast} />;
};

export const SparkCloud = ({ spec, clockRef }: Props) => {
    const { cloud, geometry, material, flush } = usePointCloud(N_SPARK, COL.atp, 0.12, 0.95);
    const [st] = useState(makeSparks);
    const pts = useRef<THREE.Points>(null);
    useFrame((state, dtRaw) => {
        const c = clockRef.current;
        if (unitIdle(c, spec, state.camera.position.x)) return;
        const sig = unitSignals(c, spec);
        const live = stepSparks(st, cloud, Math.min(dtRaw, 0.1), sig.sparks);
        // nenhuma faísca viva: a nuvem não sobe nem desenha
        if (pts.current) pts.current.visible = live > 0;
        if (live > 0) flush(state, unitDim(c, spec, sig.fatigue));
    });
    return <points ref={pts} geometry={geometry} material={material} frustumCulled={false} raycast={noRaycast} />;
};
