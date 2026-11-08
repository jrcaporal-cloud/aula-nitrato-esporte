import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { HALO_PLANE, SPHERE_LO, atomMaterial, haloMaterial, put, putHalo } from './materials';
import { srand } from './rand';
import type { VnStateRef } from './state';
import { NITRATE, STREAMS, TOTAL_IONS, type IonSeed } from './streams';
import { ringTexture } from './textures';

/*
 * Íons em instâncias: nitrato = N central (grená) + 3 O (magenta, triângulo); nitrito = N (âmbar
 * escuro) + 2 O (âmbar, em V). Cada íon gira devagar, deixa um rastro de dois pontos de luz e tem um
 * halo aditivo (brilho sem pós-processamento). Quando o nitrato vira nitrito (na língua) o íon dá um
 * pulso de tamanho e solta um anel âmbar que se abre: a conversão vira um evento visível.
 */

/** Tamanho-base do íon no mundo (raio do N = 0,40 × isto). */
const K = 0.26;
const NITRATE_O: readonly (readonly [number, number])[] = [[0, 0.78], [0.675, -0.39], [-0.675, -0.39]];
const NITRITE_O: readonly (readonly [number, number])[] = [[0.658, -0.419], [-0.658, -0.419]];
/** Rastro: dois pontos de luz atrás do íon (o do meio é interpolado: só uma posição extra por íon). */
const TRAIL_BACK = 0.8;
const TRAIL_SIZE: readonly number[] = [2.5, 1.6];
const TRAIL_GLOW: readonly number[] = [0.6, 0.28];
const RINGS = 24;
const RING_WINDOW = 0.05;

const fade = (s: number) => Math.min(s / 0.07, 1, (1 - s) / 0.09);

const makeSeeds = (): IonSeed[][] => STREAMS.map((def, si) => {
    const r = srand(1000 + si * 131);
    return Array.from({ length: def.count }, (_, i) => ({
        i, r: r(), u: r(), ph: r(), sp: 0.85 + r() * 0.3, a: r() * 2 - 1, b: r() * 2 - 1,
        axis: new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize(),
        spin: 0.5 + r() * 1.2,
    }));
});

const P = new THREE.Vector3();
const P2 = new THREE.Vector3();
const T = new THREE.Vector3();
const Q = new THREE.Quaternion();
const COL = new THREE.Color();

