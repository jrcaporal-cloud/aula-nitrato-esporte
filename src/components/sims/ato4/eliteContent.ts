/** Texto e números do slide 53 (dossiê 03: JONVIK2018, XIE2026, EROGLU2026, POON2025). */

export interface EliteStep {
    tab: string;
    kicker: string;
    headline: string;
    text: string;
    facts: readonly (readonly [string, string])[];
    takeaway: string;
    source: string;
    chip: string;
}

export const ELITE_STEPS: readonly EliteStep[] = [
    {
        tab: 'Wingate',
        kicker: 'Jonvik 2018 · 52 atletas · 3 × Wingate de 30 s',
        headline: 'Pico igual, chegada mais cedo',
        text: 'Com ~800 mg/dia de nitrato (≈ 12,9 mmol) por 6 dias, o pico de potência ficou igual. O que mudou foi o tempo até chegar a ele: cerca de 2,8% menor.',
        facts: [['pico de potência', '1.338 vs 1.333 W'], ['P (pico)', '0,62'], ['tempo até o pico', '−2,8% · P 0,007']],
        takeaway: 'Não sobe o pico: antecipa-o.',
        source: 'Jonvik 2018, Eur J Sport Sci.',
        chip: 'forma ilustrativa · diferença ampliada 5×',
    },
    {
        tab: 'Três níveis',
        kicker: 'mesmo estudo · interação com o nível: P > 0,30',
        headline: 'O nível não moderou',
        text: 'Recreacionais, patinadores de talento nacional e ciclistas de pista de nível olímpico responderam do mesmo jeito. Isso contraria a ideia de que a elite "não responde".',
        facts: [['recreacionais', 'n = 20'], ['talento nacional', 'n = 22'], ['nível olímpico', 'n = 10']],
        takeaway: 'Mesmo efeito no tempo até o pico, do amador ao olímpico.',
        source: 'Jonvik 2018, Eur J Sport Sci.',
        chip: 'desenho em escala · sem eixo truncado',
    },
    {
        tab: 'Atletas agrupados',
        kicker: 'Xie 2026 · 45 ECRs · 659 atletas (Tier ≥ 2)',
        headline: 'Em atletas, o pico não sobe',
        text: 'Meta-análise só de atletas: pico g 0,13 e potência média g 0,04, ambos sem efeito, em qualquer tipo de esporte. Os autores falam em ausência de evidência, não em prova de ausência.',
        facts: [['pico de potência', 'g 0,13 n.s.'], ['potência média', 'g 0,04 n.s.'], ['certeza (GRADE)', 'baixa']],
        takeaway: 'Nulo agrupado, de certeza baixa.',
        source: 'Xie 2026, Sports (Basel).',
        chip: 'dados publicados · IC95%',
    },
    {
        tab: 'Tempo até o pico',
        kicker: 'Eroglu 2026 · 23 ECRs · 401 pessoas',
        headline: 'O sinal que sobra: chegar antes',
        text: 'Em 4 estudos de Wingate, o tempo até o pico caiu (SMD −0,92). Pico, potência média, salto e sprints de 10 e 20 m não mudaram. A certeza vai de baixa a muito baixa.',
        facts: [['Eroglu · tempo até o pico', 'SMD −0,92'], ['Poon · tempo até o pico', 'SMD −0,76'], ['certeza', 'baixa a muito baixa']],
        takeaway: 'Chega antes, não chega mais alto, e a certeza é baixa.',
        source: 'Eroglu 2026 (Nutrients) · Poon 2025 (Sports Med).',
        chip: 'dados publicados · IC95%',
    },
];

export interface Tier {
    id: string;
    name: string;
    sport: string;
    n: number;
}

export const TIERS: readonly Tier[] = [
    { id: 'rec', name: 'Recreacional', sport: 'ciclistas', n: 20 },
    { id: 'nac', name: 'Talento nacional', sport: 'patinadores de velocidade', n: 22 },
    { id: 'oli', name: 'Nível olímpico', sport: 'ciclistas de pista', n: 10 },
];
