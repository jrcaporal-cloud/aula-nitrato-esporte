import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import type { Trial } from './pilotContent';

/**
 * Linha do tempo dos ensaios: área da bolha proporcional ao n; na faixa de cima, a altura é a diferença de VO₂pico
 * (ICFEp), que encolhe até o zero conforme o ensaio cresce; DPOC em faixa própria (outra unidade: metros). viewBox 720 × 448.
 */

const YEAR_X = (y: number) => 70 + (y - 2014) * (620 / 12);
const ZERO_Y = 168;
const PER_UNIT = 66;
const DPOC_Y = 352;
const radius = (n: number) => 4.4 * Math.sqrt(n);

const TRIALS: readonly Trial[] = [
    { id: 'z15', year: 2015, name: 'Zamani 2015', n: 17, detail: '12,6 vs 11,6', effect: 1.0, color: C.no, fromStep: 0 },
    { id: 'indie', year: 2018, name: 'INDIE-HFpEF 2018', n: 105, detail: '13,5 vs 13,7', effect: -0.2, color: C.placebo, fromStep: 1, note: 'nitrito inalado' },
    { id: 'dpoc', year: 2020, name: 'ON-EPIC 2020 · DPOC', n: 165, detail: '+30 m (10 a 40)', color: C.no, fromStep: 3 },
    { id: 'z25', year: 2025, name: 'Zamani 2025', n: 84, detail: '10,23 vs 10,17', effect: 0.06, color: C.placebo, fromStep: 2 },
];

interface BubbleProps {
    t: Trial;
    step: number;
}

const Bubble = ({ t, step }: BubbleProps) => {
    const x = YEAR_X(t.year);
    const r = radius(t.n);
    const y = t.effect === undefined ? DPOC_Y : ZERO_Y - t.effect * PER_UNIT;
    const shown = step >= t.fromStep;
    const current = step === t.fromStep;
    // Rótulos ao lado da bolha, sem cobrir os vizinhos.
    const label = (() => {
        if (t.id === 'z25') return { x: 700, y: 84, anchor: 'end' as const };
        return { x: x + r + 16, y: y - (t.note ? 10 : 4), anchor: 'start' as const };
    })();
    return (
        <g style={{ opacity: shown ? (current ? 1 : 0.55) : 0, transition: 'opacity 0.5s' }}>
            {t.effect !== undefined && <line x1={x} x2={x} y1={ZERO_Y} y2={y} stroke={t.color} strokeWidth={4} strokeLinecap="round" />}
            <circle cx={x} cy={y} r={r} fill={t.color} fillOpacity={0.3} stroke={t.color} strokeWidth={current ? 4 : 2.5}
                strokeDasharray={t.note ? '8 6' : undefined} />
            {t.note && <circle cx={x} cy={y} r={r + 7} fill="none" stroke={C.nitrite} strokeWidth={2} strokeDasharray="3 5" />}
            <SvgText x={label.x} y={label.y} text={t.name} size={18} weight={700} color="#fff" anchor={label.anchor} />
            <SvgText x={label.x} y={label.y + 22} text={`n = ${t.n} · ${t.detail}`} size={16} weight={500} color={C.muted} anchor={label.anchor} />
            {t.note && <SvgText x={label.x} y={label.y + 44} text={t.note} size={16} weight={700} color={C.nitrite} anchor={label.anchor} />}
        </g>
    );
};

export const PilotBubbles = ({ step }: { step: number }) => (
    <svg viewBox="0 0 720 448" width="100%" height="100%" role="img" aria-label="Ensaios de nitrato em insuficiência cardíaca e DPOC, bolhas proporcionais ao n">
        <SvgText x={20} y={30} text="ICFEp · diferença de VO₂pico (mL/kg/min) · tracejado = 0" size={17} weight={700} color="#E5E7EB" />
        <line x1={40} x2={700} y1={ZERO_Y} y2={ZERO_Y} stroke="rgba(255,255,255,0.4)" strokeDasharray="6 6" />
        <line x1={40} x2={700} y1={270} y2={270} stroke="rgba(255,255,255,0.1)" />
        <SvgText x={20} y={294} text="DPOC · outra unidade (metros no shuttle walk)" size={17} weight={700} color="#E5E7EB" />
        <line x1={40} x2={700} y1={424} y2={424} stroke="rgba(255,255,255,0.3)" />
        {[2015, 2018, 2020, 2025].map(y => (
            <g key={y}>
                <line x1={YEAR_X(y)} x2={YEAR_X(y)} y1={420} y2={430} stroke="rgba(255,255,255,0.4)" />
                <SvgText x={YEAR_X(y)} y={444} text={String(y)} size={16} weight={500} color={C.muted} anchor="middle" />
            </g>
        ))}
        {TRIALS.map(t => <Bubble key={t.id} t={t} step={step} />)}
    </svg>
);
