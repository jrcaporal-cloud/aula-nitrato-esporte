/** Texto e números do slide 51 (dossiê 03: WYLIE2016, SMITH2019, MARTIN2014). */

export interface Protocol {
    id: string;
    reps: number;
    /** Duração de cada sprint (s). */
    sprint: number;
    /** Pausa entre sprints (s). */
    rest: number;
    /** Potência média (W): placebo e beterraba. */
    placebo: number;
    nitrate: number;
    delta: string;
    significant: boolean;
}

export const PROTOCOLS: readonly Protocol[] = [
    { id: 'p6', reps: 24, sprint: 6, rest: 24, placebo: 539, nitrate: 568, delta: '+5%', significant: true },
    { id: 'p30', reps: 7, sprint: 30, rest: 240, placebo: 562, nitrate: 558, delta: '0%', significant: false },
    { id: 'p60', reps: 6, sprint: 60, rest: 60, placebo: 375, nitrate: 374, delta: '0%', significant: false },
];

export const SPRINT_TICKS = [
    { value: 0, label: '6 s' },
    { value: 1, label: '30 s' },
    { value: 2, label: '60 s' },
] as const;
export const REST_TICKS = [
    { value: 0, label: '24 s' },
    { value: 1, label: '60 s' },
    { value: 2, label: '240 s' },
] as const;
export const SPRINT_SECONDS = [6, 30, 60] as const;
export const REST_SECONDS = [24, 60, 240] as const;

/** Protocolo testado para a combinação de controles (ou undefined se ninguém testou). */
export const findProtocol = (sprintIdx: number, restIdx: number): Protocol | undefined =>
    PROTOCOLS.find(p => p.sprint === SPRINT_SECONDS[sprintIdx] && p.rest === REST_SECONDS[restIdx]);

export interface Pick { sprint: number; rest: number }

/** Posição dos controles em cada passo do passador. */
export const STEP_PICKS: readonly Pick[] = [
    { sprint: 0, rest: 0 },
    { sprint: 0, rest: 0 },
    { sprint: 1, rest: 2 },
    { sprint: 2, rest: 1 },
    { sprint: 0, rest: 0 },
];

export interface ProtocolStep {
    tab: string;
    kicker: string;
    headline: string;
    text: string;
    facts: readonly (readonly [string, string])[];
    takeaway: string;
    source: string;
}

export const PROTOCOL_STEPS: readonly ProtocolStep[] = [
    {
        tab: 'Três desenhos',
        kicker: 'Wylie 2016 · 10 homens de esporte coletivo · cruzado',
        headline: 'Mesma dose, três desenhos de intervalo',
        text: 'Beterraba por 5 dias (8,2 mmol/dia; placebo 0,08), nitrito plasmático +237%. Depois, três protocolos de sprint no cicloergômetro. Em qual deles o nitrato muda a potência? Arraste os controles ou avance.',
        facts: [['dose', '8,2 mmol/dia × 5 dias'], ['nitrito plasmático', '+237%'], ['desfecho', 'potência média']],
        takeaway: 'Aposte antes de ver: em qual protocolo a barra acende?',
        source: 'Wylie 2016, Eur J Appl Physiol.',
    },
    {
        tab: '24 × 6 s',
        kicker: 'sprint curto · pausa curta',
        headline: 'Arrancada curta, pausa curta: +5%',
        text: '24 sprints de 6 s com 24 s de pausa. A potência média foi de 539 W (placebo) para 568 W (beterraba). É o desenho que mais se parece com as arrancadas do Bruno.',
        facts: [['placebo', '539 W'], ['beterraba', '568 W'], ['P', '< 0,05']],
        takeaway: 'Aqui o nitrato aparece.',
        source: 'Wylie 2016, Eur J Appl Physiol.',
    },
    {
        tab: '7 × 30 s',
        kicker: 'sprint longo · pausa longa',
        headline: 'Sprint de 30 s, pausa de 240 s: nada',
        text: '7 sprints de 30 s com 240 s de pausa: 558 W com beterraba contra 562 W com placebo, diferença sem significância.',
        facts: [['placebo', '562 W'], ['beterraba', '558 W'], ['P', 'n.s.']],
        takeaway: 'Mesma suplementação, outro desenho: nenhum efeito.',
        source: 'Wylie 2016, Eur J Appl Physiol.',
    },
    {
        tab: '6 × 60 s',
        kicker: 'sprint longo · pausa curta',
        headline: 'Sprint de 60 s, pausa de 60 s: nada',
        text: '6 sprints de 60 s com 60 s de pausa: 374 W contra 375 W. Só três combinações foram testadas, então não dá para separar o peso da duração e o da pausa.',
        facts: [['placebo', '375 W'], ['beterraba', '374 W'], ['P', 'n.s.']],
        takeaway: 'O desenho do intervalo decide, mas só vimos 3 dos 9 cantos do mapa.',
        source: 'Wylie 2016, Eur J Appl Physiol.',
    },
    {
        tab: 'Calor e exaustão',
        kicker: 'outros dois ensaios de sprint repetido',
        headline: 'Calor úmido e sprint até cair: sem ganho',
        text: 'Smith: sem efeito a 22 °C nem a 30 °C úmidos (no calor, tendência contra o suco). Martin: sprints até a exaustão, e a beterraba rendeu menos sprints.',
        facts: [['Smith 2019', 'sem efeito'], ['Martin 2014', 'menos sprints']],
        takeaway: '"Sprint repetido" não é uma categoria só.',
        source: 'Smith 2019 (Eur J Appl Physiol) · Martin 2014 (IJSPP).',
    },
];
