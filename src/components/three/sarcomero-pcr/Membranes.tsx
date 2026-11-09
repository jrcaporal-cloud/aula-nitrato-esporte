import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ClockRef } from './clock';
import { COL } from './colors';
import { apPulse } from './pcrUse';
import { SARC, halfLen, type UnitSpec } from './layout';
import { setGlow, setOpacity, setU, unitDim, unitIdle, unitSignals } from './look';
import { PICK } from './pick';
import { noRaycast, usePointCloud, type Cloud } from './points';
import { useStructureBind } from './selection';
import { SLEEVE_GEO, makeSleeveMaterial } from './sleeve';

/*
 * Membranas de um sarcômero: manga do retículo sarcoplasmático (rede de vidro), dois túbulos T (anéis) com
 * cisternas terminais de cada lado (a tríade), receptores DHPR no túbulo e calsequestrina (CASQ1) nas
 * cisternas. A cada potencial de ação os túbulos e a manga acendem; DHPR e CASQ1 crescem e brilham em magenta
 * onde o nitrato os aumentou (fibra rápida do camundongo).
 */

const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const Q = new THREE.Quaternion();
const NEUTRAL = new THREE.Color('#E2E8F0');
const MAGENTA = new THREE.Color(COL.nitrate);
const TUBULE = new THREE.Color(COL.tubule);
const CISTERNA = new THREE.Color(COL.cisterna);
const FLASH = new THREE.Color('#9BE4FF');
const scratch = new THREE.Color();

const ANGLES = Array.from({ length: 6 }, (_, k) => (k * Math.PI) / 3);
const SIDES = [1, -1] as const;
const GAPS = [-1, 1] as const;
const N_REC = 12 + 24;
const CIST_R = SARC.ringR + 0.03;
/** Potenciais de ação por segundo (o mesmo trem de apPulse). */
const AP_HZ = 2.4;

/** Um ponto do brilho magenta (DHPR/CASQ1 aumentados). */
const writeGlow = (cloud: Cloud, n: number, x: number, y: number, z: number, s: number): void => {
    cloud.pos[n * 3] = x;
    cloud.pos[n * 3 + 1] = y;
    cloud.pos[n * 3 + 2] = z;
    cloud.scale[n] = s;
};

interface Props { spec: UnitSpec; clockRef: ClockRef }

