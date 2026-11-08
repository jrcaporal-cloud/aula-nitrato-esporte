import { REVEAL_GAP, useCountUp } from '../kit/countUp';

/**
 * Contador a partir de um TEXTO já formatado ("−3,2%", "12 / 12", "1.704 m", "d 0,02"): anima só o primeiro
 * número e, no último quadro, devolve o texto original, idêntico. Peças visuais em ./beat.tsx.
 */

/** Atraso (ms) do contador: o número entra na ordem 1. */
export const NUMBER_DELAY_MS = REVEAL_GAP * 1000;

export interface NumParts { pre: string; value: number; decimals: number; grouped: boolean; post: string }

/** Primeiro número "solto" (não colado a letra: "IR1" não conta) a partir de `from` no texto. */
const NUM = /(?<![\p{L}\d.,])(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d+)?/u;

export const splitNumber = (text: string, from = 0): NumParts | null => {
    const m = NUM.exec(text.slice(from));
    if (!m) return null;
    const token = m[0];
    const [int, dec = ''] = token.split(',');
    const at = from + m.index;
    return {
        pre: text.slice(0, at),
        value: Number(`${int.replace(/\./g, '')}.${dec || '0'}`),
        decimals: dec.length,
        grouped: int.includes('.'),
        post: text.slice(at + token.length),
    };
};

export const formatLike = (v: number, decimals: number, grouped: boolean): string => {
    const [int, dec] = v.toFixed(decimals).split('.');
    const i = grouped ? int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : int;
    return dec ? `${i},${dec}` : i;
};

export interface CountTextOptions {
    /** Atraso (ms) antes de começar (padrão: ordem 1). */
    delayMs?: number;
    ms?: number;
    /** Valor de partida (padrão 0). */
    from?: number;
    /** Só procura o número depois deste trecho do texto (ex.: ": "). */
    after?: string;
}

/** Texto com o número subindo; no fim, devolve `text` idêntico. Sem número no texto, devolve o texto. */
export const useCountText = (text: string, { delayMs = NUMBER_DELAY_MS, ms, from = 0, after }: CountTextOptions = {}): string => {
    const start = after ? Math.max(text.lastIndexOf(after), 0) : 0;
    const parts = splitNumber(text, start);
    const target = parts?.value ?? 0;
    const v = useCountUp(target, { from, ms, delayMs });
    if (!parts || Math.abs(v - target) < 1e-9) return text;
    return `${parts.pre}${formatLike(v, parts.decimals, parts.grouped)}${parts.post}`;
};

