import type { ReactNode } from 'react';
import { C } from '../kit/palette';
import type { PkRow } from './pkModel';
import { Hl } from './ui';

export interface PkStat { value: string; label: string; color: string }

export interface PkStep {
    tab: string;
    headline: string;
    text: ReactNode;
    source: string;
    /** Instante do cursor (h) neste passo. */
    t: number;
    focus: PkRow | null;
    stats: readonly PkStat[];
    byDose?: boolean;
}

export const PK_STEPS: readonly PkStep[] = [
    {
        tab: 'Nitrato', t: 1.5, focus: 'nitrate',
        headline: 'O copo vira sangue depressa',
        text: <>Absorvido no intestino, o <Hl c={C.nitrate}>nitrato</Hl> chega ao plasma e pica em 1–2 h. A curva sobe rápido e desce devagar: a meia-vida do nitrato no corpo é de cerca de 5 horas.</>,
        source: 'Jones 2014 (Sports Med) · Wagner 1983 (¹⁵N, 12 adultos)',
        stats: [
            { value: '1–2 h', label: 'pico do nitrato no plasma', color: C.nitrate },
            { value: '~5 h', label: 'meia-vida do nitrato no corpo', color: C.nitrateSoft },
        ],
    },
    {
        tab: 'Nitrito', t: 2.5, focus: 'nitrite',
        headline: 'O nitrito chega depois',
        text: <>O <Hl c={C.nitrite}>nitrito</Hl> pica em 2–3 h, atrasado em relação ao nitrato: não vem no copo, é fabricado pela boca com o nitrato que circula. Daí a janela de 2–4 h antes do esforço.</>,
        source: 'Jones 2014 · Wylie 2013 (J Appl Physiol)',
        stats: [
            { value: '2–3 h', label: 'pico do nitrito no plasma', color: C.nitrite },
            { value: '~25%', label: 'do nitrato circulante passa pela saliva', color: C.nitrateSoft },
        ],
    },
    {
        tab: 'Músculo', t: 3, focus: 'muscle',
        headline: 'O músculo pica às 3 horas',
        text: <>O <Hl c={C.nitrateSoft}>nitrato muscular</Hl> acompanha o plasma com leve atraso: já elevado em 30 min (54 nmol/g), pico de 181 nmol/g em 3 h e sem diferença do basal a partir de 9 h.</>,
        source: 'Kadach 2022 (Nitric Oxide) · biópsias seriadas, 12,8 mmol, n = 16',
        stats: [
            { value: '181 nmol/g', label: 'nitrato muscular às 3 h (dose de 12,8 mmol)', color: C.nitrateSoft },
            { value: '9 h', label: 'sem diferença do basal no músculo', color: C.text },
        ],
    },
    {
        tab: 'Saída', t: 24, focus: null,
        headline: 'Uma dose é um fenômeno de horas',
        text: <>Em 48 h, cerca de <Hl c={C.nitrate}>60% da dose</Hl> aparece na urina. Plasma e nitrito voltam ao basal em ~24 h. Quem prescreve precisa pensar em relógio, não em acúmulo de uma dose só.</>,
        source: 'Wagner 1983 · Jones 2014',
        stats: [
            { value: '~60%', label: 'da dose na urina em 48 h', color: C.nitrate },
            { value: '~24 h', label: 'para o plasma voltar ao basal', color: C.text },
        ],
    },
    {
        tab: 'Dose', t: 2.5, focus: 'nitrite', byDose: true,
        headline: 'A dose muda a altura, não o relógio',
        text: <>Com 4,2, 8,4 e 16,8 mmol o <Hl c={C.nitrite}>nitrito</Hl> sobe de forma dose-dependente e pica na mesma janela de 2–3 h. O desempenho não acompanha: 4,2 mmol não mudou nada e 16,8 não rendeu mais que 8,4.</>,
        source: 'Wylie 2013 · 10 homens, ciclismo · alturas relativas ilustrativas',
        stats: [],
    },
];

/** Resultados do ensaio de dose-resposta (Wylie 2013) por dose, na ordem de DOSES. */
export const DOSE_RESULTS: readonly { head: string; body: string }[] = [
    { head: '4,2 mmol · 70 mL', body: 'nada mudou' },
    { head: '8,4 mmol · 140 mL', body: 'VO₂ −1,7% (p = 0,06) · tempo até a falha +14%' },
    { head: '16,8 mmol · 280 mL · sem ganho extra', body: 'VO₂ −3,0% · tempo até a falha +12%' },
];
