import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TONGUE, TONGUE_Z } from './anatomy';
import { damp, matOf } from './fx';
import { srand } from './rand';
import { useStructure } from './selection';
import type { VnStateRef } from './state';
import { bumpTexture } from './textures';
import { tongueOf, withTongueCrypts } from './tissue';
import { tonguePoint } from './tongueSurface';
import { tubeGeometry } from './tubes';

/*
 * Língua: corpo úmido com relevo, papilas filiformes (cones finos) e fungiformes (cúpulas rosadas) sobre
 * o dorso e o lado de frente. O biofilme bacteriano do dorso posterior fica em Bacteria.tsx.
 */

const FILIFORM = 340;
const FUNGIFORM = 46;
const P = new THREE.Vector3();
const A = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);
const BODY_COL = new THREE.Color('#8E5666');

/** Sorteia pontos da superfície e orienta cada instância pela normal (do eixo para fora). */
const scatter = (m: THREE.InstancedMesh, count: number, seed: number, size: readonly [number, number], lift: number, uRange: readonly [number, number]): void => {
    const r = srand(seed);
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const mx = new THREE.Matrix4();
    const n = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
        const u = uRange[0] + r() * (uRange[1] - uRange[0]);
        const phi = -1.0 + r() * 2.6;
        tonguePoint(u, phi, 1 + lift, P);
        tonguePoint(u, phi, 0, A);
        q.setFromUnitVectors(UP, n.subVectors(P, A).normalize());
        m.setMatrixAt(i, mx.compose(P, q, s.setScalar(size[0] + r() * (size[1] - size[0]))));
    }
    m.instanceMatrix.needsUpdate = true;
};

export const Tongue = ({ stateRef }: { stateRef: VnStateRef }) => {
    const { bind, lit } = useStructure('lingua');
    const litRef = useRef(lit);
    useEffect(() => { litRef.current = lit; }, [lit]);
    const dim = useRef(0.5);
    const fil = useRef<THREE.InstancedMesh>(null);
    const fun = useRef<THREE.InstancedMesh>(null);
    const bodyRef = useRef<THREE.Mesh>(null);
    const parts = useMemo(() => {
        const tex = bumpTexture('tongue').clone();
        tex.repeat.set(7, 2);
        tex.needsUpdate = true;
        const bodyMat = new THREE.MeshPhysicalMaterial({ color: BODY_COL, emissive: '#6B3A48', emissiveIntensity: 0.2, roughness: 0.5, clearcoat: 0.6, clearcoatRoughness: 0.3, bumpMap: tex, bumpScale: 1.3 });
        withTongueCrypts(bodyMat);
        return {
            tex,
            body: tubeGeometry(TONGUE, 64, 36),
            cone: new THREE.ConeGeometry(0.03, 0.12, 5).translate(0, 0.06, 0),
            dome: new THREE.IcosahedronGeometry(0.06, 1),
            bodyMat,
            filMat: new THREE.MeshStandardMaterial({ color: '#D7A3B0', emissive: '#A8667A', emissiveIntensity: 0.3, roughness: 0.5 }),
            funMat: new THREE.MeshStandardMaterial({ color: '#C4607A', emissive: '#A04060', emissiveIntensity: 0.35, roughness: 0.28 }),
        };
    }, []);
    useEffect(() => {
        if (fil.current) scatter(fil.current, FILIFORM, 91, [0.7, 1.2], 0.0, [0.14, 0.9]);
        if (fun.current) scatter(fun.current, FUNGIFORM, 47, [0.8, 1.3], 0.02, [0.1, 0.62]);
    }, []);
    useEffect(() => () => Object.values(parts).forEach(p => p.dispose()), [parts]);

    useFrame((_, delta) => {
        dim.current = damp(dim.current, stateRef.current.f.focus.lingua, 5, Math.min(delta, 0.1));
        const k = litRef.current ? 1 : dim.current;
        const bm = matOf<THREE.MeshPhysicalMaterial>(bodyRef);
        const fm = matOf<THREE.MeshStandardMaterial>(fil);
        const um = matOf<THREE.MeshStandardMaterial>(fun);
        if (bm) {
            bm.color.copy(BODY_COL).multiplyScalar(0.55 + 0.45 * k);
            bm.emissiveIntensity = litRef.current ? 0.55 : 0.08 + 0.2 * k;
            const tu = tongueOf(bm);
            if (tu) tu.uTk.value = 0.4 + 0.6 * k;
        }
        if (fm) fm.emissiveIntensity = 0.1 + 0.28 * k;
        if (um) um.emissiveIntensity = 0.12 + 0.3 * k;
    });

    return (
        <group>
            <mesh ref={bodyRef} geometry={parts.body} material={parts.bodyMat} scale={[1, 1, TONGUE_Z]} {...bind} />
            <instancedMesh ref={fil} args={[parts.cone, parts.filMat, FILIFORM]} frustumCulled={false} />
            <instancedMesh ref={fun} args={[parts.dome, parts.funMat, FUNGIFORM]} frustumCulled={false} />
        </group>
    );
};
