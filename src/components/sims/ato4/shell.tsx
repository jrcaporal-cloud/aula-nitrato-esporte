import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { C, PANEL_BG } from '../kit/palette';
import { Panel } from '../kit/ui';

/**
 * Peças comuns do Ato IV: moldura, abas, selos, narração por passo, controle deslizante e número grande.
 * O palco encolhe para ~0,9 num projetor 1280×720, então nada aqui fica abaixo de 15 px de projeto.
 */

/** Altura total de cada simulador do ato (o teto do palco é 516 px). */
export const SIM_H = 500;
/** Altura útil abaixo da linha de abas (500 − 44 − 8). */
export const BODY_H = 448;

interface TabsProps {
    labels: readonly string[];
    step: number;
    onSelect: (index: number) => void;
    layoutId: string;
}

/** Abas numeradas: mostram onde o passador está; o clique é atalho opcional. */
const Tabs = ({ labels, step, onSelect, layoutId }: TabsProps) => (
    <div className="flex items-center gap-1 rounded-2xl border border-white/10 p-1 self-start" style={PANEL_BG} role="tablist" aria-label="Passos">
        {labels.map((label, i) => {
            const active = i === step;
            return (
                <button key={label} type="button" role="tab" aria-selected={active} onClick={() => onSelect(i)}
                    className="relative px-3 py-1.5 rounded-xl text-[16px] font-semibold cursor-pointer transition-colors whitespace-nowrap"
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

/** Selo (ex.: "caso fictício", "valores ilustrativos"). */
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

/** Abas do passador à esquerda, selos à direita, conteúdo embaixo (448 px). */
export const SimFrame = ({ tabs, step, setStep, layoutId, chips, children }: FrameProps) => (
    <div className="not-prose w-full font-body text-white select-none flex flex-col gap-2" style={{ height: SIM_H }}>
        <div className="flex items-center justify-between gap-3">
            <Tabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
            <div className="flex items-center gap-2">{chips}</div>
        </div>
        <div className="flex-1 min-h-0" style={{ height: BODY_H }}>{children}</div>
    </div>
);

interface NarrationProps {
    stepKey: number;
    kicker?: string;
    headline: string;
    text: string;
    color?: string;
}

/** Texto do passo: etiqueta + manchete + duas ou três frases, com fade a cada troca. */
export const Narration = ({ stepKey, kicker, headline, text, color = C.nitrateSoft }: NarrationProps) => (
    <motion.div key={stepKey} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="flex flex-col gap-1.5">
        {kicker && <span className="font-mono text-[15px] tracking-wide" style={{ color: C.muted }}>{kicker}</span>}
        <p className="font-display text-[1.45rem] font-semibold leading-tight" style={{ color }}>{headline}</p>
        <p className="text-[17px] leading-snug text-gray-100">{text}</p>
    </motion.div>
);

interface BigStatProps {
    value: string;
    label: string;
    color?: string;
    size?: number;
}

/** Número de destaque com legenda curta. */
export const BigStat = ({ value, label, color = C.text, size = 38 }: BigStatProps) => (
    <div className="flex flex-col">
        <span className="font-display font-semibold leading-none tabular-nums" style={{ color, fontSize: size }}>{value}</span>
        <span className="mt-1 text-[15px] leading-snug text-gray-300">{label}</span>
    </div>
);

export interface SliderTick {
    value: number;
    label: string;
}

interface SliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
    color: string;
    /** Marcas com rótulo sob a trilha. */
    ticks?: readonly SliderTick[];
    /** Texto do valor atual, à direita do rótulo. */
    readout?: string;
}

const THUMB = 22;

/** Controle deslizante nativo (arrasta, teclado e toque de graça) com marcas rotuladas. */
export const Slider = ({ label, value, min, max, step, onChange, color, ticks, readout }: SliderProps) => (
    <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
            <span className="text-[16px] font-semibold text-gray-100">{label}</span>
            {readout && <span className="font-mono text-[16px] font-bold" style={{ color }}>{readout}</span>}
        </div>
        <input type="range" min={min} max={max} step={step} value={value} aria-label={label}
            onChange={e => onChange(Number(e.target.value))}
            className="w-full h-2 appearance-none rounded-full bg-white/15 outline-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-[22px] [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[var(--sl)]
                [&::-webkit-slider-thumb]:shadow-[0_0_14px_var(--sl)]
                [&::-moz-range-thumb]:size-[22px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2
                [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-[var(--sl)]"
            style={{ ['--sl' as string]: color }} />
        {ticks && (
            <div className="relative h-5">
                {ticks.map(t => {
                    const f = (t.value - min) / (max - min);
                    const shift = f <= 0 ? '0%' : f >= 1 ? '-100%' : '-50%';
                    return (
                        <span key={t.label} className="absolute top-0 whitespace-nowrap font-mono text-[15px] text-gray-300"
                            style={{ left: `calc(${f * 100}% + ${(0.5 - f) * THUMB}px)`, transform: `translateX(${shift})` }}>
                            {t.label}
                        </span>
                    );
                })}
            </div>
        )}
    </div>
);

interface FactListProps {
    rows: readonly (readonly [string, string])[];
    color?: string;
    /** Linhas mais baixas, para painéis com pouca altura. */
    dense?: boolean;
}

/** Linhas "rótulo · valor" para os números que o passo cita (mono, 15–16 px). */
export const FactList = ({ rows, color = C.nitrateSoft, dense = false }: FactListProps) => (
    <div className={`flex flex-col rounded-xl border border-white/10 bg-white/[0.03] px-3 ${dense ? 'py-0.5' : 'py-1.5'}`}>
        {rows.map(([k, v]) => (
            <div key={k} className={`flex items-baseline justify-between gap-3 border-b border-white/5 last:border-b-0 ${dense ? 'py-0.5' : 'py-1'}`}>
                <span className="text-[15px] text-gray-300">{k}</span>
                <span className="font-mono text-[16px] font-bold tabular-nums text-right" style={{ color }}>{v}</span>
            </div>
        ))}
    </div>
);

interface StoryPanelProps extends NarrationProps {
    facts?: readonly (readonly [string, string])[];
    /** Frase-síntese do passo, em destaque acima da fonte. */
    takeaway?: string;
    source?: string;
    children?: ReactNode;
}

/** Painel à direita: narração do passo, números citados, a síntese e a fonte no rodapé. */
export const StoryPanel = ({ facts, takeaway, source, children, ...narration }: StoryPanelProps) => {
    const color = narration.color ?? C.nitrateSoft;
    return (
        <Panel className="p-4 flex flex-col gap-3 min-h-0">
            <Narration {...narration} />
            {facts && <FactList rows={facts} color={narration.color} />}
            {children}
            <div className="mt-auto flex flex-col gap-2">
                {takeaway && (
                    <motion.p key={`${narration.stepKey}-t`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.25 }}
                        className="rounded-lg border-l-4 bg-white/[0.04] px-3 py-2 text-[16px] font-medium leading-snug text-white"
                        style={{ borderColor: color }}>
                        {takeaway}
                    </motion.p>
                )}
                {source && <div className="border-t border-white/10 pt-2"><Src>{source}</Src></div>}
            </div>
        </Panel>
    );
};
