/**
 * Slide 10 · "O Que Todo Mundo Sabe": as seis frases da votação e o veredito de cada uma.
 * Números só dos dossiês 01 e 02 (Bailey 2009, Lansley 2011a/b, Senefeld 2020, Wylie 2013, Bescós 2009).
 * `CLAIMS` e `VOTES_KEY` são lidos também pelo slide 87 (VerdictRevealSim): mudar aqui muda lá.
 */

export type Vote = 'V' | 'F';

/** Chave do localStorage onde os votos da turma ficam: { "1": "V" | "F", … }. */
export const VOTES_KEY = 'aula-nitrato:votos';

/** Uma barra do gráfico pequeno do veredito: `hit` = efeito presente (magenta); senão, neutro (ardósia). */
export interface VizBar {
    label: string;
    value: number;
    shown: string;
    hit: boolean;
}

export type Viz =
    | { kind: 'bars'; title: string; max: number; bars: readonly VizBar[] }
    | { kind: 'window'; title: string };

export interface Claim {
    /** 1…6: é a chave do voto no localStorage. */
    id: number;
    /** A frase como a sala costuma ouvir. */
    claim: string;
    /** Rótulo curto para a lista lateral. */
    short: string;
    /** Resposta certa. */
    answer: Vote;
    /** O veredito em uma linha. */
    headline: string;
    /** Número que carrega o veredito, e o que ele mede. */
    stat: string;
    statNote: string;
    /** Por que a frase não se sustenta, em duas ou três frases. */
    why: string;
    viz: Viz;
    source: string;
}

export const CLAIMS: readonly Claim[] = [
    {
        id: 1,
        claim: 'A beterraba melhora o desempenho em 16%.',
        short: 'Beterraba melhora 16%',
        answer: 'F',
        headline: 'O 16% é de outro teste',
        stat: '583 → 675 s',
        statNote: 'tempo até a exaustão em 8 homens jovens saudáveis (+16%)',
        why: 'No contrarrelógio: 2,7–2,8% em 9 ciclistas de clube; na meta-análise, d 0,09 (52 conjuntos).',
        viz: {
            kind: 'bars', title: 'ganho no mesmo suco, em testes diferentes', max: 16,
            bars: [
                { label: 'tempo até a exaustão (n 8)', value: 15.8, shown: '+16%', hit: true },
                { label: 'contrarrelógio de 16 km (n 9)', value: 2.7, shown: '+2,7%', hit: true },
            ],
        },
        source: 'Bailey 2009 · Lansley 2011 · Senefeld 2020',
    },
    {
        id: 2,
        claim: 'Funciona para todo atleta.',
        short: 'Todo atleta responde',
        answer: 'F',
        headline: 'O efeito encolhe com o preparo',
        stat: 'd = 0,02',
        statNote: 'efeito médio com VO₂pico ≥ 65 mL/kg/min (IC95% −0,10 a 0,14)',
        why: 'Na meta-análise de 80 estudos o efeito aparece de ~40 a ~65 mL/kg/min e, nos mais condicionados, some.',
        viz: {
            kind: 'bars', title: 'efeito médio (d de Cohen)', max: 0.2,
            bars: [
                { label: 'todos os níveis', value: 0.174, shown: '0,17', hit: true },
                { label: 'VO₂pico ≥ 65 mL/kg/min', value: 0.021, shown: '0,02', hit: false },
            ],
        },
        source: 'Senefeld 2020',
    },
    {
        id: 3,
        claim: 'Quanto mais nitrato, melhor.',
        short: 'Mais dose, mais efeito',
        answer: 'F',
        headline: 'Dobrar a dose não dobra o efeito',
        stat: '8,4 ≈ 16,8',
        statNote: 'mmol de nitrato: tempo até a falha +14% e +12%. Com 4,2 mmol, nada',
        why: 'O platô começa perto de 8 mmol. Dez homens, suco concentrado contra o mesmo suco sem nitrato.',
        viz: {
            kind: 'bars', title: 'tempo até a falha, por dose', max: 16,
            bars: [
                { label: '4,2 mmol', value: 0, shown: 'sem efeito', hit: false },
                { label: '8,4 mmol', value: 14, shown: '+14%', hit: true },
                { label: '16,8 mmol', value: 12, shown: '+12%', hit: true },
            ],
        },
        source: 'Wylie 2013',
    },
    {
        id: 4,
        claim: 'O efeito vem das betalaínas e dos antioxidantes.',
        short: 'Betalaínas e antioxidantes',
        answer: 'F',
        headline: 'É o nitrato, não o pigmento',
        stat: '+15% × 0',
        statNote: 'tempo até a exaustão com o suco × com o mesmo suco sem nitrato (~0,003 mmol)',
        why: 'A beterraba tem pigmentos, sim. Tirado o nitrato, o suco ficou igual ao controle: nada mudou.',
        viz: {
            kind: 'bars', title: 'tempo até a exaustão', max: 16,
            bars: [
                { label: 'suco com nitrato', value: 15, shown: '+15%', hit: true },
                { label: 'mesmo suco, sem nitrato', value: 0, shown: 'sem mudança', hit: false },
            ],
        },
        source: 'Lansley 2011',
    },
    {
        id: 5,
        claim: 'Arginina e beterraba são a mesma coisa.',
        short: 'Arginina = beterraba',
        answer: 'F',
        headline: 'Arginina não é nitrato',
        stat: '20,5 g/dia',
        statNote: 'de L-arginina por 3 dias (dieta controle: 5,5 g/dia): nenhuma mudança, nem no nitrato do plasma',
        why: 'São vias diferentes. Quase quatro vezes mais arginina, em 9 atletas, e o nitrato do plasma não saiu do lugar.',
        viz: {
            kind: 'bars', title: 'L-arginina em g/dia: nitrato do plasma igual', max: 22,
            bars: [
                { label: 'dieta controle', value: 5.5, shown: '5,5', hit: false },
                { label: 'dieta rica em arginina', value: 9, shown: '9,0', hit: false },
                { label: 'controle + suplemento', value: 20.5, shown: '20,5', hit: false },
            ],
        },
        source: 'Bescós 2009',
    },
    {
        id: 6,
        claim: 'O melhor é tomar no aquecimento.',
        short: 'Tomar no aquecimento',
        answer: 'F',
        headline: 'O pico chega horas depois',
        stat: '2–3 h',
        statNote: 'depois da dose, para o nitrito do plasma chegar ao pico',
        why: 'Tomado no aquecimento, o pico viria depois da prova. A meta-análise aponta a janela de 2 a 3,5 h antes.',
        viz: { kind: 'window', title: 'horas depois da dose' },
        source: 'Wylie 2013 · Senefeld 2020',
    },
];

export const VOTE_LABEL: Readonly<Record<Vote, string>> = { V: 'Verdadeiro', F: 'Falso' };
