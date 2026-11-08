import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ClockRef } from './clock';
import { COL } from './colors';
import { signals } from './kinetics';
import { SARC, halfLen, type UnitSpec } from './layout';
import { noRaycast } from './points';
import { useStructureBind } from './selection';
import { setOpacity, unitDim } from './look';

/*
 * Membranas de um sarcômero: manga do retículo sarcoplasmático (rede), dois túbulos T (anéis) com
 * cisternas terminais de cada lado (a tríade), receptores DHPR no túbulo e calsequestrina (CASQ1) nas
 * cisternas. DHPR e CASQ1 crescem e acendem em magenta onde o nitrato os aumentou (fibra rápida do camundongo).
 */

const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const Q = new THREE.Quaternion();
const NEUTRAL = new THREE.Color('#E2E8F0');
const MAGENTA = new THREE.Color(COL.nitrate);
const TUBULE = new THREE.Color(COL.tubule);
const CISTERNA = new THREE.Color(COL.cisterna);
const scratch = new THREE.Color();

const ANGLES = Array.from({ length: 6 }, (_, k) => (k * Math.PI) / 3);
const SIDES = [1, -1] as const;
const GAPS = [-1, 1] as const;

interface Props { spec: UnitSpec; clockRef: ClockRef }

export const Membranes = ({ spec, clockRef }: Props) => {
    const sleeve = useRef<THREE.Mesh>(null);
    const tubes = useRef<(THREE.Mesh | null)[]>([]);
    const cist = useRef<(THREE.Mesh | null)[]>([]);
    const dhpr = useRef<THREE.InstancedMesh>(null);
    const casq = useRef<THREE.InstancedMesh>(null);

    const kit = useMemo(() => ({
        sleeveG: new THREE.CylinderGeometry(SARC.srR, SARC.srR, 1, 12, 4, true).rotateZ(Math.PI / 2),
        sleeveM: new THREE.MeshBasicMaterial({ color: COL.membrane, wireframe: true, transparent: true, opacity: 0.3 }),
        tubeG: new THREE.TorusGeometry(SARC.ringR, 0.03, 8, 36).rotateY(Math.PI / 2),
        tubeM: new THREE.MeshStandardMaterial({ color: COL.tubule, roughness: 0.4, emissive: COL.tubule, emissiveIntensity: 0.25 }),
        cistG: new THREE.TorusGeometry(SARC.ringR + 0.03, 0.062, 10, 36).rotateY(Math.PI / 2),
        cistM: new THREE.MeshStandardMaterial({ color: COL.cisterna, roughness: 0.5, transparent: true, opacity: 0.6 }),
        dhprG: new THREE.SphereGeometry(0.042, 10, 8),
        casqG: new THREE.SphereGeometry(0.034, 10, 8),
        dhprM: new THREE.MeshStandardMaterial({ color: '#E2E8F0', roughness: 0.4 }),
        casqM: new THREE.MeshStandardMaterial({ color: '#E2E8F0', roughness: 0.4 }),
    }), []);
    useEffect(() => () => Object.values(kit).forEach(o => o.dispose()), [kit]);

    useFrame(() => {
        const c = clockRef.current;
        const sig = signals(c.step, spec.cond, spec.fiber, c.t);
        const dim = unitDim(c, spec, sig.fatigue);
        const h = halfLen(sig.act);
        const boost = Math.min(Math.max((sig.amp - 1) / 0.75, 0), 1);

        if (sleeve.current) sleeve.current.scale.x = 2 * h - 0.06;
        setOpacity(kit.sleeveM, 0.17 * dim);
        kit.tubeM.color.copy(TUBULE).multiplyScalar(dim);
        kit.cistM.color.copy(CISTERNA).multiplyScalar(dim);
        setOpacity(kit.cistM, 0.6 * (0.4 + 0.6 * dim));

        scratch.copy(NEUTRAL).lerp(MAGENTA, boost).multiplyScalar(dim);
        for (const m of [kit.dhprM, kit.casqM]) {
            m.color.copy(scratch);
            m.emissive.copy(MAGENTA).multiplyScalar(boost * 0.9 * dim);
        }

        SIDES.forEach((side, si) => {
            const tx = side * (h - SARC.tubuleOffset);
            const t = tubes.current[si];
            if (t) t.position.x = tx;
            GAPS.forEach((g, gi) => {
                const cm = cist.current[si * 2 + gi];
                if (cm) cm.position.x = tx + g * SARC.cisternaGap;
            });
        });

        const dm = dhpr.current;
        const cq = casq.current;
        if (!dm || !cq) return;
        const grow = 1 + 0.6 * boost;
        SIDES.forEach((side, si) => {
            const tx = side * (h - SARC.tubuleOffset);
            ANGLES.forEach((a, k) => {
                const an = a + 0.26;
                dm.setMatrixAt(si * 6 + k, M.compose(P.set(tx, SARC.ringR * Math.cos(an), SARC.ringR * Math.sin(an)), Q.identity(), S.set(grow, grow, grow)));
                GAPS.forEach((g, gi) => {
                    const ca = a + 0.78 + gi * 0.5;
                    const r = SARC.ringR + 0.03;
                    cq.setMatrixAt((si * 2 + gi) * 6 + k, M.compose(P.set(tx + g * SARC.cisternaGap, r * Math.cos(ca), r * Math.sin(ca)), Q.identity(), S.set(grow, grow, grow)));
                });
            });
        });
        dm.instanceMatrix.needsUpdate = true;
        cq.instanceMatrix.needsUpdate = true;
    });

    const bindT = useStructureBind('tubuloT');
    const bindRs = useStructureBind('rs', true);
    const bindDhpr = useStructureBind('dhpr');
    const bindCasq = useStructureBind('casq1');

    return (
        <>
            <mesh ref={sleeve} geometry={kit.sleeveG} material={kit.sleeveM} raycast={noRaycast} />
            {SIDES.map((s, i) => (
                <mesh key={`t${s}`} ref={el => { tubes.current[i] = el; }} geometry={kit.tubeG} material={kit.tubeM} {...bindT} />
            ))}
            {[0, 1, 2, 3].map(i => (
                <mesh key={`c${i}`} ref={el => { cist.current[i] = el; }} geometry={kit.cistG} material={kit.cistM} {...bindRs} />
            ))}
            <instancedMesh ref={dhpr} args={[kit.dhprG, kit.dhprM, 12]} frustumCulled={false} {...bindDhpr} />
            <instancedMesh ref={casq} args={[kit.casqG, kit.casqM, 24]} frustumCulled={false} {...bindCasq} />
        </>
    );
};
