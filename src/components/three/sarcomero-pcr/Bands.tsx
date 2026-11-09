import { useEffect, useLayoutEffect, useMemo, useRef, type Ref } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { makeBandMaterials } from './bandShaders';
import type { ClockRef } from './clock';
import { COL, condColor } from './colors';
import { getGlyph, type Glyph } from './glyphs';
import { SARC, halfLen, type UnitSpec } from './layout';
import { noRaycast } from './points';
import { setOpacity, setU, unitDim, unitIdle, unitSignals } from './look';

/*
 * Régua das bandas sob o sarcômero: A (filamentos grossos, não muda), I (só finos, encolhe), H (só grossos,
 * fecha) e as letras Z nas pontas. Abaixo, a barra Z–Z na cor da condição com as marcas do comprimento relaxado.
 * As barras A e I têm a estriação fina dos filamentos (bandShaders), que contrai junto. Peças repetidas
 * (as duas I, as duas pontas, as marcas do relaxado) são malhas instanciadas.
 */

const Y_A = -(SARC.srR + 0.13);
const Y_H = Y_A - 0.17;
const Y_BASE = Y_H - 0.15;
const LETTER = 0.15;
const DARK = '#0B0714';
const SIGNS = [-1, 1] as const;
const C_THICK = new THREE.Color(COL.thick);
const C_THIN = new THREE.Color('#8FA8DA');
const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const Q = new THREE.Quaternion();
const S = new THREE.Vector3();

interface Props { spec: UnitSpec; clockRef: ClockRef }

interface LetterProps { g: Glyph; pos: [number, number, number]; ref?: Ref<THREE.Mesh> }

const Letter = ({ g, pos, ref }: LetterProps) => (
    <mesh ref={ref} material={g.material} position={pos} scale={[LETTER * g.aspect, LETTER, 1]} raycast={noRaycast}>
        <planeGeometry args={[1, 1]} />
    </mesh>
);

/** Marcas fantasmas do comprimento relaxado: duas pontas e a linha entre elas (fixas). */
const GHOSTS: readonly (readonly [number, number, number, number, number])[] = [
    [-SARC.halfRelaxed, Y_BASE, 0, 0.02, 0.14],
    [SARC.halfRelaxed, Y_BASE, 0, 0.02, 0.14],
    [0, Y_BASE, -0.01, 2 * SARC.halfRelaxed, 0.012],
];

const put = (m: THREE.InstancedMesh, i: number, x: number, y: number, z: number, sx: number, sy: number, sz: number): void => {
    m.setMatrixAt(i, M.compose(P.set(x, y, z), Q, S.set(sx, sy, sz)));
};

