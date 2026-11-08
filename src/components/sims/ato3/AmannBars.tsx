import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { SvgCount, SvgReveal } from './beat';
import { AMANN } from './tteTt.content';
import { TH, TW } from './TteBars';

/** AMANN2008 (viewBox 600 × 360): mudança no desempenho de 8 ciclistas, normóxia → hipóxia e → hiperóxia. */

const ZERO = 216;
const PX = 1.3;
const BAR_W = 96;
const CENTERS = [170, 440] as const;

const fmt = (n: number) => `${n > 0 ? '+' : '−'}${Math.abs(n).toString().replace('.', ',')}%`;

export const AmannBars = () => (
    <svg viewBox={`0 0 ${TW} ${TH}`} width={TW} height={TH} role="img" aria-label="Hipóxia e hiperóxia medidas por TTE e por contrarrelógio">
        <line x1={20} x2={TW - 8} y1={ZERO} y2={ZERO} stroke="rgba(255,255,255,0.4)" />
        <SvgText x={TW - 8} y={ZERO - 8} text="↑ melhor" size={16} anchor="end" color={C.muted} weight={500} />
        <SvgText x={TW - 8} y={ZERO + 22} text="↓ pior" size={16} anchor="end" color={C.muted} weight={500} />
        {AMANN.map((a, i) => {
            const bars = [
                { id: 'tte', value: a.tte, text: `TTE ${fmt(a.tte)}`, sub: `± ${a.tteSd}%`, color: C.nitrite, x: CENTERS[i] - BAR_W - 10 },
                { id: 'tt', value: a.tt, text: `tempo ${a.tt < 0 ? '+' : '−'}${Math.abs(a.tt).toString().replace('.', ',')}%`, sub: `± ${a.ttSd.toString().replace('.', ',')}%`, color: C.no, x: CENTERS[i] + 10 },
            ];
            return (
                <g key={a.id}>
                    {bars.map(b => {
                        const h = Math.abs(b.value) * PX;
                        const up = b.value > 0;
                        const y = up ? ZERO - h : ZERO;
                        return (
                            <g key={b.id}>
                                <rect x={b.x} y={y} width={BAR_W} height={Math.max(h, 3)} rx={4} fill={b.color} fillOpacity={0.92} />
                                <SvgReveal order={1}>
                                    <SvgCount x={b.x + BAR_W / 2} y={up ? y - 28 : y + h + 24} text={b.text} size={19} weight={700} anchor="middle" color="#fff" />
                                </SvgReveal>
                                <SvgReveal order={2}>
                                    <SvgText x={b.x + BAR_W / 2} y={up ? y - 8 : y + h + 44} text={b.sub} size={16} weight={500} anchor="middle" color={C.muted} />
                                </SvgReveal>
                            </g>
                        );
                    })}
                    <SvgText x={CENTERS[i]} y={TH - 8} text={`Normóxia → ${a.label.toLowerCase()}`} size={18} weight={700} anchor="middle" color="#fff" />
                </g>
            );
        })}
    </svg>
);
