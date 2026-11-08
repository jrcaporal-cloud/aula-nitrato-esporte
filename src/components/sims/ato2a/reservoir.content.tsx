import type { ReactNode } from 'react';
import { C } from '../kit/palette';
import { Hl } from './ui';

export type ReservoirMode = 'basal' | 'dose' | 'machinery' | 'exercise' | 'rat';

export interface ReservoirStat { value: string; label: string; color: string }

export interface ReservoirStep {
    tab: string;
    mode: ReservoirMode;
    headline: string;
    text: ReactNode;
    source: string;
    stats: readonly ReservoirStat[];
}

export const RESERVOIR_STEPS: readonly ReservoirStep[] = [
    {
        tab: 'Estoque', mode: 'basal',
        headline: 'O músculo é o grande estoque',
        text: <>Em repouso, o vasto lateral guarda cerca de <Hl c={C.nitrate}>4×</Hl> o nitrato e <Hl c={C.nitrite}>29×</Hl> o nitrito do plasma. O sangue é só a via de passagem; o compartimento é o músculo.</>,
        source: 'Wylie 2019 (J Physiol) · biópsias do vasto lateral, jovens saudáveis',
        stats: [
            { value: '~4×', label: 'nitrato no músculo, em relação ao plasma', color: C.nitrate },
            { value: '~29×', label: 'nitrito no músculo, em relação ao plasma', color: C.nitrite },
        ],
    },
    {
        tab: 'Dose', mode: 'dose',
        headline: 'A dose enche o estoque',
        text: <>Duas horas depois de 12,8 mmol, o nitrato sobe ~19× no plasma e ~5× no músculo: os dois compartimentos quase se igualam. O pico muscular vem às 3 h.</>,
        source: 'Wylie 2019 · Kadach 2022 · razão ≈ 1 é cálculo a partir de 1082 e 1139 nmol/g',
        stats: [
            { value: '~19×', label: 'nitrato no plasma, 2 h após a dose', color: C.nitrateSoft },
            { value: '~5×', label: 'nitrato no músculo, 2 h após a dose', color: C.nitrate },
            { value: '~3×', label: 'nitrito no plasma; no músculo, sem significância (p = 0,13)', color: C.nitrite },
        ],
    },
    {
        tab: 'Maquinaria', mode: 'machinery',
        headline: 'A fibra tem a maquinaria inteira',
        text: <>O músculo humano expressa a <Hl c={C.nitrateSoft}>sialina</Hl>, que importa nitrato, e a <Hl c={C.hypoxia}>XOR</Hl>, que o reduz em hipóxia. Em cultura, só o miotubo maduro faz nitrito: a maquinaria vem com a diferenciação.</>,
        source: 'Wylie 2019 · Srihirun 2020 (Nitric Oxide)',
        stats: [
            { value: 'sialina + XOR', label: 'detectadas no músculo esquelético humano', color: C.nitrateSoft },
            { value: 'só o miotubo', label: 'maduro produz nitrito em cultura', color: C.nitrite },
        ],
    },
    {
        tab: 'Esforço', mode: 'exercise',
        headline: 'O esforço gasta o estoque',
        text: <>Exercício de alta intensidade reduziu o nitrato muscular em <Hl c={C.hypoxia}>~39%</Hl> — mas só quando o estoque estava elevado pela dose. Sem estoque, não há o que gastar.</>,
        source: 'Wylie 2019 · 12,8 mmol de nitrato vs placebo',
        stats: [
            { value: '−39%', label: 'do nitrato muscular após exercício intenso', color: C.hypoxia },
            { value: 'só com estoque', label: 'elevado pela suplementação', color: C.text },
        ],
    },
    {
        tab: 'Rato', mode: 'rat',
        headline: 'O vasodilatador de um século',
        text: <>No rato que corre, o nitrato muscular despenca e o nitrito sobe de forma transitória, com XOR e leve acidez. Pode explicar o vasodilatador do músculo, postulado há mais de 100 anos.</>,
        source: 'Piknova 2016 (Nitric Oxide) · ratos Wistar na esteira',
        stats: [
            { value: '> 100 anos', label: 'de espera pelo vasodilatador gerado pelo músculo que contrai', color: C.no },
        ],
    },
];

/** Concentrações relativas ao plasma basal (= 1) em cada modo, para as quatro barras. */
export interface Bars { nitratePlasma: number; nitrateMuscle: number; nitritePlasma: number; nitriteMuscle: number }

export const BARS_BY_MODE: Record<ReservoirMode, Bars> = {
    basal: { nitratePlasma: 1, nitrateMuscle: 4, nitritePlasma: 1, nitriteMuscle: 29 },
    // ×19 e ×5 sobre o basal; 4 × 5 = 20 é cálculo. Nitrito muscular ~3×, mas sem significância: a barra fica no basal.
    dose: { nitratePlasma: 19, nitrateMuscle: 20, nitritePlasma: 3, nitriteMuscle: 29 },
    machinery: { nitratePlasma: 19, nitrateMuscle: 20, nitritePlasma: 3, nitriteMuscle: 29 },
    exercise: { nitratePlasma: 19, nitrateMuscle: 20 * 0.61, nitritePlasma: 3, nitriteMuscle: 29 },
    rat: { nitratePlasma: 1, nitrateMuscle: 4, nitritePlasma: 1, nitriteMuscle: 29 },
};
