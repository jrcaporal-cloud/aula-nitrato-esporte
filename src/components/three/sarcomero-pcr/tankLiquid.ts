import * as THREE from 'three';
import { NOISE_GLSL, inject, type Shader } from './glsl';

/*
 * Vidro do tubo de estoque com líquido dentro (onBeforeCompile no MeshBasicMaterial aditivo que já existia):
 * abaixo do nível, o líquido na cor da molécula com um brilho que sobe devagar; no nível, um menisco claro
 * cuja superfície ondula mais quando o sarcômero contrai. O nível acompanha as contas (mesma fração de PCr).
 */

export interface LiquidUniforms {
    uLevel: { value: number };
    uAgit: { value: number };
    uTime: { value: number };
    uDim: { value: number };
    uLiquid: { value: THREE.Color };
}

const VERT_PARS = /* glsl */ `
varying vec3 vSpLoc;
varying vec3 vSpN;
varying vec3 vSpV;
`;
const VERT = /* glsl */ `
vSpLoc = position;
vSpN = normalize(normalMatrix * normal);
vSpV = -mvPosition.xyz;
`;

const FRAG_PARS = /* glsl */ `
uniform float uLevel;
uniform float uAgit;
uniform float uTime;
uniform float uDim;
uniform vec3 uLiquid;
varying vec3 vSpLoc;
varying vec3 vSpN;
varying vec3 vSpV;
`;

const FRAG = /* glsl */ `
{
    float sp_y = vSpLoc.y;
    float sp_ang = atan(vSpLoc.z, vSpLoc.x);
    // superfície viva: duas ondas que giram em volta do tubo + um tremor de ruído, mais fortes na contração
    float sp_wave = uAgit * (0.010 * sin(sp_ang * 3.0 + uTime * 4.6) + 0.007 * spNoise(vec3(sp_ang * 1.7, uTime * 1.4, 3.1)));
    float sp_surf = uLevel + sp_wave;
    float sp_fw = fwidth(sp_y) + 1e-4;
    float sp_below = 1.0 - smoothstep(sp_surf - sp_fw, sp_surf + sp_fw, sp_y);
    float sp_menis = exp(-abs(sp_y - sp_surf) / max(0.007, sp_fw * 1.5)) * step(-0.5, uLevel);
    // brilho interno que sobe devagar (o detalhe some sozinho quando o tubo fica pequeno na tela)
    float sp_fade = 1.0 - smoothstep(0.02, 0.08, sp_fw);
    float sp_caus = spFbm(vec3(sp_ang * 1.6, sp_y * 9.0 - uTime * 0.35, uTime * 0.12));
    float sp_rim = 1.0 - abs(dot(normalize(vSpN), normalize(vSpV)));
    sp_rim *= sp_rim;
    vec3 sp_liq = uLiquid * (0.7 + 0.6 * sp_caus * sp_fade + 0.8 * sp_rim);
    outgoingLight = mix(outgoingLight, sp_liq, sp_below) + mix(uLiquid, vec3(1.0), 0.45) * sp_menis * 1.4;
    diffuseColor.a = mix(diffuseColor.a * (1.0 + 2.5 * sp_rim), 0.30 + 0.22 * sp_rim, sp_below) + 0.55 * sp_menis;
    diffuseColor.a *= uDim;
}
`;

/** Material do tubo com líquido; `uniforms` é escrito por quadro pelo dono (Tank). */
export const makeLiquidGlass = (liquid: string): { material: THREE.MeshBasicMaterial; uniforms: LiquidUniforms } => {
    const uniforms: LiquidUniforms = {
        uLevel: { value: 0 },
        uAgit: { value: 0.3 },
        uTime: { value: 0 },
        uDim: { value: 1 },
        uLiquid: { value: new THREE.Color(liquid) },
    };
    const material = new THREE.MeshBasicMaterial({
        color: '#5B6FA8', transparent: true, opacity: 0.09, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    });
    material.onBeforeCompile = (shader: Shader) => {
        Object.assign(shader.uniforms, uniforms);
        let vs = inject(shader.vertexShader, 'common', VERT_PARS);
        vs = inject(vs, 'project_vertex', VERT);
        let fs = inject(shader.fragmentShader, 'common', NOISE_GLSL + FRAG_PARS);
        fs = inject(fs, 'opaque_fragment', FRAG, false);
        shader.vertexShader = vs;
        shader.fragmentShader = fs;
    };
    material.customProgramCacheKey = () => 'sarco-tanque-liquido-v1';
    return { material, uniforms };
};
