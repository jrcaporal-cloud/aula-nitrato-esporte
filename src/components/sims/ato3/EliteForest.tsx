import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { ELITE_ROWS, halfWidth } from './elite.content';

/** Floresta de nulos (viewBox 740 × 360, escala 1:1): ponto = diferença observada; barra = precisão esperada (cálculo). */
export const EW = 740;
export const EH = 360;
const X0 = 345;
const X1 = 600;
const DOMAIN = [-4, 4] as const;
const TOP = 40;
const ROW_H = 32;
const sx = (v: number) => X0 + ((v - DOMAIN[0]) / (DOMAIN[1] - DOMAIN[0])) * (X1 - X0);
const f1 = (n: number) => br(n, 0).replace('-', '−');

export const EliteForest = ({ step }: { step: number }) => {
    const axisY = TOP + ROW_H * ELITE_ROWS.length + 4;
    return (
        <svg viewBox={`0 0 ${EW} ${EH}`} width={EW} height={EH} role="img" aria-label="Estudos em atletas de elite: diferenças em torno de zero">
            <rect x={sx(1)} y={TOP - 8} width={sx(3) - sx(1)} height={axisY - TOP + 8} fill={C.no} fillOpacity={0.12} />
            <SvgText x={(sx(1) + sx(3)) / 2} y={22} text="1–3% (IOC)" size={16} weight={700} anchor="middle" color={C.noSoft} />
            <SvgText x={sx(0) - 8} y={22} text="← pior" size={16} weight={500} anchor="end" color={C.muted} />
            {[-4, -2, 0, 2, 4].map(t => (
                <g key={t}>
                    <line x1={sx(t)} x2={sx(t)} y1={TOP - 8} y2={axisY} stroke="rgba(255,255,255,0.07)" />
                    <SvgText x={sx(t)} y={axisY + 24} text={`${t > 0 ? '+' : ''}${f1(t)}%`} size={16} anchor="middle" weight={500} color={C.muted} />
                </g>
            ))}
            <line x1={sx(0)} x2={sx(0)} y1={TOP - 8} y2={axisY} stroke="rgba(255,255,255,0.55)" strokeDasharray="5 5" />
            <line x1={X0} x2={X1} y1={axisY} y2={axisY} stroke="rgba(255,255,255,0.25)" />
            <SvgText x={(X0 + X1) / 2} y={axisY + 48} text="variação do desempenho com nitrato" size={16} anchor="middle" weight={500} color="#CBD5E1" />
            {ELITE_ROWS.map((r, i) => {
                const cy = TOP + ROW_H * i + ROW_H / 2;
                const hw = halfWidth(r.n);
                const on = r.from <= step;
                return (
                    <g key={r.id} style={{ opacity: on ? 1 : 0, transition: 'opacity 0.45s' }}>
                        <SvgText x={0} y={cy + 6} text={r.label} size={17} weight={600} color="#E5E7EB" />
                        <line x1={sx(Math.max(r.y - hw, DOMAIN[0]))} x2={sx(Math.min(r.y + hw, DOMAIN[1]))} y1={cy} y2={cy}
                            stroke={r.color} strokeWidth={step >= 3 ? 4 : 2.5} strokeLinecap="round" strokeOpacity={step >= 3 ? 0.9 : 0.55} style={{ transition: 'stroke-width 0.4s' }} />
                        <rect x={sx(r.y) - 7} y={cy - 7} width={14} height={14} fill={r.color} stroke="#fff" strokeWidth={1.5} />
                        <SvgText x={EW} y={cy + 6} text={r.right} size={17} weight={700} anchor="end" color={r.color} />
                    </g>
                );
            })}
        </svg>
    );
};
