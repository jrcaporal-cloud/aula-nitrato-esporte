import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { C, PANEL_BG } from '../kit/palette';
import { Panel } from '../kit/ui';

/**
 * Peças comuns do Ato V (O Contra-Interrogatório): moldura, abas, selos, narração por passo,
 * seletor segmentado e número grande. Texto sempre ≥ 14 px de projeto.
 */

/** Altura total de cada simulador do ato (o teto do palco é 516 px). */
export const SIM_H = 500;
/** Caixa do desenho (esquerda) e da narração (direita) dentro do simulador. */
export const VIS_W = 672;
export const VIS_H = 440;

/** Cor-tema do ato: o tribunal usa o magenta do nitrato; acertos em verde, falhas em vermelho. */
export const ACCENT = C.nitrate;
export const ACCENT_SOFT = C.nitrateSoft;

interface TabsProps {
    labels: readonly string[];
    step: number;
    onSelect: (index: number) => void;
    layoutId: string;
}

const Tabs = ({ labels, step, onSelect, layoutId }: TabsProps) => (
    <div className="flex items-center gap-1 rounded-2xl border border-white/10 p-1 self-start" style={PANEL_BG} role="tablist" aria-label="Passos">
        {labels.map((label, i) => {
            const active = i === step;
            return (
                <button key={label} type="button" role="tab" aria-selected={active} onClick={() => onSelect(i)}
                    className="relative px-3 py-1.5 rounded-xl text-[16px] font-semibold cursor-pointer transition-colors"
                    style={{ color: active ? '#fff' : '#D1D5DB' }}>
                    {active && (
                        <motion.span layoutId={layoutId} className="absolute inset-0 rounded-xl bg-brand-deep/45 border border-brand-accent/70"
                            transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                    )}
                    <span className="relative flex items-center gap-1.5">
                        <span className="font-mono text-[15px] text-emerald-300">{i + 1}</span>
                        {label}
                    </span>
                </button>
            );
        })}
    </div>
);

/** Selo (ex.: "valores ilustrativos", "caso fictício", "cálculo"). */
export const Tag = ({ children, color = C.nitrite }: { children: ReactNode; color?: string }) => (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-md border px-2.5 py-1 font-mono text-[15px]"
        style={{ ...PANEL_BG, borderColor: `${color}80`, color }}>
        {children}
    </span>
);

/** Linha de fonte, discreta mas legível. */
export const Src = ({ children }: { children: ReactNode }) => (
    <p className="text-[15px] leading-snug text-gray-300">{children}</p>
);

interface FrameProps {
    tabs: readonly string[];
    step: number;
    setStep: (i: number) => void;
    layoutId: string;
    chips?: ReactNode;
    children: ReactNode;
}

/** Abas do passador à esquerda, selos à direita, conteúdo embaixo. */
export const SimFrame = ({ tabs, step, setStep, layoutId, chips, children }: FrameProps) => (
    <div className="not-prose w-full font-body text-white select-none flex flex-col gap-2" style={{ height: SIM_H }}>
        <div className="flex items-center justify-between gap-3">
            <Tabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
            <div className="flex items-center gap-2">{chips}</div>
        </div>
        <div className="flex-1 min-h-0">{children}</div>
    </div>
);

interface NarrationProps {
    stepKey: number;
    headline: string;
    text: string;
    color?: string;
}

/** Texto do passo: manchete + duas ou três frases, com fade a cada troca. */
export const Narration = ({ stepKey, headline, text, color = ACCENT_SOFT }: NarrationProps) => (
    <motion.div key={stepKey} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="flex flex-col gap-1.5">
        <p className="font-display text-[1.45rem] font-semibold leading-tight" style={{ color }}>{headline}</p>
        <p className="text-[18px] leading-snug text-gray-100">{text}</p>
    </motion.div>
);

interface SegmentedProps<T extends string | number> {
    label: string;
    options: readonly { value: T; label: string }[];
    value: T;
    onChange: (v: T) => void;
    color?: string;
}

/** Seletor de poucas opções. O passador já escolhe um valor; o clique é extra. */
export const Segmented = <T extends string | number>({ label, options, value, onChange, color = ACCENT }: SegmentedProps<T>) => (
    <div className="flex items-center gap-2">
        {label && <span className="text-[15px] text-gray-300 shrink-0">{label}</span>}
        <div className="flex gap-1 rounded-xl border border-white/10 p-0.5" style={PANEL_BG}>
            {options.map(o => {
                const on = o.value === value;
                return (
                    <button key={String(o.value)} type="button" onClick={() => onChange(o.value)}
                        className="px-2 py-1 rounded-lg font-mono text-[15px] whitespace-nowrap cursor-pointer transition-colors"
                        style={{ color: on ? '#07050B' : '#E5E7EB', background: on ? color : 'transparent', fontWeight: on ? 700 : 500 }}>
                        {o.label}
                    </button>
                );
            })}
        </div>
    </div>
);

interface BigStatProps {
    value: string;
    label: string;
    color?: string;
    size?: number;
}

/** Número de destaque com legenda curta. */
export const BigStat = ({ value, label, color = C.text, size = 36 }: BigStatProps) => (
    <div className="flex flex-col min-w-0">
        <span className="font-display font-semibold leading-none tabular-nums" style={{ color, fontSize: size }}>{value}</span>
        <span className="mt-1 text-[15px] leading-snug text-gray-300">{label}</span>
    </div>
);

interface StoryLayoutProps {
    step: number;
    /** Chave do desenho: passos que só acrescentam camadas mantêm a mesma e não piscam. */
    visualKey?: number | string;
    headline: string;
    text: string;
    source: string;
    tone?: string;
    headlineColor?: string;
    /** Peças extras na coluna de texto, entre a narração e a fonte. */
    aside?: ReactNode;
    /** Controles fixos acima da fonte. */
    controls?: ReactNode;
    /** Frase de fecho do passo, num quadro de destaque. */
    takeaway?: string;
    children: ReactNode;
}

/** Desenho do passo à esquerda (caixa fixa), narração e fonte à direita. */
export const StoryLayout = ({ step, visualKey, headline, text, source, tone = ACCENT, headlineColor = ACCENT_SOFT, aside, controls, takeaway, children }: StoryLayoutProps) => (
    <div className="h-full flex gap-3">
        <Panel className="shrink-0" state="active" glow={tone}>
            <motion.div key={visualKey ?? step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                style={{ width: VIS_W, height: VIS_H }}>
                {children}
            </motion.div>
        </Panel>
        <Panel className="flex-1 min-w-0 p-4 flex flex-col gap-3">
            <Narration stepKey={step} headline={headline} text={text} color={headlineColor} />
            {aside}
            <div className="mt-auto flex flex-col gap-2">
                {takeaway && (
                    <motion.div key={`tk${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.25 }}
                        className="rounded-xl border px-3 py-2 text-[16px] leading-snug text-gray-50"
                        style={{ borderColor: `${tone}80`, background: `${tone}18` }}>
                        <span className="font-mono text-[14px] uppercase tracking-wide mr-1.5" style={{ color: tone }}>para levar</span>
                        {takeaway}
                    </motion.div>
                )}
                {controls}
                <Src>{source}</Src>
            </div>
        </Panel>
    </div>
);
