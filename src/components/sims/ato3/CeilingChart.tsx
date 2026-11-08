import { motion } from 'framer-motion';
import { useRef } from 'react';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { CHARACTERS, STUDIES, TREND, trendAt } from './ceiling.content';

/** Eixo de VO₂max × variação do desempenho (viewBox 700 × 360, escala 1:1). */
export const KW = 700;
export const KH = 360;
const V_MIN = 30;
const V_MAX = 82;
const X0 = 58;
const X1 = 684;
const Y_TOP = 34;
const Y_PX = 43; // px por % de efeito
const Y0 = Y_TOP + 4 * Y_PX; // linha do zero
const AXIS_Y = Y_TOP + 6 * Y_PX;
const kx = (v: number) => X0 + ((v - V_MIN) / (V_MAX - V_MIN)) * (X1 - X0);
const ky = (y: number) => Y0 - y * Y_PX;

interface Props { step: number; vo2: number; onVo2: (v: number) => void; reduce: boolean }

const fade = (reduce: boolean, delay = 0) => ({ initial: { opacity: reduce ? 1 : 0 }, animate: { opacity: 1 }, transition: { duration: reduce ? 0 : 0.5, delay: reduce ? 0 : delay } });

export const CeilingChart = ({ step, vo2, onVo2, reduce }: Props) => {
    const ref = useRef<SVGSVGElement>(null);
    const drag = (clientX: number) => {
        const svg = ref.current;
        if (!svg) return;
        const r = svg.getBoundingClientRect();
        const x = ((clientX - r.left) / r.width) * KW;
        onVo2(Math.round(Math.min(80, Math.max(32, V_MIN + ((x - X0) / (X1 - X0)) * (V_MAX - V_MIN)))));
    };
    const trendPath = [[34, 3.2], ...TREND, [80, 0.1]].map(([v, y], i) => `${i ? 'L' : 'M'} ${kx(v)} ${ky(y)}`).join(' ');
    const showTrend = step >= 1;
    return (
        <svg ref={ref} viewBox={`0 0 ${KW} ${KH}`} width={KW} height={KH} role="img" aria-label="Efeito do nitrato em função do VO₂max"
            onPointerDown={step === 5 ? e => { e.currentTarget.setPointerCapture(e.pointerId); drag(e.clientX); } : undefined}
            onPointerMove={step === 5 ? e => { if (e.buttons === 1) drag(e.clientX); } : undefined}
            style={{ touchAction: 'none', cursor: step === 5 ? 'ew-resize' : 'default' }}>
            {[-2, 0, 2, 4].map(y => (
                <g key={y}>
                    <line x1={X0} x2={X1} y1={ky(y)} y2={ky(y)} stroke={y === 0 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.08)'} />
                    <SvgText x={X0 - 8} y={ky(y) + 6} text={`${y > 0 ? '+' : y < 0 ? '−' : ''}${Math.abs(y)}%`} size={16} anchor="end" weight={500} color={C.muted} />
                </g>
            ))}
            {[30, 40, 50, 60, 70, 80].map(v => (
                <g key={v}>
                    <line x1={kx(v)} x2={kx(v)} y1={Y_TOP} y2={AXIS_Y} stroke="rgba(255,255,255,0.06)" />
                    <SvgText x={kx(v)} y={AXIS_Y + 22} text={`${v}`} size={16} anchor="middle" weight={500} color={C.muted} />
                </g>
            ))}
            <SvgText x={(X0 + X1) / 2} y={AXIS_Y + 46} text="VO₂max (mL/kg/min) e variação do desempenho com nitrato" size={16} anchor="middle" weight={500} color="#CBD5E1" />
            {step >= 1 && (
                <motion.g {...fade(reduce)}>
                    <rect x={kx(65)} y={Y_TOP} width={X1 - kx(65)} height={AXIS_Y - Y_TOP} fill={C.hypoxia} fillOpacity={0.1} />
                    <SvgText x={X1 - 6} y={Y_TOP + 20} text="≥65: d = 0,02" size={17} weight={700} anchor="end" color={C.hypoxia} />
                </motion.g>
            )}
            {step === 2 && (
                <motion.g {...fade(reduce)}>
                    <line x1={kx(60)} x2={kx(60)} y1={Y_TOP} y2={AXIS_Y} stroke={C.nitrite} strokeWidth={2.5} strokeDasharray="6 5" />
                    <SvgText x={kx(60) + 8} y={Y_TOP + 20} text="Delphi >60" size={17} weight={700} color={C.nitrite} />
                </motion.g>
            )}
            {showTrend && (
                <motion.g {...fade(reduce, 0.15)}>
                    <path d={trendPath} fill="none" stroke={C.nitrateSoft} strokeWidth={3} strokeDasharray="8 6" strokeLinecap="round" />
                    {TREND.map(([v, y]) => <rect key={v} x={kx(v) - 6} y={ky(y) - 6} width={12} height={12} transform={`rotate(45 ${kx(v)} ${ky(y)})`} fill="#07050B" stroke={C.nitrateSoft} strokeWidth={2.5} />)}
                    <SvgText x={kx(34) + 8} y={ky(3.2) - 14} text="Porcelli via Senefeld (secundário)" size={16} weight={600} color={C.nitrateSoft} />
                </motion.g>
            )}
            {STUDIES.map((s, i) => (
                <motion.g key={s.id} {...fade(reduce, 0.05 * i)}>
                    <circle cx={kx(s.vo2)} cy={ky(s.y)} r={7} fill={s.sig ? C.nitrate : '#07050B'} stroke={s.sig ? '#fff' : C.nitrate} strokeWidth={2.5} />
                    {s.name && <SvgText x={kx(s.vo2) + s.dx} y={ky(s.y) + s.dy} text={s.name} size={16} weight={600} anchor={s.anchor} color="#E5E7EB" />}
                </motion.g>
            ))}
            {(step === 1 || step === 2 || step === 5) && CHARACTERS.map(c => (
                <motion.g key={c.name} {...fade(reduce, 0.3)}>
                    <path d={`M ${kx(c.vo2) - 8} ${AXIS_Y - 2} l 8 -12 l 8 12 z`} fill={c.color} />
                    <SvgText x={kx(c.vo2)} y={AXIS_Y - 20} text={c.name} size={16} weight={700} anchor="middle" color={c.color} />
                </motion.g>
            ))}
            {step === 5 && (
                <g>
                    <line x1={kx(vo2)} x2={kx(vo2)} y1={28} y2={AXIS_Y} stroke="#fff" strokeWidth={2} strokeDasharray="5 4" />
                    <circle cx={kx(vo2)} cy={ky(trendAt(vo2))} r={9} fill="#fff" stroke={C.nitrate} strokeWidth={4} />
                    <rect x={Math.min(Math.max(kx(vo2) - 44, 4), KW - 92)} y={2} width={88} height={26} rx={7} fill="#fff" />
                    <text x={Math.min(Math.max(kx(vo2), 48), KW - 48)} y={21} textAnchor="middle" fontSize={17} fontWeight={700} fill="#07050B" style={{ fontFamily: 'var(--font-body)' }}>{`VO₂ ${vo2}`}</text>
                </g>
            )}
        </svg>
    );
};
