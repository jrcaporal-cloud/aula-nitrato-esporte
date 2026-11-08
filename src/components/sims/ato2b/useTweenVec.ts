import { useEffect, useRef, useState } from 'react';

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Versão vetorial do `useTween` do kit: leva uma lista de números até os alvos, partindo de onde estiver.
 * Com `reduce`, chega de uma vez.
 */
export const useTweenVec = (target: readonly number[], reduce: boolean, ms = 700): number[] => {
    const key = target.join('|');
    const [value, setValue] = useState<number[]>(() => [...target]);
    const ref = useRef<number[]>([...target]);
    useEffect(() => {
        const to = key.split('|').map(Number);
        const from = ref.current.length === to.length ? [...ref.current] : to;
        const duration = reduce ? 0 : ms;
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
            const k = duration === 0 ? 1 : Math.min(Math.max((now - start) / duration, 0), 1);
            const next = to.map((t, i) => from[i] + (t - from[i]) * easeInOut(k));
            ref.current = next;
            setValue(next);
            if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [key, reduce, ms]);
    return value;
};
