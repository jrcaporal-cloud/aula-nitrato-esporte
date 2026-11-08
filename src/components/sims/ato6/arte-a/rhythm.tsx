import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { REVEAL_GAP } from '../../kit/countUp';
import { Count, NUMBER_DELAY_MS } from '../../ato5/countText';

/**
 * Ritmo dentro do SVG das artes dos slides 44–48: o que é novo no passo entra em ordem
 * (0 arte · 1 número · 2 legenda). Só opacidade (nunca atributo geométrico).
 */

interface SvgRevealProps {
    order?: number;
    /** Atraso extra (s), somado ao da ordem. */
    delay?: number;
    children: ReactNode;
}

export const SvgReveal = ({ order = 0, delay = 0, children }: SvgRevealProps) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.g initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: delay + order * REVEAL_GAP, ease: [0.16, 1, 0.3, 1] }}>
            {children}
        </motion.g>
    );
};

interface SvgCountProps {
    x: number;
    y: number;
    text: string;
    color?: string;
    size?: number;
    anchor?: 'start' | 'middle' | 'end';
    weight?: number;
    /** Espera (ms) antes de subir; padrão: ordem 1. */
    delayMs?: number;
    /** Sobe todos os números do texto ("5 a 16 mmol"). */
    all?: boolean;
}

/** Igual ao SvgText do kit (mesmo contorno), mas o número sobe até o texto exato. */
export const SvgCount = ({ x, y, text, color = '#E5E7EB', size = 16, anchor = 'start', weight = 600, delayMs = NUMBER_DELAY_MS, all = false }: SvgCountProps) => (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={color}
        style={{ fontFamily: 'var(--font-body)', paintOrder: 'stroke', stroke: '#07050B', strokeWidth: 4, strokeLinejoin: 'round' }}>
        <Count text={text} delayMs={delayMs} all={all} />
    </text>
);
