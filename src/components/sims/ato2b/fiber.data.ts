import { seeded } from './geom.ts';

/**
 * Dados do experimento de 28 músculos (Ferguson 2013). Só r = 0,74 e n = 28 são dados do estudo:
 * a % de fibra por músculo e o ganho de fluxo de cada ponto são ILUSTRATIVOS, gerados com semente fixa
 * para reproduzir exatamente r = 0,74. Sóleo = 9% e gastrocnêmio = 91% vêm de Ferguson 2015.
 */

export const N_MUSCLES = 28;
export const R_TARGET = 0.74;

export interface Muscle {
    /** % de fibras tipo IIb + d/x (0–100). */
    pct: number;
    /** Ganho relativo de fluxo, padronizado (z). */
    gain: number;
}

const mean = (a: readonly number[]) => a.reduce((s, v) => s + v, 0) / a.length;
const sd = (a: readonly number[]) => Math.sqrt(mean(a.map(v => (v - mean(a)) ** 2)));
const zscore = (a: readonly number[]) => a.map(v => (v - mean(a)) / sd(a));

export const pearson = (a: readonly number[], b: readonly number[]): number => {
    const za = zscore(a);
    const zb = zscore(b);
    return mean(za.map((v, i) => v * zb[i]));
};

/** 28 pares (% de fibra, ganho) com correlação exatamente igual a `R_TARGET`. */
export const makeMuscles = (): Muscle[] => {
    const rnd = seeded(2013);
    const pct = Array.from({ length: N_MUSCLES }, (_, i) => 6 + (88 * i) / (N_MUSCLES - 1) + (rnd() - 0.5) * 6);
    pct[0] = 9;
    pct[N_MUSCLES - 1] = 91;
    const zx = zscore(pct);
    const noise = Array.from({ length: N_MUSCLES }, () => rnd() - 0.5);
    // tira de `noise` a média e a parte explicada por x: sobra um ruído ortogonal a x
    const m = mean(noise);
    const cov = mean(noise.map((v, i) => (v - m) * zx[i]));
    const ortho = zscore(noise.map((v, i) => v - m - cov * zx[i]));
    const gain = zx.map((v, i) => R_TARGET * v + Math.sqrt(1 - R_TARGET ** 2) * ortho[i]);
    return pct.map((p, i) => ({ pct: p, gain: gain[i] }));
};
