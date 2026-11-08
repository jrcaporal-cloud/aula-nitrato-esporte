import { motion } from 'framer-motion';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { SCORE } from '../altitude.content';
import { Flag } from '../artKit/Figures';
import { SvgCount, SvgReveal } from '../beat';

/** Passo 5 — o placar: uma montanha só (~2.500 m), cinco bandeiras positivas de um lado e cinco nulas do outro. Altura da bandeira = n. */

const PEAK = { x: 550, y: 76 };
const BASE_L = 380;
const ROW0 = 130;
const ROW_H = 54;
const slopeX = (y: number, side: 1 | -1) => PEAK.x + side * (y - PEAK.y) * (170 / 304);

/** n de cada estudo (o de Kang é uma meta-análise: bandeira larga e fixa). */
const N_POS = [9, 9, 12, 10, 15] as const;
const N_NULL = [10, 11, 12, 8, 0] as const;
const poleH = (n: number) => (n === 0 ? 34 : 18 + n * 1.7);

interface RowProps {
    who: string;
    what: string;
    n: number;
    i: number;
    side: 1 | -1;
    color: string;
    reduce: boolean;
}

const Row = ({ who, what, n, i, side, color, reduce }: RowProps) => {
    const y = ROW0 + i * ROW_H;
    const fx = slopeX(y, side);
    const labelX = fx + side * 40;
    return (
        <motion.g initial={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : side * 16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : 0.2 + i * 0.12 + (side === 1 ? 0.6 : 0) }}>
            <line x1={fx + side * 6} x2={labelX - side * 6} y1={y - 6} y2={y - 6} stroke={color} strokeOpacity={0.5} strokeDasharray="2 5" />
            <Flag x={fx} y={y} h={poleH(n)} w={n === 0 ? 40 : 26} color={color} />
            <SvgText x={labelX} y={y - 12} text={who} size={17} weight={700} anchor={side === 1 ? 'start' : 'end'} color="#fff" />
            <SvgText x={labelX} y={y + 9} text={what} size={16} weight={500} anchor={side === 1 ? 'start' : 'end'} color="#CBD5E1" />
        </motion.g>
    );
};

export const ScoreArt = ({ reduce }: { reduce: boolean }) => (
    <g>
        <path d={`M ${BASE_L - 40} 384 L ${PEAK.x} ${PEAK.y} L ${1100 - BASE_L + 40} 384 Z`} fill="url(#alt-main)" opacity={0.96} />
        <path d={`M ${PEAK.x - 34} ${PEAK.y + 60} L ${PEAK.x} ${PEAK.y} L ${PEAK.x + 34} ${PEAK.y + 60} L ${PEAK.x + 14} ${PEAK.y + 50} L ${PEAK.x} ${PEAK.y + 66} L ${PEAK.x - 14} ${PEAK.y + 50} Z`} fill="#fff" opacity={0.22} />
        <path d={`M ${BASE_L - 40} 384 L ${PEAK.x} ${PEAK.y} L ${1100 - BASE_L + 40} 384`} fill="none" stroke="#B9A5F5" strokeOpacity={0.4} strokeWidth={2} />
        <SvgText x={PEAK.x} y={PEAK.y - 14} text="o mesmo cenário · ~2.500 m" size={17} weight={700} anchor="middle" color={C.o2Soft} />
        <SvgCount x={24} y={38} text="POSITIVOS · 5" size={30} weight={700} color={C.no} count={{ delayMs: 200, ms: 700 }} />
        <SvgCount x={1076} y={38} text="NULOS · 5" size={30} weight={700} anchor="end" color={C.hypoxia} count={{ delayMs: 800, ms: 700 }} />
        {SCORE.pos.map((s, i) => <Row key={s.who} {...s} n={N_POS[i]} i={i} side={-1} color={C.no} reduce={reduce} />)}
        {SCORE.nulls.map((s, i) => <Row key={s.who} {...s} n={N_NULL[i]} i={i} side={1} color={C.hypoxia} reduce={reduce} />)}
        <SvgReveal order={2} delay={0.9}>
            <SvgText x={550} y={372} text="altura da bandeira = n (8 a 15)" size={16} weight={500} anchor="middle" color={C.muted} />
        </SvgReveal>
    </g>
);
