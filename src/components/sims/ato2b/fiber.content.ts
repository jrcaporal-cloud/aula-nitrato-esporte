/** Textos do slide 29 (dossiê 01: HERNANDEZ2012, FERGUSON2013, FERGUSON2015, BAILEY2015, ZOUGHAIB2026). */

export interface FiberStep {
    tab: string;
    headline: string;
    text: string;
    source: string;
    facts: readonly string[];
}

export const FIBER_STEPS: readonly FiberStep[] = [
    {
        tab: 'Camundongo',
        headline: 'No camundongo, só a fibra rápida responde',
        text: 'Nitrato 1 mM na água por 7 dias. Na fibra rápida o Ca²⁺ livre sobe de 20 a 150 Hz e a força cresce a baixa frequência (até 50 Hz); a ~100 Hz a força sobe ~35% mais rápido. Na fibra lenta: nenhuma mudança.',
        source: 'Hernández 2012 · J Physiol · fibras isoladas de C57bl/6 macho · pontos de Ca²⁺ ilustrativos.',
        facts: ['rápida ↑', 'lenta ='],
    },
    {
        tab: 'Rato · 28',
        headline: '28 músculos: o fluxo segue o tipo de fibra',
        text: 'Em ratos correndo, o ganho relativo de fluxo com beterraba (1 mmol/kg/dia, 5 dias), medido com microesferas, acompanhou a % de fibras IIb + d/x em 28 músculos. Não é efeito global de pressão: é redistribuição.',
        source: 'Ferguson 2013 · J Physiol · só r e n são dados; % de fibra e ganho de cada ponto são ilustrativos.',
        facts: ['fluxo total +39%', 'condutância r = 0,71'],
    },
    {
        tab: 'PO₂',
        headline: 'A PO₂ no capilar sobe só no músculo rápido',
        text: 'Em contrações a 1 Hz, a PO₂ microvascular do gastrocnêmio (91% de fibras rápidas) subiu de 14 para 19 mmHg; no sóleo (9%), nada. Mais PO₂ no capilar é maior gradiente de difusão do sangue para a fibra.',
        source: 'Ferguson 2015 · fosforescência · 6 ratos por grupo · médias arredondadas; o aumento relatado é de 43%.',
        facts: ['gastrocnêmio +43%', 'sóleo ='],
    },
    {
        tab: 'Cadência',
        headline: 'O mesmo ciclista, duas cadências',
        text: 'Ciclismo severo depois de 9 dias de suco (8,4 mmol/dia). A 35 rpm, nenhuma diferença. A 115 rpm, que recruta mais fibras tipo II, o tempo limite foi de 297 para 362 s e a fase II do VO₂ ficou mais rápida (τ de 61 para 47 s).',
        source: 'Bailey 2015 · 7 pessoas · cadência é um proxy indireto de recrutamento de fibra.',
        facts: ['115 rpm: +22%', '35 rpm: ='],
    },
    {
        tab: 'Humano',
        headline: 'Em humanos, os desvios vão para lados opostos',
        text: 'O nitrato não mudou o twitch, mas deslocou a relação torque-frequência: para a esquerda no tríceps braquial (rápido) e para a direita no tríceps sural (lento). Para quem tem músculo de fibra lenta, é hipótese de prejuízo, não só de ausência de benefício.',
        source: 'Zoughaib 2026 · 14 homens · 2,2 mL/kg de suco (200 µmol/kg de nitrato), agudo · curvas ilustrativas.',
        facts: ['p = 0,019 · p < 0,001', 'twitch ='],
    },
];
