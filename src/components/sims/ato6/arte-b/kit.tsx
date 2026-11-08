import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { PANEL_BG } from '../../kit/palette';
import { StepTabs } from '../../kit/ui';

/**
 * Peças comuns da arte do Ato VI (slides 48, 50, 51, 52 e o fecho). Texto HTML ≥ 14 px de projeto;
 * a animação contínua é CSS (transform, opacity, stroke-dashoffset) e some com prefers-reduced-motion.
 */

/** Altura fixa da caixa do simulador (o título e o subtítulo do slide ocupam o resto do palco). */
export const ART_H = 500;

const KEYFRAMES = `
@keyframes ab-pulse { 0%,100% { opacity: .55; transform: scale(1) } 50% { opacity: 1; transform: scale(1.18) } }
@keyframes ab-breathe { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes ab-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-5px) } }
@keyframes ab-scan { 0% { transform: translateX(0); opacity: 0 } 8% { opacity: 1 } 92% { opacity: 1 } 100% { transform: translateX(var(--ab-scan, 300px)); opacity: 0 } }
@keyframes ab-dash { to { stroke-dashoffset: -40 } }
@keyframes ab-spin { to { transform: rotate(360deg) } }
@keyframes ab-twinkle { 0%,100% { opacity: .15 } 50% { opacity: .9 } }
@keyframes ab-check { from { background: rgba(255,255,255,.1) } to { background: var(--ab-to, #34D399) } }
@keyframes ab-tilt { from { transform: rotate(0deg) } to { transform: rotate(var(--ab-deg, 8deg)) } }
@keyframes ab-untilt { from { transform: rotate(0deg) } to { transform: rotate(calc(var(--ab-deg, 8deg) * -1)) } }
@keyframes ab-drop { from { height: var(--ab-from) } to { height: var(--ab-to) } }
@keyframes ab-grow { from { transform: scaleY(0) } to { transform: scaleY(1) } }
@keyframes ab-growx { from { transform: scaleX(0) } to { transform: scaleX(1) } }
@keyframes ab-rot { from { transform: rotate(var(--ab-a0)) } to { transform: rotate(var(--ab-a1)) } }
@keyframes ab-draw { from { stroke-dashoffset: var(--ab-len, 300) } to { stroke-dashoffset: 0 } }
.ab-a { animation-fill-mode: both }
@media (prefers-reduced-motion: reduce) { .ab-a { animation: none !important } }
`;

export const ArteStyles = () => <style>{KEYFRAMES}</style>;

interface ShellProps {
    tabs: readonly string[];
    step: number;
    setStep: (i: number) => void;
    layoutId: string;
    chips?: ReactNode;
    children: ReactNode;
}

/** Moldura: abas do passador (e selos) em cima; o corpo ocupa o resto, em coluna. */
export const ArteShell = ({ tabs, step, setStep, layoutId, chips, children }: ShellProps) => (
    <div className="not-prose mx-auto flex w-full max-w-[1110px] select-none flex-col gap-3 font-body text-white" style={{ height: ART_H }}>
        <ArteStyles />
        <div className="flex items-center justify-between gap-3">
            <StepTabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
            {chips && <div className="flex items-center gap-2">{chips}</div>}
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-3">{children}</div>
    </div>
);

interface GlassProps {
    color?: string;
    /** Intensidade do brilho (0 apaga, 1 acende). */
    glow?: number;
    dashed?: boolean;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
}

/** Painel de vidro escuro com gradiente da cor e brilho suave na borda. */
export const Glass = ({ color = '#94A3B8', glow = 0, dashed = false, className = '', style, children }: GlassProps) => (
    <div className={`relative overflow-hidden rounded-2xl border transition-[box-shadow,border-color,opacity] duration-500 ${className}`}
        style={{
            borderStyle: dashed ? 'dashed' : 'solid',
            borderColor: glow > 0 ? `${color}${glow > 0.5 ? 'bb' : '66'}` : 'rgba(255,255,255,0.12)',
            background: glow > 0 ? `linear-gradient(165deg, ${color}22, rgba(10,6,14,0.84) 66%)` : PANEL_BG.background,
            boxShadow: glow > 0 ? `0 0 34px -12px ${color}` : 'none',
            ...style,
        }}>
        {children}
    </div>
);

/** Entra subindo e aparecendo; com movimento reduzido já nasce no lugar. */
export const Rise = ({ delay = 0, y = 10, className = '', style, children }: { delay?: number; y?: number; className?: string; style?: CSSProperties; children: ReactNode }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.div className={className} style={style} initial={reduce ? false : { opacity: 0, y }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}>
            {children}
        </motion.div>
    );
};

/** Rubrica em mono maiúsculo. */
export const Kick = ({ children, color = '#9CA3AF' }: { children: ReactNode; color?: string }) => (
    <p className="m-0 font-mono text-[14px] uppercase leading-tight tracking-wider" style={{ color }}>{children}</p>
);

/** Fonte discreta, em mono. */
export const Src = ({ children }: { children: ReactNode }) => (
    <span className="font-mono text-[14px] leading-tight text-gray-400">{children}</span>
);
