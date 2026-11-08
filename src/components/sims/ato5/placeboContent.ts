/** Textos do PlaceboSim (slide 60). Números: dossiê 04, bloco A (GILCHRIST2014, LANSLEY2011a, BAILEY2009, FLUECK2016/2019). */

export interface PlaceboStep {
    tab: string;
    headline: string;
    text: string;
    source: string;
    takeaway: string;
}

export const PLACEBO_STEPS: readonly PlaceboStep[] = [
    {
        tab: 'A resina',
        headline: 'Tira o nitrato, deixa o resto',
        text: 'O suco desce por uma coluna de resina de troca aniônica. O ânion nitrato fica preso; pigmento, açúcar e sabor atravessam. Em 250 mL, de 7,5 para 0,002 mmol.',
        source: 'Gilchrist 2014, Nitric Oxide. Estudo em diabéticos tipo 2: serve só para o placebo.',
        takeaway: 'Quando disserem que não dá para cegar suco de beterraba, mostre a resina.',
    },
    {
        tab: 'Mesmo suco',
        headline: 'O que ninguém consegue notar',
        text: 'Degustação cega, açúcar e RMN de próton não distinguem os dois sucos, e a cor varia menos que entre cultivares. A única diferença é o nitrato.',
        source: 'Gilchrist 2014: UV-vis, RMN de próton, teste cego de degustação.',
        takeaway: 'Mesma cor, mesmo sabor, mesmo açúcar: um placebo quase perfeito.',
    },
    {
        tab: 'Três braços',
        headline: 'Sem nitrato, o suco não faz nada',
        text: 'Controle sem suplemento, depois suco depletado, depois beterraba. O depletado não mudou nitrito, pressão nem exercício. O efeito é do nitrato, não dos polifenóis.',
        source: 'Lansley 2011, J Appl Physiol: 9 homens ativos, 0,5 L/dia por 6 dias.',
        takeaway: 'O braço controle é o que prova o que o placebo sozinho não prova.',
    },
    {
        tab: 'Autocorreção',
        headline: 'O campo corrigiu o próprio placebo',
        text: 'Em 2009 o placebo era groselha-preta, outra fruta e sem teste de cego. Dois anos depois o mesmo grupo adotou o depletado; em 2014 ele ganhou laudo analítico.',
        source: 'Bailey 2009; Lansley 2011; Gilchrist 2014. Christensen 2013 ainda usou groselha-preta.',
        takeaway: 'Três artigos em cinco anos: uma autocorreção que dá para datar.',
    },
    {
        tab: 'Suco × sal',
        headline: 'O que ainda não se resolveu',
        text: 'Mesmo nitrito no plasma, mesma dose em mmol, e o suco baixou o VO₂ cerca de 4% a mais que o sal. Algo na beterraba, ou ruído de sete visitas? Diga “não resolvido”.',
        source: 'Flueck 2016, Appl Physiol Nutr Metab (n = 12); Flueck 2019, Nutrients.',
        takeaway: 'Escreva “não resolvido”, não “equivalente”.',
    },
];
