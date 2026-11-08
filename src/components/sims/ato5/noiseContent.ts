/** Textos do TestNoiseSim (slide 63). Números: dossiê 04, bloco E (JEUKENDRUP1996, LAURSEN2007, CURRELL2008, AMANN2008) e LOHSE2020. */

export interface NoiseStep {
    tab: string;
    headline: string;
    text: string;
    source: string;
    takeaway: string;
    /** Efeito inicial (% no contrarrelógio) nos passos do cálculo; null nos demais. */
    delta: number | null;
}

export const NOISE_STEPS: readonly NoiseStep[] = [
    {
        tab: 'Repetir o teste',
        headline: 'Mesmo atleta, mesmo teste, outro resultado',
        text: 'Cada ponto é uma repetição, sem intervenção nenhuma. No tempo até a exaustão a nuvem se espalha de 13 a 27%; no contrarrelógio, de 2 a 3,4%.',
        source: 'Jeukendrup 1996 e Laursen 2007, Med Sci Sports Exerc. Pontos ilustrativos; os CV são dos estudos.',
        takeaway: 'O ruído do teste é o primeiro adversário do efeito.',
        delta: null,
    },
    {
        tab: 'A régua',
        headline: 'O efeito mora na casa do ruído',
        text: 'O nitrato rende cerca de 3% no contrarrelógio, onde o ruído é de 2 a 3,4%. O TTE tem ruído de 13 a 27%. Entre o 1º e o 2º lugar de uma prova, menos de 1%.',
        source: 'Currell 2008, Sports Med; Lansley 2011, MSSE (+2,8% e +2,7%); Jeukendrup 1996; Laursen 2007.',
        takeaway: 'Efeito de 1 a 3% pede teste com ruído de poucos por cento.',
        delta: null,
    },
    {
        tab: 'Sinal e ruído',
        headline: 'O TTE amplifica o efeito e o ruído juntos',
        text: 'Os mesmos 8 ciclistas, da normóxia à hipóxia: o TTE cai 45%, o contrarrelógio piora 5,7%. Dividindo a mudança pelo desvio-padrão, sai quase o mesmo número: sensibilidade semelhante.',
        source: 'Amann 2008, Med Sci Sports Exerc (8 ciclistas). Razão mudança ÷ DP: cálculo nosso.',
        takeaway: 'O TTE é ruim como unidade de comunicação, não como detector.',
        delta: null,
    },
    {
        tab: 'Efeito de 1%',
        headline: 'Quantos atletas para enxergar 1%?',
        text: 'Medido uma vez por braço, o atleta “parece melhorar” pouco acima de metade das vezes. Dá quase cara ou coroa nos dois testes, e a conta fecha em centenas de atletas.',
        source: 'Cálculo nosso: cruzado pareado, α 5%, poder 80%, DP da diferença = √2 × CV (26,6% e 3,35%). Conversão 1:10 ilustrativa. n típico: Lohse 2020.',
        takeaway: 'Dobrar o ruído exige quadruplicar a amostra.',
        delta: 1,
    },
    {
        tab: 'Efeito de 3%',
        headline: 'Com 3%, dezenas, não centenas',
        text: 'Um efeito de 3% já se destaca do ruído, mas ainda pede dezenas de atletas. O ensaio típico da área tem 10 por grupo. Arraste o efeito e veja onde o n cruza o 10.',
        source: 'Cálculo nosso (mesmas premissas). Hopkins 1999: dobrar o CV do teste quadruplica o n. n típico: Lohse 2020.',
        takeaway: 'Com n = 10, só um efeito grande aparece.',
        delta: 3,
    },
];

export const DELTA_OPTIONS = [
    { value: 0.5, label: '0,5%' },
    { value: 1, label: '1%' },
    { value: 2, label: '2%' },
    { value: 3, label: '3%' },
    { value: 4, label: '4%' },
] as const;
