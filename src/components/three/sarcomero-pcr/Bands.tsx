import { useEffect, useMemo, useRef, type Ref } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ClockRef } from './clock';
import { COL, condColor } from './colors';
import { getGlyph, type Glyph } from './glyphs';
import { signals } from './kinetics';
import { SARC, halfLen, type UnitSpec } from './layout';
import { noRaycast } from './points';
import { setOpacity, unitDim, unitIdle } from './look';

/*
 * Régua das bandas sob o sarcômero: A (filamentos grossos, não muda), I (só finos, encolhe), H (só grossos,
 * fecha) e as letras Z nas pontas. Abaixo, a barra Z–Z na cor da condição com as marcas do comprimento relaxado.
 */

const Y_A = -(SARC.srR + 0.13);
const Y_H = Y_A - 0.17;
const Y_BASE = Y_H - 0.15;
const LETTER = 0.15;
const DARK = '#0B0714';

interface Props { spec: UnitSpec; clockRef: ClockRef }

interface LetterProps { g: Glyph; pos: [number, number, number]; ref?: Ref<THREE.Mesh> }

const Letter = ({ g, pos, ref }: LetterProps) => (
    <mesh ref={ref} material={g.material} position={pos} scale={[LETTER * g.aspect, LETTER, 1]} raycast={noRaycast}>
        <planeGeometry args={[1, 1]} />
    </mesh>
);

export const Bands = ({ spec, clockRef }: Props) => {
    const aBar = useRef<THREE.Mesh>(null);
    const iBars = useRef<(THREE.Mesh | null)[]>([]);
    const hBar = useRef<THREE.Mesh>(null);
    const base = useRef<THREE.Mesh>(null);
    const caps = useRef<(THREE.Mesh | null)[]>([]);
    const iLet = useRef<(THREE.Mesh | null)[]>([]);
    const zLet = useRef<(THREE.Mesh | null)[]>([]);
    const hLet = useRef<THREE.Mesh>(null);

    const kit = useMemo(() => ({
        box: new THREE.BoxGeometry(1, 1, 1),
        aM: new THREE.MeshBasicMaterial({ color: COL.thick, toneMapped: false }),
        iM: new THREE.MeshBasicMaterial({ color: '#8FA8DA', toneMapped: false }),
        hM: new THREE.MeshBasicMaterial({ color: '#E5E7EB', transparent: true, opacity: 0.55, toneMapped: false }),
        baseM: new THREE.MeshBasicMaterial({ color: condColor(spec.cond), transparent: true, toneMapped: false }),
        ghostM: new THREE.MeshBasicMaterial({ color: '#E5E7EB', transparent: true, opacity: 0.35, toneMapped: false }),
    }), [spec.cond]);
    useEffect(() => () => Object.values(kit).forEach(o => o.dispose()), [kit]);
    const gI = getGlyph('I', DARK);
    const gA = getGlyph('A', DARK);
    const gH = getGlyph('H', DARK);
    const gZ = getGlyph('Z', '#C7D2E8');

    useFrame(state => {
        const c = clockRef.current;
        if (unitIdle(c, spec, state.camera.position.x)) return;
        const sig = signals(c.step, spec.cond, spec.fiber, c.t);
        const h = halfLen(sig.act);
        const dim = 0.3 + 0.7 * unitDim(c, spec, sig.fatigue);
        const iw = h - SARC.thickHalf;
        const hw = Math.max(2 * (h - SARC.thinLen), 0.001);
        aBar.current?.scale.set(SARC.thickHalf * 2, 0.13, 0.02);
        iBars.current.forEach((m, k) => {
            const sgn = k === 0 ? -1 : 1;
            m?.position.set(sgn * (SARC.thickHalf + iw / 2), Y_A, 0);
            m?.scale.set(iw - 0.02, 0.13, 0.02);
        });
        hBar.current?.scale.set(hw, 0.09, 0.02);
        base.current?.scale.set(2 * h, 0.03, 0.02);
        caps.current.forEach((m, k) => m?.position.set((k === 0 ? -1 : 1) * h, Y_BASE, 0));
        iLet.current.forEach((m, k) => m?.position.set((k === 0 ? -1 : 1) * (SARC.thickHalf + iw / 2), Y_A, 0.02));
        zLet.current.forEach((m, k) => m?.position.set((k === 0 ? -1 : 1) * (h + 0.1), Y_H, 0.02));
        hLet.current?.scale.setScalar(hw > 0.3 ? LETTER : 1e-4);
        setOpacity(kit.baseM, dim);
        kit.aM.color.set(COL.thick).multiplyScalar(dim);
        kit.iM.color.set('#8FA8DA').multiplyScalar(dim);
    });

    return (
        <group>
            <mesh ref={aBar} geometry={kit.box} material={kit.aM} position={[0, Y_A, 0]} raycast={noRaycast} />
            {[0, 1].map(k => <mesh key={k} ref={el => { iBars.current[k] = el; }} geometry={kit.box} material={kit.iM} raycast={noRaycast} />)}
            <mesh ref={hBar} geometry={kit.box} material={kit.hM} position={[0, Y_H, 0]} raycast={noRaycast} />
            <mesh ref={base} geometry={kit.box} material={kit.baseM} position={[0, Y_BASE, 0]} raycast={noRaycast} />
            {[0, 1].map(k => <mesh key={k} ref={el => { caps.current[k] = el; }} geometry={kit.box} material={kit.baseM} scale={[0.035, 0.14, 0.02]} raycast={noRaycast} />)}
            {[-1, 1].map(s => <mesh key={s} geometry={kit.box} material={kit.ghostM} position={[s * SARC.halfRelaxed, Y_BASE, 0]} scale={[0.02, 0.14, 0.02]} raycast={noRaycast} />)}
            <mesh geometry={kit.box} material={kit.ghostM} position={[0, Y_BASE, -0.01]} scale={[2 * SARC.halfRelaxed, 0.012, 0.01]} raycast={noRaycast} />
            <Letter g={gA} pos={[0, Y_A, 0.02]} />
            {[0, 1].map(k => <Letter key={`I${k}`} g={gI} pos={[0, Y_A, 0.02]} ref={el => { iLet.current[k] = el; }} />)}
            <Letter g={gH} pos={[0, Y_H, 0.02]} ref={hLet} />
            {[0, 1].map(k => <Letter key={`Z${k}`} g={gZ} pos={[0, Y_H, 0.02]} ref={el => { zLet.current[k] = el; }} />)}
        </group>
    );
};