export const Ions = ({ stateRef }: { stateRef: VnStateRef }) => {
    const seeds = useMemo(() => makeSeeds(), []);
    const nitN = useRef<THREE.InstancedMesh>(null);
    const nitO = useRef<THREE.InstancedMesh>(null);
    const itN = useRef<THREE.InstancedMesh>(null);
    const itO = useRef<THREE.InstancedMesh>(null);
    const haloA = useRef<THREE.InstancedMesh>(null);
    const haloB = useRef<THREE.InstancedMesh>(null);
    const trailA = useRef<THREE.InstancedMesh>(null);
    const trailB = useRef<THREE.InstancedMesh>(null);
    const rings = useRef<THREE.InstancedMesh>(null);
    const mats = useMemo(() => ({
        nitN: atomMaterial(C.nitrateDeep, 1.0),
        nitO: atomMaterial(C.nitrate, 1.0),
        itN: atomMaterial('#B7791F', 1.0),
        itO: atomMaterial(C.nitrite, 1.0),
        haloA: haloMaterial(C.nitrate, 0.3),
        haloB: haloMaterial(C.nitrite, 0.26),
        trailA: haloMaterial(C.nitrate, 0.34),
        trailB: haloMaterial(C.nitrite, 0.3),
        ring: new THREE.MeshBasicMaterial({ map: ringTexture(), color: C.nitriteSoft, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
    }), []);
    useEffect(() => () => Object.values(mats).forEach(m => m.dispose()), [mats]);

    // o brilho de cada ponto do rastro é fixo pela posição dele (cada íon escreve 3 pontos seguidos)
    useEffect(() => {
        for (const m of [trailA.current, trailB.current]) {
            if (!m) continue;
            for (let i = 0; i < TOTAL_IONS * 2; i++) m.setColorAt(i, COL.setScalar(TRAIL_GLOW[i % 2]));
            if (m.instanceColor) m.instanceColor.needsUpdate = true;
        }
        const rg = rings.current;
        if (rg) for (let i = 0; i < RINGS; i++) rg.setColorAt(i, COL.setScalar(1));
    }, []);

    useFrame(({ clock, camera }) => {
        const [aN, aO, bN, bO, hA, hB, tA, tB, rg] = [nitN, nitO, itN, itO, haloA, haloB, trailA, trailB, rings].map(r => r.current);
        if (!aN || !aO || !bN || !bO || !hA || !hB || !tA || !tB || !rg) return;
        const f = stateRef.current.f;
        const t = clock.elapsedTime;
        let cAN = 0, cAO = 0, cBN = 0, cBO = 0, cHA = 0, cHB = 0, cTA = 0, cTB = 0, cR = 0;
        for (let si = 0; si < STREAMS.length; si++) {
            const def = STREAMS[si];
            const want = Math.min(Math.max(f.w[def.weight] * def.level(f), 0), 1) * def.count;
            const n = Math.ceil(want);
            for (let i = 0; i < n; i++) {
                const sd = seeds[si][i];
                const s = def.resident ? 0.5 : (t / def.period * sd.sp + sd.ph) % 1;
                def.place(sd, s, t, P);
                const sp = def.species(f, sd, s);
                const pulse = def.convertAt === undefined ? 1 : 1 + 0.7 * Math.exp(-(((s - def.convertAt) / 0.025) ** 2));
                const fd = def.resident ? 1 : fade(s);
                const k = K * pulse * Math.min(want - i, 1) * fd;
                if (k <= 1e-3) continue;
                Q.setFromAxisAngle(sd.axis, sd.spin * t + sd.ph * 6.28);
                const nitrate = sp === NITRATE;
                if (nitrate) {
                    put(aN, cAN++, P, 0.4 * k);
                    for (const [ox, oy] of NITRATE_O) put(aO, cAO++, T.set(ox * k, oy * k, 0).applyQuaternion(Q).add(P), 0.3 * k);
                    putHalo(hA, cHA++, P, camera.quaternion, k * 3.8);
                } else {
                    put(bN, cBN++, P, 0.4 * k);
                    for (const [ox, oy] of NITRITE_O) put(bO, cBO++, T.set(ox * k, oy * k, 0).applyQuaternion(Q).add(P), 0.3 * k);
                    putHalo(hB, cHB++, P, camera.quaternion, k * 3.6);
                    // o anel da conversão: abre e some logo depois de o íon virar nitrito
                    if (def.convertAt !== undefined && cR < RINGS) {
                        const kk = (s - def.convertAt) / RING_WINDOW;
                        if (kk > 0 && kk < 1) {
                            putHalo(rg, cR, P, camera.quaternion, 0.35 + 1.3 * kk);
                            rg.setColorAt(cR++, COL.setScalar(1.2 * (1 - kk) ** 1.4));
                        }
                    }
                }
                if (!def.resident) {
                    const tm = nitrate ? tA : tB;
                    const sb = s - TRAIL_BACK / def.span;
                    const kb = sb < 0 ? 0 : fade(sb);
                    if (sb >= 0) def.place(sd, sb, t, P2);
                    else P2.copy(P);
                    putHalo(tm, nitrate ? cTA++ : cTB++, T.copy(P).lerp(P2, 0.45), camera.quaternion, k * TRAIL_SIZE[0] * kb);
                    putHalo(tm, nitrate ? cTA++ : cTB++, P2, camera.quaternion, k * TRAIL_SIZE[1] * kb);
                }
            }
        }
        const counts: [THREE.InstancedMesh, number][] = [[aN, cAN], [aO, cAO], [bN, cBN], [bO, cBO], [hA, cHA], [hB, cHB], [tA, cTA], [tB, cTB], [rg, cR]];
        for (const [m, c] of counts) { m.count = c; m.instanceMatrix.needsUpdate = true; }
        if (rg.instanceColor) rg.instanceColor.needsUpdate = true;
    });

    return (
        <group>
            <instancedMesh ref={nitN} args={[SPHERE_LO, mats.nitN, TOTAL_IONS]} frustumCulled={false} />
            <instancedMesh ref={nitO} args={[SPHERE_LO, mats.nitO, TOTAL_IONS * 3]} frustumCulled={false} />
            <instancedMesh ref={itN} args={[SPHERE_LO, mats.itN, TOTAL_IONS]} frustumCulled={false} />
            <instancedMesh ref={itO} args={[SPHERE_LO, mats.itO, TOTAL_IONS * 2]} frustumCulled={false} />
            <instancedMesh ref={haloA} args={[HALO_PLANE, mats.haloA, TOTAL_IONS]} frustumCulled={false} renderOrder={10} />
            <instancedMesh ref={haloB} args={[HALO_PLANE, mats.haloB, TOTAL_IONS]} frustumCulled={false} renderOrder={10} />
            <instancedMesh ref={trailA} args={[HALO_PLANE, mats.trailA, TOTAL_IONS * 2]} frustumCulled={false} renderOrder={9} />
            <instancedMesh ref={trailB} args={[HALO_PLANE, mats.trailB, TOTAL_IONS * 2]} frustumCulled={false} renderOrder={9} />
            <instancedMesh ref={rings} args={[HALO_PLANE, mats.ring, RINGS]} frustumCulled={false} renderOrder={13} />
        </group>
    );
};
