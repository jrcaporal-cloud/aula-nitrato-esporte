import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useStageTools } from './stageStore';

/** O holofote é macio: desenha em meia resolução (o navegador amplia) e só redesenha quando o mouse mexe. */
const SCALE = 0.5;
const DIM = 'rgba(4, 3, 8, 0.75)';
const RADIUS_MIN = 70;
const RADIUS_MAX = 520;

interface SpotState {
    pointerX: number;
    pointerY: number;
    centerX: number;
    centerY: number;
    radius: number;
}

const draw = (canvas: HTMLCanvasElement, s: SpotState, pinned: boolean) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width / SCALE;
    const h = canvas.height / SCALE;
    ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = DIM;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'destination-out';
    const g = ctx.createRadialGradient(s.centerX, s.centerY, 0, s.centerX, s.centerY, s.radius);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(0.72, 'rgba(0,0,0,1)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(s.centerX, s.centerY, s.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    if (!pinned) {
        // Ponto discreto no lugar do cursor: o professor sabe onde está o mouse.
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        ctx.arc(s.pointerX, s.pointerY, 4, 0, Math.PI * 2);
        ctx.fill();
    }
};

/**
 * Holofote (L): escurece ~75% da tela menos um círculo suave em volta do mouse.
 * Roda do mouse muda o raio; clique fixa/solta o círculo. Canvas 2D, sem estado React por quadro.
 */
export const SpotlightLayer = () => {
    const on = useStageTools(s => s.spotlight);
    const pinned = useStageTools(s => s.spotlightPinned);
    const penOn = useStageTools(s => s.pen);
    const reduce = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stateRef = useRef<SpotState>({ pointerX: 640, pointerY: 360, centerX: 640, centerY: 360, radius: 190 });

    // Posição do mouse sempre conhecida (barato): ao apertar L o círculo já nasce no lugar certo.
    useEffect(() => {
        const onMove = (e: PointerEvent) => {
            stateRef.current.pointerX = e.clientX;
            stateRef.current.pointerY = e.clientY;
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!on || !canvas) return;
        const s = stateRef.current;
        let raf = 0;
        const render = () => {
            raf = 0;
            if (!pinned) {
                s.centerX = s.pointerX;
                s.centerY = s.pointerY;
            }
            draw(canvas, s, pinned);
        };
        const schedule = () => { if (!raf) raf = requestAnimationFrame(render); };
        const resize = () => {
            canvas.width = Math.ceil(window.innerWidth * SCALE);
            canvas.height = Math.ceil(window.innerHeight * SCALE);
            render();
        };
        const onMove = () => { if (!pinned) schedule(); };
        // Fase de captura na janela: a roda vira "tamanho do holofote" e não troca de slide.
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();
            s.radius = Math.min(RADIUS_MAX, Math.max(RADIUS_MIN, s.radius * Math.exp(-e.deltaY * 0.0012)));
            schedule();
        };
        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('wheel', onWheel, { capture: true, passive: false });
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('wheel', onWheel, { capture: true });
        };
    }, [on, pinned]);

    const interactive = on && !penOn;
    return (
        <canvas
            ref={canvasRef}
            aria-hidden
            data-stage-tool="holofote"
            onClick={interactive ? () => useStageTools.getState().togglePinned() : undefined}
            className={`absolute inset-0 w-full h-full z-[25] ${interactive ? 'pointer-events-auto' : 'pointer-events-none'} ${pinned ? 'cursor-default' : 'cursor-none'}`}
            style={{ opacity: on ? 1 : 0, transition: reduce ? 'none' : 'opacity 200ms ease-out' }}
        />
    );
};
