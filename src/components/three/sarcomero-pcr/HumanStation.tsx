import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { lerp } from '../shared/math';
import type { ClockRef } from './clock';
import { COL } from './colors';
import { HUMAN_PANELS, sweepHz, torque } from './curves';
import { TILE_A, TILE_B, buildTile, type Fibre } from './humanTiles';
import { setOpacity } from './look';
import { STATION_X } from './layout';
import { noRaycast } from './points';
import { useStructureBind } from './selection';
import type { StructureId } from './content';

/*
 * Estação D: cortes do tríceps braquial (60–70% tipo II) e do tríceps sural (60–70% tipo I), em fascículos.
 * Uma varredura de frequência (1–100 Hz) estimula os dois; a altura de cada fibra é o torque. A tampa
 * translúcida marca a altura no placebo: o nitrato "adianta" o braquial e "atrasa" o sural; o topo é igual.
 */

const TILE_X = [-2.7, 2.7] as const;
const FRAC_II = [0.65, 0.35] as const;
const IDS: readonly StructureId[] = ['braquial', 'sural'];
const TITLES = ['Tríceps braquial', 'Tríceps sural'] as const;
const SUBS = ['rápido · 60–70% tipo II', 'lento · 60–70% tipo I'] as const;
const TILES = [buildTile(FRAC_II[0], 31), buildTile(FRAC_II[1], 47)] as const;

const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const Q = new THREE.Quaternion();
const COLR = new THREE.Color();
const C_II = new THREE.Color(COL.fiberII);
const C_I = new THREE.Color('#5A6A84');
const C_PLACEBO = new THREE.Color(COL.placebo);
const C_NITRATE = new THREE.Color(COL.nitrate);

const height = (T: number, isII: boolean) => 0.12 + 1.5 * T * (isII ? 1 : 0.8);

