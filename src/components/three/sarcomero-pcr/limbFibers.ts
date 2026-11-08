import { rng } from '../shared/math';
import { MUSCLES } from './limb';

/*
 * Mosaico de fibras na face de cada um dos 28 músculos do rato: retículo hexagonal recortado no círculo, com
 * a fração de fibras rápidas (IIb + d/x) igual à % do músculo. Só serve ao desenho; os números continuam em limb.ts.
 */

export interface FibreDot { x: number; y: number; r: number; muscle: number }

export const FIBRE_SPACING = 0.082;

const build = () => {
    const rnd = rng(41);
    const fast: FibreDot[] = [];
    const slow: FibreDot[] = [];
    MUSCLES.forEach((m, mi) => {
        const pts: { x: number; y: number }[] = [];
        const n = Math.ceil(m.radius / FIBRE_SPACING) + 1;
        for (let row = -n; row <= n; row++) {
            for (let col = -n; col <= n; col++) {
                const x = (col + (row % 2 ? 0.5 : 0)) * FIBRE_SPACING;
                const y = row * FIBRE_SPACING * 0.866;
                if (Math.hypot(x, y) <= m.radius * 0.84) pts.push({ x, y });
            }
        }
        const order = pts.map((_, i) => ({ i, k: rnd() })).sort((a, b) => a.k - b.k);
        const nFast = Math.round((m.pct / 100) * pts.length);
        const isFast = new Set(order.slice(0, nFast).map(o => o.i));
        pts.forEach((p, i) => {
            const dot = { x: m.x + p.x, y: m.y + p.y, r: FIBRE_SPACING * (0.5 + 0.06 * rnd()), muscle: mi };
            (isFast.has(i) ? fast : slow).push(dot);
        });
    });
    return { fast, slow };
};

export const FIBRES = build();
