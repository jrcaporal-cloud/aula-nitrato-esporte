import { COL } from '../colors';
import { sweepHz, torque, type FreqPanel } from '../curves';
import { lerp } from '../../shared/math';
import { AXIS, box, dot, fillUnder, label, stroke, type DrawFn } from './common';

/* Relação torque × frequência: placebo tracejado, nitrato deslizando. Dois painéis lado a lado. */

export interface FreqConfig {
    panels: readonly FreqPanel[];
    scale: 'log' | 'linear';
    fMin: number;
    fMax: number;
    ticks: readonly number[];
    /** Mostra o cursor da varredura de frequência (humanos). */
    sweep: boolean;
}

export const makeFreqDraw = (cfg: FreqConfig): DrawFn => (ctx, w, h, clock) => {
    const gap = 22;
    const pw = (w - gap - 8) / cfg.panels.length;
    cfg.panels.forEach((panel, pi) => {
        const x0 = 4 + pi * (pw + gap);
        const b = box(x0 + 8, 52, x0 + pw - 6, h - 30);
        const U = (f: number) => (cfg.scale === 'log'
            ? Math.log(f / cfg.fMin) / Math.log(cfg.fMax / cfg.fMin)
            : (f - cfg.fMin) / (cfg.fMax - cfg.fMin));
        const X = (f: number) => b.x0 + U(f) * b.w;
        const Y = (v: number) => b.y1 - v * b.h * 0.94;
        const f50n = lerp(panel.f50.placebo, panel.f50.nitrate, clock.nit);
        const curve = (f50: number): [number, number][] => {
            const pts: [number, number][] = [];
            for (let i = 0; i <= 60; i++) {
                const f = cfg.scale === 'log' ? cfg.fMin * Math.pow(cfg.fMax / cfg.fMin, i / 60) : lerp(cfg.fMin, cfg.fMax, i / 60);
                pts.push([X(f), Y(torque(f, f50))]);
            }
            return pts;
        };
        const placebo = curve(panel.f50.placebo);
        const nitrate = curve(f50n);

        label(ctx, panel.title, x0 + 8, 18, '#F3F4F6', { size: 16, weight: 700 });
        label(ctx, panel.sub, x0 + 8, 38, COL.muted, { size: 14, weight: 500 });
        stroke(ctx, [[b.x0, b.y1], [b.x1, b.y1]], AXIS, 1);
        stroke(ctx, [[b.x0, Y(1)], [b.x1, Y(1)]], 'rgba(255,255,255,0.18)', 1, [3, 5]);
        cfg.ticks.forEach((f, ti) => {
            const lastTick = ti === cfg.ticks.length - 1;
            stroke(ctx, [[X(f), b.y1], [X(f), b.y1 + 5]], AXIS, 1);
            label(ctx, lastTick ? `${f} Hz` : String(f), lastTick ? X(f) + 2 : X(f), h - 8, COL.muted, { align: lastTick ? 'right' : 'center', size: 14, weight: 500 });
        });

        fillUnder(ctx, nitrate, b.y1, COL.nitrate, 0.08 * clock.nit);
        stroke(ctx, placebo, COL.placebo, 2, [6, 5], 0.95);
        stroke(ctx, nitrate, COL.nitrate, 2.8, [], 0.35 + 0.65 * clock.nit);

        // seta do desvio no meio da curva (50% do torque)
        const yMid = Y(0.5);
        const xp = X(panel.f50.placebo);
        const xn = X(f50n);
        if (Math.abs(xn - xp) > 6) {
            stroke(ctx, [[xp, yMid], [xn, yMid]], '#fff', 2);
            const dir = Math.sign(xn - xp);
            stroke(ctx, [[xn - dir * 7, yMid - 5], [xn, yMid], [xn - dir * 7, yMid + 5]], '#fff', 2);
        }

        if (cfg.sweep) {
            const f = sweepHz(clock.t);
            stroke(ctx, [[X(f), Y(1) - 4], [X(f), b.y1]], 'rgba(255,255,255,0.55)', 1.5);
            dot(ctx, X(f), Y(torque(f, panel.f50.placebo)), 4, COL.placebo);
            dot(ctx, X(f), Y(torque(f, f50n)), 5, COL.nitrate);
            if (pi === 0) label(ctx, `${f < 10 ? f.toFixed(1).replace('.', ',') : Math.round(f)} Hz`, X(f) + 6, Y(1) + 2, '#E5E7EB', { size: 14 });
        }
    });
};
