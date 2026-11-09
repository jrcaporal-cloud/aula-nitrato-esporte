import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { DRIP, DUCT_P, DUCT_S, GLAND_P, GLAND_S, SIALIN_POS, type V3 } from './anatomy';
import { damp, flowOf, flowify, matOf } from './fx';
import { SPHERE_MID, setEmissive } from './materials';
import { srand } from './rand';
import { useStructure } from './selection';
import type { VnStateRef } from './state';
import type { Organ } from './tubes';

/* Glândulas salivares (parótida e submandibular) com lóbulos, ductos até a boca e a catraca da sialina. */

interface GlandProps { pos: V3; r: V3; seed: number }

const ACINI = 110;
const ACINUS_BASE = new THREE.Color('#9A7284');
const ACINUS_HOT = new THREE.Color(C.nitrate);
const COL = new THREE.Color();

/** Glândula: cápsula translúcida e ácinos (cachos de bolinhas) que acendem em magenta quando secretam o nitrato. */
const Gland = ({ pos, r, seed, stateRef }: GlandProps & { stateRef: VnStateRef }) => {
    const { bind, lit } = useStructure('glandulas');
    const litRef = useRef(lit);
    useEffect(() => { litRef.current = lit; }, [lit]);
    const dim = useRef(0.5);
    const lobes = useRef<THREE.InstancedMesh>(null);
    const bodyRef = useRef<THREE.Mesh>(null);
    const lastK = useRef(-1);
    const parts = useMemo(() => {
        const rnd = srand(seed);
        const seeds = Array.from({ length: ACINI }, () => {
            const th = rnd() * Math.PI * 2;
            const ph = Math.acos(1 - 2 * rnd());
            const depth = 0.55 + 0.4 * rnd();
            return { p: new THREE.Vector3(Math.sin(ph) * Math.cos(th) * r[0], Math.sin(ph) * Math.sin(th) * r[1], Math.cos(ph) * r[2]).multiplyScalar(depth), s: 0.09 + rnd() * 0.08, ph: rnd() * 6.28 };
        });
        return {
            seeds,
            geo: new THREE.SphereGeometry(1, 32, 20),
            body: new THREE.MeshPhysicalMaterial({ color: '#6C4C5C', emissive: '#8C6F80', emissiveIntensity: 0.14, roughness: 0.4, clearcoat: 0.7, transparent: true, opacity: 0.42, depthWrite: false }),
            lobe: new THREE.MeshStandardMaterial({ color: '#FFFFFF', emissive: '#7A5468', emissiveIntensity: 0.4, roughness: 0.32 }),
        };
    }, [seed, r]);
    useEffect(() => () => { parts.geo.dispose(); parts.body.dispose(); parts.lobe.dispose(); }, [parts]);

    useEffect(() => {
        const m = lobes.current;
        if (!m) return;
        const mx = new THREE.Matrix4();
        const q = new THREE.Quaternion();
        const sc = new THREE.Vector3();
        parts.seeds.forEach((sd, i) => m.setMatrixAt(i, mx.compose(sd.p, q, sc.setScalar(sd.s))));
        m.instanceMatrix.needsUpdate = true;
    }, [parts]);

    useFrame(({ clock }, delta) => {
        const f = stateRef.current.f;
        dim.current = damp(dim.current, f.focus.glandulas, 5, Math.min(delta, 0.1));
        const k = litRef.current ? 1 : dim.current;
        const m = lobes.current;
        const t = clock.elapsedTime;
        const bm = matOf<THREE.MeshPhysicalMaterial>(bodyRef);
        if (bm) bm.emissiveIntensity = litRef.current ? 0.5 : 0.08 + 0.12 * k;
        if (!m) return;
        (m.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.12 + 0.4 * k;
        const act = f.w.sialin * f.nitrate;
        // cores por instância só quando há secreção ou o destaque mudou (o resto do tempo ficam paradas)
        if (act < 0.01 && Math.abs(k - lastK.current) < 0.01) return;
        lastK.current = k;
        const seeds = parts.seeds;
        const gain = Math.min(act * 1.4, 1);
        for (let i = 0; i < seeds.length; i++) {
            const s = Math.max(Math.sin(t * 2.1 + seeds[i].ph), 0);
            const s2 = s * s;
            m.setColorAt(i, COL.copy(ACINUS_BASE).multiplyScalar(0.55 + 0.45 * k).lerp(ACINUS_HOT, s2 * s2 * s2 * gain));
        }
        if (m.instanceColor) m.instanceColor.needsUpdate = true;
    });

    return (
        <group position={[pos[0], pos[1], pos[2]]}>
            <mesh ref={bodyRef} geometry={parts.geo} material={parts.body} scale={[r[0], r[1], r[2]]} renderOrder={2} {...bind} />
            {/* ácinos sem handlers: ficam dentro da cápsula, que já recebe o ponteiro (110 esferas a menos no raio) */}
            <instancedMesh ref={lobes} args={[SPHERE_MID, parts.lobe, ACINI]} frustumCulled={false} />
        </group>
    );
};

/** Ducto até a boca, com pulso de saliva (no sentido da glândula para a boca). */
const Duct = ({ organ, stateRef }: { organ: Organ; stateRef: VnStateRef }) => {
    const { bind, lit } = useStructure('glandulas');
    const litRef = useRef(lit);
    useEffect(() => { litRef.current = lit; }, [lit]);
    const parts = useMemo(() => {
        const mat = new THREE.MeshStandardMaterial({ color: '#B58A98', emissive: '#C9A0AC', emissiveIntensity: 0.35, roughness: 0.4 });
        flowify(mat, { color: C.nitrate, freq: 3, speed: 0.7 });
        return { geo: new THREE.TubeGeometry(organ.curve, 48, organ.radius(0) * 0.85, 10, false), mat };
    }, [organ]);
    const mesh = useRef<THREE.Mesh>(null);
    useEffect(() => () => { parts.geo.dispose(); parts.mat.dispose(); }, [parts]);
    useFrame(() => {
        const f = stateRef.current.f;
        const dm = matOf<THREE.MeshStandardMaterial>(mesh);
        const fh = flowOf(dm);
        if (dm) dm.emissiveIntensity = litRef.current ? 0.9 : 0.15 + 0.3 * f.focus.glandulas;
        if (fh) fh.amount.value = (0.2 + 0.8 * f.w.salivaP) * (0.3 + 0.7 * f.focus.glandulas) * 1.3;
    });
    return <mesh ref={mesh} geometry={parts.geo} material={parts.mat} {...bind} />;
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
        <Gland pos={GLAND_P.pos} r={GLAND_P.r} seed={21} stateRef={stateRef} />
        <Gland pos={GLAND_S.pos} r={GLAND_S.r} seed={33} stateRef={stateRef} />
        <Duct organ={DUCT_P} stateRef={stateRef} />
        <Duct organ={DRIP} stateRef={stateRef} />
        <Duct organ={DUCT_S} stateRef={stateRef} />
        <Sialin stateRef={stateRef} />
    </group>
);
