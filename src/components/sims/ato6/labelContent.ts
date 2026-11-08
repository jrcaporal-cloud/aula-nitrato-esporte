import { C } from '../kit/palette';

/** Slide 81 — dados do LabelSim. Fonte única: GALLARDO2019 (Int J Sport Nutr Exerc Metab 2019;29(4):345-349). */

export const LABEL_TABS = ['Gôndola', 'Só 5 passam', 'Rótulo × medido', 'Por que erra'] as const;

export const SHELVES = ['Pós', 'Bebidas mistas', 'Concentrados', 'Sucos a granel'] as const;

/** Índices (0–23) dos 5 frascos que entregaram ≥5 mmol por porção. A posição é ilustrativa; só a contagem é do estudo. */
export const PASS_INDEXES: readonly number[] = [3, 9, 14, 16, 21];

export interface Example {
    id: string;
    name: string;
    serving: string;
    /** mmol por porção no rótulo; ausente quando o dossiê não traz o rótulo. */
    label?: number;
    measured: number;
    /** Desvio-padrão do medido, quando informado. */
    sd?: number;
}

export const EXAMPLES: readonly Example[] = [
    { id: 'sport', name: 'Beet It Sport Pro-Elite', serving: 'shot 70 mL', label: 6.45, measured: 6.41, sd: 0.6 },
    { id: 'organic', name: 'Beet It Organic', serving: 'shot 70 mL', label: 4.84, measured: 5.93 },
    { id: 'rush', name: 'Red Rush', serving: '74 mL', label: 8.06, measured: 2.39, sd: 1.97 },
    { id: 'elite', name: 'BeetElite', serving: 'porção', measured: 2.16 },
    { id: 'super', name: 'Superbeets', serving: '5 g de pó', measured: 1.03 },
];

/** Faixa dos 6 pós analisados (mmol por porção). */
export const POWDER_RANGE = { lo: 0.4, hi: 2.6 } as const;

export interface Category {
    id: string;
    name: string;
    mean: string;
    unit: string;
    color: string;
}

export const CATEGORIES: readonly Category[] = [
    { id: 'po', name: 'Pós', mean: '174 ± 63', unit: 'µmol por g', color: C.nitrate },
    { id: 'conc', name: 'Concentrados', mean: '70 ± 39', unit: 'µmol por mL', color: C.nitrateSoft },
    { id: 'suco', name: 'Sucos a granel', mean: '18 ± 11', unit: 'µmol por mL', color: C.nitrate },
    { id: 'mista', name: 'Bebidas mistas', mean: '13 ± 5', unit: 'µmol por mL', color: C.nitrateSoft },
];

export const LABEL_SOURCE = 'Gallardo & Coggan 2019 · 45 lotes de 24 produtos de 21 empresas · compras nos EUA, 09/2017–06/2018 · HPLC';
