/** Slide 42 — "Dose: Mais não é Melhor". Números de WYLIE2013 (abstract), SHANNON2022, IOC2018 e SENEFELD2020. 1 mmol = 62 mg. */

export const DOSE_TABS = ['Três doses', 'Tolerância', 'Custo de O₂', 'Consenso', 'Arraste a dose'] as const;

/** WYLIE2013: 10 homens, 70/140/280 mL de beterraba concentrada, teste 2,5 h depois. */
export const DOSES = [
    { mmol: 4.2, ml: 70, mg: 260 },
    { mmol: 8.4, ml: 140, mg: 521 },
    { mmol: 16.8, ml: 280, mg: 1042 },
] as const;

/** Tolerância (tempo até a falha, %) e redução do custo de O₂ (%), por dose. 4,2 mmol não alterou nada. */
export const TOLERANCE: readonly (readonly [number, number])[] = [[0, 0], [4.2, 0], [8.4, 14], [16.8, 12]];
export const O2_COST: readonly (readonly [number, number])[] = [[0, 0], [4.2, 0], [8.4, 1.7], [16.8, 3.0]];

/** Faixas de consenso no eixo da dose (mmol). */
export const CONSENSUS = [
    { id: 'ioc', label: 'IOC 2018 · bolus', from: 5, to: 9, note: '5–9 mmol (310–560 mg), 2–3 h antes' },
    { id: 'agudo', label: 'Delphi 2022 · agudo', from: 8, to: 16, note: '8–16 mmol, última dose 2–4 h antes' },
    { id: 'cronico', label: 'Delphi 2022 · por dia', from: 4, to: 16, note: '4–16 mmol/dia em uso crônico' },
] as const;

/** Interpolação linear entre os pontos medidos (ilustrativa fora dos três pontos). */
export const interpolate = (pts: readonly (readonly [number, number])[], x: number): number => {
    for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1];
        const [x1, y1] = pts[i];
        if (x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
    }
    return pts[pts.length - 1][1];
};

export const DOSE_FEET: readonly string[] = [
    'Wylie 2013 comparou três doses de suco concentrado, 2,5 h antes do teste. O nitrito no sangue subiu de forma dose-dependente, com pico em 2–3 h.',
    'Com 4,2 mmol, nada. Com 8,4 mmol, a tolerância ao esforço intenso sobe 14%. Dobrar para 16,8 mmol dá 12%: o mesmo efeito.',
    'O custo de O₂ caiu 1,7% (p = 0,06) e 3,0% (p < 0,05) com as duas doses maiores: a dose-resposta bioquímica continua, a do desempenho para.',
    'Os consensos concordam com o platô: começar perto de 8 mmol e não passar de ~16. Abaixo de ~5 mmol (1,6–5,0 mmol/dia), o agrupado não achou efeito.',
    'Arraste a dose no eixo. Entre os três pontos medidos é só interpolação; o que o estudo mediu foi 4,2, 8,4 e 16,8 mmol.',
];
