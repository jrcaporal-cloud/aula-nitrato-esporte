import type { ReactNode } from 'react';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/** Desenho das duas vias (SVG 690×336, escala 1:1 com a caixa). */
export const LANES_W = 690;
export const LANES_H = 336;

interface FlowProps { d: string; color: string; n?: number; dur?: number; opacity: number; reduce: boolean }

/** Pontos que correm por um caminho: a quantidade fica fixa e a visibilidade acompanha a atividade. */
const Flow = ({ d, color, n = 2, dur = 1.3, opacity, reduce }: FlowProps) => {
    // Com movimento reduzido os pontos ficam parados, espalhados ao longo do início do caminho.
    const [x0, y0] = (d.match(/-?\d+(\.\d+)?/g) ?? ['0', '0']).map(Number);
    return (
        <g style={{ opacity, transition: 'opacity 0.3s' }}>
            {Array.from({ length: n }, (_, i) => (
                <circle key={i} r={4} fill={color} cx={reduce ? x0 : undefined} cy={reduce ? y0 + i * 12 : undefined}>
                    {!reduce && <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={d} begin={`${-(i * dur) / n}s`} />}
                </circle>
            ))}
        </g>
    );
};

const Arrow = ({ x, y1, y2 }: { x: number; y1: number; y2: number }) => (
    <g>
        <line x1={x} y1={y1} x2={x} y2={y2 - 5} stroke="#6B7280" strokeWidth={2} />
        <path d={`M${x - 5} ${y2 - 7} L${x} ${y2} L${x + 5} ${y2 - 7} Z`} fill="#6B7280" />
    </g>
);

interface BoxProps { x: number; y: number; w: number; h: number; color: string; glow?: number; fill?: string; children?: ReactNode }

const Box = ({ x, y, w, h, color, glow = 0, fill = 'rgba(255,255,255,0.04)', children }: BoxProps) => (
    <g style={{ filter: glow > 0.05 ? `drop-shadow(0 0 ${4 + glow * 12}px ${color})` : undefined, transition: 'filter 0.3s' }}>
        <rect x={x} y={y} width={w} height={h} rx={11} fill={fill} stroke={color} strokeWidth={1.5 + glow * 1.5} />
        {children}
    </g>
);

const NoNode = ({ x, y, level }: { x: number; y: number; level: number }) => (
    <g style={{ filter: `drop-shadow(0 0 ${3 + level * 16}px ${C.no})`, transition: 'filter 0.3s' }}>
        <circle cx={x} cy={y} r={20} fill={C.noDeep} fillOpacity={0.35 + level * 0.65} stroke={C.no} strokeWidth={2} />
        <SvgText x={x} y={y + 6} text="NO" size={18} weight={700} anchor="middle" color="#fff" />
    </g>
);

interface Props {
    sat: number;
    nos: number;
    reduction: number;
    focus: 'classic' | 'alt' | 'both';
    reduce: boolean;
}

