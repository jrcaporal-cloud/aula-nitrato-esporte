import { C } from '../kit/palette';

/** Slide 44 — "O Que Dizem as Meta-análises". Números: SENEFELD2020, POON2025, GAO2021, CAMPOS2018 (dossiê 02). */

export const FOREST_TABS = ['O geral', 'Dois desfechos', 'Em segundos', 'Atleta × não atleta', 'Certeza'] as const;

export type ForestGroup = 'geral' | 'desfecho' | 'pop';

export interface MetaRow {
    id: string;
    group: ForestGroup;
    label: string;
    sub: string;
    /** Sem estimativa publicada (só "sem melhora significativa"): a linha mostra texto no lugar do losango. */
    est?: number;
    lo?: number;
    hi?: number;
    color: string;
    text?: string;
}

export const META_ROWS: readonly MetaRow[] = [
    { id: 'geral', group: 'geral', label: 'Geral · Senefeld 2020', sub: '80 estudos · 1.335 pessoas', est: 0.174, lo: 0.120, hi: 0.229, color: C.nitrate },
    { id: 'tte1', group: 'desfecho', label: 'TTE · Poon 2025', sub: 'umbrella: 20 revisões, 180 estudos', est: 0.33, lo: 0.19, hi: 0.47, color: C.nitrite },
    { id: 'tte2', group: 'desfecho', label: 'TTE · Senefeld 2020', sub: '32 conjuntos de dados', est: 0.324, lo: 0.213, hi: 0.436, color: C.nitrite },
    { id: 'tt0', group: 'desfecho', label: 'Contrarrelógio · Poon 2025', sub: 'umbrella', color: C.no, text: 'sem melhora significativa' },
    { id: 'tt1', group: 'desfecho', label: 'Contrarrelógio · Senefeld 2020', sub: '52 conjuntos de dados', est: 0.086, lo: 0.002, hi: 0.173, color: C.no },
    { id: 'pop1', group: 'pop', label: 'Não atletas · Campos 2018', sub: 'Br J Nutr · 53 estudos', est: 0.25, lo: 0.11, hi: 0.38, color: C.o2 },
    { id: 'pop2', group: 'pop', label: 'Atletas · Campos 2018', sub: 'mesma meta-análise', est: 0.04, lo: -0.05, hi: 0.15, color: C.hypoxia },
];

/** Linhas visíveis e em foco, por passo. */
export const FOREST_VIEW: readonly { shown: readonly ForestGroup[]; focus: readonly ForestGroup[] }[] = [
    { shown: ['geral'], focus: ['geral'] },
    { shown: ['geral', 'desfecho'], focus: ['desfecho'] },
    { shown: ['geral', 'desfecho'], focus: [] },
    { shown: ['geral', 'desfecho', 'pop'], focus: ['pop'] },
    { shown: ['geral', 'desfecho', 'pop'], focus: [] },
];

export const FOREST_FEET: readonly string[] = [
    'Oitenta estudos, um número: d = 0,17. Real, objetivamente pequeno, e só cerca de um terço dos estudos teve melhora significativa.',
    'O mesmo agrupado em dois desfechos: o tempo até a exaustão fica em ~0,33; o contrarrelógio, em 0,09, quase dentro da faixa trivial.',
    'Em segundos, a meta-análise de Gao dá +25 s no tempo até a exaustão e −2 s no contrarrelógio, e este último não é significativo.',
    'Quando a meta-análise separa quem é atleta, o efeito vai a ~zero: 0,25 nos não atletas, 0,04 nos atletas.',
    'Atenção: SMD de TTE e de TT não são a mesma régua. E a certeza é baixa: o que muda de uma meta-análise para outra é o desfecho e quem entra.',
];
