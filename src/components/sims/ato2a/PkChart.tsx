import type { PointerEvent } from 'react';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br } from '../kit/format';
import { clamp } from './hooks';
import { DOSES, PEAK_WINDOW, axisOf, curveOf, statusOf, timeOf, type PkRow } from './pkModel';

/** Três curvas empilhadas (nitrato no plasma, nitrito no plasma, nitrato no músculo) com cursor de tempo. SVG 690×336. */
export const PK_W = 690;
export const PK_H = 336;

const X0 = 22;
const X1 = 676;
const ROW_H = 80;
const ROW_TOP = [28, 112, 196] as const;
const AXIS_Y = 280;
const xOf = (t: number) => X0 + axisOf(t) * (X1 - X0);

const ROWS: { key: PkRow; label: string; color: string; peakText: string }[] = [
    { key: 'nitrate', label: 'Nitrato no plasma', color: C.nitrate, peakText: 'pico 1–2 h' },
    { key: 'nitrite', label: 'Nitrito no plasma', color: C.nitrite, peakText: 'pico 2–3 h' },
    { key: 'muscle', label: 'Nitrato no músculo', color: C.nitrateSoft, peakText: 'pico 3 h' },
];

const path = (f: (t: number) => number, top: number, scale = 1, close = false): string => {
    const base = top + ROW_H - 6;
    const pts: string[] = [];
    for (let t = 0; t <= 24.001; t += t < 6 ? 0.1 : 0.3) pts.push(`${xOf(t).toFixed(1)} ${(base - f(t) * scale * 54).toFixed(1)}`);
    const line = `M${pts.join(' L')}`;
    return close ? `${line} L${xOf(24)} ${base} L${xOf(0)} ${base} Z` : line;
};

interface Props {
    t: number;
    onTime: (t: number) => void;
    /** Linha em foco (as outras apagam); null = todas. */
    focus: PkRow | null;
    /** Mostra o nitrito nas três doses (último passo). */
    byDose: boolean;
    doseIndex: number;
}

export const PkChart = ({ t, onTime, focus, byDose, doseIndex }: Props) => {
    const drag = (e: PointerEvent<SVGRectElement>) => {
        const box = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
        if (!box) return;
        const x = ((e.clientX - box.left) / box.width) * PK_W;
        onTime(timeOf(clamp((x - X0) / (X1 - X0), 0, 1)));
    };
    const cx = xOf(t);
    return (
        <svg width={PK_W} height={PK_H} viewBox={`0 0 ${PK_W} ${PK_H}`} role="img"
            aria-label="Curvas de nitrato plasmático, nitrito plasmático e nitrato muscular nas 24 horas após uma dose">
            <defs>
                {ROWS.map(r => (
                    <linearGradient key={r.key} id={`pk-fill-${r.key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor={r.color} stopOpacity={0.4} />
                        <stop offset="1" stopColor={r.color} stopOpacity={0.02} />
                    </linearGradient>
                ))}
            </defs>
            {/* região de escala comprimida */}
            <rect x={xOf(6)} y={ROW_TOP[0] - 6} width={X1 - xOf(6)} height={AXIS_Y - ROW_TOP[0] + 6} fill="rgba(255,255,255,0.025)" rx={8} />

            {ROWS.map((r, i) => {
                const top = ROW_TOP[i];
                const dim = byDose ? r.key !== 'nitrite' : focus !== null && focus !== r.key;
                const [a, b] = PEAK_WINDOW[r.key];
                const base = top + ROW_H - 6;
                const lit = !dim && (focus === r.key || (byDose && r.key === 'nitrite'));
                const level = curveOf(r.key, t);
                return (
                    <g key={r.key} style={{ opacity: dim ? 0.3 : 1, transition: 'opacity 0.4s' }}>
                        <line x1={X0} y1={base} x2={X1} y2={base} stroke="rgba(255,255,255,0.14)" />
                        <rect x={xOf(a)} y={top} width={xOf(b) - xOf(a)} height={ROW_H - 6} fill={r.color} opacity={lit ? 0.2 : 0.06} rx={4} />
                        {byDose && r.key === 'nitrite' ? (
                            DOSES.map((d, k) => (
                                <g key={d.mmol}>
                                    <path d={path(tt => curveOf('nitrite', tt), top, d.scale, true)} fill="url(#pk-fill-nitrite)" opacity={k === doseIndex ? 0.9 : 0.2} />
                                    <path d={path(tt => curveOf('nitrite', tt), top, d.scale)} fill="none" stroke={r.color} strokeWidth={k === doseIndex ? 3.5 : 1.8}
                                        opacity={k === doseIndex ? 1 : 0.55} strokeLinecap="round" />
                                </g>
                            ))
                        ) : (
                            <>
                                <path d={path(tt => curveOf(r.key, tt), top, 1, true)} fill={`url(#pk-fill-${r.key})`} />
                                <path d={path(tt => curveOf(r.key, tt), top)} fill="none" stroke={r.color} strokeWidth={3} strokeLinecap="round" />
                            </>
                        )}
                        <SvgText x={X1 - 4} y={top + 20} text={`${r.label}${byDose ? '' : ` · ${statusOf(r.key, t)}`}`} size={17} weight={700} anchor="end" color={r.color} />
                        {!byDose && (
                            <SvgText x={xOf((a + b) / 2) + 8} y={base - 62} text={r.peakText} size={16} color={C.text} />
                        )}
                        <circle cx={cx} cy={base - (byDose && r.key === 'nitrite' ? DOSES[doseIndex].scale : 1) * level * 54} r={6} fill={r.color} stroke="#fff" strokeWidth={2} />
                    </g>
                );
            })}

            {/* eixo do tempo */}
            <line x1={X0} y1={AXIS_Y} x2={X1} y2={AXIS_Y} stroke="rgba(255,255,255,0.3)" />
            {[0, 1, 2, 3, 4, 5, 6, 12, 18, 24].map(h => (
                <g key={h}>
                    <line x1={xOf(h)} y1={AXIS_Y} x2={xOf(h)} y2={AXIS_Y + 5} stroke="rgba(255,255,255,0.3)" />
                    <SvgText x={xOf(h)} y={AXIS_Y + 24} text={`${h}`} size={16} anchor="middle" color={C.muted} />
                </g>
            ))}
            <SvgText x={X0} y={PK_H - 8} text="horas após a dose · 6–24 h em escala comprimida" size={16} color={C.muted} />

            {/* cursor */}
            <line x1={cx} y1={18} x2={cx} y2={AXIS_Y} stroke="#fff" strokeWidth={1.5} strokeDasharray="3 4" opacity={0.8} />
            <rect x={cx - 34} y={0} width={68} height={22} rx={11} fill="#fff" />
            <text x={cx} y={16} textAnchor="middle" fontSize={16} fontWeight={700} fill="#07050B" style={{ fontFamily: 'var(--font-body)' }}>{br(t, 1)} h</text>
            <rect x={X0} y={0} width={X1 - X0} height={AXIS_Y + 8} fill="transparent" style={{ cursor: 'ew-resize', touchAction: 'none' }}
                onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); drag(e); }}
                onPointerMove={e => { if (e.buttons === 1) drag(e); }} />
        </svg>
    );
};
