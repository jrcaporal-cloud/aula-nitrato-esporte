import { normals } from './random';
import { mean, nForPower, normCdf, pairedPower, sd, tCrit95 } from './stats';

/** Modelo do StatPowerSim (slide 64): poder, multiplicidade e filtro da significância. Cálculo/ilustrativo. */

export const CV_TT = 3.35;
export const TYPICAL_N = 10;

/** Chance de pelo menos um p < 0,05 em k testes independentes com efeito real zero. */
export const familywiseRate = (k: number): number => 1 - 0.95 ** k;

/** Poder (0-1) do cruzado de n atletas para um efeito (% no contrarrelógio). */
export const powerAt = (n: number, effect: number): number => pairedPower(n, effect, CV_TT);

export const nAt80 = (effect: number): number => nForPower(effect, CV_TT);

/** Trinta valores p de testes sem efeito real: uniformes, sempre os mesmos (semente fixa). */
export const NULL_P_VALUES: readonly number[] = normals(7, 30).map(normCdf);

export interface SimStudy {
    id: number;
    /** Efeito observado (%) e erro padrão (%). */
    effect: number;
    se: number;
    significant: boolean;
}

/** 100 réplicas do mesmo estudo: n atletas, efeito real e CV dados, p < 0,05 a favor do suplemento. */
export const simulateStudies = (seed: number, count: number, n: number, effect: number, cv: number): SimStudy[] => {
    const z = normals(seed, count * n);
    const crit = tCrit95(n - 1);
    return Array.from({ length: count }, (_, i) => {
        const diffs = z.slice(i * n, (i + 1) * n).map(v => effect + Math.SQRT2 * cv * v);
        const m = mean(diffs);
        const se = sd(diffs) / Math.sqrt(n);
        return { id: i, effect: m, se, significant: m / se > crit };
    });
};

export const FILTER_STUDIES = simulateStudies(11, 100, TYPICAL_N, 1, CV_TT);

/** Erro tipo I da MBI com n de 8 a 15 por grupo (LOHSE2020): faixas em %. */
export const MBI_ERRORS = [
    { label: 'critério “provável”', lo: 12, hi: 22 },
    { label: 'critério “possível”', lo: 22, hi: 45 },
] as const;
