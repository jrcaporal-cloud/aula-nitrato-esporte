import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { DRIP, DUCT_P, DUCT_S, GLAND_P, GLAND_S, SIALIN_POS, type V3 } from './anatomy';
import { SPHERE_LO, TISSUE, put, rimMaterial, setEmissive } from './materials';
import { srand } from './rand';
import { useStructure } from './selection';
import type { VnStateRef } from './state';
import type { Organ } from './tubes';

/* Glândulas salivares (parótida e submandibular) com lóbulos, ductos até a boca e a catraca da sialina. */

interface GlandProps { pos: V3; r: V3; seed: number }

const ACINI = 30;

const Gland = ({ pos, r, seed }: GlandProps) => {
    const { bind, lit } = useStructure('glandulas');
    const body = useRef<THREE.Mesh>(null);
    const lobes = useRef<THREE.InstancedMesh>(null);
    const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: TISSUE.gland, emissive: '#8C6F80', emissiveIntensity: 0.14, roughness: 0.7, transparent: true, opacity: 0.92 }), []);
    const lobeMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8A6F7E', emissive: '#8C6F80', emissiveIntensity: 0.2, roughness: 0.6 }), []);
    const geo = useMemo(() => new THREE.SphereGeometry(1, 32, 20), []);

    // lóbulos sorteados sobre a superfície do elipsoide
    useEffect(() => {
        const m = lobes.current;
        if (!m) return;
        const rnd = srand(seed);
        const p = new THREE.Vector3();
        for (let i = 0; i < ACINI; i++) {
            const th = rnd() * Math.PI * 2;
            const ph = Math.acos(1 - 2 * rnd());
            p.set(Math.sin(ph) * Math.cos(th) * r[0], Math.sin(ph) * Math.sin(th) * r[1], Math.cos(ph) * r[2]).multiplyScalar(0.98);
            put(m, i, p, 0.1 + rnd() * 0.07);
        }
        m.instanceMatrix.needsUpdate = true;
    }, [seed, r]);

    useEffect(() => () => { mat.dispose(); lobeMat.dispose(); geo.dispose(); }, [mat, lobeMat, geo]);
    useFrame(() => setEmissive(body.current?.material, lit ? 0.5 : 0.14));

    return (
        <group position={[pos[0], pos[1], pos[2]]}>
            <mesh ref={body} geometry={geo} material={mat} scale={[r[0], r[1], r[2]]} {...bind} />
            <instancedMesh ref={lobes} args={[SPHERE_LO, lobeMat, ACINI]} frustumCulled={false} />
        </group>
    );
};

const Duct = ({ organ }: { organ: Organ }) => {
    const { bind, lit } = useStructure('glandulas');
    const geo = useMemo(() => new THREE.TubeGeometry(organ.curve, 48, organ.radius(0) * 0.8, 8, false), [organ]);
    const mat = useMemo(() => rimMaterial(C.placebo, 0.45), []);
    const mesh = useRef<THREE.Mesh>(null);
    useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);
    useFrame(() => setEmissive(mesh.current?.material, lit ? 2 : 0.45));
    return <mesh ref={mesh} geometry={geo} material={mat} {...bind} />;
};

const TEETH = 6;

/** Sialina: anel com dentes que gira aos saltos (catraca) quando há nitrato no sangue chegando. */
export const Sialin = ({ stateRef }: { stateRef: VnStateRef }) => {
    const { bind, lit } = useStructure('sialina');
    const g = useRef<THREE.Group>(null);
    const ringMesh = useRef<THREE.Mesh>(null);
    const ring = useMemo(() => new THREE.TorusGeometry(0.4, 0.055, 10, 40), []);
    const tooth = useMemo(() => new THREE.BoxGeometry(0.16, 0.22, 0.12), []);
    const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: C.nitrateSoft, emissive: C.nitrate, emissiveIntensity: 0.9, roughness: 0.4 }), []);
    useEffect(() => () => { ring.dispose(); tooth.dispose(); mat.dispose(); }, [ring, tooth, mat]);

    useFrame(({ clock }) => {
        const w = stateRef.current.f.w.sialin;
        const grp = g.current;
        if (!grp) return;
        grp.visible = w > 0.03;
        grp.scale.setScalar(0.55 + 0.45 * w);
        // passos de 60°, suavizados: parece uma catraca, não um motor
        const k = clock.elapsedTime * 1.1;
        const base = Math.floor(k);
        const frac = k - base;
        grp.rotation.z = -(base + Math.min(frac * 3, 1)) * (Math.PI / TEETH) * 2;
        setEmissive(ringMesh.current?.material, (lit ? 1.8 : 0.9) * (0.7 + 0.3 * w));
    });

    return (
        <group position={[SIALIN_POS[0], SIALIN_POS[1], SIALIN_POS[2] + 0.55]}>
            <group ref={g} {...bind}>
                <mesh ref={ringMesh} geometry={ring} material={mat} />
                {Array.from({ length: TEETH }, (_, i) => {
                    const a = (i / TEETH) * Math.PI * 2;
                    return <mesh key={i} geometry={tooth} material={mat} position={[Math.cos(a) * 0.46, Math.sin(a) * 0.46, 0]} rotation={[0, 0, a]} />;
                })}
            </group>
        </group>
    );
};

export const Glands = ({ stateRef }: { stateRef: VnStateRef }) => (
    <group>
        <Gland pos={GLAND_P.pos} r={GLAND_P.r} seed={21} />
        <Gland pos={GLAND_S.pos} r={GLAND_S.r} seed={33} />
        <Duct organ={DUCT_P} />
        <Duct organ={DRIP} />
        <Duct organ={DUCT_S} />
        <Sialin stateRef={stateRef} />
    </group>
);
