import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { C } from '../../sims/kit/palette';
import { BLADDER, BRANCH_S, CAPILLARIES, ESOPHAGUS, FEMORAL, GUT, KIDNEY, RENAL, STOMACH, TRUNK, URETER } from './anatomy';
import { CutOrgan } from './CutOrgan';
import { fresnelMaterial, rimMaterial, setEmissive, TISSUE } from './materials';
import { useStructure } from './selection';
import type { VnStateRef } from './state';
import { rimGeometry, tubeGeometry } from './tubes';

/*
 * Órgãos tubulares e maciços do circuito: esôfago, estômago (o ácido acende a parede), intestino,
 * vasos (tronco, ramos, capilares), rim, ureter e bexiga. Tons neutros: a cor é dos íons.
 */

const VESSEL_RIM = '#CDBFB0';
const VESSEL_WALL = '#3A3438';
const BACK: readonly [number, number] = [Math.PI, Math.PI * 2];

/** Vários tubos finos num só desenho (capilares): metade de trás + as duas bordas do corte. */
const Capillaries = () => {
    const { bind, lit } = useStructure('vasos');
    const rimMesh = useRef<THREE.Mesh>(null);
    const parts = useMemo(() => ({
        wall: mergeGeometries(CAPILLARIES.map(o => tubeGeometry(o, 24, 10, BACK)), false),
        rimA: mergeGeometries(CAPILLARIES.map(o => rimGeometry(o, Math.PI, 0.025, 24)), false),
        rimB: mergeGeometries(CAPILLARIES.map(o => rimGeometry(o, 0, 0.025, 24)), false),
        wallMat: new THREE.MeshStandardMaterial({ color: VESSEL_WALL, emissive: VESSEL_RIM, emissiveIntensity: 0.14, roughness: 0.7, side: THREE.DoubleSide }),
        rimMat: rimMaterial(VESSEL_RIM, 0.8),
    }), []);
    useEffect(() => () => Object.values(parts).forEach(p => p?.dispose()), [parts]);
    useFrame(() => setEmissive(rimMesh.current?.material, lit ? 2 : 0.8));
    return (
        <group>
            <mesh geometry={parts.wall!} material={parts.wallMat} {...bind} />
            <mesh ref={rimMesh} geometry={parts.rimA!} material={parts.rimMat} />
            <mesh geometry={parts.rimB!} material={parts.rimMat} />
        </group>
    );
};

/** Rim: elipsoide com casca de vidro e um entalhe (hilo) voltado para o tronco. */
const Kidney = () => {
    const { bind, lit } = useStructure('rim');
    const bodyMesh = useRef<THREE.Mesh>(null);
    const parts = useMemo(() => ({
        geo: new THREE.SphereGeometry(1, 36, 24),
        body: new THREE.MeshStandardMaterial({ color: TISSUE.kidney, emissive: '#8A6A7C', emissiveIntensity: 0.14, roughness: 0.75, transparent: true, opacity: 0.88 }),
        shell: fresnelMaterial(C.placebo, 0.7),
        hilum: new THREE.MeshStandardMaterial({ color: '#24202A', roughness: 0.9 }),
    }), []);
    useEffect(() => () => { parts.geo.dispose(); parts.body.dispose(); parts.shell.dispose(); parts.hilum.dispose(); }, [parts]);
    useFrame(() => setEmissive(bodyMesh.current?.material, lit ? 0.5 : 0.14));
    const [x, y, z] = KIDNEY.pos;
    return (
        <group position={[x, y, z]} rotation={[0, 0, KIDNEY.tilt]}>
            <mesh ref={bodyMesh} geometry={parts.geo} material={parts.body} scale={[KIDNEY.r[0], KIDNEY.r[1], KIDNEY.r[2]]} {...bind} />
            <mesh geometry={parts.geo} material={parts.shell} scale={[KIDNEY.r[0] * 1.04, KIDNEY.r[1] * 1.04, KIDNEY.r[2] * 1.04]} />
            <mesh geometry={parts.geo} material={parts.hilum} scale={0.2} position={[0.42, 0, 0.05]} />
        </group>
    );
};

/** Bexiga: casca de vidro e parede interna de trás, para enxergar a urina acumulando por dentro. */
const Bladder = () => {
    const { bind, lit } = useStructure('bexiga');
    const innerMesh = useRef<THREE.Mesh>(null);
    const parts = useMemo(() => ({
        geo: new THREE.SphereGeometry(1, 32, 22),
        inner: new THREE.MeshStandardMaterial({ color: TISSUE.bladder, emissive: '#9A86B0', emissiveIntensity: 0.12, roughness: 0.8, side: THREE.BackSide, transparent: true, opacity: 0.85 }),
        shell: fresnelMaterial(C.placebo, 0.8),
    }), []);
    useEffect(() => () => { parts.geo.dispose(); parts.inner.dispose(); parts.shell.dispose(); }, [parts]);
    useFrame(() => setEmissive(innerMesh.current?.material, lit ? 0.5 : 0.12));
    const [x, y, z] = BLADDER.pos;
    return (
        <group position={[x, y, z]}>
            <mesh ref={innerMesh} geometry={parts.geo} material={parts.inner} scale={BLADDER.r} {...bind} />
            <mesh geometry={parts.geo} material={parts.shell} scale={BLADDER.r * 1.03} {...bind} />
        </group>
    );
};

export const Organs = ({ stateRef }: { stateRef: VnStateRef }) => (
    <group>
        <CutOrgan id="esofago" organ={ESOPHAGUS} base={TISSUE.wall} emissive={C.placebo} rim={TISSUE.rim} tubular={36} radial={20} shell={0.4} />
        <CutOrgan id="estomago" organ={STOMACH} base={TISSUE.wall} emissive={C.placebo} rim={TISSUE.rim} tubular={90} radial={36} shell={0.5}
            stateRef={stateRef} tint={{ color: C.hypoxia, amount: f => f.w.acid }} />
        <CutOrgan id="intestino" organ={GUT} base={TISSUE.wall} emissive={C.placebo} rim={TISSUE.rim} tubular={260} radial={18} shell={0.45} />
        <CutOrgan id="vasos" organ={TRUNK} base={VESSEL_WALL} emissive={VESSEL_RIM} rim={VESSEL_RIM} tubular={160} radial={16} shell={0.35} rimThick={0.032} />
        <CutOrgan id="vasos" organ={BRANCH_S} base={VESSEL_WALL} emissive={VESSEL_RIM} rim={VESSEL_RIM} tubular={50} radial={12} shell={0} rimThick={0.026} />
        <CutOrgan id="vasos" organ={RENAL} base={VESSEL_WALL} emissive={VESSEL_RIM} rim={VESSEL_RIM} tubular={20} radial={12} shell={0} rimThick={0.026} />
        <CutOrgan id="vasos" organ={FEMORAL} base={VESSEL_WALL} emissive={VESSEL_RIM} rim={VESSEL_RIM} tubular={130} radial={14} shell={0.3} rimThick={0.03} />
        <Capillaries />
        <CutOrgan id="rim" organ={URETER} base={VESSEL_WALL} emissive={VESSEL_RIM} rim={VESSEL_RIM} tubular={60} radial={10} shell={0} rimThick={0.024} />
        <Kidney />
        <Bladder />
    </group>
);
