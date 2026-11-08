/*
 * Presença de cada sistema da cena em cada etapa (0 a 1, interpolada entre etapas vizinhas).
 * A ordem das colunas é a das 8 etapas: boca, intestino, glândulas, língua, estômago, plasma,
 * músculo, excreção. Corrente = grupo de íons que percorre uma rota.
 */

export const WEIGHTS = {
    swallow: [1, 0.7, 0, 0, 0, 0, 0, 0],
    absorb: [0, 1, 0.3, 0, 0, 0, 0, 0],
    plasmaP: [0, 0.5, 1, 0.35, 0.3, 0.7, 0.3, 0],
    plasmaS: [0, 0.4, 1, 0.35, 0.3, 0.6, 0.2, 0],
    plasmaK: [0, 0.2, 0, 0, 0, 0.7, 0.25, 1],
    plasmaL: [0, 0.2, 0, 0, 0, 0.9, 1, 0.3],
    salivaP: [0, 0, 0.8, 1, 0.6, 0.45, 0.15, 0],
    salivaS: [0, 0, 0.8, 1, 0.6, 0.45, 0.15, 0],
    urine: [0, 0, 0, 0, 0, 0, 0.1, 1],
    bladder: [0, 0, 0, 0, 0, 0, 0.1, 1],
    noStomach: [0, 0, 0, 0.2, 1, 0.3, 0, 0],
    noMuscle: [0, 0, 0, 0, 0, 0.3, 1, 0.2],
    hypoxia: [0, 0, 0, 0, 0, 0.15, 1, 0.15],
    glass: [1, 0.15, 0, 0, 0, 0, 0, 0],
    sialin: [0, 0.2, 1, 0.4, 0, 0, 0, 0],
    acid: [0, 0, 0, 0.15, 1, 0.2, 0, 0],
} as const satisfies Record<string, readonly number[]>;

export type WeightKey = keyof typeof WEIGHTS;
export const WEIGHT_KEYS = Object.keys(WEIGHTS) as WeightKey[];

/** Peso de uma linha da tabela no instante contínuo T (interpola entre as duas etapas vizinhas). */
export const weightAt = (row: readonly number[], T: number): number => {
    const x = Math.min(Math.max(T, 0), row.length - 1);
    const i = Math.min(Math.floor(x), row.length - 2);
    const k = x - i;
    return row[i] * (1 - k) + row[i + 1] * k;
};
