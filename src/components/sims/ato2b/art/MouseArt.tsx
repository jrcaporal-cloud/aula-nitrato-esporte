import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { MOUSE_ROWS, type Cell, type Row } from '../mouse.content';
import { HumanArt, MouseArt } from './Organisms';

/**
 * Slide 30: camundongo à esquerda, humano à direita e, entre eles, os achados como interruptores:
 * ligado = subiu, no meio = sem mudança, tracejado = sem dado. No veredito, as faixas viram "sabemos" e "não sabemos".
 */

const MX = 200;
const HX = 650;
const CW = 270;
const ROW_Y = [74, 116, 158, 226, 268] as const;
const TAG_Y = [52, 204] as const;
const LABELS: readonly (readonly string[])[] = [['Força a baixa', 'frequência'], ['Twitch e taxa', 'de força'], ['Força voluntária', 'máxima'], ['Proteínas', 'de Ca²⁺'], ['Estado redox', '(GSH:GSSG)']];

const glyphColor = (cell: Cell, group: Row['group'], who: 'mouse' | 'human', verdict: boolean): string => {
    if (cell.glyph === '↑') return C.no;
    if (cell.glyph === '=') return verdict && group === 'why' && who === 'human' ? C.hypoxia : C.placebo;
    return C.muted;
};

const Switch = ({ x, y, cell, color, on, reduce }: { x: number; y: number; cell: Cell; color: string; on: boolean; reduce: boolean }) => {
    const knob = !on ? 13 : cell.glyph === '↑' ? 37 : 25;
    const none = on && cell.glyph === '—';
    return (
        <g>
            <rect x={x} y={y} width={50} height={26} rx={13} fill={on && !none ? `${color}33` : 'rgba(255,255,255,0.04)'} stroke={on ? color : 'rgba(255,255,255,0.25)'}
                strokeWidth={2} strokeDasharray={!on || none ? '4 4' : undefined} style={{ transition: 'fill 500ms, stroke 500ms', filter: on && cell.glyph === '↑' ? `drop-shadow(0 0 6px ${color})` : undefined }} />
            {!none && (
                <g style={{ transform: `translateX(${knob}px)`, transition: reduce ? 'none' : 'transform 600ms cubic-bezier(.3,1.4,.5,1)' }}>
                    <circle cx={x} cy={y + 13} r={10} fill={on ? color : '#4B5563'} />
                    {on && <text x={x} y={y + 18.5} textAnchor="middle" fontSize={16} fontWeight={900} fill="#07050B" style={{ fontFamily: 'var(--font-body)' }}>{cell.glyph}</text>}
                </g>
            )}
            {none && <text x={x + 25} y={y + 19} textAnchor="middle" fontSize={16} fontWeight={800} fill={C.muted} style={{ fontFamily: 'var(--font-body)' }}>—</text>}
        </g>
    );
};

const CellView = ({ x, y, cell, color, on, focus, reduce }: { x: number; y: number; cell: Cell; color: string; on: boolean; focus: boolean; reduce: boolean }) => (
    <g>
        <rect x={x} y={y} width={CW} height={40} rx={10} fill={focus ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.02)'} stroke={focus ? `${color}88` : 'rgba(255,255,255,0.08)'} />
        <Switch x={x + 8} y={y + 7} cell={cell} color={color} on={on} reduce={reduce} />
        <g opacity={on ? 1 : 0} style={{ transition: 'opacity 450ms 200ms' }}>
            <SvgText x={x + 68} y={y + (cell.lines[1] ? 17 : 26)} text={cell.lines[0]} size={16} color={C.text} weight={600} />
            {cell.lines[1] && <SvgText x={x + 68} y={y + 35} text={cell.lines[1]} size={15} color={C.muted} weight={500} />}
        </g>
    </g>
);

const Band = ({ y, h, tag, color, verdict }: { y: number; h: number; tag: string; color: string; verdict: boolean }) => (
    <g>
        <rect x={MX - 6} y={y} width={HX + CW - MX + 12} height={h} rx={14} fill={verdict ? `${color}14` : 'none'} stroke={verdict ? `${color}88` : 'none'}
            style={{ transition: 'fill 600ms, stroke 600ms' }} />
        <SvgText x={555} y={y + 16} text={tag} anchor="middle" size={16} color={verdict ? color : C.muted} weight={800} />
    </g>
);

export const MouseHumanArt = ({ step, reduce }: { step: number; reduce: boolean }) => {
    const verdict = step === 4;
    const humanOn = (r: Row) => (r.group === 'what' ? step >= 2 : step >= 3);
    const humanFocus = (r: Row) => (r.group === 'what' ? step === 2 : step === 3);
    return (
        <g>
            <Band y={TAG_Y[0] - 4} h={154} tag={verdict ? '✓ SABEMOS O QUÊ' : 'O QUÊ · o fenótipo'} color={C.no} verdict={verdict} />
            <Band y={TAG_Y[1] - 4} h={110} tag={verdict ? '? NÃO SABEMOS POR QUÊ' : 'POR QUÊ · o mecanismo'} color={C.hypoxia} verdict={verdict} />
            <MouseArt lit={step >= 1} sparks={step === 1} reduce={reduce} />
            <HumanArt lit={step >= 2} reduce={reduce} />
            <SvgText x={MX + CW / 2} y={20} text="CAMUNDONGO" anchor="middle" size={18} color={C.text} weight={800} />
            <SvgText x={MX + CW / 2} y={40} text="Hernández 2012" anchor="middle" size={16} color={C.muted} weight={500} />
            <SvgText x={HX + CW / 2} y={20} text="HUMANO" anchor="middle" size={18} color={C.text} weight={800} />
            <SvgText x={HX + CW / 2} y={40} text={step >= 2 ? 'Whitfield 2017 + Haider 2014' : 'Whitfield 2017'} anchor="middle" size={16} color={step >= 2 ? C.nitrateSoft : C.muted} weight={500} />
            {MOUSE_ROWS.map((r, i) => (
                <g key={r.label}>
                    {LABELS[i].map((line, k) => (
                        <SvgText key={line} x={555} y={ROW_Y[i] + 17 + k * 18} text={line} anchor="middle" size={16} color={C.text} weight={600} />
                    ))}
                    <CellView x={MX} y={ROW_Y[i]} cell={r.mouse} color={glyphColor(r.mouse, r.group, 'mouse', verdict)} on={step >= 1} focus={step === 1} reduce={reduce} />
                    <CellView x={HX} y={ROW_Y[i]} cell={r.human} color={glyphColor(r.human, r.group, 'human', verdict)} on={humanOn(r)} focus={humanFocus(r)} reduce={reduce} />
                </g>
            ))}
            {verdict && (
                <g>
                    <circle cx={1088} cy={44} r={18} fill={C.no} />
                    <SvgText x={1088} y={51} text="✓" anchor="middle" size={20} color="#07050B" weight={900} />
                    <circle cx={1088} cy={256} r={18} fill={C.hypoxia} />
                    <SvgText x={1088} y={264} text="?" anchor="middle" size={22} color="#07050B" weight={900} />
                </g>
            )}
        </g>
    );
};
