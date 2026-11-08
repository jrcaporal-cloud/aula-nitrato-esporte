import type { ReactNode } from 'react';
import type { FigureKind } from './events';
import { NobelChainFigure } from './NobelChainFigure';
import { PairBars, type BarGroup } from './PairBars';
import { StomachFigure } from './StomachFigure';
import { TongueFigure } from './TongueFigure';

/** 2007: VO₂ submáximo e eficiência bruta, NaNO₃ × NaCl (Larsen 2007). Barras a partir do zero. */
const OXYGEN: readonly BarGroup[] = [
    { title: 'VO₂ submáximo (L/min)', max: 3.2, delta: '−5,4%',
        control: { label: 'controle', value: 2.98, shown: '2,98' }, nitrate: { label: 'nitrato', value: 2.82, shown: '2,82' } },
    { title: 'eficiência bruta (%)', max: 25,
        control: { label: 'controle', value: 19.7, shown: '19,7' }, nitrate: { label: 'nitrato', value: 21.1, shown: '21,1' } },
];

/** 2009: tempo até a exaustão e nitrito do plasma, suco de beterraba × groselha-preta (Bailey 2009). */
const EXETER: readonly BarGroup[] = [
    { title: 'tempo até a exaustão (s)', max: 720, delta: '+16%',
        control: { label: 'groselha', value: 583, shown: '583' }, nitrate: { label: 'beterraba', value: 675, shown: '675' } },
    { title: 'nitrito no plasma (nM)', max: 300,
        control: { label: 'groselha', value: 140, shown: '140' }, nitrate: { label: 'beterraba', value: 273, shown: '273' } },
];

const FIGURES: Readonly<Record<FigureKind, () => ReactNode>> = {
    stomach: () => <StomachFigure />,
    tongue: () => <TongueFigure />,
    nobel: () => <NobelChainFigure />,
    oxygen: () => <PairBars groups={OXYGEN} footnote="sem mudança em frequência cardíaca, lactato nem ventilação" />,
    exeter: () => <PairBars groups={EXETER} footnote="n 8 homens · placebo: groselha-preta, sem nitrato" />,
};

export const renderFigure = (kind: FigureKind): ReactNode => FIGURES[kind]();