export const Membranes = ({ spec, clockRef }: Props) => {
    const sleeve = useRef<THREE.Mesh>(null);
    const tubes = useRef<(THREE.Mesh | null)[]>([]);
    const cist = useRef<(THREE.Mesh | null)[]>([]);
    const dhpr = useRef<THREE.InstancedMesh>(null);
    const glowPts = useRef<THREE.Points>(null);
    const casq = useRef<THREE.InstancedMesh>(null);
    const glow = usePointCloud(N_REC, COL.nitrate, 0.34, 0.9);

    const kit = useMemo(() => ({
        sleeveM: makeSleeveMaterial(),
        tubeG: new THREE.TorusGeometry(SARC.ringR, 0.03, 10, 48).rotateY(Math.PI / 2),
        tubeM: new THREE.MeshStandardMaterial({ color: COL.tubule, roughness: 0.25, metalness: 0.2, emissive: COL.tubule, emissiveIntensity: 0.25 }),
        cistG: new THREE.TorusGeometry(SARC.ringR + 0.03, 0.062, 12, 48).rotateY(Math.PI / 2),
        cistM: new THREE.MeshStandardMaterial({ color: COL.cisterna, roughness: 0.3, metalness: 0.15, transparent: true, opacity: 0.7, emissive: COL.cisterna, emissiveIntensity: 0.2 }),
        dhprG: new THREE.SphereGeometry(0.05, 12, 9),
        casqG: new THREE.SphereGeometry(0.038, 10, 8),
        dhprM: new THREE.MeshStandardMaterial({ color: '#E2E8F0', roughness: 0.3 }),
        casqM: new THREE.MeshStandardMaterial({ color: '#E2E8F0', roughness: 0.3 }),
    }), []);
    useEffect(() => () => Object.values(kit).forEach(o => o.dispose()), [kit]);

    useFrame(state => {
        const c = clockRef.current;
        if (unitIdle(c, spec, state.camera.position.x)) return;
        const sig = unitSignals(c, spec);
        const dim = unitDim(c, spec, sig.fatigue);
        const h = halfLen(sig.act);
        const boost = Math.min(Math.max((sig.amp - 1) / 0.75, 0), 1);
        const time = state.clock.elapsedTime;
        const pulse = apPulse(time, sig.act);
        const tri = h - SARC.tubuleOffset;

        if (sleeve.current) sleeve.current.scale.x = 2 * h - 0.06;
        const u = kit.sleeveM.uniforms;
        setU(u.uLen, 2 * h - 0.06);
        setU(u.uOpacity, 0.55 * dim);
        setU(u.uPulse, pulse * dim);
        setU(u.uTime, time);
        setU(u.uTri, tri);
        setU(u.uPhase, (time * AP_HZ) % 1);
        setU(u.uRelease, Math.min(sig.act * 3, 1) * (0.45 + 0.4 * sig.amp) * 0.55 * dim);
        scratch.copy(TUBULE).lerp(FLASH, pulse * 0.8).multiplyScalar(dim);
        kit.tubeM.color.copy(scratch);
        kit.tubeM.emissive.copy(scratch);
        setGlow(kit.tubeM, 0.25 + 1.4 * pulse);
        kit.cistM.color.copy(CISTERNA).multiplyScalar(dim);
        kit.cistM.emissive.copy(CISTERNA).lerp(FLASH, pulse * 0.6);
        setGlow(kit.cistM, 0.2 + 0.9 * pulse);
        setOpacity(kit.cistM, 0.7 * (0.4 + 0.6 * dim));

        scratch.copy(NEUTRAL).lerp(MAGENTA, boost).multiplyScalar(dim);
        kit.dhprM.color.copy(scratch);
        kit.casqM.color.copy(scratch);
        kit.dhprM.emissive.copy(MAGENTA).multiplyScalar(boost * 0.9 * dim);
        kit.casqM.emissive.copy(kit.dhprM.emissive);

        for (let si = 0; si < 2; si++) {
            const tx = SIDES[si] * tri;
            const t = tubes.current[si];
            if (t) t.position.x = tx;
            for (let gi = 0; gi < 2; gi++) {
                const cm = cist.current[si * 2 + gi];
                if (cm) cm.position.x = tx + GAPS[gi] * SARC.cisternaGap;
            }
        }

        const dm = dhpr.current;
        const cq = casq.current;
        if (!dm || !cq) return;
        const grow = 1 + 0.65 * boost;
        // brilho magenta só existe onde o nitrato aumentou DHPR/CASQ1: fora disso a nuvem nem desenha
        const glowOn = boost > 0.01;
        if (glowPts.current) glowPts.current.visible = glowOn;
        let n = 0;
        for (let si = 0; si < 2; si++) {
            const tx = SIDES[si] * tri;
            for (let k = 0; k < 6; k++) {
                const an = ANGLES[k] + 0.26;
                const y = SARC.ringR * Math.cos(an), z = SARC.ringR * Math.sin(an);
                dm.setMatrixAt(si * 6 + k, M.compose(P.set(tx, y, z), Q, S.setScalar(grow)));
                if (glowOn) writeGlow(glow.cloud, n, tx, y, z, boost * (0.6 + 0.4 * pulse + 0.15 * Math.sin(time * 3 + n)));
                n++;
                for (let gi = 0; gi < 2; gi++) {
                    const ca = ANGLES[k] + 0.78 + gi * 0.5;
                    const cx = tx + GAPS[gi] * SARC.cisternaGap;
                    const cy = CIST_R * Math.cos(ca), cz = CIST_R * Math.sin(ca);
                    cq.setMatrixAt((si * 2 + gi) * 6 + k, M.compose(P.set(cx, cy, cz), Q, S.setScalar(grow)));
                    if (glowOn) writeGlow(glow.cloud, n, cx, cy, cz, boost * (0.6 + 0.4 * pulse + 0.15 * Math.sin(time * 3 + n)));
                    n++;
                }
            }
        }
        dm.instanceMatrix.needsUpdate = true;
        cq.instanceMatrix.needsUpdate = true;
        if (glowOn) glow.flush(state, dim);
    });

    const bindT = useStructureBind('tubuloT');
    const bindRs = useStructureBind('rs', true);
    const bindDhpr = useStructureBind('dhpr');
    const bindCasq = useStructureBind('casq1');

    return (
        <>
            <mesh ref={sleeve} geometry={SLEEVE_GEO} material={kit.sleeveM} raycast={noRaycast} renderOrder={2} />
            {SIDES.map((s, i) => (
                <mesh key={`t${s}`} ref={el => { tubes.current[i] = el; }} geometry={kit.tubeG} material={kit.tubeM} {...bindT} raycast={PICK.tubule} />
            ))}
            {[0, 1, 2, 3].map(i => (
                <mesh key={`c${i}`} ref={el => { cist.current[i] = el; }} geometry={kit.cistG} material={kit.cistM} {...bindRs} raycast={PICK.cisterna} />
            ))}
            <instancedMesh ref={dhpr} args={[kit.dhprG, kit.dhprM, 12]} frustumCulled={false} {...bindDhpr} raycast={PICK.dhpr} />
            <instancedMesh ref={casq} args={[kit.casqG, kit.casqM, 24]} frustumCulled={false} {...bindCasq} raycast={PICK.casq} />
            <points ref={glowPts} visible={false} geometry={glow.geometry} material={glow.material} frustumCulled={false} raycast={noRaycast} renderOrder={3} />
        </>
    );
};
