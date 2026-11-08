import { motion, useReducedMotion } from 'framer-motion';
import { useId } from 'react';
import { SvgText } from '../../kit/ui';
import { CASES, type CaseVerdict } from '../cases';
import { FOODS } from '../foodContent';
import { PRESETS, type PresetCase } from '../protocolContent';
import { SHOT_MMOL, gramsFor, mmolToMg, num } from '../shared';
import { C } from '../../kit/palette';
import { ArtSvg, Stage } from './stage';
import { Portrait } from './portrait';
import { ShotGlass } from './veg';

/**
 * Passo 5 do slide 46: o dia de cada personagem numa régua de 04h a 23h (céu de madrugada → dia → noite).
 * Janela de 2–4 h na cor do personagem, o shot na hora da última dose, a bandeira da prova e, entre a dose e a largada,
 * a faixa listrada do "sem enxaguante antisséptico".
 */

const W = 1110;
const T0 = 4;
const T1 = 23;
const TX0 = 276;
const TX1 = 812;
const xOf = (clock: number): number => TX0 + ((clock - T0) / (T1 - T0)) * (TX1 - TX0);
const LY0 = 82;
const PITCH = 88;
const COLOR = Object.fromEntries(CASES.map(c => [c.id, c.color])) as Record<string, string>;
const clockText = (c: number): string => {
    const h = Math.floor(c);
    const m = Math.round((c - h) * 60);
    return `${String(h).padStart(2, '0')}h${m === 0 ? '' : String(m).padStart(2, '0')}`;
};

const Flag = ({ x, y, color, h = 48 }: { x: number; y: number; color: string; h?: number }) => (
    <g>
        <line x1={x} x2={x} y1={y} y2={y + h} stroke="#fff" strokeWidth={2.5} />
        <path d={`M${x},${y + 1} L${x + 24},${y + 8} L${x},${y + 15}Z`} fill={color} />
    </g>
);

const Lane = ({ p, top, hatch, sky }: { p: PresetCase; top: number; hatch: string; sky: string }) => {
    const color = COLOR[p.id];
    const doseAt = p.eventAt - p.hoursBefore;
    const end = p.eventAt + p.eventHours;
    return (
        <g>
            <rect x={6} y={top} width={W - 12} height={PITCH - 8} rx={14} fill="rgba(255,255,255,0.025)" stroke={`${color}55`} />
            <g transform={`translate(44 ${top + 40})`}><Portrait who={p.id as CaseVerdict['id']} color={color} r={30} /></g>
            <SvgText x={86} y={top + 30} text={p.name} size={24} color="#fff" weight={800} />
            <SvgText x={86} y={top + 52} text={p.sport} size={16} color="#E5E7EB" weight={500} />
            <SvgText x={86} y={top + 72} text={p.vo2} size={16} color="#9CA3AF" weight={500} />
            <rect x={TX0} y={top + 8} width={TX1 - TX0} height={46} rx={8} fill={`url(#${sky})`} />
            {[8, 12, 16, 20].map(g => <line key={g} x1={xOf(g)} x2={xOf(g)} y1={top + 8} y2={top + 54} stroke="rgba(255,255,255,0.12)" />)}
            <rect x={xOf(Math.max(p.eventAt - 4, T0))} y={top + 10} width={xOf(p.eventAt - 2) - xOf(Math.max(p.eventAt - 4, T0))} height={42} rx={6} fill={`${color}33`} stroke={color} strokeWidth={1.5} />
            <rect x={xOf(doseAt)} y={top + 47} width={xOf(p.eventAt) - xOf(doseAt)} height={7} fill={`url(#${hatch})`} />
            <rect x={xOf(p.eventAt)} y={top + 47} width={Math.max(xOf(end) - xOf(p.eventAt), 5)} height={7} rx={2} fill={color} />
            <ShotGlass x={xOf(doseAt) - 10} y={top + 14} w={20} h={28} />
            <SvgText x={xOf(doseAt) + 14} y={top + 36} text={clockText(doseAt)} size={16} color={C.nitrateSoft} weight={700} />
            <Flag x={xOf(p.eventAt)} y={top + 6} color={color} />
            <SvgText x={xOf(p.eventAt) + 28} y={top + 24} text={clockText(p.eventAt)} size={16} color="#fff" weight={700} />
            <SvgText x={TX0} y={top + 74} text={p.scheme} size={16} color="#E5E7EB" weight={500} />
            <SvgText x={836} y={top + 30} text={`${num(p.mmol, 1)} mmol · ${num(mmolToMg(p.mmol))} mg`} size={22} color="#fff" weight={800} />
            <SvgText x={836} y={top + 52} text={`≈ ${num(p.mmol / SHOT_MMOL, 1)} shot · ${num(gramsFor(p.mmol, FOODS[0].mgPerKg))} g de rúcula`} size={16} color="#F3F4F6" weight={500} />
            <SvgText x={836} y={top + 72} text={p.source} size={16} color="#9CA3AF" weight={500} />
        </g>
    );
};

