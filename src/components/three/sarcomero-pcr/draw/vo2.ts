import { COL } from '../colors';
import { DATA } from '../content';
import { vo2Curve } from '../curves';
import { secAt } from '../kinetics';
import { AXIS, box, dot, label, stroke, type DrawFn } from './common';
import type { Cond } from '../colors';

/* VO₂ até a exaustão: fase rápida, componente lento e o fim (586 s no placebo, 734 s com nitrato). */

const X_MAX = 1000;
const PLATEAU = 0.58;
const CONDS: readonly [Cond, string][] = [['placebo', COL.placebo], ['nitrate', COL.nitrate]];

export const drawVo2: DrawFn = (ctx, w, h, clock) => {
    const b = box(16, 14, w - 12, h - 34);
    const X = (s: number) => b.x0 + (s / X_MAX) * b.w;
    const Y = (v: number) => b.y1 - v * b.h;
    const sec = secAt(clock.t);

    stroke(ctx, [[b.x0, b.y1], [b.x1, b.y1]], AXIS, 1);
    stroke(ctx, [[X(90), Y(PLATEAU)], [X(DATA.high.tte.nitrate), Y(PLATEAU)]], 'rgba(255,255,255,0.3)', 1, [4, 4]);
    label(ctx, 'fim da fase rápida', X(130), Y(PLATEAU) + 18, COL.muted, { size: 14, weight: 500 });

    for (const [cond, color] of CONDS) {
        const tte = DATA.high.tte[cond];
        const alpha = cond === 'placebo' ? clock.dimP : clock.dimN;
        stroke(ctx, [[X(tte), b.y1], [X(tte), b.y1 + 6]], color, 2);
        label(ctx, `${tte} s`, X(tte), h - 8, color, { align: 'center', size: 15, weight: 700 });
        const pts: [number, number][] = [];
        const upTo = Math.min(sec, tte);
        for (let s = 0; s <= upTo; s += 6) pts.push([X(s), Y(vo2Curve(cond, s))]);
        pts.push([X(upTo), Y(vo2Curve(cond, upTo))]);
        stroke(ctx, pts, color, 2.4, [], 0.3 + 0.7 * alpha);
        const head = pts[pts.length - 1];
        if (sec <= tte) {
            dot(ctx, head[0], head[1], 4, color, alpha);
            continue;
        }
        // chegou ao fim: marca a exaustão e o tamanho do componente lento
        stroke(ctx, [[head[0] - 5, head[1] - 5], [head[0] + 5, head[1] + 5]], color, 2.5);
        stroke(ctx, [[head[0] - 5, head[1] + 5], [head[0] + 5, head[1] - 5]], color, 2.5);
        stroke(ctx, [[head[0] + 14, Y(PLATEAU)], [head[0] + 14, head[1]]], color, 2.5);
        label(ctx, `${DATA.high.vo2Slow[cond]} mL/min`, head[0] + 22, head[1] + 5, color, { size: 15, weight: 700 });
    }
    label(ctx, 'VO₂ (u.a.) · colchete = componente lento', b.x0 + 2, b.y0 + 14, COL.muted, { size: 14, weight: 500 });
};
