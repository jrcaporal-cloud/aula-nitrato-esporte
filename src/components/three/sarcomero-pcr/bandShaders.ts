import * as THREE from 'three';
import { inject, type Shader } from './glsl';
import { SARC } from './layout';

/*
 * Estriação fina das barras A e I da régua (onBeforeCompile nos MeshBasicMaterial que já existiam):
 * - banda A: as coroas da miosina (linhas fixas a partir da linha M) e, onde os filamentos finos entram
 *   (sobreposição), as linhas da actina presas ao disco Z, que andam com o encurtamento;
 * - banda I: só as linhas da actina, presas ao disco Z, que se apertam quando a banda encolhe.
 * Assim a régua contrai junto com o sarcômero. O detalhe some (vira a média) abaixo de ~3 px.
 */

export interface BandUniforms { uHalf: { value: number } }

const PERIOD_THICK = 0.06;
const PERIOD_THIN = 0.038;

const VERT_PARS = 'varying float vSpX;';
const VERT = /* glsl */ `
#ifdef USE_INSTANCING
    vSpX = (instanceMatrix * vec4(transformed, 1.0)).x;
#else
    vSpX = transformed.x;
#endif
`;

const FRAG_PARS = /* glsl */ `
uniform float uHalf;
varying float vSpX;
/* Linhas finas de período p com fase ph (1 sobre a linha), antisserrilhadas e apagadas quando ficam menores que um pixel. */
float spLines(float x, float p, float ph, float fw) {
    float d = abs(fract((x - ph) / p + 0.5) - 0.5) * p;
    float l = 1.0 - smoothstep(0.16 * p, 0.16 * p + 1.2 * fw, d);
    return l * (1.0 - smoothstep(0.18 * p, 0.42 * p, fw));
}
`;

const fragA = /* glsl */ `
{
    float sp_fw = fwidth(vSpX) + 1e-5;
    float sp_ax = abs(vSpX);
    float sp_thick = spLines(sp_ax, ${PERIOD_THICK.toFixed(3)}, ${(SARC.bare + 0.06).toFixed(3)}, sp_fw);
    // sobreposição: os finos chegam do disco Z (±uHalf) até uHalf - comprimento do fino
    float sp_over = smoothstep(uHalf - ${SARC.thinLen.toFixed(3)} - sp_fw, uHalf - ${SARC.thinLen.toFixed(3)} + sp_fw, sp_ax);
    float sp_thin = spLines(sp_ax, ${PERIOD_THIN.toFixed(3)}, uHalf, sp_fw) * sp_over;
    float sp_m = 1.0 - smoothstep(0.006, 0.006 + 1.5 * sp_fw, sp_ax);
    diffuseColor.rgb *= (0.86 + 0.14 * sp_thick) * (1.0 - 0.2 * sp_thin) * (1.0 - 0.12 * sp_over);
    diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.45, 0.48, 0.56), sp_m * 0.6);
}
`;

const fragI = /* glsl */ `
{
    float sp_fw = fwidth(vSpX) + 1e-5;
    float sp_thin = spLines(abs(vSpX), ${PERIOD_THIN.toFixed(3)}, uHalf, sp_fw);
    diffuseColor.rgb *= 0.8 + 0.32 * sp_thin;
}
`;

const patch = (mat: THREE.MeshBasicMaterial, frag: string, key: string, uniforms: BandUniforms): void => {
    mat.onBeforeCompile = (shader: Shader) => {
        Object.assign(shader.uniforms, uniforms);
        shader.vertexShader = inject(inject(shader.vertexShader, 'common', VERT_PARS), 'begin_vertex', VERT);
        shader.fragmentShader = inject(inject(shader.fragmentShader, 'common', FRAG_PARS), 'color_fragment', frag);
    };
    mat.customProgramCacheKey = () => key;
};

/** Materiais da banda A e da banda I com a estriação; `uniforms.uHalf` = meio comprimento atual do sarcômero. */
export const makeBandMaterials = (): { aM: THREE.MeshBasicMaterial; iM: THREE.MeshBasicMaterial; uniforms: BandUniforms } => {
    const uniforms: BandUniforms = { uHalf: { value: SARC.halfRelaxed } };
    const aM = new THREE.MeshBasicMaterial({ toneMapped: false });
    const iM = new THREE.MeshBasicMaterial({ toneMapped: false });
    patch(aM, fragA, 'sarco-banda-a-v1', uniforms);
    patch(iM, fragI, 'sarco-banda-i-v1', uniforms);
    return { aM, iM, uniforms };
};
