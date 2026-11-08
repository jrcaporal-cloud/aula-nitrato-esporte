import { clamp } from './hooks';

/**
 * Curvas de uma dose oral de nitrato (PharmacokineticsSim). Cada curva é normalizada pelo PRÓPRIO pico.
 * São DADOS: pico do nitrato plasmático em 1–2 h, do nitrito em 2–3 h, do nitrato muscular em 3 h (181 nmol/g),
 * meia-vida do nitrato ~5 h, muscular sem diferença do basal a partir de 9 h, plasma de volta ao basal em ~24 h.
 * A FORMA entre esses pontos é ilustrativa.
 */

export type PkRow = 'nitrate' | 'nitrite' | 'muscle';

/** Doses do ensaio de dose-resposta (Wylie 2013) e altura relativa ILUSTRATIVA do nitrito em cada uma. */
export const DOSES = [
    { mmol: 4.2, ml: 70, scale: 0.25 },
    { mmol: 8.4, ml: 140, scale: 0.5 },
    { mmol: 16.8, ml: 280, scale: 1 },
] as const;

/** Duas exponenciais (absorção e eliminação) normalizadas pelo pico. */
const bateman = (ka: number, ke: number, tPeak: number) => {
    const peak = Math.exp(-ke * tPeak) - Math.exp(-ka * tPeak);
    return (t: number) => (t <= 0 ? 0 : (Math.exp(-ke * t) - Math.exp(-ka * t)) / peak);
};

// ke = ln2 / 5 h (Wagner 1983); ka escolhido para o pico cair em 1,5 h.
const nitrateCurve = bateman(1.87, Math.LN2 / 5, 1.5);
// Pico em 2,5 h (meio de 2–3 h); queda mais rápida que a do nitrato.
const nitriteCurve = bateman(0.6, 0.25, 2.5);

/** Nitrato muscular: sobe até 3 h e já não difere do basal a partir de 9 h (Kadach 2022). */
const muscleBump = (t: number): number => {
    const sigma = t < 3 ? 2.2 : 3.0;
    return Math.exp(-(((t - 3) / sigma) ** 2));
};
const muscleCurve = (t: number): number => {
    const floor = muscleBump(0);
    return t <= 0 ? 0 : clamp((muscleBump(t) - (t < 3 ? floor : 0)) / (1 - (t < 3 ? floor : 0)), 0, 1);
};

export const curveOf = (row: PkRow, t: number): number =>
    row === 'nitrate' ? nitrateCurve(t) : row === 'nitrite' ? nitriteCurve(t) : muscleCurve(t);

/** Janelas de pico de cada curva, em horas. */
export const PEAK_WINDOW: Record<PkRow, [number, number]> = {
    nitrate: [1, 2],
    nitrite: [2, 3],
    muscle: [2.6, 3.4],
};

/** Situação qualitativa da curva no instante t. */
export const statusOf = (row: PkRow, t: number): string => {
    const [a, b] = PEAK_WINDOW[row];
    if (t < a) return 'subindo';
    if (t <= b) return 'no pico';
    return curveOf(row, t) > 0.1 ? 'caindo' : 'no basal';
};

/** Eixo de tempo em duas escalas: 0–6 h ocupa 55% da largura, 6–24 h os outros 45%. */
const SPLIT_T = 6;
const SPLIT_X = 0.55;
export const axisOf = (t: number): number =>
    t <= SPLIT_T ? (SPLIT_X * t) / SPLIT_T : SPLIT_X + ((1 - SPLIT_X) * (t - SPLIT_T)) / (24 - SPLIT_T);
export const timeOf = (u: number): number =>
    u <= SPLIT_X ? (u / SPLIT_X) * SPLIT_T : SPLIT_T + ((u - SPLIT_X) / (1 - SPLIT_X)) * (24 - SPLIT_T);
