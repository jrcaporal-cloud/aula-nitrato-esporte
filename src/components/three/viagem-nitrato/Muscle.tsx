import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { C } from '../../sims/kit/palette';
import { HYPOXIA_POS, MUSCLE } from './anatomy';
import { CutOrgan, type Tint } from './CutOrgan';
import { flowOf, flowify, matOf } from './fx';
import { HALO_PLANE, haloMaterial } from './materials';
import { useStructure } from './selection';
import type { VnStateRef } from './state';
import { buildLut, lutPoint } from './tubes';

/*
 * Coxa: o quadríceps em corte, com feixes de fibras por dentro, e a mancha laranja onde falta O₂
 * (o único "aceno" desta cena para o modelo vaso-hipoxia).
 */

const MUSCLE_RIM = '#D49A92';
const STRANDS = 14;
const STRAND_SAMPLES = 18;
const MUSCLE_TINT: Tint = { color: C.hypoxia, amount: f => f.w.hypoxia * 0.5 };

/** Feixes de fibras ao longo do fuso, só na metade de trás (a da frente fica livre para os íons). Contraem (pulsam) no esforço. */
const Fibers = ({ stateRef }: { stateRef: VnStateRef }) => {
    const { lit } = useStructure('musculo');
    const litRef = useRef(lit);
    useEffect(() => { litRef.current = lit; }, [lit]);
    const parts = useMemo(() => {
        const lut = buildLut(MUSCLE, 100);
        const out = new THREE.Vector3();
        const tubes = Array.from({ length: STRANDS }, (_, k) => {
            const phi = Math.PI + ((k + 0.5) / STRANDS) * Math.PI;
            const rad = 0.55 + 0.3 * ((k * 7) % 5) / 4;
            const pts = Array.from({ length: STRAND_SAMPLES }, (_, i) =>
                lutPoint(lut, 0.04 + (0.92 * i) / (STRAND_SAMPLES - 1), Math.cos(phi) * rad, Math.sin(phi) * rad, out).clone());
            return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.03, 6, false);
        });
        const mat = new THREE.MeshStandardMaterial({ color: '#8A5A58', emissive: MUSCLE_RIM, emissiveIntensity: 0.5, roughness: 0.45 });
        flowify(mat, { color: C.hypoxia, freq: 7, speed: 0.8 });
        return { geo: mergeGeometries(tubes, false) ?? new THREE.BufferGeometry(), mat };
    }, []);
    const mesh = useRef<THREE.Mesh>(null);
    useEffect(() => () => { parts.geo.dispose(); parts.mat.dispose(); }, [parts]);
    useFrame(() => {
        const f = stateRef.current.f;
        const fm = matOf<THREE.MeshStandardMaterial>(mesh);
        const fh = flowOf(fm);
        if (fm) fm.emissiveIntensity = litRef.current ? 1.1 : 0.12 + 0.3 * f.focus.musculo;
        if (fh) fh.amount.value = f.w.hypoxia * 0.55;
    });
    // sem handlers: os feixes ficam dentro da casca do músculo, que já recebe o ponteiro
    return <mesh ref={mesh} geometry={parts.geo} material={parts.mat} />;
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
        <CutOrgan id="musculo" organ={MUSCLE} base="#7A4A4A" emissive={MUSCLE_RIM} rim={MUSCLE_RIM} cut="#E8B0A6" tubular={80} radial={32} shell={0.55} stateRef={stateRef} surface="muscle" tint={MUSCLE_TINT} glow={0.2} />
        <Fibers stateRef={stateRef} />
        <HypoxiaGlow stateRef={stateRef} />
    </group>
);
