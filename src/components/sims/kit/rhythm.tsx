import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { REVEAL_GAP, useCountUp, type CountUpOptions } from './countUp';
import { br } from './format';
import { C } from './palette';

/**
 * Ritmo dos passos: o que entra num passo aparece em ordem (arte → número → legenda),
 * o número-chave sobe como contador e ganha um destaque curto onde o professor "bate".
 *
 * Ordem padrão (use `order`):  0 = arte · 1 = número · 2 = legenda/fonte.
 * Cada `order` atrasa REVEAL_GAP segundos. Para reiniciar a sequência a cada passo,
 * dê `key={step}` ao bloco que contém os <Reveal>.
 */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface RevealProps {
    order?: number;
    /** Atraso extra (s), somado ao da ordem. */
    delay?: number;
    className?: string;
    style?: CSSProperties;
    children: ReactNode;
}

/** Entrada escalonada (opacidade + subida curta + desfoque). Sem `exit`: troca rápida de passo não prende texto velho. */
export const Reveal = ({ order = 0, delay = 0, className, style, children }: RevealProps) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.div className={className} style={style}
            initial={reduce ? false : { opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, delay: delay + order * REVEAL_GAP, ease: EASE }}>
            {children}
        </motion.div>
    );
};

interface CountUpProps extends CountUpOptions {
    value: number;
    /** Casas decimais (vírgula decimal). */
    decimals?: number;
    /** Formatação própria (ex.: signed, pct). Recebe o valor do quadro. */
    format?: (n: number) => string;
    prefix?: string;
    suffix?: string;
    className?: string;
    style?: CSSProperties;
}

/** Contador em HTML. O texto final é idêntico ao número do dossiê (o contador só anima o caminho). */
export const CountUp = ({ value, decimals = 0, format, prefix = '', suffix = '', className, style, ...opts }: CountUpProps) => {
    const v = useCountUp(value, opts);
    const text = format ? format(v) : br(v, decimals);
    return <span className={className} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>{prefix}{text}{suffix}</span>;
};

interface KeyFactProps {
    /** Cor do brilho (a cor da molécula/ideia: C.no, C.nitrate, C.risk…). */
    color?: string;
    /** Atraso (s) do destaque — normalmente o mesmo do <Reveal order={1}>. */
    delay?: number;
    className?: string;
    children: ReactNode;
}

/**
 * Destaque do dado-chave do passo: um pulso curto de escala e um anel de brilho que se abre e some.
 * Use em 1 elemento por passo, no máximo — é o ponto onde o professor bate.
 */
export const KeyFact = ({ color = C.no, delay = REVEAL_GAP, className = '', children }: KeyFactProps) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <motion.span className={`relative inline-block ${className}`}
            initial={reduce ? false : { scale: 0.92 }}
            animate={reduce ? undefined : { scale: [0.92, 1.08, 1] }}
            transition={{ duration: 0.7, delay, times: [0, 0.45, 1], ease: EASE }}>
            {!reduce && (
                <motion.span aria-hidden className="pointer-events-none absolute -inset-2 rounded-xl"
                    style={{ boxShadow: `0 0 0 2px ${color}, 0 0 36px 6px ${color}88` }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: [0, 0.9, 0], scale: [0.9, 1.04, 1.18] }}
                    transition={{ duration: 1.1, delay: delay + 0.15, ease: 'easeOut' }} />
            )}
            <span className="relative">{children}</span>
        </motion.span>
    );
};
