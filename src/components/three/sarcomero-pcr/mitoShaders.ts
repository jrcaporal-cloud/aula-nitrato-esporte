import * as THREE from 'three';
import { COL } from './colors';
import { NOISE_GLSL, inject, type Shader } from './glsl';

/*
 * Mitocôndria por shader:
 * - casca: dupla membrana (borda externa + uma segunda linha logo dentro) e a matriz granulosa, que
 *   ganha brilho com a demanda de ATP;
 * - cristas (onBeforeCompile no MeshStandardMaterial instanciado): dobras finas da membrana interna e
 *   pontos de síntese de ATP que correm pela crista mais depressa quanto maior a demanda
 *   (menos no nitrato, que gasta menos ATP para a mesma força).
 */

export interface MitoUniforms { uDemand: { value: number }; uTime: { value: number } }

const SHELL_VS = `varying vec3 vN; varying vec3 vV; varying vec3 vO;
void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal); vV = -mv.xyz; vO = position;
    gl_Position = projectionMatrix * mv;
}`;
const SHELL_FS = `varying vec3 vN; varying vec3 vV; varying vec3 vO;
uniform vec3 uColor; uniform float uOpacity; uniform float uDemand; uniform float uTime;
${NOISE_GLSL}
void main() {
    float f = 1.0 - abs(dot(normalize(vN), normalize(vV)));
    float outer = pow(f, 2.2);
    // membrana interna: uma segunda linha clara logo por dentro da borda
    float inner = exp(-(f - 0.6) * (f - 0.6) / 0.006) * 0.35;
    // matriz: grânulos que respiram com a demanda (o detalhe some quando a mitocôndria fica pequena)
    float g = spNoise(vO * vec3(5.0, 9.0, 9.0) + vec3(0.0, 0.0, uTime * 0.2));
    float fw = fwidth(vO.x * 5.0);
    float gran = smoothstep(0.25, 0.6, g) * (1.0 - smoothstep(0.3, 0.8, fw)) * (1.0 - f);
    float a = (0.05 + 0.9 * outer + inner + gran * (0.05 + 0.12 * uDemand)) * uOpacity;
    vec3 c = mix(uColor, vec3(1.0, 0.95, 0.88), inner * 0.8 + gran * uDemand * 0.6);
    gl_FragColor = vec4(c * a, a);
}`;

/** Casca da mitocôndria: só as bordas brilham (dupla membrana), o miolo fica quase transparente. */
export const makeShell = (u: MitoUniforms): THREE.ShaderMaterial => new THREE.ShaderMaterial({
    vertexShader: SHELL_VS,
    fragmentShader: SHELL_FS,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color(COL.mito) }, uOpacity: { value: 1 }, uDemand: u.uDemand, uTime: u.uTime },
});

const VERT_PARS = 'varying vec3 vSpO;\nvarying float vSpSeed;';
const VERT = /* glsl */ `
vSpO = position;
#ifdef USE_INSTANCING
    vSpSeed = fract(instanceMatrix[3].x * 7.31 + instanceMatrix[3].y * 3.17);
#else
    vSpSeed = 0.5;
#endif
`;
const FRAG_PARS = /* glsl */ `
uniform float uDemand;
uniform float uTime;
varying vec3 vSpO;
varying float vSpSeed;
`;
const FRAG_COLOR = /* glsl */ `
float sp_r = length(vSpO.yz);
float sp_fw = fwidth(sp_r * 14.0) + 1e-4;
// dobras finas em anel (a crista é uma lâmina pregueada), apagadas quando ficam menores que um pixel
float sp_fold = abs(fract(sp_r * 14.0 + 0.3 * spNoise(vSpO * 6.0 + vSpSeed * 9.0)) - 0.5);
float sp_foldL = (1.0 - smoothstep(0.1, 0.1 + sp_fw, sp_fold)) * (1.0 - smoothstep(0.35, 0.7, sp_fw));
diffuseColor.rgb *= 0.86 + 0.18 * sp_foldL;
`;
const FRAG_EMISSIVE = /* glsl */ `
{
    // pontos de síntese de ATP: correm da borda para o centro da crista, mais rápidos e densos com a demanda
    float sp_run = fract(sp_r * 3.0 + uTime * (0.25 + 1.1 * uDemand) + vSpSeed);
    float sp_dot = exp(-sp_run * 9.0) * (0.25 + 0.75 * smoothstep(0.1, 0.5, spNoise(vSpO * 9.0 + vec3(uTime * 0.6, 0.0, vSpSeed * 5.0)) + 0.35));
    totalEmissiveRadiance *= 0.75 + 0.5 * sp_foldL;
    totalEmissiveRadiance += vec3(1.0, 0.93, 0.8) * sp_dot * uDemand * 0.9;
}
`;

/** Liga as dobras e os pontos de síntese no material das cristas. */
export const patchCrista = (mat: THREE.MeshStandardMaterial, u: MitoUniforms): void => {
    mat.onBeforeCompile = (shader: Shader) => {
        Object.assign(shader.uniforms, u);
        shader.vertexShader = inject(inject(shader.vertexShader, 'common', VERT_PARS), 'begin_vertex', VERT);
        let fs = inject(shader.fragmentShader, 'common', NOISE_GLSL + FRAG_PARS);
        fs = inject(fs, 'color_fragment', FRAG_COLOR);
        fs = inject(fs, 'emissivemap_fragment', FRAG_EMISSIVE);
        shader.fragmentShader = fs;
    };
    mat.customProgramCacheKey = () => 'sarco-crista-v1';
};
