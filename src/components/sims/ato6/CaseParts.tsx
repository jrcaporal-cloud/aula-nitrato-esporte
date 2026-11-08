import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, TriangleAlert } from 'lucide-react';
import { C } from '../kit/palette';
import { Gauge } from './Gauge';
import { SCALES, type CaseVerdict } from './cases';
import { Card, Kicker } from './ui';

/** Peças do slide 83: ficha, evidência, veredito de um caso e o quadro dos quatro. */

export const ProfileColumn = ({ c }: { c: CaseVerdict }) => (
    <Card className="flex w-[208px] shrink-0 flex-col gap-2 p-4" color={c.color}>
        <p className="m-0 font-display text-[38px] font-semibold leading-none text-white">{c.name}</p>
        <p className="m-0 text-[16px] leading-snug text-gray-100">{c.profile}</p>
        <p className="m-0 font-mono text-[14px] leading-snug" style={{ color: c.color }}>{c.effort}</p>
        <div className="mt-auto rounded-xl border border-white/15 px-3 py-2">
            <Kicker>a pergunta</Kicker>
            <p className="m-0 mt-1 text-[18px] leading-snug text-white">{c.dilemma}</p>
        </div>
    </Card>
);

const Bullets = ({ items, color, delay }: { items: readonly { text: string; src: string }[]; color: string; delay: number }) => {
    const reduce = useReducedMotion();
    return (
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {items.map((it, i) => (
                <motion.li key={it.text} className="flex gap-2.5 text-[17px] leading-snug text-gray-100"
                    initial={reduce ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: delay + i * 0.12 }}>
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
                    <span>{it.text} <span className="font-mono text-[14px] text-gray-400">{it.src}</span></span>
                </motion.li>
            ))}
        </ul>
    );
};

export const EvidenceColumn = ({ c }: { c: CaseVerdict }) => (
    <Card className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <p className="m-0 flex items-center gap-2 font-mono text-[14px] uppercase tracking-wider text-gray-300"><BookOpen size={17} aria-hidden /> o que a evidência diz</p>
        <Bullets items={c.evidence} color={c.color} delay={0.1} />
        <p className="m-0 mt-1 flex items-center gap-2 font-mono text-[14px] uppercase tracking-wider" style={{ color: C.nitrite }}><TriangleAlert size={17} aria-hidden /> cuidado</p>
        <Bullets items={[c.trap]} color={C.nitrite} delay={0.5} />
    </Card>
);

export const VerdictColumn = ({ c }: { c: CaseVerdict }) => {
    const reduce = useReducedMotion();
    return (
        <motion.div className="flex w-[424px] shrink-0 flex-col justify-between gap-3 overflow-hidden rounded-2xl border p-4"
            style={{ borderColor: `${c.color}aa`, background: `linear-gradient(165deg, ${c.color}22, rgba(10,6,14,0.86) 62%)` }}
            initial={reduce ? false : { opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <Kicker color={c.color}>o que dá para dizer</Kicker>
            <p className="m-0 font-display text-[22px] font-semibold leading-tight text-white">{c.headline}</p>
            <Gauge title="chance de ajudar" zones={SCALES.chance} range={c.chance} color={c.color} delay={0.2} />
            <Gauge title="magnitude, se houver" zones={SCALES.magnitude} range={c.magnitude} color={c.color} delay={0.35} />
            <Gauge title="certeza (GRADE)" zones={SCALES.certainty} range={c.certainty} color={c.color} delay={0.5} />
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {c.reading.map(r => <li key={r} className="text-[15px] leading-snug text-gray-200">{r}</li>)}
            </ul>
        </motion.div>
    );
};

export const Board = ({ cases }: { cases: readonly CaseVerdict[] }) => {
    const reduce = useReducedMotion();
    return (
        <div className="grid h-full w-full grid-cols-4 gap-3">
            {cases.map((c, i) => (
                <motion.div key={c.id} className="flex flex-col gap-3 rounded-2xl border p-4"
                    style={{ borderColor: `${c.color}99`, background: `linear-gradient(170deg, ${c.color}1f, rgba(10,6,14,0.86) 60%)` }}
                    initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}>
                    <div>
                        <p className="m-0 font-display text-[30px] font-semibold leading-none text-white">{c.name}</p>
                        <p className="m-0 mt-1 text-[15px] text-gray-300">{c.effort.split(' · ')[0]}</p>
                    </div>
                    <p className="m-0 text-[18px] font-semibold leading-snug text-white">{c.headline}</p>
                    <div className="mt-auto flex flex-col gap-3">
                        <Gauge compact title="chance" zones={SCALES.chance} range={c.chance} color={c.color} delay={0.3 + i * 0.1} />
                        <Gauge compact title="magnitude" zones={SCALES.magnitude} range={c.magnitude} color={c.color} delay={0.4 + i * 0.1} />
                        <Gauge compact title="certeza" zones={SCALES.certainty} range={c.certainty} color={c.color} delay={0.5 + i * 0.1} />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
