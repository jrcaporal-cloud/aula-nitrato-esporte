/**
 * Modelo do FunnelSim (slide 66). Os 12 pontos são ILUSTRATIVOS: foram construídos para reproduzir o
 * resumo de Xie 2026 (g agrupado 0,13, IC −0,07 a 0,32; assimetria; 5 imputados). Só os agregados são do artigo.
 */

export interface FunnelPoint { g: number; se: number }

export const STUDIES: readonly FunnelPoint[] = [
    { g: -0.06, se: 0.19 }, { g: -0.04, se: 0.24 }, { g: 0.3, se: 0.28 }, { g: 0.14, se: 0.33 }, { g: 0.28, se: 0.37 }, { g: 0.05, se: 0.41 },
    { g: 0.18, se: 0.46 }, { g: 0.88, se: 0.51 }, { g: -0.11, se: 0.55 }, { g: 0.64, se: 0.6 }, { g: 0.53, se: 0.64 }, { g: 0.12, se: 0.69 },
];

/** Efeito agrupado de efeito fixo (inverso da variância) e seu erro padrão. */
export const pool = (pts: readonly FunnelPoint[]): { est: number; se: number } => {
    let sw = 0;
    let s = 0;
    for (const p of pts) {
        const w = 1 / (p.se * p.se);
        sw += w;
        s += w * p.g;
    }
    return { est: s / sw, se: Math.sqrt(1 / sw) };
};

/** Regressão ponderada g = a + b·EP (a reta que o teste de Egger inclina). */
export const eggerLine = (pts: readonly FunnelPoint[]): { a: number; b: number } => {
    let sw = 0;
    let sx = 0;
    let sy = 0;
    let sxx = 0;
    let sxy = 0;
    for (const p of pts) {
        const w = 1 / (p.se * p.se);
        sw += w;
        sx += w * p.se;
        sy += w * p.g;
        sxx += w * p.se * p.se;
        sxy += w * p.se * p.g;
    }
    const b = (sw * sxy - sx * sy) / (sw * sxx - sx * sx);
    return { a: (sy - b * sx) / sw, b };
};

/** Trim-and-fill: tira os k mais extremos do lado positivo, recentra e espelha os k fantasmas. */
export const trimAndFill = (pts: readonly FunnelPoint[], k: number): { ghosts: FunnelPoint[]; center: number; adjusted: { est: number; se: number } } => {
    const sorted = [...pts].sort((x, y) => x.g - y.g);
    const kept = sorted.slice(0, sorted.length - k);
    const trimmed = sorted.slice(sorted.length - k);
    const center = pool(kept).est;
    const ghosts = trimmed.map(t => ({ g: 2 * center - t.g, se: t.se }));
    return { ghosts, center, adjusted: pool([...pts, ...ghosts]) };
};

export const POOLED = pool(STUDIES);
export const EGGER = eggerLine(STUDIES);
export const FILL = trimAndFill(STUDIES, 5);
