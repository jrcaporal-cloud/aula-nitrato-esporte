import * as THREE from 'three';
import { GLSL_FIELD, GLSL_NOISE } from './glsl';
import { FIB_X0, SARC } from './layout';
import { U } from './uniforms';

/* Shaders da fibra: miofibrilas com estriação de sarcômero (bandas A e I, linha Z, zona H, linha M) e mitocôndrias com cristas. */

const INST_VERT = /* glsl */ `
varying vec3 vN; varying vec3 vMV; varying vec3 vL; varying vec3 vW; varying float vPh;
void main() {
    vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vec4 mv = viewMatrix * w;
    gl_Position = projectionMatrix * mv;
    vN = normalize(mat3(modelViewMatrix * instanceMatrix) * normal);
    vMV = mv.xyz; vL = position; vW = w.xyz; vPh = instanceMatrix[3].x * 1.3 + instanceMatrix[3].y;
}`;

const FIBRIL_FRAG = /* glsl */ `
${GLSL_FIELD}
uniform float uSarc; uniform float uX0; uniform float uCy; uniform float uR; uniform float uFade; uniform float uLit;
varying vec3 vN; varying vec3 vMV; varying vec3 vL; varying vec3 vW; varying float vPh;
const vec3 L = vec3(0.3, 0.76, 0.58);
void main() {
    vec3 N = normalize(vN); vec3 V = normalize(-vMV);
    float s = fract((vW.x - uX0) / uSarc);
    float dz = min(s, 1.0 - s);                                         // distância à linha Z
    float zline = 1.0 - smoothstep(0.012, 0.05, dz);
    float aBand = smoothstep(0.16, 0.23, dz);                           // banda A (escura)
    float hZone = (1.0 - smoothstep(0.05, 0.11, abs(s - 0.5))) * 0.5;   // zona H (mais clara)
    float mLine = 1.0 - smoothstep(0.004, 0.016, abs(s - 0.5));
    vec3 col = mix(vec3(0.82, 0.55, 0.64), vec3(0.56, 0.17, 0.36), aBand);
    col = mix(col, vec3(0.74, 0.38, 0.52), hZone * aBand);
    col = mix(col, vec3(0.3, 0.1, 0.22), zline * 0.85);
    col *= 1.0 - 0.22 * mLine * aBand;
    float lam = 0.36 + 0.62 * max(dot(N, L), 0.0);
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.2);
    float d = clamp((uCy + uR - vW.y) / (2.0 * uR), 0.0, 1.0);
    col = col * lam + vec3(0.7, 0.3, 0.45) * fres * 0.28 + o2Field(d, vPh) * 0.3 + vec3(0.2, 0.08, 0.14) * uLit;
    gl_FragColor = vec4(col, uFade);
}`;

const MITO_FRAG = /* glsl */ `
${GLSL_NOISE}
uniform float uTime; uniform float uNoK; uniform float uLit; uniform float uFade;
varying vec3 vN; varying vec3 vMV; varying vec3 vL; varying vec3 vW; varying float vPh;
const vec3 L = vec3(0.3, 0.76, 0.58);
void main() {
    vec3 N = normalize(vN); vec3 V = normalize(-vMV);
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.0);
    float cr = smoothstep(0.35, 0.8, 0.5 + 0.5 * sin(vL.x * 17.0 + vL.z * 3.0));     // cristas
    float inner = 1.0 - smoothstep(0.55, 0.9, length(vL.yz));
    vec3 col = mix(vec3(0.8, 0.6, 0.4), vec3(0.48, 0.24, 0.1), cr * inner);
    col *= 0.45 + 0.75 * max(dot(N, L), 0.0);
    float pulse = 0.5 + 0.5 * sin(uTime * 1.3 + vPh);
    col += vec3(1.0, 0.8, 0.45) * fres * (0.3 + 0.12 * pulse) + vec3(0.2, 0.9, 0.6) * uNoK * fres * 0.5 + vec3(0.3, 0.2, 0.08) * uLit;
    gl_FragColor = vec4(col, uFade);
}`;

export interface FiberMats { fibril: THREE.ShaderMaterial; mito: THREE.ShaderMaterial }

export const makeFiberMats = (cy: number, r: number, fade: boolean): FiberMats => {
    const common = { vertexShader: INST_VERT, transparent: fade };
    const fibril = new THREE.ShaderMaterial({
        ...common, fragmentShader: FIBRIL_FRAG,
        uniforms: { uSat: U.uSat, uAcid: U.uAcid, uTime: U.uTime, uSarc: { value: SARC }, uX0: { value: FIB_X0 }, uCy: { value: cy }, uR: { value: r }, uFade: { value: 1 }, uLit: { value: 0 } },
    });
    const mito = new THREE.ShaderMaterial({
        ...common, fragmentShader: MITO_FRAG,
        uniforms: { uTime: U.uTime, uNoK: { value: 0 }, uLit: { value: 0 }, uFade: { value: 1 } },
    });
    return { fibril, mito };
};
