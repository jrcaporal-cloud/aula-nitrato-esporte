import { useRef, type PointerEvent } from 'react';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { P_NITRATE, P_PLACEBO, V0_NITRATE, V0_PLACEBO, peakVelocity, powerAt, torquePct, type Arm } from './fvModel';

/**
 * Curva torque-velocidade (em cima) e parábola de potência (embaixo) com o mesmo eixo de velocidade.
 * O cursor vertical é arrastável (mouse); o passador o leva a cada ponto da história. viewBox 720 × 448.
 */

const W = 720;
const X0 = 76;
const X1 = 700;
const VMAX = 16;
const px = (v: number) => X0 + (v / VMAX) * (X1 - X0);
const vOf = (x: number) => ((x - X0) / (X1 - X0)) * VMAX;

const A_TOP = 56;
const A_BOT = 202;
const B_TOP = 262;
const B_BOT = 396;
const ya = (pct: number) => A_BOT - (pct / 100) * (A_BOT - A_TOP);
const yb = (w: number) => B_BOT - (w / 9) * (B_BOT - B_TOP);

const path = (arm: Arm, fn: (a: Arm, v: number) => number, y: (n: number) => number, v0: number): string => {
    const pts: string[] = [];
    for (let v = 0; v <= v0 + 0.001; v += 0.15) pts.push(`${px(Math.min(v, v0)).toFixed(1)},${y(fn(arm, Math.min(v, v0))).toFixed(1)}`);
    return `M ${pts.join(' L ')}`;
};

const ARM_COLOR: Record<Arm, string> = { placebo: C.placebo, nitrate: C.nitrate };

interface CurveProps {
    arm: Arm;
    plot: 'torque' | 'power';
    show: boolean;
    dim: boolean;
}

const Curve = ({ arm, plot, show, dim }: CurveProps) => {
    const v0 = arm === 'nitrate' ? V0_NITRATE : V0_PLACEBO;
    const d = plot === 'torque' ? path(arm, torquePct, ya, v0) : path(arm, powerAt, yb, v0);
    return (
        <path d={d} pathLength={1} fill="none" stroke={ARM_COLOR[arm]} strokeWidth={arm === 'nitrate' ? 4 : 3} strokeLinecap="round"
            strokeDasharray={1} strokeDashoffset={show ? 0 : 1}
            style={{ transition: 'stroke-dashoffset 1.1s ease-out, opacity 0.4s', opacity: show ? (dim ? 0.4 : 1) : 0 }} />
    );
};

const Axes = () => (
    <g>
        {[0, 50, 100].map(t => (
            <g key={t}>
                <line x1={X0} x2={X1} y1={ya(t)} y2={ya(t)} stroke="rgba(255,255,255,0.07)" />
                <SvgText x={X0 - 8} y={ya(t) + 5} text={String(t)} size={16} weight={500} color={C.muted} anchor="end" />
            </g>
        ))}
        {[0, 3, 6, 9].map(t => (
            <g key={t}>
                <line x1={X0} x2={X1} y1={yb(t)} y2={yb(t)} stroke="rgba(255,255,255,0.07)" />
                <SvgText x={X0 - 8} y={yb(t) + 5} text={String(t)} size={16} weight={500} color={C.muted} anchor="end" />
            </g>
        ))}
        {[0, 4, 8, 12, 16].map(t => (
            <g key={t}>
                <line x1={px(t)} x2={px(t)} y1={A_TOP} y2={B_BOT} stroke="rgba(255,255,255,0.05)" />
                <SvgText x={px(t)} y={B_BOT + 22} text={String(t)} size={16} weight={500} color={C.muted} anchor="middle" />
            </g>
        ))}
        <line x1={X0} x2={X1} y1={A_BOT} y2={A_BOT} stroke="rgba(255,255,255,0.3)" />
        <line x1={X0} x2={X1} y1={B_BOT} y2={B_BOT} stroke="rgba(255,255,255,0.3)" />
        <SvgText x={X0 - 8} y={A_TOP - 22} text="Torque (% da força máxima)" size={17} weight={700} color="#E5E7EB" />
        <SvgText x={X0 - 8} y={B_TOP - 24} text="Potência (W/kg)" size={17} weight={700} color="#E5E7EB" />
        <SvgText x={X1} y={B_BOT + 44} text="velocidade angular do joelho (rad/s)" size={16} weight={500} color="#CBD5E1" anchor="end" />
    </g>
);

interface ChartProps {
    /** Passo atual (0 força · 1 velocidade · 2 potência). */
    step: number;
    cursor: number;
    onCursor: (v: number) => void;
}

