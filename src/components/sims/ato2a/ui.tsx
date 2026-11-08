import { useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { Chip, Source, StepTabs } from '../kit/ui';
import { clamp, norm } from './hooks';

/** Peças comuns aos simuladores do Ato II (primeira metade). Texto sempre ≥14 px de projeto. */

/** Altura total de cada simulador (o teto do palco é 516 px). */
export const SIM_H = 500;

/** Selo cinza para curvas e formas inventadas para ensinar. */
export const IllustrativeChip = ({ text = 'valores ilustrativos' }: { text?: string }) => (
    <Chip color={C.placebo}>{text}</Chip>
);

/** Dica discreta: o botão do modelo 3D aparece sozinho, a tecla 3 também abre. */
export const Hint3D = () => (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-[14px] text-gray-400">
        <kbd className="rounded border border-white/25 bg-white/5 px-1.5 font-mono text-[14px] text-gray-200">3</kbd>
        modelo 3D
    </span>
);

interface FrameProps {
    tabs: readonly string[];
    step: number;
    setStep: (i: number) => void;
    layoutId: string;
    chips?: ReactNode;
    hint3d?: boolean;
    children: ReactNode;
}

/** Abas do passador à esquerda, selos e dica à direita, corpo embaixo (visual + coluna de texto). */
export const SimFrame = ({ tabs, step, setStep, layoutId, chips, hint3d = false, children }: FrameProps) => (
    <div className="not-prose flex w-full select-none flex-col gap-2 font-body text-white" style={{ height: SIM_H }}>
        <div className="flex items-center justify-between gap-3">
            <StepTabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
            <div className="flex items-center gap-3">{chips}{hint3d && <Hint3D />}</div>
        </div>
        <div className="flex min-h-0 flex-1 gap-3">{children}</div>
    </div>
);

/** Texto do passo: manchete + duas ou três frases, com fade a cada troca (use `key={step}`). */
export const Narration = ({ headline, children }: { headline: string; children: ReactNode }) => (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="flex flex-col gap-1.5">
        <p className="font-display text-[1.3rem] font-semibold leading-tight text-white">{headline}</p>
        <p className="text-[17px] leading-snug text-gray-100">{children}</p>
    </motion.div>
);

/** Palavra em destaque colorido dentro da narração. */
export const Hl = ({ c, children }: { c: string; children: ReactNode }) => (
    <b className="font-semibold" style={{ color: c }}>{children}</b>
);

/** Rodapé de fonte da coluna de texto. */
export const SourceLine = ({ children }: { children: ReactNode }) => (
    <div className="mt-auto border-t border-white/10 pt-2"><Source>{children}</Source></div>
);

interface BigStatProps { value: string; label: string; color?: string; size?: number }

/** Número de destaque com legenda curta. */
export const BigStat = ({ value, label, color = C.text, size = 34 }: BigStatProps) => (
    <div className="flex min-w-0 flex-col">
        <span className="font-display font-semibold leading-none tabular-nums" style={{ color, fontSize: size }}>{value}</span>
        <span className="mt-1 text-[14px] leading-tight text-gray-300">{label}</span>
    </div>
);

interface SliderProps {
    label: string;
    value: number;
    /** Valor na ponta esquerda e na direita (pode ser min > max: eixo invertido). */
    from: number;
    to: number;
    onChange: (v: number) => void;
    display: string;
    color: string;
    /** Faixa destacada no trilho, em unidades do valor. */
    band?: [number, number];
}

/** Controle arrastável por ponteiro (não recebe foco, então não rouba as setas do passador). */
export const Slider = ({ label, value, from, to, onChange, display, color, band }: SliderProps) => {
    const rail = useRef<HTMLDivElement>(null);
    const setFrom = (clientX: number) => {
        const el = rail.current;
        if (!el) return;
        const box = el.getBoundingClientRect();
        const k = clamp((clientX - box.left) / box.width, 0, 1);
        onChange(from + k * (to - from));
    };
    const k = clamp(norm(value, from, to), 0, 1);
    const bandA = band ? clamp(norm(band[0], from, to), 0, 1) : 0;
    const bandB = band ? clamp(norm(band[1], from, to), 0, 1) : 0;
    return (
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-2">
                <span className="text-[15px] text-gray-200">{label}</span>
                <span className="font-mono text-[17px] font-semibold tabular-nums" style={{ color }}>{display}</span>
            </div>
            <div ref={rail} role="slider" aria-label={label} aria-valuenow={Math.round(value * 10) / 10}
                aria-valuemin={Math.min(from, to)} aria-valuemax={Math.max(from, to)}
                className="relative h-7 cursor-pointer touch-none"
                onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); setFrom(e.clientX); }}
                onPointerMove={e => { if (e.buttons === 1) setFrom(e.clientX); }}>
                <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/12" />
                {band && (
                    <div className="absolute top-1/2 h-3 -translate-y-1/2 rounded-full opacity-35"
                        style={{ left: `${Math.min(bandA, bandB) * 100}%`, width: `${Math.abs(bandB - bandA) * 100}%`, background: color }} />
                )}
                <div className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full" style={{ width: `${k * 100}%`, background: color, opacity: 0.8 }} />
                <div className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
                    style={{ left: `${k * 100}%`, background: color, boxShadow: `0 0 14px ${color}` }} />
            </div>
        </div>
    );
};