export const PathwayLanes = ({ sat, nos, reduction, focus, reduce }: Props) => {
    const dimClassic = focus === 'alt' ? 0.28 : 1;
    const dimAlt = focus === 'classic' ? 0.28 : 1;
    const o2 = sat / 100;
    return (
        <svg width={LANES_W} height={LANES_H} viewBox={`0 0 ${LANES_W} ${LANES_H}`} role="img"
            aria-label="Via clássica da L-arginina e via alternativa do nitrato, lado a lado">
            <line x1={343} y1={18} x2={343} y2={322} stroke="rgba(255,255,255,0.14)" strokeDasharray="4 6" />

            {/* Via clássica */}
            <g style={{ opacity: dimClassic, transition: 'opacity 0.4s' }}>
                <SvgText x={180} y={24} text="Via clássica" size={19} weight={700} anchor="middle" color={C.o2Soft} />
                <SvgText x={180} y={46} text="o O₂ é o substrato" size={16} anchor="middle" color={C.muted} />
                <Box x={115} y={60} w={130} h={26} color={C.placebo}>
                    <SvgText x={180} y={78} text="L-arginina" size={16} anchor="middle" />
                </Box>
                <Arrow x={180} y1={86} y2={130} />
                <Flow d="M180 88 L180 128" color={C.placebo} dur={1.4} opacity={0.75} reduce={reduce} />
                <circle cx={28} cy={170} r={17} fill="rgba(96,165,250,0.18)" stroke={C.o2} strokeWidth={2}
                    style={{ opacity: 0.35 + o2 * 0.65, transition: 'opacity 0.3s' }} />
                <SvgText x={28} y={176} text="O₂" size={16} anchor="middle" color={C.o2Soft} />
                <Flow d="M48 170 L96 170" color={C.o2} n={3} dur={1.2} opacity={o2} reduce={reduce} />
                <Box x={96} y={130} w={168} h={80} color={C.o2} glow={nos} fill={`rgba(96,165,250,${0.05 + nos * 0.12})`}>
                    <SvgText x={180} y={164} text="NO-sintase" size={17} weight={700} anchor="middle" />
                    <SvgText x={180} y={188} text="NOS" size={16} anchor="middle" color={C.o2Soft} />
                </Box>
                <Arrow x={180} y1={210} y2={278} />
                <Flow d="M180 212 L180 276" color={C.no} n={3} dur={1.5} opacity={nos} reduce={reduce} />
                <NoNode x={180} y={300} level={nos} />
            </g>

            {/* Via alternativa */}
            <g style={{ opacity: dimAlt, transition: 'opacity 0.4s' }}>
                <SvgText x={516} y={24} text="Via alternativa" size={19} weight={700} anchor="middle" color={C.nitriteSoft} />
                <SvgText x={516} y={46} text="favorecida por hipóxia e acidose" size={16} anchor="middle" color={C.muted} />
                <Box x={446} y={60} w={140} h={26} color={C.nitrate}>
                    <SvgText x={516} y={78} text="Nitrato NO₃⁻" size={16} anchor="middle" color={C.nitrateSoft} />
                </Box>
                <Arrow x={516} y1={86} y2={108} />
                <Flow d="M516 86 L516 106" color={C.nitrate} dur={0.9} opacity={0.9} reduce={reduce} />
                <Box x={436} y={108} w={160} h={26} color={C.bacteria}>
                    <SvgText x={516} y={126} text="bactérias orais" size={16} anchor="middle" color={C.bacteria} />
                </Box>
                <Arrow x={516} y1={134} y2={156} />
                <Flow d="M516 134 L516 154" color={C.nitrite} dur={0.9} opacity={0.9} reduce={reduce} />
                <Box x={446} y={156} w={140} h={26} color={C.nitrite}>
                    <SvgText x={516} y={174} text="Nitrito NO₂⁻" size={16} anchor="middle" color={C.nitriteSoft} />
                </Box>
                <Arrow x={516} y1={182} y2={204} />
                <Flow d="M516 182 L516 202" color={C.nitrite} dur={0.9} opacity={0.35 + reduction * 0.65} reduce={reduce} />
                <Box x={386} y={204} w={260} h={56} color={C.hypoxia} glow={reduction} fill={`rgba(251,146,60,${0.04 + reduction * 0.16})`}>
                    <SvgText x={516} y={228} text="redutases do nitrito" size={17} weight={700} anchor="middle" />
                    <SvgText x={516} y={250} text="desoxi-Hb · Mb · XOR" size={16} anchor="middle" color={C.hypoxia} />
                </Box>
                <Arrow x={516} y1={260} y2={280} />
                <Flow d="M516 260 L516 278" color={C.no} dur={0.9} opacity={reduction} reduce={reduce} />
                <NoNode x={516} y={300} level={reduction} />
            </g>
        </svg>
    );
};
