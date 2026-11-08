import * as THREE from 'three';

/*
 * Efeitos de shader compartilhados. `FX_TIME` é um uniforme único (o relógio da cena o escreve uma
 * vez por quadro); `flowify` injeta num material padrão um pulso de luz que corre pelo eixo do tubo
 * (UV.x), sem criar shader novo: o programa é o mesmo, só mudam os uniformes de cada material.
 */

export const FX_TIME = { value: 0 };

export interface FlowHandle {
    color: { value: THREE.Color };
    amount: { value: number };
    speed: { value: number };
    freq: { value: number };
}

export interface FlowOptions {
    color: string;
    /** Pulsos por comprimento do órgão (UV.x vai de 0 a 1). */
    freq: number;
    /** Voltas de fase por segundo (negativo corre no sentido contrário). */
    speed: number;
    amount?: number;
}

const PARS = 'varying float vFlowU; uniform float uTime; uniform vec3 uFlowColor; uniform float uFlowAmt; uniform float uFlowSpeed; uniform float uFlowFreq;';

/** Faz o material emitir pulsos que correm ao longo do tubo; devolve os uniformes para o quadro ajustar. */
export const flowify = (mat: THREE.MeshStandardMaterial, o: FlowOptions): FlowHandle => {
    const h: FlowHandle = {
        color: { value: new THREE.Color(o.color) },
        amount: { value: o.amount ?? 0 },
        speed: { value: o.speed },
        freq: { value: o.freq },
    };
    mat.onBeforeCompile = shader => {
        shader.uniforms.uTime = FX_TIME;
        shader.uniforms.uFlowColor = h.color;
        shader.uniforms.uFlowAmt = h.amount;
        shader.uniforms.uFlowSpeed = h.speed;
        shader.uniforms.uFlowFreq = h.freq;
        shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\nvarying float vFlowU;')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\nvFlowU = uv.x;');
        shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', `#include <common>\n${PARS}`)
            .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
                float fl = 0.5 + 0.5 * sin((vFlowU * uFlowFreq - uTime * uFlowSpeed) * 6.2831853);
                totalEmissiveRadiance += uFlowColor * pow(fl, 7.0) * uFlowAmt;`);
    };
    mat.customProgramCacheKey = () => 'vn-flow';
    mat.userData.flow = h;
    return h;
};

/** Material de uma malha lido pela ref (o quadro mexe no material da malha, não no valor memorizado). */
export const matOf = <M extends THREE.Material>(r: { readonly current: THREE.Object3D | null }): M | undefined =>
    (r.current as THREE.Mesh | null)?.material as M | undefined;

/** Uniformes do pulso de um material passado por `flowify`. */
export const flowOf = (m: THREE.Material | undefined): FlowHandle | undefined => m?.userData.flow as FlowHandle | undefined;

/** Aproxima `cur` de `target` com suavização independente da taxa de quadros. */
export const damp = (cur: number, target: number, rate: number, dt: number): number => cur + (target - cur) * (1 - Math.exp(-rate * dt));
