import { C } from '../../sims/kit/palette';

/*
 * Textos do modelo "vaso-hipoxia" (slides 20 e 24). Todo número vem do dossiê 01:
 * HUANG2005 (40–60%), MODIN2001 (EC₅₀ 200 → 40 µM), SHIVA2007 (~36×), MILLAR1998 (XOR em hipóxia),
 * FERGUSON2015 (PO₂ microvascular +43%). As curvas do gráfico e as taxas da cena são ILUSTRATIVAS.
 */

export type StructureId =
    | 'capilar' | 'hemacia' | 'nos' | 'arteriola'
    | 'fibra' | 'mioglobina' | 'mitocondria' | 'xor' | 'fibra-lenta';

/** Saturação de O₂ da hemoglobina (0–1) e pH que a etapa aplica ao entrar. */
export interface Preset { sat: number; ph: number }

export interface StepContent {
    badge: string;
    title: string;
    short: string;
    text: string;
    stat: { value: string; label: string; color: string };
    sources: readonly string[];
    preset: Preset;
}

export const SEAL = 'representação esquemática · escalas fora de proporção';

const LUNDBERG = 'Lundberg et al., Nat Rev Drug Discov 2008';
const HUANG = 'Huang et al., J Clin Invest 2005';
const COSBY = 'Cosby et al., Nat Med 2003';
const MODIN = 'Modin et al., Acta Physiol Scand 2001';
const SHIVA = 'Shiva et al., Circ Res 2007';
const MILLAR = 'Millar et al., FEBS Lett 1998';
const FERGUSON15 = 'Ferguson et al., Nitric Oxide 2015';
const JONES16 = 'Jones et al., Exerc Sport Sci Rev 2016';
const CASTELLO = 'Castello et al., Cell Metab 2006';

export const STEPS: readonly StepContent[] = [
    {
        badge: 'REPOUSO',
        title: 'Repouso: a via clássica',
        short: 'Repouso',
        text: 'Com a hemoglobina bem saturada, a NOS do endotélio tem O₂ de sobra e produz NO a partir da L-arginina. O nitrito (esferas âmbar) circula quase inerte: a redução é favorecida por hipóxia e acidez, e aqui não há nenhuma das duas.',
        stat: { value: 'NOS ligada', label: 'via clássica, com O₂ de sobra', color: C.no },
        sources: [LUNDBERG, 'Kapil et al., Pharmacol Rev 2020'],
        preset: { sat: 1, ph: 7.4 },
    },
    {
        badge: 'EXERCÍCIO',
        title: 'O₂ cai e a NOS apaga',
        short: 'O₂ cai',
        text: 'O músculo consome O₂ e a saturação da hemoglobina cai: os eritrócitos escurecem. A NOS usa O₂ como substrato, então o NO da via clássica diminui justamente onde o músculo mais precisa de fluxo. O nitrito continua ali, esperando.',
        stat: { value: 'NOS ↓', label: 'sem substrato, sem NO', color: C.o2 },
        sources: [LUNDBERG],
        preset: { sat: 0.45, ph: 7.4 },
    },
    {
        badge: 'DESOXI-HEMOGLOBINA',
        title: 'A desoxi-hemoglobina acende',
        short: 'Hb redutase',
        text: 'Com a hemoglobina entre 40% e 60% saturada, o desoxi-heme reduz o nitrito a NO na taxa máxima, perto da P₅₀. É um pico, não uma rampa: arraste a saturação e veja os eritrócitos acenderem e apagarem. Não depende da NOS.',
        stat: { value: '40–60%', label: 'saturação de O₂ da taxa máxima', color: C.nitrite },
        sources: [HUANG, COSBY],
        preset: { sat: 0.5, ph: 7.4 },
    },
    {
        badge: 'ACIDOSE',
        title: 'Acidose: o rendimento salta',
        short: 'Acidose',
        text: 'O esforço intenso também acidifica o meio. Do pH 7,4 ao 6,6, o nitrito fica cerca de 5 vezes mais potente como vasodilatador: a EC₅₀ cai de 200 para 40 µM (aorta de rato). O mesmo nitrito rende bem mais NO.',
        stat: { value: '200 → 40 µM', label: 'EC₅₀ do nitrito, pH 7,4 → 6,6', color: C.hypoxia },
        sources: [MODIN],
        preset: { sat: 0.5, ph: 6.6 },
    },
    {
        badge: 'NA FIBRA',
        title: 'Na fibra: mioglobina e XOR',
        short: 'Na fibra',
        text: 'Dentro da fibra, a desoxi-mioglobina faz o mesmo trabalho cerca de 36 vezes mais rápido que a hemoglobina, junto das mitocôndrias. A XOR só entra em hipóxia e se apaga em normóxia: um redutor local, de emergência.',
        stat: { value: '~36×', label: 'desoxi-Mb em relação à desoxi-Hb', color: C.no },
        sources: [SHIVA, MILLAR],
        preset: { sat: 0.38, ph: 6.8 },
    },
    {
        badge: 'FLUXO',
        title: 'O NO abre o caminho',
        short: 'Fluxo',
        text: 'O NO relaxa o músculo liso da arteríola e o fluxo aumenta, de preferência para a fibra rápida: no rato, a PO₂ microvascular sobe 43% no gastrocnêmio e não muda no sóleo. Onde a NOS cai, a redução do nitrito sobe: vias complementares por desenho.',
        stat: { value: '+43%', label: 'PO₂ microvascular, só na fibra rápida (rato)', color: C.no },
        sources: [FERGUSON15, JONES16],
        preset: { sat: 0.45, ph: 6.7 },
    },
];

