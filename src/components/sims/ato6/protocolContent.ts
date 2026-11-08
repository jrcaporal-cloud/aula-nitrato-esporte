/** Slide 82 — dados do ProtocolSim. Fontes: SHANNON2022 (Delphi), IOC2018, WYLIE2013, WYLIE2016DOSE, WEI2024, GOVONI2008, KAPIL2015. */

export const PROTOCOL_TABS = ['Quanto', 'Quando', 'A conta', 'No dia', 'Os quatro'] as const;

/** Dose-resposta de Wylie 2013 (10 homens; tempo até a falha vs placebo depletado). */
export const WYLIE_POINTS = [
    { mmol: 4.2, label: 'nada', gain: 0 },
    { mmol: 8.4, label: '+14%', gain: 14 },
    { mmol: 16.8, label: '+12%', gain: 12 },
] as const;

export const DOSE_AXIS_MAX = 17;

/** Curva ilustrativa do nitrito plasmático após uma dose única: pico em ~2,5 h (WYLIE2013 diz 2–3 h). */
export const nitriteAt = (hoursAfterDose: number): number => {
    const k = Math.max(hoursAfterDose, 0) / 2.5;
    return k * k * Math.exp(2 * (1 - k));
};

export interface Habit {
    id: string;
    title: string;
    text: string;
    source: string;
}

export const HABITS: readonly Habit[] = [
    { id: 'rinse', title: 'Sem enxaguante antisséptico no dia', text: 'A clorexidina apaga as bactérias da língua que fazem nitrato virar nitrito e pode anular parte do efeito. É mecanismo: ninguém testou isso em desempenho.', source: 'Govoni 2008 · Kapil 2013' },
    { id: 'beeturia', title: 'Beterrúria é esperada', text: 'Urina ou fezes avermelhadas depois do suco concentrado são achados comuns e esperados. Avisar o atleta antes evita susto no dia.', source: 'Kapil 2015' },
    { id: 'trial', title: 'Teste a dose no treino', text: 'Algumas pessoas sentem desconforto gastrointestinal. A dose, o horário e o produto se testam num treino, nunca estreando na prova.', source: 'IOC 2018' },
    { id: 'marker', title: 'Não peça nitrito no sangue', text: 'O nitrito plasmático não mede o efeito: com 6 mmol/dia o VO₂ seguiu 3% menor mesmo com o nitrito já de volta ao basal.', source: 'Wylie 2016 · Wei 2024' },
];

export interface PresetCase {
    id: string;
    name: string;
    sport: string;
    vo2: string;
    /** Hora do dia (decimal) em que começa a prova e duração em horas. */
    eventAt: number;
    eventHours: number;
    /** Dose da véspera/dia: mmol e momento da última dose. */
    mmol: number;
    hoursBefore: number;
    scheme: string;
    source: string;
}

export const PRESETS: readonly PresetCase[] = [
    { id: 'lia', name: 'Lia', sport: 'contrarrelógio de 16 km', vo2: 'VO₂max ~52', eventAt: 9, eventHours: 0.45, mmol: 8.4, hoursBefore: 2.5, scheme: 'dose única, 2,5 h antes', source: 'Wylie 2013 · Shannon 2022' },
    { id: 'tomas', name: 'Tomás', sport: '1.500 m de elite', vo2: 'VO₂max ~80', eventAt: 20.25, eventHours: 0.07, mmol: 8, hoursBefore: 3, scheme: '8 mmol/dia por 6 dias; última dose 3 h antes', source: 'IOC 2018 · Shannon 2022' },
    { id: 'bruno', name: 'Bruno', sport: 'jogo de 90 min', vo2: 'amador', eventAt: 16, eventHours: 1.5, mmol: 6.4, hoursBefore: 2.5, scheme: '1 shot/dia por 5 dias; o último 2,5 h antes', source: 'Thompson 2016' },
    { id: 'helena', name: 'Helena', sport: 'meia maratona', vo2: 'VO₂max ~38', eventAt: 7.5, eventHours: 2, mmol: 8, hoursBefore: 3, scheme: 'dose única 3 h antes, testada num longão', source: 'Shannon 2022 · Senefeld 2020' },
];

export const PROTOCOL_SOURCES = {
    dose: 'Shannon 2022 (Delphi, 12 especialistas) · IOC 2018 · Wylie 2013 (10 homens, tempo até a falha)',
    time: 'Shannon 2022: sem consenso de efeito com dose <90 min ou 6–8 h antes · Wylie 2013: pico de nitrito em 2–3 h · Wagner 1983: meia-vida do nitrato ~5 h',
    calc: 'Cálculo: 1 mmol = 62 mg · shot de 6,41 mmol (Gallardo 2019) · medianas EFSA 2008',
    day: 'Govoni 2008 · Kapil 2013/2015 · IOC 2018 · Wylie 2016 · Wei 2024 · Zhao 2026 (cadeia até o desempenho não fechada)',
    presets: 'Exemplos de cálculo com a literatura, não são prescrição · horários inventados para a aula',
} as const;
