import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { C } from '../kit/palette';
import { Chip, Panel, StepTabs } from '../kit/ui';

/**
 * Peças comuns do Ato II (segunda metade): moldura com abas, painel do gráfico, painel de texto do passo.
 * Caixa total 1136×500: abas (44) + gap (8) + corpo (448). O gráfico mede 734×446 de projeto.
 */

export const SIM_H = 500;
/** Área útil do SVG do gráfico (largura × altura, em px de projeto). */
export const GW = 734;
export const GH = 446;

interface FrameProps {
    tabs: readonly string[];
    step: number;
    setStep: (i: number) => void;
    layoutId: string;
    chips?: ReactNode;
    children: ReactNode;
}

/** Abas do passador à esquerda, selos à direita, corpo (gráfico + texto) embaixo. */
export const SimFrame = ({ tabs, step, setStep, layoutId, chips, children }: FrameProps) => (
    <div className="not-prose w-full font-body text-white select-none flex flex-col gap-2" style={{ height: SIM_H }}>
        <div className="flex items-center justify-between gap-3">
            <StepTabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
            <div className="flex items-center gap-2">{chips}</div>
        </div>
        <div className="flex-1 min-h-0 flex gap-3">{children}</div>
    </div>
);

/** Selo "valores ilustrativos" e variações. */
export const IllustrativeChip = ({ text = 'forma ilustrativa · valores são dados' }: { text?: string }) => (
    <Chip color={C.nitrite}>{text}</Chip>
);

interface GraphicProps {
    children: ReactNode;
    /** Mostra a dica "3 = modelo 3D" no canto (slides com modelo). */
    hint3d?: boolean;
    glow?: string;
}

/** Painel do gráfico; o SVG dentro usa viewBox `0 0 GW GH`. */
export const GraphicPanel = ({ children, hint3d = false, glow }: GraphicProps) => (
    <Panel className="flex-1 min-w-0 relative" state={glow ? 'active' : 'idle'} glow={glow}>
        {children}
        {hint3d && (
            <span className="absolute bottom-2 right-3 font-mono text-[14px] text-gray-400 flex items-center gap-1.5">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-gray-500 text-[14px] text-gray-200">3</span>
                = modelo 3D
            </span>
        )}
    </Panel>
);

interface SideProps {
    stepKey: number;
    headline: string;
    text: string;
    color?: string;
    source: string;
    children?: ReactNode;
    /** Ficha do estudo (n, dose, desenho): selos pequenos acima da fonte. */
    facts?: readonly string[];
}

/** Painel de texto do passo: manchete, parágrafo curto, destaques e linha de fonte. */
export const SidePanel = ({ stepKey, headline, text, color = C.noSoft, source, children, facts }: SideProps) => (
    <Panel className="w-[390px] shrink-0 p-4 flex flex-col gap-3">
        <motion.div key={stepKey} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="flex flex-col gap-2">
            <p className="font-display text-[1.3rem] font-semibold leading-tight" style={{ color }}>{headline}</p>
            <p className="text-[16px] leading-snug text-gray-100">{text}</p>
        </motion.div>
        {children && (
            <motion.div key={`s${stepKey}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-col gap-2.5">
                {children}
            </motion.div>
        )}
        <div className="mt-auto flex flex-col gap-2">
            {facts && facts.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {facts.map(f => <Chip key={f} color={C.placebo}>{f}</Chip>)}
                </div>
            )}
            <p className="text-[14px] leading-snug text-gray-400">{source}</p>
        </div>
    </Panel>
);

interface BigStatProps {
    value: string;
    label: string;
    color?: string;
    size?: number;
}

/** Número de destaque com legenda curta. */
export const BigStat = ({ value, label, color = C.text, size = 34 }: BigStatProps) => (
    <div className="flex items-baseline gap-3">
        <span className="font-display font-semibold leading-none tabular-nums shrink-0" style={{ color, fontSize: size }}>{value}</span>
        <span className="text-[15px] leading-snug text-gray-300">{label}</span>
    </div>
);

interface SegmentedProps<T extends string | number> {
    label: string;
    options: readonly { value: T; label: string }[];
    value: T;
    onChange: (v: T) => void;
    color?: string;
}

/** Seletor de poucas opções; o passador ajusta sozinho, o clique é extra. */
export const Segmented = <T extends string | number>({ label, options, value, onChange, color = C.no }: SegmentedProps<T>) => (
    <div className="flex items-center gap-2">
        <span className="text-[15px] text-gray-300 shrink-0">{label}</span>
        <div className="flex gap-1 rounded-xl border border-white/10 p-0.5" style={{ background: 'rgba(10,6,14,0.74)' }}>
            {options.map(o => {
                const on = o.value === value;
                return (
                    <button key={String(o.value)} type="button" onClick={() => onChange(o.value)}
                        className="px-2.5 py-1 rounded-lg font-mono text-[15px] cursor-pointer transition-colors"
                        style={{ color: on ? '#04080F' : '#E5E7EB', background: on ? color : 'transparent', fontWeight: on ? 700 : 500 }}>
                        {o.label}
                    </button>
                );
            })}
        </div>
    </div>
);
