import { motion } from 'framer-motion';
import { useRef } from 'react';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { CONSENSUS, DOSES, O2_COST, TOLERANCE } from './dose.content';

/** Curva dose-resposta (viewBox 660 × 360, escala 1:1). Eixo x em mmol de nitrato; y em % de efeito. */
export const DW = 660;
export const DH = 360;
const X0 = 64;
const X1 = 628;
const D_MAX = 18;
const BASE = 250;
const PX = 13; // px por % de efeito
const sx = (d: number) => X0 + (d / D_MAX) * (X1 - X0);
const sy = (v: number) => BASE - v * PX;

const path = (pts: readonly (readonly [number, number])[]) => pts.map(([d, v], i) => `${i ? 'L' : 'M'} ${sx(d)} ${sy(v)}`).join(' ');
/** Nitrito plasmático: sobe com a dose, sem escala numérica (forma ilustrativa). */
const NITRITE: readonly (readonly [number, number])[] = [[0, 0], [4.2, 5], [8.4, 9.5], [16.8, 15]];

interface Props { step: number; dose: number; onDose: (d: number) => void; reduce: boolean }

/** Item da legenda: bolinha (ou traço) colorida e o nome da série. */
const LegendDot = ({ x, color, text, on, dashed = false }: { x: number; color: string; text: string; on: boolean; dashed?: boolean }) => (
    <g opacity={on ? 1 : 0.25}>
        {dashed ? <line x1={x - 6} x2={x + 14} y1={14} y2={14} stroke={color} strokeWidth={3} strokeDasharray="5 4" /> : <circle cx={x + 4} cy={14} r={6} fill={color} />}
        <SvgText x={x + 22} y={20} text={text} size={16} weight={600} color="#E5E7EB" />
    </g>
);

const fade = (reduce: boolean, delay = 0) => ({ initial: { opacity: reduce ? 1 : 0 }, animate: { opacity: 1 }, transition: { duration: reduce ? 0 : 0.5, delay: reduce ? 0 : delay } });

