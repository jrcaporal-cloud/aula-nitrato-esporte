import { motion } from 'framer-motion';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { Cyclist } from '../artKit/Figures';
import { NUMBER_DELAY_MS } from '../countText';
import { SvgCount, SvgReveal } from '../beat';
import { LabRoom } from './Stage';

/** Passo 1 — Londres 2012: o ciclista no ergômetro do laboratório "pedala" o percurso olímpico do contrarrelógio. */

const COURSE = 'M 640 210 C 620 120, 720 70, 820 100 S 990 190, 1000 130 S 960 60, 900 60 M 640 210 C 680 250, 800 260, 880 230 S 1010 200, 1000 130';
const LOOP = 'M 640 210 C 620 120, 720 70, 820 100 S 990 190, 1000 130 S 1010 200, 880 230 S 680 250, 640 210 Z';

const STATS = [['Mulheres', '29,35 km'], ['Homens', '43,83 km'], ['Duração', '~50–60 min']] as const;

export const CourseArt = ({ reduce }: { reduce: boolean }) => (
    <g>
        <LabRoom x0={-10} x1={500} floor={276} />
        <rect x={250} y={70} width={210} height={128} rx={10} fill="#07101F" stroke={C.o2} strokeOpacity={0.6} strokeWidth={2} />
        <SvgText x={266} y={98} text="potência (W)" size={16} weight={600} color={C.o2Soft} />
        <path d="M 266 170 l 18 -14 l 16 8 l 18 -26 l 16 12 l 18 -20 l 16 18 l 18 -12 l 16 6 l 18 -16 l 18 10" fill="none" stroke={C.o2} strokeWidth={3} strokeLinejoin="round">
            {!reduce && <animate attributeName="stroke-dasharray" values="0 400;400 0" dur="3s" repeatCount="indefinite" />}
        </path>
        <Cyclist x={140} y={276} s={1.45} color={C.o2} still={reduce} />
        <SvgText x={24} y={36} text="LABORATÓRIO · LANE 2014" size={17} weight={700} color={C.o2Soft} />
        <SvgReveal order={2} delay={0.3}>
            {['12 homens e 12 mulheres, ciclistas competitivos', 'beterraba 8,4 mmol, 2 h antes; cafeína 40 min antes', 'quatro condições, duplo-cego, quadrado latino'].map((t, i) => (
                <SvgText key={t} x={24} y={308 + i * 24} text={t} size={16} weight={i === 0 ? 600 : 500} color={i === 0 ? '#E5E7EB' : '#CBD5E1'} />
            ))}
        </SvgReveal>
        <path d="M 512 150 H 590 M 576 138 L 590 150 L 576 162" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        <SvgText x={551} y={130} text="simula" size={17} weight={600} anchor="middle" color={C.muted} />
        <rect x={604} y={20} width={472} height={258} rx={16} fill="rgba(240,67,126,0.05)" stroke="rgba(255,255,255,0.14)" />
        <SvgText x={624} y={50} text="Percurso olímpico 2012 · contrarrelógio de estrada" size={17} weight={700} color="#fff" />
        <path d={COURSE} fill="none" stroke="#3B1530" strokeWidth={16} strokeLinecap="round" />
        <motion.path d={COURSE} fill="none" stroke={C.nitrate} strokeWidth={5} strokeLinecap="round"
            initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduce ? 0 : 1.8, ease: 'easeInOut' }} />
        <circle cx={640} cy={210} r={9} fill={C.no} stroke="#fff" strokeWidth={2} />
        <SvgText x={656} y={216} text="largada" size={16} weight={600} color={C.noSoft} />
        <circle r={8} fill="#fff" cx={reduce ? 640 : 0} cy={reduce ? 210 : 0} style={{ filter: `drop-shadow(0 0 6px ${C.nitrate})` }}>
            {!reduce && <animateMotion dur="7s" repeatCount="indefinite" path={LOOP} />}
        </circle>
        {STATS.map(([k, v], i) => (
            <SvgReveal key={k} order={1} delay={i * 0.1}>
                <g transform={`translate(${604 + i * 160} 292)`}>
                    <rect width={150} height={74} rx={12} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.16)" />
                    <SvgText x={14} y={27} text={k} size={16} weight={500} color={C.muted} />
                    {i < 2
                        ? <SvgCount x={14} y={60} text={v} size={24} weight={700} color="#fff" count={{ delayMs: NUMBER_DELAY_MS + i * 100 }} />
                        : <SvgText x={14} y={60} text={v} size={20} weight={700} color="#fff" />}
                </g>
            </SvgReveal>
        ))}
    </g>
);
