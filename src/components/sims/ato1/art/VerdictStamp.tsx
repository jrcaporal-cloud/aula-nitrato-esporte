import { motion, useReducedMotion } from 'framer-motion';
import { Gavel } from 'lucide-react';

interface StampProps {
    label: string;
    color: string;
    /** Segundos até o martelo bater: a suspensão antes do veredito. */
    delay: number;
}

/**
 * O veredito como carimbo: antes do golpe só há uma marca tracejada com "?"; o martelo desce, o carimbo
 * pousa com onda de choque e o palco treme (o tremor e o clarão ficam no VerdictStage, no mesmo `delay`).
 */
export const VerdictStamp = ({ label, color, delay }: StampProps) => {
    const reduce = useReducedMotion() ?? false;
    const at = reduce ? 0 : delay;
    return (
        <div className="relative inline-flex">
            <motion.span aria-hidden className="absolute inset-0 flex items-center justify-center rounded-2xl border-[3px] border-dashed font-display text-[3rem] font-bold text-white/30"
                style={{ borderColor: 'rgba(255,255,255,0.25)' }}
                initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: at, duration: 0.12 }}>
                ?
            </motion.span>
            <motion.span aria-hidden className="absolute inset-0 rounded-2xl border-4"
                style={{ borderColor: color }}
                initial={{ opacity: 0, scale: 1 }} animate={{ opacity: [0, 0.9, 0], scale: [1, 1, 1.6] }} transition={{ delay: at, duration: reduce ? 0 : 0.8, times: [0, 0.01, 1], ease: 'easeOut' }} />
            <motion.p className="rounded-2xl border-[5px] px-6 py-1.5 font-display text-[3.9rem] font-bold uppercase leading-none tracking-wide"
                style={{ color, borderColor: color, background: `${color}18`, textShadow: `0 0 26px ${color}99` }}
                initial={{ scale: reduce ? 1 : 2.7, opacity: 0, rotate: reduce ? -4 : -16 }} animate={{ scale: 1, opacity: 1, rotate: -4 }}
                transition={{ delay: at, type: 'spring', stiffness: 640, damping: 21 }}>
                {label}
            </motion.p>
            {!reduce && (
                <motion.span aria-hidden className="absolute -right-10 -top-12 text-white/80" style={{ originX: 1, originY: 1 }}
                    initial={{ rotate: -55, opacity: 0, y: -10 }} animate={{ rotate: [-55, -55, 18, 0], opacity: [0, 1, 1, 0], y: [-10, -10, 4, 6] }}
                    transition={{ delay: Math.max(at - 0.35, 0), duration: 0.85, times: [0, 0.3, 0.55, 1] }}>
                    <Gavel size={46} />
                </motion.span>
            )}
        </div>
    );
};
