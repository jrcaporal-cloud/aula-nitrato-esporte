import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { rng } from '../shared/math';
import type { ClockRef } from './clock';
import { COL } from './colors';
import { signals } from './kinetics';
import { SARC, THICK_SITES, THIN_SITES, halfLen, type UnitSpec } from './layout';
import { accentOf, baseColor, paint, setGlow, slowTint, unitDim } from './look';
import { noRaycast } from './points';
import { useStructureBind } from './selection';

/*
 * Filamentos de um sarcômero: 7 grossos (miosina), 24 finos (actina, 12 por meio-sarcômero), duas linhas Z e
 * 294 cabeças de miosina, tudo instanciado. As cabeças ciclam (ataque, golpe de força, soltura) só quando
 * ativadas; a velocidade do ciclo vem da cinética (menor no nitrato, mesma força).
 */

interface HeadDef { cy: number; cz: number; cos: number; sin: number; x: number; sgn: 1 | -1; phase: number; gate: number }

const HEADS: readonly HeadDef[] = (() => {
    const rnd = rng(11);
    const out: HeadDef[] = [];
    THICK_SITES.forEach(([cy, cz], ci) => {
        for (const sgn of [1, -1] as const) {
            for (let k = 0; k < 7; k++) {
                for (let j = 0; j < 3; j++) {
                    const th = j * 2.094 + k * 0.7 + ci;
                    out.push({ cy, cz, cos: Math.cos(th), sin: Math.sin(th), x: sgn * (SARC.bare + 0.06 + k * 0.095), sgn, phase: rnd(), gate: rnd() });
                }
            }
        }
    });
    return out;
})();

const UP = new THREE.Vector3(0, 1, 0);
const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const D = new THREE.Vector3();

/** Ângulo da cabeça (rad) no ciclo p 0..1: golpe de força até 0,6, depois solta e rearma. */
const stroke = (p: number): number => (p < 0.6 ? -0.5 + (1.2 * p) / 0.6 : 0.7 - (1.2 * (p - 0.6)) / 0.4);

const BASE = { thick: baseColor(COL.thick), thin: baseColor(COL.thin), head: baseColor(COL.head), z: baseColor(COL.zdisc) };

interface Props { spec: UnitSpec; clockRef: ClockRef }

export const Filaments = ({ spec, clockRef }: Props) => {
    const thick = useRef<THREE.InstancedMesh>(null);
    const thin = useRef<THREE.InstancedMesh>(null);
    const heads = useRef<THREE.InstancedMesh>(null);
    const zL = useRef<THREE.Mesh>(null);
    const zR = useRef<THREE.Mesh>(null);
    const cycleClock = useRef(0);

    const kit = useMemo(() => {
        const head = new THREE.CapsuleGeometry(0.016, 0.1, 3, 6);
        head.translate(0, 0.066, 0);
        const std = (color: string) => new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.1 });
        return {
            thickG: new THREE.CylinderGeometry(SARC.thickR, SARC.thickR, SARC.thickHalf * 2, 10).rotateZ(Math.PI / 2),
            thinG: new THREE.CylinderGeometry(SARC.thinR, SARC.thinR, SARC.thinLen, 8).rotateZ(Math.PI / 2),
            zG: new THREE.CylinderGeometry(SARC.myoR + 0.05, SARC.myoR + 0.05, 0.05, 28).rotateZ(Math.PI / 2),
            headG: head,
            thickM: std(COL.thick), thinM: std(COL.thin), zM: std(COL.zdisc),
            headM: new THREE.MeshStandardMaterial({ color: COL.head, roughness: 0.4, emissive: accentOf(spec), emissiveIntensity: 0.1 }),
        };
    }, [spec]);
    useEffect(() => () => Object.values(kit).forEach(o => o.dispose()), [kit]);

    useLayoutEffect(() => {
        const m = thick.current;
        if (!m) return;
        THICK_SITES.forEach(([y, z], i) => m.setMatrixAt(i, M.makeTranslation(0, y, z)));
        m.instanceMatrix.needsUpdate = true;
    }, []);

    useFrame((_, dt) => {
        const c = clockRef.current;
        const sig = signals(c.step, spec.cond, spec.fiber, c.t);
        const dim = unitDim(c, spec, sig.fatigue);
        const tint = slowTint(c, spec);
        const h = halfLen(sig.act);
        cycleClock.current += dt * 0.85 * sig.cycle;

        paint(kit.thickM, BASE.thick, dim, tint);
        paint(kit.thinM, BASE.thin, dim, tint);
        paint(kit.zM, BASE.z, dim, tint);
        paint(kit.headM, BASE.head, dim, tint);
        setGlow(kit.headM, (0.12 + 0.9 * sig.act) * dim);

        if (zL.current) zL.current.position.x = -h;
        if (zR.current) zR.current.position.x = h;

        const tm = thin.current;
        if (tm) {
            THIN_SITES.forEach(([y, z], i) => {
                tm.setMatrixAt(i, M.makeTranslation(h - SARC.thinLen / 2, y, z));
                tm.setMatrixAt(i + THIN_SITES.length, M.makeTranslation(-(h - SARC.thinLen / 2), y, z));
            });
            tm.instanceMatrix.needsUpdate = true;
        }

        const hm = heads.current;
        if (!hm) return;
        for (let i = 0; i < HEADS.length; i++) {
            const hd = HEADS[i];
            const on = hd.gate < sig.act;
            const alpha = on ? stroke((hd.phase + cycleClock.current) % 1) : 0;
            const ca = Math.cos(alpha);
            D.set(-hd.sgn * Math.sin(alpha), ca * hd.cos, ca * hd.sin);
            Q.setFromUnitVectors(UP, D);
            P.set(hd.x, hd.cy + SARC.thickR * hd.cos, hd.cz + SARC.thickR * hd.sin);
            const s = on ? 1 : 0.7;
            hm.setMatrixAt(i, M.compose(P, Q, S.set(s, s, s)));
        }
        hm.instanceMatrix.needsUpdate = true;
    });

    const bindMyo = useStructureBind('miosina');
    const bindAct = useStructureBind('actina');
    const bindZ = useStructureBind('linhaZ');

    return (
        <>
            <instancedMesh ref={thick} args={[kit.thickG, kit.thickM, THICK_SITES.length]} frustumCulled={false} {...bindMyo} />
            <instancedMesh ref={thin} args={[kit.thinG, kit.thinM, THIN_SITES.length * 2]} frustumCulled={false} {...bindAct} />
            <instancedMesh ref={heads} args={[kit.headG, kit.headM, HEADS.length]} frustumCulled={false} raycast={noRaycast} />
            <mesh ref={zL} geometry={kit.zG} material={kit.zM} {...bindZ} />
            <mesh ref={zR} geometry={kit.zG} material={kit.zM} {...bindZ} />
            <mesh geometry={kit.zG} scale={[0.4, 0.92, 0.92]} raycast={noRaycast}>
                <meshBasicMaterial color={COL.mline} transparent opacity={0.5} />
            </mesh>
        </>
    );
};
