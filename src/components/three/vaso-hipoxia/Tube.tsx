import { useRef, type ReactNode, type Ref } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RIM } from './geometry';

/*
 * Tubo em corte (capilar, arteríola, fibra): casca de trás escura (o fundo do corte), casca da frente
 * translúcida (só as bordas de cima e de baixo) e as duas arestas do corte. Raio 1 escalado por `r`.
 */

interface TubeProps {
    geo: THREE.BufferGeometry;
    x0: number;
    x1: number;
    y: number;
    z?: number;
    r: number;
    wedge: number;
    outer: string;
    inner: string;
    rim: string;
    outerOpacity: number;
    innerOpacity: number;
    lit: boolean;
    /** Opacidade global (0–1) lida por quadro; some a estrutura inteira. */
    fade?: () => number;
    groupRef?: Ref<THREE.Group>;
    children?: ReactNode;
}

export const Tube = ({ geo, x0, x1, y, z = 0, r, wedge, outer, inner, rim, outerOpacity, innerOpacity, lit, fade, groupRef, children }: TubeProps) => {
    const len = x1 - x0;
    const outerMat = useRef<THREE.MeshStandardMaterial>(null);
    const innerMat = useRef<THREE.MeshBasicMaterial>(null);
    const rimMat = useRef<THREE.MeshBasicMaterial>(null);
    useFrame(() => {
        const k = fade ? fade() : 1;
        if (outerMat.current) outerMat.current.opacity = (lit ? outerOpacity * 1.7 : outerOpacity) * k;
        if (innerMat.current) innerMat.current.opacity = innerOpacity * k;
        if (rimMat.current) rimMat.current.opacity = (lit ? 1 : 0.65) * k;
    });
    return (
        <group ref={groupRef} position={[(x0 + x1) / 2, y, z]}>
            <mesh geometry={geo} scale={[len, r, r]} renderOrder={1}>
                <meshBasicMaterial ref={innerMat} color={inner} transparent opacity={innerOpacity} side={THREE.BackSide} depthWrite={false} />
            </mesh>
            <mesh geometry={geo} scale={[len, r, r]} renderOrder={4}>
                <meshStandardMaterial ref={outerMat} color={outer} transparent opacity={outerOpacity} roughness={0.35} emissive={outer} emissiveIntensity={0.18} depthWrite={false} />
            </mesh>
            {[-1, 1].map(sgn => (
                <mesh key={sgn} geometry={RIM} position={[0, -sgn * Math.sin(wedge) * r, Math.cos(wedge) * r]} scale={[len, 1, 1]} renderOrder={4}>
                    <meshBasicMaterial ref={sgn === 1 ? rimMat : undefined} color={rim} transparent opacity={0.65} toneMapped={false} depthWrite={false} />
                </mesh>
            ))}
            {children}
        </group>
    );
};
