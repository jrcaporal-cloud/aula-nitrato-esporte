import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TONGUE, TONGUE_Z } from './anatomy';
import { SPHERE_LO, TISSUE, put, setEmissive } from './materials';
import { srand } from './rand';
import { useStructure } from './selection';
import { tonguePoint } from './tongueSurface';
import { tubeGeometry } from './tubes';

/* Língua: corpo arredondado e papilas. As bactérias do dorso posterior ficam em Bacteria.tsx. */

const PAPILLAE = 120;
const P = new THREE.Vector3();

export const Tongue = () => {
    const { bind, lit } = useStructure('lingua');
    const body = useMemo(() => tubeGeometry(TONGUE, 56, 32), []);
    const mats = useMemo(() => ({
        body: new THREE.MeshStandardMaterial({ color: TISSUE.tongue, emissive: '#5A2F3C', emissiveIntensity: 0.16, roughness: 0.82 }),
        bump: new THREE.MeshStandardMaterial({ color: '#A66F7E', emissive: '#6B3A48', emissiveIntensity: 0.2, roughness: 0.7 }),
    }), []);
    const bumps = useRef<THREE.InstancedMesh>(null);
    const bodyMesh = useRef<THREE.Mesh>(null);

    // papilas fixas: sorteio determinístico sobre o dorso (do terço anterior ao posterior)
    useEffect(() => {
        const m = bumps.current;
        if (!m) return;
        const r = srand(91);
        for (let i = 0; i < PAPILLAE; i++) {
            tonguePoint(0.14 + r() * 0.74, (r() - 0.5) * 2.1, 1.0, P);
            put(m, i, P, 0.035 + r() * 0.025);
        }
        m.instanceMatrix.needsUpdate = true;
    }, []);

    useEffect(() => () => { body.dispose(); mats.body.dispose(); mats.bump.dispose(); }, [body, mats]);
    useFrame(() => setEmissive(bodyMesh.current?.material, lit ? 0.5 : 0.16));

    return (
        <group>
            <mesh ref={bodyMesh} geometry={body} material={mats.body} scale={[1, 1, TONGUE_Z]} {...bind} />
            <instancedMesh ref={bumps} args={[SPHERE_LO, mats.bump, PAPILLAE]} frustumCulled={false} />
        </group>
    );
};
