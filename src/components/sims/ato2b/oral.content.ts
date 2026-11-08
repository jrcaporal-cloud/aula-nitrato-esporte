import { C } from '../kit/palette';

/** Slide 32 (dossiê 01: VANHATALO2018, BURLEIGH2018, KAPIL2018). Abundâncias de partida são ilustrativas; as variações são dados. */

export interface Genus {
    name: string;
    color: string;
    /** Variação relativa após 10 dias de nitrato (Vanhatalo 2018). */
    delta: number;
    label: string;
}

export const GENERA: readonly Genus[] = [
    { name: 'Neisseria', color: '#A78BFA', delta: 3.51, label: '+351%' },
    { name: 'Rothia', color: '#DDD6FE', delta: 1.27, label: '+127%' },
    { name: 'Prevotella', color: '#6D28D9', delta: -0.6, label: '−60%' },
    { name: 'Veillonella', color: '#8B5CF6', delta: -0.65, label: '−65%' },
];

export const BASE_RADIUS = 40;

/** Raio da bolha: a ÁREA acompanha a abundância relativa. */
export const radiusOf = (g: Genus, after: boolean): number => (after ? BASE_RADIUS * Math.sqrt(1 + g.delta) : BASE_RADIUS);

export interface OralStep {
    tab: string;
    headline: string;
    text: string;
    source: string;
    facts: readonly string[];
}

export const ORAL_STEPS: readonly OralStep[] = [
    {
        tab: 'Antes',
        headline: 'A boca de cada um é diferente',
        text: 'No dorso da língua vivem as bactérias que reduzem o nitrato a nitrito. A composição varia de pessoa para pessoa, e a conversão depende dela.',
        source: 'Vanhatalo 2018 · Burleigh 2018 · tamanhos de partida ilustrativos.',
        facts: ['abundância ilustrativa'],
    },
    {
        tab: '10 dias',
        headline: 'Dez dias de nitrato mudam a boca',
        text: 'Com 12 mmol/dia por 10 dias, Neisseria subiu 351% e Rothia 127%; Prevotella caiu 60% e Veillonella 65%. O nitrato é um prebiótico da própria via.',
        source: 'Vanhatalo 2018 · cruzado controlado por placebo · sequenciamento 16S rRNA · filos: Proteobacteria +225%, Bacteroidetes −46%.',
        facts: ['n = 18', '12 mmol/dia', '10 dias'],
    },
    {
        tab: 'Quem responde',
        headline: 'Quem tem mais Neisseria e Rothia responde mais',
        text: 'Abundância alta de Rothia e Neisseria e baixa de Prevotella e Veillonella acompanhou maior aumento do nitrito plasmático. A pressão arterial caiu nos idosos de 70 a 79 anos, não nos jovens de 18 a 22.',
        source: 'Vanhatalo 2018 · correlações entre abundância e aumento do nitrito plasmático.',
        facts: ['idosos: PA ↓', 'jovens: PA ='],
    },
    {
        tab: 'Limiar',
        headline: 'Mais bactéria nem sempre é mais NO',
        text: 'Em 25 adultos jovens saudáveis, maior abundância de redutoras deu mais nitrito salivar, mas não resposta exagerada de nitrito plasmático. Existe um limiar funcional: acima dele, mais bactérias não compram mais NO sistêmico.',
        source: 'Burleigh 2018 · 16S rRNA · 3,5 h de observação após o nitrato · curvas ilustrativas.',
        facts: ['n = 25', '7 espécies redutoras'],
    },
    {
        tab: 'Mulheres',
        headline: 'Nelas, a via parece mais ligada',
        text: 'No basal, mais nitrito em todas as matrizes, com nitrato semelhante. Depois de suplementar, o nitrito plasmático subiu mais e a velocidade de onda de pulso caiu só nelas. A composição do microbioma não diferiu: a diferença é funcional.',
        source: 'Kapil 2018 · o resumo não traz n nem valores: só a direção dos achados.',
        facts: ['só direção', 'sem magnitudes'],
    },
    {
        tab: 'Washout',
        headline: 'Sete dias de washout bastam?',
        text: 'Se dez dias de nitrato mudam a boca, o segundo braço de um cruzado parte de onde? O dossiê não traz o tempo de retorno ao basal: a pergunta fica em aberto e volta no Ato V.',
        source: 'Vanhatalo 2018 · o tempo de recuperação do microbioma não consta no dossiê.',
        facts: ['pergunta aberta'],
    },
];

export interface WomenRow {
    label: string;
    glyph: '↑' | '↓' | '=';
    text: string;
    emphasis?: boolean;
}

export const WOMEN_ROWS: readonly WomenRow[] = [
    { label: 'Nitrito basal, em todas as matrizes', glyph: '↑', text: 'mais nelas' },
    { label: 'Nitrato basal', glyph: '=', text: 'semelhante' },
    { label: 'Atividade oral de redução do nitrato', glyph: '↑', text: 'maior nelas' },
    { label: 'Nitrito plasmático após suplementar', glyph: '↑', text: 'sobe mais nelas' },
    { label: 'Velocidade de onda de pulso', glyph: '↓', text: 'caiu só nelas' },
    { label: 'Composição do microbioma', glyph: '=', text: 'sem diferença', emphasis: true },
];

export const GLYPH_COLOR: Record<WomenRow['glyph'], string> = { '↑': C.noSoft, '↓': C.noSoft, '=': C.muted };
