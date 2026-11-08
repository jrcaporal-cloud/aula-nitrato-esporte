import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { REVEAL_GAP } from '../kit/countUp';

/**
 * Entrada em ordem dentro de SVG (Placebo, Cego, Cruzado, Ruído, Poder): 0 = arte · 1 = número · 2 = legenda.
 * Só opacidade e transform (nunca atributo geométrico). `at` substitui a ordem por um atraso absoluto (s).
 */
interface OrdProps {
    order?: number;
    /** Atraso absoluto (s), quando o número precisa casar com uma animação da arte. */
    at?: number;
    children: ReactNode;
}

export const Ord = ({ order = 1, at, children }: OrdProps) => {
    const reduce = useReducedMotion() ?? false;
    if (reduce) return <g>{children}</g>;
    return (
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: at ?? order * REVEAL_GAP, ease: [0.16, 1, 0.3, 1] }}>
            {children}
        </motion.g>
    );
};
