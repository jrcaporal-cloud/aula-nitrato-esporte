import { seg, smooth } from '../shared/math';

/*
 * Relógio da dose e curvas de densidade que comandam quantos íons aparecem. Os números de tempo
 * (picos 1–2 h, 2–3 h, 3 h; meia-vida ~5 h; ~60% na urina em 48 h) são do dossiê 01; a FORMA das
 * curvas entre eles é ilustrativa (só regula a densidade de partículas, nunca é mostrada em número).
 */

export const HALF_LIFE_H = 5;
export const URINE_48H = 0.6;

/** Janela de horas que o relógio varre em cada etapa (etapa 8: do fim do pico até 48 h). */
export const STEP_CLOCK: readonly (readonly [number, number])[] = [
    [0, 0.2], [0.2, 1.5], [1, 2], [1.5, 2.5], [1.5, 3], [2, 3], [3, 4], [4, 48],
];
/** Segundos de relógio da aula que a varredura de cada etapa leva depois de a câmera assentar. */
export const SWEEP_S = 6.5;

const decay = (h: number, from: number): number => Math.pow(2, -(h - from) / HALF_LIFE_H);

/** Nitrato plasmático: sobe até o pico em 1–2 h (1,5 h) e cai com meia-vida de ~5 h. */
export const plasmaNitrate = (h: number): number => (h < 1.5 ? smooth(seg(h, 0, 1.5)) : decay(h, 1.5));
/** Nitrito plasmático: pico em 2–3 h (2,5 h). */
export const plasmaNitrite = (h: number): number => (h < 2.5 ? smooth(seg(h, 0.7, 2.5)) : decay(h, 2.5));
/** Nitrato muscular: pico em 3 h, levemente atrasado em relação ao plasma. */
export const muscleNitrate = (h: number): number => (h < 3 ? smooth(seg(h, 0.5, 3)) : decay(h, 3));
/** Fração da dose já excretada na urina (0 → 60% em 48 h). */
export const excreted = (h: number): number => URINE_48H * (1 - Math.pow(2, -h / 12)) / (1 - Math.pow(2, -4));

/** Formata horas com vírgula decimal (1,5 h). */
export const hoursLabel = (h: number): string => `${h.toFixed(1).replace('.', ',')} h`;
