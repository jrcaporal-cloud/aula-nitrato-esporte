import { COL } from './colors';

/*
 * Textos e números do modelo. Números só os do dossiê 01 (seções 8–10) e 03 (ZOUGHAIB2026, HERNANDEZ2012).
 * Tudo que é forma (curvas, espectro, pontos do gráfico) é esquemático e vem rotulado na tela.
 */

export const DATA = {
    /** BAILEY2010, baixa intensidade (extensão de joelho, n = 7, 500 mL/dia de suco por 6 dias). */
    low: { dPcr: { placebo: 8.1, nitrate: 5.2 }, atp: { placebo: 296, nitrate: 192 } },
    /** BAILEY2010, alta intensidade: componentes lentos, tempo até a exaustão e turnover de ATP. */
    high: {
        vo2Slow: { placebo: 209, nitrate: 100 },
        pcrSlow: { placebo: 3.9, nitrate: 1.6 },
        tte: { placebo: 586, nitrate: 734 },
        atp: { placebo: 607, nitrate: 436 },
    },
    nitriteNm: { placebo: 231, nitrate: 547 },
    /** FERGUSON2013 / FERGUSON2015 (ratos). */
    limb: { r: 0.74, muscles: 28, flowPct: 39, po2: { placebo: 14, nitrate: 19 }, gastroPct: 91, soleusPct: 9 },
} as const;

export type HudKind = 'spectrum' | 'vo2' | 'mouse' | 'scatter' | 'human';
export type StationId = 'a' | 'c' | 'd';

export interface StepText {
    badge: string;
    title: string;
    short: string;
    text: string;
    sources: readonly string[];
    hud: HudKind;
    station: StationId;
    /** Título curto do cartão de números do HUD. */
    hudTitle: string;
}

export const STEP_TEXTS: readonly StepText[] = [
    {
        badge: 'MESMA FORÇA',
        title: 'Menos PCr para a mesma força',
        short: 'Mesma força',
        text: 'Dois sarcômeros sustentam a mesma carga pelo mesmo tempo. No placebo o pico de PCr afunda 8,1 mM; com nitrato, 5,2 mM, e o turnover de ATP cai de 296 para 192 µM/s, com o pH igual. A contração ficou mais barata; não chegou mais oxigênio.',
        sources: ['Bailey SJ et al. J Appl Physiol 2010;109(1):135-148.', 'Jones AM. Sports Med 2014;44(Suppl 1):S35-45 (pH).'],
        hud: 'spectrum',
        station: 'a',
        hudTitle: 'Baixa intensidade',
    },
    {
        badge: 'COMPONENTE LENTO',
        title: 'O componente lento encolhe',
        short: 'Comp. lento',
        text: 'No esforço intenso o VO₂ continua subindo além do esperado: é o componente lento, o custo que deriva para cima. Com nitrato ele cai de 209 para 100 mL/min, e a tolerância vai de 586 para 734 s. Menos custo por contração, mais tempo no mesmo esforço.',
        sources: ['Bailey SJ et al. J Appl Physiol 2010;109(1):135-148.'],
        hud: 'vo2',
        station: 'a',
        hudTitle: 'Alta intensidade',
    },
    {
        badge: 'FIBRAS · CAMUNDONGO',
        title: 'A fibra rápida responde',
        short: 'Fibras',
        text: 'O músculo é um mosaico de fibras tipo I e tipo II. No camundongo, o nitrato aumenta o Ca²⁺ tetânico e a força só na fibra rápida, com mais calsequestrina 1 (CASQ1) e receptor de di-hidropiridina (DHPR). A fibra lenta não muda.',
        sources: ['Hernández A et al. J Physiol 2012;590(15):3575-3583.'],
        hud: 'mouse',
        station: 'a',
        hudTitle: 'Camundongo',
    },
    {
        badge: 'PERFUSÃO · RATO',
        title: 'O fluxo extra vai para a fibra rápida',
        short: 'Perfusão',
        text: 'Em 28 músculos de rato, o ganho de fluxo com nitrato acompanha o percentual de fibras tipo II (r = 0,74). No gastrocnêmio, rápido, a PO₂ microvascular sobe 43%; no sóleo, lento, não muda. Não é efeito global da pressão: é redistribuição.',
        sources: ['Ferguson SK et al. J Physiol 2013;591(2):547-557.', 'Ferguson SK et al. Nitric Oxide 2015;48:38-43.'],
        hud: 'scatter',
        station: 'c',
        hudTitle: 'Rato',
    },
    {
        badge: 'HUMANOS',
        title: 'Mesmo suco, lados opostos',
        short: 'Humano',
        text: 'Em humanos, o mesmo suco desloca a relação torque-frequência para a esquerda no tríceps braquial (rápido) e para a direita na panturrilha (lenta); o topo da curva não muda. As proteínas de Ca²⁺ medidas no músculo humano não mudaram. Sabemos o quê, não sabemos por quê.',
        sources: ['Zoughaib WS et al. Med Sci Sports Exerc 2026;58(5):1012-1020.', 'Whitfield J et al. Med Sci Sports Exerc 2017;49(10):2016-2024.'],
        hud: 'human',
        station: 'd',
        hudTitle: 'Humanos',
    },
];

