import { clamp } from './hooks';

/**
 * Modelo didático das duas vias (TwoPathwaysSim e NitriteReductasesSim).
 * Os DADOS são: pico da redução de nitrito pela Hb a 40–60% de saturação (Huang 2005) e
 * EC₅₀ do nitrito de 200 µM (pH 7,4) para 40 µM (pH 6,6) (Modin 2001). A forma das curvas é ilustrativa.
 */

/** Faixa de saturação em que a hemoglobina reduz nitrito com taxa máxima (Huang 2005). */
export const PEAK_BAND: [number, number] = [40, 60];

/** EC₅₀ do nitrito como vasodilatador, em µM, nos dois pH medidos (Modin 2001). */
export const EC50_NEUTRAL = 200;
export const EC50_ACID = 40;

/** Atividade relativa da NOS: acende com O₂, apaga quando a saturação cai. */
export const nosActivity = (sat: number): number => 1 / (1 + Math.exp(-(sat - 35) / 9));

/** Ganho de potência do nitrito com a acidez: 1× em pH 7,4 até 5× em pH 6,6 (EC₅₀ 200 → 40 µM). */
export const phGain = (ph: number): number => 1 + ((EC50_NEUTRAL / EC50_ACID) - 1) * clamp((7.4 - ph) / 0.8, 0, 1);

/** Redução do nitrito pela hemoglobina: sino centrado em 50% de saturação, multiplicado pela acidez. */
export const nitriteReduction = (sat: number, ph: number): number =>
    clamp(0.2 * phGain(ph) * Math.exp(-(((sat - 50) / 20) ** 2)), 0, 1);

/** EC₅₀ (µM) em um pH qualquer: interpolação log-linear entre os dois pontos medidos. */
export const ec50At = (ph: number): number => {
    const k = clamp((7.4 - ph) / 0.8, 0, 1);
    return Math.exp(Math.log(EC50_NEUTRAL) + k * (Math.log(EC50_ACID) - Math.log(EC50_NEUTRAL)));
};

/** Fração da acidez (0 em pH 7,4 … 1 em pH 6,6). */
export const acidity = (ph: number): number => clamp((7.4 - ph) / 0.8, 0, 1);

/**
 * Desoxi-mioglobina: só existe quando o O₂ do tecido cai muito (limiar ilustrativo) e rende mais com acidez.
 * A velocidade ~36× a da hemoglobina (Shiva 2007) é DADO; este número entra só como rótulo.
 */
export const mbActivity = (sat: number, ph: number): number =>
    clamp((1 / (1 + Math.exp((sat - 24) / 7))) * (0.55 + 0.45 * acidity(ph)), 0, 1);

/** XOR: sem NO em normóxia, liga só em hipóxia (Millar 1998); a leve acidez a favorece (Piknova 2016). Limiar ilustrativo. */
export const xorActivity = (sat: number, ph: number): number =>
    clamp((1 / (1 + Math.exp((sat - 18) / 5))) * (0.55 + 0.45 * acidity(ph)), 0, 1);
