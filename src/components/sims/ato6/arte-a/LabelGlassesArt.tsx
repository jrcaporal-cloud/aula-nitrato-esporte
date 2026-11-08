import { motion, useReducedMotion } from 'framer-motion';
import { useId } from 'react';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { DOSE_BANDS, num } from '../shared';
import { EXAMPLES, POWDER_RANGE } from '../labelContent';
import { ArtSvg, Stage } from './stage';

/** Passo 3 do slide 45: copos de 0 a 9 mmol. O líquido é o medido; a linha com o círculo vazio é o que o rótulo prometia. */

const TOP = 128;
const BASE = 346;
const PX = (BASE - TOP) / 9;
const yOf = (mmol: number): number => BASE - mmol * PX;
const W = 64;
const XS = [108, 232, 356, 480, 604, 728];
const NAMES: readonly (readonly string[])[] = [
    ['Beet It Sport', 'Pro-Elite', 'shot 70 mL'], ['Beet It', 'Organic', 'shot 70 mL'], ['Red Rush', '74 mL'],
    ['BeetElite', 'porção'], ['Superbeets', '5 g de pó'], ['6 pós comuns', 'faixa medida'],
];

export const LabelGlassesArt = () => {
    const id = useId();
    const reduce = useReducedMotion();
    const cols = [
        ...EXAMPLES.map(e => ({ key: e.id, measured: e.measured, label: e.label, sd: e.sd, color: e.measured >= 5 ? C.no : C.hypoxia, range: null as null | typeof POWDER_RANGE })),
        { key: 'powders', measured: 0, label: undefined, sd: undefined, color: C.hypoxia, range: POWDER_RANGE },
    ];
    return (
        <Stage glow={C.hypoxia}>
            <ArtSvg label="Nitrato medido em cinco produtos contra o valor do rótulo">
                <defs>
                    <linearGradient id={`${id}-l`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fff" stopOpacity={0.25} /><stop offset="100%" stopColor="#fff" stopOpacity={0} /></linearGradient>
                </defs>
                <line x1={66} x2={796} y1={yOf(5)} y2={yOf(5)} stroke={C.no} strokeWidth={2} strokeDasharray="7 6" />
                <SvgText x={10} y={yOf(5) - 6} text="IOC" size={16} color={C.no} weight={700} />
                <SvgText x={10} y={yOf(5) + 18} text="5 mmol" size={16} color={C.no} weight={700} />
                {cols.map((c, i) => {
                    const x = XS[i];
                    const worse = c.label !== undefined && c.measured < c.label * 0.7;
                    return (
                        <g key={c.key}>
                            <rect x={x - W / 2} y={TOP} width={W} height={BASE - TOP} rx={12} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.3)" strokeWidth={1.6} />
                            {c.range ? (
                                <rect x={x - W / 2 + 4} y={yOf(c.range.hi)} width={W - 8} height={yOf(c.range.lo) - yOf(c.range.hi)} rx={7} fill={`${C.hypoxia}88`} stroke={C.hypoxia} strokeWidth={1.6} />
                            ) : (
                                <motion.rect x={x - W / 2 + 3} y={yOf(c.measured)} width={W - 6} height={c.measured * PX - 3} rx={9} fill={c.color}
                                    style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', filter: `drop-shadow(0 0 8px ${c.color}77)` }}
                                    initial={reduce ? false : { scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }} />
                            )}
                            {c.sd !== undefined && <rect x={x - W / 2 + 3} y={yOf(c.measured + c.sd)} width={W - 6} height={2 * c.sd * PX} fill="#fff" opacity={0.3} />}
                            <rect x={x - W / 2 + 10} y={TOP + 8} width={6} height={BASE - TOP - 24} rx={3} fill={`url(#${id}-l)`} />
                            {c.label !== undefined && (
                                <motion.g initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + i * 0.08 }}>
                                    {worse && <rect x={x - W / 2 + 3} y={yOf(c.label)} width={W - 6} height={yOf(c.measured) - yOf(c.label)} fill={C.risk} opacity={0.22} />}
                                    <line x1={x - W / 2 - 8} x2={x + W / 2 + 8} y1={yOf(c.label)} y2={yOf(c.label)} stroke="#fff" strokeWidth={2} strokeDasharray="3 3" />
                                    <circle cx={x + W / 2 + 8} cy={yOf(c.label)} r={7} fill="#07050B" stroke="#fff" strokeWidth={2.2} />
                                    {worse && <SvgText x={x + W / 2 + 12} y={yOf(c.label) + (yOf(c.measured) - yOf(c.label)) * 0.3 + 9} text="3×" size={26} color={C.risk} weight={800} />}
                                </motion.g>
                            )}
                            <SvgText x={x} y={64} text={c.range ? `${num(c.range.lo, 1)}–${num(c.range.hi, 1)}` : num(c.measured, 2)} anchor="middle" size={26} color={c.color} weight={800} />
                            <SvgText x={x} y={90} text={c.label !== undefined ? `rótulo ${num(c.label, 2)}` : c.range ? 'mmol medidos' : 'só medido'} anchor="middle" size={16} color="#D1D5DB" weight={500} />
                            {NAMES[i].map((t, k) => (
                                <SvgText key={t} x={x} y={374 + k * 20} text={t} anchor="middle" size={16} color={k === 0 ? '#fff' : '#9CA3AF'} weight={k === 0 ? 700 : 500} />
                            ))}
                        </g>
                    );
                })}
                <g>
                    <circle cx={26} cy={444} r={6} fill="#07050B" stroke="#fff" strokeWidth={2} />
                    <SvgText x={40} y={450} text="rótulo" size={16} color="#E5E7EB" weight={500} />
                    <circle cx={116} cy={444} r={6} fill={C.hypoxia} />
                    <SvgText x={130} y={450} text="medido (mmol por porção)" size={16} color="#E5E7EB" weight={500} />
                    <rect x={338} y={438} width={14} height={12} fill="#fff" opacity={0.35} />
                    <SvgText x={360} y={450} text="± 1 DP" size={16} color="#E5E7EB" weight={500} />
                    <SvgText x={786} y={450} text={`${DOSE_BANDS.ioc.lo} mmol = dose mínima do IOC`} anchor="end" size={16} color={C.no} weight={500} />
                </g>
            </ArtSvg>
        </Stage>
    );
};
