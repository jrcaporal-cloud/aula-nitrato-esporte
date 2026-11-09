/* Trechos de GLSL compartilhados: ruído, células de Voronoi e o campo de O₂ da fibra. */

export const GLSL_NOISE = /* glsl */ `
float hash21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec2 hash22(vec2 p) { float n = hash21(p); return vec2(n, hash21(p + n + 17.7)); }
float vnoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x), mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y);
}
// fbm de 3 oitavas (detalhe fino barato; nada abaixo de ~1 px nas distâncias da cena)
float fbm3(vec2 p) {
    float a = 0.5; float v = 0.0;
    for (int i = 0; i < 3; i++) { v += a * vnoise(p); p = p * 2.03 + vec2(17.1, 9.2); a *= 0.5; }
    return v / 0.875;
}
// (distância à célula mais próxima, à segunda, sorteio da célula)
vec3 voro(vec2 x) {
    vec2 n = floor(x); vec2 f = fract(x);
    float d1 = 9.0; float d2 = 9.0; float h = 0.0;
    for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
            vec2 g = vec2(float(i), float(j));
            vec2 o = 0.5 + 0.36 * (hash22(n + g) * 2.0 - 1.0);
            vec2 r = g + o - f;
            float d = dot(r, r);
            if (d < d1) { d2 = d1; d1 = d; h = hash21(n + g); } else if (d < d2) { d2 = d; }
        }
    }
    return vec3(sqrt(d1), sqrt(d2), h);
}
`;

/** Campo de O₂ no vizinho: azul onde há O₂ (perto do capilar), laranja onde falta ou acidifica. `d`: 0 em cima → 1 embaixo. */
export const GLSL_FIELD = /* glsl */ `
uniform float uSat; uniform float uAcid; uniform float uTime;
vec3 o2Field(float d, float seed) {
    float o2 = uSat * (1.0 - 0.5 * d);
    float hyp = smoothstep(0.55, 0.05, o2);
    float shim = 0.9 + 0.1 * sin(uTime * 0.9 + seed * 3.0 + d * 5.0);
    vec3 blue = vec3(0.26, 0.5, 1.0) * o2 * (1.0 - hyp) * shim;
    vec3 orange = vec3(1.0, 0.5, 0.18) * (hyp * 0.85 + uAcid * (0.22 + 0.4 * d)) * shim;
    return blue + orange;
}
`;

/** Altura do tubo em x (a mesma conta de `tubeR`), para o vertex shader dos cascos. */
export const GLSL_RADIUS = /* glsl */ `
uniform float uArtR; uniform float uCapR; uniform float uTx0; uniform float uTx1;
float radiusAt(float x) { return mix(uArtR, uCapR, smoothstep(uTx0, uTx1, x)); }
`;
