/** Slide 41 — "+16% ou 1%?": números do dossiê 04 (seção E) e do dossiê 02 (JONES2014). */

export const TTE_TABS = ['A manchete', 'A taxa de câmbio', 'O ruído cresce junto', 'Mesma hipóxia', 'O veredito'] as const;

/** JEUKENDRUP1996: CV do TTE a 75% Wmax e do contrarrelógio de trabalho fixo (mesmos 30 indivíduos). */
export const CV_TTE = 26.6;
export const CV_TT = 3.35;

/** Taxas de câmbio TTE ÷ TT: JONES2014 (~15% de TTE ≈ 1% de TT) e AMANN2008 (−45% ÷ 5,7% ≈ 8, cálculo). */
export const RATE_JONES = 15;
export const RATE_AMANN = 7.9;
/** HINCKSON2005: o fator de conversão varia tipicamente 28% de corredor para corredor. */
export const RATE_SPREAD = 0.28;

/** Presets de cada passo: mudança real no contrarrelógio (%) e taxa de câmbio. */
export const TTE_PRESETS = [
    { real: 1, rate: RATE_JONES },
    { real: 1, rate: RATE_JONES },
    { real: 1, rate: RATE_AMANN },
    { real: 1, rate: RATE_AMANN },
    { real: 1, rate: RATE_JONES },
] as const;

/** AMANN2008: 8 ciclistas; mudança do desempenho (%) em hipóxia e hiperóxia, relativa à normóxia. */
export const AMANN = [
    { id: 'hip', label: 'Hipóxia', tte: -45, tteSd: 13, tt: -5.7, ttSd: 1.6 },
    { id: 'hyper', label: 'Hiperóxia', tte: 123, tteSd: 37, tt: 4.1, ttSd: 1.4 },
] as const;

export const TTE_FEET: readonly string[] = [
    'A manchete diz +16% no tempo até a exaustão. Na régua do relógio, o mesmo efeito vale cerca de 1%: o TTE devolve ~15 vezes mais "por cento".',
    'A taxa de câmbio não é universal: varia cerca de 28% de corredor para corredor. A mesma melhora real vira +11%, +15% ou +19% de TTE.',
    'O TTE infla o efeito e infla o ruído na mesma proporção: CV de 26,6% contra 3,35%. A relação sinal/ruído é igual nos dois testes.',
    'Na mesma hipóxia, os mesmos 8 ciclistas: o TTE cai 45% e o contrarrelógio piora 5,7%. Escalas diferentes, sensibilidade parecida.',
    'O TTE é bom detector e péssima unidade de comunicação. Para a prova, divida o "por cento" pela taxa de câmbio (de ~8 a ~15).',
];
