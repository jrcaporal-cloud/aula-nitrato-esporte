import { useEffect, useMemo, useState } from 'react';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { seeded } from './geom';
import { makeMuscles, N_MUSCLES, R_TARGET } from './fiber.data';
import { useTweenNum } from './useTweenNum';

interface Shape { cx: number; cy: number; rx: number; ry: number; rot: number }

type P = readonly [number, number];

/** Elipses de músculo ao longo de um segmento do membro: dois lados + (opcional) dois centrais. */
const along = (p0: P, p1: P, steps: number, central: boolean): Shape[] => {
    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];
    const len = Math.hypot(dx, dy);
    const nx = -dy / len;
    const ny = dx / len;
    const rot = (Math.atan2(dy, dx) * 180) / Math.PI - 90;
    const out: Shape[] = [];
    for (let j = 0; j < steps; j++) {
        const t = (j + 0.5) / steps;
        for (const side of [-1, 1]) {
            const off = side * (22 + (j % 2) * 6);
            out.push({ cx: p0[0] + dx * t + nx * off, cy: p0[1] + dy * t + ny * off, rx: 16, ry: (len / steps) * 0.68, rot });
        }
    }
    if (central) for (const t of [0.3, 0.7]) out.push({ cx: p0[0] + dx * t, cy: p0[1] + dy * t, rx: 15, ry: (len / steps) * 0.64, rot });
    return out;
};

const THIGH: readonly [P, P] = [[214, 78], [158, 198]];
const SHANK: readonly [P, P] = [[158, 198], [184, 322]];
const FOOT: readonly [P, P] = [[184, 322], [262, 366]];

const SHAPES: readonly Shape[] = [...along(THIGH[0], THIGH[1], 5, true), ...along(SHANK[0], SHANK[1], 5, true), ...along(FOOT[0], FOOT[1], 2, false)];

const MUSCLES = makeMuscles();
/** Ordem de leitura por % de fibra (do mais lento ao mais rápido). */
const RANK = MUSCLES.map((m, i) => ({ i, pct: m.pct })).sort((a, b) => a.pct - b.pct).map(m => m.i);
const SHAPE_OF = (() => {
    const rnd = seeded(77);
    const order = Array.from({ length: N_MUSCLES }, (_, i) => i).sort(() => rnd() - 0.5);
    // sóleo (idx 0, 9%) e gastrocnêmio (idx 27, 91%) lado a lado na perna
    const swap = (slot: number, muscle: number) => {
        const at = order.indexOf(muscle);
        [order[slot], order[at]] = [order[at], order[slot]];
    };
    swap(14, 0);
    swap(15, N_MUSCLES - 1);
    return order;
})();

const GAIN_MIN = Math.min(...MUSCLES.map(m => m.gain));
const GAIN_MAX = Math.max(...MUSCLES.map(m => m.gain));

/** Cor do músculo pela % de fibra rápida: ardósia (lento) → laranja (rápido, hipóxia). */
const fiberColor = (pct: number): string => {
    const k = pct / 100;
    const mix = (a: number, b: number) => Math.round(a + (b - a) * k);
    return `rgb(${mix(71, 251)} ${mix(90, 146)} ${mix(116, 60)})`;
};

const PLOT = { x0: 424, x1: 704, y0: 92, y1: 330 } as const;

