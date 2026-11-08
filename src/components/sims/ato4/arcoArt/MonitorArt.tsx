import { motion } from 'framer-motion';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { Heart, Lungs } from '../../ato3/artKit/Figures';
import type { Trial } from '../pilotContent';

/**
 * Passos 1–4 do slide 34 como um monitor cardíaco: cada ensaio de ICFEp é um "batimento" cuja altura é a diferença
 * de VO₂pico (mL/kg/min) — o sinal encolhe até virar linha reta. Área da bolha = n. A DPOC tem faixa própria (metros).
 * viewBox 720 × 448.
 */

const YEAR_X = (y: number) => 110 + (y - 2014) * (580 / 12);
const ZERO_Y = 170;
const PER_UNIT = 66;
const radius = (n: number) => 4.4 * Math.sqrt(n);

const TRIALS: readonly Trial[] = [
    { id: 'z15', year: 2015, name: 'Zamani 2015', n: 17, detail: '12,6 vs 11,6', effect: 1.0, color: C.no, fromStep: 0 },
    { id: 'indie', year: 2018, name: 'INDIE-HFpEF 2018', n: 105, detail: '13,5 vs 13,7', effect: -0.2, color: C.placebo, fromStep: 1, note: 'nitrito inalado' },
    { id: 'z25', year: 2025, name: 'Zamani 2025', n: 84, detail: '10,23 vs 10,17', effect: 0.06, color: C.placebo, fromStep: 2 },
];

/** Traçado tipo ECG até o último ensaio visível. */
const trace = (step: number): string => {
    const shown = TRIALS.filter(t => t.fromStep <= step);
    const beats = shown.map(t => {
        const x = YEAR_X(t.year);
        const tip = ZERO_Y - (t.effect ?? 0) * PER_UNIT;
        return `L ${x - 22} ${ZERO_Y} L ${x - 15} ${ZERO_Y - 5} L ${x - 9} ${ZERO_Y} L ${x - 4} ${ZERO_Y + 6} L ${x} ${tip.toFixed(1)} L ${x + 5} ${ZERO_Y + 8} L ${x + 10} ${ZERO_Y}`;
    }).join(' ');
    return `M 96 ${ZERO_Y} ${beats} L 704 ${ZERO_Y}`;
};

const Bubble = ({ t, step }: { t: Trial; step: number }) => {
    const x = YEAR_X(t.year);
    const r = radius(t.n);
    const y = ZERO_Y - (t.effect ?? 0) * PER_UNIT;
    const current = step === t.fromStep;
    const label = t.id === 'z25' ? { x: 704, y: 64, anchor: 'end' as const } : { x: x + r + 14, y: y - (t.note ? 14 : 4), anchor: 'start' as const };
    return (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: current ? 1 : 0.6 }} transition={{ duration: 0.5, delay: current ? 0.6 : 0 }}>
            <circle cx={x} cy={y} r={r} fill={t.color} fillOpacity={0.22} stroke={t.color} strokeWidth={current ? 4 : 2.5} strokeDasharray={t.note ? '8 6' : undefined}
                style={current ? { filter: `drop-shadow(0 0 10px ${t.color})` } : undefined} />
            {t.note && <circle cx={x} cy={y} r={r + 7} fill="none" stroke={C.nitrite} strokeWidth={2} strokeDasharray="3 5" />}
            <SvgText x={label.x} y={label.y} text={t.name} size={18} weight={700} color="#fff" anchor={label.anchor} />
            <SvgText x={label.x} y={label.y + 22} text={`n = ${t.n} · ${t.detail}`} size={16} weight={500} color="#CBD5E1" anchor={label.anchor} />
            {t.note && <SvgText x={label.x} y={label.y + 44} text={t.note} size={16} weight={700} color={C.nitrite} anchor={label.anchor} />}
        </motion.g>
    );
};

const Dpoc = ({ on, reduce }: { on: boolean; reduce: boolean }) => {
    return (
        <g opacity={on ? 1 : 0.35} style={{ transition: 'opacity 0.5s' }}>
            <Lungs x={52} y={364} s={1.05} color={C.o2} />
            <SvgText x={110} y={304} text="DPOC · outra unidade (metros no shuttle walk)" size={17} weight={700} color="#E5E7EB" />
            {on && ([['placebo', 30, C.placebo, 0], ['beterraba', 60, C.no, 0.15]] as const).map(([k, m, color, d], i) => (
                <g key={k}>
                    <SvgText x={110} y={344 + i * 42} text={k} size={16} weight={600} color={i === 0 ? '#CBD5E1' : C.noSoft} />
                    <motion.rect x={200} y={326 + i * 42} width={m * 4.6} height={26} rx={6} fill={color} fillOpacity={0.85}
                        style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
                        initial={{ scaleX: reduce ? 1 : 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : d, ease: 'easeOut' }} />
                    <SvgText x={208 + m * 4.6} y={345 + i * 42} text={`+${m} m`} size={18} weight={700} color="#fff" />
                </g>
            ))}
            {on && <SvgText x={110} y={424} text="efeito: 30 m (IC95% 10 a 40), só com reabilitação" size={16} weight={600} color={C.noSoft} />}
            {on && (
                <g>
                    <circle cx={624} cy={366} r={radius(165)} fill={C.no} fillOpacity={0.2} stroke={C.no} strokeWidth={4} style={{ filter: `drop-shadow(0 0 10px ${C.no})` }} />
                    <SvgText x={624} y={362} text="ON-EPIC" size={17} weight={700} anchor="middle" color="#fff" />
                    <SvgText x={624} y={384} text="n = 165" size={16} weight={600} anchor="middle" color="#E5E7EB" />
                </g>
            )}
        </g>
    );
};

export const MonitorArt = ({ step, reduce }: { step: number; reduce: boolean }) => (
    <svg viewBox="0 0 720 448" width="100%" height="100%" role="img" aria-label="Ensaios de nitrato em insuficiência cardíaca como um traçado de monitor; DPOC embaixo">
        <defs>
            <pattern id="arc-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 H 0 V 24" fill="none" stroke={C.no} strokeOpacity={0.07} />
            </pattern>
        </defs>
        <rect width={720} height={448} fill="url(#arc-grid)" />
        <Heart x={52} y={150} s={1.15} color={C.nitrate} beat={!reduce} />
        <SvgText x={20} y={30} text="ICFEp · diferença de VO₂pico (mL/kg/min) · linha = 0" size={17} weight={700} color="#E5E7EB" />
        <line x1={96} x2={704} y1={ZERO_Y} y2={ZERO_Y} stroke="rgba(255,255,255,0.25)" strokeDasharray="6 6" />
        <motion.path key={step} d={trace(step)} fill="none" stroke={C.no} strokeWidth={3} strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 5px ${C.no})` }}
            initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduce ? 0 : 1.2, ease: 'easeInOut' }} />
        {!reduce && (
            <circle key={`dot-${step}`} r={5} fill="#fff" style={{ filter: `drop-shadow(0 0 6px ${C.no})` }}>
                <animateMotion dur="3s" repeatCount="indefinite" path={trace(step)} />
            </circle>
        )}
        {TRIALS.filter(t => t.fromStep <= step).map(t => <Bubble key={t.id} t={t} step={step} />)}
        <line x1={24} x2={696} y1={272} y2={272} stroke="rgba(255,255,255,0.1)" />
        {[2015, 2018, 2025].map(y => <SvgText key={y} x={YEAR_X(y)} y={258} text={String(y)} size={16} weight={500} color={C.muted} anchor="middle" />)}
        <Dpoc on={step >= 3} reduce={reduce} />
    </svg>
);
