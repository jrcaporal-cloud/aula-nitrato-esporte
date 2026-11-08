import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { DrawPath, FadeG } from './DrawPath';
import { GLYPH_COLOR, WOMEN_ROWS } from './oral.content';

interface SceneProps { reduce: boolean }

/** Passo 4: limiar funcional. Nitrito salivar sobe com a abundância; o plasmático para de responder. */
export const ThresholdChart = ({ reduce }: SceneProps) => {
    const x = (v: number) => 100 + v * 560;
    const y = (v: number) => 350 - v * 270;
    const saliva = `M${x(0.02)} ${y(0.08)} C${x(0.35)} ${y(0.3)} ${x(0.7)} ${y(0.65)} ${x(1)} ${y(0.95)}`;
    const plasma = `M${x(0.02)} ${y(0.1)} C${x(0.18)} ${y(0.28)} ${x(0.3)} ${y(0.44)} ${x(0.42)} ${y(0.48)} L${x(1)} ${y(0.48)}`;
    return (
        <g>
            <line x1={100} x2={660} y1={350} y2={350} stroke="rgba(255,255,255,0.3)" />
            <line x1={100} x2={100} y1={60} y2={350} stroke="rgba(255,255,255,0.3)" />
            <SvgText x={380} y={394} text="abundância de bactérias redutoras de nitrato →" anchor="middle" size={18} color={C.muted} weight={600} />
            <SvgText x={24} y={40} text="↑ nitrito (curvas ilustrativas)" size={18} color={C.muted} weight={600} />
            <rect x={x(0.42)} y={60} width={x(1) - x(0.42)} height={290} fill={C.text} fillOpacity={0.04} />
            <line x1={x(0.42)} x2={x(0.42)} y1={60} y2={350} stroke={C.text} strokeOpacity={0.5} strokeDasharray="6 6" />
            <SvgText x={x(0.42) + 8} y={84} text="limiar funcional" size={18} color={C.text} weight={700} />
            <DrawPath d={saliva} color={C.nitrite} show reduce={reduce} ms={1300} width={4} />
            <DrawPath d={plasma} color={C.text} show reduce={reduce} ms={1300} delay={500} width={4} />
            <SvgText x={x(0.62)} y={y(0.74) - 14} text="nitrito salivar: sobe" size={18} color={C.nitrite} weight={700} />
            <SvgText x={x(0.62)} y={y(0.48) + 28} text="nitrito plasmático: platô" size={18} color={C.text} weight={700} />
            <FadeG show reduce={reduce} delay={1400}>
                <SvgText x={x(0.71)} y={332} text="mais bactérias, mesma resposta" anchor="middle" size={16} color={C.muted} weight={500} />
            </FadeG>
        </g>
    );
};

/** Passo 5: mulheres × homens (só direção, sem magnitudes). */
export const WomenList = ({ reduce }: SceneProps) => (
    <g>
        <SvgText x={24} y={40} text="mulheres em relação aos homens" size={18} color={C.text} weight={600} />
        {WOMEN_ROWS.map((r, i) => {
            const y = 74 + i * 56;
            return (
                <FadeG key={r.label} show reduce={reduce} delay={i * 160}>
                    <rect x={20} y={y} width={694} height={44} rx={10} fill={r.emphasis ? 'rgba(251,191,36,0.08)' : 'rgba(255,255,255,0.03)'}
                        stroke={r.emphasis ? C.nitrite : 'rgba(255,255,255,0.1)'} strokeOpacity={r.emphasis ? 0.7 : 1} />
                    <SvgText x={36} y={y + 29} text={r.label} size={18} color={C.text} weight={600} />
                    <SvgText x={444} y={y + 33} text={r.glyph} anchor="middle" size={30} color={GLYPH_COLOR[r.glyph]} weight={800} />
                    <SvgText x={476} y={y + 29} text={r.text} size={18} color={r.emphasis ? C.nitrite : C.text} weight={700} />
                </FadeG>
            );
        })}
        <SvgText x={367} y={430} text="mesmas bactérias, atividade diferente" anchor="middle" size={18} color={C.nitrite} weight={700} />
    </g>
);

/** Passo 6: cruzado. 10 dias de nitrato, washout e 2º braço; o retorno da boca ao basal é pergunta aberta. */
export const WashoutTimeline = ({ reduce }: SceneProps) => {
    const x = (d: number) => 80 + d * 21;
    const base = 296;
    const peak = 120;
    const rise = `M${x(0)} ${base} C${x(4)} ${base} ${x(7)} ${peak + 10} ${x(10)} ${peak}`;
    const options = [
        { to: base, label: 'voltou?', color: C.noSoft },
        { to: 208, label: 'parcial?', color: C.nitrite },
        { to: peak, label: 'ainda alto?', color: C.hypoxia },
    ];
    return (
        <g>
            <rect x={x(0)} y={64} width={x(10) - x(0)} height={30} rx={8} fill={C.nitrate} fillOpacity={0.3} stroke={C.nitrate} />
            <SvgText x={(x(0) + x(10)) / 2} y={85} text="1º braço · nitrato 10 dias" anchor="middle" size={16} color={C.nitrateSoft} weight={700} />
            <rect x={x(10)} y={64} width={x(17) - x(10)} height={30} rx={8} fill="none" stroke={C.muted} strokeDasharray="5 5" />
            <SvgText x={(x(10) + x(17)) / 2} y={85} text="washout 7 dias" anchor="middle" size={16} color={C.muted} weight={700} />
            <rect x={x(17)} y={64} width={x(27) - x(17)} height={30} rx={8} fill={C.placebo} fillOpacity={0.25} stroke={C.placebo} />
            <SvgText x={(x(17) + x(27)) / 2} y={85} text="2º braço" anchor="middle" size={16} color={C.placebo} weight={700} />
            <line x1={x(0)} x2={x(27)} y1={base} y2={base} stroke={C.text} strokeOpacity={0.45} strokeDasharray="5 5" />
            <SvgText x={x(27) + 8} y={base + 6} text="basal" size={16} color={C.muted} weight={600} />
            <DrawPath d={rise} color="#A78BFA" show reduce={reduce} ms={1400} width={4} />
            <SvgText x={x(10) - 8} y={peak - 12} text="Neisseria +351%" anchor="end" size={18} color="#C4B5FD" weight={800} />
            {options.map((o, i) => (
                <g key={o.label}>
                    <path d={`M${x(10)} ${peak} C${x(13)} ${peak} ${x(15)} ${o.to} ${x(17)} ${o.to}`} fill="none" stroke={o.color} strokeWidth={3} strokeDasharray="4 8" strokeLinecap="round">
                        {!reduce && <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.6s" repeatCount="indefinite" />}
                    </path>
                    <SvgText x={x(17) + 8} y={o.to + 6 + (i === 2 ? -4 : 0)} text={o.label} size={18} color={o.color} weight={700} />
                </g>
            ))}
            <line x1={x(0)} x2={x(27)} y1={350} y2={350} stroke="rgba(255,255,255,0.3)" />
            {[0, 10, 17, 27].map(d => <SvgText key={d} x={x(d)} y={374} text={`dia ${d}`} anchor="middle" size={16} color={C.muted} weight={500} />)}
            <SvgText x={367} y={418} text="curvas de recuperação hipotéticas: o tempo real não consta no dossiê" anchor="middle" size={16} color={C.muted} weight={500} />
        </g>
    );
};