/** Linha do cartão de números: valor vivo (`live`), par placebo → nitrato ou texto livre. */
export interface StatSpec {
    label: string;
    from?: string;
    to?: string;
    unit?: string;
    text?: string;
    live?: 'dpcr' | 'atp';
}

export const STATS: readonly (readonly StatSpec[])[] = [
    [
        { label: 'Queda da PCr (ΔPCr)', live: 'dpcr', unit: 'mM' },
        { label: 'Turnover de ATP', live: 'atp', unit: 'µM/s' },
        { label: 'pH muscular', text: 'igual nos dois' },
        { label: 'Nitrito no plasma', from: '231', to: '547', unit: 'nM' },
    ],
    [
        { label: 'Componente lento do VO₂', from: '209', to: '100', unit: 'mL/min' },
        { label: 'Tempo até a exaustão', from: '586', to: '734', unit: 's' },
        { label: 'Componente lento da PCr', from: '3,9', to: '1,6', unit: 'mM' },
        { label: 'Turnover de ATP', from: '607', to: '436', unit: 'µM/s' },
    ],
    [
        { label: 'Ca²⁺ de 20 a 150 Hz', text: 'maior só na fibra rápida' },
        { label: 'Força até 50 Hz', text: 'muito maior só na rápida' },
        { label: 'Subida da força a ~100 Hz', text: '~35% mais rápida (rápida)' },
        { label: 'Fibra lenta', text: 'sem mudança' },
    ],
    [
        { label: 'Correlação fluxo × % tipo II', text: 'r = 0,74 em 28 músculos' },
        { label: 'Fluxo do membro', text: '+39%' },
        { label: 'PO₂ microvascular, gastrocnêmio', from: '14', to: '19', unit: 'mmHg' },
        { label: 'PO₂ microvascular, sóleo', text: 'sem mudança' },
    ],
    [
        { label: 'Tríceps braquial (rápido)', text: 'curva para a esquerda · p = 0,019' },
        { label: 'Tríceps sural (lento)', text: 'curva para a direita · p < 0,001' },
        { label: 'Twitch, potenciação, taxas', text: 'iguais' },
        { label: 'Proteínas de Ca²⁺ (humanos)', text: 'sem mudança' },
    ],
];

export type StructureId =
    | 'miosina' | 'actina' | 'linhaZ' | 'rs' | 'tubuloT' | 'casq1' | 'dhpr'
    | 'musculo' | 'gastro' | 'soleo' | 'braquial' | 'sural';

export interface Structure { name: string; info: string; source: string; color: string }

