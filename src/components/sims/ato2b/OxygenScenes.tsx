import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { useTweenNum } from './useTweenNum';
import { br } from '../kit/format';
import { DrawPath, FadeG } from './DrawPath';
import { linePath, sample } from './geom';
import { PairBars, type PairRow } from './PairBars';
import { EFF_NITRATE, EFF_PLACEBO, SLOW_NITRATE, SLOW_PLACEBO, TTE_NITRATE, TTE_PLACEBO, VO2_NITRATE, VO2_PLACEBO } from './oxygen.content';

interface SceneProps { reduce: boolean; step: number }

const AXIS = 'rgba(255,255,255,0.28)';
const GRID = 'rgba(255,255,255,0.08)';

/** Passos 1–2: VO₂ em carga constante; a curva do nitrato se desenha e a área entre as duas mostra a economia. */
export const SteadyChart = ({ reduce, step }: SceneProps) => {
    const x = (t: number) => 78 + (t / 6) * 552;
    const y = (v: number) => 372 - ((v - 0.5) / 2.9) * 320;
    const curve = (ss: number) => (t: number) => (t < 1 ? 0.5 : 0.5 + (ss - 0.5) * (1 - Math.exp(-(t - 1) / 0.45)));
    const pts = (ss: number) => sample(curve(ss), 0, 6, 120).map(([t, v]) => [x(t), y(v)] as const);
    const placebo = pts(VO2_PLACEBO);
    const nitrate = pts(VO2_NITRATE);
    const band = `${linePath(placebo.slice(60))} ${[...nitrate.slice(60)].reverse().map(([px, py]) => `L${px.toFixed(1)} ${py.toFixed(1)}`).join(' ')} Z`;
    const second = step >= 1;
    return (
        <g>
            {[1, 2, 3].map(v => (
                <g key={v}>
                    <line x1={78} x2={630} y1={y(v)} y2={y(v)} stroke={GRID} />
                    <SvgText x={64} y={y(v) + 6} text={br(v, 1)} anchor="end" size={16} color={C.muted} weight={500} />
                </g>
            ))}
            <line x1={78} x2={630} y1={372} y2={372} stroke={AXIS} />
            {[0, 1, 2, 3, 4, 5, 6].map(t => (
                <SvgText key={t} x={x(t)} y={396} text={String(t)} anchor="middle" size={16} color={C.muted} weight={500} />
            ))}
            <SvgText x={354} y={424} text="tempo (min)" anchor="middle" size={16} color={C.muted} weight={500} />
            <SvgText x={78} y={34} text="VO₂ (L/min)" size={16} color={C.muted} weight={500} />
            <line x1={x(1)} x2={x(1)} y1={52} y2={372} stroke="rgba(255,255,255,0.3)" strokeDasharray="5 5" />
            <SvgText x={x(1) + 8} y={70} text="início da carga" size={16} color={C.muted} weight={500} />
            <path d={band} fill={C.nitrate} style={{ opacity: second ? 0.22 : 0, transition: reduce ? 'none' : 'opacity 700ms ease 900ms' }} />
            <DrawPath d={linePath(placebo)} color={C.placebo} show reduce={reduce} ms={1300} />
            <DrawPath d={linePath(nitrate)} color={C.nitrate} show={second} reduce={reduce} ms={1300} delay={150} />
            <SvgText x={630} y={84} text={`${br(VO2_PLACEBO, 2)} L/min`} anchor="end" size={18} color={C.placebo} weight={700} />
            <FadeG show={second} reduce={reduce} delay={900}>
                <SvgText x={630} y={150} text={`${br(VO2_NITRATE, 2)} L/min`} anchor="end" size={18} color={C.nitrateSoft} weight={700} />
                <path d={`M648 ${y(VO2_PLACEBO)} h8 V${y(VO2_NITRATE)} h-8`} fill="none" stroke={C.text} strokeWidth={2} />
                <SvgText x={662} y={(y(VO2_PLACEBO) + y(VO2_NITRATE)) / 2 + 7} text="−5,4%" size={20} color={C.nitrateSoft} weight={800} />
            </FadeG>
            <FadeG show={!second} reduce={reduce}>
                <SvgText x={354} y={178} text="mesma carga → mesmo O₂?" anchor="middle" size={20} color={C.placebo} weight={600} />
            </FadeG>
        </g>
    );
};

/** Passo 3: dois anéis de eficiência bruta (fatia que vira trabalho). */
export const EfficiencyRings = ({ reduce }: SceneProps) => {
    const f = useTweenNum(1, reduce, 1400);
    const R = 92;
    const circ = 2 * Math.PI * R;
    const ring = (cx: number, eff: number, color: string, label: string, soft: string) => (
        <g>
            <circle cx={cx} cy={206} r={R} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={26} />
            <circle cx={cx} cy={206} r={R} fill="none" stroke={color} strokeWidth={26} strokeLinecap="butt"
                strokeDasharray={`${(eff / 100) * circ * f} ${circ}`} transform={`rotate(-90 ${cx} 206)`} />
            <SvgText x={cx} y={216} text={`${br(eff, 1)}%`} anchor="middle" size={38} color={soft} weight={800} />
            <SvgText x={cx} y={338} text={label} anchor="middle" size={20} color={color === C.placebo ? C.placebo : C.nitrateSoft} weight={700} />
            <SvgText x={cx} y={364} text="o resto se perde como calor" anchor="middle" size={16} color={C.muted} weight={500} />
        </g>
    );
    return (
        <g>
            <SvgText x={367} y={40} text="eficiência bruta = trabalho mecânico ÷ energia gasta" anchor="middle" size={18} color={C.text} weight={600} />
            {ring(190, EFF_PLACEBO, C.placebo, 'placebo (NaCl)', C.text)}
            {ring(544, EFF_NITRATE, C.nitrate, 'nitrato (NaNO₃)', C.text)}
            <path d="M300 206 h72" stroke={C.nitrateSoft} strokeWidth={3} markerEnd="url(#oxArrow)" fill="none" />
            <defs>
                <marker id="oxArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                    <path d="M0 0 L10 5 L0 10 z" fill={C.nitrateSoft} />
                </marker>
            </defs>
            <SvgText x={336} y={186} text="+1,4" anchor="middle" size={22} color={C.nitrateSoft} weight={800} />
            <SvgText x={336} y={240} text="pontos" anchor="middle" size={16} color={C.muted} weight={500} />
            <SvgText x={367} y={414} text="mesma carga, mesmo trabalho: o que muda é o gasto" anchor="middle" size={18} color={C.muted} weight={500} />
        </g>
    );
};

