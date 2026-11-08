import type { ReactNode } from 'react';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { SvgCount, SvgPulse } from './SvgKey';

/** Os três redutores do nitrito (SVG 690×336, escala 1:1): desoxi-Hb, desoxi-Mb e XOR. */
export const CARDS_W = 690;
export const CARDS_H = 336;

const CARD_W = 214;
const GAP = 12;
const X0 = 8;
const cardX = (i: number) => X0 + i * (CARD_W + GAP);

interface DotsProps { d: string; color: string; opacity: number; n?: number; reduce: boolean }

/** Pontos que correm por um caminho; a visibilidade acompanha a atividade. */
const Dots = ({ d, color, opacity, n = 3, reduce }: DotsProps) => {
    const [x0, y0] = (d.match(/-?\d+/g) ?? ['0', '0']).map(Number);
    return (
        <g style={{ opacity, transition: 'opacity 0.3s' }}>
            {Array.from({ length: n }, (_, i) => (
                <circle key={i} r={4} fill={color} cx={reduce ? x0 : undefined} cy={reduce ? y0 : undefined}>
                    {!reduce && <animateMotion dur="1.4s" repeatCount="indefinite" path={d} begin={`${-(i * 1.4) / n}s`} />}
                </circle>
            ))}
        </g>
    );
};

interface FrameProps {
    i: number;
    title: string;
    place: string;
    big: string;
    bigColor: string;
    note: string;
    level: number;
    lit: boolean;
    /** Cartão sozinho em foco: o número-chave conta e ganha o destaque. */
    solo: boolean;
    children: ReactNode;
}

/** Moldura do cartão: título, desenho, número-chave e medidor de atividade. */
const Frame = ({ i, title, place, big, bigColor, note, level, lit, solo, children }: FrameProps) => {
    const x = cardX(i);
    return (
        <g>
            <rect x={x} y={6} width={CARD_W} height={324} rx={16} fill="rgba(255,255,255,0.03)"
                stroke={lit ? C.hypoxia : 'rgba(255,255,255,0.16)'} strokeWidth={lit ? 2.5 : 1.5}
                style={{ filter: lit ? `drop-shadow(0 0 10px ${C.hypoxia}aa)` : undefined, transition: 'filter 0.4s, stroke 0.4s' }} />
            <SvgText x={x + CARD_W / 2} y={34} text={title} size={18} weight={700} anchor="middle" />
            <SvgText x={x + CARD_W / 2} y={56} text={place} size={16} anchor="middle" color={C.muted} />
            {children}
            {solo ? (
                <g key="solo">
                    <SvgPulse x={x + 22} y={206} w={CARD_W - 44} h={38} color={bigColor} />
                    <SvgCount x={x + CARD_W / 2} y={234} text={big} size={26} weight={700} anchor="middle" color={bigColor} />
                </g>
            ) : <SvgText key="plain" x={x + CARD_W / 2} y={234} text={big} size={26} weight={700} anchor="middle" color={bigColor} />}
            <SvgText x={x + CARD_W / 2} y={258} text={note} size={16} anchor="middle" color="#D1D5DB" />
            <rect x={x + 18} y={290} width={CARD_W - 36} height={12} rx={6} fill="rgba(255,255,255,0.1)" />
            <rect x={x + 18} y={290} width={Math.max(4, (CARD_W - 36) * level)} height={12} rx={6} fill={C.hypoxia} />
            <SvgText x={x + 18} y={282} text="atividade" size={16} color={C.muted} />
        </g>
    );
};

interface CardProps { sat: number; level: number; lit: boolean; solo: boolean; reduce: boolean }

/** Cor do eritrócito: azul com O₂, roxo-escuro sem. */
const cellColor = (sat: number) => {
    const k = Math.max(0, Math.min(1, sat / 100));
    const mix = (a: number, b: number) => Math.round(a + (b - a) * k);
    return `rgb(${mix(70, 96)},${mix(50, 165)},${mix(110, 250)})`;
};

