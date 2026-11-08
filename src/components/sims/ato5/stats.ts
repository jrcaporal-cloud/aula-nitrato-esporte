/** Estatística mínima para as simulações do Ato V (funções puras, sem estado). */

export const mean = (xs: readonly number[]): number => xs.reduce((s, x) => s + x, 0) / Math.max(xs.length, 1);

/** Desvio-padrão amostral (n − 1). */
export const sd = (xs: readonly number[]): number => {
    if (xs.length < 2) return 0;
    const m = mean(xs);
    return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1));
};

/** Função de distribuição da normal padrão (erro < 1,5e-7). */
export const normCdf = (x: number): number => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp((-x * x) / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - p : p;
};

/** Valor crítico bicaudal de t para α = 0,05 (Cornish–Fisher; erro < 0,01 para gl ≥ 3). */
export const tCrit95 = (df: number): number => {
    const z = 1.959964;
    const g1 = (z ** 3 + z) / 4;
    const g2 = (5 * z ** 5 + 16 * z ** 3 + 3 * z) / 96;
    const g3 = (3 * z ** 7 + 19 * z ** 5 + 17 * z ** 3 - 15 * z) / 384;
    return z + g1 / df + g2 / df ** 2 + g3 / df ** 3;
};

/**
 * Poder de um teste t pareado bicaudal (α 5%) para uma diferença `delta` entre condições.
 * O DP da diferença de um cruzado com UMA medida por condição é √2 × CV (erro típico, em %).
 * Usa a aproximação normal da t não central (Abramowitz & Stegun 26.7.10).
 */
export const pairedPower = (n: number, delta: number, cv: number): number => {
    if (n < 3) return 0.05;
    const df = n - 1;
    const lambda = (delta * Math.sqrt(n)) / (Math.SQRT2 * cv);
    const t = tCrit95(df);
    const scale = Math.sqrt(1 + (t * t) / (2 * df));
    const shift = 1 - 1 / (4 * df);
    const upper = 1 - normCdf((t * shift - lambda) / scale);
    const lower = normCdf((-t * shift - lambda) / scale);
    return Math.min(upper + lower, 0.999);
};

/** Menor n (pares) com poder ≥ `target` para detectar `delta`; devolve `max` se passar do teto. */
export const nForPower = (delta: number, cv: number, target = 0.8, max = 2000): number => {
    for (let n = 4; n <= max; n++) if (pairedPower(n, delta, cv) >= target) return n;
    return max;
};
