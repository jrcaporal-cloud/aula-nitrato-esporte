/** Texto e dados do slide 54 (dossiê 03: KARABAG2026 — estudo único, rotulado como hipótese). */

export type Cell = 'up' | 'none' | 'silent' | 'unknown';

export interface Condition {
    id: 'caf' | 'bj' | 'both';
    name: string;
    sub: string;
    /** Resultado em cada uma das 5 lutas. */
    fights: readonly Cell[];
    /** Primeiro passo em que a linha aparece. */
    fromStep: number;
}

/** Cafeína melhorou as lutas 1–3 e não a 5; suco melhorou a 5; os dois melhoraram 1–3 e 5. A luta 4 não está no resumo. */
export const CONDITIONS: readonly Condition[] = [
    { id: 'caf', name: 'Cafeína', sub: 'sozinha', fights: ['up', 'up', 'up', 'unknown', 'none'], fromStep: 1 },
    { id: 'bj', name: 'Suco de beterraba', sub: 'sozinho', fights: ['silent', 'silent', 'silent', 'unknown', 'up'], fromStep: 2 },
    { id: 'both', name: 'Cafeína + suco', sub: 'os dois juntos', fights: ['up', 'up', 'up', 'unknown', 'up'], fromStep: 3 },
];

export interface JudoStep {
    tab: string;
    kicker: string;
    headline: string;
    text: string;
    facts: readonly (readonly [string, string])[];
    takeaway: string;
    source: string;
}

export const JUDO_STEPS: readonly JudoStep[] = [
    {
        tab: 'O dia',
        kicker: 'Karabağ 2026 · 35 judocas competitivos · cruzado duplo-cego',
        headline: 'Cinco lutas no mesmo dia',
        text: 'Quatro condições: suco de beterraba, cafeína, os dois e placebo. Em cada dia simulado de torneio, 5 randoris, o Special Judo Fitness Test e testes neuromusculares e cognitivos. O cansaço acumula.',
        facts: [['judocas', '35 (23 ± 5 anos)'], ['condições', '4, contra o placebo'], ['lutas no dia', '5']],
        takeaway: 'A pergunta: quem ajuda no começo e quem ajuda no fim?',
        source: 'Karabağ 2026, Eur J Sport Sci.',
    },
    {
        tab: 'Cafeína',
        kicker: 'cafeína sozinha',
        headline: 'A cafeína abre o dia',
        text: 'Melhorou o SJFT, os testes neuromusculares e a cognição nas lutas 1 a 3, mas não na luta 5.',
        facts: [['lutas 1 a 3', 'melhorou'], ['luta 5', 'não melhorou']],
        takeaway: 'Ajudou cedo e "acabou" na quinta luta.',
        source: 'Karabağ 2026, Eur J Sport Sci.',
    },
    {
        tab: 'Suco de beterraba',
        kicker: 'suco de beterraba sozinho',
        headline: 'O suco segura o fim',
        text: 'O suco de beterraba melhorou essas mesmas medidas justamente na luta 5, a mais cansativa do dia.',
        facts: [['luta 5', 'melhorou']],
        takeaway: 'Onde a cafeína saiu, o suco entrou.',
        source: 'Karabağ 2026, Eur J Sport Sci.',
    },
    {
        tab: 'Os dois',
        kicker: 'cafeína + suco de beterraba',
        headline: 'Juntos: começo e fim',
        text: 'A combinação melhorou as lutas 1 a 3 e também a luta 5. O resumo do artigo não descreve a luta 4.',
        facts: [['lutas 1 a 3', 'melhorou'], ['luta 5', 'melhorou'], ['luta 4', 'não descrita']],
        takeaway: 'Efeitos em horas diferentes do mesmo dia.',
        source: 'Karabağ 2026, Eur J Sport Sci.',
    },
    {
        tab: 'Hipótese',
        kicker: 'estudo único · publicação de 2026',
        headline: 'É hipótese, não regra',
        text: 'Sem réplica. O resumo não traz a dose nem os valores numéricos. Serve para levantar a pergunta do momento certo dentro do torneio, não para prescrever.',
        facts: [['status', 'hipótese'], ['réplica', 'nenhuma'], ['dose e valores', 'não no resumo']],
        takeaway: 'Se replicar, o tema passa a ser o momento do torneio.',
        source: 'Karabağ 2026, Eur J Sport Sci.',
    },
];
