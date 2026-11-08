import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br } from '../kit/format';
import type { Bars } from './reservoir.content';

/** Quatro barras (nitrato e nitrito, plasma e músculo), escala linear, plasma basal = 1×. Região de 310×446. */
const BASE = 372;
const PX = 10;
const W = 54;

interface BarProps { x: number; value: number; color: string; label: string; strong?: boolean }

const Bar = ({ x, value, color, label, strong }: BarProps) => {
    const h = Math.max(0, value) * PX;
    return (
        <g>
            <rect x={x} y={BASE - h} width={W} height={h} rx={6} fill={color} opacity={strong ? 0.95 : 0.55} />
            <SvgText x={x + W / 2} y={BASE - h - 8} text={`${br(Math.max(0, value), value < 10 && value % 1 !== 0 ? 1 : 0)}×`} size={19} weight={700} anchor="middle" color={color} />
            <SvgText x={x + W / 2} y={BASE + 22} text={label} size={16} anchor="middle" color={C.muted} />
        </g>
    );
};

export const ReservoirBars = ({ bars, offset = 0 }: { bars: Bars; offset?: number }) => (
    <g transform={`translate(${offset} 0)`}>
        <SvgText x={20} y={30} text="em relação ao plasma basal" size={16} color={C.muted} />
        <line x1={14} y1={BASE} x2={300} y2={BASE} stroke="rgba(255,255,255,0.3)" />
        <Bar x={30} value={bars.nitratePlasma} color={C.nitrateSoft} label="plasma" />
        <Bar x={96} value={bars.nitrateMuscle} color={C.nitrate} label="músculo" strong />
        <Bar x={184} value={bars.nitritePlasma} color={C.nitriteSoft} label="plasma" />
        <Bar x={250} value={bars.nitriteMuscle} color={C.nitrite} label="músculo" strong />
        <SvgText x={96} y={BASE + 52} text="Nitrato" size={18} weight={700} anchor="middle" color={C.nitrate} />
        <SvgText x={252} y={BASE + 52} text="Nitrito" size={18} weight={700} anchor="middle" color={C.nitrite} />
    </g>
);
