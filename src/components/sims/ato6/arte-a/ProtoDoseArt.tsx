import { motion, useReducedMotion } from 'framer-motion';
import { useId } from 'react';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { RangeRow } from '../ui';
import { DOSE_AXIS_MAX, WYLIE_POINTS } from '../protocolContent';
import { mmolToMg, num } from '../shared';
import { ArtSvg, Stage } from './stage';
import { ShotGlass } from './veg';

/** Passo 1 do slide 46: as faixas dos consensos como fitas e a dose-resposta de Wylie 2013 como colunas com o platô. */

const X0 = 40;
const X1 = 780;
const xOf = (mmol: number): number => X0 + (mmol / DOSE_AXIS_MAX) * (X1 - X0);
const BASE = 300;
const PX_PCT = 7;
const TICKS = [0, 2, 4, 6, 8, 10, 12, 14, 16];
const BANDS = [
    { lo: 5, hi: 9, y: 22, color: C.no, name: 'IOC 2018 · 2–3 h antes', text: '5–9 mmol' },
    { lo: 8, hi: 16, y: 56, color: C.o2, name: 'Delphi agudo · 2–4 h antes', text: '8–16 mmol' },
    { lo: 4, hi: 16, y: 90, color: C.bacteria, name: 'Delphi crônico', text: '4–16 mmol por dia · última 2–4 h antes' },
] as const;

export const ProtoDoseArt = ({ dose, onDose }: { dose: number; onDose: (v: number) => void }) => {
    const id = useId();
    const reduce = useReducedMotion();
    const pts = WYLIE_POINTS.map(p => ({ ...p, x: xOf(p.mmol), y: BASE - p.gain * PX_PCT }));
    const curve = `M${pts[0].x},${pts[0].y} C${pts[0].x + 70},${pts[0].y} ${pts[1].x - 70},${pts[1].y} ${pts[1].x},${pts[1].y} S${pts[2].x - 120},${pts[2].y} ${pts[2].x},${pts[2].y}`;
    return (
        <Stage glow={C.no}>
            <ArtSvg w={812} h={384} label="Faixas de dose dos consensos e o platô de Wylie 2013" className="min-h-0 w-full flex-1">
                <defs>
                    <linearGradient id={`${id}-col`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.nitrate} /><stop offset="100%" stopColor={C.nitrateDeep} stopOpacity={0.5} />
                    </linearGradient>
                </defs>
                {BANDS.map(b => (
                    <g key={b.text}>
                        <rect x={xOf(b.lo)} y={b.y} width={xOf(b.hi) - xOf(b.lo)} height={28} rx={8} fill={`${b.color}2a`} stroke={b.color} strokeWidth={1.5} />
                        <SvgText x={xOf(b.lo) - 10} y={b.y + 20} text={b.name} anchor="end" size={16} color={b.color} weight={700} />
                        <SvgText x={xOf(b.lo) + 10} y={b.y + 20} text={b.text} size={16} color="#fff" />
                    </g>
                ))}
                <rect x={X0} y={130} width={xOf(4) - X0} height={BASE - 130} fill="rgba(255,255,255,0.03)" />
                <SvgText x={X0 + 8} y={156} text="Wylie 2013" size={17} color="#fff" weight={700} />
                <SvgText x={X0 + 8} y={177} text="tempo até a falha" size={16} color="#D1D5DB" weight={500} />
                <path d={curve} fill="none" stroke={C.nitrateSoft} strokeWidth={2.5} strokeDasharray="6 6" opacity={0.8} />
                <SvgText x={(pts[1].x + pts[2].x) / 2} y={Math.min(pts[1].y, pts[2].y) - 26} text="platô" anchor="middle" size={20} color={C.nitrateSoft} weight={700} />
                {pts.map((p, i) => (
                    <g key={p.mmol}>
                        <motion.rect x={p.x - 26} y={p.gain ? p.y : BASE - 6} width={52} height={p.gain ? BASE - p.y : 6} rx={8}
                            fill={p.gain ? `url(#${id}-col)` : C.placebo}
                            style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', filter: p.gain ? `drop-shadow(0 0 10px ${C.nitrate}66)` : undefined }}
                            initial={reduce ? false : { scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }} />
                        <ShotGlass x={p.x - 14} y={p.gain ? p.y - 64 : BASE - 50} w={28} h={40} fill={p.mmol / DOSE_AXIS_MAX} />
                        <SvgText x={p.x} y={p.gain ? p.y + 30 : BASE - 60} text={p.label} anchor="middle" size={22} color={p.gain ? '#fff' : C.placebo} weight={800} />
                    </g>
                ))}
                <line x1={X0} x2={X1} y1={BASE} y2={BASE} stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} />
                {TICKS.map(t => <SvgText key={t} x={xOf(t)} y={BASE + 24} text={String(t)} anchor="middle" size={16} color="#D1D5DB" weight={500} />)}
                {WYLIE_POINTS.map(p => <SvgText key={p.mmol} x={xOf(p.mmol)} y={BASE + 48} text={num(p.mmol, 1)} anchor="middle" size={16} color={C.nitrateSoft} weight={700} />)}
                <SvgText x={X1} y={BASE + 72} text="mmol de nitrato · 1 mmol = 62 mg" anchor="end" size={16} color="#9CA3AF" weight={500} />
                <g style={{ transform: `translateX(${xOf(dose)}px)`, transition: 'transform 0.25s ease-out' }}>
                    <rect x={-1.5} y={14} width={3} height={BASE - 14} fill={C.nitrate} style={{ filter: `drop-shadow(0 0 6px ${C.nitrate})` }} />
                    <circle cx={0} cy={BASE} r={7} fill={C.nitrate} stroke="#fff" strokeWidth={2} />
                </g>
            </ArtSvg>
            <div className="px-5 pb-4">
                <RangeRow label="Sua dose" value={dose} min={1} max={16.8} step={0.2} onChange={onDose} color={C.nitrate}
                    right={<><span className="font-display text-[24px] font-semibold text-white">{num(dose, 1)} mmol</span>
                        <span className="ml-2 font-mono text-[14px] text-gray-300">{num(mmolToMg(dose))} mg</span></>} />
            </div>
        </Stage>
    );
};
