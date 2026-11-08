import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ClockRef } from './clock';
import { COL, condColor } from './colors';
import { GEO } from './geoms';
import { HEADS, stroke } from './heads';
import { signals } from './kinetics';
import { SARC, THICK_SITES, halfLen, type UnitSpec } from './layout';
import { baseColor, paint, setGlow, slowTint, unitDim, unitIdle } from './look';
import { noRaycast } from './points';
import { useStructureBind } from './selection';

/*
 * Miolo do sarcômero: 7 filamentos grossos (miosina) com 294 cabeças que ciclam (ataque, golpe de força,
 * soltura), a linha M com as pontes entre filamentos e 14 molas de titina que esticam e relaxam com o
 * encurtamento. Tudo instanciado. A velocidade do ciclo vem da cinética (mais lenta com nitrato, mesma força).
 */

const UP = new THREE.Vector3(0, 1, 0);
const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const D = new THREE.Vector3();
const WHITE = baseColor('#ffffff');
const MLINE = baseColor(COL.mline);
const TITIN = baseColor(COL.titin);
const REST = new THREE.Color('#A9B3CB');
const HOT = new THREE.Color('#ffffff');
const scratch = new THREE.Color();

/** Pontes da linha M: do filamento central a cada vizinho e entre vizinhos do anel. */
const BRIDGES: readonly (readonly [number, number, number, number])[] = (() => {
    const out: [number, number, number, number][] = [];
    for (let i = 1; i < THICK_SITES.length; i++) {
        out.push([THICK_SITES[0][0], THICK_SITES[0][1], THICK_SITES[i][0], THICK_SITES[i][1]]);
        const j = i === THICK_SITES.length - 1 ? 1 : i + 1;
        out.push([THICK_SITES[i][0], THICK_SITES[i][1], THICK_SITES[j][0], THICK_SITES[j][1]]);
    }
    return out;
})();

interface Props { spec: UnitSpec; clockRef: ClockRef }

export const Filaments = ({ spec, clockRef }: Props) => {
    const thick = useRef<THREE.InstancedMesh>(null);
    const heads = useRef<THREE.InstancedMesh>(null);
    const bridges = useRef<THREE.InstancedMesh>(null);
    const titin = useRef<THREE.InstancedMesh>(null);
    const cycleClock = useRef(0);
    const accent = useMemo(() => new THREE.Color(condColor(spec.cond)), [spec.cond]);

    const kit = useMemo(() => ({
        thickM: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.28, metalness: 0.15 }),
        headM: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.3, metalness: 0.1, emissive: accent, emissiveIntensity: 0.1 }),
        bridgeM: new THREE.MeshStandardMaterial({ color: COL.mline, roughness: 0.6 }),
        titinM: new THREE.MeshStandardMaterial({ color: COL.titin, roughness: 0.4, emissive: COL.titin, emissiveIntensity: 0.12 }),
    }), [accent]);
    useEffect(() => () => Object.values(kit).forEach(o => o.dispose()), [kit]);

    useLayoutEffect(() => {
        const m = thick.current;
        const b = bridges.current;
        const h = heads.current;
        if (!m || !b || !h) return;
        THICK_SITES.forEach(([y, z], i) => m.setMatrixAt(i, M.makeTranslation(0, y, z)));
        m.instanceMatrix.needsUpdate = true;
        BRIDGES.forEach(([y0, z0, y1, z1], i) => {
            const len = Math.hypot(y1 - y0, z1 - z0);
            D.set(0, y1 - y0, z1 - z0).normalize();
            Q.setFromUnitVectors(UP, D);
            b.setMatrixAt(i, M.compose(P.set(0, (y0 + y1) / 2, (z0 + z1) / 2), Q, S.set(1, len, 1)));
        });
        b.instanceMatrix.needsUpdate = true;
        HEADS.forEach((_, i) => h.setColorAt(i, REST));
    }, []);

    useFrame((state, dt) => {
        const c = clockRef.current;
        if (unitIdle(c, spec, state.camera.position.x)) return;
        const sig = signals(c.step, spec.cond, spec.fiber, c.t);
        const dim = unitDim(c, spec, sig.fatigue);
        const tint = slowTint(c, spec);
        const h = halfLen(sig.act);
        cycleClock.current += dt * 0.85 * sig.cycle;

        paint(kit.thickM, WHITE, dim, tint);
        paint(kit.headM, WHITE, dim, tint);
        paint(kit.bridgeM, MLINE, dim, tint);
        paint(kit.titinM, TITIN, dim, tint);
        setGlow(kit.headM, (0.1 + 0.55 * sig.act) * dim);

        const hm = heads.current;
        if (hm) {
            for (let i = 0; i < HEADS.length; i++) {
                const hd = HEADS[i];
                const on = hd.gate < sig.act;
                const p = (hd.phase + cycleClock.current) % 1;
                const alpha = on ? stroke(p) : 0;
                const ca = Math.cos(alpha);
                D.set(-hd.sgn * Math.sin(alpha), ca * hd.cos, ca * hd.sin);
                Q.setFromUnitVectors(UP, D);
                P.set(hd.x, hd.cy + SARC.thickR * hd.cos, hd.cz + SARC.thickR * hd.sin);
                const s = on ? 1 : 0.72;
                hm.setMatrixAt(i, M.compose(P, Q, S.set(s, s, s)));
                // ligada (golpe de força) = clara e com o tom da condição; solta = cinza-azulado
                const grip = on ? (p < 0.6 ? 1 : 0.25) : 0;
                scratch.copy(REST).lerp(HOT, grip * 0.75).lerp(accent, grip * 0.3);
                hm.setColorAt(i, scratch);
            }
            hm.instanceMatrix.needsUpdate = true;
            if (hm.instanceColor) hm.instanceColor.needsUpdate = true;
        }

        const tm = titin.current;
        if (tm) {
            const len = Math.max(h - SARC.thickHalf, 0.05);
            THICK_SITES.forEach(([y, z], i) => {
                const a = i * 1.1;
                for (let sd = 0; sd < 2; sd++) {
                    const sgn = sd === 0 ? 1 : -1;
                    Q.setFromAxisAngle(UP, sd === 0 ? 0 : Math.PI);
                    P.set(sgn * SARC.thickHalf, y + 0.075 * Math.cos(a), z + 0.075 * Math.sin(a));
                    tm.setMatrixAt(i * 2 + sd, M.compose(P, Q, S.set(len, 1, 1)));
                }
            });
            tm.instanceMatrix.needsUpdate = true;
        }
    });

    const bindMyo = useStructureBind('miosina');
    return (
        <>
            <instancedMesh ref={thick} args={[GEO.thick, kit.thickM, THICK_SITES.length]} frustumCulled={false} {...bindMyo} />
            <instancedMesh ref={heads} args={[GEO.head, kit.headM, HEADS.length]} frustumCulled={false} {...bindMyo} />
            <instancedMesh ref={bridges} args={[GEO.bridge, kit.bridgeM, BRIDGES.length]} frustumCulled={false} raycast={noRaycast} />
            <instancedMesh ref={titin} args={[GEO.titin, kit.titinM, THICK_SITES.length * 2]} frustumCulled={false} raycast={noRaycast} />
            <mesh scale={[0.4, 0.92, 0.92]} raycast={noRaycast} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[SARC.myoR + 0.05, SARC.myoR + 0.05, 0.05, 28]} />
                <meshBasicMaterial color={COL.mline} transparent opacity={0.35} depthWrite={false} />
            </mesh>
        </>
    );
};
