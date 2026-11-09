import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { BACTERIA_U, MUSCLE, TONGUE, TONGUE_Z } from './anatomy';
import { FX_TIME } from './fx';
import { NOISE_GLSL, PERTURB_GLSL, chainCompile, inject } from './glsl';
import type { VnFrame } from './state';

/*
 * Tecidos procedurais injetados nos materiais físicos que já existem (a luz, o ambiente e os halos
 * continuam os mesmos; só a cor, a normal e o brilho próprio passam a vir do shader):
 *  - língua: papilas em células de Voronoi e criptas entre elas; no dorso posterior as criptas
 *    acendem em violeta enquanto as bactérias reduzem nitrato a nitrito (apagam com a clorexidina);
 *  - músculo: fibras com endomísio e estrias transversais; brilho magenta com o nitrato muscular.
 * O detalhe fino se apaga antes de ficar menor que ~2 px (fwidth): de longe vira a média, sem moiré.
 */

/** Uniformes dos tecidos, escritos uma vez por quadro (`writeTissue`, no relógio da cena). */
export const TISSUE = {
    /** Redução bacteriana na língua (0 … 1): saliva com nitrato chegando × (1 − clorexidina). */
    uReduce: { value: 0 },
    /** Nitrato muscular × destaque do músculo (0 … 1). */
    uMuscleNo3: { value: 0 },
    /** Esforço na coxa (0 … 1): as estrias ficam mais marcadas. */
    uContract: { value: 0 },
};

export const writeTissue = (f: VnFrame): void => {
    const saliva = Math.max(f.w.salivaP, f.w.salivaS);
    TISSUE.uReduce.value = saliva * f.nitrate * (1 - 0.9 * f.chx);
    TISSUE.uMuscleNo3.value = f.muscle * (0.3 + 0.7 * f.focus.musculo);
    TISSUE.uContract.value = f.w.hypoxia;
};

/* ---------- Língua: papilas e criptas ---------- */

/** Tamanho de uma papila no mundo (esquemático). */
const PAPILLA = 0.075;
const TONGUE_LEN = TONGUE.curve.getLength();
/** Volta da língua achatada (elipse de raios r e r·z), no raio médio. */
const TONGUE_CIRC = Math.PI * 0.6 * (1 + TONGUE_Z);

export interface TongueUniforms { uTk: { value: number } }

const TONGUE_FRAG_PARS = /* glsl */ `
uniform float uReduce; uniform float uTk; uniform float uTime; uniform vec3 uViolet; uniform vec2 uCells; uniform vec2 uBactU;
varying vec2 vTgUv;
float vnTgH; float vnTgCrypt; float vnTgMask; float vnTgDetail; float vnTgId;
`;

const TONGUE_COLOR = /* glsl */ `
{
    vec2 tgP = vec2(vTgUv.x * uCells.x, vTgUv.y * uCells.y);
    float tgFw = length(fwidth(tgP));
    vnTgDetail = 1.0 - smoothstep(0.25, 0.6, tgFw);
    vec3 tgV = vnVoronoiP(tgP, uCells.y);
    float tgCrypt = 1.0 - smoothstep(0.0, 0.16 + tgFw, tgV.y - tgV.x);
    float tgDome = 1.0 - smoothstep(0.0, 0.75, tgV.x);
    vnTgH = mix(0.45, tgDome * 0.7 + (1.0 - tgCrypt) * 0.3, vnTgDetail);
    // o brilho ocupa a cripta e a borda da papila (mais largo que o sulco escuro)
    float tgGlowW = 1.0 - smoothstep(0.0, 0.42 + tgFw, tgV.y - tgV.x);
    vnTgCrypt = mix(0.4, tgGlowW * tgGlowW, vnTgDetail);
    vnTgId = tgV.z;
    // dorso posterior (u ≈ 0,5–0,86), do leque do biofilme até a borda que a câmera vê de frente
    float tgAng = cos(vTgUv.y * 6.2831853 - 0.6);
    vnTgMask = smoothstep(uBactU.x - 0.04, uBactU.x + 0.06, vTgUv.x) * (1.0 - smoothstep(uBactU.y - 0.06, uBactU.y + 0.04, vTgUv.x)) * smoothstep(-0.25, 0.15, tgAng);
    diffuseColor.rgb *= mix(1.0, mix(0.8, 1.08, vnTgH), vnTgDetail);
}
`;

const TONGUE_EMISSIVE = /* glsl */ `
{
    // cada cripta pisca no seu ritmo: as bactérias trabalhando; sem saliva com nitrato, só um resto
    float tgFlick = 0.55 + 0.45 * sin(uTime * 2.3 + vnTgId * 40.0);
    float tgGlow = vnTgCrypt * vnTgMask * (0.1 + 2.6 * uReduce * mix(1.0, tgFlick, vnTgDetail));
    totalEmissiveRadiance += uViolet * tgGlow * uTk;
}
`;

/** Uniforme de destaque da língua (lido do material da malha, como `flowOf`). */
export const tongueOf = (m: THREE.Material | undefined): TongueUniforms | undefined => m?.userData.tongue as TongueUniforms | undefined;

