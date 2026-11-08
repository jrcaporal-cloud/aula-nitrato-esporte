import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { useEntered } from './hooks';

/**
 * Potência × tempo no início de um Wingate: o pico é o mesmo, a curva com nitrato chega a ele antes.
 * Forma ilustrativa; a diferença de −2,8% do estudo está ampliada ~5× para ser vista. viewBox 720 × 448.
 */

const X0 = 80;
const X1 = 690;
const Y0 = 400;
const Y1 = 80;
const TMAX = 7;
const PEAK_W = 1338;
const px = (t: number) => X0 + (t / TMAX) * (X1 - X0);
const py = (w: number) => Y0 - (w / 1600) * (Y0 - Y1);

const TAU_RISE = 0.95;
const TAU_DECAY = 15;
/** −2,8% do estudo ampliado ~5× para ser visto. */
const EARLIER = 0.86;

const shape = (t: number) => (1 - Math.exp(-t / TAU_RISE)) * Math.exp(-t / TAU_DECAY);

const peakTime = (): number => {
    let best = { t: 0, v: 0 };
    for (let t = 0.02; t <= TMAX; t += 0.02) {
        const v = shape(t);
        if (v > best.v) best = { t, v };
    }
    return best.t;
};

const TP = peakTime();
const TN = TP * EARLIER;
const NORM = shape(TP);
const placebo = (t: number) => (shape(t) / NORM) * PEAK_W;
/** Com nitrato: sobe mais cedo até o mesmo pico, segura o platô e volta a coincidir com o placebo depois dele. */
const nitrate = (t: number) => (t <= TN ? placebo((t * TP) / TN) : t < TP ? PEAK_W : placebo(t));

const curve = (fn: (t: number) => number): string => {
    const pts: string[] = [];
    for (let t = 0; t <= TMAX + 0.001; t += 0.05) pts.push(`${px(t).toFixed(1)},${py(fn(t)).toFixed(1)}`);
    return `M ${pts.join(' L ')}`;
};

export const WingateChart = ({ reduce }: { reduce: boolean }) => {
    const go = useEntered(reduce);
    const tp = TP;
    const tn = TN;
    const draw = (delay: number) => ({ strokeDasharray: 1, strokeDashoffset: go ? 0 : 1, transition: `stroke-dashoffset 1.2s ease-out ${delay}s` });
    return (
        <svg viewBox="0 0 720 448" width="100%" height="100%" role="img" aria-label="Potência no Wingate: mesmo pico, chegada mais cedo com nitrato">
            <SvgText x={X0 - 12} y={42} text="Potência (W)" size={17} weight={700} color="#E5E7EB" />
            {[0, 500, 1000, 1500].map(w => (
                <g key={w}>
                    <line x1={X0} x2={X1} y1={py(w)} y2={py(w)} stroke="rgba(255,255,255,0.07)" />
                    <SvgText x={X0 - 10} y={py(w) + 5} text={w.toLocaleString('pt-BR')} size={16} weight={500} color={C.muted} anchor="end" />
                </g>
            ))}
            <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="rgba(255,255,255,0.3)" />
            <SvgText x={X1} y={Y0 + 30} text="tempo desde a largada →" size={16} weight={500} color="#CBD5E1" anchor="end" />
            <line x1={X0} x2={X1} y1={py(PEAK_W)} y2={py(PEAK_W)} stroke="rgba(255,255,255,0.45)" strokeDasharray="6 6" />
            <SvgText x={X1} y={py(PEAK_W) - 12} text="mesmo pico: 1.338 vs 1.333 W (P = 0,62)" size={17} weight={700} color="#fff" anchor="end" />
            <path d={curve(placebo)} pathLength={1} fill="none" stroke={C.placebo} strokeWidth={3.5} strokeLinecap="round" style={draw(0)} />
            <path d={curve(nitrate)} pathLength={1} fill="none" stroke={C.nitrate} strokeWidth={4.5} strokeLinecap="round" style={draw(0.25)} />
            <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.5s ease 1.1s' }}>
                <line x1={px(tn)} x2={px(tn)} y1={py(PEAK_W)} y2={Y0} stroke={C.nitrateSoft} strokeDasharray="3 5" />
                <line x1={px(tp)} x2={px(tp)} y1={py(PEAK_W)} y2={Y0} stroke="#CBD5E1" strokeDasharray="3 5" />
                <path d={`M ${px(tn)} ${Y0 - 28} H ${px(tp)}`} stroke="#fff" strokeWidth={3} strokeLinecap="round" />
                <SvgText x={px(tp) + 10} y={Y0 - 24} text="−2,8% no tempo até o pico" size={17} weight={700} color={C.nitrateSoft} />
                <circle cx={px(tn)} cy={py(PEAK_W)} r={7} fill={C.nitrate} stroke="#fff" strokeWidth={2} />
                <circle cx={px(tp)} cy={py(PEAK_W)} r={7} fill={C.placebo} stroke="#fff" strokeWidth={2} />
            </g>
            <g>
                <line x1={px(3.6)} x2={px(3.6) + 34} y1={py(620)} y2={py(620)} stroke={C.nitrate} strokeWidth={4.5} strokeLinecap="round" />
                <SvgText x={px(3.6) + 44} y={py(620) + 6} text="beterraba" size={18} weight={700} color={C.nitrateSoft} />
                <line x1={px(3.6)} x2={px(3.6) + 34} y1={py(520)} y2={py(520)} stroke={C.placebo} strokeWidth={3.5} strokeLinecap="round" />
                <SvgText x={px(3.6) + 44} y={py(520) + 6} text="placebo" size={18} weight={700} color="#CBD5E1" />
            </g>
        </svg>
    );
};
