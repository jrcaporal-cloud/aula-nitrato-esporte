import type * as THREE from 'three';

/*
 * Peças de GLSL dos tecidos procedurais e o encaixe nos materiais do three (onBeforeCompile).
 * Hash inteiro (PCG) e Voronoi/ruído de valor adaptados de shader-art-coding/glsl (hash.glsl,
 * noise.glsl) — MIT. Nada de fract(sin()): o resultado é o mesmo em toda GPU.
 */

export const NOISE_GLSL = /* glsl */ `
uint vnPcg(uint v) { uint s = v * 747796405u + 2891336453u; uint w = ((s >> ((s >> 28u) + 4u)) ^ s) * 277803737u; return (w >> 22u) ^ w; }
float vnHash(vec2 p) { uvec2 q = uvec2(ivec2(floor(p))); return float(vnPcg(q.x + vnPcg(q.y)) >> 8u) * (1.0 / 16777216.0); }
/** Ruído de valor periódico em y (período P células, inteiro): fecha sem costura em volta do tubo. */
float vnNoiseP(vec2 p, float P) {
    vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
    float y0 = mod(i.y, P); float y1 = mod(i.y + 1.0, P);
    return mix(mix(vnHash(vec2(i.x, y0)), vnHash(vec2(i.x + 1.0, y0)), u.x), mix(vnHash(vec2(i.x, y1)), vnHash(vec2(i.x + 1.0, y1)), u.x), u.y);
}
/** fBm de 3 oitavas do ruído periódico. */
float vnFbmP(vec2 p, float P) {
    float s = 0.0; float a = 0.5;
    for (int k = 0; k < 3; k++) { s += a * vnNoiseP(p, P); p = vec2(p.x * 2.03 + 5.3, p.y * 2.0); P *= 2.0; a *= 0.5; }
    return s / 0.875;
}
/** Voronoi periódico em y: (F1, F2, hash da célula mais próxima). */
vec3 vnVoronoiP(vec2 p, float P) {
    vec2 ip = floor(p); vec2 fp = fract(p); float f1 = 8.0; float f2 = 8.0; float id = 0.0;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 c = vec2(ip.x + g.x, mod(ip.y + g.y, P));
        vec2 o = vec2(vnHash(c), vnHash(c + vec2(41.0, 17.0)));
        vec2 r = g + 0.15 + 0.7 * o - fp;
        float d = dot(r, r);
        if (d < f1) { f2 = f1; f1 = d; id = vnHash(c + vec2(7.0, 93.0)); } else if (d < f2) { f2 = d; }
    }
    return vec3(sqrt(f1), sqrt(f2), id);
}
`;

/** Normal perturbada por um gradiente de altura em tela (Mikkelsen, o mesmo do bump do three.js). */
export const PERTURB_GLSL = /* glsl */ `
vec3 vnPerturb(vec3 surfPos, vec3 surfNorm, vec2 dHdxy, float faceDir) {
    vec3 sx = dFdx(surfPos); vec3 sy = dFdy(surfPos);
    vec3 r1 = cross(sy, surfNorm); vec3 r2 = cross(surfNorm, sx);
    float det = dot(sx, r1) * faceDir;
    vec3 grad = sign(det) * (dHdxy.x * r1 + dHdxy.y * r2);
    return normalize(abs(det) * surfNorm - grad);
}
`;

type Shader = THREE.WebGLProgramParametersWithUniforms;

/** Insere `code` depois (ou antes) de um chunk; falha alto se o chunk sumir numa versão nova do three. */
export const inject = (src: string, chunk: string, code: string, after = true): string => {
    const tag = `#include <${chunk}>`;
    if (!src.includes(tag)) throw new Error(`viagem-nitrato/glsl: chunk ${chunk} não encontrado`);
    return src.replace(tag, after ? `${tag}\n${code}` : `${code}\n${tag}`);
};

/**
 * Encadeia uma alteração de shader num material que talvez já tenha outra (ex.: o pulso de `flowify`):
 * roda a anterior, depois a nova, e compõe a chave de cache do programa.
 */
export const chainCompile = (mat: THREE.Material, key: string, fn: (shader: Shader) => void): void => {
    const prevCompile = mat.onBeforeCompile.bind(mat);
    const prevKey = mat.customProgramCacheKey.bind(mat);
    mat.onBeforeCompile = (shader, renderer) => {
        prevCompile(shader, renderer);
        fn(shader);
    };
    mat.customProgramCacheKey = () => `${prevKey()}|${key}`;
};
