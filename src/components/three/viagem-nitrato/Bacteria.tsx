import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { BACTERIA_U } from './anatomy';
import { matOf } from './fx';
import { HALO_PLANE, SPHERE_LO, haloMaterial, putHalo } from './materials';
import { srand } from './rand';
import type { VnStateRef } from './state';
import { blotchTexture } from './textures';
import { tonguePoint } from './tongueSurface';

/*
 * Biofilme do dorso posterior da língua (violeta): uma película brilhante com manchas, cocos, bastonetes
 * e diplococos que respiram. A clorexidina as apaga uma a uma: cada célula dá um clarão e some, e a
 * película esmaece com elas.
 */

const COCCI = 120;
const RODS = 64;
const TOTAL = COCCI + RODS;
const P = new THREE.Vector3();
const A = new THREE.Vector3();
const Q = new THREE.Quaternion();
const S = new THREE.Vector3();
const M = new THREE.Matrix4();
const COL = new THREE.Color();
const TONGUE_MID = new THREE.Vector3(-1.6, 9.6, 0);

interface Seed { x: number; y: number; z: number; nx: number; ny: number; nz: number; r: number; ph: number; q: THREE.Quaternion }

/** Película: grade sobre a superfície, com relevo suave. */
const filmGeometry = (): THREE.BufferGeometry => {
    const NU = 36;
    const NV = 20;
    const pos: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];
    for (let j = 0; j <= NV; j++) {
        for (let i = 0; i <= NU; i++) {
            const a = i / NU;
            const b = j / NV;
            const lump = 0.012 * Math.sin(a * 21) * Math.cos(b * 17) + 0.01 * Math.sin(a * 9 + b * 11);
            tonguePoint(BACTERIA_U[0] - 0.03 + a * (BACTERIA_U[1] - BACTERIA_U[0] + 0.06), -0.7 + b * 2.2, 1.045 + lump, P);
            pos.push(P.x, P.y, P.z);
            uv.push(a, b);
        }
    }
    for (let j = 0; j < NV; j++) {
        for (let i = 0; i < NU; i++) {
            const a = j * (NU + 1) + i;
            idx.push(a, a + NU + 1, a + 1, a + 1, a + NU + 1, a + NU + 2);
        }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
};

export const Bacteria = ({ stateRef }: { stateRef: VnStateRef }) => {
    const cocci = useRef<THREE.InstancedMesh>(null);
    const rods = useRef<THREE.InstancedMesh>(null);
    const halos = useRef<THREE.InstancedMesh>(null);
    const film = useRef<THREE.Mesh>(null);
    const tick = useRef(0);
    const lastC = useRef(0);
    const seeds = useMemo<Seed[]>(() => {
        const r = srand(7);
        return Array.from({ length: TOTAL }, () => {
            const u = BACTERIA_U[0] + r() * (BACTERIA_U[1] - BACTERIA_U[0]);
            const phi = -0.6 + r() * 1.9;
            tonguePoint(u, phi, 1.06 + r() * 0.05, P);
            tonguePoint(u, phi, 0, A);
            A.subVectors(P, A).normalize();
            return { x: P.x, y: P.y, z: P.z, nx: A.x, ny: A.y, nz: A.z, r: r(), ph: r() * 6.28, q: new THREE.Quaternion().setFromEuler(new THREE.Euler(r() * 3.14, r() * 3.14, r() * 3.14)) };
        });
    }, []);
    const parts = useMemo(() => {
        const blotch = blotchTexture();
        return {
            rod: new THREE.CapsuleGeometry(0.035, 0.14, 3, 8),
            film: filmGeometry(),
            body: new THREE.MeshStandardMaterial({ color: '#7656D8', emissive: C.bacteria, emissiveIntensity: 0.32, roughness: 0.35 }),
            halo: haloMaterial(C.bacteria, 0.09),
            filmMat: new THREE.MeshPhysicalMaterial({ color: '#7B5FD0', emissive: C.bacteria, emissiveIntensity: 0.4, roughness: 0.15, clearcoat: 1, transparent: true, opacity: 0.55, alphaMap: blotch, depthWrite: false }),
        };
    }, []);
    useEffect(() => () => { parts.rod.dispose(); parts.film.dispose(); parts.body.dispose(); parts.halo.dispose(); parts.filmMat.dispose(); }, [parts]);

    useFrame(({ clock, camera }) => {
        const a = cocci.current;
        const b = rods.current;
        const h = halos.current;
        if (!a || !b || !h) return;
        const c = stateRef.current.f.chx;
        const t = clock.elapsedTime;
        // de longe e sem bochecho mudando, a respiração das células não aparece: atualiza 1 quadro em 5
        tick.current += 1;
        const far = camera.position.distanceTo(TONGUE_MID) > 20 && Math.abs(c - lastC.current) < 1e-3;
        lastC.current = c;
        if (far && tick.current % 5 !== 0) return;
        const fm = matOf<THREE.MeshPhysicalMaterial>(film);
        if (fm) fm.opacity = 0.55 * Math.min(Math.max(1 - c * 1.15, 0), 1);
        for (let i = 0; i < TOTAL; i++) {
            const sd = seeds[i];
            const alive = Math.min(Math.max(((1 - c) - 0.8 * sd.r) * 6, 0), 1);
            const dying = 4 * alive * (1 - alive);
            const breathe = 1 + 0.14 * Math.sin(t * 2.4 + sd.ph);
            const lift = 0.012 * Math.sin(t * 1.7 + sd.ph);
            P.set(sd.x + sd.nx * lift, sd.y + sd.ny * lift, sd.z + sd.nz * lift);
            const pop = (1 + 0.7 * dying) * breathe * alive;
            if (i < COCCI) a.setMatrixAt(i, M.compose(P, Q.identity(), S.setScalar(0.07 * pop)));
            else b.setMatrixAt(i - COCCI, M.compose(P, Q.copy(sd.q), S.setScalar(pop)));
            putHalo(h, i, P, camera.quaternion, 0.3 * alive * (1 + 1.2 * dying));
            h.setColorAt(i, COL.setScalar(1 + 2.2 * dying));
        }
        a.instanceMatrix.needsUpdate = true;
        b.instanceMatrix.needsUpdate = true;
        h.instanceMatrix.needsUpdate = true;
        if (h.instanceColor) h.instanceColor.needsUpdate = true;
    });

    return (
        <group>
            <mesh ref={film} geometry={parts.film} material={parts.filmMat} renderOrder={3} />
            <instancedMesh ref={cocci} args={[SPHERE_LO, parts.body, COCCI]} frustumCulled={false} />
            <instancedMesh ref={rods} args={[parts.rod, parts.body, RODS]} frustumCulled={false} />
            <instancedMesh ref={halos} args={[HALO_PLANE, parts.halo, TOTAL]} frustumCulled={false} renderOrder={12} />
        </group>
    );
};
