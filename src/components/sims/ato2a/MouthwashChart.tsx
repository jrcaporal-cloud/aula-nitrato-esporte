import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { curveOf } from './pkModel';

/** Curvas de nitrato e nitrito no plasma nas 6 h após a dose (SVG 476×444). O enxaguante só achata o nitrito. */
export const MW_W = 476;
export const MW_H = 444;

const X0 = 40;
const X1 = 460;
const Y1 = 322;
const YTOP = 62;
const xOf = (t: number) => X0 + (t / 6) * (X1 - X0);
const yOf = (v: number) => Y1 - v * (Y1 - YTOP);

const line = (f: (t: number) => number, close = false): string => {
    const pts: string[] = [];
    for (let t = 0; t <= 6.001; t += 0.1) pts.push(`${xOf(t).toFixed(1)} ${yOf(f(t)).toFixed(1)}`);
    const d = `M${pts.join(' L')}`;
    return close ? `${d} L${xOf(6)} ${Y1} L${xOf(0)} ${Y1} Z` : d;
};

interface Props { nitrite: number; banner: string }

export const MouthwashChart = ({ nitrite, banner }: Props) => (
    <svg width={MW_W} height={MW_H} viewBox={`0 0 ${MW_W} ${MW_H}`} role="img"
        aria-label="Nitrito e nitrato plasmáticos após uma dose de nitrato, conforme a posição do interruptor">
        <defs>
            <linearGradient id="mw-nitrite" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={C.nitrite} stopOpacity={0.45} /><stop offset="1" stopColor={C.nitrite} stopOpacity={0.02} />
            </linearGradient>
        </defs>
        <circle cx={X0 + 6} cy={26} r={6} fill={C.nitrate} /><SvgText x={X0 + 18} y={32} text="nitrato" size={17} weight={700} color={C.nitrateSoft} />
        <circle cx={X0 + 116} cy={26} r={6} fill={C.nitrite} /><SvgText x={X0 + 128} y={32} text="nitrito" size={17} weight={700} color={C.nitriteSoft} />
        <SvgText x={X1} y={32} text="plasma" size={16} color={C.muted} anchor="end" />

        <rect x={xOf(2)} y={YTOP - 6} width={xOf(3) - xOf(2)} height={Y1 - YTOP + 6} fill={C.nitrite} opacity={0.08} rx={5} />
        <SvgText x={(xOf(2) + xOf(3)) / 2} y={YTOP - 12} text="2–3 h" size={16} anchor="middle" color={C.nitriteSoft} />
        <line x1={X0} y1={Y1} x2={X1} y2={Y1} stroke="rgba(255,255,255,0.3)" />

        {/* nitrato: não muda com o enxaguante */}
        <path d={line(t => curveOf('nitrate', t) * 0.72, true)} fill={C.nitrate} opacity={0.12} />
        <path d={line(t => curveOf('nitrate', t) * 0.72)} fill="none" stroke={C.nitrate} strokeWidth={3} strokeLinecap="round" />
        {/* referência com água */}
        <path d={line(t => curveOf('nitrite', t))} fill="none" stroke={C.nitrite} strokeWidth={2} strokeDasharray="5 6" opacity={0.5} />
        {/* nitrito na posição atual */}
        <path d={line(t => curveOf('nitrite', t) * nitrite, true)} fill="url(#mw-nitrite)" />
        <path d={line(t => curveOf('nitrite', t) * nitrite)} fill="none" stroke={C.nitrite} strokeWidth={3.5} strokeLinecap="round" />

        {[0, 1, 2, 3, 4, 5, 6].map(h => (
            <g key={h}>
                <line x1={xOf(h)} y1={Y1} x2={xOf(h)} y2={Y1 + 5} stroke="rgba(255,255,255,0.3)" />
                <SvgText x={xOf(h)} y={Y1 + 24} text={`${h}`} size={16} anchor="middle" color={C.muted} />
            </g>
        ))}
        <SvgText x={X1} y={Y1 + 50} text="horas após o nitrato · alturas ilustrativas" size={16} anchor="end" color={C.muted} />

        <rect x={X0} y={382} width={X1 - X0} height={44} rx={12} fill="rgba(251,191,36,0.1)" stroke={C.nitrite} strokeOpacity={0.5} />
        <SvgText x={(X0 + X1) / 2} y={410} text={banner} size={17} weight={700} anchor="middle" color={C.nitriteSoft} />
    </svg>
);
