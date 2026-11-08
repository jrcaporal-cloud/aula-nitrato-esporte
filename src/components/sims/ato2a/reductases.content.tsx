import type { ReactNode } from 'react';
import { C } from '../kit/palette';
import { Hl } from './ui';

export type Focus = 'hb' | 'mb' | 'xor' | 'all';

export interface ReductaseStep {
    tab: string;
    headline: string;
    text: ReactNode;
    source: string;
    sat: number;
    ph: number;
    focus: Focus;
}

export const REDUCTASE_STEPS: readonly ReductaseStep[] = [
    {
        tab: 'Hemoglobina', sat: 50, ph: 7.4, focus: 'hb',
        headline: 'O eritrócito é um sensor de hipóxia',
        text: <>A <Hl c={C.o2}>desoxi-hemoglobina</Hl> reduz o nitrito com taxa máxima quando está 40–60% saturada, perto da P₅₀: um <i>set point</i> para gerar <Hl c={C.no}>NO</Hl> onde falta O₂. Em repouso e na anoxia total, rende menos.</>,
        source: 'Huang 2005 (J Clin Invest) · Cosby 2003 (Nat Med)',
    },
    {
        tab: 'Mioglobina', sat: 24, ph: 7.4, focus: 'mb',
        headline: 'Na fibra, a redutase é 36× mais rápida',
        text: <>A <Hl c={C.hypoxia}>desoxi-mioglobina</Hl> reduz o nitrito ~36× mais rápido que a Hb (12,4 M⁻¹·s⁻¹). O NO que ela libera inibe a respiração mitocondrial, com CI₅₀ de ~100 nmol/L.</>,
        source: 'Shiva 2007 (Circ Res) · mitocôndrias isoladas de rato',
    },
    {
        tab: 'XOR', sat: 10, ph: 7.4, focus: 'xor',
        headline: 'A XOR só liga com pouco O₂',
        text: <>A xantina oxidorredutase reduz nitrato e nitrito a <Hl c={C.no}>NO</Hl> em hipóxia, com NADH; em normóxia o NO não é detectável. É um interruptor local de emergência — e o músculo humano expressa a enzima.</>,
        source: 'Millar 1998 (FEBS Lett) · Wylie 2019 (J Physiol)',
    },
    {
        tab: 'Acidez', sat: 35, ph: 6.6, focus: 'all',
        headline: 'A acidez dá mais força ao nitrito',
        text: <>Com 0,8 unidade a menos de pH, a <Hl c={C.hypoxia}>EC₅₀ do nitrito cai de 200 para 40 µM</Hl>: ~5× mais potente. Hipóxia e acidose chegam juntas no músculo que trabalha.</>,
        source: 'Modin 2001 (Acta Physiol Scand) · aorta de rato, pH do banho',
    },
    {
        tab: 'Juntos', sat: 30, ph: 6.8, focus: 'all',
        headline: 'Vários redutores, um mesmo sinal',
        text: <>Onde falta O₂ e sobra H⁺, o nitrito vira <Hl c={C.no}>NO</Hl>. O efeito é sob medida: mais no tecido que trabalha, menos onde há O₂ de sobra. A redução é favorecida por hipóxia e acidose, não exclusiva delas.</>,
        source: 'Kapil 2020 (Pharmacol Rev) · limiares dos gráficos ilustrativos',
    },
];
