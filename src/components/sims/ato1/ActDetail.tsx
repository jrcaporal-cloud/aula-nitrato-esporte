import { ACTS, PRIZE, type Act } from './acts';
import { C } from '../kit/palette';
import { KeyFact, Reveal } from '../kit/rhythm';
import { REVEAL_GAP } from '../kit/countUp';
import { CountText } from './countText';

/**
 * Painel de baixo do mapa: o ato da vez (pergunta e três pontos) ou, no passo final, a pergunta da aula.
 * Ritmo: ato → pergunta → pontos; no fecho, a pergunta → o prêmio (números sobem, destaque no ≈ 0) → fonte.
 */

const ActView = ({ act }: { act: Act }) => (
    <>
        <Reveal order={0} className="flex w-[230px] shrink-0 flex-col justify-center border-r border-white/10 pr-6">
            <p className="font-mono text-[16px] leading-none" style={{ color: act.color }}>ato</p>
            <p className="font-display text-[3.6rem] font-bold leading-none" style={{ color: act.color }}>{act.roman}</p>
            <p className="mt-1 font-display text-[1.35rem] font-semibold leading-tight text-white">{act.title}</p>
        </Reveal>
        <Reveal order={1} className="flex min-w-0 flex-1 flex-col justify-center">
            <p className="font-mono text-[16px] leading-none text-gray-400">a pergunta do ato</p>
            <p className="mt-2 font-display text-[1.8rem] font-semibold leading-tight text-white">{act.question}</p>
        </Reveal>
        <Reveal order={2} className="flex w-[340px] shrink-0 flex-col justify-center"><ul className="flex flex-col gap-2">
            {act.topics.map(topic => (
                <li key={topic} className="flex items-start gap-2.5 text-[17px] leading-snug text-gray-200">
                    <span className="mt-[9px] size-2 shrink-0 rounded-full" style={{ background: act.color }} />
                    {topic}
                </li>
            ))}
        </ul></Reveal>
    </>
);

const QuestionView = () => (
    <>
        <Reveal order={0} className="flex w-[430px] shrink-0 flex-col justify-center border-r border-white/10 pr-6">
            <p className="font-display text-[1.4rem] font-semibold leading-none text-gray-500 line-through decoration-2">{PRIZE.notAsk}</p>
            <p className="mt-1.5 font-display text-[2.35rem] font-bold leading-[1.05]" style={{ color: C.nitrateSoft }}>{PRIZE.ask}</p>
            <p className="mt-2 text-[16px] leading-snug text-gray-300">{PRIZE.cast}.</p>
        </Reveal>
        <Reveal order={1} className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
            <p className="font-mono text-[16px] leading-none text-gray-400">{PRIZE.title}</p>
            {PRIZE.items.map(item => (
                <div key={item.value} className="flex items-center gap-5 rounded-xl border border-white/10 px-5 py-1" style={{ background: `${item.color}12` }}>
                    <span className="w-[150px] shrink-0 font-display text-[1.8rem] font-bold leading-none" style={{ color: item.color }}>
                        {item.value === '≈ 0' ? <KeyFact color={C.nitrateSoft} delay={2 * REVEAL_GAP}>{item.value}</KeyFact> : item.value}
                    </span>
                    <CountText text={item.text} delayMs={REVEAL_GAP * 1000} className="text-[17px] leading-snug text-gray-200" />
                </div>
            ))}
            <Reveal order={2} delay={0.3}><p className="font-mono text-[16px] leading-none text-gray-500">fonte · {PRIZE.source}</p></Reveal>
        </Reveal>
    </>
);

export const ActDetail = ({ step }: { step: number }) => {
    const asking = step >= ACTS.length;
    return (
        <div key={step} className="flex h-full gap-6 px-7 py-3">
            {asking ? <QuestionView /> : <ActView act={ACTS[step]} />}
        </div>
    );
};