export const HbCard = ({ sat, level, lit, solo, reduce }: CardProps) => {
    const x = cardX(0);
    const cy = 138;
    return (
        <Frame i={0} title="Desoxi-hemoglobina" place="eritrócito · capilar" big="40–60%" bigColor={C.nitrite}
            note="de saturação: taxa máxima" level={level} lit={lit} solo={solo}>
            <ellipse cx={x + 107} cy={cy} rx={52} ry={40} fill={cellColor(sat)} fillOpacity={0.85} stroke="#fff" strokeOpacity={0.4} strokeWidth={1.5} />
            <ellipse cx={x + 107} cy={cy} rx={24} ry={17} fill="#07050B" fillOpacity={0.35} />
            <SvgText x={x + 107} y={cy + 6} text="Hb" size={18} weight={700} anchor="middle" color="#fff" />
            <Dots d={`M${x + 12} ${cy} L${x + 52} ${cy}`} color={C.nitrite} opacity={0.35 + level * 0.65} reduce={reduce} />
            <Dots d={`M${x + 162} ${cy} L${x + 204} ${cy}`} color={C.no} opacity={level} reduce={reduce} />
            <SvgText x={x + 12} y={cy - 22} text="NO₂⁻" size={16} color={C.nitriteSoft} />
            <SvgText x={x + 204} y={cy - 22} text="NO" size={16} anchor="end" color={C.noSoft} />
            <SvgText x={x + 107} y={cy + 60} text={`${Math.round(sat)}% saturada`} size={16} anchor="middle" color={C.o2Soft} />
        </Frame>
    );
};

export const MbCard = ({ level, lit, solo, reduce }: CardProps) => {
    const x = cardX(1);
    const cy = 134;
    return (
        <Frame i={1} title="Desoxi-mioglobina" place="fibra muscular" big="~36×" bigColor={C.nitrite}
            note="mais rápida que a Hb" level={level} lit={lit} solo={solo}>
            <circle cx={x + 44} cy={cy} r={18} fill="rgba(251,146,60,0.2)" stroke={C.hypoxia} strokeWidth={2} />
            <SvgText x={x + 44} y={cy + 6} text="Mb" size={16} weight={700} anchor="middle" />
            <ellipse cx={x + 150} cy={cy} rx={52} ry={32} fill="rgba(148,163,184,0.12)" stroke={C.placebo} strokeWidth={2} />
            <path d={`M${x + 112} ${cy + 6} l10 -16 l10 20 l10 -20 l10 20 l10 -20 l10 16`} fill="none" stroke={C.placebo} strokeWidth={2} strokeLinejoin="round" opacity={0.8} />
            <SvgText x={x + 150} y={cy + 54} text="mitocôndria" size={16} anchor="middle" color={C.muted} />
            <Dots d={`M${x + 8} ${cy - 40} L${x + 36} ${cy - 18}`} color={C.nitrite} opacity={0.35 + level * 0.65} n={2} reduce={reduce} />
            <Dots d={`M${x + 64} ${cy} L${x + 100} ${cy}`} color={C.no} opacity={level} reduce={reduce} />
            <SvgText x={x + 82} y={cy - 12} text="NO" size={16} anchor="middle" color={C.noSoft} />
        </Frame>
    );
};

export const XorCard = ({ level, lit, solo, reduce }: CardProps) => {
    const x = cardX(2);
    const cy = 134;
    const open = level * 22;
    return (
        <Frame i={2} title="Xantina oxidorredutase" place="enzima com molibdênio" big="só em hipóxia" bigColor={C.hypoxia}
            note="sem NO em normóxia" level={level} lit={lit} solo={solo}>
            <circle cx={x + 152} cy={cy} r={38} fill="rgba(251,146,60,0.12)" stroke={C.hypoxia} strokeWidth={2} />
            <circle cx={x + 152} cy={cy} r={15} fill="rgba(251,146,60,0.35)" stroke={C.hypoxia} strokeWidth={1.5} />
            <SvgText x={x + 152} y={cy + 6} text="Mo" size={16} weight={700} anchor="middle" />
            {/* comporta: abre quando o O₂ cai */}
            <rect x={x + 76} y={cy - 40 - open} width={9} height={40} rx={3} fill={C.placebo} />
            <rect x={x + 76} y={cy + open} width={9} height={40} rx={3} fill={C.placebo} />
            <Dots d={`M${x + 12} ${cy} L${x + 112} ${cy}`} color={C.nitrite} opacity={level > 0.05 ? 0.35 + level * 0.65 : 0.15} reduce={reduce} />
            <SvgText x={x + 12} y={cy - 22} text="NO₂⁻ · NO₃⁻" size={16} color={C.nitriteSoft} />
            <SvgText x={x + 152} y={cy + 60} text="comporta de O₂" size={16} anchor="middle" color={C.muted} />
        </Frame>
    );
};
