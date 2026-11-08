import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { REVEAL_GAP, useCountUp } from '../kit/countUp';

/**
 * Contador que parte de um TEXTO já formatado ("7,5 mmol", "1.335", "−4,4", "5 de 24", "17%") e
 * termina exatamente nele. Só os números sobem; vírgula decimal, ponto de milhar, sinal e unidade
 * ficam como estão. Usado pelos Atos V e VI (ritmo dos passos: arte → número → legenda).
 */

const TOKEN = /[−+-]?\d+(?:\.\d{3})*(?:,\d+)?/g;
/** Atraso padrão: o número entra na ordem 1 do <Reveal>. */
export const NUMBER_DELAY_MS = REVEAL_GAP * 1000;

interface Token { start: number; end: number; sign: string; value: number; decimals: number; grouped: boolean }

const parse = (text: string): Token[] => [...text.matchAll(TOKEN)].map(m => {
    const raw = m[0];
    const sign = /^[−+-]/.test(raw) ? raw[0] : '';
    const body = sign ? raw.slice(1) : raw;
    const [int, dec = ''] = body.split(',');
    return { start: m.index ?? 0, end: (m.index ?? 0) + raw.length, sign, value: Number(`${int.replace(/\./g, '')}.${dec || '0'}`), decimals: dec.length, grouped: int.includes('.') };
});

const format = (t: Token, v: number): string => {
    const [int, dec] = v.toFixed(t.decimals).split('.');
    const intShown = t.grouped ? int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : int;
    return `${t.sign}${intShown}${dec ? `,${dec}` : ''}`;
};

/** Texto do quadro: com p = 1 devolve o texto original, sem nenhuma reformatação. */
const frame = (text: string, tokens: Token[], p: number, all: boolean): string => {
    if (p >= 1) return text;
    let out = '';
    let cursor = 0;
    tokens.forEach((t, i) => {
        out += text.slice(cursor, t.start);
        out += all || i === 0 ? format(t, t.value * p) : text.slice(t.start, t.end);
        cursor = t.end;
    });
    return out + text.slice(cursor);
};

export interface CountTextOptions {
    /** Espera antes de subir (ms). Padrão: a ordem 1 do <Reveal>. */
    delayMs?: number;
    ms?: number;
    /** Sobe todos os números do texto ("2 a 3,5"); padrão: só o primeiro ("5 de 24"). */
    all?: boolean;
}

const useCountTextInner = (text: string, { delayMs = NUMBER_DELAY_MS, ms = 900, all = false }: CountTextOptions): string => {
    const p = useCountUp(1, { from: 0, delayMs, ms });
    return frame(text, parse(text), p, all);
};

interface BareProps extends CountTextOptions { text: string }

const BareInner = ({ text, ...opts }: BareProps) => <>{useCountTextInner(text, opts)}</>;

/** Só o texto que sobe (sem caixa): serve dentro de <text> do SVG e em qualquer HTML. Reinicia quando o texto muda. */
export const Count = (props: BareProps) => <BareInner key={props.text} {...props} />;

interface CountTextProps extends BareProps {
    className?: string;
    style?: CSSProperties;
}

/**
 * Contador em HTML que já reserva a largura do texto final (nada ao lado pula enquanto sobe).
 * Respeita o alinhamento do pai (esquerda, centro ou direita).
 */
export const CountText = ({ text, className, style, ...opts }: CountTextProps) => (
    <span className={`inline-grid ${className ?? ''}`} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>
        <span aria-hidden style={{ gridArea: '1 / 1', visibility: 'hidden' }}>{text}</span>
        <span style={{ gridArea: '1 / 1' }}><Count text={text} {...opts} /></span>
    </span>
);

interface SvgKeyFactProps {
    color: string;
    delay?: number;
    children: ReactNode;
}

/**
 * Equivalente SVG do <KeyFact> do kit (que é HTML): pulso curto de escala e um brilho que some.
 * Anima só transform e filter (nada de atributo geométrico). 1 por passo, no dado onde o professor bate.
 */
export const SvgKeyFact = ({ color, delay = REVEAL_GAP, children }: SvgKeyFactProps) => {
    const reduce = useReducedMotion() ?? false;
    if (reduce) return <g>{children}</g>;
    return (
        <motion.g style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ scale: 0.92, filter: `drop-shadow(0 0 0px ${color})` }}
            animate={{ scale: [0.92, 1.08, 1], filter: [`drop-shadow(0 0 0px ${color})`, `drop-shadow(0 0 14px ${color})`, `drop-shadow(0 0 0px ${color})`] }}
            transition={{ duration: 0.9, delay, times: [0, 0.4, 1], ease: 'easeOut' }}>
            {children}
        </motion.g>
    );
};
