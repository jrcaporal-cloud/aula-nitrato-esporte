import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, TriangleAlert } from 'lucide-react';
import { C } from '../../kit/palette';
import { SCALES, type CaseVerdict } from '../cases';
import { Kicker } from '../ui';
import { Dial, Meter, Seal } from './caseDial';
import { Portrait } from './portrait';

/** Slide 47: a carta de um caso (retrato, evidência, mostradores e selo) e o quadro com as quatro cartas. */

const cardBg = (color: string): React.CSSProperties => ({
    borderColor: `${color}99`, background: `linear-gradient(165deg, ${color}26, rgba(10,6,14,0.88) 58%)`,
});

const Profile = ({ c }: { c: CaseVerdict }) => (
    <div className="flex w-[232px] shrink-0 flex-col items-center gap-2 rounded-2xl border p-4 text-center" style={cardBg(c.color)}>
        <svg viewBox="-70 -70 140 140" width={136} height={136} aria-hidden><Portrait who={c.id} color={c.color} r={64} /></svg>
        <p className="m-0 font-display text-[34px] font-semibold leading-none text-white">{c.name}</p>
        <p className="m-0 text-[16px] leading-snug text-gray-100">{c.profile}</p>
        <p className="m-0 font-mono text-[14px] leading-snug" style={{ color: c.color }}>{c.effort}</p>
        <div className="mt-auto w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-left">
            <Kicker>a pergunta</Kicker>
            <p className="m-0 mt-1 text-[16px] leading-snug text-white">{c.dilemma}</p>
        </div>
    </div>
);

const Evidence = ({ c }: { c: CaseVerdict }) => {
    const reduce = useReducedMotion();
    const rows = [...c.evidence.map(e => ({ ...e, warn: false })), { ...c.trap, warn: true }];
    return (
        <div className="flex min-w-0 flex-1 flex-col gap-2.5 rounded-2xl border border-white/10 p-4" style={{ background: 'rgba(10,6,14,0.74)' }}>
            <p className="m-0 flex items-center gap-2 font-mono text-[14px] uppercase tracking-wider text-gray-300"><BookOpen size={17} aria-hidden /> o que a evidência diz</p>
            {rows.map((it, i) => (
                <motion.div key={it.text} className="flex gap-2.5 text-[16px] leading-snug text-gray-100"
                    initial={reduce ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.12 }}>
                    {it.warn
                        ? <TriangleAlert size={18} className="mt-0.5 shrink-0" color={C.nitrite} aria-label="cuidado" />
                        : <span className="mt-[8px] h-2 w-2 shrink-0 rounded-full" style={{ background: c.color, boxShadow: `0 0 8px ${c.color}` }} />}
                    <span style={it.warn ? { color: C.nitriteSoft } : undefined}>{it.text} <span className="font-mono text-[14px] text-gray-400">{it.src}</span></span>
                </motion.div>
            ))}
        </div>
    );
};

const Verdict = ({ c }: { c: CaseVerdict }) => (
    <div className="relative flex w-[520px] shrink-0 flex-col gap-3 rounded-2xl border p-4" style={cardBg(c.color)}>
        <div className="absolute -right-2 -top-3"><Seal c={c} /></div>
        <Kicker color={c.color}>o que dá para dizer</Kicker>
        <p className="m-0 pr-24 font-display text-[21px] font-semibold leading-tight text-white">{c.headline}</p>
        <div className="mt-2 flex justify-between">
            <Dial title="chance" zones={SCALES.chance} range={c.chance} color={c.color} delay={0.25} />
            <Dial title="magnitude" zones={SCALES.magnitude} range={c.magnitude} color={c.color} delay={0.45} />
            <Dial title="certeza" zones={SCALES.certainty} range={c.certainty} color={c.color} delay={0.65} />
        </div>
        <ul className="m-0 mt-auto flex list-none flex-col gap-1 border-t border-white/10 p-0 pt-2">
            {c.reading.map(r => <li key={r} className="text-[15px] leading-snug text-gray-200">{r}</li>)}
        </ul>
    </div>
);

export const CaseCard = ({ c }: { c: CaseVerdict }) => (
    <div className="flex min-w-0 flex-1 gap-3">
        <Profile c={c} />
        <Evidence c={c} />
        <Verdict c={c} />
    </div>
);

export const CaseBoard = ({ cases }: { cases: readonly CaseVerdict[] }) => {
    const reduce = useReducedMotion();
    return (
        <div className="grid h-full w-full grid-cols-4 gap-3">
            {cases.map((c, i) => (
                <motion.div key={c.id} className="relative flex min-w-0 flex-col gap-2.5 rounded-2xl border p-4" style={cardBg(c.color)}
                    initial={reduce ? false : { opacity: 0, y: 18, rotate: i % 2 ? 1.5 : -1.5 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: i * 0.12, duration: 0.5 }}>
                    <div className="flex items-center gap-3">
                        <svg viewBox="-40 -40 80 80" width={72} height={72} aria-hidden><Portrait who={c.id} color={c.color} r={36} /></svg>
                        <div className="min-w-0">
                            <p className="m-0 font-display text-[28px] font-semibold leading-none text-white">{c.name}</p>
                            <p className="m-0 mt-1 text-[15px] leading-tight text-gray-300">{c.effort.split(' · ')[0]}</p>
                        </div>
                    </div>
                    <p className="m-0 text-[17px] font-semibold leading-snug text-white">{c.headline}</p>
                    <div className="flex justify-center"><Seal c={c} size={116} delay={0.6 + i * 0.12} /></div>
                    <div className="mt-auto flex flex-col gap-2.5">
                        <Meter title="chance" range={c.chance} color={c.color} delay={0.3 + i * 0.1} />
                        <Meter title="magnitude" range={c.magnitude} color={c.color} delay={0.4 + i * 0.1} />
                        <Meter title="certeza" range={c.certainty} color={c.color} delay={0.5 + i * 0.1} />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
