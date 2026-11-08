import { useEffect, useRef } from 'react';
import { useStageTools, penHex } from './stageStore';
import { drawMarks, type LaserMark } from './laserDraw';

const MAX_DPR = 2;
/** Andou menos que isto entre apertar e soltar: é um clique (ponto laser), não um traço. */
const CLICK_SLOP_PX = 6;

interface PenLayerProps {
    /** Slide atual: trocar de slide apaga as marcas na hora. */
    index: number;
}

/**
 * Caneta laser (K): arrastar desenha um traço brilhante que some ~1,5 s depois de soltar;
 * clique simples faz um ponto pulsante. O laço de quadros só roda enquanto há marca na tela.
 * Desligada, a camada não recebe cliques (pointer-events: none).
 */
export const LaserPenLayer = ({ index }: PenLayerProps) => {
    const on = useStageTools(s => s.pen);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const marksRef = useRef<LaserMark[]>([]);
    const activeRef = useRef<LaserMark | null>(null);
    const rafRef = useRef(0);
    const kickRef = useRef<() => void>(() => undefined);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        let dpr = 1;
        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
            canvas.width = Math.ceil(window.innerWidth * dpr);
            canvas.height = Math.ceil(window.innerHeight * dpr);
            kickRef.current();
        };
        const frame = () => {
            rafRef.current = 0;
            const now = performance.now();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            marksRef.current = drawMarks(ctx, marksRef.current, now);
            if (marksRef.current.length) rafRef.current = requestAnimationFrame(frame);
        };
        kickRef.current = () => { if (!rafRef.current) rafRef.current = requestAnimationFrame(frame); };
        resize();
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
        };
    }, []);

    // Slide novo, quadro limpo.
    useEffect(() => {
        marksRef.current = [];
        activeRef.current = null;
        kickRef.current();
    }, [index]);

    const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        const mark: LaserMark = {
            points: [{ x: e.clientX, y: e.clientY }],
            color: penHex(useStageTools.getState().penColor),
            releasedAt: null,
            dot: true,
        };
        activeRef.current = mark;
        marksRef.current = [...marksRef.current, mark];
        kickRef.current();
    };

    const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const mark = activeRef.current;
        if (!mark) return;
        const last = mark.points[mark.points.length - 1];
        const first = mark.points[0];
        if (Math.hypot(e.clientX - last.x, e.clientY - last.y) < 1.5) return;
        mark.points.push({ x: e.clientX, y: e.clientY });
        if (mark.dot && Math.hypot(e.clientX - first.x, e.clientY - first.y) > CLICK_SLOP_PX) mark.dot = false;
    };

    const finish = () => {
        const mark = activeRef.current;
        if (!mark) return;
        mark.releasedAt = performance.now();
        activeRef.current = null;
        kickRef.current();
    };

    return (
        <canvas
            ref={canvasRef}
            aria-hidden
            data-stage-tool="caneta"
            onPointerDown={on ? onPointerDown : undefined}
            onPointerMove={on ? onPointerMove : undefined}
            onPointerUp={finish}
            onPointerCancel={finish}
            className={`absolute inset-0 w-full h-full z-[26] touch-none ${on ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'}`}
        />
    );
};