export const STRUCTURES: Readonly<Record<StructureId, Structure>> = {
    miosina: {
        name: 'Miosina e pontes cruzadas',
        info: 'Filamento grosso. As cabeças formam pontes cruzadas com a actina e puxam o filamento fino para o centro do sarcômero; cada ciclo gasta um ATP.',
        source: 'Esquema didático.',
        color: COL.thick,
    },
    actina: {
        name: 'Actina',
        info: 'Filamento fino, preso à linha Z. Desliza entre os filamentos grossos quando as pontes puxam, e é isso que encurta o sarcômero.',
        source: 'Esquema didático.',
        color: COL.thin,
    },
    linhaZ: {
        name: 'Linha Z',
        info: 'Limite do sarcômero e âncora dos filamentos finos. Duas linhas Z seguidas delimitam uma unidade contrátil.',
        source: 'Esquema didático.',
        color: COL.zdisc,
    },
    rs: {
        name: 'Retículo sarcoplasmático',
        info: 'Reservatório de Ca²⁺ da fibra. As cisternas terminais ficam coladas ao túbulo T e liberam Ca²⁺ no sarcoplasma quando chega o sinal.',
        source: 'Esquema didático.',
        color: COL.cisterna,
    },
    tubuloT: {
        name: 'Túbulo T',
        info: 'Invaginação da membrana que leva o potencial de ação para dentro da fibra, até encostar nas cisternas do retículo.',
        source: 'Esquema didático.',
        color: COL.tubule,
    },
    casq1: {
        name: 'Calsequestrina 1 (CASQ1)',
        info: 'Proteína que guarda Ca²⁺ dentro das cisternas. No camundongo, o nitrato aumentou sua expressão só na fibra rápida.',
        source: 'Hernández A et al. J Physiol 2012;590(15):3575-3583.',
        color: COL.nitrate,
    },
    dhpr: {
        name: 'Receptor de di-hidropiridina (DHPR)',
        info: 'Sensor de voltagem do túbulo T que dispara a liberação de Ca²⁺. Aumentou com nitrato na fibra rápida do camundongo; em humanos, não mudou.',
        source: 'Hernández 2012; Whitfield J et al. Med Sci Sports Exerc 2017;49(10):2016-2024.',
        color: COL.nitrate,
    },
    musculo: {
        name: 'Músculo do membro posterior',
        info: 'Um dos 28 músculos e porções musculares do rato. A cor mostra o percentual de fibras IIb + d/x; o halo verde, o ganho de fluxo com nitrato.',
        source: 'Ferguson SK et al. J Physiol 2013;591(2):547-557.',
        color: COL.fiberII,
    },
    gastro: {
        name: 'Gastrocnêmio (rápido)',
        info: 'Porção mista com 91% de fibras IIb + d/x. Com nitrato, a PO₂ microvascular em contração subiu de 14 para 19 mmHg, cerca de 43%.',
        source: 'Ferguson SK et al. Nitric Oxide 2015;48:38-43.',
        color: COL.o2,
    },
    soleo: {
        name: 'Sóleo (lento)',
        info: 'Apenas 9% de fibras IIb + d/x. Com nitrato, a PO₂ microvascular não mudou: o ganho de oxigenação ficou no músculo rápido.',
        source: 'Ferguson SK et al. Nitric Oxide 2015;48:38-43.',
        color: COL.o2,
    },
    braquial: {
        name: 'Tríceps braquial (rápido)',
        info: 'Cerca de 60–70% de fibras tipo II. Com nitrato, a relação torque-frequência desviou para a esquerda: mais torque nas frequências baixas.',
        source: 'Zoughaib WS et al. Med Sci Sports Exerc 2026;58(5):1012-1020.',
        color: COL.nitrate,
    },
    sural: {
        name: 'Tríceps sural (lento)',
        info: 'Cerca de 60–70% de fibras tipo I. Com nitrato, a curva desviou para a direita: menos torque nas frequências baixas. Mesma dose, efeito oposto.',
        source: 'Zoughaib WS et al. Med Sci Sports Exerc 2026;58(5):1012-1020.',
        color: COL.nitrate,
    },
};
