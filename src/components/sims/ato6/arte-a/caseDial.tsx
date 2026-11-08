import { motion, useReducedMotion } from 'framer-motion';
import { SvgText } from '../../kit/ui';
import type { CaseVerdict, Range } from '../cases';
import { Kicker } from '../ui';
import { SEAL } from './artData';

/** Medidores do slide 47: mostrador em meia-lua (caso aberto), barra grossa (quadro) e o selo do veredito. Faixa plausível, nunca número. */

const DW = 146;
const CX = DW / 2;
const CY = 86;
const R = 62;
const pt = (v: number): string => {
    const a = Math.PI + v * Math.PI;
    return `${(CX + R * Math.cos(a)).toFixed(1)},${(CY + R * Math.sin(a)).toFixed(1)}`;
};
const arc = (lo: number, hi: number): string => `M${pt(lo)} A${R},${R} 0 0 1 ${pt(hi)}`;

interface DialProps {
    title: string;
    zones: readonly string[];
    range: Range;
    color: string;
    delay?: number;
}

export const Dial = ({ title, zones, range, color, delay = 0 }: DialProps) => {
    const reduce = useReducedMotion();
    const mid = (range.lo + range.hi) / 2;
    return (
        <div className="flex flex-col items-center gap-1">
            <Kicker>{title}</Kicker>
            <svg viewBox={`0 0 ${DW} 114`} width={DW} height={114} aria-hidden>
                <path d={arc(0, 1)} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={18} strokeLinecap="round" />
                {zones.slice(1).map((z, i) => {
                    const v = (i + 1) / zones.length;
                    const a = Math.PI + v * Math.PI;
                    return <line key={z} x1={CX + (R - 13) * Math.cos(a)} y1={CY + (R - 13) * Math.sin(a)} x2={CX + (R + 13) * Math.cos(a)} y2={CY + (R + 13) * Math.sin(a)} stroke="#07050B" strokeWidth={3} />;
                })}
                <motion.path d={arc(range.lo, range.hi)} fill="none" stroke={color} strokeWidth={20} strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 6px ${color})` }}
                    initial={reduce ? false : { pathLength: 0, opacity: 0.3 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
                <motion.g initial={reduce ? false : { rotate: -90 }} animate={{ rotate: -90 + 180 * mid }} transition={{ delay, duration: 1.1, ease: [0.34, 1.3, 0.5, 1] }}>
                    <circle cx={CX} cy={CY} r={R - 18} fill="none" />
                    <path d={`M${CX - 4},${CY} L${CX},${CY - R + 20} L${CX + 4},${CY}Z`} fill="#fff" />
                </motion.g>
                <circle cx={CX} cy={CY} r={7} fill="#fff" stroke="#07050B" strokeWidth={2} />
                <SvgText x={0} y={110} text={zones[0]} size={16} color="#9CA3AF" weight={500} />
                <SvgText x={DW} y={110} text={zones[zones.length - 1]} anchor="end" size={16} color="#9CA3AF" weight={500} />
            </svg>
            <p className="m-0 text-center text-[18px] font-semibold leading-tight" style={{ color }}>{range.words}</p>
        </div>
    );
};

export const Meter = ({ title, range, color, delay = 0 }: { title: string; range: Range; color: string; delay?: number }) => {
    const reduce = useReducedMotion();
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-2">
                <Kicker>{title}</Kicker>
                <span className="text-right text-[15px] font-semibold leading-tight" style={{ color }}>{range.words}</span>
            </div>
            <div className="relative h-[14px] rounded-full bg-white/10">
                <motion.div className="absolute inset-y-0 origin-left rounded-full" style={{ left: `${range.lo * 100}%`, width: `${(range.hi - range.lo) * 100}%`, background: color, boxShadow: `0 0 12px ${color}aa` }}
                    initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} />
            </div>
        </div>
    );
};


export const Seal = ({ c, size = 116, delay = 0.9 }: { c: CaseVerdict; size?: number; delay?: number }) => {
    const reduce = useReducedMotion();
    const [a, b] = SEAL[c.id];
    return (
        <motion.svg viewBox="0 0 120 120" width={size} height={size} aria-label={`${a} ${b}`} role="img"
            initial={reduce ? false : { opacity: 0, scale: 1.6, rotate: -30 }} animate={{ opacity: 1, scale: 1, rotate: -12 }} transition={{ delay, duration: 0.45, ease: [0.34, 1.5, 0.5, 1] }}>
            <circle cx={60} cy={60} r={56} fill={`${c.color}22`} stroke={c.color} strokeWidth={3} />
            <circle cx={60} cy={60} r={48} fill="none" stroke={c.color} strokeWidth={1.5} strokeDasharray="4 4" />
            <SvgText x={60} y={57} text={a} anchor="middle" size={16} color="#fff" weight={800} />
            <SvgText x={60} y={77} text={b} anchor="middle" size={16} color="#fff" weight={800} />
        </motion.svg>
    );
};
