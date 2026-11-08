import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo } from 'react';
import { SHELL_CAP } from './geometry';
import { ART_X0, CAP_R, CAP_X0, CAP_X1, CAP_Y, WEDGE_CAP } from './layout';
import { NosSites } from './NosSites';
import { RedCells } from './RedCells';
import { makeShell, type ShellSpec } from './shellShader';
import { Streaks } from './Streaks';
import type { SimRef } from './types';
import { setU } from './uniforms';
import { useVesselPick } from './VesselPick';

/*
 * O vaso da fibra rápida: arteriola (bainha de músculo liso que relaxa com o NO) e capilar num casco só,
 * afunilando e dilatando por vertex shader. Parede em mosaico endotelial, luz do lúmen com glicocálice,
 * tiras de vidro da frente, linhas de corrente, NOS na parede e eritrócitos.
 */

const VCX = (ART_X0 + CAP_X1) / 2;
const VLEN = CAP_X1 - ART_X0;
const MCX = (ART_X0 + CAP_X0) / 2;
const MLEN = CAP_X0 - ART_X0;
const MUSCLE_R = 1.4;

const base: Omit<ShellSpec, 'kind'> = { cx: VCX, len: VLEN, r0: CAP_R, wedge: WEDGE_CAP };

const useShells = () => {
    const shells = useMemo(() => {
        return {
            wall: makeShell({ ...base, kind: 'wall', base: '#2c1535', rim: '#f5c2d1' }),
            glass: makeShell({ ...base, kind: 'glass', base: '#e7a3b8', rim: '#f9d4e0' }),
            lumen: makeShell({ ...base, kind: 'lumen', mul: 0.93 }),
            muscle: makeShell({ cx: MCX, len: MLEN, r0: MUSCLE_R, wedge: WEDGE_CAP, kind: 'muscle', mul: 1.14 / MUSCLE_R * CAP_R * 1.0, base: '#9b5a74' }),
        };
    }, []);
    useLayoutEffect(() => () => { shells.wall.dispose(); shells.glass.dispose(); shells.lumen.dispose(); shells.muscle.dispose(); }, [shells]);
    return shells;
};

export const Vessel = ({ simRef }: { simRef: SimRef }) => {
    const shells = useShells();
    const { bind, litArt, litCap } = useVesselPick();
    useFrame(() => {
        setU(shells.wall, 'uLit', litCap ? 1 : 0);
        setU(shells.glass, 'uLit', litCap ? 1 : 0);
        setU(shells.muscle, 'uLit', litArt ? 1 : 0);
    });
    return (
        <group>
            <group position={[VCX, CAP_Y, 0]}>
                <mesh geometry={SHELL_CAP} material={shells.wall} scale={[VLEN, CAP_R, CAP_R]} {...bind} />
                <mesh geometry={SHELL_CAP} material={shells.lumen} scale={[VLEN, CAP_R, CAP_R]} renderOrder={2} raycast={() => undefined} />
                <mesh geometry={SHELL_CAP} material={shells.glass} scale={[VLEN, CAP_R, CAP_R]} renderOrder={6} raycast={() => undefined} />
            </group>
            <group position={[MCX, CAP_Y, 0]}>
                <mesh geometry={SHELL_CAP} material={shells.muscle} scale={[MLEN, MUSCLE_R, MUSCLE_R]} {...bind} />
            </group>
            <Streaks simRef={simRef} />
            <NosSites simRef={simRef} />
            <RedCells simRef={simRef} poolKey="rbc" size={0.5} interactive glow />
        </group>
    );
};
