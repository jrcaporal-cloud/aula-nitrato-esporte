import { motion } from 'framer-motion';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { useEntered } from '../../ato4/hooks';
import { Flag } from '../artKit/Figures';
import { SvgCount, SvgKeyFact, SvgReveal } from '../beat';
import { ridgeY } from './geometry';

/** Passo 2 — Shannon 2016: 12 corredores sobem a encosta (todos melhoraram) e as barras de tempo do 1.500 m. */

const COUNT = 12;
const runnerX = (i: number) => 200 + i * 45;

const Climber = ({ i, reduce }: { i: number; reduce: boolean }) => {
    const x = runnerX(i);
    const y = ridgeY(x) - 24;
    return (
        <motion.g initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 36, x: reduce ? 0 : -30 }} animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.3 + i * 0.09, ease: 'easeOut' }}>
            <circle cx={x} cy={y} r={14} fill={`${C.no}30`} stroke={C.no} strokeWidth={2.5} />
            <path d={`M ${x} ${y + 7} v -13 m -6 6 l 6 -7 l 6 7`} fill="none" stroke={C.no} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>
    );
};

const TIME_PX = 190 / 341.9;

export const RunnersArt = ({ reduce }: { reduce: boolean }) => {
    const go = useEntered(reduce);
    const t = (d: number) => `transform 1s cubic-bezier(0.22,0.8,0.24,1) ${d}s`;
    return (
        <g>
            <SvgKeyFact color={C.no} delay={reduce ? 0 : 1.2}>
                <SvgCount x={24} y={80} text="12 / 12" size={54} weight={700} color={C.no} count={{ delayMs: 300, ms: 1100 }} />
            </SvgKeyFact>
            <SvgReveal order={2}>
                <SvgText x={24} y={112} text="melhoraram o 1.500 m" size={21} weight={700} color="#fff" />
                <SvgText x={420} y={150} text="12 corredores, VO₂max de 47,1 a 76,8: cada um é um ponto" size={16} weight={600} anchor="middle" color="#CBD5E1" />
                <SvgText x={420} y={174} text="melhora sem relação com o VO₂max (r² = 0,05)" size={16} weight={500} anchor="middle" color={C.muted} />
            </SvgReveal>
            <path d={`M 90 ${ridgeY(90) - 8} L 745 ${ridgeY(745) - 8}`} stroke="rgba(255,255,255,0.28)" strokeWidth={3} strokeDasharray="2 9" strokeLinecap="round" />
            <Flag x={760} y={ridgeY(760)} h={46} color={C.no} />
            {Array.from({ length: COUNT }, (_, i) => <Climber key={i} i={i} reduce={reduce} />)}
            <g transform="translate(784 22)">
                <rect width={292} height={170} rx={14} fill="rgba(7,5,11,0.72)" stroke="rgba(255,255,255,0.14)" />
                <SvgText x={16} y={30} text="1.500 m em hipóxia (FiO₂ ~15%)" size={17} weight={700} color="#E5E7EB" />
                {([['placebo', 341.9, '341,9 s', C.placebo, 0], ['beterraba', 331.1, '331,1 s', C.nitrate, 0.15]] as const).map(([k, v, txt, color, d], i) => (
                    <g key={k} transform={`translate(0 ${48 + i * 40})`}>
                        <SvgText x={16} y={22} text={k} size={16} weight={600} color={color === C.placebo ? '#CBD5E1' : C.nitrateSoft} />
                        <rect x={100} width={v * TIME_PX} height={30} rx={6} fill={color} fillOpacity={0.9}
                            style={{ transformBox: 'fill-box', transformOrigin: 'left center', transform: `scaleX(${go ? 1 : 0})`, transition: t(d) }} />
                        <SvgText x={100 + v * TIME_PX - 8} y={22} text={txt} size={17} weight={700} anchor="end" color="#fff" />
                    </g>
                ))}
                <SvgCount x={16} y={152} text="−3,2%" size={32} weight={700} color={C.nitrate} count={{ delayMs: 500 }} />
                <SvgReveal order={2} delay={0.4}>
                    <SvgText x={118} y={152} text="tempo com beterraba" size={16} weight={500} color={C.muted} />
                </SvgReveal>
            </g>
        </g>
    );
};
