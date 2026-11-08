import type { Clock } from '../clock';

/** Função de desenho de um gráfico do HUD: recebe o contexto já escalado, o tamanho em px CSS e o relógio. */
export type DrawFn = (ctx: CanvasRenderingContext2D, w: number, h: number, clock: Clock) => void;

export const FONT_FAMILY = 'Satoshi, system-ui, sans-serif';

interface TextOpts { size?: number; weight?: number; align?: CanvasTextAlign; base?: CanvasTextBaseline; alpha?: number }

/** Texto de gráfico (mínimo de 14 px). */
export const label = (ctx: CanvasRenderingContext2D, s: string, x: number, y: number, color: string, o: TextOpts = {}): void => {
    ctx.save();
    ctx.globalAlpha = o.alpha ?? 1;
    ctx.font = `${o.weight ?? 600} ${Math.max(o.size ?? 14, 14)}px ${FONT_FAMILY}`;
    ctx.textAlign = o.align ?? 'left';
    ctx.textBaseline = o.base ?? 'alphabetic';
    ctx.fillStyle = color;
    ctx.fillText(s, x, y);
    ctx.restore();
};

export const stroke = (ctx: CanvasRenderingContext2D, pts: readonly (readonly [number, number])[], color: string, width = 2, dash: number[] = [], alpha = 1): void => {
    if (pts.length < 2) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
    ctx.restore();
};

export const fillUnder = (ctx: CanvasRenderingContext2D, pts: readonly (readonly [number, number])[], baseY: number, color: string, alpha: number): void => {
    if (pts.length < 2) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], baseY);
    for (const p of pts) ctx.lineTo(p[0], p[1]);
    ctx.lineTo(pts[pts.length - 1][0], baseY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
};

export const dot = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, alpha = 1): void => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
};

export interface Box { x0: number; y0: number; x1: number; y1: number; w: number; h: number }
export const box = (x0: number, y0: number, x1: number, y1: number): Box => ({ x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 });

export const AXIS = 'rgba(255,255,255,0.28)';
