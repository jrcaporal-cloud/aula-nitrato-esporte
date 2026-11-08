import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { getGlowTexture } from '../shared/glow';
import type { ClockRef } from './clock';
import { COL, condColor } from './colors';
import { CalciumCloud, SparkCloud } from './Clouds';
import { Bands } from './Bands';
import { Energy } from './Energy';
import { Filaments } from './Filaments';
import { Membranes } from './Membranes';
import { Mito } from './Mito';
import { Tank } from './Tank';
import { ThinHalf } from './ThinHalf';
import { unitOrigin, type UnitSpec } from './layout';
import { setOpacity } from './look';
import { noRaycast } from './points';

/* Um sarcômero completo (filamentos, membranas, Ca²⁺, faíscas), com etiqueta de condição e brilho da fibra rápida. */

const TAG_TEXT = { placebo: 'PLACEBO', nitrate: 'NITRATO' } as const;

interface Props { spec: UnitSpec; clockRef: ClockRef }

export const Unit = ({ spec, clockRef }: Props) => {
    const group = useRef<THREE.Group>(null);
    const halo = useRef<THREE.Mesh>(null);
    const haloM = useMemo(
        () => new THREE.MeshBasicMaterial({ map: getGlowTexture(), color: COL.fiberII, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }),
        [],
    );
    useEffect(() => () => haloM.dispose(), [haloM]);

    useFrame(() => {
        const c = clockRef.current;
        const g = group.current;
        if (!g) return;
        const [x, y, z] = unitOrigin(spec, c.mix);
        g.position.set(x, y, z);
        const s = spec.col === 1 ? c.mix : 1;
        g.scale.setScalar(Math.max(s, 1e-4));
        g.visible = s > 0.02;
        // a fibra rápida ganha um halo claro quando as fibras entram em cena
        const haloOpacity = spec.fiber === 'II' ? 0.34 * c.mix * (spec.cond === 'placebo' ? c.dimP : c.dimN) : 0;
        setOpacity(haloM, haloOpacity);
        if (halo.current) halo.current.visible = haloOpacity > 0.01;
    });

    const accent = condColor(spec.cond);
    return (
        <group ref={group}>
            <Mito spec={spec} clockRef={clockRef} />
            <Filaments spec={spec} clockRef={clockRef} />
            <ThinHalf spec={spec} clockRef={clockRef} side={1} />
            <ThinHalf spec={spec} clockRef={clockRef} side={-1} />
            <Membranes spec={spec} clockRef={clockRef} />
            <Bands spec={spec} clockRef={clockRef} />
            <Energy spec={spec} clockRef={clockRef} />
            <Tank spec={spec} clockRef={clockRef} />
            <CalciumCloud spec={spec} clockRef={clockRef} />
            <SparkCloud spec={spec} clockRef={clockRef} />
            <mesh ref={halo} material={haloM} position={[0, 0, -0.9]} scale={[4.6, 2.0, 1]} raycast={noRaycast}>
                <planeGeometry args={[1, 1]} />
            </mesh>
            {spec.col === 0 && (
                <Html position={[-1.95, spec.cond === 'placebo' ? 0.1 : -0.2, 0]} zIndexRange={[30, 10]} style={{ pointerEvents: 'none' }}>
                    <div
                        className="font-mono text-[14px] font-bold tracking-wider px-3 py-1 rounded-md whitespace-nowrap"
                        style={{ transform: 'translate(-100%, -50%)', color: spec.cond === 'nitrate' ? '#fff' : '#E5E7EB', background: 'rgba(10,6,14,0.82)', border: `1px solid ${accent}`, boxShadow: `0 0 14px ${accent}55` }}
                    >
                        {TAG_TEXT[spec.cond]}
                    </div>
                </Html>
            )}
        </group>
    );
};
