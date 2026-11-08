import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { Glyph, type GlyphKey } from './EnteroGlyphs';

/** Circuito entero-salivar (SVG 690×446, escala 1:1): boca → estômago → intestino → sangue → glândula salivar → boca. */
export const SCENE_W = 690;
export const SCENE_H = 446;

const CARD_W = 172;
const CARD_H = 78;
const TOP = 86;
const BOT = 318;
const XL = 100;
const XM = 345;
const XR = 590;

interface NodeDef { key: GlyphKey; cx: number; cy: number; lines: [string, string?]; stepsOn: number[]; glow: string }

const NODES: NodeDef[] = [
    { key: 'mouth', cx: XL, cy: TOP, lines: ['Boca', 'e língua'], stepsOn: [2, 3], glow: C.bacteria },
    { key: 'stomach', cx: XM, cy: TOP, lines: ['Estômago'], stepsOn: [0, 4], glow: C.no },
    { key: 'gut', cx: XR, cy: TOP, lines: ['Intestino'], stepsOn: [0], glow: C.nitrate },
    { key: 'blood', cx: XR, cy: BOT, lines: ['Sangue', '(plasma)'], stepsOn: [1, 5], glow: C.nitrite },
    { key: 'gland', cx: XL, cy: BOT, lines: ['Glândula', 'salivar'], stepsOn: [1, 2], glow: C.nitrate },
];

const HALF = CARD_W / 2 + 4;
const TOP_EDGE = TOP + CARD_H / 2 + 4;
const BOT_EDGE = BOT - CARD_H / 2 - 4;

const P = {
    me: `M${XL + HALF} ${TOP} L${XM - HALF} ${TOP}`,
    ei: `M${XM + HALF} ${TOP} L${XR - HALF} ${TOP}`,
    is: `M${XR} ${TOP_EDGE} L${XR} ${BOT_EDGE}`,
    sg: `M${XR - HALF} ${BOT} L${XM} ${BOT} L${XL + HALF} ${BOT}`,
    rest: `M${XM} ${BOT} L${XM} ${BOT + 54}`,
    gm: `M${XL} ${BOT_EDGE} L${XL} ${TOP_EDGE}`,
};

/** Cada fluxo aparece a partir de um passo (`from`) e corre por um caminho. */
interface FlowDef { d: string; color: string; n: number; from: number; dur?: number; phase?: number }

const FLOWS: FlowDef[] = [
    { d: P.me, color: C.nitrate, n: 3, from: 0 },
    { d: P.me, color: C.nitrite, n: 2, from: 3, phase: 0.5 },
    { d: P.ei, color: C.nitrate, n: 3, from: 0 },
    { d: P.ei, color: C.nitrite, n: 2, from: 3, phase: 0.5 },
    { d: P.is, color: C.nitrate, n: 4, from: 0, dur: 1.8 },
    { d: P.is, color: C.nitrite, n: 2, from: 5, dur: 1.8, phase: 0.5 },
    { d: P.sg, color: C.nitrate, n: 4, from: 1, dur: 2.6 },
    { d: P.rest, color: C.nitrate, n: 2, from: 1, dur: 1.2 },
    { d: P.gm, color: C.nitrate, n: 6, from: 2, dur: 1.8 },
    { d: P.gm, color: C.nitrite, n: 3, from: 3, dur: 1.8, phase: 0.5 },
];

const HEADS: [number, number, 'r' | 'd' | 'l' | 'u'][] = [
    [XM - HALF, TOP, 'r'], [XR - HALF, TOP, 'r'], [XR, BOT_EDGE, 'd'], [XL + HALF, BOT, 'l'], [XL, TOP_EDGE, 'u'],
];

const headPath = (x: number, y: number, dir: 'r' | 'd' | 'l' | 'u') => {
    const s = 6;
    if (dir === 'r') return `M${x - s} ${y - s} L${x} ${y} L${x - s} ${y + s} Z`;
    if (dir === 'l') return `M${x + s} ${y - s} L${x} ${y} L${x + s} ${y + s} Z`;
    if (dir === 'd') return `M${x - s} ${y - s} L${x} ${y} L${x + s} ${y - s} Z`;
    return `M${x - s} ${y + s} L${x} ${y} L${x + s} ${y + s} Z`;
};

const Flow = ({ f, active, reduce }: { f: FlowDef; active: boolean; reduce: boolean }) => {
    const dur = f.dur ?? 1.4;
    const [x0, y0] = (f.d.match(/-?\d+/g) ?? ['0', '0']).map(Number);
    return (
        <g style={{ opacity: active ? 1 : 0, transition: 'opacity 0.4s' }}>
            {Array.from({ length: f.n }, (_, i) => (
                <circle key={i} r={4.5} fill={f.color} cx={reduce ? x0 : undefined} cy={reduce ? y0 : undefined}>
                    {!reduce && <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={f.d} begin={`${-((i + (f.phase ?? 0)) * dur) / f.n}s`} />}
                </circle>
            ))}
        </g>
    );
};

