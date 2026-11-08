import { useMemo } from 'react';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { FadeG } from './DrawPath';
import { seeded } from './geom';
import { GENERA, radiusOf, type Genus } from './oral.content';
import { useTweenVec } from './useTweenVec';

const CX = [150, 322, 484, 628] as const;
const CY = 212;

/** Colônia: círculo com bastonetes dentro; tudo escala com o raio (a área segue a abundância). */
const Colony = ({ g, cx, r, seed }: { g: Genus; cx: number; r: number; seed: number }) => {
    const rods = useMemo(() => {
        const rnd = seeded(seed);
        return Array.from({ length: 22 }, () => ({ a: rnd() * Math.PI * 2, d: Math.sqrt(rnd()) * 0.78, rot: rnd() * 180 }));
    }, [seed]);
    const k = r / 40;
    return (
        <g style={{ filter: `drop-shadow(0 0 10px ${g.color}66)` }}>
            <circle cx={cx} cy={CY} r={r} fill={g.color} fillOpacity={0.14} stroke={g.color} strokeWidth={2.5} />
            {rods.map((p, i) => (
                <ellipse key={i} cx={cx + Math.cos(p.a) * p.d * r} cy={CY + Math.sin(p.a) * p.d * r} rx={4.6 * k} ry={2 * k}
                    transform={`rotate(${p.rot} ${cx + Math.cos(p.a) * p.d * r} ${CY + Math.sin(p.a) * p.d * r})`} fill={g.color} fillOpacity={0.9} />
            ))}
        </g>
    );
};

const TONGUE = (() => {
    let d = 'M20 424 V404';
    for (let x = 20; x < 714; x += 22) d += ` q11 -20 22 0`;
    return `${d} V424 Z`;
})();

interface SceneProps { reduce: boolean; step: number }

/** Passos 1–3: bolhas de Neisseria, Rothia, Prevotella e Veillonella antes e depois de 10 dias de nitrato. */
export const BubbleScene = ({ reduce, step }: SceneProps) => {
    const radii = useTweenVec(GENERA.map(g => radiusOf(g, step >= 1)), reduce, 1400);
    const after = step >= 1;
    return (
        <g>
            <path d={TONGUE} fill="rgba(240,67,126,0.16)" stroke={C.nitrate} strokeOpacity={0.5} strokeWidth={2} />
            <SvgText x={367} y={420} text="dorso da língua" anchor="middle" size={16} color={C.nitrateSoft} weight={600} />
            {step !== 2 && <SvgText x={24} y={36} text={after ? 'depois de 10 dias de nitrato (12 mmol/dia)' : 'antes · abundância relativa (ilustrativa)'} size={18} color={C.text} weight={600} />}
            {GENERA.map((g, i) => (
                <g key={g.name}>
                    <Colony g={g} cx={CX[i]} r={radii[i]} seed={11 + i * 7} />
                    <SvgText x={CX[i]} y={324} text={g.name} anchor="middle" size={18} color={g.color} weight={800} />
                    <FadeG show={after} reduce={reduce} delay={500}>
                        <SvgText x={CX[i]} y={352} text={g.label} anchor="middle" size={26} color={g.delta > 0 ? C.noSoft : C.hypoxia} weight={800} />
                    </FadeG>
                </g>
            ))}
            {step === 1 && !reduce && [90, 250, 410, 560, 660].map((x, i) => (
                <circle key={x} cx={x} cy={60} r={5} fill={C.nitrate}>
                    <animateMotion dur="2.4s" begin={`${i * 0.45}s`} repeatCount="indefinite" path="M0 0 V320" />
                    <animate attributeName="opacity" values="0;1;1;0" dur="2.4s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
                </circle>
            ))}
            <FadeG show={step === 2} reduce={reduce} delay={300}>
                <path d="M92 78 v-10 H380 v10" fill="none" stroke={C.noSoft} strokeWidth={2} />
                <SvgText x={236} y={58} text="↑ abundância → ↑ resposta" anchor="middle" size={18} color={C.noSoft} weight={700} />
                <path d="M432 78 v-10 H690 v10" fill="none" stroke={C.nitrite} strokeWidth={2} />
                <SvgText x={561} y={58} text="↓ abundância → ↑ resposta" anchor="middle" size={18} color={C.nitrite} weight={700} />
                <SvgText x={367} y={384} text="resposta = aumento do nitrito plasmático" anchor="middle" size={16} color={C.muted} weight={500} />
            </FadeG>
        </g>
    );
};
