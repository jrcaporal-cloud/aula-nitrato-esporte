import { motion, useReducedMotion } from 'framer-motion';
import { Kicker } from './ui';
import type { Range } from './cases';

/** Barra qualitativa: uma faixa plausível sobre uma escala de palavras (nunca um número). */

interface GaugeProps {
    title: string;
    zones: readonly string[];
    range: Range;
    color: string;
    delay?: number;
    compact?: boolean;
}

export const Gauge = ({ title, zones, range, color, delay = 0, compact = false }: GaugeProps) => {
    const reduce = useReducedMotion();
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-2">
                <Kicker>{title}</Kicker>
                <span className={`${compact ? 'text-[15px]' : 'text-[17px]'} font-semibold`} style={{ color }}>{range.words}</span>
            </div>
            <div className="relative h-3 rounded-full bg-white/10">
                {zones.slice(1).map((z, i) => <div key={z} className="absolute inset-y-0 w-px bg-white/25" style={{ left: `${((i + 1) / zones.length) * 100}%` }} />)}
                <motion.div className="absolute inset-y-0 origin-left rounded-full" style={{ left: `${range.lo * 100}%`, width: `${(range.hi - range.lo) * 100}%`, background: color, boxShadow: `0 0 12px ${color}88` }}
                    initial={reduce ? false : { scaleX: 0, opacity: 0.4 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} />
            </div>
            <div className="flex">
                {zones.map(z => <span key={z} className="flex-1 text-center text-[14px] leading-none text-gray-400">{z}</span>)}
            </div>
        </div>
    );
};