/** Passo 2: membro posterior de rato colorido por % de fibra II; o ganho de fluxo acende e o gráfico se monta até r = 0,74. */
export const RatLimbScene = ({ reduce }: { reduce: boolean }) => {
    const [go, setGo] = useState(false);
    useEffect(() => {
        const id = requestAnimationFrame(() => setGo(true));
        return () => cancelAnimationFrame(id);
    }, []);
    const c = useTweenNum(go ? N_MUSCLES : 0, reduce, 4600);
    const lit = (i: number) => Math.min(Math.max(c - RANK.indexOf(i), 0), 1);
    const norm = (g: number) => (g - GAIN_MIN) / (GAIN_MAX - GAIN_MIN);
    const px = (pct: number) => PLOT.x0 + (pct / 100) * (PLOT.x1 - PLOT.x0);
    const py = (g: number) => PLOT.y1 - 14 - norm(g) * (PLOT.y1 - PLOT.y0 - 28);
    const fit = useMemo(() => {
        const xs = MUSCLES.map(m => m.pct);
        const ys = MUSCLES.map(m => m.gain);
        const mx = xs.reduce((s, v) => s + v, 0) / xs.length;
        const my = ys.reduce((s, v) => s + v, 0) / ys.length;
        const b = xs.reduce((s, v, i) => s + (v - mx) * (ys[i] - my), 0) / xs.reduce((s, v) => s + (v - mx) ** 2, 0);
        return { a: my - b * mx, b };
    }, []);
    const done = Math.min(Math.max(c - (N_MUSCLES - 1), 0), 1);
    return (
        <g>
            <SvgText x={24} y={36} text="rato · cor = % de fibras IIb + d/x" size={18} color={C.text} weight={600} />
            <path d={`M${THIGH[0][0]} ${THIGH[0][1]} L${THIGH[1][0]} ${THIGH[1][1]} L${SHANK[1][0]} ${SHANK[1][1]} L${FOOT[1][0]} ${FOOT[1][1]}`}
                fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
            {SHAPES.map((s, k) => {
                const mi = SHAPE_OF.indexOf(k);
                const m = MUSCLES[mi];
                const l = lit(mi);
                return (
                    <g key={k} transform={`rotate(${s.rot} ${s.cx} ${s.cy})`}>
                        <ellipse cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} fill={fiberColor(m.pct)} fillOpacity={0.85} stroke="#07050B" strokeWidth={1.5} />
                        <ellipse cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} fill="none" stroke={C.no} strokeWidth={1 + norm(m.gain) * 5} opacity={l * (0.25 + 0.75 * norm(m.gain))}
                            style={{ filter: l > 0.5 ? `drop-shadow(0 0 5px ${C.no})` : undefined }} />
                    </g>
                );
            })}
            <defs>
                <linearGradient id="fiberLegend" x1="0" x2="1">
                    <stop offset="0" stopColor={fiberColor(0)} />
                    <stop offset="1" stopColor={fiberColor(100)} />
                </linearGradient>
            </defs>
            <rect x={24} y={400} width={200} height={12} rx={6} fill="url(#fiberLegend)" />
            <SvgText x={24} y={434} text="poucas rápidas" size={16} color={C.muted} weight={500} />
            <SvgText x={224} y={434} text="muitas" anchor="end" size={16} color={C.hypoxia} weight={600} />
            <SvgText x={PLOT.x0} y={62} text="ganho de fluxo com beterraba" size={18} color={C.text} weight={600} />
            <line x1={PLOT.x0} x2={PLOT.x1} y1={PLOT.y1} y2={PLOT.y1} stroke="rgba(255,255,255,0.3)" />
            <line x1={PLOT.x0} x2={PLOT.x0} y1={PLOT.y0 - 8} y2={PLOT.y1} stroke="rgba(255,255,255,0.3)" />
            <SvgText x={(PLOT.x0 + PLOT.x1) / 2} y={PLOT.y1 + 30} text="% de fibras IIb + d/x do músculo" anchor="middle" size={16} color={C.muted} weight={500} />
            <SvgText x={PLOT.x0 + 8} y={PLOT.y0 + 4} text="↑ mais fluxo" size={16} color={C.muted} weight={500} />
            <line x1={px(0)} y1={py(fit.a)} x2={px(100)} y2={py(fit.a + fit.b * 100)} stroke={C.text} strokeWidth={2.5} strokeDasharray="7 6"
                opacity={done * 0.8} />
            {MUSCLES.map((m, i) => {
                const l = lit(i);
                return <circle key={i} cx={px(m.pct)} cy={py(m.gain)} r={6.5 * l} fill={fiberColor(m.pct)} stroke={C.no} strokeWidth={2} opacity={l > 0 ? 1 : 0} />;
            })}
            <g opacity={done}>
                <SvgText x={PLOT.x1 - 6} y={PLOT.y1 - 52} text={`r = ${String(R_TARGET).replace('.', ',')}`} anchor="end" size={34} color={C.text} weight={800} />
                <SvgText x={PLOT.x1 - 6} y={PLOT.y1 - 24} text="n = 28 músculos · p < 0,01" anchor="end" size={16} color={C.muted} weight={600} />
            </g>
        </g>
    );
};
