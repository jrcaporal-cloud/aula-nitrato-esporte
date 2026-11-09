import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clamp01 } from '../shared/math';
import type { ClockRef } from './clock';
import { COL } from './colors';
import { pcrUse } from './pcrUse';
import { getGlyph } from './glyphs';
import { TANK_X, type UnitSpec } from './layout';
import { setU, unitDim, unitIdle, unitSignals } from './look';
import { noRaycast } from './points';
import { makeLiquidGlass } from './tankLiquid';

/*
 * Estoque de PCr (tubo da esquerda) e de creatina livre (direita): cada conta é uma fração do estoque e o
 * líquido do tubo sobe e desce junto com elas. A PCr gasta vira creatina, então o tubo da PCr esvazia e o
 * da creatina enche; o nitrato esvazia menos.
 */

const N = 14;
const STEP_Y = 0.058;
const Y0 = -0.36;
const R_BEAD = 0.04;
const TUBE_H = N * STEP_Y + 0.12;
const Y_MID = Y0 + (N * STEP_Y) / 2 - STEP_Y / 2;
const TOP = Y0 + N * STEP_Y;
const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const Q = new THREE.Quaternion();
const S = new THREE.Vector3();

/** Tampas dos dois tubos (embaixo e em cima), numa malha instanciada só. */
const CAP_AT: readonly (readonly [number, number])[] = [
    [TANK_X.pcr, Y0 - 0.05], [TANK_X.pcr, TOP + 0.02], [TANK_X.cr, Y0 - 0.05], [TANK_X.cr, TOP + 0.02],
];

/** Escreve as contas de um tubo (as que já foram gastas encolhem até sumir). */
const fillBeads = (mesh: THREE.InstancedMesh | null, count: number, x: number, off: number, time: number): void => {
    if (!mesh) return;
    for (let k = 0; k < N; k++) {
        const s = clamp01(count - k);
        const bob = 0.006 * Math.sin(time * 2 + k * 1.7 + off);
        const dx = (k % 2 ? 0.025 : -0.025);
        mesh.setMatrixAt(k, M.compose(P.set(x + dx, Y0 + k * STEP_Y + bob, 0), Q, S.setScalar(Math.max(s, 1e-4))));
    }
    mesh.instanceMatrix.needsUpdate = true;
};

/** Nível do líquido (y local do tubo) para `count` contas: a superfície fica entre a última conta e a próxima. */
const levelOf = (count: number): number => {
    const full = (count - N / 2) * STEP_Y;
    const empty = -TUBE_H / 2 - 0.02;
    return empty + (full - empty) * Math.min(count, 1);
};

interface Props { spec: UnitSpec; clockRef: ClockRef }

export const Tank = ({ spec, clockRef }: Props) => {
    const group = useRef<THREE.Group>(null);
    const pcr = useRef<THREE.InstancedMesh>(null);
    const cr = useRef<THREE.InstancedMesh>(null);
    const caps = useRef<THREE.InstancedMesh>(null);
    const kit = useMemo(() => ({
        tubeG: new THREE.CylinderGeometry(0.1, 0.1, TUBE_H, 20, 1, true),
        capG: new THREE.CylinderGeometry(0.11, 0.11, 0.025, 20),
        beadG: new THREE.SphereGeometry(R_BEAD, 12, 9),
        capM: new THREE.MeshStandardMaterial({ color: '#7C8DB5', roughness: 0.4, metalness: 0.4 }),
        pcrM: new THREE.MeshStandardMaterial({ color: COL.pcr, roughness: 0.2, emissive: COL.pcr, emissiveIntensity: 0.55 }),
        crM: new THREE.MeshStandardMaterial({ color: COL.cr, roughness: 0.45, emissive: COL.cr, emissiveIntensity: 0.12 }),
    }), []);
    const glass = useMemo(() => ({ pcr: makeLiquidGlass(COL.pcr), cr: makeLiquidGlass(COL.cr) }), []);
    useEffect(() => () => {
        Object.values(kit).forEach(o => o.dispose());
        glass.pcr.material.dispose();
        glass.cr.material.dispose();
    }, [kit, glass]);

    const labelPcr = getGlyph('PCr', COL.pcr);
    const labelCr = getGlyph('Cr', '#8FB3B8');

    useLayoutEffect(() => {
        for (const m of [pcr.current, cr.current]) m?.setMatrixAt(0, M.identity());
        const cm = caps.current;
        if (!cm) return;
        CAP_AT.forEach(([x, y], i) => cm.setMatrixAt(i, M.makeTranslation(x, y, 0)));
        cm.instanceMatrix.needsUpdate = true;
    }, []);

    useFrame(state => {
        const c = clockRef.current;
        if (unitIdle(c, spec, state.camera.position.x)) return;
        const g = group.current;
        if (!g) return;
        const sig = unitSignals(c, spec);
        const dim = unitDim(c, spec, sig.fatigue);
        const show = clamp01(1 - c.mix * 2) * (0.35 + 0.65 * dim);
        g.scale.setScalar(Math.max(show, 1e-4));
        g.visible = show > 0.02;
        if (!g.visible) return;
        const used = pcrUse(c.step, spec.cond, c.t);
        const nP = N * (1 - used);
        const nC = N * used;
        const time = state.clock.elapsedTime;
        fillBeads(pcr.current, nP, TANK_X.pcr, 0, time);
        fillBeads(cr.current, nC, TANK_X.cr, 2, time);
        const agit = 0.35 + 1.4 * sig.act;
        const up = glass.pcr.uniforms;
        setU(up.uLevel, levelOf(nP));
        setU(up.uAgit, agit);
        setU(up.uTime, time);
        setU(up.uDim, 0.4 + 0.6 * dim);
        const uc = glass.cr.uniforms;
        setU(uc.uLevel, levelOf(nC));
        setU(uc.uAgit, agit);
        setU(uc.uTime, time + 3.7);
        setU(uc.uDim, 0.4 + 0.6 * dim);
    });

    return (
        <group ref={group}>
            <mesh geometry={kit.tubeG} material={glass.pcr.material} position={[TANK_X.pcr, Y_MID, 0]} raycast={noRaycast} renderOrder={5} />
            <mesh geometry={kit.tubeG} material={glass.cr.material} position={[TANK_X.cr, Y_MID, 0]} raycast={noRaycast} renderOrder={5} />
            <instancedMesh ref={caps} args={[kit.capG, kit.capM, CAP_AT.length]} frustumCulled={false} raycast={noRaycast} />
            <instancedMesh ref={pcr} args={[kit.beadG, kit.pcrM, N]} frustumCulled={false} raycast={noRaycast} />
            <instancedMesh ref={cr} args={[kit.beadG, kit.crM, N]} frustumCulled={false} raycast={noRaycast} />
            <mesh material={labelPcr.material} position={[TANK_X.pcr, Y0 - 0.2, 0.05]} scale={[0.17 * labelPcr.aspect, 0.17, 1]} raycast={noRaycast}>
                <planeGeometry args={[1, 1]} />
            </mesh>
            <mesh material={labelCr.material} position={[TANK_X.cr, Y0 - 0.2, 0.05]} scale={[0.17 * labelCr.aspect, 0.17, 1]} raycast={noRaycast}>
                <planeGeometry args={[1, 1]} />
            </mesh>
        </group>
    );
};
