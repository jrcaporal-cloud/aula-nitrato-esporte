import { C } from '../kit/palette';

/**
 * Dados e textos do slide 31 (dossiê 01). Degraus com `value` são dados; os demais são direção qualitativa
 * (tracejados, "ilustrativo"): o resumo do estudo não traz o valor ou não existe medida comparável.
 */

export type Cohort = 'idoso' | 'recreacional' | 'elite';

export interface Stage {
    name: string;
    color: string;
    /** Variação percentual medida; ausente = qualitativo. */
    value?: number;
    /** Fração da largura máxima usada no desenho do degrau qualitativo. */
    ghost: number;
    label: string;
}

export const STAGE_META = [
    { name: 'Nitrato plasmático', color: C.nitrate },
    { name: 'Nitrito plasmático', color: C.nitrite },
    { name: 'NO exalado', color: C.no },
    { name: 'Potência máxima', color: C.text },
] as const;

type Raw = { value?: number; ghost: number; label: string };

const RAW: Record<Cohort, readonly Raw[]> = {
    // Coggan 2020: 12 idosos, 13,4 ± 1,6 mmol
    idoso: [
        { value: 1051, ghost: 1, label: '+1051%' },
        { value: 138, ghost: 1, label: '+138%' },
        { value: 111, ghost: 1, label: '+111%' },
        { value: 4.4, ghost: 1, label: '+4,4%' },
    ],
    // Coggan 2015: NO exalado +61% e potência de pico +4% (maior velocidade); sem nitrato/nitrito no resumo
    recreacional: [
        { ghost: 0.82, label: 'sobe' },
        { ghost: 0.5, label: 'sobe' },
        { value: 61, ghost: 1, label: '+61%' },
        { value: 4, ghost: 1, label: '+4%' },
    ],
    // Porcelli 2015 (r 0,86), Bescós 2011 (nitrito basal ~2.000 nM), Bescós 2012 (26,4 × 26,3 km)
    elite: [
        { ghost: 0.42, label: 'menor' },
        { ghost: 0.1, label: 'pouco' },
        { ghost: 0.06, label: 'sem dado' },
        { value: 0, ghost: 1, label: '≈ 0' },
    ],
};

export const stagesOf = (cohort: Cohort): readonly Stage[] =>
    STAGE_META.map((m, i) => ({ ...m, ...RAW[cohort][i] }));

export const COHORT_OPTIONS = [
    { value: 'idoso', label: 'Idoso' },
    { value: 'recreacional', label: 'Recreacional' },
    { value: 'elite', label: 'Elite' },
] as const;

export const COHORT_TITLE: Record<Cohort, string> = {
    idoso: 'Idoso saudável',
    recreacional: 'Adulto recreacional',
    elite: 'Atleta de elite',
};

export interface CascadeStep {
    tab: string;
    cohort: Cohort | 'todos';
    headline: string;
    text: string;
    source: string;
    facts: readonly string[];
}

export const CASCADE_STEPS: readonly CascadeStep[] = [
    {
        tab: 'Degraus',
        cohort: 'idoso',
        headline: 'Quatro degraus, cada um menor',
        text: 'Um bolus de 13,4 mmol de nitrato em 12 idosos saudáveis: o nitrato plasmático sobe +1051%, o nitrito +138% e o NO exalado +111%. Cada degrau entrega menos do que o de cima.',
        source: 'Coggan 2020 · ECR cruzado duplo-cego · medidas 2 h após a dose.',
        facts: ['n = 12', '71 ± 5 anos', '13,4 ± 1,6 mmol'],
    },
    {
        tab: 'Último',
        cohort: 'idoso',
        headline: 'No fim, +4,4% de potência',
        text: 'A potência máxima do joelho subiu 4,4 ± 7,8% (p < 0,05) e a velocidade máxima 10,9 ± 12,1%. Cada etapa é um gargalo: por isso mais nitrato não vira mais desempenho em linha reta.',
        source: 'Coggan 2020 · desvios-padrão amplos: a média esconde variação entre pessoas.',
        facts: ['velocidade +10,9%', 'potência +4,4%'],
    },
    {
        tab: 'Recreacional',
        cohort: 'recreacional',
        headline: 'Adulto saudável: o funil mais alto',
        text: 'Em 12 adultos de 22 a 50 anos com 11,2 mmol, o NO exalado subiu 61% e a potência de pico 4% na maior velocidade angular. O resumo não traz nitrato nem nitrito: esses degraus ficam tracejados.',
        source: 'Coggan 2015 · ECR cruzado duplo-cego · 2 h após a dose · degraus tracejados: ilustrativo.',
        facts: ['n = 12', '22 a 50 anos', '11,2 mmol'],
    },
    {
        tab: 'Elite',
        cohort: 'elite',
        headline: 'Na elite, o primeiro degrau já entra menor',
        text: 'Quanto mais apto, menor o aumento de nitrato plasmático (r = 0,86), e o nitrito basal já é alto (~2.000 nM). No último degrau: 26,4 contra 26,3 km em 40 min (p = 0,61).',
        source: 'Porcelli 2015 · Bescós 2011 · Bescós 2012 · degraus tracejados: direção, sem valor.',
        facts: ['r = 0,86', 'nitrito basal ~2.000 nM', '26,4 × 26,3 km'],
    },
    {
        tab: '3 desfechos',
        cohort: 'todos',
        headline: 'O mesmo mecanismo, três desfechos',
        text: 'A pergunta útil não é "o nitrato funciona?", e sim "quanto espaço de melhora existe neste indivíduo?". Desfechos e protocolos diferem entre os estudos: compare a forma, não os números.',
        source: 'Coggan 2020 · Coggan 2015 · Bescós 2012 · desfechos e doses diferentes.',
        facts: ['forma do funil, não o valor'],
    },
];