/** Papilas e criptas procedurais no material da língua; devolve o uniforme de destaque. */
export const withTongueCrypts = (mat: THREE.MeshPhysicalMaterial): TongueUniforms => {
    const u: TongueUniforms = { uTk: { value: 1 } };
    const cells = new THREE.Vector2(Math.round(TONGUE_LEN / PAPILLA), Math.round(TONGUE_CIRC / PAPILLA));
    mat.userData.tongue = u;
    chainCompile(mat, 'vn-tongue', shader => {
        Object.assign(shader.uniforms, u, {
            uReduce: TISSUE.uReduce, uTime: FX_TIME, uViolet: { value: new THREE.Color(C.bacteria) },
            uCells: { value: cells }, uBactU: { value: new THREE.Vector2(BACTERIA_U[0], BACTERIA_U[1]) },
            uTgBump: { value: 0.008 },
        });
        shader.vertexShader = inject(`varying vec2 vTgUv;\n${shader.vertexShader}`, 'begin_vertex', 'vTgUv = uv;');
        let fs = `${TONGUE_FRAG_PARS}uniform float uTgBump;\n${NOISE_GLSL}${PERTURB_GLSL}${shader.fragmentShader}`;
        fs = inject(fs, 'color_fragment', TONGUE_COLOR);
        fs = inject(fs, 'normal_fragment_maps', 'normal = vnPerturb(- vViewPosition, normal, vec2(dFdx(vnTgH), dFdy(vnTgH)) * uTgBump * vnTgDetail, faceDirection);');
        shader.fragmentShader = inject(fs, 'emissivemap_fragment', TONGUE_EMISSIVE);
    });
    return u;
};

/* ---------- Músculo: fibras e estrias ---------- */

const MUSCLE_LEN = MUSCLE.curve.getLength();
/** Espaçamento das estrias e largura das fibras no mundo (esquemático, legível de perto). */
const STRIA = 0.055;
const FIBER_W = 0.13;
/** Meia volta do corte no raio máximo (~1,17). */
const HALF_CIRC = Math.PI * 1.17;

const MUSCLE_FRAG_PARS = /* glsl */ `
uniform float uMuscleNo3; uniform float uContract; uniform vec3 uMagenta; uniform vec2 uFib; uniform float uMsBump;
varying vec2 vMsUv;
float vnMsH; float vnMsFib; float vnMsStri;
`;

const MUSCLE_COLOR = /* glsl */ `
{
    vec2 msP = vec2(vMsUv.x * uFib.x, vMsUv.y * uFib.y);
    // fibras: faixas ao longo do eixo, levemente onduladas, separadas pelo endomísio
    float msY = msP.y + 0.3 * (vnNoiseP(vec2(vMsUv.x * 5.0, msP.y * 0.5), 4096.0) - 0.5);
    float msFw = fwidth(msY);
    float msFy = fract(msY);
    float msId = vnHash(vec2(floor(msY), 3.0));
    float msFd = 1.0 - smoothstep(0.25, 0.6, msFw);
    float msEdge = smoothstep(0.0, 0.1 + msFw, msFy) * (1.0 - smoothstep(0.9 - msFw, 1.0, msFy));
    vnMsFib = mix(0.86, msEdge, msFd);
    // estrias transversais (sarcômeros), com fase própria em cada fibra
    float msSx = msP.x + msId * 7.0;
    float msSd = 1.0 - smoothstep(0.25, 0.6, fwidth(msSx));
    float msBand = smoothstep(0.2 - 0.12 * uContract, 0.8 - 0.2 * uContract, 0.5 + 0.5 * cos(msSx * 6.2831853));
    vnMsStri = mix(0.5, msBand, msSd);
    vnMsH = vnMsFib * (0.75 + 0.25 * vnMsStri);
    diffuseColor.rgb *= (0.6 + 0.4 * vnMsFib) * (0.84 + 0.26 * vnMsStri) * (0.92 + 0.16 * msId);
}
`;

/** Fibras e estrias procedurais na parede do músculo (encadeia com outros efeitos do material). */
export const withStriations = (mat: THREE.MeshStandardMaterial): void => {
    const fib = new THREE.Vector2(Math.round(MUSCLE_LEN / STRIA), Math.round(HALF_CIRC / FIBER_W));
    chainCompile(mat, 'vn-muscle', shader => {
        Object.assign(shader.uniforms, {
            uMuscleNo3: TISSUE.uMuscleNo3, uContract: TISSUE.uContract,
            uMagenta: { value: new THREE.Color(C.nitrate) }, uFib: { value: fib }, uMsBump: { value: 0.01 },
        });
        shader.vertexShader = inject(`varying vec2 vMsUv;\n${shader.vertexShader}`, 'begin_vertex', 'vMsUv = uv;');
        let fs = `${MUSCLE_FRAG_PARS}${NOISE_GLSL}${PERTURB_GLSL}${shader.fragmentShader}`;
        fs = inject(fs, 'color_fragment', MUSCLE_COLOR);
        fs = inject(fs, 'normal_fragment_maps', 'normal = vnPerturb(- vViewPosition, normal, vec2(dFdx(vnMsH), dFdy(vnMsH)) * uMsBump, faceDirection);');
        shader.fragmentShader = inject(fs, 'emissivemap_fragment',
            'totalEmissiveRadiance += uMagenta * uMuscleNo3 * vnMsFib * (0.35 + 0.65 * vnMsStri) * 0.22;');
    });
};
