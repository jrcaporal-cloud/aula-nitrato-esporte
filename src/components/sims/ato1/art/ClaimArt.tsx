import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../../kit/palette';
import type { Viz } from '../claims';

/** Arte do número que decide a frase: barras de vidro (efeito presente em magenta, ausente em ardósia) ou a janela do nitrito. */

const BarsArt = ({ viz, delay }: { viz: Extract<Viz, { kind: 'bars' }>; delay: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex flex-col gap-2.5">
            {viz.bars.map((bar, i) => {
                const color = bar.hit ? C.nitrate : C.placebo;
                const pct = Math.max((bar.value / viz.max) * 100, 0);
                const at = reduce ? 0 : delay + i * 0.14;
                return (
                    <div key={bar.label}>
                        <div className="flex items-baseline justify-between gap-2 leading-none">
                            <span className="text-[16px] text-gray-300">{bar.label}</span>
                            <motion.span className="whitespace-nowrap text-[20px] font-bold" style={{ color: bar.hit ? C.nitrateSoft : C.muted }}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: at + 0.4, duration: 0.3 }}>
                                {bar.shown}
                            </motion.span>
                        </div>
                        <div className="relative mt-1.5 h-[16px] overflow-hidden rounded-full border border-white/10 bg-black/40">
                            <motion.div className="relative h-full overflow-hidden rounded-full"
                                style={{ background: `linear-gradient(180deg, ${color}, ${bar.hit ? C.nitrateDeep : '#475569'})`, minWidth: 6, boxShadow: `0 0 16px -2px ${color}` }}
                                initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: reduce ? 0 : 0.8, delay: at, ease: 'easeOut' }}>
                                {!reduce && (
                                    <motion.span aria-hidden className="absolute inset-y-0 w-10 -skew-x-12 bg-white/35 blur-[2px]"
                                        initial={{ x: -50 }} animate={{ x: 420 }} transition={{ duration: 1.6, delay: at + 0.7, repeat: Infinity, repeatDelay: 2.4, ease: 'easeInOut' }} />
                                )}
                            </motion.div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const AX0 = 10;
const PER_H = 66;
const hx = (h: number) => AX0 + h * PER_H;
const CURVE = `M${hx(0)} 86 C${hx(0.9)} 86 ${hx(1.4)} 80 ${hx(1.8)} 62 C${hx(2.1)} 46 ${hx(2.3)} 30 ${hx(2.5)} 30 C${hx(2.7)} 30 ${hx(2.9)} 46 ${hx(3.2)} 62 C${hx(3.6)} 80 ${hx(3.9)} 86 ${hx(4)} 86`;

/** Eixo de 0 a 4 h: a dose no zero (tomada no aquecimento) e a faixa de 2 a 3 h em que o nitrito do plasma chega ao pico. */
const WindowArt = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox="0 0 286 138" width="100%" height={138} role="img" aria-label="Pico do nitrito entre 2 e 3 horas depois da dose" className="block overflow-visible">
            <defs>
                <linearGradient id="winFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor={C.nitrite} stopOpacity={0.55} />
                    <stop offset="1" stopColor={C.nitrite} stopOpacity={0} />
                </linearGradient>
            </defs>
            <rect x={hx(2)} y={14} width={PER_H} height={72} rx={8} fill={C.nitrite} fillOpacity={0.14} stroke={C.nitrite} strokeOpacity={0.6} strokeDasharray="5 5" />
            <path d={`${CURVE} V86 H${hx(0)}Z`} fill="url(#winFill)" />
            <path id="winCurve" d={CURVE} fill="none" stroke={C.nitriteSoft} strokeWidth={3.5} strokeLinecap="round" />
            <line x1={AX0} x2={hx(4)} y1={86} y2={86} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
            {[0, 1, 2, 3, 4].map(h => (
                <g key={h}>
                    <line x1={hx(h)} x2={hx(h)} y1={86} y2={92} stroke="rgba(255,255,255,0.45)" />
                    <text x={hx(h)} y={110} textAnchor="middle" fontSize={16} fill="#9CA3AF" style={{ fontFamily: 'var(--font-mono)' }}>{h}</text>
                </g>
            ))}
            <g>
                <line x1={AX0} x2={AX0} y1={20} y2={86} stroke={C.nitrate} strokeWidth={3} strokeLinecap="round" />
                <circle cx={AX0} cy={20} r={7} fill={C.nitrate}>
                    {!reduce && <animate attributeName="r" values="7;10;7" dur="1.8s" repeatCount="indefinite" />}
                </circle>
                <text x={AX0 + 12} y={16} fontSize={16} fontWeight={600} fill={C.nitrateSoft} style={{ fontFamily: 'var(--font-body)' }}>aquecimento</text>
            </g>
            <text x={hx(2.5)} y={134} textAnchor="middle" fontSize={16} fontWeight={600} fill={C.nitriteSoft} style={{ fontFamily: 'var(--font-body)' }}>pico do nitrito</text>
            <circle r={6} fill="#fff" stroke={C.nitrite} strokeWidth={3}>
                {!reduce && <animateMotion dur="3.4s" repeatCount="indefinite" begin="0.8s" path={CURVE} />}
            </circle>
        </svg>
    );
};

export const ClaimArt = ({ viz, delay = 0.6 }: { viz: Viz; delay?: number }) => (
    <div>
        <p className="mb-2 font-mono text-[16px] leading-tight text-gray-400">{viz.title}</p>
        {viz.kind === 'bars' ? <BarsArt viz={viz} delay={delay} /> : <WindowArt />}
    </div>
);