export const DoseChart = ({ step, dose, onDose, reduce }: Props) => {
    const ref = useRef<SVGSVGElement>(null);
    const drag = (clientX: number) => {
        const svg = ref.current;
        if (!svg) return;
        const r = svg.getBoundingClientRect();
        const x = ((clientX - r.left) / r.width) * DW;
        onDose(Math.min(D_MAX, Math.max(0, Math.round(((x - X0) / (X1 - X0)) * D_MAX * 10) / 10)));
    };
    return (
        <svg ref={ref} viewBox={`0 0 ${DW} ${DH}`} width={DW} height={DH} role="img" aria-label="Curva dose-resposta do suco de beterraba"
            onPointerDown={step === 4 ? e => { e.currentTarget.setPointerCapture(e.pointerId); drag(e.clientX); } : undefined}
            onPointerMove={step === 4 ? e => { if (e.buttons === 1) drag(e.clientX); } : undefined}
            style={{ touchAction: 'none', cursor: step === 4 ? 'ew-resize' : 'default' }}>
            {[0, 5, 10, 15].map(v => (
                <g key={v}>
                    <line x1={X0} x2={X1} y1={sy(v)} y2={sy(v)} stroke={v === 0 ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.08)'} />
                    <SvgText x={X0 - 10} y={sy(v) + 6} text={`${v}%`} size={16} anchor="end" weight={500} color={C.muted} />
                </g>
            ))}
            {DOSES.map(d => (
                <g key={d.mmol}>
                    <line x1={sx(d.mmol)} x2={sx(d.mmol)} y1={sy(0)} y2={sy(0) + 8} stroke="#fff" strokeOpacity={0.5} />
                    <SvgText x={sx(d.mmol)} y={BASE + 28} text={`${br(d.mmol, 1)} mmol`} size={18} weight={700} anchor="middle" color="#fff" />
                    <SvgText x={sx(d.mmol)} y={BASE + 48} text={`${d.ml} mL · ${d.mg} mg`} size={16} weight={400} anchor="middle" color={C.muted} />
                </g>
            ))}
            <SvgText x={X0} y={BASE + 28} text="0" size={18} weight={700} anchor="middle" color="#fff" />
            {step === 3 && CONSENSUS.map((c, i) => {
                const col = i === 0 ? C.no : i === 1 ? C.nitrate : C.nitrite;
                return (
                    <motion.g key={c.id} {...fade(reduce, i * 0.15)}>
                        <rect x={sx(c.from)} y={60 + i * 46} width={sx(c.to) - sx(c.from)} height={34} rx={8} fill={col} fillOpacity={0.35} stroke={col} />
                        <SvgText x={sx(c.from) + 8} y={83 + i * 46} text={c.label} size={16} weight={700} color="#fff" />
                    </motion.g>
                );
            })}
            {step === 3 && (
                <motion.g {...fade(reduce, 0.5)}>
                    <rect x={sx(1.6)} y={sy(15.5)} width={sx(5) - sx(1.6)} height={BASE - sy(15.5)} fill={C.placebo} fillOpacity={0.16} />
                    <SvgText x={(sx(1.6) + sx(5)) / 2} y={BASE - 56} text="sem efeito" size={16} weight={600} anchor="middle" color={C.placebo} />
                    <SvgText x={(sx(1.6) + sx(5)) / 2} y={BASE - 36} text="1,6–5,0/dia" size={16} weight={500} anchor="middle" color={C.placebo} />
                </motion.g>
            )}
            {step !== 3 && step !== 4 && (
                <g>
                    <LegendDot x={X0 + 6} color={C.nitrate} text="tolerância (tempo até a falha)" on={step >= 1} />
                    <LegendDot x={X0 + 296} color={C.o2} text="custo de O₂ (redução)" on={step >= 2} />
                    <LegendDot x={X0 + 480} color={C.nitrite} text="nitrito" on dashed />
                </g>
            )}
            <motion.path key={`n${step}`} d={path(NITRITE)} fill="none" stroke={C.nitrite} strokeWidth={3} strokeDasharray="7 6" strokeLinecap="round" {...fade(reduce)} style={{ opacity: step === 3 ? 0.15 : 1 }} />
            {step >= 1 && (
                <motion.g {...fade(reduce)} animate={{ opacity: step === 3 ? 0.12 : 1 }}>
                    <path d={path(TOLERANCE)} fill="none" stroke={C.nitrate} strokeWidth={4} strokeLinejoin="round" />
                    {TOLERANCE.slice(1).map(([d, v]) => <circle key={d} cx={sx(d)} cy={sy(v)} r={7} fill={C.nitrate} stroke="#fff" strokeWidth={2} />)}
                    <SvgText x={sx(4.2)} y={sy(0) - 14} text="nada" size={18} weight={700} anchor="middle" color={C.nitrateSoft} />
                    <SvgText x={sx(8.4)} y={sy(14) - 14} text="+14%" size={22} weight={700} anchor="middle" color="#fff" />
                    <SvgText x={sx(16.8)} y={sy(12) - 14} text="+12%" size={22} weight={700} anchor="middle" color="#fff" />
                </motion.g>
            )}
            {step >= 2 && (
                <motion.g {...fade(reduce, 0.2)} animate={{ opacity: step === 3 ? 0.12 : 1 }}>
                    <path d={path(O2_COST)} fill="none" stroke={C.o2} strokeWidth={4} strokeLinejoin="round" />
                    {O2_COST.slice(2).map(([d, v]) => <circle key={d} cx={sx(d)} cy={sy(v)} r={7} fill={C.o2} stroke="#fff" strokeWidth={2} />)}
                    <SvgText x={sx(8.4)} y={sy(1.7) + 28} text="−1,7%" size={19} weight={700} anchor="middle" color={C.o2Soft} />
                    <SvgText x={sx(16.8)} y={sy(3) + 28} text="−3,0%" size={19} weight={700} anchor="middle" color={C.o2Soft} />
                </motion.g>
            )}
            {step === 4 && (
                <g>
                    <line x1={sx(dose)} x2={sx(dose)} y1={28} y2={BASE} stroke="#fff" strokeWidth={2} strokeDasharray="5 4" />
                    <circle cx={sx(dose)} cy={28} r={11} fill="#fff" stroke={C.nitrate} strokeWidth={4} />
                    <SvgText x={sx(dose) + (dose > 12 ? -20 : 20)} y={34} text={`${br(dose, 1)} mmol`} size={19} weight={700} anchor={dose > 12 ? 'end' : 'start'} color="#fff" />
                </g>
            )}
        </svg>
    );
};
