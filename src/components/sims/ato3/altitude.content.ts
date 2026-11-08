import type { ForestRow } from '../kit/ForestPlot';
import { C } from '../kit/palette';

/** Slide 47 — "Na Altitude". Dossiê 02, bloco D: VANHATALO2011, SHANNON2016/2017, MUGGERIDGE2014, MASSCHELEIN2012, ARNOLD2015, MACLEOD2015, BOURDILLON2015, NYBACK2017, KANG2025. */

export const ALT_TABS = ['A hipótese', '12 corredores', 'Os nulos', 'Meta-análise', 'O placar'] as const;

/** KANG2025: 9 ECRs, n = 161. SMD com IC95%. */
export const KANG_ROWS: readonly ForestRow[] = [
    { id: 'spo2', label: 'SpO₂', sub: 'saturação de O₂', est: -0.08, lo: -0.36, hi: 0.20, kind: 'pooled', color: C.o2, right: '−0,08 (−0,36 a 0,20)' },
    { id: 'vo2', label: 'VO₂max', sub: 'consumo máximo', est: -0.17, lo: -0.58, hi: 0.23, kind: 'pooled', color: C.nitrate, right: '−0,17 (−0,58 a 0,23)' },
];

/** Placar de estudos em hipóxia (simulada ou terrestre). */
export const SCORE = {
    pos: [
        { who: 'Vanhatalo 2011 · n 9', what: 'tolerância volta ao nível da normóxia' },
        { who: 'Muggeridge 2014 · n 9', what: 'TT de 16,1 km, −2,2% (~2.500 m)' },
        { who: 'Shannon 2016 · n 12', what: '1.500 m, −3,2%, todos melhoraram' },
        { who: 'Shannon 2017 · n 10', what: '3 km, −3,8% (3.000 m) e −4,2% (4.300 m)' },
        { who: 'Masschelein 2012 · n 15', what: 'TTE −36% na hipóxia; beterraba recupera +5%' },
    ],
    nulls: [
        { who: 'Arnold 2015 · n 10', what: 'VO₂ 66, 10 km a ~2.500 m: nulo' },
        { who: 'MacLeod 2015 · n 11', what: 'VO₂pico ≥60, 10 km: nulo' },
        { who: 'Bourdillon 2015 · n 12', what: 'TT de 15 km: nulo (normóxia e 11% O₂)' },
        { who: 'Nybäck 2017 · n 8', what: 'TT de 1.000 m: nulo (16,8% O₂)' },
        { who: 'Kang 2025 · 9 ECRs', what: 'SpO₂ e VO₂max sem efeito' },
    ],
} as const;

export const ALT_FEET: readonly string[] = [
    'A hipótese é boa: sem O₂ suficiente, o nitrito vira NO. Em hipóxia de 14,5% de O₂, a beterraba devolveu ao músculo a tolerância de quem está ao nível do mar.',
    'Shannon 2016: 12 corredores, VO₂max de 47 a 77, ~2.500 m simulados. Todos os 12 melhoraram o 1.500 m, e a melhora não dependeu do VO₂max.',
    'Mas, no mesmo cenário, Arnold e MacLeod não acharam nada em atletas de VO₂ ≥60–66. O ganho de 11 s ficou longe dos 51 s que valeriam a pena.',
    'FiO₂ não moderou o efeito (Senefeld 2020). Na meta-análise de altitude, o nitrito subiu, mas a saturação e o VO₂max não mudaram.',
    'Plausibilidade forte, evidência mista: positivos e nulos convivem no mesmo cenário de ~2.500 m. Na altitude real, há poucos estudos.',
];
