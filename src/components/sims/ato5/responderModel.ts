import { normals } from './random';
import { mean, sd } from './stats';

/**
 * Modelo do ResponderSim (slide 65): 12 atletas, resposta verdadeira conhecida, erro de medida calibrado
 * para que o DP das mudanças seja 8,1% (Coggan 2018). Ilustrativo, com semente fixa.
 */

export const N = 12;
export const TRUE_MEAN = 4.4;
export const NOISE_SD = 8.1;
export const RESPONDER_CUT = 10;

const standardize = (z: readonly number[]): number[] => {
    const m = mean(z);
    const s = sd(z);
    return z.map(v => (v - m) / s);
};

/** Resposta verdadeira nos dois mundos: todos iguais × metade responde (+8,8%) e metade não. */
export const THETA_ALL: readonly number[] = Array.from({ length: N }, () => TRUE_MEAN);
export const THETA_HALF: readonly number[] = Array.from({ length: N }, (_, i) => (i % 2 === 0 ? 2 * TRUE_MEAN : 0));

/** Tira de `z` a parte correlacionada com o padrão de resposta e padroniza de novo (o ruído vira independente da verdade). */
const orthogonalize = (z: readonly number[], pattern: readonly number[]): number[] => {
    const pm = mean(pattern);
    const dev = pattern.map(v => v - pm);
    const dot = z.reduce((acc, v, i) => acc + v * dev[i], 0) / dev.reduce((acc, v) => acc + v * v, 0);
    return standardize(z.map((v, i) => v - dot * dev[i]));
};

/** Ruído padronizado (média 0, DP 1) de cada braço; o seed 6864 dá uma faixa de −10% a +23%, próxima à de Coggan. */
export const Z_SUPP_ALL = standardize(normals(6864, N));
export const Z_PLAC_ALL = standardize(normals(33, N));
export const Z_SUPP_HALF = orthogonalize(normals(21, N), THETA_HALF);
export const Z_PLAC_HALF = standardize(normals(45, N));

/** Mudança observada: resposta verdadeira + erro de medida, que cai com √(medidas por condição). */
export const observed = (theta: readonly number[], z: readonly number[], measures: number): number[] =>
    theta.map((t, i) => t + (NOISE_SD / Math.sqrt(measures)) * z[i]);

export const ascending = (xs: readonly number[]): number[] => [...xs].sort((a, b) => a - b);

/** DP da resposta verdadeira estimado: √(DP_ativo² − DP_placebo²), zero se o ativo não passar. */
export const trueSd = (supp: readonly number[], plac: readonly number[]): number => {
    const diff = sd(supp) ** 2 - sd(plac) ** 2;
    return diff > 0 ? Math.sqrt(diff) : 0;
};

export const countAbove = (xs: readonly number[], cut: number): number => xs.filter(v => v > cut).length;
export const countBelow = (xs: readonly number[], cut: number): number => xs.filter(v => v < cut).length;
