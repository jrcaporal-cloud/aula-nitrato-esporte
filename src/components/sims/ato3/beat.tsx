import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { REVEAL_GAP } from '../kit/countUp';
import { SvgText } from '../kit/ui';
import { NUMBER_DELAY_MS, useCountText, type CountTextOptions } from './countText';

/**
 * Ritmo dos passos dos Atos III e IV, sobre o kit (kit/rhythm.tsx e kit/countUp.ts):
 * - contador que parte de um TEXTO já formatado ("−3,2%", "12 / 12", "1.704 m", "d 0,02") e termina
 *   exatamente nele (o contador só anima o caminho; o último quadro devolve o texto original);
 * - versões SVG do <Reveal> e do <KeyFact> (o kit só tem HTML).
 * Ordem: 0 arte · 1 número · 2 legenda. Cada ordem atrasa REVEAL_GAP.
 */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
interface CountProps extends CountTextOptions {
    text: string;
    className?: string;
    style?: CSSProperties;
}

/** Contador em HTML a partir de um texto formatado. */
export const CountText = ({ text, className, style, ...opts }: CountProps) => {
    const shown = useCountText(text, opts);
    return <span className={className} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>{shown}</span>;
};

type SvgTextProps = Parameters<typeof SvgText>[0];

/** Contador em SVG: mesmo desenho do SvgText, com o número subindo. Fica invisível até o contador partir (não mostra "0"). */
export const SvgCount = ({ text, count, ...rest }: SvgTextProps & { count?: CountTextOptions }) => {
    const reduce = useReducedMotion() ?? false;
    const shown = useCountText(text, count);
    const at = (count?.delayMs ?? NUMBER_DELAY_MS) / 1000;
    return (
        <motion.g initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: at }}>
            <SvgText {...rest} text={shown} />
        </motion.g>
    );
};

/** <Reveal> do kit, para dentro de SVG (opacidade + subida curta, sem desfoque). */
export const SvgReveal = ({ order = 0, delay = 0, children }: { order?: number; delay?: number; children: ReactNode }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.g initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: delay + order * REVEAL_GAP, ease: EASE }}>
            {children}
        </motion.g>
    );
};

/** <KeyFact> do kit, para dentro de SVG: pulso curto de escala e um brilho na cor da ideia, que some. */
export const SvgKeyFact = ({ color, delay = REVEAL_GAP, children }: { color: string; delay?: number; children: ReactNode }) => {
    const reduce = useReducedMotion() ?? false;
    if (reduce) return <g>{children}</g>;
    const glow = (r: number, a: string) => `drop-shadow(0px 0px ${r}px ${color}${a})`;
    return (
        <motion.g style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ scale: 0.92, filter: glow(0, '00') }}
            animate={{ scale: [0.92, 1.08, 1], filter: [glow(0, '00'), glow(14, 'ee'), glow(0, '00')] }}
            transition={{
                scale: { duration: 0.7, delay, times: [0, 0.45, 1], ease: EASE },
                filter: { duration: 1.1, delay: delay + 0.15, times: [0, 0.35, 1], ease: 'easeOut' },
            }}>
            {children}
        </motion.g>
    );
};
