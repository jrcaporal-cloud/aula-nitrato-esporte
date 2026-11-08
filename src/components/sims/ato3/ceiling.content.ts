import { C } from '../kit/palette';

/** Slide 45 — "O Teto do Treinado". Dossiês 01 (seção 13) e 02: SENEFELD2020, SHANNON2022, PORCELLI2015, MCCONELL2007, POVEDA1997, TESCH1985, JONES2014. */

export const CEILING_TABS = ['Os estudos', 'O efeito cai', 'O corte', 'Farmacocinética', 'Quatro razões', 'Arraste o atleta'] as const;

export interface Study {
    id: string;
    name: string;
    /** VO₂max/pico (mL/kg/min) do estudo; deslocado em até ~1 para os rótulos não se sobreporem. */
    vo2: number;
    /** Variação do desempenho com nitrato, em % (positivo = melhor), calculada das médias publicadas. */
    y: number;
    /** Melhora estatisticamente significativa no desfecho de desempenho. */
    sig: boolean;
    anchor: 'start' | 'end' | 'middle';
    dx: number;
    dy: number;
}

/** Δ% = (placebo − nitrato) ÷ placebo para tempo; (nitrato − placebo) ÷ placebo para distância/potência. Médias dos abstracts. */
export const STUDIES: readonly Study[] = [
    { id: 'lansley', name: 'Lansley', vo2: 56, y: 2.8, sig: true, anchor: 'start', dx: 12, dy: 5 },
    { id: 'cermakA', name: 'Cermak a', vo2: 58, y: 1.2, sig: true, anchor: 'end', dx: -12, dy: 26 },
    { id: 'bescos12', name: 'Bescós 12', vo2: 59.4, y: 0.4, sig: false, anchor: 'start', dx: 12, dy: 5 },
    { id: 'cermakB', name: 'Cermak b', vo2: 60.8, y: -0.8, sig: false, anchor: 'start', dx: 12, dy: 5 },
    { id: 'bescos11', name: 'Bescós 11', vo2: 65.1, y: 1.7, sig: false, anchor: 'middle', dx: 0, dy: -14 },
    { id: 'peacock', name: 'Peacock', vo2: 70, y: -0.9, sig: false, anchor: 'middle', dx: 0, dy: 28 },
    { id: 'christensen', name: 'Christensen', vo2: 72, y: 1.5, sig: false, anchor: 'start', dx: 12, dy: 5 },
    { id: 'boorsmaA', name: 'Boorsma', vo2: 79.5, y: -0.1, sig: false, anchor: 'end', dx: -10, dy: 28 },
    { id: 'boorsmaB', name: '', vo2: 80.5, y: 0.4, sig: false, anchor: 'end', dx: 0, dy: 0 },
];

/** PORCELLI2015 resumido por SENEFELD2020 (dado secundário): melhora no TT de 3 km por faixa de VO₂pico. */
export const TREND: readonly (readonly [number, number])[] = [[40, 3.0], [50, 1.5], [70, 0.2]];

export const trendAt = (v: number): number => {
    if (v <= TREND[0][0]) return TREND[0][1];
    for (let i = 1; i < TREND.length; i++) {
        const [x0, y0] = TREND[i - 1];
        const [x1, y1] = TREND[i];
        if (v <= x1) return y0 + ((v - x0) / (x1 - x0)) * (y1 - y0);
    }
    return Math.max(TREND[2][1] - (v - 70) * 0.01, 0);
};

/** Casos fictícios na régua. */
export const CHARACTERS = [
    { name: 'Helena', vo2: 38, color: C.nitrate },
    { name: 'Lia', vo2: 52, color: C.nitrite },
    { name: 'Tomás', vo2: 80, color: C.no },
] as const;

export interface Reading { range: string; text: string; color: string }

/** Leitura qualitativa do atleta arrastável (ilustrativa). */
export const readingFor = (v: number): Reading => {
    if (v < 45) return { range: 'abaixo de 45', text: 'Onde o efeito é maior: ~3% no contrarrelógio de 3 km perto de VO₂pico 40 (Porcelli, via Senefeld).', color: C.no };
    if (v < 56) return { range: '45 a 56', text: 'Efeito pequeno e em queda: ~1,5% perto de VO₂pico 50. É a faixa de Lia.', color: C.no };
    if (v < 60) return { range: '56 a 60', text: 'Ciclistas de clube com ganho de 1 a 3% nos ensaios (Lansley, Cermak), mas já com nulos ao lado.', color: C.nitrite };
    if (v < 65) return { range: '60 a 65', text: 'Transição: o consenso fala em efeito diminuído acima de 60; a meta-análise ainda vê efeito até ~65.', color: C.nitrite };
    return { range: '65 ou mais', text: 'Média ~0 (d 0,02; IC −0,10 a 0,14). Pode haver respondedores, mas ainda não se sabe prever quem.', color: C.hypoxia };
};

export interface Reason { id: string; title: string; big: string; lines: readonly string[]; color: string }

export const REASONS: readonly Reason[] = [
    { id: 'nnos', title: 'Mais NOS no músculo', big: '+60%', lines: ['nNOSμ em atletas de endurance × sedentários', 'McConell 2007: 10 × 11; é proteína, não atividade'], color: C.no },
    { id: 'nitrito', title: 'Nitrito basal mais alto', big: '~2,5×', lines: ['atletas × destreinados, 10 × 10', 'Poveda 1997; unidades não declaradas, só a razão'], color: C.nitrite },
    { id: 'capilar', title: 'Mais capilares', big: 'menos hipóxia', lines: ['região ativa menos hipoperfundida', 'Argumento de Jones 2014, sem número próprio'], color: C.o2 },
    { id: 'fibra', title: 'Menos fibra tipo II', big: '% fibra lenta', lines: ['maior no vasto lateral dos corredores', 'Tesch 1985: p < 0,001; vale para o músculo treinado'], color: C.bacteria },
];

export const CEILING_FEET: readonly string[] = [
    'Oito ensaios em treinados, cada um no seu VO₂max. Os que acharam ganho estão à esquerda; à direita, só nulos.',
    'O efeito cai de forma contínua até perto de zero. Em VO₂max ≥65, d = 0,02 (−0,10 a 0,14): na média, nada.',
    'O corte de 60 vem do consenso Delphi; o de 65, das faixas da meta-análise. É um gradiente, não um interruptor.',
    'Não é só a resposta: com a mesma dose de 5,5 mmol, quanto mais apto, menos sobem o nitrato (r = 0,86) e o nitrito (r = 0,75).',
    'Quatro explicações propostas por Jones 2014 para o teto, cada uma com fonte própria. São hipóteses, não mediação demonstrada.',
    'Arraste o atleta pelo eixo de VO₂max. A leitura é qualitativa: a linha ilustra o gradiente, não prevê o resultado de uma pessoa.',
];
