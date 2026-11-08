import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { lerp, rng } from '../shared/math';
import type { ClockRef } from './clock';
import { COL } from './colors';
import { HUMAN_PANELS, sweepHz, torque } from './curves';
import { STATION_X } from './layout';
import { noRaycast } from './points';
import { useStructureBind } from './selection';
import type { StructureId } from './content';

/*
 * Estação D: cortes do tríceps braquial (60–70% tipo II) e do tríceps sural (60–70% tipo I) em mosaico de
 * fibras. Uma varredura de frequência (1–100 Hz) estimula os dois; a altura de cada fibra é o torque, então
 * o nitrato "adianta" o braquial e "atrasa" o sural, e o topo (força máxima) fica igual.
 */

const TILE_X = [-2.7, 2.7] as const;
const FRAC_II = [0.65, 0.35] as const;
const IDS: readonly StructureId[] = ['braquial', 'sural'];
const TITLES = ['Tríceps braquial', 'Tríceps sural'] as const;
const SUBS = ['rápido · 60–70% tipo II', 'lento · 60–70% tipo I'] as const;

interface Fibre { x: number; y: number; isII: boolean }

/** Mosaico hexagonal recortado numa elipse; as fibras tipo II são sorteadas na fração pedida. */
const buildTile = (fracII: number, seed: number): readonly Fibre[] => {
    const rnd = rng(seed);
    const pts: { x: number; y: number }[] = [];
    for (let row = -6; row <= 6; row++) {
        for (let col = -8; col <= 8; col++) {
            const x = col * 0.37 + (row % 2 ? 0.185 : 0);
            const y = row * 0.32;
            if ((x / 2.1) ** 2 + (y / 1.4) ** 2 <= 1) pts.push({ x, y });
        }
    }
    const order = pts.map((_, i) => ({ i, k: rnd() })).sort((a, b) => a.k - b.k);
    const nII = Math.round(fracII * pts.length);
    const isII = new Set(order.slice(0, nII).map(o => o.i));
    return pts.map((p, i) => ({ ...p, isII: isII.has(i) }));
};

const TILES = [buildTile(FRAC_II[0], 31), buildTile(FRAC_II[1], 47)] as const;
const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const Q = new THREE.Quaternion();
const C_II = new THREE.Color(COL.fiberII);
const C_I = new THREE.Color(COL.fiberI);
const C_PLACEBO = new THREE.Color(COL.placebo);
const C_NITRATE = new THREE.Color(COL.nitrate);

const Tile = ({ index, clockRef }: { index: 0 | 1; clockRef: ClockRef }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const fibres = TILES[index];
    const geo = useMemo(() => new THREE.CylinderGeometry(0.19, 0.19, 1, 6).rotateX(Math.PI / 2).rotateZ(Math.PI / 6), []);
    const ringM = useMemo(() => new THREE.MeshBasicMaterial({ color: COL.nitrate }), []);
    useEffect(() => () => { geo.dispose(); ringM.dispose(); }, [geo, ringM]);
    const bind = useStructureBind(IDS[index]);
    const f50 = HUMAN_PANELS[index].f50;

    useLayoutEffect(() => {
        const m = mesh.current;
        if (!m) return;
        fibres.forEach((f, i) => m.setColorAt(i, f.isII ? C_II : C_I));
        if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }, [fibres]);

    useFrame(() => {
        const c = clockRef.current;
        const m = mesh.current;
        if (!m) return;
        const f = sweepHz(c.t);
        const T = torque(f, lerp(f50.placebo, f50.nitrate, c.nit));
        fibres.forEach((fb, i) => {
            const h = 0.12 + 1.5 * T * (fb.isII ? 1 : 0.8);
            m.setMatrixAt(i, M.compose(P.set(fb.x, fb.y, h / 2), Q.identity(), S.set(1, 1, h)));
        });
        m.instanceMatrix.needsUpdate = true;
        ringM.color.copy(C_PLACEBO).lerp(C_NITRATE, c.nit);
    });

    return (
        <group position={[TILE_X[index], 0.1, 0]}>
            <instancedMesh ref={mesh} args={[geo, undefined, fibres.length]} frustumCulled={false} {...bind}>
                <meshStandardMaterial roughness={0.5} metalness={0.05} />
            </instancedMesh>
            <mesh position={[0, 0, -0.05]} scale={[2.3 / 1.4, 1, 1]} material={ringM} raycast={noRaycast}>
                <torusGeometry args={[1.5, 0.03, 8, 96]} />
            </mesh>
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
