import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { rng } from '../shared/math';
import { GLSL_NOISE } from './glsl';
import { noRaycast } from './pick';
import { U, setU } from './uniforms';

/*
 * O clima da cena: lâmpadas que esquentam com o H⁺ (laranja) e esfriam com a hipóxia (azul-violeta),
 * um fundo de tecido desfocado bem longe e poeira em suspensão (dá profundidade e paralaxe).
 */

const BACK_VERT = /* glsl */ `varying vec2 vUv; varying vec2 vW; void main() { vUv = uv; vW = (modelMatrix * vec4(position, 1.0)).xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const BACK_FRAG = /* glsl */ `
${GLSL_NOISE}
uniform float uTime; uniform float uAcid; uniform float uHyp;
varying vec2 vUv; varying vec2 vW;
void main() {
    float r = length((vUv - vec2(0.5, 0.55)) * vec2(1.7, 1.0));
    vec3 col = mix(vec3(0.085, 0.036, 0.105), vec3(0.027, 0.02, 0.043), smoothstep(0.0, 0.8, r));
    vec3 tint = mix(vec3(0.7, 0.28, 0.5), vec3(0.22, 0.3, 0.75), uHyp);
    tint = mix(tint, vec3(1.0, 0.5, 0.2), uAcid * 0.7);
    vec3 v = voro(vW * 0.1 + vec2(uTime * 0.004, 0.0));
    float blob = smoothstep(0.55, 0.05, v.x) * (0.4 + 0.6 * v.z);
    col += tint * blob * 0.07 * (1.0 - smoothstep(0.2, 0.9, r));
    col = mix(col, col * vec3(1.35, 0.9, 0.7), uAcid * 0.5);
    gl_FragColor = vec4(col, 1.0);
}`;

const DUST_VERT = /* glsl */ `
attribute vec4 aSeed; uniform float uTime; uniform float uPx; varying float vA;
void main() {
    vec3 p = position + vec3(sin(uTime * 0.11 + aSeed.x * 6.28), cos(uTime * 0.13 + aSeed.y * 6.28), sin(uTime * 0.09 + aSeed.z * 6.28)) * 0.9;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float d = -mv.z;
    gl_PointSize = (0.07 + 0.16 * aSeed.w) * uPx / max(d, 0.1);
    vA = (0.25 + 0.3 * sin(uTime * 0.7 + aSeed.x * 40.0)) * (1.0 - smoothstep(26.0, 52.0, d)) * smoothstep(2.0, 6.0, d);
}`;
const DUST_FRAG = /* glsl */ `
uniform vec3 uTint; varying float vA;
void main() { float d = length(gl_PointCoord - 0.5) * 2.0; float f = max(1.0 - d, 0.0); float a = f * f * vA; gl_FragColor = vec4(uTint * a, a); }`;

const DUST_N = 220;
const COLD = new THREE.Color('#9fa8ff');
const WARM = new THREE.Color('#ffb089');
const BG_REST = new THREE.Color('#07050B');
const BG_WARM = new THREE.Color('#150a07');
const AMB_REST = new THREE.Color('#e9d5ff');
const AMB_WARM = new THREE.Color('#ffd5b0');
const AMB_HYP = new THREE.Color('#b9b2ff');
const TMP = new THREE.Color();
const TINT = new THREE.Color('#9fa8ff');

const Dust = () => {
    const { geo, mat } = useMemo(() => {
        const r = rng(5);
        const g = new THREE.BufferGeometry();
        const pos = new Float32Array(DUST_N * 3);
        const seed = new Float32Array(DUST_N * 4);
        for (let i = 0; i < DUST_N; i++) {
            pos.set([(r() - 0.5) * 44, (r() - 0.5) * 24 - 1, -12 + r() * 24], i * 3);
            seed.set([r(), r(), r(), r()], i * 4);
        }
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4));
        g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4);
        const m = new THREE.ShaderMaterial({
            vertexShader: DUST_VERT, fragmentShader: DUST_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
            uniforms: { uTime: U.uTime, uPx: { value: 400 }, uTint: { value: TINT } },
        });
        return { geo: g, mat: m };
    }, []);
    useLayoutEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);
    useFrame(({ gl, camera, size }) => {
        const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 40;
        setU(mat, 'uPx', (size.height * gl.getPixelRatio()) / (2 * Math.tan((fov * Math.PI) / 360)));
        TINT.copy(COLD).lerp(WARM, U.uAcid.value);
    });
    return <points geometry={geo} material={mat} frustumCulled={false} raycast={noRaycast} renderOrder={1} />;
};

const Backdrop = () => {
    const mat = useMemo(() => new THREE.ShaderMaterial({ vertexShader: BACK_VERT, fragmentShader: BACK_FRAG, uniforms: { uTime: U.uTime, uAcid: U.uAcid, uHyp: U.uHyp }, depthWrite: true }), []);
    useLayoutEffect(() => () => mat.dispose(), [mat]);
    return <mesh position={[-2, 0, -20]} material={mat} raycast={noRaycast}><planeGeometry args={[150, 80]} /></mesh>;
};

export const Atmosphere = () => {
    const scene = useThree(s => s.scene);
    const amb = useRef<THREE.AmbientLight>(null);
    const hemi = useRef<THREE.HemisphereLight>(null);
    useFrame(() => {
        const acid = U.uAcid.value;
        const hyp = U.uHyp.value;
        if (amb.current) {
            amb.current.color.copy(AMB_REST).lerp(AMB_HYP, hyp * 0.6).lerp(AMB_WARM, acid * 0.7);
            amb.current.intensity = 0.55 - 0.08 * hyp;
        }
        if (hemi.current) hemi.current.intensity = 0.6 - 0.12 * hyp;
        if (scene.fog instanceof THREE.Fog) scene.fog.color.copy(BG_REST).lerp(BG_WARM, acid);
        if (scene.background instanceof THREE.Color) scene.background.copy(TMP.copy(BG_REST).lerp(BG_WARM, acid));
    });
    return (
        <>
            <ambientLight ref={amb} intensity={0.55} color="#e9d5ff" />
            <hemisphereLight ref={hemi} args={['#fde7f3', '#0b0710', 0.6]} />
            <Backdrop />
            <Dust />
        </>
    );
};
