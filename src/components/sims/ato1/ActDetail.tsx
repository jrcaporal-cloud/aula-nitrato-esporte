import { motion, useReducedMotion } from 'framer-motion';
import { ACTS, PRIZE, type Act } from './acts';
import { C } from '../kit/palette';

/** Painel de baixo do mapa: o ato da vez (pergunta e três pontos) ou, no passo final, a pergunta da aula. */

const ActView = ({ act }: { act: Act }) => (
    <>
        <div className="flex w-[250px] shrink-0 flex-col justify-center border-r border-white/10 pr-6">
            <p className="font-mono text-[16px] leading-none" style={{ color: act.color }}>ato</p>
            <p className="font-display text-[4.6rem] font-bold leading-none" style={{ color: act.color }}>{act.roman}</p>
            <p className="mt-2 font-display text-[1.5rem] font-semibold leading-tight text-white">{act.title}</p>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
            <p className="font-mono text-[16px] leading-none text-gray-400">a pergunta do ato</p>
            <p className="mt-2 font-display text-[2rem] font-semibold leading-tight text-white">{act.question}</p>
        </div>
        <ul className="flex w-[330px] shrink-0 flex-col justify-center gap-3">
            {act.topics.map(topic => (
                <li key={topic} className="flex items-start gap-2.5 text-[17px] leading-snug text-gray-200">
                    <span className="mt-[9px] size-2 shrink-0 rounded-full" style={{ background: act.color }} />
                    {topic}
                </li>
            ))}
        </ul>
    </>
);

const QuestionView = () => (
    <>
        <div className="flex w-[430px] shrink-0 flex-col justify-center border-r border-white/10 pr-6">
            <p className="font-display text-[1.6rem] font-semibold leading-none text-gray-500 line-through decoration-2">{PRIZE.notAsk}</p>
            <p className="mt-3 font-display text-[3.1rem] font-bold leading-[1.05]" style={{ color: C.nitrateSoft }}>{PRIZE.ask}</p>
            <p className="mt-3 text-[17px] leading-snug text-gray-300">{PRIZE.cast}.</p>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
            <p className="font-mono text-[16px] leading-none text-gray-400">{PRIZE.title}</p>
            {PRIZE.items.map(item => (
                <div key={item.value} className="flex items-center gap-5 rounded-xl border border-white/10 px-5 py-2.5" style={{ background: `${item.color}12` }}>
                    <span className="w-[150px] shrink-0 font-display text-[2.2rem] font-bold leading-none" style={{ color: item.color }}>{item.value}</span>
                    <span className="text-[17px] leading-snug text-gray-200">{item.text}</span>
                </div>
            ))}
            <p className="font-mono text-[16px] leading-none text-gray-500">fonte · {PRIZE.source}</p>
        </div>
    </>
);

export const ActDetail = ({ step }: { step: number }) => {
    const reduce = useReducedMotion() ?? false;
    const asking = step >= ACTS.length;
    return (
        <motion.div key={step} className="flex h-full gap-6 px-7 py-5"
            initial={{ opacity: 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.4 }}>
            {asking ? <QuestionView /> : <ActView act={ACTS[step]} />}
        </motion.div>
    );
};
