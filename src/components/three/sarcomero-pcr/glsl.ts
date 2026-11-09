import type * as THREE from 'three';

/*
 * Peças de GLSL do modelo: hash inteiro e ruído de gradiente 3D/2D (adaptados de shader-art-coding
 * glsl/hash.glsl e noise.glsl, MIT) e o injetor de trechos nos shaders dos materiais do three
 * (onBeforeCompile): a luz e o ambiente continuam os do material, só a cor e o brilho mudam.
 */

export type Shader = THREE.WebGLProgramParametersWithUniforms;

export const NOISE_GLSL = /* glsl */ `
uvec3 spPcg3(uvec3 v) {
    v = v * 1664525u + 1013904223u;
    v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
    v ^= v >> 16u;
    v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
    return v;
}
vec3 spHash33(vec3 p) { return vec3(spPcg3(uvec3(ivec3(floor(p)))) >> 8u) * (1.0 / 16777216.0); }
float spGrad(vec3 i, vec3 c, vec3 f) { return dot(spHash33(i + c) * 2.0 - 1.0, f - c); }
/* Ruído de gradiente 3D, cerca de [-1, 1]. */
float spNoise(vec3 p) {
    vec3 i = floor(p), f = fract(p);
    vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    return mix(mix(mix(spGrad(i, vec3(0, 0, 0), f), spGrad(i, vec3(1, 0, 0), f), u.x),
                   mix(spGrad(i, vec3(0, 1, 0), f), spGrad(i, vec3(1, 1, 0), f), u.x), u.y),
               mix(mix(spGrad(i, vec3(0, 0, 1), f), spGrad(i, vec3(1, 0, 1), f), u.x),
                   mix(spGrad(i, vec3(0, 1, 1), f), spGrad(i, vec3(1, 1, 1), f), u.x), u.y), u.z);
}
/* fBm de 3 oitavas (o detalhe fino some sozinho quando a peça fica pequena na tela). */
float spFbm(vec3 p) {
    float a = 0.5, s = 0.0;
    for (int k = 0; k < 3; k++) { s += a * spNoise(p); p = p * 2.03 + 17.1; a *= 0.5; }
    return s;
}
`;

/** Põe `code` logo depois (ou antes) de `#include <chunk>`; falha alto se o trecho não existir nesta versão do three. */
export const inject = (src: string, chunk: string, code: string, after = true): string => {
    const tag = `#include <${chunk}>`;
    if (!src.includes(tag)) throw new Error(`sarcomero-pcr: trecho ${chunk} não encontrado no shader`);
    return src.replace(tag, after ? `${tag}\n${code}` : `${code}\n${tag}`);
};
