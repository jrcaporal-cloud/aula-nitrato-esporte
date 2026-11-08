import * as THREE from 'three';
import { COL } from './colors';
import { SARC } from './layout';

/* Manga do retículo sarcoplasmático: rede de losangos com brilho nas bordas (vidro), que acende a cada liberação de Ca²⁺. */

const VS = `
varying vec3 vN; varying vec3 vV; varying vec2 vP;
uniform float uLen;
void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = -mv.xyz;
    vP = vec2(position.x * uLen, atan(position.z, position.y));
    gl_Position = projectionMatrix * mv;
}`;
const FS = `
varying vec3 vN; varying vec3 vV; varying vec2 vP;
uniform vec3 uColor; uniform float uOpacity; uniform float uPulse;
void main() {
    float a = vP.x / 0.17;
    float b = vP.y / 6.2831853 * 14.0;
    float lu = abs(fract(a + b) - 0.5);
    float lv = abs(fract(a - b) - 0.5);
    float net = 1.0 - smoothstep(0.015, 0.075, min(lu, lv));
    float rim = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 1.7);
    float k = (net * (0.09 + 0.32 * rim) + rim * 0.36 + 0.025) * uOpacity;
    vec3 c = mix(uColor, vec3(0.55, 0.85, 1.0), uPulse * 0.75);
    k *= 1.0 + uPulse * 1.6;
    gl_FragColor = vec4(c * k, k);
}`;

export const SLEEVE_GEO = new THREE.CylinderGeometry(SARC.srR, SARC.srR, 1, 64, 1, true).rotateZ(Math.PI / 2);

export const makeSleeveMaterial = (): THREE.ShaderMaterial => new THREE.ShaderMaterial({
    vertexShader: VS,
    fragmentShader: FS,
    uniforms: { uLen: { value: 3 }, uColor: { value: new THREE.Color(COL.membrane) }, uOpacity: { value: 0.5 }, uPulse: { value: 0 } },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
});
