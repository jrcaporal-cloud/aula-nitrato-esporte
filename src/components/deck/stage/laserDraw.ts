/** Desenho da caneta laser em canvas 2D (sem React): traços que somem e pontos que pulsam. */

export interface LaserPoint { x: number; y: number }

export interface LaserMark {
    points: LaserPoint[];
    color: string;
    /** Instante (ms) em que o botão foi solto; null enquanto desenha. */
    releasedAt: number | null;
    /** Clique simples: vira um ponto pulsante em vez de traço. */
    dot: boolean;
}

/** O traço fica inteiro por HOLD_MS e se apaga em FADE_MS: some ~1,5 s depois de soltar. */
export const HOLD_MS = 1000;
export const FADE_MS = 500;
export const LIFE_MS = HOLD_MS + FADE_MS;
const PULSE_MS = 750;

export const markAlpha = (mark: LaserMark, now: number): number => {
    if (mark.releasedAt == null) return 1;
    const t = now - mark.releasedAt;
    if (t <= HOLD_MS) return 1;
    return Math.max(0, 1 - (t - HOLD_MS) / FADE_MS);
};

const tracePath = (ctx: CanvasRenderingContext2D, pts: LaserPoint[]) => {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    // Curva pelos pontos médios: traço liso mesmo com o mouse rápido.
    for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
    }
    const last = pts[pts.length - 1];
    ctx.lineTo(last.x, last.y);
};

const drawStroke = (ctx: CanvasRenderingContext2D, mark: LaserMark, alpha: number) => {
    const pts = mark.points;
    if (pts.length < 2) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    tracePath(ctx, pts);
    ctx.strokeStyle = mark.color;
    // Brilho em camadas (sem shadowBlur, que pesa em tela cheia).
    ctx.globalAlpha = alpha * 0.16;
    ctx.lineWidth = 16;
    ctx.stroke();
    ctx.globalAlpha = alpha * 0.45;
    ctx.lineWidth = 7;
    ctx.stroke();
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 3.2;
    ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.globalAlpha = alpha * 0.7;
    ctx.lineWidth = 1.2;
    ctx.stroke();
};

const drawDot = (ctx: CanvasRenderingContext2D, mark: LaserMark, alpha: number, now: number) => {
    const { x, y } = mark.points[0];
    const age = mark.releasedAt == null ? 0 : now - mark.releasedAt;
    const phase = (age % PULSE_MS) / PULSE_MS;
    ctx.fillStyle = mark.color;
    ctx.strokeStyle = mark.color;
    // Anel que se expande e some, repetindo.
    ctx.globalAlpha = alpha * (1 - phase) * 0.8;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 9 + phase * 26, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = alpha * 0.25;
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = alpha * 0.85;
    ctx.beginPath();
    ctx.arc(x, y, 2.6, 0, Math.PI * 2);
    ctx.fill();
};

/** Desenha todas as marcas vivas; devolve só as que ainda aparecem (as apagadas saem da lista). */
export const drawMarks = (ctx: CanvasRenderingContext2D, marks: LaserMark[], now: number): LaserMark[] => {
    const alive = marks.filter(m => markAlpha(m, now) > 0);
    for (const mark of alive) {
        const alpha = markAlpha(mark, now);
        if (mark.dot) drawDot(ctx, mark, alpha, now);
        else drawStroke(ctx, mark, alpha);
    }
    ctx.globalAlpha = 1;
    return alive;
};