export const ProtoDayArt = () => {
    const id = useId();
    const reduce = useReducedMotion();
    return (
        <Stage glow={C.o2}>
            <ArtSvg w={W} h={458} label="O dia de cada personagem: última dose, janela de 2 a 4 horas e a prova">
                <defs>
                    <linearGradient id={`${id}-sky`} gradientUnits="userSpaceOnUse" x1={TX0} x2={TX1} y1={0} y2={0}>
                        <stop offset="0%" stopColor="#1C1A3E" /><stop offset="14%" stopColor="#3B2B4E" /><stop offset="26%" stopColor="#4A3A2E" />
                        <stop offset="50%" stopColor="#2B3A50" /><stop offset="78%" stopColor="#3D2B3C" /><stop offset="100%" stopColor="#15132E" />
                    </linearGradient>
                    <pattern id={`${id}-h`} width={8} height={8} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <rect width={8} height={8} fill={`${C.bacteria}33`} /><rect width={3.5} height={8} fill={C.bacteria} />
                    </pattern>
                </defs>
                <g>
                    <ShotGlass x={14} y={10} w={16} h={22} />
                    <SvgText x={38} y={28} text="última dose" size={16} color="#E5E7EB" weight={500} />
                    <rect x={150} y={13} width={28} height={16} rx={4} fill="rgba(255,255,255,0.12)" stroke="#fff" strokeWidth={1.2} />
                    <SvgText x={186} y={28} text="janela de 2–4 h antes" size={16} color="#E5E7EB" weight={500} />
                    <Flag x={372} y={10} color="#fff" h={22} />
                    <SvgText x={402} y={28} text="prova" size={16} color="#E5E7EB" weight={500} />
                    <rect x={470} y={17} width={30} height={9} fill={`url(#${id}-h)`} />
                    <SvgText x={508} y={28} text="sem enxaguante antisséptico" size={16} color={C.bacteria} weight={600} />
                </g>
                {[4, 8, 12, 16, 20].map(h => <SvgText key={h} x={xOf(h)} y={74} text={`${String(h).padStart(2, '0')}h`} anchor="middle" size={16} color="#D1D5DB" weight={500} />)}
                {PRESETS.map((p, i) => (
                    <motion.g key={p.id} initial={reduce ? false : { opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.14, duration: 0.45 }}>
                        <Lane p={p} top={LY0 + i * PITCH} hatch={`${id}-h`} sky={`${id}-sky`} />
                    </motion.g>
                ))}
                <SvgText x={W / 2} y={448} text="exemplos de cálculo com a literatura, não são prescrição · horários inventados para a aula" anchor="middle" size={16} color="#9CA3AF" weight={500} />
            </ArtSvg>
        </Stage>
    );
};
