import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { PEAK_BAND, nitriteReduction, nosActivity } from './pathwayModel';

/** Atividade das duas vias contra a saturação de O₂ (SVG 430×228, escala 1:1). */
export const CHART_W = 430;
export const CHART_H = 228;

const PLOT = { x0: 20, x1: 414, y0: 44, y1: 174 };
const xOf = (sat: number) => PLOT.x0 + ((100 - sat) / 100) * (PLOT.x1 - PLOT.x0);
const yOf = (a: number) => PLOT.y1 - a * (PLOT.y1 - PLOT.y0);

const curve = (f: (sat: number) => number): string => {
    let d = '';
    for (let sat = 100; sat >= 0; sat -= 2) d += `${d ? 'L' : 'M'}${xOf(sat).toFixed(1)} ${yOf(f(sat)).toFixed(1)}`;
    return d;
};

interface Props { sat: number; ph: number }

export const ActivityChart = ({ sat, ph }: Props) => {
    const nos = nosActivity(sat);
    const red = nitriteReduction(sat, ph);
    const showGhost = ph < 7.35;
    return (
        <svg width={CHART_W} height={CHART_H} viewBox={`0 0 ${CHART_W} ${CHART_H}`} role="img"
            aria-label="Atividade da NOS e da redução do nitrito conforme a saturação de oxigênio">
            <SvgText x={20} y={22} text="atividade relativa" size={16} color={C.muted} />
            {/* faixa em que a hemoglobina reduz nitrito no máximo */}
            <rect x={xOf(PEAK_BAND[1])} y={PLOT.y0 - 8} width={xOf(PEAK_BAND[0]) - xOf(PEAK_BAND[1])} height={PLOT.y1 - PLOT.y0 + 8}
                fill={C.nitrite} opacity={0.1} rx={6} />
            <SvgText x={(xOf(40) + xOf(60)) / 2} y={28} text="40–60%" size={16} anchor="middle" color={C.nitriteSoft} />
            <line x1={PLOT.x0} y1={PLOT.y1} x2={PLOT.x1} y2={PLOT.y1} stroke="rgba(255,255,255,0.3)" />
            {[100, 75, 50, 25, 0].map(t => (
                <g key={t}>
                    <line x1={xOf(t)} y1={PLOT.y1} x2={xOf(t)} y2={PLOT.y1 + 5} stroke="rgba(255,255,255,0.3)" />
                    <SvgText x={xOf(t)} y={PLOT.y1 + 24} text={`${t}%`} size={16} anchor={t === 100 ? 'start' : t === 0 ? 'end' : 'middle'} color={C.muted} />
                </g>
            ))}
            <SvgText x={PLOT.x1} y={PLOT.y1 + 46} text="saturação de O₂  →  cada vez menos" size={16} anchor="end" color={C.muted} />

            <path d={curve(nosActivity)} fill="none" stroke={C.o2} strokeWidth={3} strokeLinecap="round" />
            {showGhost && (
                <path d={curve(s => nitriteReduction(s, 7.4))} fill="none" stroke={C.nitrite} strokeWidth={2} strokeDasharray="5 6" opacity={0.45} />
            )}
            <path d={curve(s => nitriteReduction(s, ph))} fill="none" stroke={C.nitrite} strokeWidth={3} strokeLinecap="round" />

            <SvgText x={264} y={22} text="NOS" size={17} weight={700} color={C.o2} />
            <SvgText x={PLOT.x1} y={22} text="nitrito → NO" size={17} weight={700} anchor="end" color={C.nitrite} />

            <line x1={xOf(sat)} y1={PLOT.y0 - 4} x2={xOf(sat)} y2={PLOT.y1} stroke="#fff" strokeWidth={1.5} strokeDasharray="3 4" opacity={0.7} />
            <circle cx={xOf(sat)} cy={yOf(nos)} r={6} fill={C.o2} stroke="#fff" strokeWidth={2} />
            <circle cx={xOf(sat)} cy={yOf(red)} r={6} fill={C.nitrite} stroke="#fff" strokeWidth={2} />
        </svg>
    );
};
