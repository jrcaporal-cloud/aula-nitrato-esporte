import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { REVEAL_GAP } from '../kit/countUp';
import { useCountText } from '../ato1/countFrame';
import type { Stage } from './cascade.content';
import { useTweenVec } from './useTweenVec';

interface FunnelProps {
    id: string;
    cx: number;
    top: number;
    maxW: number;
    rowH: number;
    gap: number;
    stages: readonly Stage[];
    log: boolean;
    reduce: boolean;
    /** Versão pequena: sem nomes à esquerda, só o rótulo do último degrau. */
    compact?: boolean;
    /** Degrau em destaque (os outros esmaecem). */
    focus?: number | null;
}

const MAX_VALUE = 1051;

type LabelProps = Parameters<typeof SvgText>[0] & { order: number };

/** Rótulo do degrau: o número sobe como contador, degrau a degrau, de cima para baixo (texto final idêntico). */
const CountLabel = ({ text, order, ...rest }: LabelProps) => (
    <SvgText {...rest} text={useCountText(text, { delayMs: (REVEAL_GAP + order * 0.12) * 1000 })} />
);

/** Largura do degrau: valor medido (linear ou log) ou fração fixa para os qualitativos. */
const widthOf = (s: Stage, maxW: number, log: boolean): number => {
    if (s.value === undefined) return Math.max(maxW * s.ghost, 4);
    const frac = log ? Math.log10(1 + s.value) / Math.log10(1 + MAX_VALUE) : s.value / MAX_VALUE;
    return Math.max(maxW * frac, 4);
};

/** Funil de quatro barras centradas, ligadas por trapézios; gotas escapam pelos lados a cada degrau. */
export const Funnel = ({ id, cx, top, maxW, rowH, gap, stages, log, reduce, compact = false, focus = null }: FunnelProps) => {
    const widths = useTweenVec(stages.map(s => widthOf(s, maxW, log)), reduce, 800);
    const yOf = (i: number) => top + i * (rowH + gap);
    return (
        <g>
            <defs>
                {stages.slice(0, -1).map((s, i) => (
                    <linearGradient key={i} id={`${id}-g${i}`} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0" stopColor={s.color} stopOpacity={0.5} />
                        <stop offset="1" stopColor={stages[i + 1].color} stopOpacity={0.5} />
                    </linearGradient>
                ))}
            </defs>
            {stages.slice(0, -1).map((s, i) => {
                const y0 = yOf(i) + rowH;
                const y1 = yOf(i + 1);
                const w0 = widths[i] / 2;
                const w1 = widths[i + 1] / 2;
                return (
                    <g key={s.name}>
                        <path d={`M${cx - w0} ${y0} L${cx + w0} ${y0} L${cx + w1} ${y1} L${cx - w1} ${y1} Z`} fill={`url(#${id}-g${i})`} />
                        {!reduce && [-1, 1].map(side => (
                            <circle key={side} cx={cx + side * (w0 + 2)} cy={y0 + 2} r={compact ? 3 : 4.5} fill={s.color} opacity={0.9}>
                                <animateMotion dur="2.2s" begin={`${i * 0.5}s`} repeatCount="indefinite" path={`M0 0 q${side * 14} 14 ${side * 22} ${gap * 0.9}`} />
                                <animate attributeName="opacity" values="0.9;0.9;0" dur="2.2s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
                            </circle>
                        ))}
                    </g>
                );
            })}
            {stages.map((s, i) => {
                const w = widths[i];
                const y = yOf(i);
                const ghost = s.value === undefined;
                const dim = focus !== null && focus !== i;
                return (
                    <g key={s.name} opacity={dim ? 0.35 : 1}>
                        <rect x={cx - w / 2} y={y} width={w} height={rowH} rx={Math.min(8, w / 2)}
                            fill={ghost ? 'none' : s.color} stroke={s.color} strokeWidth={ghost ? 2.5 : 0} strokeDasharray={ghost ? '7 6' : undefined}
                            style={{ filter: ghost ? undefined : `drop-shadow(0 0 8px ${s.color}88)` }} />
                        {!compact && (
                            <>
                                <SvgText x={24} y={y + rowH / 2 + 6} text={s.name} size={18} color={s.color === C.text ? C.text : s.color} weight={700} />
                                <CountLabel key={s.label} order={i} x={cx + maxW / 2 + 22} y={y + rowH / 2 + 8} text={s.label} size={ghost ? 20 : 26} color={ghost ? C.muted : C.text} weight={800} />
                            </>
                        )}
                        {compact && i === stages.length - 1 && (
                            <CountLabel key={s.label} order={i} x={cx} y={y + rowH + 28} text={s.label} anchor="middle" size={22} color={C.text} weight={800} />
                        )}
                    </g>
                );
            })}
        </g>
    );
};
