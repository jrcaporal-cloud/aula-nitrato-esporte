import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

export interface PairRow {
    label: string;
    /** Comprimento da barra do nitrato ÷ barra do placebo (1 = sem diferença). */
    ratio: number;
    note: string;
    /** Linha em destaque (a que mudou). */
    accent?: boolean;
    noteColor?: string;
}

interface PairBarsProps {
    rows: readonly PairRow[];
    reduce: boolean;
    title?: string;
    top?: number;
    gap?: number;
    barX?: number;
    barW?: number;
}

/** Pares de barras horizontais (placebo × nitrato). Comprimentos ilustrativos: a diferença é o dado. */
export const PairBars = ({ rows, reduce, title, top = 78, gap = 55, barX = 290, barW = 300 }: PairBarsProps) => (
    <g>
        {title && <SvgText x={30} y={40} text={title} size={18} color={C.text} weight={600} />}
        {rows.map((r, i) => {
            const yy = top + i * gap;
            const bar = (w: number, color: string, dy: number, delay: number) => (
                <rect x={barX} y={yy + dy} width={w} height={14} rx={4} fill={color}
                    style={{ transformBox: 'fill-box', transformOrigin: '0 50%', animation: reduce ? 'none' : `pb-grow 700ms ease ${delay}ms both` }} />
            );
            return (
                <g key={r.label}>
                    <SvgText x={30} y={yy + 22} text={r.label} size={18} color={r.accent ? C.text : C.muted} weight={r.accent ? 700 : 500} />
                    {bar(barW, C.placebo, 2, i * 140)}
                    {bar(barW * r.ratio, C.nitrate, 20, i * 140 + 90)}
                    <SvgText x={barX + barW * Math.max(1, r.ratio) + 16} y={yy + 28} text={r.note} size={r.accent ? 22 : 16}
                        color={r.noteColor ?? (r.accent ? C.nitrateSoft : C.muted)} weight={r.accent ? 800 : 500} />
                </g>
            );
        })}
        <style>{'@keyframes pb-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }'}</style>
    </g>
);
