/**
 * Slide 30 (dossiê 01): Hernández 2012 (camundongo), Whitfield 2017 e Haider 2014 (humanos).
 * Cada célula é um achado do resumo; "—" = não se aplica ou sem dado no dossiê.
 */

export type Glyph = '↑' | '=' | '—';
export type Group = 'what' | 'why';

export interface Cell {
    glyph: Glyph;
    lines: readonly [string, string?];
}

export interface Row {
    label: string;
    group: Group;
    mouse: Cell;
    human: Cell;
}

export const MOUSE_ROWS: readonly Row[] = [
    {
        label: 'Força a baixa frequência', group: 'what',
        mouse: { glyph: '↑', lines: ['Ca²⁺ ↑ 20–150 Hz', 'força ↑ até 50 Hz'] },
        human: { glyph: '↑', lines: ['10 Hz: 41,1 vs', '37,6% do pico'] },
    },
    {
        label: 'Twitch e taxa de força', group: 'what',
        mouse: { glyph: '↑', lines: ['~35% mais rápida', 'a ~100 Hz'] },
        human: { glyph: '↑', lines: ['twitch 164,0 vs', '136,5 N'] },
    },
    {
        label: 'Força voluntária máxima', group: 'what',
        mouse: { glyph: '—', lines: ['fibra isolada'] },
        human: { glyph: '=', lines: ['602 vs 596 N'] },
    },
    {
        label: 'Proteínas de Ca²⁺', group: 'why',
        mouse: { glyph: '↑', lines: ['CASQ1 e DHPR ↑'] },
        human: { glyph: '=', lines: ['SERCA1a/2a, DHPR,', 'RyR, calsequestrina'] },
    },
    {
        label: 'Estado redox (GSH:GSSG)', group: 'why',
        mouse: { glyph: '—', lines: ['sem dado aqui'] },
        human: { glyph: '=', lines: ['razão inalterada'] },
    },
];

export interface MouseStep {
    tab: string;
    headline: string;
    text: string;
    source: string;
    facts: readonly string[];
}

export const MOUSE_STEPS: readonly MouseStep[] = [
    {
        tab: 'A pergunta',
        headline: 'A mesma pergunta em dois bichos',
        text: 'Com uma semana de nitrato, o músculo rápido fica mais forte? Em 2012 a resposta veio do camundongo, com mecanismo. Em 2017, alguém repetiu em gente, medindo os mesmos alvos.',
        source: 'Hernández 2012 (camundongo) · Whitfield 2017 e Haider 2014 (humanos).',
        facts: ['7 dias de nitrato', 'músculo rápido'],
    },
    {
        tab: 'Camundongo',
        headline: 'Camundongo: o Ca²⁺ sobe e a fibra rápida responde',
        text: 'Em fibras isoladas, o Ca²⁺ livre foi maior de 20 a 150 Hz e a força cresceu até 50 Hz; a ~100 Hz a força subiu ~35% mais rápido. Vieram junto mais CASQ1 e DHPR. No músculo lento: nada.',
        source: 'Hernández 2012 · J Physiol · C57bl/6 macho · NaNO₃ 1 mM na água por 7 dias.',
        facts: ['fibra rápida ↑', 'fibra lenta: nada'],
    },
    {
        tab: 'Humano',
        headline: 'Humano: o fenótipo replicou',
        text: 'Suco de beterraba (~26 mmol/dia, 7 dias): twitch de pico 164,0 contra 136,5 N (p < 0,01) e taxas de contração e relaxamento maiores. A força voluntária máxima não mudou. Haider 2014, com 19 homens, viu o mesmo: twitch 149 contra 138 N.',
        source: 'Whitfield 2017 (8 homens por grupo, vasto lateral) · Haider 2014 (n = 19, ~9,7 mmol/dia).',
        facts: ['twitch ↑', 'força máx. =', 'replicado por outro grupo'],
    },
    {
        tab: 'Proteínas',
        headline: 'Mesmos alvos, nenhuma proteína mexeu',
        text: 'Whitfield mediu SERCA1a, SERCA2a, DHPR, receptor de rianodina e calsequestrina, mais a razão GSH:GSSG: tudo igual. O mecanismo do camundongo não apareceu no humano.',
        source: 'Whitfield 2017 · biópsias em 8 homens recreacionalmente ativos · Med Sci Sports Exerc.',
        facts: ['n = 8 (biópsias)', '5 proteínas + redox'],
    },
    {
        tab: 'Veredito',
        headline: 'Sabemos o quê, não sabemos por quê',
        text: 'O músculo humano responde a baixa frequência, e isso foi replicado. O mecanismo molecular continua desconhecido. Dizer isso em voz alta vale mais que emprestar um mecanismo do camundongo.',
        source: 'Whitfield 2017 · Haider 2014 · Hernández 2012.',
        facts: ['fenótipo: replicado', 'mecanismo: desconhecido'],
    },
];