/** Altura (torque) e brilho das fibras de um tipo. */
const placeFibres = (m: THREE.InstancedMesh | null, list: readonly Fibre[], base: THREE.Color, isII: boolean, T: number): void => {
    if (!m) return;
    list.forEach((fb, i) => {
        m.setMatrixAt(i, M.compose(P.set(fb.x, fb.y, 0), Q, S.set(1, 1, height(T, isII))));
        m.setColorAt(i, COLR.copy(base).multiplyScalar(0.55 + 0.45 * T));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
};

const Tile = ({ index, clockRef }: { index: 0 | 1; clockRef: ClockRef }) => {
    const fast = useRef<THREE.InstancedMesh>(null);
    const slow = useRef<THREE.InstancedMesh>(null);
    const ghost = useRef<THREE.InstancedMesh>(null);
    const waves = useRef<(THREE.Mesh | null)[]>([]);
    const fibres = TILES[index];
    const split = useMemo(() => ({ II: fibres.filter(f => f.isII), I: fibres.filter(f => !f.isII) }), [fibres]);
    const kit = useMemo(() => {
        const shape = new THREE.Shape();
        shape.absellipse(0, 0, TILE_A + 0.08, TILE_B + 0.08, 0, Math.PI * 2, false, 0);
        return {
            hex: new THREE.CylinderGeometry(0.15, 0.15, 1, 6).rotateX(Math.PI / 2).rotateZ(Math.PI / 6).translate(0, 0, 0.5),
            cap: new THREE.CylinderGeometry(0.15, 0.15, 0.012, 6).rotateX(Math.PI / 2).rotateZ(Math.PI / 6),
            base: new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 2, curveSegments: 64 }).translate(0, 0, -0.12),
            wave: new THREE.RingGeometry(0.97, 1, 72),
            fastM: new THREE.MeshStandardMaterial({ roughness: 0.2, metalness: 0.2 }),
            slowM: new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0 }),
            ghostM: new THREE.MeshBasicMaterial({ color: COL.placebo, transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending }),
            baseM: new THREE.MeshStandardMaterial({ color: '#3B2E52', roughness: 0.3, metalness: 0.3, emissive: '#1C1230', emissiveIntensity: 0.6 }),
            ringM: new THREE.MeshStandardMaterial({ color: COL.nitrate, emissive: COL.nitrate, emissiveIntensity: 0.6, roughness: 0.3 }),
            waveM: new THREE.MeshBasicMaterial({ color: '#C4B5FD', transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending }),
        };
    }, []);
    useEffect(() => () => Object.values(kit).forEach(o => o.dispose()), [kit]);
    const bind = useStructureBind(IDS[index]);
    const f50 = HUMAN_PANELS[index].f50;

    useFrame(state => {
        const c = clockRef.current;
        const f = sweepHz(c.t);
        const T = torque(f, lerp(f50.placebo, f50.nitrate, c.nit));
        const Tp = torque(f, f50.placebo);
        placeFibres(fast.current, split.II, C_II, true, T);
        placeFibres(slow.current, split.I, C_I, false, T);
        const gm = ghost.current;
        if (gm) {
            fibres.forEach((fb, i) => gm.setMatrixAt(i, M.compose(P.set(fb.x, fb.y, height(Tp, fb.isII) + 0.012), Q, S.set(1, 1, 1))));
            gm.instanceMatrix.needsUpdate = true;
        }
        setOpacity(kit.ghostM, 0.32 * c.nit);
        kit.ringM.color.copy(C_PLACEBO).lerp(C_NITRATE, c.nit);
        kit.ringM.emissive.copy(kit.ringM.color);
        // ondas do estímulo: mais frequentes conforme a varredura sobe
        const time = state.clock.elapsedTime;
        const rate = 0.5 + 2.2 * (Math.log10(f) / 2);
        waves.current.forEach((w, k) => {
            if (!w) return;
            const ph = (time * rate + k * 0.5) % 1;
            w.scale.set((TILE_A + 0.1) * (0.2 + 0.85 * ph), (TILE_B + 0.1) * (0.2 + 0.85 * ph), 1);
        });
    });

    return (
        <group position={[TILE_X[index], 0.1, 0]}>
            <mesh geometry={kit.base} material={kit.baseM} raycast={noRaycast} />
            <mesh material={kit.ringM} position={[0, 0, -0.02]} scale={[(TILE_A + 0.12) / 1.5, (TILE_B + 0.12) / 1.5, 1]} raycast={noRaycast}>
                <torusGeometry args={[1.5, 0.035, 10, 120]} />
            </mesh>
            {[0, 1].map(k => <mesh key={k} ref={el => { waves.current[k] = el; }} geometry={kit.wave} material={kit.waveM} position={[0, 0, 0.005]} raycast={noRaycast} />)}
            <instancedMesh ref={fast} args={[kit.hex, kit.fastM, split.II.length]} frustumCulled={false} {...bind} />
            <instancedMesh ref={slow} args={[kit.hex, kit.slowM, split.I.length]} frustumCulled={false} {...bind} />
            <instancedMesh ref={ghost} args={[kit.cap, kit.ghostM, fibres.length]} frustumCulled={false} raycast={noRaycast} />
            <Html position={[0, -1.95, 0]} zIndexRange={[30, 10]} style={{ pointerEvents: 'none' }}>
                <div className="whitespace-nowrap text-center rounded-lg px-3 py-1.5" style={{ transform: 'translate(-50%, 0)', background: 'rgba(10,6,14,0.84)', border: `1px solid ${COL.muted}66` }}>
                    <div className="text-[15px] font-semibold text-white">{TITLES[index]}</div>
                    <div className="text-[14px] text-gray-300">{SUBS[index]}</div>
                </div>
            </Html>
        </group>
    );
};

export const HumanStation = ({ clockRef }: { clockRef: ClockRef }) => {
    const group = useRef<THREE.Group>(null);
    useFrame(({ camera }) => {
        if (group.current) group.current.visible = Math.abs(camera.position.x - STATION_X.d) < 24;
    });
    return (
        <group ref={group} position={[STATION_X.d, 0, 0]}>
            <Tile index={0} clockRef={clockRef} />
            <Tile index={1} clockRef={clockRef} />
        </group>
    );
};
