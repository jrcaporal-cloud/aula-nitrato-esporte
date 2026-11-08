import { br } from '../../../sims/kit/format';
import { COL } from '../colors';
import { PEAKS, PCR_REF_MM, spectrumAt } from '../curves';
import { dpcrAt, LOW } from '../kinetics';
import { AXIS, box, fillUnder, label, stroke, type DrawFn } from './common';

/* Espectro de ³¹P ao vivo: Pi, PCr e os três picos de ATP. Placebo (ardósia) e nitrato (magenta) sobrepostos. */

const STEPS_PX = 3;
const phaseName = (t: number): string => (t < LOW.rest ? 'repouso' : t < LOW.hold ? 'contração' : 'recuperação');

export const drawSpectrum: DrawFn = (ctx, w, h, clock) => {
    const b = box(14, 40, w - 14, h - 30);
    const yMax = 1.18;
    const X = (u: number) => b.x0 + u * b.w;
    const Y = (v: number) => b.y1 - (v / yMax) * b.h;
    const t = clock.t;
    const dp = dpcrAt('placebo', t);
    const dn = dpcrAt('nitrate', t);

    stroke(ctx, [[b.x0, b.y1], [b.x1, b.y1]], AXIS, 1);
    // PCr em repouso (referência) e a distância Pi–PCr, que marca o pH
    stroke(ctx, [[X(0.31) - 46, Y(1)], [X(0.31) + 46, Y(1)]], 'rgba(255,255,255,0.4)', 1, [4, 4]);
    label(ctx, 'repouso', X(0.31) - 50, Y(1) + 5, COL.muted, { align: 'right', size: 14, weight: 500 });
    stroke(ctx, [[X(0.115), 18], [X(0.31), 18]], COL.pi, 1.5);
    stroke(ctx, [[X(0.115), 13], [X(0.115), 23]], COL.pi, 1.5);
    stroke(ctx, [[X(0.31), 13], [X(0.31), 23]], COL.pi, 1.5);
    label(ctx, 'Pi ↔ PCr igual: pH igual', X(0.115) + 4, 38, COL.pi, { size: 14 });

    const traces: readonly [number, string, number][] = [[dp, COL.placebo, clock.dimP], [dn, COL.nitrate, clock.dimN]];
    for (const [d, color, alpha] of traces) {
        const pts: [number, number][] = [];
        for (let px = 0; px <= b.w; px += STEPS_PX) pts.push([b.x0 + px, Y(spectrumAt(PEAKS, px / b.w, d))]);
        fillUnder(ctx, pts, b.y1, color, 0.14 * alpha);
        stroke(ctx, pts, color, 2.2, [], 0.25 + 0.75 * alpha);
    }

    // colchetes da queda da PCr e, ao lado, os valores ao vivo
    const yTop = Y(1);
    const brackets: readonly [number, string, number][] = [[dp, COL.placebo, -15], [dn, COL.nitrate, 15]];
    for (const [d, color, off] of brackets) {
        const x = X(0.31) + off;
        stroke(ctx, [[x, yTop], [x, Y(1 - d / PCR_REF_MM)]], color, 2.5);
    }
    const drop = (d: number) => (d < 0.05 ? '0,0' : `−${br(d, 1)}`);
    label(ctx, `placebo  ${drop(dp)} mM`, X(0.52), 62, COL.placebo, { size: 16, weight: 700, alpha: 0.4 + 0.6 * clock.dimP });
    label(ctx, `nitrato  ${drop(dn)} mM`, X(0.52), 84, COL.nitrate, { size: 16, weight: 700, alpha: 0.4 + 0.6 * clock.dimN });

    PEAKS.forEach(p => label(ctx, p.id, X(p.x), h - 8, p.id === 'PCr' || p.id === 'Pi' ? p.color : COL.muted, { align: 'center', weight: 600 }));
    label(ctx, phaseName(t), b.x1, 16, COL.muted, { align: 'right', size: 14, weight: 500 });
};
