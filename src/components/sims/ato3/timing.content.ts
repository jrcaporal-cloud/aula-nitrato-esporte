import type { ForestRow } from '../kit/ForestPlot';
import { C } from '../kit/palette';

/** Slide 43 — "Agudo ou Crônico?". Números: SENEFELD2020, SHANNON2022, WYLIE2013, KADACH2022, JONES2014, WAGNER1983, WONG2022, POON2025, VANHATALO2010, HOGWOOD2023. */

export const TIMING_TABS = ['A janela', 'Agudo × crônico', 'Sem tolerância', 'Somado ao treino'] as const;

/** Picos medidos (h após a dose). As curvas entre eles são ilustrativas. */
export const PEAKS = {
    nitrate: { from: 1, to: 2, label: 'nitrato plasmático 1–2 h' },
    nitrite: { from: 2, to: 3, label: 'nitrito plasmático 2–3 h' },
    muscle: { at: 3, baseline: 9, label: 'nitrato muscular: pico em 3 h, basal a partir de 9 h' },
} as const;

/** Janela que o agrupado de SENEFELD2020 aponta (2–3,5 h) e a última dose do Delphi (2–4 h). */
export const WINDOW = { from: 2, to: 3.5 } as const;

/** Curvas normalizadas (0–1) em função de horas após a dose: formas ilustrativas ancoradas nos picos medidos. */
const bump = (t: number, tp: number) => (t <= 0 ? 0 : (t / tp) * Math.exp(1 - t / tp));
export const curveNitrate = (t: number) => (t <= 0 ? 0 : t < 1.5 ? Math.sin((Math.PI / 2) * (t / 1.5)) : Math.exp(-(Math.LN2 / 5) * (t - 1.5)));
export const curveNitrite = (t: number) => bump(t, 2.5);
export const curveMuscle = (t: number) => (t <= 0 || t >= 9 ? 0 : t <= 3 ? Math.sin((Math.PI / 2) * (t / 3)) : Math.cos((Math.PI / 2) * ((t - 3) / 6)));

/** Leitura do slider "dose tomada X h antes da prova". */
export const verdictFor = (h: number): { text: string; color: string } => {
    if (h < 1) return { text: 'Tarde demais: na hora da prova o nitrito ainda nem subiu.', color: C.risk };
    if (h < 2) return { text: 'Quase: o nitrito está subindo, mas ainda não chegou ao pico.', color: C.nitrite };
    if (h <= 3.5) return { text: 'Dentro da janela de 2–3,5 h: nitrito perto do pico.', color: C.no };
    if (h <= 4) return { text: 'Ainda aceitável: o Delphi aceita a última dose até 4 h antes.', color: C.no };
    if (h < 9) return { text: 'Passou do pico: o nitrato muscular ainda está acima do basal.', color: C.nitrite };
    return { text: 'O nitrato muscular já voltou ao basal (a partir de 9 h).', color: C.placebo };
};

/** WONG2022 (TT de 5–30 min, 24 estudos): g de Hedges com IC95%. */
export const WONG_ROWS: readonly ForestRow[] = [
    { id: 'geral', label: 'Geral', sub: '24 estudos', est: 0.15, lo: 0, hi: 0.31, kind: 'pooled', color: C.placebo, right: '0,15 (−0,00 a 0,31)' },
    { id: 'agudo', label: 'Agudo', sub: '4,1–15,2 mmol', est: 0.10, lo: -0.08, hi: 0.28, kind: 'pooled', color: C.nitrate },
    { id: 'cronico', label: 'Crônico (3–15 dias)', sub: '4,0–13,0 mmol/dia', est: 0.30, lo: 0, hi: 0.59, kind: 'pooled', color: C.no, right: '0,30 (−0,00 a 0,59)' },
];

/** HOGWOOD2023: nitrato + treino ≥3 semanas × treino sozinho (9 estudos, n = 228). */
export const TRAINING_ROWS: readonly ForestRow[] = [
    { id: 'vo2', label: 'VO₂pico', sub: 'SMD, p = 0,19', est: 0.18, lo: -0.09, hi: 0.44, kind: 'pooled', color: C.o2 },
    { id: 'tte', label: 'Tempo até a exaustão', sub: 'SMD, p = 0,58', est: 0.08, lo: -0.21, hi: 0.37, kind: 'pooled', color: C.nitrite },
];

/** VANHATALO2010: 8 pessoas, 0,5 L/dia (5,2 mmol); testes em 2,5 h, 5 dias e 15 dias. */
export const SUSTAIN = {
    cols: ['2,5 h', '5 dias', '15 dias'],
    nitrite: ['+39%', '+25%', '+46%'],
    bpVo2: ['≈ −4%', '≈ −4%', '≈ −4%'],
    ramp: ['—', '—', '322 → 331 W'],
} as const;

export const TIMING_FEET: readonly string[] = [
    'O nitrito pica 2–3 h depois da dose e o nitrato do músculo, em 3 h. A melhor janela do agrupado é 2–3,5 h: tomar "na hora da prova" é tarde demais.',
    'No contrarrelógio curto, o crônico tem sinal maior (g 0,30) que o agudo (g 0,10), ambos no limite da significância. Não é prova de superioridade.',
    'Custo de O₂ e pressão ficam menores já na primeira dose e continuam aos 15 dias: não há tolerância. A potência de pico só mexeu aos 15 dias.',
    'Com 3 semanas ou mais de treino, nitrato + treino não passou de treino sozinho. Nitrato é ferramenta de dia de prova, não de bloco de treino.',
];
