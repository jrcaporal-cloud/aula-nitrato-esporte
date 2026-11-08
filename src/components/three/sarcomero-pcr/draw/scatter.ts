import { COL } from '../colors';
import { DATA } from '../content';
import { pearson } from '../curves';
import { GASTRO, MUSCLES, SOLEUS } from '../limb';
import { C } from '../../../sims/kit/palette';
import { br } from '../../../sims/kit/format';
import { AXIS, box, dot, label, stroke, type DrawFn } from './common';

/* Ganho de fluxo × % de fibras IIb + d/x nos 28 músculos (pontos ilustrativos, r fixado em 0,74). */

const XS = MUSCLES.map(m => m.pct);
const YS = MUSCLES.map(m => m.gain);
const R = pearson(XS, YS);
const mean = (v: readonly number[]) => v.reduce((a, b) => a + b, 0) / v.length;
const SLOPE = R * Math.sqrt(YS.reduce((a, y) => a + (y - mean(YS)) ** 2, 0) / XS.reduce((a, x) => a + (x - mean(XS)) ** 2, 0));
const INTERCEPT = mean(YS) - SLOPE * mean(XS);

export const drawScatter: DrawFn = (ctx, w, h, clock) => {
    const b = box(34, 14, w - 16, h - 34);
    const X = (pct: number) => b.x0 + (pct / 100) * b.w;
    const Y = (g: number) => b.y1 - g * b.h * 0.95;
    stroke(ctx, [[b.x0, b.y0], [b.x0, b.y1], [b.x1, b.y1]], AXIS, 1);
    [0, 50, 100].forEach(p => label(ctx, String(p), X(p), h - 8, COL.muted, { align: 'center', size: 14, weight: 500 }));
    label(ctx, '% de fibras IIb + d/x', X(26), h - 8, COL.muted, { align: 'center', size: 14, weight: 500 });
    label(ctx, 'Δ fluxo', b.x0 + 6, b.y0 + 12, COL.muted, { size: 14, weight: 500 });

    const reveal = Math.min(clock.t / 2.4, 1);
    const alphaLine = clock.nit * reveal;
    stroke(ctx, [[X(5), Y(INTERCEPT + SLOPE * 5)], [X(95), Y(INTERCEPT + SLOPE * 95)]], C.no, 2.5, [], alphaLine);
    MUSCLES.forEach((m, i) => {
        const a = Math.min(Math.max((reveal * 28 - i) / 3, 0), 1) * clock.nit;
        const special = m === GASTRO || m === SOLEUS;
        dot(ctx, X(m.pct), Y(m.gain), special ? 6.5 : 4.5, special ? C.o2 : '#E5E7EB', 0.15 + 0.85 * a);
    });
    label(ctx, `r = ${br(DATA.limb.r, 2)}`, X(52), Y(INTERCEPT + SLOPE * 52) - 52, C.no, { size: 18, weight: 800, alpha: alphaLine });
    label(ctx, 'gastrocnêmio', X(GASTRO.pct) - 8, Y(GASTRO.gain) - 12, C.o2Soft, { align: 'right', size: 14, alpha: clock.nit });
    label(ctx, 'sóleo', X(SOLEUS.pct) + 10, Y(SOLEUS.gain) + 18, C.o2Soft, { size: 14, alpha: clock.nit });
};
