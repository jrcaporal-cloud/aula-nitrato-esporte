import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seg, smooth } from '../shared/math';
import type { ClockRef } from './clock';
import { COL } from './colors';
import { CYCLE_S, N_SLOT, SLOTS, makeParts, partsAt } from './energyMath';
import { signals } from './kinetics';
import type { UnitSpec } from './layout';
import { unitDim, unitIdle } from './look';
import { noRaycast, usePointCloud, type Cloud } from './points';

/* Partículas de energia do sarcômero (ATP, ADP, PCr, creatina, Pi) e o flash da creatina-quinase na linha M. */

const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const C_ATP = new THREE.Color(COL.atp);
const C_ADP = new THREE.Color(COL.adp);
const C_PCR = new THREE.Color(COL.pcr);
const C_CR = new THREE.Color(COL.cr);

const writePoint = (cloud: Cloud, i: number, at: readonly number[], scale: number): void => {
    cloud.pos.set(at, i * 3);
    cloud.scale[i] = scale;
};

/** Nível de atividade 0..1: quantas vagas do ciclo estão ligadas (proporcional ao turnover de ATP). */
const ACTIVITY_REF = 34;

interface Props { spec: UnitSpec; clockRef: ClockRef }

export const Energy = ({ spec, clockRef }: Props) => {
    const atp = useRef<THREE.InstancedMesh>(null);
    const pcr = useRef<THREE.InstancedMesh>(null);
    const pi = useRef<THREE.InstancedMesh>(null);
    const clock = useRef(0);
    const parts = useMemo(() => makeParts(), []);
    const flash = usePointCloud(N_SLOT, '#7FFFE9', 1.1, 0.95);
    const kit = useMemo(() => ({
        g: new THREE.SphereGeometry(1, 14, 10),
        atpM: new THREE.MeshStandardMaterial({ color: '#fff', roughness: 0.25, emissive: '#ffffff', emissiveIntensity: 0.55 }),
        pcrM: new THREE.MeshStandardMaterial({ color: '#fff', roughness: 0.25, emissive: COL.pcr, emissiveIntensity: 0.3 }),
        piM: new THREE.MeshStandardMaterial({ color: COL.pi, roughness: 0.3, emissive: COL.pi, emissiveIntensity: 0.9 }),
    }), []);
    useEffect(() => () => Object.values(kit).forEach(o => o.dispose()), [kit]);

    useFrame((state, dt) => {
        const c = clockRef.current;
        if (unitIdle(c, spec, state.camera.position.x)) return;
        const sig = signals(c.step, spec.cond, spec.fiber, c.t);
        const dim = unitDim(c, spec, sig.fatigue);
        const level = Math.min(sig.sparks / ACTIVITY_REF, 1) * (1 - smooth(seg(c.mix, 0.1, 0.5)));
        clock.current += Math.min(dt, 0.1) * Math.max(sig.cycle, 0.3);
        const a = atp.current, p = pcr.current, q = pi.current;
        if (!a || !p || !q) return;
        const vis = 0.3 + 0.7 * dim;
        for (let i = 0; i < N_SLOT; i++) {
            const on = smooth(Math.min(Math.max(level * N_SLOT - i, 0), 1)) * vis;
            const u = (clock.current / CYCLE_S + SLOTS[i].phase) % 1;
            const r = partsAt(SLOTS[i], u, parts);
            a.setMatrixAt(i, M.compose(P.set(...r.atp), Q, S.setScalar(0.05 * r.atpS * on)));
            a.setColorAt(i, r.atpIsAtp ? C_ATP : C_ADP);
            p.setMatrixAt(i, M.compose(P.set(...r.pcr), Q, S.setScalar(0.055 * r.pcrS * on)));
            p.setColorAt(i, r.pcrIsPcr ? C_PCR : C_CR);
            q.setMatrixAt(i, M.compose(P.set(...r.pi), Q, S.setScalar(0.032 * r.piS * on)));
            writePoint(flash.cloud, i, r.flashAt, r.flash * on);
        }
        for (const m of [a, p, q]) {
            m.instanceMatrix.needsUpdate = true;
            if (m.instanceColor) m.instanceColor.needsUpdate = true;
        }
        flash.flush(state, 1);
    });

    return (
        <>
            <instancedMesh ref={atp} args={[kit.g, kit.atpM, N_SLOT]} frustumCulled={false} raycast={noRaycast} />
            <instancedMesh ref={pcr} args={[kit.g, kit.pcrM, N_SLOT]} frustumCulled={false} raycast={noRaycast} />
            <instancedMesh ref={pi} args={[kit.g, kit.piM, N_SLOT]} frustumCulled={false} raycast={noRaycast} />
            <points geometry={flash.geometry} material={flash.material} frustumCulled={false} raycast={noRaycast} renderOrder={4} />
        </>
    );
};