const Card = ({ n, on, stepColor }: { n: NodeDef; on: boolean; stepColor: string }) => (
    <g style={{ filter: on ? `drop-shadow(0 0 10px ${n.glow})` : undefined, transition: 'filter 0.35s' }}>
        <rect x={n.cx - CARD_W / 2} y={n.cy - CARD_H / 2} width={CARD_W} height={CARD_H} rx={16} fill="rgba(255,255,255,0.04)"
            stroke={on ? n.glow : 'rgba(255,255,255,0.22)'} strokeWidth={on ? 2.5 : 1.5} />
        <g transform={`translate(${n.cx - 76} ${n.cy - 25}) scale(1.25)`}>
            <Glyph kind={n.key} x={0} y={0} tint={on ? stepColor : '#CBD5E1'} />
        </g>
        {!n.lines[1] ? (
            <SvgText x={n.cx - 12} y={n.cy + 7} text={n.lines[0]} size={18} weight={700} color={on ? '#fff' : '#D1D5DB'} />
        ) : (
            <>
                <SvgText x={n.cx - 12} y={n.cy - 3} text={n.lines[0]} size={18} weight={700} color={on ? '#fff' : '#D1D5DB'} />
                <SvgText x={n.cx - 12} y={n.cy + 20} text={n.lines[1]} size={16} color={C.muted} />
            </>
        )}
    </g>
);

/** Bactérias da língua: bastonetes violeta que balançam em volta do cartão da boca. */
const BACTERIA: [number, number, number][] = [[28, 40, -30], [172, 36, 25], [60, 140, 40], [150, 138, -20], [196, 92, 70], [10, 92, 80], [100, 30, 0], [118, 148, 10]];

const Bacteria = ({ reduce }: { reduce: boolean }) => (
    <g>
        {BACTERIA.map(([x, y, rot], i) => (
            <ellipse key={i} cx={x} cy={y} rx={9} ry={4.5} fill={C.bacteria} transform={`rotate(${rot} ${x} ${y})`} opacity={0.9}>
                {!reduce && <animate attributeName="opacity" values="0.45;1;0.45" dur={`${1.6 + (i % 3) * 0.4}s`} repeatCount="indefinite" />}
            </ellipse>
        ))}
    </g>
);

interface Props { step: number; caption: string; captionColor: string; reduce: boolean }

export const EnteroScene = ({ step, caption, captionColor, reduce }: Props) => (
    <svg width={SCENE_W} height={SCENE_H} viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} role="img"
        aria-label="Circuito entero-salivar do nitrato: boca, estômago, intestino, sangue e glândula salivar">
        {[P.me, P.ei, P.is, P.sg, P.rest, P.gm].map(d => <path key={d} d={d} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth={2} strokeDasharray="3 7" />)}
        {HEADS.map(([x, y, dir]) => <path key={`${x}${y}`} d={headPath(x, y, dir)} fill="#6B7280" />)}
        <circle cx={XM} cy={BOT} r={6} fill="#6B7280" />

        {FLOWS.map((f, i) => <Flow key={i} f={f} active={step >= f.from} reduce={reduce} />)}

        {step === 3 && <g transform={`translate(${XL - 100} ${TOP - 90})`}><Bacteria reduce={reduce} /></g>}
        {/* NO que sobe do estômago ácido */}
        {step === 4 && [0, 1, 2, 3].map(i => (
            <circle key={i} cx={XM - 30 + i * 20} r={5} fill={C.no} cy={reduce ? 30 : undefined}>
                {!reduce && <animate attributeName="cy" values="50;6" dur="1.8s" begin={`${i * 0.45}s`} repeatCount="indefinite" />}
                {!reduce && <animate attributeName="opacity" values="0;1;0" dur="1.8s" begin={`${i * 0.45}s`} repeatCount="indefinite" />}
            </circle>
        ))}

        {[[C.nitrate, 'nitrato'], [C.nitrite, 'nitrito'], [C.no, 'NO'], [C.bacteria, 'bactérias']].map(([color, label], i) => (
            <g key={label}>
                <circle cx={36 + i * 132} cy={426} r={6} fill={color} />
                <SvgText x={50 + i * 132} y={432} text={label} size={16} color={C.muted} />
            </g>
        ))}

        {NODES.map(n => <Card key={n.key} n={n} on={n.stepsOn.includes(step)} stepColor={captionColor} />)}

        {step === 1 && (
            <>
                <SvgText x={XM - 14} y={BOT - 16} text="~25% → saliva" size={18} weight={700} color={C.nitrate} anchor="end" />
                <SvgText x={XM + 14} y={BOT + 80} text="resto → rim e músculo" size={16} color={C.muted} />
            </>
        )}
        <SvgText x={XM} y={208} text={caption} size={20} weight={700} anchor="middle" color={captionColor} />
    </svg>
);
