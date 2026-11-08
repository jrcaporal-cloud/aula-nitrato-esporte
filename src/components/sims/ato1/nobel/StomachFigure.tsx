import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../../kit/palette';

/** 1994: NO no ar expelido do estômago × boca × estômago com omeprazol (escala relativa; Lundberg 1994). */

const ROWS = [
    { label: 'ar exalado pela boca', width: 1, color: C.placebo, note: 'referência' },
    { label: 'ar expelido do estômago', width: 100, color: C.no, note: '800–6.000 ppb · mais de 100×' },
    { label: 'estômago com omeprazol', width: 5, color: C.noDeep, note: '−95%' },
] as const;

export const StomachFigure = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex h-full flex-col justify-center gap-5">
            <div className="flex items-center gap-3">
                {['Nature · Benjamin', 'Gut · Lundberg'].map(label => (
                    <span key={label} className="rounded-lg border border-white/25 bg-white/5 px-3 py-1.5 font-mono text-[16px] text-gray-200">{label}</span>
                ))}
                <span className="text-[16px] text-gray-400">mesmo ano</span>
            </div>

            <div className="flex flex-col gap-5">
                {ROWS.map((row, i) => (
                    <div key={row.label}>
                        <div className="flex items-baseline justify-between gap-3 leading-none">
                            <span className="text-[17px] text-gray-200">{row.label}</span>
                            <span className="text-[17px] font-bold" style={{ color: row.color === C.placebo ? C.muted : C.noSoft }}>{row.note}</span>
                        </div>
                        <div className="mt-2 h-5 rounded-full bg-white/10">
                            <motion.div className="h-full rounded-full" style={{ background: row.color, minWidth: 6 }}
                                initial={{ width: 0 }} animate={{ width: `${row.width}%` }}
                                transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.2 + i * 0.25, ease: 'easeOut' }} />
                        </div>
                    </div>
                ))}
            </div>

            <p className="font-mono text-[16px] text-gray-400">escala relativa: o ar da boca fica abaixo de 1% do estômago</p>
        </div>
    );
};
