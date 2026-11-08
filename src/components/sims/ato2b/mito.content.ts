/** Textos do slide 27 (fonte: dossiê 01, LARSEN2011 e WHITFIELD2016). Sem nenhum valor de P/O. */

export interface MitoStep {
    tab: string;
    headline: string;
    text: string;
    source: string;
    facts: readonly string[];
}

export const MITO_STEPS: readonly MitoStep[] = [
    {
        tab: '2011',
        headline: '2011: a hipótese elegante',
        text: 'Na Cell Metabolism, mitocôndrias de quem tomou nitrato mostraram razão P/O maior, respiração de estado 4 menor e menos ANT, a translocase ligada ao vazamento de prótons.',
        source: 'Larsen 2011 · biópsia muscular e mitocôndrias isoladas · o resumo traz só a direção dos achados.',
        facts: ['P/O ↑', 'estado 4 ↓', 'ANT ↓'],
    },
    {
        tab: 'A lógica',
        headline: 'Menos vazamento, menos O₂',
        text: 'A melhora de P/O acompanhou a queda do custo de O₂ no exercício. Mesmo ATP com menos oxigênio queimado: foi o mecanismo oficial entre 2011 e 2016.',
        source: 'Larsen 2011 · correlação entre P/O e custo de O₂ · nenhum valor de P/O é projetado aqui.',
        facts: ['direção, sem valores'],
    },
    {
        tab: '2016',
        headline: '2016: a replicação',
        text: '280 mL/dia de suco de beterraba (~26 mmol de nitrato/dia) por 7 dias, em 10 homens ativos. O VO₂ do corpo caiu ~3% a 70% do VO₂pico: o efeito apareceu.',
        source: 'Whitfield 2016 · J Physiol · biópsias antes e depois, 20 min de ciclismo 48 h antes.',
        facts: ['n = 10', '7 dias', '~26 mmol/dia'],
    },
    {
        tab: 'Medidores',
        headline: 'Os medidores não se mexeram',
        text: 'Fibras permeabilizadas e mitocôndrias isoladas: nada mudou em vazamento, UCP3, ANT1, ANT2, P/O, potencial de membrana ou sensibilidade ao ADP. Só a emissão de H₂O₂ subiu, sem sinal de dano oxidativo.',
        source: 'Whitfield 2016 · barras ilustram "igual" ou "maior"; o resumo não dá valores.',
        facts: ['mitocôndria: sem mudança', 'H₂O₂ ↑'],
    },
    {
        tab: 'Veredito',
        headline: 'O fenótipo replicou, o mecanismo não',
        text: 'O custo de O₂ caiu sem a mitocôndria mudar: o que diminuiu foi a demanda de ATP, não a eficiência de conversão. Hoje, eficiência mitocondrial é mecanismo não confirmado em humanos. O olhar sai da mitocôndria e vai para o sarcômero.',
        source: 'Whitfield 2016 · diferenças possíveis: suco × NaNO₃ (Larsen 2011) e 7 × 3 dias.',
        facts: ['inferência, não medida aqui'],
    },
];

/** Linhas do quadro de medidores (Whitfield 2016): razão ≈ 1 = sem mudança. */
export const MITO_GAUGES = [
    { label: 'Vazamento (leak)', ratio: 1, note: '= sem mudança' },
    { label: 'UCP3', ratio: 1, note: '= sem mudança' },
    { label: 'ANT1 e ANT2', ratio: 1, note: '= sem mudança' },
    { label: 'Razão P/O', ratio: 1, note: '= sem mudança' },
    { label: 'Potencial de membrana', ratio: 1, note: '= sem mudança' },
    { label: 'Sensib. ao ADP (Km)', ratio: 1, note: '= sem mudança' },
    { label: 'Emissão de H₂O₂', ratio: 1.22, note: 'sobe', accent: true },
] as const;
