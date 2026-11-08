import { rng } from '../shared/math';

/*
 * Cortes dos tríceps humanos: mosaico hexagonal recortado numa elipse e dividido em fascículos (células de
 * Voronoi; as fibras nas fronteiras saem para abrir o perimísio). As fibras tipo II são sorteadas na fração pedida.
 */

export interface Fibre { x: number; y: number; isII: boolean }

export const TILE_A = 2.1;
export const TILE_B = 1.4;

export const buildTile = (fracII: number, seed: number): readonly Fibre[] => {
    const rnd = rng(seed);
    const centers = Array.from({ length: 7 }, () => ({ x: (rnd() * 2 - 1) * TILE_A * 0.75, y: (rnd() * 2 - 1) * TILE_B * 0.7 }));
    const pts: { x: number; y: number }[] = [];
    for (let row = -7; row <= 7; row++) {
        for (let col = -9; col <= 9; col++) {
            const x = col * 0.3 + (row % 2 ? 0.15 : 0);
            const y = row * 0.26;
            if ((x / (TILE_A - 0.1)) ** 2 + (y / (TILE_B - 0.08)) ** 2 > 1) continue;
            const d = centers.map(c => Math.hypot(x - c.x, y - c.y)).sort((a, b) => a - b);
            if (d[1] - d[0] < 0.07) continue;
            pts.push({ x, y });
        }
    }
    const order = pts.map((_, i) => ({ i, k: rnd() })).sort((a, b) => a.k - b.k);
    const nII = Math.round(fracII * pts.length);
    const isII = new Set(order.slice(0, nII).map(o => o.i));
    return pts.map((p, i) => ({ ...p, isII: isII.has(i) }));
};
