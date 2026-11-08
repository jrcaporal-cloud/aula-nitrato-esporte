/** Textos do StatPowerSim (slide 64). Números: LOHSE2020 e SAINANI2018 (dossiê 04, bloco F); poder e filtro são cálculo nosso. */

export interface PowerStep {
    tab: string;
    headline: string;
    text: string;
    source: string;
    takeaway: string;
}

export const POWER_STEPS: readonly PowerStep[] = [
    {
        tab: 'O estudo típico',
        headline: 'Dez atletas e uma esperança',
        text: 'Em 232 artigos que usaram inferência baseada em magnitude, o n mediano foi 10 por grupo (IQR 8 a 15). Só 15% calcularam a amostra antes; só 14% declararam um desfecho primário.',
        source: 'Lohse 2020, PLoS One (revisão sistemática de 232 artigos).',
        takeaway: 'O n típico da área é o n típico do nitrato.',
    },
    {
        tab: '30 testes',
        headline: 'Trinta testes por artigo',
        text: 'A mediana é de 30 testes por artigo. Com 30 comparações e efeito real zero, a chance de pelo menos um “achado” passa de três em quatro.',
        source: 'Lohse 2020 (mediana de 30 testes). Probabilidade: cálculo nosso, testes independentes e todos nulos. Valores p ilustrativos.',
        takeaway: 'Sem desfecho primário, qualquer p < 0,05 serve de manchete.',
    },
    {
        tab: 'Poder com 10',
        headline: 'Com 10 atletas, o estudo quase não enxerga 1%',
        text: 'Efeito real de 1% no contrarrelógio, ruído de 3,35%: um cruzado com 10 atletas tem poder de cerca de 9%. Em 9 de cada 10 vezes o estudo não vê o que existe.',
        source: 'Cálculo nosso: t pareado, α 5%, DP da diferença = √2 × CV (3,35%, Jeukendrup 1996). Ilustrativo.',
        takeaway: 'Estudo pequeno e nulo não prova ausência de efeito.',
    },
    {
        tab: 'O n que falta',
        headline: 'O n para 80% de poder',
        text: 'Para enxergar 1% no contrarrelógio, centenas de atletas; para 3%, dezenas. Arraste o efeito e acompanhe onde a curva cruza os 80%.',
        source: 'Cálculo nosso (mesmas premissas). Hopkins 1999: dobrar o CV do teste quadruplica o n.',
        takeaway: 'Nenhum ensaio de nitrato tinha poder para o efeito que o campo hoje estima.',
    },
    {
        tab: 'Filtro',
        headline: 'O que passa pelo filtro vem exagerado',
        text: 'Cem grupos repetem o mesmo estudo: 10 atletas, efeito real de 1%. Os poucos que atingem p < 0,05 são justamente os que superestimam o efeito.',
        source: 'Simulação nossa (semente fixa): t pareado, n = 10, efeito 1%, CV 3,35%. Valores ilustrativos.',
        takeaway: 'Publicar só o que passa é a receita do efeito inflado.',
    },
    {
        tab: 'MBI',
        headline: 'A inferência por magnitude não conserta',
        text: 'Com 8 a 15 por grupo, o critério “provável” erra para o lado do falso positivo em 12 a 22% das vezes, e o “possível” em 22 a 45%. A MBI não tem controle de erro superior ao teste de hipótese.',
        source: 'Lohse 2020; Sainani 2018, Med Sci Sports Exerc (reanálise por simulação).',
        takeaway: '“Provavelmente benéfico” com n = 10 não tem o controle de erro que parece ter.',
    },
];

export const EFFECT_OPTIONS = [
    { value: 1, label: '1%' },
    { value: 2, label: '2%' },
    { value: 3, label: '3%' },
] as const;
