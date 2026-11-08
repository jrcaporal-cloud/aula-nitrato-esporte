import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { FadeG } from './DrawPath';
import { seeded } from './geom';

interface SceneProps { reduce: boolean }

const FAST = C.hypoxia;
const SLOW = C.placebo;

/** Passo 1: fibras isoladas de camundongo (rápida e lenta), com água ou nitrato. Pontos de Ca²⁺ ilustrativos. */
const Fiber = ({ cx, y, color, dots, force, reduce, seed }: { cx: number; y: number; color: string; dots: number; force: number; reduce: boolean; seed: number }) => {
    const rnd = seeded(seed);
    const pts = Array.from({ length: dots }, () => ({ x: cx - 140 + rnd() * 280, y: y + 10 + rnd() * 44, d: 1.4 + rnd() * 1.2 }));
    return (
        <g>
            <rect x={cx - 150} y={y} width={300} height={64} rx={32} fill={color} fillOpacity={0.1} stroke={color} strokeWidth={2.5} />
            {Array.from({ length: 19 }, (_, i) => <line key={i} x1={cx - 126 + i * 14} x2={cx - 126 + i * 14} y1={y + 8} y2={y + 56} stroke={color} strokeOpacity={0.18} />)}
            {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={3.8} fill={C.text} opacity={0.92}>
                    {!reduce && <animate attributeName="cy" values={`${p.y};${p.y + 5};${p.y - 4};${p.y}`} dur={`${p.d}s`} repeatCount="indefinite" />}
                </circle>
            ))}
            <rect x={cx - 150} y={y + 76} width={force} height={10} rx={5} fill={color} />
        </g>
    );
};

export const MouseFibersScene = ({ reduce }: SceneProps) => (
    <g>
        {[{ cx: 185, name: 'FIBRA RÁPIDA · tipo II', color: FAST, nitrate: { dots: 24, force: 250 } },
            { cx: 549, name: 'FIBRA LENTA · tipo I', color: SLOW, nitrate: { dots: 10, force: 170 } }].map((p, k) => (
            <g key={p.name}>
                <SvgText x={p.cx} y={38} text={p.name} anchor="middle" size={20} color={p.color === FAST ? C.hypoxia : C.placebo} weight={800} />
                <SvgText x={p.cx - 150} y={96} text="água" size={16} color={C.muted} weight={600} />
                <Fiber cx={p.cx} y={106} color={p.color} dots={10} force={170} reduce={reduce} seed={3 + k} />
                <SvgText x={p.cx - 150} y={246} text="nitrato 1 mM" size={16} color={C.nitrateSoft} weight={700} />
                <Fiber cx={p.cx} y={256} color={p.color} dots={p.nitrate.dots} force={p.nitrate.force} reduce={reduce} seed={3 + k} />
            </g>
        ))}
        <SvgText x={185} y={396} text="Ca²⁺ ↑ · força ↑ · ~35% mais rápida" anchor="middle" size={18} color={C.noSoft} weight={700} />
        <SvgText x={549} y={396} text="sem mudança" anchor="middle" size={18} color={C.muted} weight={700} />
        <SvgText x={24} y={430} text="pontos = Ca²⁺ (ilustrativo) · barras = força" size={16} color={C.muted} weight={500} />
    </g>
);

