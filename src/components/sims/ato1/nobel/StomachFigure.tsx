import { motion, useReducedMotion } from 'framer-motion';
import { REVEAL_GAP } from '../../kit/countUp';
import { C } from '../../kit/palette';
import { KeyFact, Reveal } from '../../kit/rhythm';
import { CountText } from '../countText';

/**
 * 1994: NO no ar expelido do estômago × boca × estômago com omeprazol (escala relativa; Lundberg 1994).
 * As barras crescem, os números sobem com elas (destaque no do estômago) e a nota de escala vem por último.
 */

const ROWS = [
    { label: 'ar exalado pela boca', width: 1, color: C.placebo, note: 'referência', key: false },
    { label: 'ar expelido do estômago', width: 100, color: C.no, note: '800–6.000 ppb · mais de 100×', key: true },
    { label: 'estômago com omeprazol', width: 5, color: C.noDeep, note: '−95%', key: false },
] as const;

const barDelay = (i: number) => 0.2 + i * 0.25;

/** O destaque fica só no "mais de 100×" (o trecho final da nota): o anel cabe dentro do painel. */
const Note = ({ row, i }: { row: (typeof ROWS)[number]; i: number }) => {
    const delayMs = (barDelay(i) + REVEAL_GAP) * 1000;
    if (!row.key) return <CountText text={row.note} delayMs={delayMs} />;
    const cut = row.note.lastIndexOf(' · ') + 3;
    return (
        <>
            <CountText text={row.note.slice(0, cut)} delayMs={delayMs} />
            <KeyFact color={C.no} delay={delayMs / 1000}><CountText text={row.note.slice(cut)} delayMs={delayMs} /></KeyFact>
        </>
    );
};

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
                            <span className="text-[17px] font-bold" style={{ color: row.color === C.placebo ? C.muted : C.noSoft }}><Note row={row} i={i} /></span>
                        </div>
                        <div className="mt-2 h-5 rounded-full bg-white/10">
                            <motion.div className="h-full rounded-full" style={{ background: row.color, minWidth: 6 }}
                                initial={{ width: 0 }} animate={{ width: `${row.width}%` }}
                                transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : barDelay(i), ease: 'easeOut' }} />
                        </div>
                    </div>
                ))}
            </div>

            <Reveal order={2} delay={0.7}><p className="font-mono text-[16px] text-gray-400">escala relativa: o ar da boca fica abaixo de 1% do estômago</p></Reveal>
        </div>
    );
};
