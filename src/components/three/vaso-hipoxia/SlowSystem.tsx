import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { smooth } from '../shared/math';
import { FiberBody } from './FiberBody';
import { SHELL_CAP } from './geometry';
import { CAP_X0, CAP_X1, SLOW_CAP_R, SLOW_CAP_Y, SLOW_FIB_R, SLOW_FIB_Y, SLOW_MITO, SLOW_MYOFIBRILS, SLOW_NUCLEI, WEDGE_CAP } from './layout';
import { noRaycast } from './pick';
import { RedCells } from './RedCells';
import { makeShell, type ShellSpec } from './shellShader';
import type { SimRef } from './types';
import { setU } from './uniforms';

/*
 * A fibra lenta (tipo I) e o capilar dela: entram só na última etapa, para comparar com a fibra rápida.
 * O fluxo aqui NÃO muda com o NO (no rato, a PO₂ microvascular do sóleo ficou igual).
 */

const CCX = (CAP_X0 + CAP_X1) / 2;
const CLEN = CAP_X1 - CAP_X0;
const cap: Omit<ShellSpec, 'kind'> = { cx: CCX, len: CLEN, r0: SLOW_CAP_R, wedge: WEDGE_CAP, fixedR: SLOW_CAP_R, fade: true };

export const SlowSystem = ({ simRef }: { simRef: SimRef }) => {
    const group = useRef<THREE.Group>(null);
    const fade = () => smooth(simRef.current.slow);
    const mats = useMemo(() => ({
        wall: makeShell({ ...cap, kind: 'wall', base: '#2c1535', rim: '#f5c2d1' }),
        lumen: makeShell({ ...cap, kind: 'lumen', mul: 0.9 }),
        glass: makeShell({ ...cap, kind: 'glass', base: '#e7a3b8', rim: '#f9d4e0' }),
    }), []);
    useLayoutEffect(() => () => { mats.wall.dispose(); mats.lumen.dispose(); mats.glass.dispose(); }, [mats]);
    useFrame(() => {
        const k = fade();
        if (group.current) group.current.visible = simRef.current.slow > 0.01;
        setU(mats.wall, 'uFade', k);
        setU(mats.glass, 'uFade', k);
        setU(mats.lumen, 'uFade', k);
    });
    return (
        <group ref={group} visible={false}>
            <FiberBody simRef={simRef} id="fibra-lenta" cy={SLOW_FIB_Y} r={SLOW_FIB_R} fibrils={SLOW_MYOFIBRILS} mito={SLOW_MITO} nuclei={SLOW_NUCLEI}
                fibrilR={0.24} fade={fade} />
            <group position={[CCX, SLOW_CAP_Y, 0]}>
                <mesh geometry={SHELL_CAP} material={mats.wall} scale={[CLEN, SLOW_CAP_R, SLOW_CAP_R]} raycast={noRaycast} />
                <mesh geometry={SHELL_CAP} material={mats.lumen} scale={[CLEN, SLOW_CAP_R, SLOW_CAP_R]} renderOrder={2} raycast={noRaycast} />
                <mesh geometry={SHELL_CAP} material={mats.glass} scale={[CLEN, SLOW_CAP_R, SLOW_CAP_R]} renderOrder={6} raycast={noRaycast} />
            </group>
            <RedCells simRef={simRef} poolKey="rbcB" size={0.24} />
        </group>
    );
};
