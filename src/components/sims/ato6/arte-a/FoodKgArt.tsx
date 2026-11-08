import { motion, useReducedMotion } from 'framer-motion';
import { useId } from 'react';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { FOODS } from '../foodContent';
import { mgToMmol, num } from '../shared';
import { ArtSvg, Stage } from './stage';
import { Glyph } from './veg';
import { SvgCount, SvgReveal } from './rhythm';
import { SvgKeyFact } from '../../ato5/countText';

/** Passo 1 do slide 44: quatro tubos de ensaio iguais; o nível de nitrato é a mediana EFSA por quilo (4.800 → tubo cheio). */

const BASE = 366;
const TUBE_H = 236;
const TUBE_W = 84;
const MAX_KG = 4800;
const XS = [142, 292, 442, 592];

export const FoodKgArt = () => {
    const id = useId();
    const reduce = useReducedMotion();
    const beetY = BASE - (1100 / MAX_KG) * TUBE_H;
    return (
        <Stage glow={C.nitrate}>
            <ArtSvg label="Nitrato por quilo: rúcula, beterraba, espinafre e aipo">
                <defs>
                    <linearGradient id={`${id}-liq`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.nitrate} />
                        <stop offset="100%" stopColor={C.nitrateDeep} />
                    </linearGradient>
                </defs>
                <SvgText x={24} y={32} text="MEDIANA DE NITRATO · MG POR KG DE VEGETAL FRESCO" size={16} color="#9CA3AF" weight={500} />
                <line x1={20} x2={660} y1={beetY} y2={beetY} stroke={C.nitrateSoft} strokeOpacity={0.55} strokeDasharray="5 6" />
                <SvgText x={22} y={beetY - 26} text="nível da" size={16} color={C.nitrateSoft} />
                <SvgText x={22} y={beetY - 6} text="beterraba" size={16} color={C.nitrateSoft} />
                {FOODS.map((f, i) => {
                    const x = XS[i];
                    const h = (f.mgPerKg / MAX_KG) * TUBE_H;
                    return (
                        <g key={f.id}>
                            <g transform={`translate(${x} ${BASE - TUBE_H - 22}) scale(1.7)`}><Glyph kind={f.id} /></g>
                            <rect x={x - TUBE_W / 2} y={BASE - TUBE_H} width={TUBE_W} height={TUBE_H} rx={16} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.28)" strokeWidth={1.6} />
                            <motion.rect x={x - TUBE_W / 2 + 3} y={BASE - h - 0} width={TUBE_W - 6} height={h} rx={12} fill={`url(#${id}-liq)`}
                                style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', filter: `drop-shadow(0 0 8px ${C.nitrate}66)` }}
                                initial={reduce ? false : { scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }} />
                            <rect x={x - TUBE_W / 2 + 12} y={BASE - TUBE_H + 12} width={5} height={TUBE_H - 30} rx={2.5} fill="#fff" opacity={0.1} />
                            <SvgText x={x} y={BASE + 30} text={f.name} anchor="middle" size={19} color="#fff" weight={700} />
                            {i === 0 ? (
                                <SvgKeyFact color={C.nitrate}>
                                    <SvgCount x={x} y={BASE + 56} text={num(f.mgPerKg)} anchor="middle" size={24} color={C.nitrateSoft} weight={700} />
                                </SvgKeyFact>
                            ) : <SvgCount x={x} y={BASE + 56} text={num(f.mgPerKg)} anchor="middle" size={24} color={C.nitrateSoft} weight={700} />}
                            <SvgReveal order={2}>
                                <SvgText x={x} y={BASE + 78} text={`${num(mgToMmol(f.mgPerKg / 10), 1)} mmol/100 g`} anchor="middle" size={16} color="#D1D5DB" weight={500} />
                            </SvgReveal>
                        </g>
                    );
                })}
                {/* seta de 4×: do nível da beterraba ao da rúcula */}
                <SvgReveal order={2}>
                    <line x1={676} x2={676} y1={BASE - TUBE_H + 2} y2={beetY} stroke={C.nitrite} strokeWidth={2.5} />
                    <path d={`M668,${BASE - TUBE_H + 12} L676,${BASE - TUBE_H + 2} L684,${BASE - TUBE_H + 12} M668,${beetY - 10} L676,${beetY} L684,${beetY - 10}`} stroke={C.nitrite} strokeWidth={2.5} fill="none" strokeLinecap="round" />
                    <SvgText x={694} y={168} text="≈ 4×" size={44} color={C.nitrite} weight={800} />
                    <SvgText x={694} y={196} text="o nitrato da" size={17} color="#F3F4F6" />
                    <SvgText x={694} y={217} text="beterraba" size={17} color="#F3F4F6" />
                    <SvgText x={694} y={262} text="A raiz famosa" size={16} color="#9CA3AF" weight={500} />
                    <SvgText x={694} y={283} text="nem lidera" size={16} color="#9CA3AF" weight={500} />
                    <SvgText x={694} y={304} text="a lista." size={16} color="#9CA3AF" weight={500} />
                </SvgReveal>
            </ArtSvg>
        </Stage>
    );
};
