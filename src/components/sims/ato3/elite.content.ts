import { C } from '../kit/palette';

/** Slide 46 — "A Floresta de Nulos". Médias dos abstracts (dossiê 02, bloco B); precisão = cálculo (CV 2%, n do estudo). */

export const ELITE_TABS = ['Dois nulos', 'O mais extremo', 'A floresta', 'Sem poder', 'Dois respondedores'] as const;

/** CV típico de um contrarrelógio (LAURSEN2007: 2,0% em 5 km; HOPKINS2001: 0,9–2,0%). Entrada do cálculo da faixa. */
export const TT_CV = 2.0;
/** t bicaudal 95% para n−1 graus de liberdade (n = 8, 10, 13, 20, 24). */
const T975: Readonly<Record<number, number>> = { 8: 2.365, 10: 2.262, 13: 2.179, 20: 2.093, 24: 2.069 };

/** Meia-largura da precisão de um cruzado: t × CV × √2 ÷ √n (diferença entre duas provas do mesmo atleta). */
export const halfWidth = (n: number): number => (T975[n] * TT_CV * Math.SQRT2) / Math.sqrt(n);

export interface EliteRow {
    id: string;
    label: string;
    n: number;
    /** Variação do desempenho com nitrato (%), positiva = melhor; calculada das médias publicadas. */
    y: number;
    right: string;
    /** Passo em que a linha entra. */
    from: number;
    color: string;
}

export const ELITE_ROWS: readonly EliteRow[] = [
    { id: 'peacock', label: 'Peacock 2012 · VO₂ 70 · n 10', n: 10, y: -0.9, right: '−0,9% · p 0,12', from: 0, color: C.nitrate },
    { id: 'christensen', label: 'Christensen 2013 · VO₂ 72 · n 10', n: 10, y: 1.5, right: '+1,5% · n.s.', from: 0, color: C.nitrate },
    { id: 'boorsmaA', label: 'Boorsma 2014 · VO₂ 80 · n 8 · aguda', n: 8, y: -0.1, right: '−0,1% · n.s.', from: 1, color: C.no },
    { id: 'boorsmaC', label: 'Boorsma 2014 · VO₂ 80 · n 8 · crônica', n: 8, y: 0.4, right: '+0,4% · n.s.', from: 1, color: C.no },
    { id: 'wilkerson', label: 'Wilkerson 2012 · bem treinados · n 8', n: 8, y: 0.8, right: '+0,8% · n.s.', from: 2, color: C.nitrite },
    { id: 'bescos', label: 'Bescós 2012 · VO₂ ~60 · n 13', n: 13, y: 0.4, right: '+0,4% · p 0,61', from: 2, color: C.nitrite },
    { id: 'lane', label: 'Lane 2014 · competitivos · n 24', n: 24, y: -0.4, right: '−0,4% · p 0,6', from: 2, color: C.nitrite },
    { id: 'cermakB', label: 'Cermak 2012b · VO₂ 60 · n 20', n: 20, y: -1.1, right: '−1,1% · n.s.', from: 2, color: C.nitrite },
];

/** BOORSMA2014: os dois "respondedores" (segundos de melhora no 1.500 m) e as médias de grupo. */
export const RESPONDERS = [
    { id: 'a1', label: 'agudo (1)', s: 5.8 },
    { id: 'a2', label: 'agudo (2)', s: 5.0 },
    { id: 'c1', label: 'crônico (1)', s: 7.0 },
    { id: 'c2', label: 'crônico (2)', s: 0.5 },
] as const;
/** Ruído típico do teste: CV 3,3% (LAURSEN2007, 1.500 m) × ~250 s (cálculo). */
export const NOISE_S = 8.3;

export const ELITE_FEET: readonly string[] = [
    'Dois ensaios em atletas de VO₂max 70–72: nenhum achou diferença. Em Peacock, o grupo do nitrato até foi numericamente mais lento.',
    'Boorsma: 8 corredores de 1.500 m, VO₂ 80, 19,5 mmol por dose, 8 dias. Aguda e crônica, as médias ficaram coladas (placebo × beterraba): 4:10,4 × 4:10,7 e 4:11,4 × 4:10,5.',
    'Sete ensaios, todos com o ponto perto de zero e a faixa de dúvida cruzando-o. Nenhum foi significativo no desempenho.',
    'O problema não é só "não funciona": com n de 8 a 13, nenhuma faixa exclui um ganho de ~1%; só os dois maiores (n 20 e 24) o excluem, neste cálculo. Provar 1% pede 16–65 atletas.',
    'Nulo na média não é nulo em todo mundo: dois corredores ganharam 5–7 s. Mas o próprio teste varia ~8 s: ainda não dá para chamar isso de resposta.',
];
