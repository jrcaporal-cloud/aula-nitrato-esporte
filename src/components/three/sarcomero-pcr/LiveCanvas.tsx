import { useEffect, useRef } from 'react';
import type { ClockRef } from './clock';
import type { DrawFn } from './draw/common';

/* Canvas 2D redesenhado por quadro com o relógio do modelo (sem estado do React por quadro). */

interface Props { clockRef: ClockRef; draw: DrawFn; label: string }

export const LiveCanvas = ({ clockRef, draw, label }: Props) => {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const cv = ref.current;
        const ctx = cv?.getContext('2d');
        if (!cv || !ctx) return;
        let raf = 0;
        let w = 0;
        let h = 0;
        let dpr = 1;
        const fit = () => {
            const r = cv.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = r.width;
            h = r.height;
            cv.width = Math.max(Math.round(w * dpr), 1);
            cv.height = Math.max(Math.round(h * dpr), 1);
        };
        const ro = new ResizeObserver(fit);
        ro.observe(cv);
        fit();
        const frame = () => {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);
            draw(ctx, w, h, clockRef.current);
            raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
        return () => { cancelAnimationFrame(raf); ro.disconnect(); };
    }, [clockRef, draw]);

    return <canvas ref={ref} role="img" aria-label={label} className="block w-full h-full" />;
};
