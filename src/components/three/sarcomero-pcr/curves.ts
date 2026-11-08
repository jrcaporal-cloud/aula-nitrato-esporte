import { seg, smooth } from '../shared/math';
import type { Cond } from './colors';
import { DATA } from './content';

/* Formas esquemáticas dos gráficos do HUD. Só os números do dossiê aparecem como valor. */

/** Torque relativo (0..1) numa frequência `f` (Hz): sigmoide de meia-ativação `f50`. */
export const torque = (f: number, f50: number, n = 2.4): number => 1 / (1 + Math.pow(f50 / f, n));

export interface FreqPanel {
    title: string;
    sub: string;
    /** Frequência de meia-ativação (Hz) por condição: valores ilustrativos, só a direção do desvio é dado. */
    f50: Readonly<Record<Cond, number>>;
}

export const MOUSE_PANELS: readonly FreqPanel[] = [
    { title: 'Fibra rápida', sub: 'Ca²⁺ e força maiores', f50: { placebo: 62, nitrate: 42 } },
    { title: 'Fibra lenta', sub: 'sem mudança', f50: { placebo: 60, nitrate: 60 } },
];

export const HUMAN_PANELS: readonly FreqPanel[] = [
    { title: 'Tríceps braquial', sub: 'rápido · desvio para a esquerda', f50: { placebo: 24, nitrate: 14 } },
    { title: 'Tríceps sural', sub: 'lento · desvio para a direita', f50: { placebo: 20, nitrate: 34 } },
];

/** Varredura de frequência da etapa 5 (1 a 100 Hz, escala log), em loop de `SWEEP_S` s. */
export const SWEEP_S = 11;
export const sweepHz = (t: number): number => Math.pow(100, Math.min((t % SWEEP_S) / (SWEEP_S - 2.5), 1));

/** Picos do espectro de ³¹P: posição 0..1 (esquerda = desvio químico maior) e altura em repouso. */
export interface Peak { id: string; x: number; h: number; color: string }
export const PCR_REF_MM = 30;

/** Altura relativa do espectro de ³¹P em x (0..1) com a PCr já caída em `dpcr` mM (escala ilustrativa). */
export const spectrumAt = (peaks: readonly Peak[], x: number, dpcr: number): number => {
    const frac = dpcr / PCR_REF_MM;
    let y = 0;
    for (const p of peaks) {
        const h = p.id === 'PCr' ? p.h * (1 - frac) : p.id === 'Pi' ? p.h + frac : p.h;
        const w = p.id === 'β-ATP' ? 0.014 : 0.011;
        const d = x - p.x;
        y += (h * w * w) / (d * d + w * w);
    }
    return y;
};

/** VO₂ ao longo do exercício até a exaustão (altura relativa, ilustrativa); NaN depois do fim. */
export const vo2Curve = (cond: Cond, sec: number): number => {
    const tte = DATA.high.tte[cond];
    if (sec > tte) return Number.NaN;
    const fast = 0.5 * (1 - Math.exp(-sec / 35));
    const slow = (DATA.high.vo2Slow[cond] * 0.3) / DATA.high.vo2Slow.placebo * smooth(seg(sec, 120, tte));
    return 0.08 + fast + slow;
};

/** y com correlação amostral exata `r` com `x` (resíduo determinístico ortogonalizado). */
export const correlatedWith = (x: readonly number[], r: number, seed: number): number[] => {
    const n = x.length;
    const mean = (v: readonly number[]) => v.reduce((a, b) => a + b, 0) / n;
    const z = (v: readonly number[]) => {
        const m = mean(v);
        const sd = Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / n) || 1;
        return v.map(a => (a - m) / sd);
    };
    const zx = z(x);
    const noise = Array.from({ length: n }, (_, i) => Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453 % 1);
    const proj = zx.reduce((a, b, i) => a + b * (noise[i] - mean(noise)), 0) / n;
    const resid = noise.map((v, i) => v - mean(noise) - proj * zx[i]);
    const ze = z(resid);
    const k = Math.sqrt(1 - r * r);
    return zx.map((a, i) => r * a + k * ze[i]);
};

export const pearson = (a: readonly number[], b: readonly number[]): number => {
    const n = a.length;
    const ma = a.reduce((s, v) => s + v, 0) / n;
    const mb = b.reduce((s, v) => s + v, 0) / n;
    let sab = 0, saa = 0, sbb = 0;
    for (let i = 0; i < n; i++) {
        sab += (a[i] - ma) * (b[i] - mb);
        saa += (a[i] - ma) ** 2;
        sbb += (b[i] - mb) ** 2;
    }
    return sab / Math.sqrt(saa * sbb);
};

export const PEAKS: readonly Peak[] = [
    { id: 'Pi', x: 0.115, h: 0.08, color: '#A5B4FC' },
    { id: 'PCr', x: 0.31, h: 1, color: '#2DD4BF' },
    { id: 'γ-ATP', x: 0.405, h: 0.5, color: '#E5E7EB' },
    { id: 'α-ATP', x: 0.6, h: 0.52, color: '#E5E7EB' },
    { id: 'β-ATP', x: 0.925, h: 0.4, color: '#E5E7EB' },
];
