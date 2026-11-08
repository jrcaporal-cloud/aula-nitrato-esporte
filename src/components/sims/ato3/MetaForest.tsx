import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import type { ForestGroup, MetaRow } from './forest.content';

/**
 * Floresta de meta-análises (viewBox 740 × 360, escala 1:1). As linhas ficam sempre no mesmo lugar;
 * as ainda não reveladas apagam, as fora de foco esmaecem. Faixa cinza = tamanho de efeito trivial (< 0,2).
 */
export const MW = 740;
export const MH = 360;
const LABEL_W = 285;
const VALUE_W = 190;
const X0 = LABEL_W;
const X1 = MW - VALUE_W;
const DOMAIN = [-0.2, 0.6] as const;
const TICKS = [-0.2, 0, 0.2, 0.4, 0.6];
const TOP = 36;
const ROW_H = 38;
/** Número com vírgula e sinal de menos tipográfico. */
const f2 = (n: number) => br(n, 2).replace('-', '−');
const sx = (v: number) => X0 + ((v - DOMAIN[0]) / (DOMAIN[1] - DOMAIN[0])) * (X1 - X0);

interface Props {
    rows: readonly MetaRow[];
    shown: readonly ForestGroup[];
    focus: readonly ForestGroup[];
}

export const MetaForest = ({ rows, shown, focus }: Props) => {
    const axisY = TOP + ROW_H * rows.length + 4;
    return (
        <svg viewBox={`0 0 ${MW} ${MH}`} width={MW} height={MH} role="img" aria-label="Meta-análises do nitrato no desempenho de resistência">
            <rect x={sx(DOMAIN[0])} y={TOP - 8} width={sx(0.2) - sx(DOMAIN[0])} height={axisY - TOP + 8} fill={C.placebo} fillOpacity={0.16} />
            <SvgText x={(sx(DOMAIN[0]) + sx(0.2)) / 2} y={22} text="faixa trivial" size={16} weight={600} anchor="middle" color={C.placebo} />
            {TICKS.map(t => (
                <g key={t}>
                    <line x1={sx(t)} x2={sx(t)} y1={TOP - 8} y2={axisY} stroke="rgba(255,255,255,0.07)" />
                    <SvgText x={sx(t)} y={axisY + 24} text={t === 0 ? '0' : br(t, 1)} size={16} anchor="middle" weight={500} color={C.muted} />
                </g>
            ))}
            <line x1={sx(0)} x2={sx(0)} y1={TOP - 8} y2={axisY} stroke="rgba(255,255,255,0.5)" strokeDasharray="5 5" />
            <line x1={X0} x2={X1} y1={axisY} y2={axisY} stroke="rgba(255,255,255,0.25)" />
            <SvgText x={(X0 + X1) / 2} y={axisY + 48} text="tamanho de efeito (d, SMD ou g) → melhor" size={16} anchor="middle" weight={500} color="#CBD5E1" />
            {rows.map((r, i) => {
                const cy = TOP + ROW_H * i + ROW_H / 2;
                const visible = shown.includes(r.group);
                const dim = focus.length > 0 && !focus.includes(r.group);
                const has = r.est !== undefined && r.lo !== undefined && r.hi !== undefined;
                const right = has ? `${f2(r.est!)} (${f2(r.lo!)} a ${f2(r.hi!)})` : '';
                return (
                    <g key={r.id} style={{ opacity: visible ? (dim ? 0.3 : 1) : 0, transition: 'opacity 0.45s' }}>
                        <SvgText x={0} y={cy - 2} text={r.label} size={17} weight={700} color={r.group === 'geral' ? '#fff' : '#E5E7EB'} />
                        <SvgText x={0} y={cy + 15} text={r.sub} size={16} weight={400} color={C.muted} />
                        {has ? (
                            <>
                                <line x1={sx(r.lo!)} x2={sx(r.hi!)} y1={cy} y2={cy} stroke={r.color} strokeWidth={3} strokeLinecap="round" />
                                <polygon points={`${sx(r.lo!)},${cy} ${sx(r.est!)},${cy - 10} ${sx(r.hi!)},${cy} ${sx(r.est!)},${cy + 10}`}
                                    fill={r.color} fillOpacity={0.9} stroke="#fff" strokeOpacity={0.7} />
                                <SvgText x={MW} y={cy + 6} text={right} size={17} weight={700} anchor="end" color={r.color} />
                            </>
                        ) : (
                            <SvgText x={(X0 + X1) / 2} y={cy + 6} text={r.text ?? ''} size={16} weight={600} anchor="middle" color={C.muted} />
                        )}
                    </g>
                );
            })}
        </svg>
    );
};
