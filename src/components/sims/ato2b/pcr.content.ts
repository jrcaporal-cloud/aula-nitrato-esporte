/** Textos e números do slide 28 (fonte: dossiê 01, BAILEY2010; pH muscular de JONES2014, texto completo). */

export interface PcrStep {
    tab: string;
    headline: string;
    text: string;
    source: string;
    facts: readonly string[];
}

export const PCR_STEPS: readonly PcrStep[] = [
    {
        tab: 'Mesma força',
        headline: 'Mesma força, mesma duração',
        text: 'Extensão de joelho com 6 dias de suco de beterraba contra placebo, na mesma carga. O que muda por baixo da mesma contração? A espectroscopia de ³¹P mede a fosfocreatina (PCr) dentro do músculo, ao vivo.',
        source: 'Bailey 2010 · ECR cruzado duplo-cego · ³¹P-MRS · 7 homens de 19 a 38 anos.',
        facts: ['n = 7', '500 mL/dia', '5,1 mmol/dia', '6 dias'],
    },
    {
        tab: 'PCr',
        headline: 'A PCr afunda menos',
        text: 'Na carga baixa, a queda de PCr foi de 5,2 mM com nitrato contra 8,1 mM com placebo (p < 0,05). Mesmo trabalho, menos reserva de energia gasta.',
        source: 'Bailey 2010 · exercício de baixa intensidade · espectro esquemático, ΔPCr em escala.',
        facts: ['ΔPCr 5,2 vs 8,1 mM', 'p < 0,05'],
    },
    {
        tab: 'ATP',
        headline: 'O ATP gira menos',
        text: 'A taxa estimada de renovação do ATP caiu nas duas intensidades (p < 0,05): menos ATP gasto por newton de força.',
        source: 'Bailey 2010 · turnover total de ATP estimado a partir da PCr e do VO₂.',
        facts: ['baixa: 296 → 192 µM/s', 'alta: 607 → 436 µM/s'],
    },
    {
        tab: 'pH',
        headline: 'O pH não se mexeu',
        text: 'Sem diferença de pH muscular em nenhum momento: não houve glicólise compensatória. A contração ficou mais barata; não chegou mais oxigênio.',
        source: 'Bailey 2010; pH muscular conferido no texto completo de Jones 2014. A linha tracejada é hipotética.',
        facts: ['pH igual nos dois braços'],
    },
    {
        tab: 'Carga alta',
        headline: 'Na carga intensa, o componente lento encolhe',
        text: 'O componente lento do VO₂ caiu de 209 para 100 mL/min e o da PCr de 3,9 para 1,6 mM. O tempo até a exaustão foi de 586 para 734 s.',
        source: 'Bailey 2010 · exercício de alta intensidade · todas as diferenças p < 0,05, tempo p < 0,01.',
        facts: ['TTE +25%', 'barras em proporção real'],
    },
];

/** ΔPCr (mM) na carga baixa e turnover de ATP (µM/s) nas duas cargas: Bailey 2010. */
export const DPCR_PLACEBO = 8.1;
export const DPCR_NITRATE = 5.2;
export const ATP_LOW = { placebo: 296, nitrate: 192 } as const;
export const ATP_HIGH = { placebo: 607, nitrate: 436 } as const;