const ROWS: readonly PairRow[] = [
    { label: 'VO₂ submáximo', ratio: 0.946, note: '−5,4%', accent: true },
    { label: 'Frequência cardíaca', ratio: 1, note: '= sem diferença' },
    { label: 'Lactato', ratio: 1, note: '= sem diferença' },
    { label: 'Ventilação', ratio: 1, note: '= sem diferença' },
    { label: 'VE/VO₂', ratio: 1, note: '= sem diferença' },
    { label: 'Razão de troca (RER)', ratio: 1, note: '= sem diferença' },
];

/** Passo 4: seis medidores; só o VO₂ se mexe. Comprimentos ilustrativos, a diferença é dado. */
export const UnchangedBars = ({ reduce }: SceneProps) => (
    <PairBars rows={ROWS} reduce={reduce} title="placebo × nitrato, nas mesmas cargas" />
);

/** Passo 5: exercício severo (Bailey 2009). O componente lento encolhe e a prova dura mais. */
export const SlowChart = ({ reduce }: SceneProps) => {
    const x = (s: number) => 78 + (s / 700) * 552;
    const y = (v: number) => 372 - ((v - 0.5) / 3.1) * 320;
    const fast = 2.7;
    const curve = (slow: number, end: number) => (s: number) => {
        const rise = 0.5 + (fast - 0.5) * (1 - Math.exp(-s / 38));
        const drift = s > 120 ? slow * ((s - 120) / (end - 120)) : 0;
        return rise + drift;
    };
    const path = (slow: number, end: number) => linePath(sample(curve(slow, end), 0, end, 100).map(([s, v]) => [x(s), y(v)] as const));
    const endPlacebo = fast + SLOW_PLACEBO;
    const endNitrate = fast + SLOW_NITRATE;
    return (
        <g>
            {[1, 2, 3].map(v => (
                <g key={v}>
                    <line x1={78} x2={630} y1={y(v)} y2={y(v)} stroke={GRID} />
                    <SvgText x={64} y={y(v) + 6} text={br(v, 1)} anchor="end" size={16} color={C.muted} weight={500} />
                </g>
            ))}
            <line x1={78} x2={630} y1={372} y2={372} stroke={AXIS} />
            {[0, 200, 400, 600].map(s => <SvgText key={s} x={x(s)} y={396} text={String(s)} anchor="middle" size={16} color={C.muted} weight={500} />)}
            <SvgText x={354} y={424} text="tempo no exercício severo (s)" anchor="middle" size={16} color={C.muted} weight={500} />
            <SvgText x={78} y={34} text="VO₂ (L/min)" size={16} color={C.muted} weight={500} />
            <line x1={x(120)} x2={630} y1={y(fast)} y2={y(fast)} stroke="rgba(255,255,255,0.35)" strokeDasharray="5 5" />
            <SvgText x={x(120) + 6} y={y(fast) + 24} text="fim da fase rápida" size={16} color={C.muted} weight={500} />
            <DrawPath d={path(SLOW_PLACEBO, TTE_PLACEBO)} color={C.placebo} show reduce={reduce} ms={1400} />
            <DrawPath d={path(SLOW_NITRATE, TTE_NITRATE)} color={C.nitrate} show reduce={reduce} ms={1500} delay={300} />
            {[
                { end: TTE_PLACEBO, v: endPlacebo, color: C.placebo, label: `${TTE_PLACEBO} s` },
                { end: TTE_NITRATE, v: endNitrate, color: C.nitrate, label: `${TTE_NITRATE} s` },
            ].map(m => (
                <g key={m.label}>
                    <line x1={x(m.end)} x2={x(m.end)} y1={y(m.v)} y2={372} stroke={m.color} strokeDasharray="4 5" opacity={0.7} />
                    <circle cx={x(m.end)} cy={y(m.v)} r={6} fill={m.color} />
                    <SvgText x={x(m.end)} y={414} text={m.label} anchor="middle" size={16} color={m.color === C.nitrate ? C.nitrateSoft : C.placebo} weight={700} />
                </g>
            ))}
            <SvgText x={90} y={62} text={`placebo: componente lento ${br(SLOW_PLACEBO, 2)} L/min`} size={18} color={C.placebo} weight={700} />
            <SvgText x={90} y={88} text={`nitrato: componente lento ${br(SLOW_NITRATE, 2)} L/min`} size={18} color={C.nitrateSoft} weight={700} />
        </g>
    );
};
