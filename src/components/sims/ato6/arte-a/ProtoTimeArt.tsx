import { useReducedMotion } from 'framer-motion';
import { useId } from 'react';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { Illustrative, RangeRow } from '../ui';
import { nitriteAt } from '../protocolContent';
import { num } from '../shared';
import { ArtSvg, Stage } from './stage';
import { ShotGlass } from './veg';

/** Passo 2 do slide 46: da dose à largada. O shot cai na hora escolhida, a onda de nitrito (forma ilustrativa) sobe e a bandeira marca a largada. */

const X0 = 40;
const X1 = 740;
const SPAN = 8;
const xOf = (h: number): number => X0 + ((SPAN - h) / SPAN) * (X1 - X0);
const BASE = 236;
const TOP = 96;
const yOf = (v: number): number => BASE - v * (BASE - TOP);

const curve = (doseAt: number): string => {
    const pts: string[] = [];
    for (let h = doseAt; h >= -0.001; h -= 0.1) pts.push(`${pts.length ? 'L' : 'M'}${xOf(Math.max(h, 0)).toFixed(1)},${yOf(nitriteAt(doseAt - h)).toFixed(1)}`);
    return pts.join(' ');
};

const ZONES = [
    { from: 8, to: 6, color: C.placebo, label: 'cedo demais' },
    { from: 4, to: 2, color: C.no, label: 'janela 2–4 h' },
    { from: 1.5, to: 0, color: C.hypoxia, label: 'tarde' },
] as const;

export const ProtoTimeArt = ({ hours, onHours }: { hours: number; onHours: (v: number) => void }) => {
    const id = useId();
    const reduce = useReducedMotion();
    const atStart = nitriteAt(hours);
    const d = curve(hours);
    return (
        <Stage glow={C.nitrite}>
            <div className="absolute right-4 top-3"><Illustrative>forma ilustrativa da curva</Illustrative></div>
            <ArtSvg w={812} h={330} label="Linha do tempo da dose até a largada" className="min-h-0 w-full flex-1">
                <defs>
                    <linearGradient id={`${id}-a`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.nitrite} stopOpacity={0.45} /><stop offset="100%" stopColor={C.nitrite} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <SvgText x={24} y={30} text="HORAS ANTES DA LARGADA · NITRITO PLASMÁTICO" size={16} color="#9CA3AF" weight={500} />
                {ZONES.map(z => (
                    <g key={z.label}>
                        <rect x={xOf(z.from)} y={56} width={xOf(z.to) - xOf(z.from)} height={BASE - 56} rx={6} fill={z.color} opacity={z.color === C.no ? 0.2 : 0.12} />
                        <SvgText x={(xOf(z.from) + xOf(z.to)) / 2} y={78} text={z.label} anchor="middle" size={17} color={z.color} weight={700} />
                    </g>
                ))}
                <path d={`${d} L${xOf(0)},${BASE} L${xOf(hours)},${BASE}Z`} fill={`url(#${id}-a)`} />
                <path d={d} fill="none" stroke={C.nitrite} strokeWidth={4} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${C.nitrite}88)` }} />
                {!reduce && (
                    <circle r={7} fill="#fff" style={{ filter: `drop-shadow(0 0 8px ${C.nitrite})` }}>
                        <animateMotion dur="3.2s" repeatCount="indefinite" path={d} />
                    </circle>
                )}
                <rect x={xOf(3)} y={BASE + 3} width={xOf(2) - xOf(3)} height={7} rx={3} fill={C.no} />
                <SvgText x={xOf(2.5)} y={BASE + 30} text="IOC 2–3 h" anchor="middle" size={16} color={C.no} />
                <line x1={X0} x2={xOf(0)} y1={BASE} y2={BASE} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
                {[8, 7, 6, 5, 4, 3, 2, 1].map(h => <SvgText key={h} x={xOf(h)} y={BASE + 58} text={`−${h} h`} anchor="middle" size={16} color="#D1D5DB" weight={500} />)}
                <g style={{ transform: `translateX(${xOf(hours)}px)`, transition: 'transform 0.3s ease-out' }}>
                    <line x1={0} x2={0} y1={BASE - 40} y2={BASE} stroke={C.nitrate} strokeWidth={2} strokeDasharray="3 4" />
                    <ShotGlass x={-15} y={BASE - 86} w={30} h={42} />
                    <SvgText x={0} y={BASE - 96} text="dose" anchor="middle" size={16} color={C.nitrateSoft} />
                </g>
                {/* bandeira da largada */}
                <line x1={xOf(0)} x2={xOf(0)} y1={46} y2={BASE + 4} stroke="#fff" strokeWidth={3} />
                <path d={`M${xOf(0)},48 L${xOf(0) + 46},60 L${xOf(0)},74Z`} fill="#fff" />
                <path d={`M${xOf(0) + 10},51 L${xOf(0) + 20},54 L${xOf(0) + 20},62 L${xOf(0) + 10},59Z M${xOf(0) + 30},57 L${xOf(0) + 40},60 L${xOf(0) + 30},63Z`} fill="#07050B" />
                <circle cx={xOf(0)} cy={yOf(atStart)} r={8} fill={C.nitrite} stroke="#fff" strokeWidth={2.5} />
                <SvgText x={xOf(0)} y={BASE + 58} text="largada" anchor="middle" size={16} color="#fff" weight={700} />
                <SvgText x={xOf(0) - 50} y={BASE - 14} text="aquecimento" anchor="middle" size={16} color={C.hypoxia} />
            </ArtSvg>
            <div className="flex flex-col gap-2 px-5 pb-4">
                <p className="m-0 text-[17px] leading-snug text-gray-100">
                    Dose {num(hours, 1)} h antes: na largada, nitrito em <strong style={{ color: C.nitrite }}>{num(atStart * 100)}% do pico</strong>.
                    <span className="text-gray-300"> Nitrato no plasma: meia-vida de ~5 h.</span>
                </p>
                <RangeRow label="Hora da dose" value={hours} min={0.5} max={8} step={0.5} onChange={onHours} color={C.nitrite}
                    right={<span className="font-display text-[24px] font-semibold text-white">{num(hours, 1)} h antes</span>} />
            </div>
        </Stage>
    );
};
