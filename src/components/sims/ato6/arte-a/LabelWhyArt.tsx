import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { CATEGORIES } from '../labelContent';
import { SHOT_MMOL, num } from '../shared';
import type { ProductKind } from './artData';
import { Product } from './products';
import { ArtSvg, BigNum, Stage } from './stage';
import { SvgCount, SvgReveal } from './rhythm';
import { CountText } from '../../ato5/countText';
import { KeyFact, Reveal } from '../../kit/rhythm';

/** Passo 4 do slide 45: a balança rótulo × medido (Red Rush: 8,06 no rótulo, 2,39 medidos) e as causas da variação. */

const KIND: Record<string, ProductKind> = { po: 'po', conc: 'conc', suco: 'suco', mista: 'mista' };
const TILT = 13;
const ARM = 88;
const DROP = ARM * Math.sin((TILT * Math.PI) / 180);
const PY = 78;

const Pan = ({ x, side, children }: { x: number; side: 1 | -1; children: React.ReactNode }) => {
    const reduce = useReducedMotion();
    return (
        <g transform={`translate(${x} ${PY})`}>
            <motion.g initial={reduce ? false : { y: 0 }} animate={{ y: side * DROP }} transition={{ duration: 1.1, delay: 0.3, ease: [0.34, 1.4, 0.5, 1] }}>
                <path d="M0,0 L-54,96 M0,0 L54,96" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
                <path d="M-62,96 Q0,128 62,96Z" fill="#3A3446" stroke="rgba(255,255,255,0.5)" strokeWidth={1.6} />
                {children}
            </motion.g>
        </g>
    );
};

const Balance = () => {
    const reduce = useReducedMotion();
    return (
        <ArtSvg w={300} h={420} label="Balança: o rótulo promete 8,06 mmol; o laboratório mediu 2,39" className="h-[420px] w-[300px] shrink-0">
            <path d="M150,78 L150,334 M96,334 L204,334" stroke="rgba(255,255,255,0.45)" strokeWidth={5} strokeLinecap="round" />
            <path d="M110,334 Q150,302 190,334Z" fill="#3A3446" />
            <motion.g initial={reduce ? false : { rotate: 0 }} animate={{ rotate: -TILT }} transition={{ duration: 1.1, delay: 0.3, ease: [0.34, 1.4, 0.5, 1] }}>
                <rect x={150 - ARM} y={PY - 5} width={2 * ARM} height={10} rx={5} fill="#E5E7EB" />
                <circle cx={150 - ARM} cy={PY} r={7} fill="#E5E7EB" /><circle cx={150 + ARM} cy={PY} r={7} fill="#E5E7EB" />
            </motion.g>
            <circle cx={150} cy={PY} r={10} fill="#07050B" stroke="#E5E7EB" strokeWidth={3} />
            <Pan x={150 - ARM} side={1}>
                <path d="M-30,52 L18,52 L30,64 L30,92 L-30,92Z" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinejoin="round" transform="translate(0 -2)" />
                <circle cx={-18} cy={64} r={4.5} fill="none" stroke="#fff" strokeWidth={2} />
            </Pan>
            <Pan x={150 + ARM} side={-1}>
                <g transform="translate(0 96) scale(0.8)"><Product kind="conc" accent={C.hypoxia} level={0.3} /></g>
            </Pan>
            <SvgText x={150 - ARM} y={368} text="rótulo" anchor="middle" size={17} color="#fff" weight={600} />
            <SvgCount x={150 - ARM} y={398} text="8,06" anchor="middle" size={28} color="#fff" weight={800} />
            <SvgText x={150 + ARM} y={368} text="medido" anchor="middle" size={17} color={C.hypoxia} weight={600} />
            <SvgCount x={150 + ARM} y={398} text="2,39" anchor="middle" size={28} color={C.hypoxia} weight={800} />
            <SvgReveal order={2}>
                <SvgText x={150} y={26} text="Red Rush · mmol por porção" anchor="middle" size={16} color="#D1D5DB" weight={500} />
            </SvgReveal>
        </ArtSvg>
    );
};

export const LabelWhyArt = () => (
    <Stage glow={C.nitrite}>
        <div className="flex min-h-0 flex-1 items-center gap-1 pl-1 pr-4">
            <Balance />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <p className="m-0 font-mono text-[14px] uppercase tracking-wider text-gray-400">concentração média · 6 produtos por categoria</p>
                <Reveal order={1} className="grid grid-cols-4 gap-2">
                    {CATEGORIES.map(c => (
                        <div key={c.id} className="flex flex-col items-center rounded-xl border px-1 pb-2 pt-1 text-center" style={{ borderColor: `${c.color}66`, background: `${c.color}12` }}>
                            <svg viewBox="-30 -80 60 84" className="h-[62px] w-[44px]" aria-hidden><Product kind={KIND[c.id]} accent={c.color} /></svg>
                            <p className="m-0 text-[15px] font-semibold leading-tight text-gray-100">{c.name}</p>
                            <p className="m-0 font-display text-[22px] font-semibold leading-tight text-white"><CountText text={c.mean} all /></p>
                            <p className="m-0 font-mono text-[14px] text-gray-300">{c.unit}</p>
                        </div>
                    ))}
                </Reveal>
                <Reveal order={2} className="grid grid-cols-3 gap-2">
                    <BigNum n={<KeyFact color={C.hypoxia} delay={0.5}>30 ± 26%</KeyFact>} color={C.hypoxia} label="entre lotes do mesmo produto (2% a 83%)" />
                    <BigNum n="≈ 50×" color={C.hypoxia} label="do menor ao maior produto" />
                    <BigNum n={`4,2 → ${num(SHOT_MMOL, 1)}`} color={C.nitrate} label="mmol no shot de 70 mL: 2013 (Wylie) × 2017–18" />
                </Reveal>
                <Reveal order={2} delay={0.1}><p className="m-0 rounded-xl border border-white/10 px-3 py-2 text-[16px] leading-snug text-gray-100">
                    Pó típico (5 g) ≈ 1 mmol: <strong className="text-white">um quinto da dose mínima</strong>. Pode explicar parte dos estudos nulos.
                </p></Reveal>
            </div>
        </div>
    </Stage>
);
