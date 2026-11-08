import { clamp01, smooth } from '../shared/math';

/*
 * O modelo didático por trás das cores e dos gráficos. Âncoras do dossiê 01:
 *  - taxa de redução do nitrito pela Hb com máximo a 40–60% de saturação (HUANG2005);
 *  - EC₅₀ do nitrito 200 µM (pH 7,4) → 40 µM (pH 6,6) (MODIN2001).
 * A FORMA das curvas (quão rápido a NOS cai, a largura do pico, o limiar da XOR) é ILUSTRATIVA.
 */

export const PH_REST = 7.4;
export const PH_ACID = 6.6;
export const EC50_REST = 200;
export const EC50_ACID = 40;
/** Quanto o pH ácido multiplica a potência do nitrito (200 / 40). */
export const POT_MAX = EC50_REST / EC50_ACID;

/** 0 em pH 7,4 → 1 em pH 6,6. */
export const acidity = (ph: number) => clamp01((PH_REST - ph) / (PH_REST - PH_ACID));

/** Potência relativa do nitrito (1 a 5), interpolada em escala logarítmica entre as duas âncoras. */
export const potency = (ph: number) => Math.pow(POT_MAX, acidity(ph));

/** EC₅₀ do nitrito (µM); só as duas pontas são dado, o meio é cálculo (interpolação). */
export const ec50 = (ph: number) => EC50_REST / potency(ph);

/** NOS: depende de O₂ como substrato, então apaga quando a saturação cai (forma ilustrativa). */
export const nosActivity = (sat: number) => 1 / (1 + Math.exp(-(sat - 0.62) / 0.07));

/** Redução do nitrito pela Hb: pico em 40–60% de saturação (HUANG2005), não uma rampa. */
export const hbReduction = (sat: number) => Math.exp(-Math.pow(Math.abs(sat - 0.5) / 0.14, 4));

/** Rendimento de NO da Hb: o pico, multiplicado pela potência do nitrito naquele pH (1/5 em repouso). */
export const hbYield = (sat: number, ph: number) => (hbReduction(sat) * potency(ph)) / POT_MAX;

/** XOR: só liga em hipóxia (MILLAR1998); o limiar é esquemático. */
export const xorActivity = (sat: number) => smooth(clamp01((0.5 - sat) / 0.2));

/** Desoxi-mioglobina: cresce com a hipóxia e com a acidez. */
export const mbYield = (sat: number, ph: number) => (1 - sat) * (0.4 + 0.6 * acidity(ph));

/** Interruptores por etapa: as redutoras entram na cena uma a uma, para a história ter ordem. */
export interface Gates { hb: number; mb: number; xor: number }

export interface Rates { nos: number; hb: number; mb: number; xor: number; total: number }

export const rates = (sat: number, ph: number, g: Gates): Rates => {
    const nos = nosActivity(sat);
    const hb = hbYield(sat, ph) * g.hb;
    const mb = mbYield(sat, ph) * g.mb;
    const xor = xorActivity(sat) * g.xor;
    return { nos, hb, mb, xor, total: clamp01(0.55 * nos + 0.62 * hb + 0.5 * mb + 0.25 * xor) };
};

/** Amostras de uma curva em saturação 0–1 (para o gráfico). */
export const sampleCurve = (f: (sat: number) => number, n = 48): number[] =>
    Array.from({ length: n + 1 }, (_, i) => f(i / n));
