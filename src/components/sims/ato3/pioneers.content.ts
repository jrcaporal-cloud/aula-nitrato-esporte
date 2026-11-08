/** Slide 40 — "Do Sal à Beterraba": três estudos em dois anos e o que cada um corrigiu (dossiês 01 e 02). */

export const PIONEER_TABS = ['2007 · o sal', '2009 · o suco', '2011 · o placebo', '2011 · a prova', 'Autocorreção'] as const;

export interface PioneerCard {
    year: string;
    tag: string;
    title: string;
    lines: readonly string[];
    color: 'sal' | 'suco' | 'placebo' | 'prova';
}

/** Valores de LARSEN2007 (sal), BAILEY2009 (suco), LANSLEY2011a (placebo depletado) e LANSLEY2011b (contrarrelógio). */
export const PIONEER_CARDS: readonly PioneerCard[] = [
    {
        year: '2007', tag: 'KAROLINSKA · LARSEN 2007', color: 'sal',
        title: 'O custo de O₂ não era constante',
        lines: ['9 homens bem treinados, cicloergômetro', 'NaNO₃ 0,1 mmol/kg/dia por 3 dias × NaCl', 'Eficiência bruta 19,7 → 21,1%; lactato igual', 'Os autores: "altamente surpreendente"'],
    },
    {
        year: '2009', tag: 'EXETER · BAILEY 2009', color: 'suco',
        title: 'Do sal para o alimento',
        lines: ['8 homens, 500 mL/dia de suco (5,6 mmol), 6 dias', 'Tempo até a exaustão: 583 → 675 s', 'Componente lento do VO₂ menor', 'Placebo: cordial de groselha-preta'],
    },
    {
        year: '2011', tag: 'EXETER · LANSLEY 2011a', color: 'placebo',
        title: 'O placebo certo: a beterraba sem o nitrato',
        lines: ['9 homens ativos, 0,5 L/dia por 6 dias', 'Depletado: ~0,003 mmol × ~6,2 mmol', 'Nitrito 183 × 373 nM', 'O depletado não mudou nada vs. sem bebida'],
    },
    {
        year: '2011', tag: 'EXETER · LANSLEY 2011b', color: 'prova',
        title: 'Da exaustão para o relógio',
        lines: ['9 ciclistas competitivos (VO₂max ~56)', 'Dose aguda ~6,2 mmol, 2,5 h antes', 'Potência 292 × 279 W (4 km), 247 × 233 W (16,1 km)', 'VO₂ igual: mais potência pelo mesmo O₂'],
    },
];

/** Linhas do passo final: o que mudou entre 2007 e 2011. */
export const CORRECTIONS = [
    { what: 'A fonte', from: 'sal (NaNO₃)', to: 'suco de beterraba', when: '2007 → 2009' },
    { what: 'O placebo', from: 'groselha-preta', to: 'beterraba depletada', when: '2009 → 2011' },
    { what: 'A régua', from: 'até a exaustão: +16%', to: 'contrarrelógio: −2,7%', when: '2009 → 2011' },
] as const;

export const PIONEER_FEET: readonly string[] = [
    'Karolinska, 2007: um sal de nitrato por três dias faz o músculo gastar menos oxigênio para a mesma carga. Ninguém esperava.',
    'Exeter, 2009: o suco de beterraba reproduz o efeito, e o tempo até a exaustão sobe 16%. É daqui que vem o número da manchete.',
    'Exeter, 2011: o mesmo suco sem nitrato não faz nada. O efeito é do ânion, não dos polifenóis nem das betalaínas.',
    'Exeter, 2011: em contrarrelógio de 4 e 16,1 km o ganho é de 2,7 a 2,8%. Longe dos 16%, mas é uma prova de verdade.',
    'Em dois anos o campo trocou o sal pelo alimento, a groselha pelo placebo depletado e a exaustão pelo relógio.',
];
