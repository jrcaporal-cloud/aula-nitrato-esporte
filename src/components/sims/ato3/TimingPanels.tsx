import { motion } from 'framer-motion';
import { ForestPlot, type ForestRow } from '../kit/ForestPlot';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { SUSTAIN } from './timing.content';

/** Cenas dos passos 2–4 do slide 43 (todas em 660 × 360). */

export const FW = 660;
export const FH = 360;

const note = (text: string) => <p className="text-[16px] leading-snug text-gray-300">{text}</p>;

/** Forest com poucas linhas + uma nota embaixo. */
export const ForestScene = ({ rows, domain, ticks, label, foot, sides }: {
    rows: readonly ForestRow[]; domain: readonly [number, number]; ticks: readonly number[]; label: string; foot: string; sides: readonly [string, string];
}) => (
    <div className="h-full flex flex-col justify-between" style={{ width: FW }}>
        <div style={{ width: FW, height: 270 }}>
            <ForestPlot rows={rows} width={FW} height={270} domain={domain} ticks={ticks} axisLabel={label} labelWidth={205} valueWidth={185} sides={sides} />
        </div>
        {note(foot)}
    </div>
);

const COL_X = [310, 450, 590] as const;

/** VANHATALO2010: três visitas (2,5 h, 5 dias, 15 dias) × três desfechos; o último só muda aos 15 dias. */
export const SustainGrid = ({ reduce }: { reduce: boolean }) => {
    const rows = [
        { label: 'Nitrito plasmático', cells: SUSTAIN.nitrite, color: C.nitrite },
        { label: 'PA e VO₂ moderado', cells: SUSTAIN.bpVo2, color: C.no },
        { label: 'Potência de pico (rampa)', cells: SUSTAIN.ramp, color: C.o2 },
    ];
    return (
        <svg viewBox={`0 0 ${FW} ${FH}`} width={FW} height={FH} role="img" aria-label="Efeitos aos 2,5 h, 5 dias e 15 dias de suplementação">
            {SUSTAIN.cols.map((c, i) => <SvgText key={c} x={COL_X[i]} y={40} text={c} size={20} weight={700} anchor="middle" color="#fff" />)}
            {rows.map((r, ri) => {
                const y = 70 + ri * 84;
                return (
                    <g key={r.label}>
                        <rect x={4} y={y} width={FW - 8} height={70} rx={12} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
                        <SvgText x={18} y={y + 42} text={r.label} size={17} weight={700} color="#E5E7EB" />
                        {r.cells.map((cell, ci) => {
                            const empty = cell === '—';
                            return (
                                <motion.g key={ci} initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.12 * (ri * 3 + ci) }}>
                                    <rect x={COL_X[ci] - 62} y={y + 12} width={124} height={46} rx={10}
                                        fill={empty ? 'rgba(148,163,184,0.1)' : `${r.color}2e`} stroke={empty ? 'rgba(148,163,184,0.3)' : r.color} />
                                    <SvgText x={COL_X[ci]} y={y + 43} text={empty ? 'sem mudança' : cell} size={empty ? 16 : 19} weight={700} anchor="middle" color={empty ? C.muted : '#fff'} />
                                </motion.g>
                            );
                        })}
                    </g>
                );
            })}
            <SvgText x={FW / 2} y={FH - 14} text="dois relógios: O₂ e pressão em horas, potência de pico em semanas" size={17} weight={600} anchor="middle" color="#CBD5E1" />
        </svg>
    );
};
