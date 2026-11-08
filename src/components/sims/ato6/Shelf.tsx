import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import { PASS_INDEXES, SHELVES } from './labelContent';

/** Gôndola de 24 frascos (passos 1 e 2 do LabelSim). Os frascos mudam de lugar com animação de layout. */

type Phase = 'shelf' | 'sorted';

const Bottle = ({ index, phase }: { index: number; phase: Phase }) => {
    const reduce = useReducedMotion();
    const passes = PASS_INDEXES.includes(index);
    const sorted = phase === 'sorted';
    const liquid = !sorted ? C.nitrate : passes ? C.no : C.nitrate;
    const fade = sorted && !passes ? 0.28 : 1;
    return (
        <motion.div layout={!reduce} transition={{ type: 'spring', stiffness: 220, damping: 28 }}
            className="mx-auto flex flex-col items-center self-end pb-[6px]" style={{ width: 40, opacity: fade }}>
            <div className="h-3 w-4 rounded-t-sm border border-white/30 bg-white/20" />
            <div className="relative h-[60px] w-10 overflow-hidden rounded-b-xl rounded-t-md border border-white/30" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="absolute inset-x-0 bottom-0 transition-all duration-500" style={{ height: sorted && !passes ? '34%' : '72%', background: `linear-gradient(180deg, ${liquid}, ${liquid}99)` }} />
                <div className="absolute inset-x-1 top-4 h-4 rounded-sm bg-white/70" />
            </div>
            {sorted && passes && <div className="mt-1 h-1 w-7 rounded-full" style={{ background: C.no, boxShadow: `0 0 10px ${C.no}` }} />}
        </motion.div>
    );
};

const order = (phase: Phase): readonly number[] => {
    const all = Array.from({ length: 24 }, (_, i) => i);
    if (phase === 'shelf') return all;
    return [...PASS_INDEXES, ...all.filter(i => !PASS_INDEXES.includes(i))];
};

export const Shelf = ({ phase }: { phase: Phase }) => {
    const items = order(phase);
    const sorted = phase === 'sorted';
    return (
        <div className="relative flex min-w-0 flex-1 items-center pl-[146px] pr-2">
            {/* nomes das prateleiras: só no passo 1 */}
            <div className="absolute left-5 top-1/2 flex -translate-y-1/2 flex-col transition-opacity duration-500" style={{ opacity: sorted ? 0 : 1 }}>
                {SHELVES.map(s => (
                    <p key={s} className="m-0 flex h-[88px] w-[116px] items-center font-mono text-[14px] uppercase leading-tight tracking-wider text-gray-300">{s}</p>
                ))}
            </div>
            <div className={`grid w-full auto-rows-[88px] ${sorted ? 'grid-cols-8' : 'grid-cols-6'}`}>
                {items.map((i, pos) => (
                    <div key={i} className="contents">
                        <Bottle index={i} phase={phase} />
                        {sorted && pos === PASS_INDEXES.length - 1 && (
                            <div className="col-span-3 flex items-center pl-3 text-[17px] leading-snug text-gray-100">
                                <span><strong style={{ color: C.no }}>5 de 24</strong> deram ≥ 5 mmol por porção, de forma consistente</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {!sorted && (
                <div className="pointer-events-none absolute inset-y-0 left-[146px] right-2 flex flex-col justify-center">
                    {SHELVES.map(s => <div key={s} className="h-[88px] border-b-2 border-white/15" />)}
                </div>
            )}
        </div>
    );
};