export interface StructureInfo { name: string; info: string; source: string; color: string }

export const STRUCTURES: Readonly<Record<StructureId, StructureInfo>> = {
    capilar: {
        name: 'Capilar muscular',
        info: 'Onde o sangue entrega O₂ à fibra. A hemoglobina produz NO com eficiência máxima na faixa de 40–60% de saturação, perto da P₅₀, a faixa que o capilar muscular visita no esforço.',
        source: HUANG,
        color: '#E7A3B8',
    },
    hemacia: {
        name: 'Eritrócito',
        info: 'Clara, a oxi-hemoglobina deixa o nitrito quase inerte; escura, a desoxi-hemoglobina o reduz a NO. A taxa é sigmoide, com máximo a 40–60% de saturação. Em humanos, o nitrito dilata o antebraço com ou sem inibição da NOS.',
        source: `${HUANG} · ${COSBY}`,
        color: C.nitrite,
    },
    nos: {
        name: 'NOS endotelial',
        info: 'Faz NO a partir de L-arginina e O₂: é a via clássica. Com a saturação alta ela produz; quando o O₂ falta, falta o substrato e ela apaga.',
        source: LUNDBERG,
        color: C.o2,
    },
    arteriola: {
        name: 'Arteríola',
        info: 'O NO ativa a guanilato ciclase solúvel do músculo liso e o vaso relaxa. Em aorta de rato, o relaxamento pelo nitrito foi maior em pH ácido e bloqueado por inibidor da guanilato ciclase.',
        source: MODIN,
        color: C.no,
    },
    fibra: {
        name: 'Fibra rápida (tipo II)',
        info: 'A PO₂ é menor na fibra tipo II do que na tipo I. No rato, a PO₂ microvascular do gastrocnêmio (91% de fibras rápidas) subiu de 14 para 19 mmHg com nitrato.',
        source: `${JONES16} · ${FERGUSON15}`,
        color: '#C7D2FE',
    },
    mioglobina: {
        name: 'Mioglobina',
        info: 'A desoxi-mioglobina reduz o nitrito cerca de 36 vezes mais rápido que a desoxi-hemoglobina (k = 12,4 M⁻¹·s⁻¹, pH 7,4, 37 °C). O NO formado inibe a respiração de mitocôndrias isoladas.',
        source: SHIVA,
        color: '#E0524A',
    },
    mitocondria: {
        name: 'Mitocôndria',
        info: 'O NO inibe a citocromo c oxidase (CI₅₀ ~100 nmol/L em tensões fisiológicas de O₂). Com O₂ dissolvido abaixo de 20 µmol/L, a própria mitocôndria também gera NO a partir do nitrito.',
        source: `${SHIVA} · ${CASTELLO}`,
        color: '#C9B79C',
    },
    xor: {
        name: 'XOR (xantina oxidorredutase)',
        info: 'Reduz nitrato e nitrito a NO só em hipóxia, com NADH; em normóxia o NO não é detectável. No coração, o controle com alopurinol mostrou que a mioglobina, e não a XOR, explicava o efeito.',
        source: `${MILLAR} · ${SHIVA}`,
        color: C.hypoxia,
    },
    'fibra-lenta': {
        name: 'Fibra lenta (tipo I)',
        info: 'No sóleo do rato (9% de fibras rápidas), a PO₂ microvascular não mudou com o nitrato: o ganho de perfusão não é global, vai para onde está escuro e ácido.',
        source: FERGUSON15,
        color: '#A5B4FC',
    },
};

/** Legenda de cores (a mesma linguagem do resto da aula). */
export const OXY_COLOR = '#F2506E';
export const DEOXY_COLOR = '#4B1030';

export const LEGEND: readonly (readonly [string, string])[] = [
    [C.nitrite, 'Nitrito NO₂⁻'],
    [C.no, 'NO'],
    [C.o2, 'O₂'],
    [C.hypoxia, 'H⁺ (acidez)'],
    [OXY_COLOR, 'Oxi-Hb'],
    [DEOXY_COLOR, 'Desoxi-Hb'],
];
