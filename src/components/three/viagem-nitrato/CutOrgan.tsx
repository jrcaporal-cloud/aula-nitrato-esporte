import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { fresnelMaterial, rimMaterial, wallMaterial } from './materials';
import { useStructure } from './selection';
import type { VnFrame, VnStateRef } from './state';
import type { StructureId } from './structures';
import { rimGeometry, tubeGeometry, type Organ } from './tubes';

/*
 * Órgão tubular em corte: metade de trás opaca (a parede vista por dentro), borda do corte brilhante
 * e casca da frente quase invisível (só a silhueta). `tint` empurra a cor do brilho da parede para
 * outra cor conforme o estado da cena (ex.: o ácido do estômago).
 */

const BACK: readonly [number, number] = [Math.PI, Math.PI * 2];

export interface Tint { color: string; amount: (f: VnFrame) => number }

export interface CutOrganProps {
    id: StructureId;
    organ: Organ;
    base: string;
    emissive: string;
    rim: string;
    tubular: number;
    radial: number;
    /** Força da casca da frente (0 = sem casca, para vasos finos). */
    shell?: number;
    rimThick?: number;
    stateRef?: VnStateRef;
    tint?: Tint;
}

export const CutOrgan = ({ id, organ, base, emissive, rim, tubular, radial, shell = 0.5, rimThick = 0.045, stateRef, tint }: CutOrganProps) => {
    const geo = useMemo(() => ({
        wall: tubeGeometry(organ, tubular, radial, BACK),
        shell: shell > 0 ? tubeGeometry(organ, tubular, radial) : null,
        rimA: rimGeometry(organ, Math.PI, rimThick),
        rimB: rimGeometry(organ, 0, rimThick),
    }), [organ, tubular, radial, shell, rimThick]);
    const mats = useMemo(() => ({
        wall: wallMaterial(base, emissive, 0.12),
        shell: shell > 0 ? fresnelMaterial(rim, shell) : null,
        rim: rimMaterial(rim, 0.9),
    }), [base, emissive, rim, shell]);
    const { bind, lit } = useStructure(id);
    const wallRef = useRef<THREE.Mesh>(null);
    const rimRef = useRef<THREE.Mesh>(null);
    const tintColor = useMemo(() => (tint ? new THREE.Color(tint.color) : null), [tint]);
    const baseEmissive = useMemo(() => new THREE.Color(emissive), [emissive]);

    useEffect(() => () => {
        Object.values(geo).forEach(g => g?.dispose());
        Object.values(mats).forEach(m => m?.dispose());
    }, [geo, mats]);

    // materiais mexidos pela malha (ref), não pelo valor memorizado
    useFrame(() => {
        const wall = wallRef.current?.material as THREE.MeshStandardMaterial | undefined;
        const rimM = rimRef.current?.material as THREE.MeshStandardMaterial | undefined;
        if (!wall || !rimM) return;
        const k = tint && tintColor && stateRef ? tint.amount(stateRef.current.f) : 0;
        if (tintColor) wall.emissive.copy(baseEmissive).lerp(tintColor, Math.min(k, 1));
        wall.emissiveIntensity = (lit ? 0.45 : 0.12) + k * 0.16;
        rimM.emissiveIntensity = lit ? 2.2 : 0.9;
    });

    return (
        <group>
            <mesh ref={wallRef} geometry={geo.wall} material={mats.wall} {...bind} />
            {geo.shell && mats.shell && <mesh geometry={geo.shell} material={mats.shell} {...bind} />}
            <mesh ref={rimRef} geometry={geo.rimA} material={mats.rim} />
            <mesh geometry={geo.rimB} material={mats.rim} />
        </group>
    );
};
