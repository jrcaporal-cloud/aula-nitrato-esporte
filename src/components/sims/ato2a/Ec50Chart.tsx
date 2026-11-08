import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br } from '../kit/format';
import { EC50_ACID, EC50_NEUTRAL, ec50At } from './pathwayModel';

/** Relaxamento da aorta de rato contra a concentração de nitrito (SVG 430×228). Só as EC₅₀ são dados; a curva é ilustrativa. */
export const EC_W = 430;
export const EC_H = 228;

const X0 = 24;
const X1 = 410;
const Y0 = 56;
const Y1 = 166;
const LOG_MIN = 0;
const LOG_MAX = 3.3;
const xOf = (conc: number) => X0 + ((Math.log10(conc) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (X1 - X0);
const yOf = (r: number) => Y1 - r * (Y1 - Y0);

const curve = (ec50: number): string => {
    let d = '';
    for (let l = LOG_MIN; l <= LOG_MAX + 0.001; l += 0.05) {
        const conc = 10 ** l;
        d += `${d ? 'L' : 'M'}${xOf(conc).toFixed(1)} ${yOf(1 / (1 + ec50 / conc)).toFixed(1)}`;
    }
    return d;
};

export const Ec50Chart = ({ ph }: { ph: number }) => {
    const ec = ec50At(ph);
    return (
        <svg width={EC_W} height={EC_H} viewBox={`0 0 ${EC_W} ${EC_H}`} role="img"
            aria-label="Relaxamento vascular conforme a concentração de nitrito, em pH 7,4 e 6,6">
            <SvgText x={X0} y={24} text="EC₅₀ do nitrito" size={17} weight={700} color={C.muted} />
            <SvgText x={X1} y={26} text={`${br(ec, 0)} µM`} size={24} weight={700} anchor="end" color={C.hypoxia} />
            <line x1={X0} y1={yOf(0.5)} x2={X1} y2={yOf(0.5)} stroke="rgba(255,255,255,0.12)" strokeDasharray="3 5" />
            <SvgText x={X0 + 2} y={yOf(0.5) - 6} text="50%" size={16} color={C.muted} />
            <line x1={X0} y1={Y1} x2={X1} y2={Y1} stroke="rgba(255,255,255,0.3)" />

            <path d={curve(EC50_NEUTRAL)} fill="none" stroke={C.placebo} strokeWidth={2} strokeDasharray="5 6" />
            <path d={curve(EC50_ACID)} fill="none" stroke={C.hypoxia} strokeWidth={2} strokeDasharray="5 6" opacity={0.5} />
            <path d={curve(ec)} fill="none" stroke={C.hypoxia} strokeWidth={3.5} strokeLinecap="round" />

            <circle cx={xOf(EC50_NEUTRAL)} cy={yOf(0.5)} r={5} fill={C.placebo} />
            <SvgText x={xOf(EC50_NEUTRAL) + 8} y={yOf(0.5) + 24} text="200 · pH 7,4" size={16} color={C.placebo} />
            <circle cx={xOf(EC50_ACID)} cy={yOf(0.5)} r={5} fill={C.hypoxia} />
            <SvgText x={xOf(EC50_ACID) - 8} y={yOf(0.5) - 22} text="40 · pH 6,6" size={16} anchor="end" color={C.hypoxia} />
            <circle cx={xOf(ec)} cy={yOf(0.5)} r={7} fill="#fff" stroke={C.hypoxia} strokeWidth={3} />

            {[1, 10, 100, 1000].map(c => (
                <g key={c}>
                    <line x1={xOf(c)} y1={Y1} x2={xOf(c)} y2={Y1 + 5} stroke="rgba(255,255,255,0.3)" />
                    <SvgText x={xOf(c)} y={Y1 + 24} text={`${c}`} size={16} anchor={c === 1 ? 'start' : 'middle'} color={C.muted} />
                </g>
            ))}
            <SvgText x={X1} y={EC_H - 6} text="nitrito (µM, escala log) · aorta de rato" size={16} anchor="end" color={C.muted} />
        </svg>
    );
};
