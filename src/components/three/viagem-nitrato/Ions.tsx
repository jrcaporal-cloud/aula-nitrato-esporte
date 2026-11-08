import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { HALO_PLANE, SPHERE_LO, atomMaterial, haloMaterial, put, putHalo } from './materials';
import { srand } from './rand';
import type { VnStateRef } from './state';
import { NITRATE, STREAMS, TOTAL_IONS, type IonSeed } from './streams';

/*
 * Íons em instâncias: nitrato = N central (grená) + 3 O (magenta, triângulo); nitrito = N (âmbar
 * escuro) + 2 O (âmbar, em V). Cada íon gira devagar; um halo aditivo dá o brilho sem pós-processamento.
 */

/** Tamanho-base do íon no mundo (raio do N = 0,40 × isto). */
const K = 0.26;
const NITRATE_O: readonly (readonly [number, number])[] = [[0, 0.78], [0.675, -0.39], [-0.675, -0.39]];
const NITRITE_O: readonly (readonly [number, number])[] = [[0.658, -0.419], [-0.658, -0.419]];

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
const T = new THREE.Vector3();
const Q = new THREE.Quaternion();

export const Ions = ({ stateRef }: { stateRef: VnStateRef }) => {
    const seeds = useMemo(() => makeSeeds(), []);
    const nitN = useRef<THREE.InstancedMesh>(null);
    const nitO = useRef<THREE.InstancedMesh>(null);
    const itN = useRef<THREE.InstancedMesh>(null);
    const itO = useRef<THREE.InstancedMesh>(null);
    const haloA = useRef<THREE.InstancedMesh>(null);
    const haloB = useRef<THREE.InstancedMesh>(null);
    const mats = useMemo(() => ({
        nitN: atomMaterial(C.nitrateDeep, 1.0),
        nitO: atomMaterial(C.nitrate, 1.0),
        itN: atomMaterial('#B7791F', 1.0),
        itO: atomMaterial(C.nitrite, 1.0),
        haloA: haloMaterial(C.nitrate, 0.3),
        haloB: haloMaterial(C.nitrite, 0.26),
    }), []);
    useEffect(() => () => Object.values(mats).forEach(m => m.dispose()), [mats]);

    useFrame(({ clock, camera }) => {
        const [aN, aO, bN, bO, hA, hB] = [nitN, nitO, itN, itO, haloA, haloB].map(r => r.current);
        if (!aN || !aO || !bN || !bO || !hA || !hB) return;
        const f = stateRef.current.f;
        const t = clock.elapsedTime;
        let cAN = 0, cAO = 0, cBN = 0, cBO = 0, cHA = 0, cHB = 0;
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
                const k = K * pulse * Math.min(want - i, 1) * (def.resident ? 1 : fade(s));
                if (k <= 1e-3) continue;
                Q.setFromAxisAngle(sd.axis, sd.spin * t + sd.ph * 6.28);
                if (sp === NITRATE) {
                    put(aN, cAN++, P, 0.4 * k);
                    for (const [ox, oy] of NITRATE_O) put(aO, cAO++, T.set(ox * k, oy * k, 0).applyQuaternion(Q).add(P), 0.3 * k);
                    putHalo(hA, cHA++, P, camera.quaternion, k * 3.8);
                } else {
                    put(bN, cBN++, P, 0.4 * k);
                    for (const [ox, oy] of NITRITE_O) put(bO, cBO++, T.set(ox * k, oy * k, 0).applyQuaternion(Q).add(P), 0.3 * k);
                    putHalo(hB, cHB++, P, camera.quaternion, k * 3.6);
                }
            }
        }
        const counts: [THREE.InstancedMesh, number][] = [[aN, cAN], [aO, cAO], [bN, cBN], [bO, cBO], [hA, cHA], [hB, cHB]];
        for (const [m, c] of counts) { m.count = c; m.instanceMatrix.needsUpdate = true; }
    });

    return (
        <group>
            <instancedMesh ref={nitN} args={[SPHERE_LO, mats.nitN, TOTAL_IONS]} frustumCulled={false} />
            <instancedMesh ref={nitO} args={[SPHERE_LO, mats.nitO, TOTAL_IONS * 3]} frustumCulled={false} />
            <instancedMesh ref={itN} args={[SPHERE_LO, mats.itN, TOTAL_IONS]} frustumCulled={false} />
            <instancedMesh ref={itO} args={[SPHERE_LO, mats.itO, TOTAL_IONS * 2]} frustumCulled={false} />
            <instancedMesh ref={haloA} args={[HALO_PLANE, mats.haloA, TOTAL_IONS]} frustumCulled={false} renderOrder={10} />
            <instancedMesh ref={haloB} args={[HALO_PLANE, mats.haloB, TOTAL_IONS]} frustumCulled={false} renderOrder={10} />
        </group>
    );
};