/** Passo 3: PO₂ microvascular em contração, gastrocnêmio × sóleo. */
export const Po2Scene = ({ reduce }: SceneProps) => {
    const base = 352;
    const bar = (x: number, h: number, color: string, label: string, val?: string) => (
        <g>
            <rect x={x} y={base - h} width={84} height={h} rx={6} fill={color} />
            {val && <SvgText x={x + 42} y={base - h - 10} text={val} anchor="middle" size={24} color={C.text} weight={800} />}
            <SvgText x={x + 42} y={base + 26} text={label} anchor="middle" size={16} color={C.muted} weight={600} />
        </g>
    );
    return (
        <g>
            <SvgText x={185} y={38} text="GASTROCNÊMIO" anchor="middle" size={20} color={C.hypoxia} weight={800} />
            <SvgText x={185} y={62} text="91% de fibras rápidas" anchor="middle" size={16} color={C.muted} weight={500} />
            {bar(90, 14 * 8, C.placebo, 'controle', '14')}
            {bar(200, 19 * 8, C.nitrate, 'beterraba', '19')}
            <FadeG show reduce={reduce} delay={700}>
                <SvgText x={185} y={106} text="+43%" anchor="middle" size={34} color={C.nitrateSoft} weight={800} />
                <SvgText x={185} y={130} text="mmHg" anchor="middle" size={16} color={C.muted} weight={500} />
            </FadeG>
            <SvgText x={549} y={38} text="SÓLEO" anchor="middle" size={20} color={C.placebo} weight={800} />
            <SvgText x={549} y={62} text="9% de fibras rápidas" anchor="middle" size={16} color={C.muted} weight={500} />
            {bar(454, 12 * 8, C.placebo, 'controle')}
            {bar(564, 12 * 8, C.nitrate, 'beterraba')}
            <SvgText x={549} y={116} text="sem mudança" anchor="middle" size={24} color={C.muted} weight={800} />
            <line x1={367} x2={367} y1={44} y2={base} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 6" />
            <SvgText x={24} y={430} text="barras do sóleo ilustrativas (sem valor no resumo)" size={16} color={C.muted} weight={500} />
        </g>
    );
};

/** Passo 4: o mesmo ciclista a 35 e a 115 rpm. */
export const CadenceScene = ({ reduce }: SceneProps) => {
    const base = 352;
    const col = (cx: number, rpm: number, color: string, tte?: readonly [number, number]) => {
        const h = (s: number) => (s / 362) * 150;
        const hs = tte ? [h(tte[0]), h(tte[1])] : [h(297), h(297)];
        return (
            <g>
                <circle cx={cx} cy={92} r={34} fill="none" stroke={color} strokeWidth={2.5} strokeDasharray="3 5" />
                <g>
                    {!reduce && <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} 92`} to={`360 ${cx} 92`} dur={`${60 / rpm}s`} repeatCount="indefinite" />}
                    <line x1={cx} y1={92} x2={cx} y2={62} stroke={color} strokeWidth={4} strokeLinecap="round" />
                    <rect x={cx - 9} y={52} width={18} height={9} rx={3} fill={color} />
                </g>
                <circle cx={cx} cy={92} r={5} fill={color} />
                <SvgText x={cx} y={162} text={`${rpm} rpm`} anchor="middle" size={24} color={color} weight={800} />
                {[-92, 12].map((dx, i) => (
                    <g key={dx}>
                        <rect x={cx + dx} y={base - hs[i]} width={80} height={hs[i]} rx={6} fill={i === 0 ? C.placebo : C.nitrate} />
                        {tte && <SvgText x={cx + dx + 40} y={base - hs[i] - 10} text={`${tte[i]} s`} anchor="middle" size={22} color={C.text} weight={800} />}
                        <SvgText x={cx + dx + 40} y={base + 26} text={i === 0 ? 'placebo' : 'beterraba'} anchor="middle" size={16} color={C.muted} weight={600} />
                    </g>
                ))}
            </g>
        );
    };
    return (
        <g>
            {col(185, 35, C.placebo)}
            {col(549, 115, C.hypoxia, [297, 362])}
            <SvgText x={185} y={406} text="tempo limite: sem diferença" anchor="middle" size={18} color={C.muted} weight={700} />
            <SvgText x={549} y={406} text="+22% · τ da fase II 61 → 47 s" anchor="middle" size={18} color={C.noSoft} weight={700} />
            <line x1={367} x2={367} y1={44} y2={base} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 6" />
            <SvgText x={24} y={434} text="barras de 35 rpm ilustrativas (sem valor no resumo)" size={16} color={C.muted} weight={500} />
        </g>
    );
};
