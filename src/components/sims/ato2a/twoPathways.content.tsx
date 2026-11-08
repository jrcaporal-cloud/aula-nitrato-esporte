import type { ReactNode } from 'react';
import { C } from '../kit/palette';
import { Hl, KeyNum } from './ui';

export interface PathwayStep {
    tab: string;
    headline: string;
    text: ReactNode;
    source: string;
    /** Posição dos controles neste passo. */
    sat: number;
    ph: number;
    focus: 'classic' | 'alt' | 'both';
}

export const PATHWAY_STEPS: readonly PathwayStep[] = [
    {
        tab: 'Clássica', sat: 98, ph: 7.4, focus: 'classic',
        headline: 'A via que todo mundo conhece',
        text: <>A NO-sintase pega <Hl c={C.placebo}>L-arginina</Hl> e <Hl c={C.o2}>O₂</Hl> e entrega <Hl c={C.no}>NO</Hl>. É a via do endotélio em repouso — e o O₂ é o substrato: sem ele, a enzima para.</>,
        source: 'Lundberg 2008 (Nat Rev Drug Discov) · Kapil 2020 (Pharmacol Rev)',
    },
    {
        tab: 'Alternativa', sat: 98, ph: 7.4, focus: 'alt',
        headline: 'A via que o prato abastece',
        text: <>O <Hl c={C.nitrate}>nitrato</Hl> da dieta vira <Hl c={C.nitrite}>nitrito</Hl> pela boca e circula como estoque. Quem converte o nitrito em <Hl c={C.no}>NO</Hl> são redutases dos tecidos — com rendimento maior onde falta O₂ e sobra ácido.</>,
        source: 'Lundberg 2008 · Kapil 2020: favorecida, não exclusiva',
    },
    {
        tab: 'Falta O₂', sat: 50, ph: 7.4, focus: 'both',
        headline: 'O O₂ cai: uma apaga, a outra acende',
        text: <>Na saturação do músculo em esforço, a <Hl c={C.o2}>NOS</Hl> perde o substrato. A hemoglobina desoxigenada reduz o nitrito com <Hl c={C.nitrite}>taxa máxima entre <KeyNum c={C.nitrite}>40 e 60%</KeyNum></Hl> de saturação.</>,
        source: 'Huang 2005 (J Clin Invest) · forma das curvas ilustrativa',
    },
    {
        tab: 'Acidose', sat: 50, ph: 6.6, focus: 'both',
        headline: 'A acidez potencializa o nitrito',
        text: <>Em pH 6,6 o nitrito relaxa a aorta de rato com <Hl c={C.hypoxia}>EC₅₀ de <KeyNum c={C.hypoxia}>40 µM</KeyNum></Hl>, contra 200 µM em pH 7,4: cerca de 5 vezes mais potente. O músculo que trabalha também acidifica.</>,
        source: 'Modin 2001 (Acta Physiol Scand) · aorta de rato isolada',
    },
    {
        tab: 'Juntas', sat: 35, ph: 6.8, focus: 'both',
        headline: 'Complementares por desenho',
        text: <>Onde a NOS perde fôlego, a redução do nitrito assume. Não é redundância: as duas vias cobrem faixas <Hl c={C.hypoxia}>diferentes de O₂</Hl> — a mais útil justamente no músculo que mais precisa de NO.</>,
        source: 'Lundberg 2008 · Kapil 2020 · curvas ilustrativas',
    },
];
