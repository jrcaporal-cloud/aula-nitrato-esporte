import { C } from '../kit/palette';

/** Dados e textos do MetaDisagreeSim (slide 67). Números: dossiê 04, bloco I (HOON2013, MCMAHON2017, SENEFELD2020, GAO2021, XIE2026). */

export type CutId = 'tte' | 'tt' | 'all' | 'athlete';

export interface Estimate { est: number; lo: number; hi: number; note?: string }

export interface MetaRow {
    id: 'hoon' | 'mcm' | 'sen' | 'gao' | 'xie';
    name: string;
    sub: string;
    color: string;
    /** Estimativas em SMD por recorte; Gao usa segundos (fora da escala) e vira texto. */
    cuts: Partial<Record<CutId, Estimate>>;
    seconds?: Partial<Record<CutId, string>>;
}

export const META_ROWS: readonly MetaRow[] = [
    {
        id: 'hoon', name: 'Hoon 2013', sub: '17 estudos', color: C.nitrate,
        cuts: { tte: { est: 0.79, lo: 0.23, hi: 1.35 }, tt: { est: 0.11, lo: -0.16, hi: 0.37 } },
    },
    {
        id: 'mcm', name: 'McMahon 2017', sub: '47 estudos · 76 ensaios', color: C.nitrite,
        cuts: { tte: { est: 0.33, lo: 0.15, hi: 0.5 }, all: { est: -0.1, lo: -0.27, hi: 0.06, note: 'sinal do artigo' } },
    },
    {
        id: 'sen', name: 'Senefeld 2020', sub: '80 estudos · 111 conjuntos', color: C.no,
        cuts: {
            tte: { est: 0.324, lo: 0.213, hi: 0.436 }, tt: { est: 0.086, lo: 0.002, hi: 0.173 },
            all: { est: 0.174, lo: 0.12, hi: 0.229 }, athlete: { est: 0.021, lo: -0.103, hi: 0.144, note: 'VO₂max ≥ 65' },
        },
    },
    {
        id: 'gao', name: 'Gao 2021', sub: '73 estudos · n = 1.061', color: C.o2, cuts: {},
        seconds: { tte: 'TTE +25,3 s (12,7 a 37,8)', tt: 'TT −1,98 s (−4,37 a 0,41) n.s.', all: 'potência +4,6 W · certeza baixa', athlete: 'elite: VO₂ sem efeito (0,01)' },
    },
    {
        id: 'xie', name: 'Xie 2026', sub: '45 ECRs · 659 atletas', color: C.bacteria,
        cuts: { athlete: { est: 0.13, lo: -0.07, hi: 0.32, note: 'potência de pico' } },
    },
];

export interface MetaStep {
    tab: string;
    cut: CutId | 'every';
    title: string;
    headline: string;
    text: string;
    source: string;
    takeaway: string;
}

export const META_STEPS: readonly MetaStep[] = [
    {
        tab: 'TTE', cut: 'tte', title: 'Desfecho: tempo até a exaustão · saudáveis',
        headline: 'No tempo até a exaustão, o efeito é grande',
        text: 'Três meta-análises, três diamantes à direita do zero: 0,79, 0,33 e 0,32. Gao 2021 soma +25 s.',
        source: 'Hoon 2013; McMahon 2017; Senefeld 2020; Gao 2021 (em segundos, fora da escala).',
        takeaway: 'Até aqui parece uma resposta única.',
    },
    {
        tab: 'Contrarrelógio', cut: 'tt', title: 'Desfecho: contrarrelógio · saudáveis',
        headline: 'No contrarrelógio, os mesmos diamantes encolhem',
        text: 'Hoon 2013: 0,11, não significativo. Senefeld 2020: 0,09, quase colado no zero. Gao 2021: −1,98 s, não significativo.',
        source: 'Hoon 2013; Senefeld 2020; Gao 2021.',
        takeaway: 'O campo levou anos para parar de citar o 0,79 sem o 0,11.',
    },
    {
        tab: 'Agrupado', cut: 'all', title: 'Desfechos agrupados · saudáveis',
        headline: 'Misturando desfechos, sai o que se mistura',
        text: 'McMahon 2017: −0,10, trivial para o contrarrelógio (no artigo, negativo = tempo menor). Senefeld 2020: 0,17. Gao 2021: potência +4,6 W, certeza baixa.',
        source: 'McMahon 2017; Senefeld 2020; Gao 2021.',
        takeaway: 'Agrupar decide o diamante tanto quanto os estudos.',
    },
    {
        tab: 'Atletas', cut: 'athlete', title: 'População: atletas bem treinados',
        headline: 'Em atletas, quase nada',
        text: 'Senefeld 2020: 0,02 acima de 65 mL/kg/min. Xie 2026: potência de pico 0,13, com o intervalo cruzando o zero. Gao: sem efeito em elite.',
        source: 'Senefeld 2020; Xie 2026 (Tier ≥ 2); Gao 2021.',
        takeaway: 'Quem entra na meta-análise decide o veredito.',
    },
    {
        tab: 'Tudo junto', cut: 'every', title: '',
        headline: 'Mesmos dados, vereditos opostos',
        text: 'Gao 2021 concluiu que o nitrato beneficia o endurance, com contrarrelógio de −1,98 s (n.s.) e nenhum desfecho acima de certeza baixa. Xie 2026 não achou nada em atletas. A diferença: quem entra e qual desfecho se agrupa.',
        source: 'Hoon 2013; McMahon 2017; Senefeld 2020; Gao 2021; Xie 2026.',
        takeaway: 'Nenhum estudo foi adicionado ou removido desta tela.',
    },
];

export const CUT_OPTIONS = [
    { value: 'tte', label: 'TTE' },
    { value: 'tt', label: 'Contrarr.' },
    { value: 'all', label: 'Agrupado' },
    { value: 'athlete', label: 'Atletas' },
] as const;
