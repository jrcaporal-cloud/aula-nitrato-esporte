import { C } from '../kit/palette';

/** Slide 83 — os quatro casos fictícios e o que a evidência permite dizer de cada um (chance, magnitude, certeza). */

export interface Range {
    /** Posição na escala (0–1) do menor e do maior valor plausível. */
    lo: number;
    hi: number;
    /** Leitura em palavras, mostrada abaixo da barra. */
    words: string;
}

export interface Item {
    text: string;
    src: string;
}

export interface CaseVerdict {
    id: 'lia' | 'tomas' | 'bruno' | 'helena';
    name: string;
    profile: string;
    effort: string;
    dilemma: string;
    color: string;
    evidence: readonly Item[];
    trap: Item;
    headline: string;
    reading: readonly string[];
    chance: Range;
    magnitude: Range;
    certainty: Range;
}

/** Escalas: cada barra mostra uma faixa plausível, não um número. */
export const SCALES = {
    chance: ['improvável', 'possível', 'provável'],
    magnitude: ['nula', 'trivial', 'pequena', 'moderada'],
    certainty: ['muito baixa', 'baixa', 'moderada', 'alta'],
} as const;

export const CASES: readonly CaseVerdict[] = [
    {
        id: 'lia', name: 'Lia', profile: '29 anos · ciclista de clube', effort: 'VO₂max ~52 · contrarrelógio de 16 km (~27 min)', color: C.o2,
        dilemma: 'Vale a pena para o contrarrelógio de sábado?',
        evidence: [
            { text: 'Ciclistas de clube (VO₂max ~56), 9 homens: 4 km −2,8% e 16,1 km −2,7% com ~6,2 mmol, 2,5 h antes.', src: 'Lansley 2011b' },
            { text: 'No conjunto de 52 contrarrelógios: d 0,09. Gao 2021: −1,98 s, não significativo.', src: 'Senefeld 2020 · Gao 2021' },
            { text: 'Abaixo do corte de consenso (VO₂pico 60), onde o efeito ainda pode existir.', src: 'Shannon 2022' },
        ],
        trap: { text: 'O “+16%” é tempo até a exaustão em homens pouco treinados. Não vale para 16 km.', src: 'Bailey 2009' },
        headline: 'Vale testar no treino. Se houver ganho, será pequeno.',
        reading: ['Chance real, mas modesta: de 0 a 3% no tempo da prova.', 'Dose de 8–16 mmol, 2–4 h antes, num contrarrelógio de treino.'],
        chance: { lo: 0.4, hi: 0.72, words: 'possível' },
        magnitude: { lo: 0.2, hi: 0.66, words: 'trivial a pequena' },
        certainty: { lo: 0.27, hi: 0.47, words: 'baixa' },
    },
    {
        id: 'tomas', name: 'Tomás', profile: '24 anos · corredor de 1.500 m de elite', effort: 'VO₂max ~80 · prova de ~4 min', color: C.hypoxia,
        dilemma: 'A concorrência toma. Ele deveria tomar também?',
        evidence: [
            { text: '8 corredores de 1.500 m (VO₂ 80), 19,5 mmol por 8 dias: 4:10,5 com beterraba × 4:11,4 com placebo.', src: 'Boorsma 2014' },
            { text: 'Com VO₂max ≥ 65 o efeito médio é d 0,02 (−0,10 a 0,14). Em 45 ECRs com atletas, nada agrupado.', src: 'Senefeld 2020 · Xie 2026' },
            { text: 'Dois dos oito melhoraram 5,8 e 5,0 s, mas o ruído do teste impede chamá-los de respondedores.', src: 'Boorsma 2014 · Atkinson 2015' },
        ],
        trap: { text: 'Estudos de elite têm n de 8 a 13: não têm poder para ~1%. Nulo na média não é nulo em todos.', src: 'Christensen 2013 · Boorsma 2014' },
        headline: 'Na média, não espere nada. Resposta individual só se prova repetindo.',
        reading: ['Se tentar: uso crônico (>3 dias), em treino, com a medida repetida.', 'Abaixo de 12 min, a evidência é “equívoca” no IOC.'],
        chance: { lo: 0.05, hi: 0.3, words: 'improvável na média' },
        magnitude: { lo: 0, hi: 0.3, words: 'nula a trivial' },
        certainty: { lo: 0.3, hi: 0.58, words: 'baixa a moderada' },
    },
    {
        id: 'bruno', name: 'Bruno', profile: '27 anos · meio-campista amador', effort: 'jogo de 90 min com sprints', color: C.no,
        dilemma: 'Ajuda a repetir sprints no segundo tempo?',
        evidence: [
            { text: 'Yo-Yo IR1: +4,2% (1.704 × 1.636 m) e +3,4% em 32 futebolistas (1.574 → 1.623 m).', src: 'Wylie 2013 · Nyakayiru 2017' },
            { text: 'Sprint de 5 m: −2,3% (1,73 × 1,77 s) em 36 jogadores, 6,4 mmol por 5 dias.', src: 'Thompson 2016' },
            { text: 'O protocolo decide: 24 × 6 s com 24 s de pausa, +5% de potência; 7 × 30 s e 6 × 60 s, zero.', src: 'Wylie 2016' },
        ],
        trap: { text: 'No agrupado de sprints a certeza é baixa a muito baixa; em atletas (45 ECRs) não há efeito.', src: 'Eroglu 2026 · Xie 2026' },
        headline: 'Possível ganho em sprint curto com pausa curta. Depende do protocolo.',
        reading: ['Ordem de grandeza: 2 a 4% em testes de campo, não em jogo.', 'O amador está mais perto dos ensaios positivos que a elite.'],
        chance: { lo: 0.42, hi: 0.76, words: 'possível' },
        magnitude: { lo: 0.25, hi: 0.62, words: 'trivial a pequena' },
        certainty: { lo: 0.2, hi: 0.42, words: 'baixa' },
    },
    {
        id: 'helena', name: 'Helena', profile: '41 anos · corredora recreacional', effort: 'VO₂max ~38 · primeira meia maratona', color: C.nitrateSoft,
        dilemma: 'A meia maratona é o lugar certo para estrear?',
        evidence: [
            { text: 'Quem tem menos aptidão responde mais: atletas 0,04 × não atletas 0,25.', src: 'Campos 2018' },
            { text: 'Em provas de 1.000 s (~17 min) ou mais, o efeito agrupado fica limitado. A meia dura bem mais.', src: 'Senefeld 2020' },
            { text: 'Mulheres eram ~10% dos participantes (156). Num ensaio com 17 mulheres e 19 homens, sem diferença por sexo.', src: 'Senefeld 2020 · He 2026' },
        ],
        trap: { text: 'Pressão arterial é contexto (PAS −4,4 mmHg na meta-análise), não meta de prova.', src: 'Siervo 2013' },
        headline: 'Ganho incerto: faltam dados em mulheres e em prova longa.',
        reading: ['Ausência de dado não é ausência de efeito.', 'Se usar, teste no longão e registre, sem expectativa de ganho.'],
        chance: { lo: 0.3, hi: 0.62, words: 'incerta' },
        magnitude: { lo: 0.1, hi: 0.55, words: 'trivial a pequena' },
        certainty: { lo: 0.1, hi: 0.4, words: 'baixa' },
    },
];

export const CASE_TABS = ['Lia', 'Tomás', 'Bruno', 'Helena', 'Quadro'] as const;
