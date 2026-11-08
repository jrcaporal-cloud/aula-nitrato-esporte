import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { MW_H, MW_W } from './MouthwashChart';

/** Queda da pressão sistólica depois da corrida, com enxaguante placebo e antibacteriano (Clarke 2019). SVG 476×444. */
const BASE = 330;
const PX_PER_MMHG = 38;

interface BarProps { x: number; value: number; color: string; label: string; note?: string }

const Bar = ({ x, value, color, label, note }: BarProps) => {
    const h = value * PX_PER_MMHG;
    return (
        <g>
            {h > 0 && <rect x={x} y={BASE - h} width={74} height={h} rx={8} fill={color} opacity={0.85} />}
            <SvgText x={x + 37} y={BASE - h - 10} text={label} size={19} weight={700} anchor="middle" color={color} />
            {note && <SvgText x={x + 37} y={BASE + 24} text={note} size={16} anchor="middle" color={C.muted} />}
        </g>
    );
};

export const ExerciseChart = () => (
    <svg width={MW_W} height={MW_H} viewBox={`0 0 ${MW_W} ${MW_H}`} role="img"
        aria-label="Queda da pressão sistólica 1 e 2 horas depois do exercício, com e sem enxaguante antibacteriano">
        <SvgText x={40} y={32} text="queda da PAS depois da corrida" size={17} weight={700} color={C.text} />
        <rect x={40} y={46} width={14} height={14} rx={3} fill={C.placebo} />
        <SvgText x={60} y={59} text="placebo" size={16} color={C.muted} />
        <rect x={140} y={46} width={14} height={14} rx={3} fill={C.bacteria} />
        <SvgText x={160} y={59} text="antibacteriano" size={16} color={C.muted} />
        <line x1={40} y1={BASE} x2={460} y2={BASE} stroke="rgba(255,255,255,0.3)" />

        <Bar x={70} value={5.2} color={C.placebo} label="−5,2" />
        <Bar x={160} value={5.2 * 0.39} color={C.bacteria} label="−61%" />
        <SvgText x={157} y={BASE + 24} text="1 h" size={17} weight={700} anchor="middle" color={C.text} />

        <Bar x={290} value={3.8} color={C.placebo} label="−3,8" />
        <Bar x={380} value={0} color={C.bacteria} label="abolida" />
        <SvgText x={377} y={BASE + 24} text="2 h" size={17} weight={700} anchor="middle" color={C.text} />
        <SvgText x={236} y={BASE + 50} text="mmHg · −61% é a redução da queda do placebo" size={16} anchor="middle" color={C.muted} />

        <rect x={40} y={382} width={420} height={44} rx={12} fill="rgba(167,139,250,0.1)" stroke={C.bacteria} strokeOpacity={0.5} />
        <SvgText x={250} y={410} text="sem suplemento de nitrato: só o NO do exercício" size={17} weight={700} anchor="middle" color={C.bacteria} />
    </svg>
);
