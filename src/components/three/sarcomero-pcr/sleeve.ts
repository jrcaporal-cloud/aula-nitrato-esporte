import * as THREE from 'three';
import { COL } from './colors';
import { NOISE_GLSL } from './glsl';
import { SARC } from './layout';

/*
 * Manga do retículo sarcoplasmático: rede de túbulos com brilho nas bordas (vidro). A rede é orgânica (o
 * ruído entorta os losangos) e antisserrilhada por fwidth: longe da câmera vira um véu médio, sem moiré.
 * A cada potencial de ação, uma onda de Ca²⁺ sai das tríades (onde ficam os túbulos T) e corre pela
 * manga; a onda é maior onde a liberação de Ca²⁺ é maior (fibra rápida com nitrato).
 */

const VS = `
varying vec3 vN; varying vec3 vV; varying vec2 vP; varying vec3 vO;
uniform float uLen;
void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = -mv.xyz;
    vP = vec2(position.x * uLen, atan(position.z, position.y));
    vO = vec3(position.x * uLen, position.y, position.z);
    gl_Position = projectionMatrix * mv;
}`;
const FS = `
varying vec3 vN; varying vec3 vV; varying vec2 vP; varying vec3 vO;
uniform vec3 uColor; uniform float uOpacity; uniform float uPulse;
uniform float uTime; uniform float uTri; uniform float uPhase; uniform float uRelease;
${NOISE_GLSL}
void main() {
    // rede: losangos entortados por ruído de baixa frequência (túbulos, não grade)
    vec3 q = vO * vec3(2.2, 2.6, 2.6);
    float warp = spNoise(q + vec3(0.0, 0.0, uTime * 0.05));
    float a = vP.x / 0.17 + 0.22 * warp;
    float b = vP.y / 6.2831853 * 14.0 + 0.18 * spNoise(q.yzx + 7.3);
    float b2 = atan(-vO.z, -vO.y) / 6.2831853 * 14.0;
    float sa = a + b;
    float sb = a - b;
    float fw = max(fwidth(a), min(fwidth(b), fwidth(b2))) + 1e-4;
    float lu = abs(fract(sa) - 0.5);
    float lv = abs(fract(sb) - 0.5);
    float w = 0.045 * (0.75 + 0.5 * spNoise(q * 2.0 + 3.0));
    float net = 1.0 - smoothstep(w - 0.5 * fw, w + fw, min(lu, lv));
    // longe (célula da rede com menos de ~3 px): troca a rede pela média dela
    net = mix(net, 0.28, smoothstep(0.18, 0.4, fw));
    float rim = 1.0 - abs(dot(normalize(vN), normalize(vV)));
    rim = rim * sqrt(rim);
    // onda de Ca²⁺: frente que sai das duas tríades a cada potencial de ação
    float dTri = abs(abs(vP.x) - uTri);
    float front = uPhase * 0.75;
    float wave = exp(-((dTri - front) * (dTri - front)) / 0.006) * (1.0 - uPhase) * uRelease;
    wave += exp(-dTri * dTri / 0.004) * uPulse * 0.6;
    float k = (net * (0.09 + 0.32 * rim) + rim * 0.36 + 0.025) * uOpacity;
    vec3 c = mix(uColor, vec3(0.55, 0.85, 1.0), clamp(uPulse * 0.75 + wave, 0.0, 1.0));
    k *= 1.0 + uPulse * 1.6;
    k += wave * (0.25 + 0.6 * net) * uOpacity;
    gl_FragColor = vec4(c * k, k);
}`;

export const SLEEVE_GEO = new THREE.CylinderGeometry(SARC.srR, SARC.srR, 1, 64, 1, true).rotateZ(Math.PI / 2);

export const makeSleeveMaterial = (): THREE.ShaderMaterial => new THREE.ShaderMaterial({
    vertexShader: VS,
    fragmentShader: FS,
    uniforms: {
        uLen: { value: 3 },
        uColor: { value: new THREE.Color(COL.membrane) },
        uOpacity: { value: 0.5 },
        uPulse: { value: 0 },
        uTime: { value: 0 },
        uTri: { value: SARC.halfRelaxed - SARC.tubuleOffset },
        uPhase: { value: 0 },
        uRelease: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
});
