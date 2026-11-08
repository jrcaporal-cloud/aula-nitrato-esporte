/** Textos e números do slide 26 (fonte: dossiê 01, LARSEN2007 e BAILEY2009). */

export interface OxygenStep {
    tab: string;
    facts: readonly string[];
    headline: string;
    text: string;
    source: string;
}

export const OXYGEN_STEPS: readonly OxygenStep[] = [
    {
        tab: 'Dogma',
        facts: ['ECR cruzado duplo-cego', 'n = 9 homens', 'bem treinados'],
        headline: 'Até 2007, o custo de O₂ era constante',
        text: 'Mesma carga, mesmo oxigênio: o consumo de O₂ do exercício submáximo era tratado como uma constante biológica, fora do alcance da nutrição.',
        source: 'Larsen 2007 · ECR cruzado duplo-cego · 9 homens jovens bem treinados, cicloergômetro.',
    },
    {
        tab: '3 dias',
        facts: ['NaNO₃ 0,1 mmol/kg/dia', 'placebo NaCl', 'p < 0,02'],
        headline: 'Mesma carga, menos O₂',
        text: 'NaNO₃ 0,1 mmol/kg/dia por 3 dias (≈ 7 mmol/dia para 70 kg) contra NaCl. Nas quatro cargas submáximas mais baixas, o VO₂ caiu.',
        source: 'Larsen 2007 · p < 0,02 · placebo: cloreto de sódio.',
    },
    {
        tab: 'Eficiência',
        facts: ['p < 0,01', 'mesma carga'],
        headline: 'Mais trabalho por litro de O₂',
        text: 'A eficiência bruta subiu de 19,7 para 21,1% (p < 0,01): do mesmo gasto de energia, uma fatia maior virou trabalho mecânico.',
        source: 'Larsen 2007 · eficiência bruta = trabalho mecânico ÷ energia gasta.',
    },
    {
        tab: 'Lactato',
        facts: ['FC', 'lactato', 'ventilação', 'VE/VO₂', 'RER'],
        headline: 'O lactato não subiu',
        text: 'Frequência cardíaca, lactato, ventilação, VE/VO₂ e razão de troca respiratória não mudaram em nenhuma carga. Não virou glicólise: a energia ficou mais barata.',
        source: 'Larsen 2007 · os autores chamaram o achado de "altamente surpreendente".',
    },
    {
        tab: 'Comp. lento',
        facts: ['n = 8 homens', '500 mL/dia × 6 dias', 'placebo: groselha negra'],
        headline: 'O exercício intenso também ficou mais barato',
        text: '500 mL/dia de suco de beterraba por 6 dias: no exercício severo o componente lento do VO₂ encolheu e a tolerância cresceu. No moderado, o ganho do VO₂ caiu 19%.',
        source: 'Bailey 2009 · 8 homens · suco 11,2 mM de nitrato × cordial de groselha negra · p < 0,05.',
    },
];

/** Estado estável do VO₂ nas cargas submáximas (L/min) e eficiência bruta (%), Larsen 2007. */
export const VO2_PLACEBO = 2.98;
export const VO2_NITRATE = 2.82;
export const EFF_PLACEBO = 19.7;
export const EFF_NITRATE = 21.1;

/** Bailey 2009, exercício severo: componente lento (L/min) e tempo até a exaustão (s). */
export const SLOW_PLACEBO = 0.74;
export const SLOW_NITRATE = 0.57;
export const TTE_PLACEBO = 583;
export const TTE_NITRATE = 675;
