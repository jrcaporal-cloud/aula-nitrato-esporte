import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/** Atraso (s) entre as ordens do <Reveal> (0 arte · 1 número · 2 legenda). Ver kit/rhythm.tsx. */
export const REVEAL_GAP = 0.16;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export interface CountUpOptions {
    /** Valor de partida (padrão 0). Para "8,1 → 5,2" use from = valor anterior. */
    from?: number;
    ms?: number;
    /** Espera antes de começar (ms), para casar com a ordem do <Reveal>. */
    delayMs?: number;
}

/**
 * Número que sobe até `target` ao montar (ou quando `target` muda). Devolve o valor do quadro atual.
 * Use dentro de SVG assim: <SvgText text={br(useCountUp(8.1), 1)} …/>. Com movimento reduzido, chega de uma vez.
 */
export const useCountUp = (target: number, { from = 0, ms = 900, delayMs = 0 }: CountUpOptions = {}): number => {
    const reduce = useReducedMotion() ?? false;
    const [value, setValue] = useState(reduce ? target : from);
    const startRef = useRef(from);
    useEffect(() => {
        const origin = startRef.current;
        let raf = 0;
        const begin = performance.now() + (reduce ? 0 : delayMs);
        const tick = (now: number) => {
            if (now < begin) { raf = requestAnimationFrame(tick); return; }
            const k = reduce ? 1 : Math.min((now - begin) / ms, 1);
            const v = origin + (target - origin) * easeOut(k);
            setValue(v);
            if (k < 1) raf = requestAnimationFrame(tick);
            else startRef.current = target;
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target, ms, delayMs, reduce]);
    return value;
};

