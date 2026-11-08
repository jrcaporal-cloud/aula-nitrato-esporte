/** Geometria pequena para gráficos SVG da aula (sem dependências). */

export type Pt = readonly [number, number];

/** Caminho poligonal suave o bastante para curvas amostradas (M x y L x y …). */
export const linePath = (pts: readonly Pt[]): string =>
    pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');

/** Amostra `f` em `n+1` pontos de `a` até `b`. */
export const sample = (f: (t: number) => number, a: number, b: number, n = 80): number[][] =>
    Array.from({ length: n + 1 }, (_, i) => {
        const t = a + ((b - a) * i) / n;
        return [t, f(t)];
    });

/** Mapeia um intervalo em outro (linear). */
export const mapRange = (v: number, a0: number, a1: number, b0: number, b1: number): number =>
    b0 + ((v - a0) / (a1 - a0)) * (b1 - b0);

/** Gerador pseudoaleatório determinístico (mulberry32), para gráficos que não podem "piscar". */
export const seeded = (seed: number): (() => number) => {
    let s = seed >>> 0;
    return () => {
        s = (s + 0x6d2b79f5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};
