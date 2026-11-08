import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { DrawPath, FadeG } from './DrawPath';
import { linePath, sample } from './geom';

/** Passo 5: relação torque-frequência em dois músculos humanos; o nitrato desloca as curvas para lados opostos. */
const Panel = ({ cx, name, sub, shift, p, color, reduce }: { cx: number; name: string; sub: string; shift: number; p: string; color: string; reduce: boolean }) => {
    const x0 = cx - 140;
    const sx = (t: number) => x0 + t * 280;
    const sy = (f: number) => 322 - f * 190;
    const curve = (mid: number) => linePath(sample(t => 1 / (1 + Math.exp(-(t - mid) * 11)), 0, 1, 60).map(([t, f]) => [sx(t), sy(f)] as const));
    const mid = 0.5;
    const left = shift < 0;
    return (
        <g>
            <SvgText x={cx} y={36} text={name} anchor="middle" size={20} color={color} weight={800} />
            <SvgText x={cx} y={60} text={sub} anchor="middle" size={16} color={C.muted} weight={500} />
            <line x1={x0} x2={x0 + 280} y1={322} y2={322} stroke="rgba(255,255,255,0.3)" />
            <line x1={x0} x2={x0} y1={118} y2={322} stroke="rgba(255,255,255,0.3)" />
            <SvgText x={x0 + 6} y={112} text="torque ↑" size={16} color={C.muted} weight={500} />
            <SvgText x={cx} y={348} text="frequência de estimulação →" anchor="middle" size={16} color={C.muted} weight={500} />
            <DrawPath d={curve(mid)} color={C.placebo} show reduce={reduce} ms={1000} width={4} />
            <DrawPath d={curve(mid + shift)} color={C.nitrate} show reduce={reduce} ms={1200} delay={400} width={4} />
            <FadeG show reduce={reduce} delay={1300}>
                <line x1={sx(mid)} x2={sx(mid + shift) + (left ? 6 : -6)} y1={sy(0.5) - 22} y2={sy(0.5) - 22} stroke={C.text} strokeWidth={3} markerEnd="url(#hcArrow)" />
                <SvgText x={cx} y={382} text={left ? '← desvio para a esquerda' : 'desvio para a direita →'} anchor="middle" size={18} color={left ? C.noSoft : C.hypoxia} weight={800} />
                <SvgText x={cx} y={408} text={p} anchor="middle" size={16} color={C.muted} weight={600} />
            </FadeG>
        </g>
    );
};

export const HumanCurvesScene = ({ reduce }: { reduce: boolean }) => (
    <g>
        <defs>
            <marker id="hcArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                <path d="M0 0 L10 5 L0 10 z" fill={C.text} />
            </marker>
        </defs>
        <Panel cx={185} name="TRÍCEPS BRAQUIAL" sub="~60–70% de fibras rápidas" shift={-0.16} p="p = 0,019" color={C.hypoxia} reduce={reduce} />
        <Panel cx={549} name="TRÍCEPS SURAL" sub="~60–70% de fibras lentas" shift={0.16} p="p < 0,001" color={C.placebo} reduce={reduce} />
        <line x1={367} x2={367} y1={44} y2={322} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 6" />
        <SvgText x={24} y={434} text="curvas ilustrativas · o sentido do desvio é o dado" size={16} color={C.muted} weight={500} />
    </g>
);
