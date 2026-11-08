import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { BACTERIA_U } from './anatomy';
import { HALO_PLANE, SPHERE_LO, haloMaterial, putHalo } from './materials';
import { srand } from './rand';
import type { VnStateRef } from './state';
import { tonguePoint } from './tongueSurface';

/*
 * Bactérias redutoras do dorso posterior da língua (violeta): cocos e bastonetes. A clorexidina as
 * apaga uma a uma (limiares sorteados), não todas ao mesmo tempo.
 */

const COCCI = 38;
const RODS = 22;
const TOTAL = COCCI + RODS;
const P = new THREE.Vector3();
const Q = new THREE.Quaternion();
const S = new THREE.Vector3();
const M = new THREE.Matrix4();

interface Seed { u: number; phi: number; m: number; r: number; ph: number; q: THREE.Quaternion }

export const Bacteria = ({ stateRef }: { stateRef: VnStateRef }) => {
    const cocci = useRef<THREE.InstancedMesh>(null);
    const rods = useRef<THREE.InstancedMesh>(null);
    const halos = useRef<THREE.InstancedMesh>(null);
    const seeds = useMemo<Seed[]>(() => {
        const r = srand(7);
        return Array.from({ length: TOTAL }, () => ({
            u: BACTERIA_U[0] + r() * (BACTERIA_U[1] - BACTERIA_U[0]),
            phi: (r() - 0.5) * 2.0,
            m: 1.02 + r() * 0.1,
            r: r(),
            ph: r() * 6.28,
            q: new THREE.Quaternion().setFromEuler(new THREE.Euler(r() * 3.14, r() * 3.14, r() * 3.14)),
        }));
    }, []);
    const geos = useMemo(() => ({ rod: new THREE.CapsuleGeometry(0.04, 0.13, 3, 8) }), []);
    const mats = useMemo(() => ({
        body: new THREE.MeshStandardMaterial({ color: C.bacteria, emissive: C.bacteria, emissiveIntensity: 0.65, roughness: 0.4 }),
        halo: haloMaterial(C.bacteria, 0.17),
    }), []);
    useEffect(() => () => { geos.rod.dispose(); mats.body.dispose(); mats.halo.dispose(); }, [geos, mats]);

    useFrame(({ clock, camera }) => {
        const a = cocci.current;
        const b = rods.current;
        const h = halos.current;
        if (!a || !b || !h) return;
        const c = stateRef.current.f.chx;
        const t = clock.elapsedTime;
        for (let i = 0; i < TOTAL; i++) {
            const sd = seeds[i];
            const alive = Math.min(Math.max(((1 - c) - 0.8 * sd.r) * 6, 0), 1);
            tonguePoint(sd.u, sd.phi, sd.m, P);
            P.y += Math.sin(t * 1.7 + sd.ph) * 0.012;
            P.x += Math.cos(t * 1.3 + sd.ph) * 0.012;
            if (i < COCCI) {
                a.setMatrixAt(i, M.compose(P, Q.identity(), S.setScalar(0.078 * alive)));
            } else {
                b.setMatrixAt(i - COCCI, M.compose(P, Q.copy(sd.q), S.setScalar(alive)));
            }
            putHalo(h, i, P, camera.quaternion, 0.36 * alive);
        }
        a.instanceMatrix.needsUpdate = true;
        b.instanceMatrix.needsUpdate = true;
        h.instanceMatrix.needsUpdate = true;
    });

    return (
        <group>
            <instancedMesh ref={cocci} args={[SPHERE_LO, mats.body, COCCI]} frustumCulled={false} />
            <instancedMesh ref={rods} args={[geos.rod, mats.body, RODS]} frustumCulled={false} />
            <instancedMesh ref={halos} args={[HALO_PLANE, mats.halo, TOTAL]} frustumCulled={false} renderOrder={12} />
        </group>
    );
};
