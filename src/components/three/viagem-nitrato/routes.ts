import * as THREE from 'three';
import { buildLut, lutPoint, type Lut, type Organ } from './tubes';

/*
 * Rota = trechos de órgãos emendados. A posição ao longo da rota (s de 0 a 1) vem do comprimento de
 * cada trecho; o deslocamento (a, b) é em frações do raio, para as partículas ficarem dentro do tubo.
 */

export interface Leg { lut: Lut; u0: number; u1: number; len: number }
export interface Route { legs: readonly Leg[]; /** Fim de cada trecho, em fração da rota. */ cum: readonly number[] }

export const leg = (o: Organ, u0 = 0, u1 = 1): Leg => ({
    lut: buildLut(o, 180),
    u0,
    u1,
    len: Math.max(o.curve.getLength() * Math.abs(u1 - u0), 1e-3),
});

export const route = (...legs: Leg[]): Route => {
    const total = legs.reduce((s, l) => s + l.len, 0);
    let acc = 0;
    return { legs, cum: legs.map(l => (acc += l.len) / total) };
};

export const routePoint = (r: Route, s: number, a: number, b: number, out: THREE.Vector3): THREE.Vector3 => {
    const x = Math.min(Math.max(s, 0), 1);
    let i = 0;
    while (i < r.cum.length - 1 && x > r.cum[i]) i++;
    const lo = i === 0 ? 0 : r.cum[i - 1];
    const hi = r.cum[i];
    const k = hi > lo ? (x - lo) / (hi - lo) : 0;
    const l = r.legs[i];
    return lutPoint(l.lut, l.u0 + (l.u1 - l.u0) * k, a, b, out);
};

/** Fração da rota a `k` (0 a 1) do caminho dentro do trecho `i`. */
export const routeAt = (r: Route, i: number, k: number): number => {
    const lo = i === 0 ? 0 : r.cum[i - 1];
    return lo + (r.cum[i] - lo) * k;
};