export const Bands = ({ spec, clockRef }: Props) => {
    const aBar = useRef<THREE.InstancedMesh>(null);
    const iBars = useRef<THREE.InstancedMesh>(null);
    const hBar = useRef<THREE.Mesh>(null);
    const base = useRef<THREE.Mesh>(null);
    const caps = useRef<THREE.InstancedMesh>(null);
    const ghosts = useRef<THREE.InstancedMesh>(null);
    const iLet = useRef<(THREE.Mesh | null)[]>([]);
    const zLet = useRef<(THREE.Mesh | null)[]>([]);
    const hLet = useRef<THREE.Mesh>(null);

    const kit = useMemo(() => ({
        box: new THREE.BoxGeometry(1, 1, 1),
        bands: makeBandMaterials(),
        hM: new THREE.MeshBasicMaterial({ color: '#E5E7EB', transparent: true, opacity: 0.55, toneMapped: false }),
        baseM: new THREE.MeshBasicMaterial({ color: condColor(spec.cond), transparent: true, toneMapped: false }),
        ghostM: new THREE.MeshBasicMaterial({ color: '#E5E7EB', transparent: true, opacity: 0.35, toneMapped: false }),
    }), [spec.cond]);
    useEffect(() => () => {
        kit.box.dispose();
        kit.bands.aM.dispose();
        kit.bands.iM.dispose();
        kit.hM.dispose();
        kit.baseM.dispose();
        kit.ghostM.dispose();
    }, [kit]);
    const gI = getGlyph('I', DARK);
    const gA = getGlyph('A', DARK);
    const gH = getGlyph('H', DARK);
    const gZ = getGlyph('Z', '#C7D2E8');

    useLayoutEffect(() => {
        const g = ghosts.current;
        if (!g) return;
        GHOSTS.forEach(([x, y, z, sx, sy], i) => put(g, i, x, y, z, sx, sy, i === 2 ? 0.01 : 0.02));
        g.instanceMatrix.needsUpdate = true;
    }, []);

    useFrame(state => {
        const c = clockRef.current;
        if (unitIdle(c, spec, state.camera.position.x)) return;
        const a = aBar.current, ib = iBars.current, cp = caps.current;
        if (!a || !ib || !cp) return;
        const sig = unitSignals(c, spec);
        const h = halfLen(sig.act);
        const dim = 0.3 + 0.7 * unitDim(c, spec, sig.fatigue);
        const iw = h - SARC.thickHalf;
        const hw = Math.max(2 * (h - SARC.thinLen), 0.001);
        put(a, 0, 0, Y_A, 0, SARC.thickHalf * 2, 0.13, 0.02);
        a.instanceMatrix.needsUpdate = true;
        for (let k = 0; k < 2; k++) {
            const sgn = SIGNS[k];
            put(ib, k, sgn * (SARC.thickHalf + iw / 2), Y_A, 0, iw - 0.02, 0.13, 0.02);
            put(cp, k, sgn * h, Y_BASE, 0, 0.035, 0.14, 0.02);
            iLet.current[k]?.position.set(sgn * (SARC.thickHalf + iw / 2), Y_A, 0.02);
            zLet.current[k]?.position.set(sgn * (h + 0.1), Y_H, 0.02);
        }
        ib.instanceMatrix.needsUpdate = true;
        cp.instanceMatrix.needsUpdate = true;
        hBar.current?.scale.set(hw, 0.09, 0.02);
        base.current?.scale.set(2 * h, 0.03, 0.02);
        hLet.current?.scale.setScalar(hw > 0.3 ? LETTER : 1e-4);
        setOpacity(kit.baseM, dim);
        kit.bands.aM.color.copy(C_THICK).multiplyScalar(dim);
        kit.bands.iM.color.copy(C_THIN).multiplyScalar(dim);
        setU(kit.bands.uniforms.uHalf, h);
    });

    return (
        <group>
            <instancedMesh ref={aBar} args={[kit.box, kit.bands.aM, 1]} frustumCulled={false} raycast={noRaycast} />
            <instancedMesh ref={iBars} args={[kit.box, kit.bands.iM, 2]} frustumCulled={false} raycast={noRaycast} />
            <mesh ref={hBar} geometry={kit.box} material={kit.hM} position={[0, Y_H, 0]} raycast={noRaycast} />
            <mesh ref={base} geometry={kit.box} material={kit.baseM} position={[0, Y_BASE, 0]} raycast={noRaycast} />
            <instancedMesh ref={caps} args={[kit.box, kit.baseM, 2]} frustumCulled={false} raycast={noRaycast} />
            <instancedMesh ref={ghosts} args={[kit.box, kit.ghostM, GHOSTS.length]} frustumCulled={false} raycast={noRaycast} />
            <Letter g={gA} pos={[0, Y_A, 0.02]} />
            {[0, 1].map(k => <Letter key={`I${k}`} g={gI} pos={[0, Y_A, 0.02]} ref={el => { iLet.current[k] = el; }} />)}
            <Letter g={gH} pos={[0, Y_H, 0.02]} ref={hLet} />
            {[0, 1].map(k => <Letter key={`Z${k}`} g={gZ} pos={[0, Y_H, 0.02]} ref={el => { zLet.current[k] = el; }} />)}
        </group>
    );
};
