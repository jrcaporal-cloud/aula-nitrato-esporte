import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { useEntered } from './hooks';
import type { YoYoRun } from './teamContent';

/**
 * Duas raias de 0 a 1.800 m: placebo e beterraba correm o Yo-Yo e o corredor da beterraba termina à frente.
 * O colchete mostra a diferença em metros (cálculo). viewBox 720 × 448.
 */

const X0 = 44;
const X1 = 684;
const MAX = 1800;
const sx = (m: number) => X0 + (m / MAX) * (X1 - X0);
const TICKS = [0, 400, 800, 1200, 1600];
const LANE_H = 58;
const LANES_Y = [104, 194] as const;

const metros = (m: number) => `${m.toLocaleString('pt-BR')} m`;

interface LaneProps {
    y: number;
    value: number;
    color: string;
    soft: string;
    label: string;
    go: boolean;
    delay: number;
}

const Lane = ({ y, value, color, soft, label, go, delay }: LaneProps) => {
    const w = sx(value) - X0;
    const t = `transform 1.1s cubic-bezier(0.22, 0.8, 0.24, 1) ${delay}s`;
    return (
        <g>
            <SvgText x={X0} y={y - 10} text={label} size={17} weight={700} color={soft} />
            <rect x={X0} y={y} width={X1 - X0} height={LANE_H} rx={12} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
            <rect x={X0} y={y} width={w} height={LANE_H} rx={12} fill={color} fillOpacity={0.55}
                style={{ transformBox: 'fill-box', transformOrigin: 'left center', transform: `scaleX(${go ? 1 : 0})`, transition: t }} />
            <circle cx={X0 + w - 4} cy={y + LANE_H / 2} r={15} fill={color} stroke="#fff" strokeWidth={2.5}
                style={{ transform: `translateX(${go ? 0 : -w}px)`, transition: t }} />
            <g style={{ opacity: go ? 1 : 0, transition: `opacity 0.4s ease ${delay + 0.8}s` }}>
                <SvgText x={X0 + w - 30} y={y + LANE_H / 2 + 7} text={metros(value)} size={20} weight={700} color="#fff" anchor="end" />
            </g>
        </g>
    );
};

export const YoYoLanes = ({ run, reduce }: { run: YoYoRun; reduce: boolean }) => {
    const go = useEntered(reduce);
    const a = sx(run.placebo);
    const b = sx(run.nitrate);
    const barY = LANES_Y[1] + LANE_H + 16;
    return (
        <svg viewBox="0 0 720 448" width="100%" height="100%" role="img" aria-label={`Yo-Yo IR1: ${run.title}`}>
            <SvgText x={X0} y={34} text={`Yo-Yo IR1 · ${run.title}`} size={18} weight={700} color="#E5E7EB" />
            {TICKS.map(t => (
                <g key={t}>
                    <line x1={sx(t)} x2={sx(t)} y1={78} y2={LANES_Y[1] + LANE_H + 6} stroke="rgba(255,255,255,0.07)" />
                    <SvgText x={sx(t)} y={70} text={t === 0 ? '0 m' : t.toLocaleString('pt-BR')} size={16} weight={500} color={C.muted} anchor="middle" />
                </g>
            ))}
            <Lane y={LANES_Y[0]} value={run.placebo} color={C.placebo} soft="#CBD5E1" label="Placebo (suco sem nitrato)" go={go} delay={0} />
            <Lane y={LANES_Y[1]} value={run.nitrate} color={C.nitrate} soft={C.nitrateSoft} label="Suco de beterraba" go={go} delay={0.15} />
            <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.5s ease 1.0s' }}>
                <line x1={a} x2={a} y1={LANES_Y[0] + LANE_H} y2={barY + 8} stroke="#CBD5E1" strokeDasharray="4 4" />
                <line x1={b} x2={b} y1={LANES_Y[1] + LANE_H} y2={barY + 8} stroke={C.nitrateSoft} strokeDasharray="4 4" />
                <path d={`M ${a} ${barY} H ${b}`} stroke="#fff" strokeWidth={3} strokeLinecap="round" />
                <SvgText x={(a + b) / 2} y={barY + 34} text={`+${run.gap} m (cálculo)`} size={17} weight={700} color="#fff" anchor="middle" />
            </g>
            <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.5s ease 1.0s' }}>
                <text x={X0} y={394} fontSize={84} fontWeight={700} fill={C.nitrateSoft} style={{ fontFamily: 'var(--font-display)' }}>{run.delta}</text>
                <SvgText x={X0 + 2} y={428} text="variação da distância total, beterraba vs placebo" size={16} weight={500} color={C.muted} />
            </g>
        </svg>
    );
};