export const FvChart = ({ step, cursor, onCursor }: ChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const drag = useRef(false);

    const move = (e: PointerEvent<SVGRectElement>) => {
        const svg = svgRef.current;
        if (!svg) return;
        const box = svg.getBoundingClientRect();
        onCursor(Math.min(Math.max(vOf(((e.clientX - box.left) / box.width) * W), 0), V0_NITRATE - 0.2));
    };

    const showNitrate = step >= 1;
    const pv = peakVelocity('placebo');
    const nv = peakVelocity('nitrate');
    const cx = px(cursor);
    const gap = (fn: (a: Arm, v: number) => number, y: (n: number) => number) => [y(fn('placebo', cursor)), y(fn('nitrate', cursor))] as const;
    const [ta, tb] = gap(torquePct, ya);
    const [pa, pb] = gap(powerAt, yb);

    return (
        <svg ref={svgRef} viewBox="0 0 720 448" width="100%" height="100%" role="img" aria-label="Curva força-velocidade e parábola de potência"
            style={{ touchAction: 'none' }}>
            <Axes />
            <g style={{ opacity: step === 2 ? 0.45 : 1, transition: 'opacity 0.4s' }}>
                <Curve arm="placebo" plot="torque" show dim={false} />
                <Curve arm="nitrate" plot="torque" show={showNitrate} dim={false} />
            </g>
            <g style={{ opacity: step === 1 ? 0.45 : 1, transition: 'opacity 0.4s' }}>
                <Curve arm="placebo" plot="power" show dim={false} />
                <Curve arm="nitrate" plot="power" show={showNitrate} dim={false} />
            </g>

            {step === 0 && (
                <g>
                    <circle cx={X0} cy={ya(100)} r={9} fill="none" stroke={C.nitrateSoft} strokeWidth={3}>
                        <animate attributeName="r" values="9;16;9" dur="2.2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="1;0.2;1" dur="2.2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={X0} cy={ya(100)} r={6} fill="#fff" />
                    <SvgText x={X0 + 130} y={ya(88)} text="mesma força máxima, com ou sem nitrato" size={18} weight={700} color="#fff" />
                    <path d={`M ${X0 + 124} ${ya(88) - 6} L ${X0 + 22} ${ya(100) + 4}`} stroke="rgba(255,255,255,0.6)" strokeWidth={2} fill="none" />
                </g>
            )}
            {step === 1 && (
                <g style={{ opacity: 1 }}>
                    <path d={`M ${px(V0_PLACEBO)} ${A_BOT} v -10`} stroke="#CBD5E1" strokeWidth={3} />
                    <path d={`M ${px(V0_NITRATE)} ${A_BOT} v -10`} stroke={C.nitrate} strokeWidth={3} />
                    <SvgText x={X1} y={A_TOP + 40} text="velocidade máxima" size={16} weight={500} color={C.muted} anchor="end" />
                    <SvgText x={X1} y={A_TOP + 66} text="13,1 → 14,5 rad/s" size={20} weight={700} color="#fff" anchor="end" />
                </g>
            )}
            {step === 2 && (
                <g>
                    <circle cx={px(pv)} cy={yb(powerAt('placebo', pv))} r={7} fill={C.placebo} stroke="#fff" strokeWidth={2} />
                    <circle cx={px(nv)} cy={yb(powerAt('nitrate', nv))} r={7} fill={C.nitrate} stroke="#fff" strokeWidth={2} />
                    <SvgText x={px(pv) - 12} y={yb(P_PLACEBO) + 22} text={`${br(P_PLACEBO, 2)}`} size={18} weight={700} color="#CBD5E1" anchor="end" />
                    <SvgText x={px(nv) + 36} y={yb(P_NITRATE) - 12} text={`${br(P_NITRATE, 2)} W/kg`} size={20} weight={700} color={C.nitrateSoft} />
                </g>
            )}

            <g>
                <line x1={cx} x2={cx} y1={A_TOP - 6} y2={B_BOT} stroke="#fff" strokeOpacity={0.55} strokeDasharray="5 5" />
                <path d={`M ${cx - 8} ${A_TOP - 14} h 16 l -8 12 z`} fill="#fff" fillOpacity={0.9} />
                {([[ta, tb], [pa, pb]] as const).map(([a, b], i) => (
                    <g key={i}>
                        {showNitrate && <line x1={cx + 9} x2={cx + 9} y1={a} y2={b} stroke={C.nitrateSoft} strokeWidth={3} strokeLinecap="round" />}
                        <circle cx={cx} cy={a} r={6} fill={C.placebo} stroke="#fff" strokeWidth={1.5} />
                        {showNitrate && <circle cx={cx} cy={b} r={6} fill={C.nitrate} stroke="#fff" strokeWidth={1.5} />}
                    </g>
                ))}
                <SvgText x={cx + 16} y={A_BOT - 10} text={`${br(cursor, 1)} rad/s`} size={16} weight={700} color="#fff" />
            </g>
            <rect x={X0 - 10} y={A_TOP - 26} width={X1 - X0 + 20} height={B_BOT - A_TOP + 34} fill="transparent" style={{ cursor: 'ew-resize' }}
                onPointerDown={e => { drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); move(e); }}
                onPointerMove={e => { if (drag.current) move(e); }}
                onPointerUp={() => { drag.current = false; }} />
        </svg>
    );
};
