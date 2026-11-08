import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import { VIS_H, VIS_W } from './ui';
import type { CrossoverStep } from './crossoverContent';
import { T } from './arte/text';
import { Seal } from './arte/figures';
import { Count } from './countText';
import { DesignPanel, LearningPanel, OrderPanel } from './CrossoverPanels';
import { BiologyPanel, GoodPanel } from './CrossoverPanels2';

/**
 * Desenhos do CrossoverSim: o cronograma grande no alto (as faixas dos braços se cruzam no washout,
 * os selos das armadilhas acendem por passo) e o quadro do passo embaixo. Caixa 672 × 440.
 */

type Focus = CrossoverStep['focus'];
const BR = C.nitrate;
const PL = C.placebo;
const LANE_A = 60;
const LANE_B = 132;
const LANE_H = 44;
const COL = { famil: [118, 60], v1: [214, 98], wash: [320, 104], v2: [432, 98] } as const;

interface BlockProps { x: number; w: number; y: number; label: string; color: string; hatched?: boolean; dim: boolean }

const Block = ({ x, w, y, label, color, hatched = false, dim }: BlockProps) => (
    <g style={{ opacity: dim ? 0.28 : 1, transition: 'opacity 0.4s' }}>
        <rect x={x} y={y} width={w} height={LANE_H} rx={11} fill={hatched ? 'url(#xo-hatch)' : color} fillOpacity={hatched ? 1 : 0.4}
            stroke={color} strokeWidth={hatched ? 1.8 : 1.6} strokeDasharray={hatched ? '5 4' : undefined} />
        <T x={x + w / 2} y={y + 28} size={16} color="#fff" weight={600} anchor="middle">{label}</T>
    </g>
);

const LANES = [
    { y: LANE_A, name: 'Sequência A', v1: ['beterraba', BR], v2: ['placebo', PL] },
    { y: LANE_B, name: 'Sequência B', v1: ['placebo', PL], v2: ['beterraba', BR] },
] as const;

const BADGES: Partial<Record<Focus, [string, string, string]>> = {
    famil: ['+1,2%', 'de graça', C.nitrite],
    wash: ['7 d', 'bastam?', C.nitrite],
    order: ['sorteio', 'da ordem', C.nitrateSoft],
};

const SEALS = [
    { x: 150, label: 'familiarização', from: 1 },
    { x: 318, label: 'ordem sorteada', from: 2 },
    { x: 490, label: 'washout', from: 3 },
] as const;

const Timeline = ({ focus, step, reduce }: { focus: Focus; step: number; reduce: boolean }) => {
    const dim = (g: Focus) => focus !== 'all' && focus !== g && !(focus === 'order' && g === 'wash');
    const badge = BADGES[focus];
    const [fx, fw] = COL.famil;
    const [v1x, v1w] = COL.v1;
    const [wx, ww] = COL.wash;
    const [v2x, v2w] = COL.v2;
    const ribbon = (y1: number, y2: number) => `M${v1x + v1w} ${y1}C${wx + ww * 0.45} ${y1} ${wx + ww * 0.55} ${y2} ${v2x} ${y2}`;
    return (
        <g>
            <defs>
                <pattern id="xo-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="8" height="8" fill="rgba(251,191,36,0.07)" />
                    <line x1="0" y1="0" x2="0" y2="8" stroke={C.nitrite} strokeOpacity="0.55" strokeWidth="2" />
                </pattern>
            </defs>
            {[{ x: fx + fw / 2, t: 'familiar.' }, { x: v1x + v1w / 2, t: 'visita 1' }, { x: wx + ww / 2, t: 'washout' }, { x: v2x + v2w / 2, t: 'visita 2' }].map(h => (
                <T key={h.t} x={h.x} y={42} size={16} color={C.muted} weight={500} anchor="middle">{h.t}</T>
            ))}
            {LANES.map(l => (
                <g key={l.name}>
                    <T x={14} y={l.y + 28} size={16} color="#E5E7EB" weight={700}>{l.name}</T>
                    <Block x={fx} w={fw} y={l.y} label="treino" color={C.o2} dim={dim('famil')} />
                    <Block x={v1x} w={v1w} y={l.y} label={l.v1[0]} color={l.v1[1]} dim={dim('order')} />
                    <Block x={wx} w={ww} y={l.y} label="intervalo" color={C.nitrite} hatched dim={dim('wash')} />
                    <Block x={v2x} w={v2w} y={l.y} label={l.v2[0]} color={l.v2[1]} dim={dim('order')} />
                </g>
            ))}
            {/* os braços se cruzam: beterraba desce de A para B, placebo sobe de B para A */}
            <g fill="none" strokeLinecap="round" strokeWidth={9} strokeOpacity={0.6} strokeDasharray="14 10" opacity={dim('wash') && focus !== 'order' ? 0.3 : 1}>
                <path d={ribbon(LANE_A + LANE_H / 2, LANE_B + LANE_H / 2)} stroke={BR}>
                    {!reduce && <animate attributeName="stroke-dashoffset" values="0;-48" dur="2.4s" repeatCount="indefinite" />}
                </path>
                <path d={ribbon(LANE_B + LANE_H / 2, LANE_A + LANE_H / 2)} stroke={PL}>
                    {!reduce && <animate attributeName="stroke-dashoffset" values="0;-48" dur="2.4s" repeatCount="indefinite" />}
                </path>
            </g>
            <g style={{ opacity: dim('order') ? 0.28 : 1, transition: 'opacity 0.4s' }}>
                <circle cx={fx + fw + 18} cy={(LANE_A + LANE_B + LANE_H) / 2} r={11} fill="rgba(251,191,36,0.16)" stroke={C.nitrite} strokeWidth={2} />
                <T x={fx + fw + 18} y={(LANE_A + LANE_B + LANE_H) / 2 + 6} size={16} color={C.nitriteSoft} weight={700} anchor="middle">?</T>
            </g>
            {badge && (
                <motion.g key={focus} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                    <T x={598} y={LANE_A + 34} size={focus === 'order' ? 20 : 26} color={badge[2]} weight={700} anchor="middle" display><Count text={badge[0]} delayMs={250} ms={700} /></T>
                    <T x={598} y={LANE_A + 58} size={16} color={badge[2]} weight={600} anchor="middle">{badge[1]}</T>
                </motion.g>
            )}
            {/* selos das três armadilhas: acendem conforme os passos */}
            <line x1={14} x2={VIS_W - 14} y1={204} y2={204} stroke="rgba(255,255,255,0.12)" />
            <T x={14} y={228} size={16} color={C.muted} weight={500}>3 armadilhas:</T>
            {SEALS.map(s => (
                <g key={s.label}>
                    <Seal cx={s.x} cy={222} r={13} color={C.no} mark="ok" lit={step >= s.from || step === 4} />
                    <T x={s.x + 20} y={228} size={16} color={step >= s.from || step === 4 ? C.noSoft : C.muted} weight={600}>{s.label}</T>
                </g>
            ))}
        </g>
    );
};

export const CrossoverVisual = ({ step, focus }: { step: number; focus: Focus }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Cronograma de um ensaio cruzado">
            <Timeline focus={focus} step={step} reduce={reduce} />
            <line x1={14} x2={VIS_W - 14} y1={246} y2={246} stroke="rgba(255,255,255,0.12)" />
            {step === 0 && <DesignPanel />}
            {step === 1 && <LearningPanel reduce={reduce} />}
            {step === 2 && <OrderPanel />}
            {step === 3 && <BiologyPanel reduce={reduce} />}
            {step === 4 && <GoodPanel />}
        </svg>
    );
};
