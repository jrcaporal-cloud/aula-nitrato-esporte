import * as THREE from 'three';
import type { Clock } from './clock';
import { COL, condColor } from './colors';
import { signals, type Signals } from './kinetics';
import { STATION_X, type UnitSpec } from './layout';

/* Aparência por quadro de um sarcômero: esmaecimento do par fora de foco, fadiga e tom da fibra lenta. */

const SLOW_TINT = new THREE.Color(COL.fiberI);
const scratch = new THREE.Color();

/** Brilho 0..1 do sarcômero: foco do par (tecla P) e exaustão da etapa 2. */
export const unitDim = (c: Clock, spec: UnitSpec, fatigue: number): number =>
    (spec.cond === 'placebo' ? c.dimP : c.dimN) * (1 - 0.5 * fatigue);

/** Quanto a fibra lenta escurece (só na etapa das fibras, quando as duas colunas existem). */
export const slowTint = (c: Clock, spec: UnitSpec): number => (spec.fiber === 'I' ? c.mix * 0.55 : 0);

/** Pinta o material com a cor base, o tom da fibra e o brilho. */
export const paint = (mat: THREE.MeshStandardMaterial, base: THREE.Color, dim: number, tint: number): void => {
    scratch.copy(base).lerp(SLOW_TINT, tint).multiplyScalar(dim);
    mat.color.copy(scratch);
};

export const accentOf = (spec: UnitSpec): THREE.Color => new THREE.Color(condColor(spec.cond));
export const baseColor = (hex: string): THREE.Color => new THREE.Color(hex);

/** Escritas de material por quadro (funções de módulo: o lint de imutabilidade não vê objetos de `useMemo` mutados em callbacks). */
export const setOpacity = (m: THREE.Material, v: number): void => { m.opacity = v; };
export const setGlow = (m: THREE.MeshStandardMaterial, v: number): void => { m.emissiveIntensity = v; };
/** Escreve um uniform `{ value }` (mesma razão: escrita por quadro fora do alcance do lint). */
export const setU = (u: { value: number }, v: number): void => { u.value = v; };

/** Sarcômero fora de cena (coluna das fibras recolhida ou câmera em outra estação): pula o trabalho do quadro. */
export const unitIdle = (c: Clock, spec: UnitSpec, camX: number): boolean =>
    (spec.col === 1 && c.mix < 0.02) || Math.abs(camX - STATION_X.a) > 24;

/*
 * Sinais do quadro por sarcômero: as ~9 peças de um sarcômero pedem os mesmos sinais no mesmo quadro;
 * calcula uma vez por (condição, fibra, etapa, t) e devolve o mesmo objeto (ninguém o altera).
 */
interface SigEntry { t: number; step: number; sig: Signals | null }
const SIG_CACHE: readonly SigEntry[] = [0, 1, 2, 3].map(() => ({ t: Number.NaN, step: -1, sig: null }));

export const unitSignals = (c: Clock, spec: UnitSpec): Signals => {
    const e = SIG_CACHE[(spec.cond === 'nitrate' ? 2 : 0) + (spec.fiber === 'I' ? 1 : 0)];
    if (e.sig && e.t === c.t && e.step === c.step) return e.sig;
    e.t = c.t;
    e.step = c.step;
    e.sig = signals(c.step, spec.cond, spec.fiber, c.t);
    return e.sig;
};
