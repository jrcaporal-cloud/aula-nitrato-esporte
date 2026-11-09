import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { BLADDER } from './anatomy';
import { damp, matOf } from './fx';
import { fresnelMaterial } from './materials';
import { URINE_48H } from './pk';
import { useStructure } from './selection';
import type { VnStateRef } from './state';

/* Bexiga: parede de trás, casca de vidro e a urina (magenta) subindo conforme a dose é excretada. */

export const Bladder = ({ stateRef }: { stateRef: VnStateRef }) => {
    const { bind, lit } = useStructure('bexiga');
    const litRef = useRef(lit);
    useEffect(() => { litRef.current = lit; }, [lit]);
    const dim = useRef(0.5);
    const liquid = useRef<THREE.Mesh>(null);
    const innerRef = useRef<THREE.Mesh>(null);
    const parts = useMemo(() => ({
        geo: new THREE.SphereGeometry(1, 36, 24),
        inner: new THREE.MeshPhysicalMaterial({ color: '#5A4A6A', emissive: '#A58EC0', emissiveIntensity: 0.14, roughness: 0.5, clearcoat: 0.6, side: THREE.BackSide, transparent: true, opacity: 0.85 }),
        pool: new THREE.MeshStandardMaterial({ color: C.nitrateDeep, emissive: C.nitrate, emissiveIntensity: 0.45, roughness: 0.2, transparent: true, opacity: 0.55 }),
        shell: fresnelMaterial(C.placebo, 0.8),
    }), []);
    useEffect(() => () => { parts.geo.dispose(); parts.inner.dispose(); parts.pool.dispose(); parts.shell.dispose(); }, [parts]);

    useFrame(({ clock }, delta) => {
        const f = stateRef.current.f;
        dim.current = damp(dim.current, f.focus.bexiga, 5, Math.min(delta, 0.1));
        const k = litRef.current ? 1 : dim.current;
        const fill = Math.min(f.excreted / URINE_48H, 1);
        const inner = matOf<THREE.MeshPhysicalMaterial>(innerRef);
        if (inner) inner.emissiveIntensity = (litRef.current ? 0.5 : 0.08 + 0.12 * k);
        const pool = matOf<THREE.MeshStandardMaterial>(liquid);
        if (pool) pool.emissiveIntensity = 0.25 + 0.4 * k + 0.1 * Math.sin(clock.elapsedTime * 2);
        const m = liquid.current;
        if (m) {
            m.visible = fill > 0.02;
            // o nível sobe: esfera achatada que cresce a partir do fundo
            const s = 0.25 + 0.7 * Math.cbrt(fill);
            m.scale.set(s, s * 0.9, s);
            m.position.y = -(1 - s) * 0.85;
        }
    });

    const [x, y, z] = BLADDER.pos;
    return (
        <group position={[x, y, z]} scale={BLADDER.r}>
            {/* a casca (raio 1,03) envolve a parede: só ela recebe o ponteiro */}
            <mesh ref={innerRef} geometry={parts.geo} material={parts.inner} />
            <mesh ref={liquid} geometry={parts.geo} material={parts.pool} renderOrder={1} />
            <mesh geometry={parts.geo} material={parts.shell} scale={1.03} renderOrder={2} {...bind} />
        </group>
    );
};
