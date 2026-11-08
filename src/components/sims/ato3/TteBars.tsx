import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/** Barras verticais do slide 41 (viewBox 600 × 360, escala 1:1). Altura por transform: a troca de passo anima suave. */

export const TW = 600;
export const TH = 360;
const BASE = 300;
const AXIS_MAX = 36;
const PX = 270 / AXIS_MAX;
const BAR_W = 70;
const GAP = 14;

export interface BarSpec {
    id: string;
    value: number;
    text: string;
    color: string;
    /** Barra tracejada (ruído do teste). */
    ghost?: boolean;
    /** Faixa de dúvida (ex.: conversão com taxas 1:15 e 1:8), desenhada como barra de erro. */
    range?: readonly [number, number];
}

export interface GroupSpec {
    id: string;
    label: string;
    sub: string;
    bars: readonly BarSpec[];
}

const GROUP_X = [190, 450] as const;
const ticks = [0, 10, 20, 30];
const yOf = (v: number) => BASE - Math.min(v, AXIS_MAX) * PX;

const Bar = ({ b, x, reduce }: { b: BarSpec; x: number; reduce: boolean }) => {
    const full = AXIS_MAX * PX;
    const k = Math.min(b.value, AXIS_MAX) / AXIS_MAX;
    const t = reduce ? 'none' : 'transform 0.6s ease';
    return (
        <g>
            <rect x={x} y={BASE - full} width={BAR_W} height={full} rx={5}
                fill={b.ghost ? 'rgba(255,255,255,0.04)' : b.color} fillOpacity={b.ghost ? 1 : 0.92}
                stroke={b.ghost ? b.color : 'none'} strokeWidth={2} strokeDasharray={b.ghost ? '6 5' : undefined}
                style={{ transform: `scaleY(${k})`, transformOrigin: '50% 100%', transformBox: 'fill-box', transition: t }} />
            <g style={{ transform: `translateY(${-(Math.min(b.range?.[1] ?? b.value, AXIS_MAX) * PX)}px)`, transition: t }}>
                <SvgText x={x + BAR_W / 2} y={BASE - 10} text={b.text} size={19} weight={700} anchor="middle" color={b.ghost ? b.color : '#fff'} />
            </g>
            {b.range && (
                <g stroke="#fff" strokeWidth={2.5} strokeLinecap="round">
                    <line x1={x + BAR_W / 2} x2={x + BAR_W / 2} y1={yOf(b.range[0])} y2={yOf(b.range[1])} />
                    <line x1={x + BAR_W / 2 - 9} x2={x + BAR_W / 2 + 9} y1={yOf(b.range[0])} y2={yOf(b.range[0])} />
                    <line x1={x + BAR_W / 2 - 9} x2={x + BAR_W / 2 + 9} y1={yOf(b.range[1])} y2={yOf(b.range[1])} />
                </g>
            )}
        </g>
    );
};

export const TteBars = ({ groups, reduce }: { groups: readonly GroupSpec[]; reduce: boolean }) => (
    <svg viewBox={`0 0 ${TW} ${TH}`} width={TW} height={TH} role="img" aria-label="Efeito medido por tempo até a exaustão e por contrarrelógio">
        {ticks.map(t => (
            <g key={t}>
                <line x1={56} x2={TW - 8} y1={yOf(t)} y2={yOf(t)} stroke={t === 0 ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.08)'} />
                <SvgText x={46} y={yOf(t) + 6} text={`${t}%`} size={16} anchor="end" weight={500} color={C.muted} />
            </g>
        ))}
        {groups.map((g, gi) => {
            const n = g.bars.length;
            const w = n * BAR_W + (n - 1) * GAP;
            const x0 = GROUP_X[gi] - w / 2;
            return (
                <g key={g.id}>
                    {g.bars.map((b, i) => <Bar key={b.id} b={b} x={x0 + i * (BAR_W + GAP)} reduce={reduce} />)}
                    <SvgText x={GROUP_X[gi]} y={BASE + 30} text={g.label} size={18} weight={700} anchor="middle" color="#fff" />
                    <SvgText x={GROUP_X[gi]} y={BASE + 52} text={g.sub} size={16} weight={400} anchor="middle" color={C.muted} />
                </g>
            );
        })}
    </svg>
);
