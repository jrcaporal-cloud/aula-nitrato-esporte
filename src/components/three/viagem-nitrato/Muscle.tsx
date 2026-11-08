import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { C } from '../../sims/kit/palette';
import { HYPOXIA_POS, MUSCLE } from './anatomy';
import { CutOrgan } from './CutOrgan';
import { HALO_PLANE, TISSUE, haloMaterial, rimMaterial, setEmissive } from './materials';
import { useStructure } from './selection';
import type { VnStateRef } from './state';
import { buildLut, lutPoint } from './tubes';

/*
 * Coxa: o quadríceps em corte, com feixes de fibras por dentro, e a mancha laranja onde falta O₂
 * (o único "aceno" desta cena para o modelo vaso-hipoxia).
 */

const MUSCLE_RIM = '#C48E86';
const STRANDS = 8;
const STRAND_SAMPLES = 16;

/** Feixes de fibras ao longo do fuso, só na metade de trás (a da frente fica livre para os íons). */
const Fibers = () => {
    const { bind, lit } = useStructure('musculo');
    const mesh = useRef<THREE.Mesh>(null);
    const parts = useMemo(() => {
        const lut = buildLut(MUSCLE, 100);
        const out = new THREE.Vector3();
        const tubes = Array.from({ length: STRANDS }, (_, k) => {
            const phi = Math.PI + ((k + 0.5) / STRANDS) * Math.PI;
            const pts = Array.from({ length: STRAND_SAMPLES }, (_, i) =>
                lutPoint(lut, 0.04 + (0.92 * i) / (STRAND_SAMPLES - 1), Math.cos(phi) * 0.8, Math.sin(phi) * 0.8, out).clone());
            return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.034, 5, false);
        });
        return { geo: mergeGeometries(tubes, false), mat: rimMaterial(MUSCLE_RIM, 0.55) };
    }, []);
    useEffect(() => () => { parts.geo?.dispose(); parts.mat.dispose(); }, [parts]);
    useFrame(() => setEmissive(mesh.current?.material, lit ? 1.6 : 0.55));
    return <mesh ref={mesh} geometry={parts.geo} material={parts.mat} {...bind} />;
};

/** Brilho laranja pulsante: região do músculo com pouco O₂ (etapa 7). */
const HypoxiaGlow = ({ stateRef }: { stateRef: VnStateRef }) => {
    const m = useRef<THREE.Mesh>(null);
    const mat = useMemo(() => haloMaterial(C.hypoxia, 0), []);
    useEffect(() => () => mat.dispose(), [mat]);
    useFrame(({ clock, camera }) => {
        const w = stateRef.current.f.w.hypoxia;
        const mesh = m.current;
        if (!mesh) return;
        mesh.visible = w > 0.03;
        mesh.quaternion.copy(camera.quaternion);
        mesh.scale.setScalar(3.4 + 0.4 * Math.sin(clock.elapsedTime * 2.2));
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.8 * w * (0.8 + 0.2 * Math.sin(clock.elapsedTime * 2.2));
    });
    return <mesh ref={m} geometry={HALO_PLANE} material={mat} position={[HYPOXIA_POS[0], HYPOXIA_POS[1], HYPOXIA_POS[2]]} renderOrder={11} />;
};

export const Muscle = ({ stateRef }: { stateRef: VnStateRef }) => (
    <group>
        <CutOrgan id="musculo" organ={MUSCLE} base={TISSUE.muscle} emissive={MUSCLE_RIM} rim={MUSCLE_RIM} tubular={80} radial={32} shell={0.55} rimThick={0.04} />
        <Fibers />
        <HypoxiaGlow stateRef={stateRef} />
    </group>
);
