import { C } from '../kit/palette';

/** Slide 80 — dados do FoodNitrateSim. Fontes: EFSA2008, FAVARO2007, KRAEMER2020, WRUSS2015, JONVIK2017, GALLARDO2019. */

export type FoodId = 'rucula' | 'beterraba' | 'espinafre' | 'aipo';

export interface Food {
    id: FoodId;
    name: string;
    /** Mediana europeia, mg de nitrato por kg de vegetal fresco (EFSA 2008). */
    mgPerKg: number;
    color: string;
    /** Gramas que equivalem a 1 shot (6,41 mmol), arredondadas como no dossiê (cálculo). */
    shotGrams: string;
    /** Faixa do slider do prato. */
    max: number;
    step: number;
}

export const FOODS: readonly Food[] = [
    { id: 'rucula', name: 'Rúcula', mgPerKg: 4800, color: C.nitrate, shotGrams: '83', max: 250, step: 5 },
    { id: 'beterraba', name: 'Beterraba', mgPerKg: 1100, color: '#C0266B', shotGrams: '360', max: 600, step: 10 },
    { id: 'espinafre', name: 'Espinafre', mgPerKg: 785, color: C.nitrateSoft, shotGrams: '500', max: 600, step: 10 },
    { id: 'aipo', name: 'Aipo (talo)', mgPerKg: 693, color: '#FBCFE8', shotGrams: '570', max: 600, step: 10 },
];

export type Plate = Readonly<Record<FoodId, number>>;

/** Prato inicial: 60 g de rúcula + 100 g de beterraba ≈ 1 shot (cálculo). */
export const START_PLATE: Plate = { rucula: 60, beterraba: 100, espinafre: 0, aipo: 0 };

export const FOOD_TABS = ['Por quilo', 'Um shot', 'Seu prato', 'Cultivo', 'Elite'] as const;

/** Barras do passo "Cultivo": alface lisa em Pirassununga-SP e hidroponia no Vale do Taquari-RS. */
export interface CultivoBar {
    id: string;
    label: string;
    group: 'SP' | 'RS';
    mgPerKg: number;
    color: string;
}

export const CULTIVO: readonly CultivoBar[] = [
    { id: 'sp-org', label: 'Alface orgânica', group: 'SP', mgPerKg: 565, color: C.nitrateSoft },
    { id: 'sp-conv', label: 'Alface convencional', group: 'SP', mgPerKg: 2782, color: C.nitrate },
    { id: 'sp-hid', label: 'Alface hidropônica', group: 'SP', mgPerKg: 3093, color: C.nitrate },
    { id: 'rs-alface', label: 'Alface hidropônica', group: 'RS', mgPerKg: 2106, color: '#C0266B' },
    { id: 'rs-rucula', label: 'Rúcula hidropônica', group: 'RS', mgPerKg: 6255, color: '#C0266B' },
];

/** Ingestão habitual de 553 atletas holandeses (JONVIK2017), em mg/dia. */
export const ELITE_INTAKE = { median: 106, q1: 75, q3: 170, min: 19, max: 525 } as const;

export const FOOD_SOURCES = {
    kg: 'EFSA 2008 · 41.969 análises de 20 países europeus + Noruega · medianas, não dado brasileiro',
    shot: 'Cálculo: 397 mg (6,41 mmol × 62) ÷ mediana EFSA 2008 de cada vegetal',
    plate: 'Cálculo com medianas EFSA 2008 · 1 mmol = 62 mg · IOC 2018 e Delphi 2022',
    cultivo: 'Favaro-Trindade 2007 (Pirassununga-SP) · Kraemer 2020 (Vale do Taquari-RS) · Wruss 2015',
    elite: 'Jonvik 2017 · 553 atletas holandeses muito treinados · recordatório de 24 h',
} as const;
