import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import { RULER_MINUTES, type CastMember } from './cast';

/**
 * Perfil de esforço (forma ilustrativa) numa régua comum de 0 a 2 h: o comprimento da mancha é a duração do
 * esforço de cada personagem. Sem texto dentro do SVG; as marcas de tempo ficam em HTML embaixo.
 */

const W = 240;
const H = 44;
const BASE = H - 2;
const PX_PER_MIN = W / RULER_MINUTES;

/** Picos de sprint do Bruno (alturas de 0 a 1), em posições fixas: a forma não muda entre renderizações. */
const SPRINT_PEAKS = [0.95, 0.7, 1, 0.8, 0.9, 0.65, 0.98, 0.75, 0.92, 0.82, 1] as const;

const steadyPath = (minutes: number, intensity: number): string => {
    const width = Math.max(minutes * PX_PER_MIN, 7);
    const top = BASE - intensity * (H - 8);
    return `M0 ${BASE} L0 ${top} L${width} ${top} L${width} ${BASE} Z`;
};

const intermittentPath = (minutes: number, intensity: number): string => {
    const width = minutes * PX_PER_MIN;
    const floor = BASE - intensity * (H - 8) * 0.55;
    const step = width / (SPRINT_PEAKS.length + 1);
    const parts = [`M0 ${BASE}`, `L0 ${floor}`];
    SPRINT_PEAKS.forEach((peak, i) => {
        const x = step * (i + 1);
        parts.push(`L${x - 3} ${floor}`, `L${x - 1.5} ${BASE - peak * (H - 6)}`, `L${x + 1.5} ${BASE - peak * (H - 6)}`, `L${x + 3} ${floor}`);
    });
    parts.push(`L${width} ${floor}`, `L${width} ${BASE} Z`);
    return parts.join(' ');
};

export const EffortProfile = ({ member }: { member: CastMember }) => {
    const reduce = useReducedMotion() ?? false;
    const d = member.effort === 'steady' ? steadyPath(member.minutes, member.intensity) : intermittentPath(member.minutes, member.intensity);
    return (
        <div>
            <motion.div initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }}
                transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.25, ease: 'easeOut' }}>
                <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height={H} role="img"
                    aria-label={`Perfil de esforço de ${member.name}: ${member.durationLabel}`}>
                    <path d={d} fill={`${C.nitrate}40`} stroke={C.nitrateSoft} strokeWidth={1.6} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                </svg>
            </motion.div>
            <div className="relative h-[3px] rounded-full bg-white/25">
                {[0, 0.25, 0.5, 0.75, 1].map(t => (
                    <span key={t} className="absolute -top-[3px] h-[9px] w-px bg-white/40" style={{ left: `${t * 100}%` }} />
                ))}
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[16px] leading-none text-gray-400">
                <span>0</span><span>1 h</span><span>2 h</span>
            </div>
        </div>
    );
};
