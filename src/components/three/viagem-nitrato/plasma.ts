import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { C } from '../../sims/kit/palette';
import { FX_TIME } from './fx';
import { NOISE_GLSL } from './glsl';
import type { VnFrame } from './state';
import { tubeGeometry, type Organ } from './tubes';

/*
 * Plasma correndo dentro dos capilares do músculo: tubo interno aditivo, nuvens alongadas no sentido do
 * fluxo e um pulso. O brilho segue o nível de nitrato/nitrito no sangue do quadro (pk.ts) e a cor vai do
 * magenta (nitrato) ao âmbar (nitrito) conforme o nitrito sobe — a mesma regra das paredes dos vasos.
 * Por dentro (faces de trás) é mais forte; a face da frente só vela, para os íons continuarem legíveis.
 */

const INNER = 0.78;
const TUBULAR = 24;
const RADIAL = 12;

export interface PlasmaUniforms {
    uLevel: { value: number };
    uMix: { value: number };
}

/** Capilares fundidos num só tubo; uv.x em unidades de mundo (o ruído tem o mesmo tamanho em todos). */
export const plasmaGeometry = (organs: readonly Organ[]): THREE.BufferGeometry => {
    const list = organs.map(o => {
        const g = tubeGeometry({ curve: o.curve, radius: u => o.radius(u) * INNER }, TUBULAR, RADIAL);
        const len = o.curve.getLength();
        const uv = g.getAttribute('uv') as THREE.BufferAttribute;
        for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * len);
        return g;
    });
    const merged = mergeGeometries(list, false) ?? new THREE.BufferGeometry();
    list.forEach(g => g.dispose());
    return merged;
};

/** Nível e mistura de cor do plasma neste quadro. */
export const writePlasma = (u: PlasmaUniforms, f: VnFrame, focus: number): void => {
    u.uLevel.value = f.w.plasmaL * (0.3 + 0.7 * Math.max(f.nitrate, f.nitrite)) * (0.35 + 0.65 * focus);
    u.uMix.value = Math.min(f.nitrite * 1.2, 1) * 0.85 * (1 - 0.25 * f.chx);
};

export const plasmaMaterial = (u: PlasmaUniforms): THREE.ShaderMaterial => new THREE.ShaderMaterial({
    uniforms: {
        ...u,
        uTime: FX_TIME,
        uNitrate: { value: new THREE.Color(C.nitrate).multiplyScalar(0.8) },
        uNitrite: { value: new THREE.Color(C.nitrite).multiplyScalar(0.8) },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    toneMapped: false,
    vertexShader: /* glsl */ `
        uniform float uTime;
        varying vec2 vUv; varying float vBand; varying vec3 vN; varying vec3 vV;
        void main() {
            // pulso que desce o capilar a cada ~1,6 s (uv.x em unidades de mundo, ~1,8 por capilar)
            float d = (uv.x - (fract(uTime * 0.62) * 2.4 - 0.3)) / 0.22;
            vBand = exp(-d * d);
            vec4 mv = modelViewMatrix * vec4(position + normal * vBand * 0.012, 1.0);
            vUv = uv; vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
        }`,
    fragmentShader: /* glsl */ `
        uniform float uTime; uniform float uLevel; uniform float uMix; uniform vec3 uNitrate; uniform vec3 uNitrite;
        varying vec2 vUv; varying float vBand; varying vec3 vN; varying vec3 vV;
        ${NOISE_GLSL}
        void main() {
            float drift = uTime * 0.9;
            float n = vnFbmP(vec2(vUv.x * 5.0 - drift * 3.0, vUv.y * 6.0), 6.0);
            float streak = vnNoiseP(vec2(vUv.x * 3.0 - drift * 5.0, vUv.y * 12.0), 12.0);
            float body = smoothstep(0.35, 0.85, n) * 0.7 + streak * streak * streak * 0.5;
            float fres = 1.0 - abs(dot(normalize(vN), normalize(vV)));
            float side = gl_FrontFacing ? 0.2 : 0.85;
            float a = uLevel * side * (0.2 + body) * (0.5 + fres * 0.8) * (1.0 + 1.4 * vBand);
            vec3 c = mix(uNitrate, uNitrite, uMix) * (0.75 + 0.5 * body);
            gl_FragColor = vec4(c * a, 1.0);
        }`,
});
