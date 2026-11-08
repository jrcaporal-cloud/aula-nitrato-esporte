import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { C, PANEL_BG } from '../kit/palette';
import { Chip, Source, StepTabs } from '../kit/ui';
import { SIM_H } from './shared';

/** Peças comuns aos simuladores do Ato VI. Texto HTML ≥15 px de projeto (rótulos mono 14 px). */

interface ShellProps {
    tabs: readonly string[];
    step: number;
    setStep: (i: number) => void;
    layoutId: string;
    chips?: ReactNode;
    children: ReactNode;
}

/** Moldura: abas do passador em cima, selos à direita, corpo embaixo (altura fixa). */
export const Shell = ({ tabs, step, setStep, layoutId, chips, children }: ShellProps) => (
    <div className="not-prose flex w-full select-none flex-col gap-3 font-body text-white" style={{ height: SIM_H }}>
        <div className="flex items-center justify-between gap-3">
            <StepTabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
            {chips && <div className="flex items-center gap-2">{chips}</div>}
        </div>
        <div className="flex min-h-0 flex-1 gap-3">{children}</div>
    </div>
);

/** Bloco que troca com fade a cada passo (sem AnimatePresence mode="wait"). */
export const FadeSwap = ({ id, children, className = '' }: { id: string | number; children: ReactNode; className?: string }) => {
    const reduce = useReducedMotion();
    return (
        <motion.div key={id} className={className}
            initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {children}
        </motion.div>
    );
};

/** Cartão escuro com borda colorida opcional. */
export const Card = ({ children, color, className = '', style }: { children: ReactNode; color?: string; className?: string; style?: CSSProperties }) => (
    <div className={`overflow-hidden rounded-2xl border ${className}`}
        style={{ ...PANEL_BG, borderColor: color ? `${color}88` : 'rgba(255,255,255,0.1)', ...style }}>
        {children}
    </div>
);

/** Rubrica em mono maiúsculo. */
export const Kicker = ({ children, color = C.muted }: { children: ReactNode; color?: string }) => (
    <p className="m-0 font-mono text-[14px] uppercase tracking-wider" style={{ color }}>{children}</p>
);

export const Fictional = () => <Chip color={C.nitrateSoft}>caso fictício</Chip>;
export const Illustrative = ({ children = 'valores ilustrativos' }: { children?: ReactNode }) => <Chip color={C.nitrite}>{children}</Chip>;
export const Calc = () => <Chip color={C.o2}>cálculo</Chip>;

interface StoryProps {
    id: string | number;
    kicker: string;
    color: string;
    title: string;
    text: string;
    source: string;
    width?: number;
    children?: ReactNode;
}

/** Coluna de narrativa: rubrica, título, texto, extras e fonte no rodapé. */
export const Story = ({ id, kicker, color, title, text, source, width = 340, children }: StoryProps) => (
    <Card className="shrink-0 p-5" style={{ width }}>
        <FadeSwap id={id} className="flex h-full flex-col gap-3">
            <Kicker color={color}>{kicker}</Kicker>
            <h3 className="m-0 font-display text-[26px] font-semibold leading-tight text-white">{title}</h3>
            <p className="m-0 text-[17px] leading-snug text-gray-100">{text}</p>
            {children}
            <div className="mt-auto"><Source>{source}</Source></div>
        </FadeSwap>
    </Card>
);

/** Barra que cresce da esquerda até `pct` (% da largura do trilho). */
export const GrowBar = ({ pct, color, delay = 0, className = '' }: { pct: number; color: string; delay?: number; className?: string }) => {
    const reduce = useReducedMotion();
    return (
        <motion.div className={`h-full rounded-md ${className}`} style={{ background: color }}
            initial={reduce ? false : { width: 0 }} animate={{ width: `${Math.max(pct, 0)}%` }}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }} />
    );
};

interface RangeRowProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
    color: string;
    right: ReactNode;
}

/** Linha com slider: tira o foco ao soltar, para as setas continuarem sendo do passador. */
export const RangeRow = ({ label, value, min, max, step, onChange, color, right }: RangeRowProps) => (
    <div className="flex items-center gap-4">
        <span className="w-[118px] shrink-0 text-[17px] font-semibold text-gray-100">{label}</span>
        <input type="range" aria-label={label} min={min} max={max} step={step} value={value}
            onChange={e => onChange(Number(e.target.value))}
            onPointerUp={e => e.currentTarget.blur()}
            className="h-2 min-w-0 flex-1 cursor-pointer" style={{ accentColor: color }} />
        <span className="w-[210px] shrink-0 text-right">{right}</span>
    </div>
);
