import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { mulberry32 } from '../artKit/rng';
import { RIDGE, altY } from './geometry';

/** Fundo da altitude: céu, serras em camadas (parallax), pontos de O₂ que rareiam com a altura e a régua de altitude. */

const poly = (pts: readonly (readonly [number, number])[]): string =>
    `M ${pts.map(([x, y]) => `${x} ${y}`).join(' L ')} L 1140 400 L -40 400 Z`;

const FAR: readonly (readonly [number, number])[] = [
    [-40, 250], [60, 220], [150, 262], [260, 190], [380, 240], [470, 170], [580, 226], [680, 150], [800, 210], [900, 176], [1010, 236], [1140, 200],
];
const NEAR: readonly (readonly [number, number])[] = [
    [-40, 392], [180, 372], [380, 384], [600, 366], [820, 380], [1000, 362], [1140, 378],
];

const STARS = (() => {
    const r = mulberry32(7);
    return Array.from({ length: 46 }, () => ({ x: r() * 1100, y: 8 + r() * 150, r: 0.8 + r() * 1.2, d: 2 + r() * 4 }));
})();

const DOTS = (() => {
    const r = mulberry32(21);
    return Array.from({ length: 130 }, () => ({ x: r() * 1100, y: 14 + 358 * Math.pow(r(), 0.55), d: 5 + r() * 5, a: 3 + r() * 4 }));
})();

const GAUGE: readonly (readonly [number, string])[] = [[0, 'nível do mar'], [2500, '~2.500 m'], [3000, '3.000 m'], [4300, '4.300 m']];

interface BackdropProps {
    reduce: boolean;
    /** 0 a 1: quanto a serra principal aparece (o resto da cena aparece sobre ela). */
    mountain?: number;
    gauge?: boolean;
    dots?: boolean;
}

export const Backdrop = ({ reduce, mountain = 1, gauge = true, dots = true }: BackdropProps) => (
    <g>
        <defs>
            <linearGradient id="alt-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#07050B" />
                <stop offset="0.55" stopColor="#120A24" />
                <stop offset="1" stopColor="#1B1033" />
            </linearGradient>
            <linearGradient id="alt-main" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#33205A" />
                <stop offset="1" stopColor="#140B26" />
            </linearGradient>
            <radialGradient id="alt-moon" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor={C.o2} stopOpacity={0.28} />
                <stop offset="1" stopColor={C.o2} stopOpacity={0} />
            </radialGradient>
        </defs>
        <rect x={-40} y={-10} width={1180} height={460} fill="url(#alt-sky)" />
        <circle cx={930} cy={70} r={170} fill="url(#alt-moon)" />
        {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={0.5}>
                {!reduce && <animate attributeName="opacity" values="0.15;0.7;0.15" dur={`${s.d}s`} repeatCount="indefinite" />}
            </circle>
        ))}
        <path d={poly(FAR)} fill="#150C28" opacity={0.9} />
        <g opacity={mountain}>
            <path d={poly(RIDGE)} fill="url(#alt-main)" />
            <path d={`M ${RIDGE.map(([x, y]) => `${x} ${y}`).join(' L ')}`} fill="none" stroke="#B9A5F5" strokeOpacity={0.35} strokeWidth={2} />
            <path d="M 700 232 L 760 215 L 812 228 L 786 240 L 760 232 L 734 244 Z" fill="#fff" opacity={0.16} />
        </g>
        <path d={poly(NEAR)} fill="#0B0714" />
        {dots && DOTS.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={2.2} fill={C.o2} opacity={0.34}>
                {!reduce && <animateTransform attributeName="transform" type="translate" values={`0 0;${d.a} ${-d.a};0 0`} dur={`${d.d}s`} repeatCount="indefinite" />}
            </circle>
        ))}
        {gauge && (
            <g>
                <line x1={44} x2={44} y1={altY(4300) - 10} y2={350} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
                <path d={`M 44 ${altY(4300) - 10} l -5 9 h 10 Z`} fill="rgba(255,255,255,0.5)" />
                {GAUGE.map(([m, t]) => (
                    <g key={m}>
                        <line x1={38} x2={50} y1={altY(m)} y2={altY(m)} stroke="#fff" strokeOpacity={0.6} strokeWidth={2} />
                        <SvgText x={60} y={altY(m) + 5} text={t} size={16} weight={600} color="#CBD5E1" />
                    </g>
                ))}
                <SvgText x={60} y={altY(0) - 18} text="20,9% O₂" size={16} weight={700} color={C.o2Soft} />
                <SvgText x={60} y={altY(2500) + 22} text="FiO₂ ~15%" size={16} weight={700} color={C.o2Soft} />
            </g>
        )}
    </g>
);
