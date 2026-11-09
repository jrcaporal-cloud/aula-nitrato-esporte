import * as THREE from 'three';
import { clamp01 } from '../shared/math';
import { acidity } from './model';
import { artR, capR } from './layout';
import type { Ctl, Sim } from './sim';

/*
 * Uniforms compartilhados por todos os materiais da cena (o mesmo objeto `{ value }` em cada material):
 * escritos uma vez por quadro em `driveUniforms`, sem estado do React.
 */

export const U = {
    uTime: { value: 0 },
    uSat: { value: 1 },
    uAcid: { value: 0 },
    uHyp: { value: 0 },
    uNos: { value: 1 },
    uFlow: { value: 0 },
    uRing: { value: 0 },
    uArtR: { value: 1.2 },
    uCapR: { value: 0.9 },
    /** Dilatação da arteríola (0–1) e NO total: o endotélio relaxa (junções finas) quando o NO chega. */
    uDil: { value: 0.5 },
    uNoT: { value: 0 },
};

export const driveUniforms = (sim: Sim, ctl: Ctl) => {
    U.uTime.value = sim.clock;
    U.uSat.value = ctl.sat;
    U.uAcid.value = acidity(ctl.ph);
    U.uHyp.value = clamp01((0.9 - ctl.sat) / 0.6);
    U.uNos.value = sim.rates.nos;
    U.uFlow.value = sim.flow;
    U.uRing.value = Math.min(sim.ring, 1.2);
    U.uArtR.value = artR(sim.dilate);
    U.uCapR.value = capR(sim.dilate);
    U.uDil.value = sim.dilate;
    U.uNoT.value = Math.min(sim.rates.total, 1.2);
};

/** Cor em sRGB "como autorada" (sem conversão para linear): os shaders escrevem direto na tela. */
export const srgb = (hex: string): THREE.Color => new THREE.Color().setStyle(hex, THREE.LinearSRGBColorSpace);

/** Escrita por quadro num uniform de um material criado uma vez (fora do render). */
export const setU = (m: THREE.ShaderMaterial, key: string, v: number): void => { m.uniforms[key].value = v; };
/** Marca um atributo de instância como sujo depois de escrito por quadro. */
export const dirty = (a: THREE.BufferAttribute): void => { a.needsUpdate = true; };
export const setOpacity = (m: THREE.Material, v: number): void => { m.opacity = v; };
