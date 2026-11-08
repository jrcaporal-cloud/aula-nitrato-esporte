/** Textos do slide 33 (dossiê 01: LARSEN2007, BESCOS2009, BESCOS2012REV, LUNDBERG2008). */

export interface ArginineStep {
    tab: string;
    headline: string;
    text: string;
    source: string;
    facts: readonly string[];
}

export const ARGININE_STEPS: readonly ArginineStep[] = [
    {
        tab: 'Duas vias',
        headline: 'Duas maneiras de dar NO',
        text: 'A L-arginina (e a L-citrulina, que vira arginina) alimenta a NO-sintase, que precisa de O₂. O nitrato alimenta a via alternativa, nitrato → nitrito → NO, que funciona melhor sem O₂.',
        source: 'Bescós 2012 (revisão) · Lundberg 2008 · via NOS-dependente × via NOS-independente.',
        facts: ['NOS: precisa de O₂', 'nitrito: hipóxia e acidez'],
    },
    {
        tab: 'Doses',
        headline: 'Duas ordens de grandeza de dose',
        text: 'Nitrato: ~7 mmol/dia, cerca de 0,43 g, por 3 dias. L-arginina: 20,5 g/dia (dieta mais 15 g de suplemento), por 3 dias. Dá cerca de 48 vezes mais massa (cálculo).',
        source: 'Larsen 2007 (9 homens, NaNO₃ 0,1 mmol/kg/dia) · Bescós 2009 (9 atletas, 3 dietas de 3 dias).',
        facts: ['3 dias', '1 mmol = 62 mg'],
    },
    {
        tab: 'Efeitos',
        headline: 'De um lado −5,4%, do outro nada',
        text: 'Nitrato: o VO₂ submáximo caiu 5,4%. L-arginina: nenhuma diferença nos parâmetros cardiorrespiratórios, nem no nitrato plasmático. Um lactato menor aos 5 min não se manteve nas intensidades maiores.',
        source: 'Larsen 2007 (p < 0,02) · Bescós 2009 · lactato aos 5 min: 3,0 vs 2,5 mM, p = 0,03.',
        facts: ['−5,4% de VO₂', 'arginina: nada'],
    },
    {
        tab: 'O₂ decide',
        headline: 'As vias são opostas em relação ao O₂',
        text: 'Onde falta oxigênio, a NO-sintase apaga e a redução do nitrito acende. Arginina e nitrato não são intercambiáveis: um alimenta a via que depende de O₂, o outro a que sobrevive sem ele.',
        source: 'Bescós 2012 (revisão) · Lundberg 2008 · o músculo em exercício intenso é hipóxico e ácido.',
        facts: ['complementares por desenho'],
    },
];

/** Doses (g/dia) e efeito no VO₂ (%), Larsen 2007 e Bescós 2009. */
export const DOSE_NITRATE = 0.43;
export const DOSE_ARGININE = 20.5;
export const EFFECT_NITRATE = -5.4;
