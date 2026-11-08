import { useRef, type ReactNode } from 'react';
import { C } from '../kit/palette';
import { Chip, Source, StepTabs } from '../kit/ui';
import { REVEAL_GAP } from '../kit/countUp';
import { KeyFact, Reveal } from '../kit/rhythm';
import { CountText } from '../ato1/countText';
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

interface NarrationProps { headline: string; children: ReactNode; order?: number }

/**
 * Texto do passo: manchete + duas ou três frases (use `key={step}`). Ritmo do passo: arte (0) → número (1) → legenda (2);
 * a narração entra como legenda, depois do número. Quando o número-chave mora no próprio texto, use order={1}.
 */
export const Narration = ({ headline, children, order = 2 }: NarrationProps) => (
    <Reveal order={order} className="flex flex-col gap-1.5">
        <p className="font-display text-[1.3rem] font-semibold leading-tight text-white">{headline}</p>
        <p className="text-[17px] leading-snug text-gray-100">{children}</p>
    </Reveal>
);

interface KeyNumProps { c: string; children: string; order?: number; count?: boolean }

/** Número-chave dentro da narração: sobe como contador e ganha o destaque curto (1 por passo). */
export const KeyNum = ({ c, children, order = 1, count = true }: KeyNumProps) => (
    <KeyFact color={c} delay={order * REVEAL_GAP}>
        <b className="font-semibold" style={{ color: c }}>
            {count ? <CountText text={children} delayMs={order * REVEAL_GAP * 1000} /> : children}
        </b>
    </KeyFact>
);

/** Palavra em destaque colorido dentro da narração. */
export const Hl = ({ c, children }: { c: string; children: ReactNode }) => (
    <b className="font-semibold" style={{ color: c }}>{children}</b>
);

/** Rodapé de fonte da coluna de texto (entra por último no passo; dê `key={step}`). */
export const SourceLine = ({ children }: { children: ReactNode }) => (
    <div className="mt-auto border-t border-white/10 pt-2"><Reveal order={2} delay={0.08}><Source>{children}</Source></Reveal></div>
);

interface BigStatProps {
    value: string;
    label: string;
    color?: string;
    size?: number;
    /** Número-chave do passo: conta até o texto e ganha o destaque. */
    hit?: boolean;
    /** Atraso extra (s) para escalonar uma lista. */
    delay?: number;
}

/** Número de destaque com legenda curta: número (ordem 1) e depois a legenda (ordem 2). */
export const BigStat = ({ value, label, color = C.text, size = 34, hit = false, delay = 0 }: BigStatProps) => {
    const num = (
        <span className="font-display font-semibold leading-none tabular-nums" style={{ color, fontSize: size }}>
            {hit ? <CountText text={value} delayMs={(REVEAL_GAP + delay) * 1000} /> : value}
        </span>
    );
    return (
        <div className="flex min-w-0 flex-col">
            <Reveal order={1} delay={delay}>{hit ? <KeyFact color={color} delay={REVEAL_GAP + delay}>{num}</KeyFact> : num}</Reveal>
            <Reveal order={2} delay={delay}><span className="mt-1 block text-[14px] leading-tight text-gray-300">{label}</span></Reveal>
        </div>
    );
};

export interface StatItem { value: string; label: string; color: string; hit?: boolean }

/** Lista de números do passo; o marcado com `hit` (ou o primeiro) é o número-chave. */
export const StatList = ({ items, size }: { items: readonly StatItem[]; size: number }) => {
    const hitAt = Math.max(0, items.findIndex(s => s.hit));
    return <>{items.map((s, i) => <BigStat key={s.label} value={s.value} label={s.label} color={s.color} size={size} hit={i === hitAt} delay={i * 0.08} />)}</>;
};

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
