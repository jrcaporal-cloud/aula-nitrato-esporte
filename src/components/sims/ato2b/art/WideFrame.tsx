import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { C } from '../../kit/palette';
import { Chip, Panel, StepTabs } from '../../kit/ui';

/**
 * Moldura "palco largo" dos slides 27, 30 e 33: abas, cena em tela cheia (1110×316 de projeto) e legenda embaixo
 * (manchete, texto curto, número de destaque, ficha do estudo e fonte). A arte carrega a ideia; o texto acompanha.
 */

export const SCENE_W = 1110;
export const SCENE_H = 316;
/** O painel mede 1136 de largura: a cena (1110) fica centrada com 13 px de sobra de cada lado, cobertos pelo fundo. */
export const SCENE_X0 = -13;
export const SCENE_FULL_W = 1136;

interface WideFrameProps {
    tabs: readonly string[];
    step: number;
    setStep: (i: number) => void;
    layoutId: string;
    chips?: ReactNode;
    glow?: string;
    label: string;
    scene: ReactNode;
    headline: string;
    text: string;
    color?: string;
    stat?: ReactNode;
    facts: readonly string[];
    source: string;
}

export const WideFrame = ({ tabs, step, setStep, layoutId, chips, glow, label, scene, headline, text, color = C.noSoft, stat, facts, source }: WideFrameProps) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="not-prose flex w-full select-none flex-col gap-2 font-body text-white" style={{ height: 500 }}>
            <div className="flex h-10 items-center justify-between gap-3">
                <StepTabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
                <div className="flex items-center gap-2">{chips}</div>
            </div>
            <Panel state={glow ? 'active' : 'idle'} glow={glow} className="shrink-0">
                <svg viewBox={`${SCENE_X0} 0 ${SCENE_FULL_W} ${SCENE_H}`} width="100%" height={SCENE_H} role="img" aria-label={label} className="block">
                    {scene}
                </svg>
            </Panel>
            <Panel className="flex min-h-0 flex-1 flex-col justify-between gap-1 px-5 py-2">
                <motion.div key={step} className="flex gap-6" initial={{ opacity: 0, y: reduce ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.35 }}>
                    <div className="min-w-0 flex-1">
                        <p className="font-display text-[1.25rem] font-semibold leading-tight" style={{ color }}>{headline}</p>
                        <p className="mt-0.5 text-[16px] leading-snug text-gray-100">{text}</p>
                    </div>
                    {stat && <div className="flex w-[300px] shrink-0 flex-col justify-center gap-1">{stat}</div>}
                </motion.div>
                <div className="flex items-center gap-2">
                    {facts.map(f => <Chip key={f} color={C.placebo}>{f}</Chip>)}
                    <p className="min-w-0 flex-1 truncate pl-1 text-[14px] leading-snug text-gray-400" title={source}>{source}</p>
                </div>
            </Panel>
        </div>
    );
};

/** Número de destaque com legenda curta (para a coluna da direita da legenda). */
export const Stat = ({ value, label, color = C.text, size = 30 }: { value: string; label: string; color?: string; size?: number }) => (
    <div className="flex items-baseline gap-3">
        <span className="shrink-0 font-display font-semibold leading-none tabular-nums" style={{ color, fontSize: size, fontFamily: /[₀-₉]/.test(value) ? 'var(--font-body)' : undefined, fontWeight: /[₀-₉]/.test(value) ? 800 : undefined }}>{value}</span>
        <span className="text-[15px] leading-snug text-gray-300">{label}</span>
    </div>
);
