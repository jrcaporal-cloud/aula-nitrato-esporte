import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { rng, smooth, clamp01 } from '../shared/math';
import { QUAD } from './geometry';
import { noRaycast } from './pick';
import { CAP_X1, CAP_Y, PATH_L, PATH_X0, tubeR } from './layout';
import type { SimRef } from './types';

/*
 * Linhas de corrente do plasma: traços finos que correm em perfil parabólico (rápidos no eixo, lentos
 * junto da parede) e esticam com a velocidade. Mostram o fluxo acelerar quando o vaso dilata.
 */

const COUNT = 46;
const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const P = new THREE.Vector3();
const S = new THREE.Vector3();

const VERT = /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); }`;
const FRAG = /* glsl */ `varying vec2 vUv; void main() {
    float y = vUv.y * 2.0 - 1.0;
    float a = pow(vUv.x, 1.6) * (1.0 - y * y);
    gl_FragColor = vec4(vec3(1.0, 0.74, 0.84) * a * 0.55, 1.0);
}`;

export const Streaks = ({ simRef }: { simRef: SimRef }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const slots = useMemo(() => {
        const r = rng(61);
        return Array.from({ length: COUNT }, (_, i) => ({ u0: ((i + r() * 0.8) / COUNT) * PATH_L, a: r() * Math.PI * 2, rr: Math.sqrt(r()) * 0.85 }));
    }, []);
    const mat = useMemo(() => new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), []);
    useLayoutEffect(() => () => mat.dispose(), [mat]);
    useFrame(() => {
        const m = mesh.current;
        if (!m) return;
        const sim = simRef.current;
        for (let i = 0; i < COUNT; i++) {
            const s = slots[i];
            const sp = 0.5 + 0.85 * (1 - s.rr * s.rr);
            const x = PATH_X0 + (((s.u0 + sim.flow * sp) % PATH_L) + PATH_L) % PATH_L;
            const R = tubeR(x, sim.dilate) * 0.9 * s.rr;
            const fade = smooth(clamp01((x - PATH_X0) / 2)) * (1 - smooth(clamp01((x - (CAP_X1 - 2)) / 2)));
            const len = (0.35 + 0.55 * sp * (0.6 + 0.6 * sim.dilate)) * fade;
            m.setMatrixAt(i, M.compose(P.set(x, CAP_Y + Math.cos(s.a) * R, Math.min(Math.sin(s.a) * R, 0.2) - 0.25), Q.identity(), S.set(len + 0.001, 0.028, 1)));
        }
        m.instanceMatrix.needsUpdate = true;
    });
    return <instancedMesh ref={mesh} args={[QUAD, mat, COUNT]} frustumCulled={false} renderOrder={3} raycast={noRaycast} />;
};
