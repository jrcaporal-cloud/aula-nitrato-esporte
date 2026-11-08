import { C } from '../../kit/palette';

/** Geometria do mapa da aula (caixa 1110×300): estações dos seis atos e a trilha suave que as liga. */

export const MAP_W = 1110;
export const MAP_H = 272;

type P = readonly [number, number];

export const STATIONS: readonly P[] = [0, 1, 2, 3, 4, 5].map(i => [95 + i * 184, i % 2 === 0 ? 160 : 102] as const);

/** Títulos quebrados à mão (SVG não quebra linha). */
export const TITLE_LINES: readonly (readonly string[])[] = [
    ['A Raiz'], ['A Viagem'], ['A Pista'], ['O Sprint', 'e a Força'], ['O Contra-', 'Interrogatório'], ['O Veredito'],
];

/** O íon muda de forma pelo caminho: nitrato na raiz, nitrito na viagem, óxido nítrico daí em diante. */
export const ION = [
    { label: 'NO₃⁻', color: C.nitrate },
    { label: 'NO₂⁻', color: C.nitrite },
    { label: 'NO', color: C.no },
] as const;
export const ionAt = (p: number) => ION[Math.min(Math.round(p), 2)];

const START: P = [10, 188];
const END: P = [1100, 82];
const PTS: readonly P[] = [START, ...STATIONS, END];

type Seg = readonly [P, P, P, P];
/** Catmull-Rom → Bézier cúbica: um segmento por par de pontos vizinhos. */
const SEGS: readonly Seg[] = PTS.slice(0, -1).map((p1, i) => {
    const p0 = PTS[Math.max(i - 1, 0)];
    const p2 = PTS[i + 1];
    const p3 = PTS[Math.min(i + 2, PTS.length - 1)];
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    return [p1, c1, c2, p2] as const;
});

export const ROUTE_D = `M${START[0]} ${START[1]} ` + SEGS.map(([, c1, c2, p2]) => `C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`).join(' ');

const bez = ([a, b, c, d]: Seg, t: number): P => {
    const u = 1 - t;
    const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
    return [k[0] * a[0] + k[1] * b[0] + k[2] * c[0] + k[3] * d[0], k[0] * a[1] + k[1] * b[1] + k[2] * c[1] + k[3] * d[1]];
};

/** Ponto da trilha no progresso `p` (0 = ato I, 5 = ato VI; de −1 a 0 é a entrada antes da primeira estação). */
export const pointAt = (p: number): P => {
    const s = Math.min(Math.max(p, -1), 5);
    const k = Math.min(Math.floor(s), 4);
    return bez(SEGS[k + 1], s - k);
};

const N = 24;
const segLen = (seg: Seg) => {
    let len = 0;
    let prev = bez(seg, 0);
    for (let i = 1; i <= N; i++) {
        const q = bez(seg, i / N);
        len += Math.hypot(q[0] - prev[0], q[1] - prev[1]);
        prev = q;
    }
    return len;
};
const LENS = SEGS.map(segLen);
const TOTAL = LENS.reduce((s, v) => s + v, 0);

/** Fração do comprimento total da trilha já percorrida no progresso `p` (para acender o traço). */
export const litFraction = (p: number): number => {
    const s = Math.min(Math.max(p, 0), 5);
    const k = Math.min(Math.floor(s), 4);
    const before = LENS.slice(0, k + 1).reduce((a, v) => a + v, 0);
    return (before + LENS[k + 1] * (s - k)) / TOTAL;
};
