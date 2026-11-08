/** Constantes e contas comuns aos simuladores do Ato VI (O Veredito). */

/** Altura da caixa do simulador (o título e o subtítulo do slide ocupam o resto do palco). */
export const SIM_H = 510;

/** Química: 1 mmol de nitrato (NO₃⁻) = 62 mg (massa molar 62,0 g/mol). */
export const MG_PER_MMOL = 62;

/** Shot de 70 mL medido por Gallardo & Coggan 2019 (Beet It Sport Pro-Elite): 6,41 ± 0,60 mmol. */
export const SHOT_MMOL = 6.41;

/** Faixas de dose de referência (mmol de nitrato). */
export const DOSE_BANDS = {
    ioc: { lo: 5, hi: 9, label: 'IOC 2018: 5–9 mmol' },
    delphi: { lo: 8, hi: 16, label: 'Delphi 2022: 8–16 mmol (agudo)' },
} as const;

/** Gramas de um vegetal (mediana em mg/kg) que entregam `mmol` de nitrato. */
export const gramsFor = (mmol: number, mgPerKg: number): number => (mmol * MG_PER_MMOL) / (mgPerKg / 1000);

export const mgToMmol = (mg: number): number => mg / MG_PER_MMOL;
export const mmolToMg = (mmol: number): number => mmol * MG_PER_MMOL;

/** Número em português, com separador de milhar e vírgula decimal ("4.800", "6,4"). */
export const num = (n: number, casas = 0): string =>
    n.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });

/** Sinal tipográfico explícito (+ / −). */
export const sgn = (n: number, casas = 1): string => `${n > 0 ? '+' : n < 0 ? '−' : ''}${num(Math.abs(n), casas)}`;

/** Limita um valor ao intervalo [lo, hi]. */
export const clamp = (n: number, lo: number, hi: number): number => Math.min(Math.max(n, lo), hi);
