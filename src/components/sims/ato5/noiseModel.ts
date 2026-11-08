import { normals } from './random';
import { mean, normCdf, nForPower, sd } from './stats';

/** Modelo do TestNoiseSim (slide 63). Os CV são dados dos estudos; os pontos e as curvas são ilustrativos. */

export interface NoiseStudy {
    id: string;
    label: string;
    /** CV (%) do tempo até a exaustão e do contrarrelógio nos MESMOS sujeitos. */
    tte: number;
    tt: number;
    caption: string;
}

export const NOISE_STUDIES: readonly NoiseStudy[] = [
    { id: 'jeuk', label: 'Jeukendrup 1996', tte: 26.6, tt: 3.35, caption: '30 bem treinados, 6 repetições' },
    { id: 'laur5', label: 'Laursen 2007 · 5 km', tte: 15.1, tt: 2.0, caption: '8 corredores, mesma velocidade' },
    { id: 'laur15', label: 'Laursen 2007 · 1.500 m', tte: 13.2, tt: 3.3, caption: '8 corredores, mesma velocidade' },
];

/** Oito repetições padronizadas (média 0, DP 1), sempre as mesmas: a nuvem muda de largura, não de forma. */
const standardized = (seed: number): number[] => {
    const z = normals(seed, 8);
    const m = mean(z);
    const s = sd(z);
    return z.map(v => (v - m) / s);
};
export const Z_TTE = standardized(100);
export const Z_TT = standardized(68);

/** Mudança medida por Amann 2008 (8 ciclistas): média e DP das mudanças, em %. */
export const AMANN = {
    tte: [{ cond: 'hipóxia', mean: -45, sd: 13 }, { cond: 'hiperóxia', mean: 123, sd: 37 }],
    tt: [{ cond: 'hipóxia', mean: 5.7, sd: 1.6 }, { cond: 'hiperóxia', mean: -4.1, sd: 1.4 }],
} as const;

/** Razão sinal/ruído = |mudança| ÷ DP (cálculo). */
export const signalToNoise = (m: number, s: number): number => Math.abs(m) / s;

/** CV usados no cálculo de n (mesmos sujeitos de Jeukendrup 1996). */
export const CV_TTE = 26.6;
export const CV_TT = 3.35;
/** Conversão ilustrativa: 1% no contrarrelógio ≈ 10% no TTE (ordem de grandeza de Hinckson 2005). */
export const TTE_PER_TT = 10;
/** n típico da área (Lohse 2020). */
export const TYPICAL_N = 10;

/** Fração dos atletas que "parece melhorar" quando medidos uma vez por braço (cálculo). */
export const looksBetter = (delta: number, cv: number): number => normCdf(delta / (Math.SQRT2 * cv));

export const athletesNeeded = (deltaTT: number) => ({
    tt: nForPower(deltaTT, CV_TT),
    tte: nForPower(deltaTT * TTE_PER_TT, CV_TTE),
});

/** Densidade normal escalada para pico 1. */
export const bell = (x: number, mu: number, sigma: number): number => Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma));
