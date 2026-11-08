import { motion, useReducedMotion } from 'framer-motion';
import { REVEAL_GAP } from '../kit/countUp';
import { SvgText } from '../kit/ui';
import { useCountText } from '../ato1/countFrame';

/** Ritmo dentro de SVG (Ato II-a): número que conta até o texto de hoje e o destaque curto do dado-chave (o KeyFact do kit é HTML). */

type Anchor = 'start' | 'middle' | 'end';

interface SvgCountProps {
    x: number;
    y: number;
    text: string;
    size: number;
    color: string;
    anchor?: Anchor;
    weight?: number;
    /** Espera (ms) antes de contar; padrão = ordem 1 do ritmo (número). */
    delayMs?: number;
}

/** SvgText cujo número sobe de 0 até o valor (o texto final é idêntico). */
export const SvgCount = ({ delayMs = REVEAL_GAP * 1000, ...rest }: SvgCountProps) => (
    <SvgText {...rest} text={useCountText(rest.text, { delayMs })} />
);

interface SvgPulseProps { x: number; y: number; w: number; h: number; color: string; delay?: number }

/** Anel de brilho que se abre e some sobre o dado-chave (opacidade + escala; nada de atributo geométrico animado). */
export const SvgPulse = ({ x, y, w, h, color, delay = REVEAL_GAP }: SvgPulseProps) => {
    const reduce = useReducedMotion() ?? false;
    if (reduce) return null;
    return (
        <motion.rect x={x} y={y} width={w} height={h} rx={h / 2} fill="none" stroke={color} strokeWidth={2.5}
            style={{ filter: `drop-shadow(0 0 10px ${color})`, transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: [0, 0.9, 0], scale: [0.9, 1.04, 1.16] }}
            transition={{ duration: 1.1, delay: delay + 0.15, ease: 'easeOut' }} pointerEvents="none" />
    );
};
