import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { ClockRef } from './clock';
import { COL } from './colors';
import { COL_X, STATION_X, UNITS } from './layout';
import { Unit } from './Unit';

/* Estação A: os sarcômeros (placebo em cima, nitrato embaixo; na etapa das fibras, duas colunas). */

const FiberHead = ({ x, text, sub, bright }: { x: number; text: string; sub: string; bright: boolean }) => (
    <Html position={[x, 1.75, 0]} zIndexRange={[30, 10]} style={{ pointerEvents: 'none' }}>
        <div className="whitespace-nowrap text-center rounded-lg px-3 py-1.5"
            style={{ transform: 'translate(-50%, -100%)', background: 'rgba(10,6,14,0.84)', border: `1px solid ${bright ? COL.fiberII : '#64748B'}`, boxShadow: bright ? '0 0 18px rgba(248,250,252,0.35)' : 'none' }}>
            <div className="text-[15px] font-semibold" style={{ color: bright ? COL.fiberII : '#CBD5E1' }}>{text}</div>
            <div className="text-[14px] text-gray-300">{sub}</div>
        </div>
    </Html>
);

export const StationA = ({ clockRef, showFibers }: { clockRef: ClockRef; showFibers: boolean }) => {
    const group = useRef<THREE.Group>(null);
    // só desenha enquanto a câmera está por perto
    useFrame(({ camera }) => {
        if (group.current) group.current.visible = Math.abs(camera.position.x - STATION_X.a) < 24;
    });
    return (
        <group ref={group} position={[STATION_X.a, 0, 0]}>
            {UNITS.map(u => <Unit key={u.id} spec={u} clockRef={clockRef} />)}
            {showFibers && (
                <>
                    <FiberHead x={COL_X[0]} text="Fibra tipo II · rápida" sub="Ca²⁺, CASQ1 e DHPR ↑ com nitrato" bright />
                    <FiberHead x={COL_X[1]} text="Fibra tipo I · lenta" sub="sem mudança com nitrato" bright={false} />
                </>
            )}
        </group>
    );
};
