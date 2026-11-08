import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { FadeG } from './DrawPath';
import { MOUSE_ROWS, type Cell, type Row } from './mouse.content';

const COL = { label: 24, mouse: 262, human: 500, w: 216 } as const;
const ROW_Y = [142, 190, 238, 332, 380] as const;
const TAG_Y = [126, 318] as const;

const MouseIcon = ({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x} ${y})`} fill="none" stroke={C.placebo} strokeWidth={2.5} strokeLinecap="round">
        <ellipse cx={0} cy={4} rx={20} ry={12} />
        <circle cx={22} cy={0} r={8} />
        <circle cx={18} cy={-9} r={5} />
        <path d="M-20 6 q-14 2 -20 -10 q-4 -6 -10 -4" />
        <circle cx={26} cy={-2} r={1.8} fill={C.placebo} />
    </g>
);

const HumanIcon = ({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x} ${y})`} fill="none" stroke={C.nitrateSoft} strokeWidth={2.5} strokeLinecap="round">
        <circle cx={0} cy={-18} r={7} />
        <path d="M0 -10 V10 M-11 -3 H11 M0 10 L-8 28 M0 10 L8 28" />
    </g>
);

const glyphColor = (cell: Cell, group: Row['group'], who: 'mouse' | 'human', verdict: boolean): string => {
    if (cell.glyph === '↑') return C.no;
    if (cell.glyph === '=') return verdict && group === 'why' && who === 'human' ? C.hypoxia : C.placebo;
    return C.muted;
};

interface CellViewProps {
    x: number;
    y: number;
    cell: Cell;
    color: string;
    show: boolean;
    focus: boolean;
    reduce: boolean;
}

const CellView = ({ x, y, cell, color, show, focus, reduce }: CellViewProps) => (
    <g>
        <rect x={x} y={y} width={COL.w} height={44} rx={10} fill={focus ? 'rgba(255,255,255,0.06)' : 'none'}
            stroke={show ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.1)'} strokeDasharray={show ? undefined : '4 5'} />
        <FadeG show={show} reduce={reduce}>
            <SvgText x={x + 22} y={y + 32} text={cell.glyph} anchor="middle" size={30} color={color} weight={800} />
            <SvgText x={x + 44} y={y + (cell.lines[1] ? 19 : 28)} text={cell.lines[0]} size={16} color={C.text} weight={600} />
            {cell.lines[1] && <SvgText x={x + 44} y={y + 37} text={cell.lines[1]} size={16} color={C.muted} weight={500} />}
        </FadeG>
    </g>
);

/** Quadro camundongo × humano: as células se revelam por passo; no veredito os dois blocos de linhas ganham nome. */
export const MouseHumanScene = ({ step, reduce }: { step: number; reduce: boolean }) => {
    const verdict = step === 4;
    const mouseOn = step >= 1;
    const humanOn = (r: Row) => (r.group === 'what' ? step >= 2 : step >= 3);
    const focusMouse = step === 1;
    const humanFocus = (r: Row) => (r.group === 'what' ? step === 2 : step === 3);
    return (
        <g>
            <MouseIcon x={COL.mouse + 34} y={56} />
            <SvgText x={COL.mouse + 84} y={52} text="CAMUNDONGO" size={18} color={C.text} weight={800} />
            <SvgText x={COL.mouse + 84} y={76} text="Hernández 2012" size={16} color={C.muted} weight={500} />
            <HumanIcon x={COL.human + 30} y={58} />
            <SvgText x={COL.human + 66} y={52} text="HUMANO" size={18} color={C.text} weight={800} />
            <SvgText x={COL.human + 66} y={76} text="Whitfield 2017" size={16} color={C.muted} weight={500} />
            <FadeG show={step >= 2} reduce={reduce}>
                <SvgText x={COL.human + 66} y={98} text="+ Haider 2014" size={16} color={C.nitrateSoft} weight={600} />
            </FadeG>
            <SvgText x={COL.label} y={TAG_Y[0]} text={verdict ? 'SABEMOS O QUÊ' : 'O QUÊ · o fenótipo'} size={16} color={verdict ? C.no : C.muted} weight={800} />
            <SvgText x={COL.label} y={TAG_Y[1]} text={verdict ? 'NÃO SABEMOS POR QUÊ' : 'POR QUÊ · o mecanismo'} size={16} color={verdict ? C.hypoxia : C.muted} weight={800} />
            <line x1={COL.label} x2={COL.human + COL.w} y1={TAG_Y[0] + 6} y2={TAG_Y[0] + 6} stroke={verdict ? C.no : 'rgba(255,255,255,0.15)'} strokeOpacity={verdict ? 0.6 : 1} />
            <line x1={COL.label} x2={COL.human + COL.w} y1={TAG_Y[1] + 6} y2={TAG_Y[1] + 6} stroke={verdict ? C.hypoxia : 'rgba(255,255,255,0.15)'} strokeOpacity={verdict ? 0.6 : 1} />
            {MOUSE_ROWS.map((r, i) => {
                const y = ROW_Y[i];
                return (
                    <g key={r.label}>
                        <SvgText x={COL.label} y={y + 28} text={r.label} size={16} color={C.text} weight={600} />
                        <CellView x={COL.mouse} y={y} cell={r.mouse} color={glyphColor(r.mouse, r.group, 'mouse', verdict)} show={mouseOn} focus={focusMouse} reduce={reduce} />
                        <CellView x={COL.human} y={y} cell={r.human} color={glyphColor(r.human, r.group, 'human', verdict)} show={humanOn(r)} focus={humanFocus(r)} reduce={reduce} />
                    </g>
                );
            })}
        </g>
    );
};
