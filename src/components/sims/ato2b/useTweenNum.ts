import { useEffect, useRef, useState } from 'react';

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Igual ao `useTween` do kit, mas com o tempo preso em [0, 1]: o primeiro quadro do rAF pode vir
 * um pouco antes do `performance.now()` do efeito e gerar valor levemente negativo (altura de <rect> < 0).
 */
export const useTweenNum = (target: number, reduce: boolean, ms = 700): number => {
    const [value, setValue] = useState(target);
    const ref = useRef(target);
    useEffect(() => {
        const from = ref.current;
        const duration = reduce ? 0 : ms;
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
            const k = duration === 0 ? 1 : Math.min(Math.max((now - start) / duration, 0), 1);
            const v = from + (target - from) * easeInOut(k);
            ref.current = v;
            setValue(v);
            if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target, reduce, ms]);
    return value;
};
