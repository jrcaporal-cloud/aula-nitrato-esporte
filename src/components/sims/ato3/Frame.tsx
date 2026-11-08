import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { C, PANEL_BG } from '../kit/palette';
import { KeyFact, Reveal } from '../kit/rhythm';
import { CountText } from './beat';

/** Altura total da caixa dos simuladores do Ato III (≤ 516 px de projeto). */
export const SIM_H = 500;

interface FrameProps {
    tabs: readonly string[];
    step: number;
    setStep: (step: number) => void;
    layoutId: string;
    /** Selos à direita das abas (ex.: "valores ilustrativos", "caso fictício"). */
    chips?: ReactNode;
    /** Frase do passo, no rodapé (troca com fade a cada passo). */
    foot: ReactNode;
    children: ReactNode;
}

/** Abas do passador: mostram onde a história está; o clique é só atalho. */
const Tabs = ({ labels, step, onSelect, layoutId }: { labels: readonly string[]; step: number; onSelect: (i: number) => void; layoutId: string }) => (
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

/** Selo pequeno (ex.: "valores ilustrativos", "caso fictício"). */
export const Tag = ({ children, color = C.nitrite }: { children: ReactNode; color?: string }) => (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-md border px-2.5 py-1 font-mono text-[15px]"
        style={{ ...PANEL_BG, borderColor: `${color}80`, color }}>
        {children}
    </span>
);

/** Moldura comum do Ato III: abas do passador, painel principal e a frase do passo no rodapé. */
export const Frame = ({ tabs, step, setStep, layoutId, chips, foot, children }: FrameProps) => (
    <div className="not-prose w-full font-body text-white select-none flex flex-col gap-2" style={{ height: SIM_H }}>
        <div className="flex items-center justify-between gap-3" style={{ height: 46 }}>
            <Tabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
            {chips && <div className="flex items-center gap-2">{chips}</div>}
        </div>
        <div className="flex-1 min-h-0 rounded-2xl border border-white/10 px-5 pt-3 pb-3 flex flex-col gap-2" style={PANEL_BG}>
            <div className="flex-1 min-h-0">{children}</div>
            <div className="pt-2 border-t border-white/10" style={{ minHeight: 52 }}>
                <Reveal key={step} order={2}>
                    <p className="text-[1.08rem] leading-snug text-white font-medium">{foot}</p>
                </Reveal>
            </div>
        </div>
    </div>
);

/** Cartão de leitura: etiqueta mono colorida, título e linhas curtas. */
export const Card = ({ tag, title, lines, color, children, className = '' }: {
    tag: string; title?: string; lines?: readonly string[]; color: string; children?: ReactNode; className?: string;
}) => (
    <div className={`rounded-xl border bg-white/[0.03] p-4 flex flex-col gap-2 ${className}`} style={{ borderColor: `${color}55` }}>
        <span className="font-mono text-[15px] tracking-wide" style={{ color }}>{tag}</span>
        {title && <p className="font-display text-[1.3rem] font-semibold leading-tight text-white">{title}</p>}
        {lines && (
            <ul className="flex flex-col gap-1">
                {lines.map(l => <li key={l} className="text-[16px] leading-snug text-gray-200">{l}</li>)}
            </ul>
        )}
        {children}
    </div>
);

interface BigProps {
    value: string;
    label: string;
    color?: string;
    size?: string;
    /** O número sobe como contador (termina no texto de `value`). Não use em valor que muda com controle deslizante. */
    count?: boolean;
    /** Valor de partida do contador. */
    from?: number;
    /** Destaque curto do dado-chave do passo (no máximo 1 por passo). */
    hit?: boolean;
}

/** Número grande com rótulo curto. */
export const Big = ({ value, label, color = '#fff', size = '2.6rem', count = false, from, hit = false }: BigProps) => {
    const num = count ? <CountText text={value} from={from} /> : value;
    return (
        <div className="flex flex-col">
            <span className="font-display font-semibold leading-none tabular-nums" style={{ color, fontSize: size }}>
                {hit ? <KeyFact color={color}>{num}</KeyFact> : num}
            </span>
            <span className="mt-1 text-[16px] leading-tight text-gray-300">{label}</span>
        </div>
    );
};

/** Entrada suave de um bloco quando o passo muda (sem exit: a troca não prende texto velho). */
export const Swap = ({ k, children, className = '' }: { k: string | number; children: ReactNode; className?: string }) => (
    <motion.div key={k} className={className} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
        {children}
    </motion.div>
);
