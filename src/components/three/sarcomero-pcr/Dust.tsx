import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { rng } from '../shared/math';
import { pxPerUnit, setUniform } from './points';

/* Partículas de poeira à deriva em volta de uma estação: dão profundidade e paralaxe quando a câmera se mexe. */

const VS = `
attribute float aSeed;
uniform float uTime; uniform float uPx;
varying float vA;
void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.11 + aSeed * 40.0) * 0.35;
    p.y += sin(uTime * 0.14 + aSeed * 23.0) * 0.3;
    p.z += cos(uTime * 0.09 + aSeed * 31.0) * 0.4;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float s = 0.018 + aSeed * 0.035;
    gl_PointSize = s * uPx / max(-mv.z, 0.1);
    vA = (0.25 + 0.75 * fract(aSeed * 7.7)) * (0.55 + 0.45 * sin(uTime * (0.6 + aSeed) + aSeed * 50.0));
}`;
const FS = `
uniform vec3 uColor; varying float vA;
void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float r = max(1.0 - d, 0.0);
    float a = r * r * vA;
    gl_FragColor = vec4(uColor * a, a);
}`;

/** Distância em x da câmera até a estação a partir da qual a poeira some (as estações ficam a 38 de distância). */
const NEAR_X = 26;

interface Props { x: number; count?: number; spread?: readonly [number, number, number]; color?: string }

export const Dust = ({ x, count = 150, spread = [9, 5, 7], color = '#B8A8FF' }: Props) => {
    const built = useMemo(() => {
        const r = rng(Math.round(x) + 5);
        const pos = new Float32Array(count * 3);
        const seed = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = x + (r() * 2 - 1) * spread[0];
            pos[i * 3 + 1] = (r() * 2 - 1) * spread[1];
            pos[i * 3 + 2] = -spread[2] * 0.8 + r() * spread[2] * 1.5;
            seed[i] = r();
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
        geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(x, 0, 0), 1e3);
        const material = new THREE.ShaderMaterial({
            vertexShader: VS, fragmentShader: FS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
            uniforms: { uTime: { value: 0 }, uPx: { value: 400 }, uColor: { value: new THREE.Color(color) } },
        });
        return { geometry, material };
    }, [x, count, spread, color]);
    useEffect(() => () => { built.geometry.dispose(); built.material.dispose(); }, [built]);
    const pts = useRef<THREE.Points>(null);
    useFrame(state => {
        // poeira de outra estação: fora de vista, não desenha nem atualiza
        const near = Math.abs(state.camera.position.x - x) < NEAR_X;
        if (pts.current) pts.current.visible = near;
        if (!near) return;
        setUniform(built.material, 'uTime', state.clock.elapsedTime);
        setUniform(built.material, 'uPx', pxPerUnit(state));
    });
    return <points ref={pts} geometry={built.geometry} material={built.material} frustumCulled={false} raycast={() => undefined} />;
};
