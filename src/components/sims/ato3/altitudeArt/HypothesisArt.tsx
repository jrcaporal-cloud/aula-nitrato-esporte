import { motion } from 'framer-motion';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { useEntered } from '../../ato4/hooks';
import { Flag } from '../artKit/Figures';
import { SvgCount, SvgKeyFact, SvgReveal } from '../beat';
import { ridgeY } from './geometry';

/** Passo 1 — Vanhatalo 2011: tolerância (s) em cronômetros; hipóxia + beterraba volta ao nível da normóxia. */

const R = 38;
const CIRC = 2 * Math.PI * R;
const RING_MAX = 500;
/** Espera do useEntered (ms) antes de o cronômetro começar a encher. */
const ENTER_MS = 70;

interface RingProps {
    cx: number;
    cy: number;
    value: number;
    color: string;
    title: string;
    sub: string;
    go: boolean;
    glow?: boolean;
    delay?: number;
    /** Destaque do dado-chave do passo neste cronômetro. */
    hit?: boolean;
}

const Ring = ({ cx, cy, value, color, title, sub, go, glow = false, delay = 0, hit = false }: RingProps) => {
    const num = <SvgCount x={cx} y={cy + 9} text={`${value} s`} size={26} weight={700} anchor="middle" color="#fff" count={{ delayMs: ENTER_MS + delay * 1000, ms: 1300 }} />;
    return (
    <g>
        {glow && (
            <circle cx={cx} cy={cy} r={R + 22} fill={C.no} opacity={0.14}>
                <animate attributeName="opacity" values="0.08;0.24;0.08" dur="2.6s" repeatCount="indefinite" />
            </circle>
        )}
        <circle cx={cx} cy={cy} r={R + 10} fill="rgba(7,5,11,0.7)" />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={10} />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round"
            strokeDasharray={CIRC} strokeDashoffset={go ? CIRC * (1 - value / RING_MAX) : CIRC}
            transform={`rotate(-90 ${cx} ${cy})`} style={{ transition: `stroke-dashoffset 1.3s cubic-bezier(0.22,0.8,0.24,1) ${delay}s`, filter: `drop-shadow(0 0 6px ${color})` }} />
        {hit ? <SvgKeyFact color={color} delay={delay + 0.9}>{num}</SvgKeyFact> : num}
        <SvgText x={cx} y={cy + R + 34} text={title} size={17} weight={700} anchor="middle" color={color} />
        <SvgText x={cx} y={cy + R + 56} text={sub} size={16} weight={500} anchor="middle" color="#CBD5E1" />
    </g>
    );
};

export const HypothesisArt = ({ reduce }: { reduce: boolean }) => {
    const go = useEntered(reduce);
    const baseX = 330;
    const peakX = 760;
    return (
        <g>
            <SvgText x={24} y={32} text="VANHATALO 2011 · 9 saudáveis · extensão de joelho até o limite" size={17} weight={700} color={C.nitrateSoft} />
            <SvgText x={24} y={58} text="beterraba 0,75 L em 24 h (9,3 mmol) × depletada (0,006 mmol)" size={16} weight={500} color={C.muted} />
            <path d={`M ${baseX} 208 V ${ridgeY(baseX) - 4}`} stroke="rgba(255,255,255,0.3)" strokeDasharray="3 6" strokeWidth={2} />
            <path d={`M 700 210 L ${peakX} ${ridgeY(peakX) - 46} L 820 210`} fill="none" stroke="rgba(255,255,255,0.3)" strokeDasharray="3 6" strokeWidth={2} />
            <Flag x={baseX} y={ridgeY(baseX)} h={34} color={C.o2} />
            <Flag x={peakX} y={ridgeY(peakX)} h={44} color={C.hypoxia} />
            <SvgText x={baseX} y={ridgeY(baseX) + 30} text="normóxia · 20,9% O₂" size={16} weight={600} anchor="middle" color={C.o2Soft} />
            <SvgText x={peakX} y={ridgeY(peakX) + 34} text="hipóxia · 14,5% O₂" size={16} weight={600} anchor="middle" color={C.hypoxia} />
            <Ring cx={baseX} cy={112} value={471} color={C.o2} title="Normóxia" sub="nitrito 142 nM · PCr 23 s" go={go} />
            <Ring cx={640} cy={112} value={393} color={C.hypoxia} title="Hipóxia + placebo" sub="nitrito 129 nM · PCr 29 s" go={go} delay={0.2} />
            <Ring cx={880} cy={112} value={477} color={C.nitrate} title="Hipóxia + beterraba" sub="nitrito 194 nM · PCr 24 s" go={go} glow delay={0.4} hit />
            <motion.g initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: reduce ? 0 : 1.2, duration: 0.5 }}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                <path d="M 692 108 H 818 M 806 98 L 818 108 L 806 118" fill="none" stroke={C.nitrate} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
                <SvgText x={755} y={90} text="+21%" size={26} weight={700} anchor="middle" color={C.nitrate} />
                <SvgText x={755} y={140} text="(cálculo)" size={16} weight={500} anchor="middle" color={C.muted} />
            </motion.g>
            <SvgReveal order={2} delay={0.4}>
                <SvgText x={peakX + 60} y={ridgeY(peakX) + 64} text="o nitrito vira NO onde falta O₂" size={17} weight={700} anchor="middle" color={C.noSoft} />
                <SvgText x={baseX} y={ridgeY(baseX) + 56} text="477 s = 471 s: igual ao nível do mar" size={16} weight={500} anchor="middle" color={C.muted} />
            </SvgReveal>
        </g>
    );
};
