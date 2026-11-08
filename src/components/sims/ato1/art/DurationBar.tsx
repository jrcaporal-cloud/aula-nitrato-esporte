import { motion, useReducedMotion } from 'framer-motion';
import { RULER_MINUTES, type CastMember } from '../cast';

/**
 * Duração do esforço na régua comum de 0 a 2 h: a mancha cresce até o tempo da prova, com uma cabeça luminosa na ponta.
 * Contínuo = bloco; intermitente (Bruno) = base leve com picos de sprint. Formas ilustrativas, só o comprimento é dado.
 */

const W = 240;
const H = 34;
const BASE = H - 1;
const PX = W / RULER_MINUTES;
const PEAKS = [0.95, 0.7, 1, 0.8, 0.9, 0.65, 0.98, 0.75, 0.92, 0.82, 1] as const;

const steady = (min: number, k: number) => {
    const w = Math.max(min * PX, 8);
    const top = BASE - k * (H - 6);
    return `M0 ${BASE} L0 ${top} L${w} ${top} L${w} ${BASE}Z`;
};

const intermittent = (min: number, k: number) => {
    const w = min * PX;
    const floor = BASE - k * (H - 6) * 0.55;
    const step = w / (PEAKS.length + 1);
    const parts = [`M0 ${BASE}`, `L0 ${floor}`];
    PEAKS.forEach((p, i) => {
        const x = step * (i + 1);
        parts.push(`L${x - 3} ${floor}`, `L${x - 1.5} ${BASE - p * (H - 4)}`, `L${x + 1.5} ${BASE - p * (H - 4)}`, `L${x + 3} ${floor}`);
    });
    parts.push(`L${w} ${floor}`, `L${w} ${BASE}Z`);
    return parts.join(' ');
};

export const DurationBar = ({ member, color, soft }: { member: CastMember; color: string; soft: string }) => {
    const reduce = useReducedMotion() ?? false;
    const d = member.effort === 'steady' ? steady(member.minutes, member.intensity) : intermittent(member.minutes, member.intensity);
    const end = Math.max(member.minutes * PX, 8);
    const dur = reduce ? 0 : 1.2;
    return (
        <div aria-label={`esforço: ${member.durationLabel}`}>
            <div className="relative" style={{ height: H }}>
                <motion.div className="absolute inset-0" initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }}
                    transition={{ duration: dur, delay: reduce ? 0 : 0.25, ease: 'easeOut' }}>
                    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height={H} className="block" aria-hidden>
                        <defs>
                            <linearGradient id={`dur-${member.initial}`} x1="0" x2="1">
                                <stop offset="0" stopColor={color} stopOpacity={0.15} />
                                <stop offset="1" stopColor={color} stopOpacity={0.65} />
                            </linearGradient>
                        </defs>
                        <path d={d} fill={`url(#dur-${member.initial})`} stroke={soft} strokeWidth={1.6} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                    </svg>
                </motion.div>
                <motion.span aria-hidden className="absolute bottom-[-5px] size-3 rounded-full border-2 border-white"
                    style={{ background: color, boxShadow: `0 0 12px 2px ${color}`, marginLeft: -6 }}
                    initial={{ left: '0%' }} animate={{ left: `${(end / W) * 100}%` }} transition={{ duration: dur, delay: reduce ? 0 : 0.25, ease: 'easeOut' }} />
            </div>
            <div className="relative mt-[5px] h-[3px] rounded-full bg-white/25">
                {[0, 0.25, 0.5, 0.75, 1].map(t => <span key={t} className="absolute -top-[3px] h-[9px] w-px bg-white/40" style={{ left: `${t * 100}%` }} />)}
            </div>
            <div className="mt-1 flex justify-between font-mono text-[14px] leading-none text-gray-400">
                <span>0</span><span>1 h</span><span>2 h</span>
            </div>
        </div>
    );
};
