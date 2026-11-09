import * as THREE from 'three';
import { rng } from '../shared/math';
import { MUSCLES } from './limb';

/* Glóbulos (pontos azul-claros) que saem da face dos músculos; correm mais rápido onde o fluxo ganhou mais com nitrato. */

export const LEN = 1.3;
const PER_MUSCLE = 14;
const RUN = 1.1;

const VS = `
attribute float aSeed;
attribute float aGain;
attribute float aSpeed;
uniform float uTime; uniform float uNit; uniform float uPx;
varying float vA;
void main() {
    float spd = aSpeed * (1.0 + uNit * aGain * 1.8);
    float u = fract(aSeed + uTime * spd / ${RUN.toFixed(2)});
    vec3 p = vec3(position.xy, ${(LEN / 2).toFixed(2)} + u * ${RUN.toFixed(2)});
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = 0.075 * uPx / max(-mv.z, 0.1);
    vA = smoothstep(0.0, 0.15, u) * (1.0 - smoothstep(0.6, 1.0, u));
}`;
const FS = `
uniform vec3 uColor; varying float vA;
void main() {
    vec2 q = gl_PointCoord - 0.5;
    float d = length(q) * 2.0;
    float disc = 1.0 - smoothstep(0.75, 1.0, d);
    float dimple = 1.0 - 0.45 * (1.0 - smoothstep(0.0, 0.45, d));
    float a = disc * vA;
    gl_FragColor = vec4(uColor * dimple * a, a);
}`;

export const buildFlow = (color: string) => {
    const rnd = rng(23);
    const n = MUSCLES.length * PER_MUSCLE;
    const pos = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    const gain = new Float32Array(n);
    const speed = new Float32Array(n);
    MUSCLES.forEach((m, mi) => {
        for (let k = 0; k < PER_MUSCLE; k++) {
            const i = mi * PER_MUSCLE + k;
            const a = rnd() * Math.PI * 2;
            const r = Math.sqrt(rnd()) * m.radius * 0.8;
            pos[i * 3] = m.x + r * Math.cos(a);
            pos[i * 3 + 1] = m.y + r * Math.sin(a);
            seed[i] = rnd();
            gain[i] = m.gain;
            speed[i] = 0.35 + rnd() * 0.2;
        }
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    geometry.setAttribute('aGain', new THREE.BufferAttribute(gain, 1));
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4);
    const material = new THREE.ShaderMaterial({
        vertexShader: VS,
        fragmentShader: FS,
        uniforms: { uTime: { value: 0 }, uNit: { value: 1 }, uPx: { value: 400 }, uColor: { value: new THREE.Color(color) } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });
    return { geometry, material };
};
