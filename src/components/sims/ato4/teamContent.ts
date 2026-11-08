/** Texto e números do slide 50 (fonte única: dossiê 03, blocos A e B). */

export interface TeamStep {
    tab: string;
    kicker: string;
    headline: string;
    text: string;
    facts: readonly (readonly [string, string])[];
    takeaway: string;
    source: string;
}

export const TEAM_STEPS: readonly TeamStep[] = [
    {
        tab: 'Bruno',
        kicker: 'caso fictício · 27 anos',
        headline: 'Noventa minutos de arrancadas',
        text: 'Bruno é meio-campista amador: acelera, freia, volta e recomeça o jogo inteiro. O Yo-Yo IR1 imita esse vaivém, com corridas de ida e volta em ritmo crescente e pausa curta.',
        facts: [['teste', 'Yo-Yo IR1'], ['esforço', 'intermitente'], ['pergunta', 'quantos metros a mais?']],
        takeaway: 'Hipótese do capítulo: o esforço intenso e repetido é onde o nitrato poderia ajudar.',
        source: 'Os quatro estudos a seguir testam jogadores de esportes coletivos.',
    },
    {
        tab: 'Wylie 2013',
        kicker: 'ECR cruzado duplo-cego · n = 14',
        headline: 'Primeiro sinal: +4,2% no Yo-Yo',
        text: 'Homens de esporte coletivo tomaram 490 mL de suco de beterraba ao longo de ~30 h antes do teste. Correram 1.704 m, contra 1.636 m com o suco sem nitrato.',
        facts: [['placebo', '1.636 m'], ['beterraba', '1.704 m'], ['P', '< 0,05']],
        takeaway: 'Efeito pequeno, no teste certo: daqui nasce a hipótese.',
        source: 'Wylie 2013, Eur J Appl Physiol.',
    },
    {
        tab: 'Futebolistas',
        kicker: 'ECR cruzado duplo-cego · n = 32',
        headline: 'Replicou em futebolistas: +3,4%',
        text: 'Jogadores do primeiro time de clubes amadores holandeses tomaram 140 mL/dia (~800 mg de nitrato, ≈ 12,9 mmol) por 6 dias.',
        facts: [['placebo', '1.574 m'], ['beterraba', '1.623 m'], ['P', '0,027']],
        takeaway: 'Outro grupo, mesmo teste, mesmo sentido.',
        source: 'Nyakayiru 2017, Nutrients.',
    },
    {
        tab: 'Sprint de 5 m',
        kicker: 'ECR cruzado duplo-cego · n = 36',
        headline: 'Na aceleração: −2,3% em 5 m',
        text: 'Jogadores competitivos, 70 mL/dia (6,4 mmol) por 5 dias, uma dose baixa. O ganho é maior nos primeiros metros. No Yo-Yo veio +3,9%, mas o desvio-padrão (~500 m) é dez vezes o efeito.',
        facts: [['5 m', '1,73 vs 1,77 s'], ['10 m', '2,53 vs 2,57 s'], ['20 m', '3,98 vs 4,03 s']],
        takeaway: 'O ganho aparece na arrancada, mas a diferença entre jogadores é muito maior.',
        source: 'Thompson 2016, Nitric Oxide.',
    },
    {
        tab: 'Agrupado',
        kicker: 'meta-análise · 4 estudos de Yo-Yo IR1',
        headline: 'Somando tudo: SMD 0,17',
        text: 'Os ensaios de Yo-Yo agrupados dão efeito pequeno e consistente. A potência média também sobe; o pico não. Para o Bruno: ganho modesto no teste, e o jogo em si não foi medido.',
        facts: [['Yo-Yo IR1', 'SMD 0,17'], ['I²', '25%'], ['certeza', 'baixa a moderada']],
        takeaway: 'Pequeno, mas o sentido se repete.',
        source: 'Alsharif 2023, Antioxidants (Basel).',
    },
];

export interface YoYoRun {
    title: string;
    placebo: number;
    nitrate: number;
    /** Variação relativa do artigo, já formatada. */
    delta: string;
    /** Diferença em metros (cálculo). */
    gap: number;
}

export const YOYO_WYLIE: YoYoRun = { title: 'Wylie 2013 · 14 jogadores', placebo: 1636, nitrate: 1704, delta: '+4,2%', gap: 68 };
export const YOYO_NYAKAYIRU: YoYoRun = { title: 'Nyakayiru 2017 · 32 futebolistas', placebo: 1574, nitrate: 1623, delta: '+3,4%', gap: 49 };

export interface SprintRow {
    dist: string;
    placebo: number;
    nitrate: number;
    delta: string;
}

/** Thompson 2016: tempos de sprint em segundos (beterraba vs placebo). */
export const SPRINT_ROWS: readonly SprintRow[] = [
    { dist: '5 m', placebo: 1.77, nitrate: 1.73, delta: '−2,3%' },
    { dist: '10 m', placebo: 2.57, nitrate: 2.53, delta: '−1,6%' },
    { dist: '20 m', placebo: 4.03, nitrate: 3.98, delta: '−1,2%' },
];

/** Thompson 2016, Yo-Yo IR1: média e desvio-padrão (m). */
export const YOYO_SD = { placebo: { mean: 1369, sd: 505 }, nitrate: { mean: 1422, sd: 502 } } as const;
