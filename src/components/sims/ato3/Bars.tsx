import { motion } from 'framer-motion';
import { SvgText } from '../kit/ui';

/** Barras horizontais com base em zero: rótulo à esquerda, valor na ponta. Peça comum às cenas do Ato III. */

export interface BarRow {
    id: string;
    label: string;
    value: number;
    /** Texto do valor na ponta da barra (já formatado em português). */
    text: string;
    color: string;
    /** Barra tracejada: "igual ao de cima, sem valor próprio". */
    ghost?: boolean;
}

interface HBarsProps {
    rows: readonly BarRow[];
    x: number;
    y: number;
    labelW: number;
    barW: number;
    rowH: number;
    max: number;
    reduce: boolean;
    delay?: number;
    labelSize?: number;
}

export const HBars = ({ rows, x, y, labelW, barW, rowH, max, reduce, delay = 0, labelSize = 17 }: HBarsProps) => (
    <g>
        {rows.map((r, i) => {
            const cy = y + i * rowH + rowH / 2;
            const w = (r.value / max) * barW;
            const h = Math.min(rowH - 12, 30);
            return (
                <g key={r.id}>
                    <SvgText x={x + labelW - 12} y={cy + 6} text={r.label} size={labelSize} anchor="end" weight={600} color={r.ghost ? '#9CA3AF' : '#E5E7EB'} />
                    <motion.rect x={x + labelW} y={cy - h / 2} width={w} height={h} rx={5}
                        fill={r.ghost ? 'none' : r.color} fillOpacity={0.92}
                        stroke={r.ghost ? r.color : 'none'} strokeWidth={2} strokeDasharray={r.ghost ? '6 5' : undefined}
                        style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
                        initial={{ scaleX: reduce ? 1 : 0 }} animate={{ scaleX: 1 }}
                        transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : delay + i * 0.12, ease: 'easeOut' }} />
                    <motion.g initial={{ opacity: reduce ? 1 : 0 }} animate={{ opacity: 1 }}
                        transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : delay + 0.5 + i * 0.12 }}>
                        <SvgText x={x + labelW + w + 10} y={cy + 6} text={r.text} size={19} weight={700} color={r.ghost ? '#9CA3AF' : '#fff'} />
                    </motion.g>
                </g>
            );
        })}
    </g>
);

/** Chave vertical entre duas alturas, com o delta ao lado (ex.: "−5,4%"). */
export const DeltaBrace = ({ x, y1, y2, text, color, reduce, size = 26 }: {
    x: number; y1: number; y2: number; text: string; color: string; reduce: boolean; size?: number;
}) => (
    <motion.g initial={{ opacity: reduce ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.9 }}>
        <path d={`M ${x} ${y1} h 10 v ${y2 - y1} h -10`} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        <SvgText x={x + 20} y={(y1 + y2) / 2 + size / 3} text={text} size={size} weight={700} color={color} />
    </motion.g>
);
