import { motion, useReducedMotion } from 'framer-motion';
import { Panel } from '../kit/ui';
import { VOTE_LABEL, type Claim, type Vote } from './claims';
import { StatViz } from './StatViz';
import { VOTE_COLOR } from './voteLook';

/** Palco do veredito (passos 2–7 do slide 10): a frase, a resposta em letras grandes, o número que a decide e a fonte. */

interface VerdictStageProps {
    claim: Claim;
    vote: Vote | undefined;
}

const ClassVote = ({ claim, vote }: VerdictStageProps) => {
    if (!vote) return <span className="font-mono text-[16px] text-gray-500">a turma não votou nesta</span>;
    const hit = vote === claim.answer;
    return (
        <span className="text-[17px] text-gray-200">
            a turma votou <strong style={{ color: VOTE_COLOR[vote] }}>{VOTE_LABEL[vote].toLowerCase()}</strong>
            {' · '}
            <strong style={{ color: hit ? VOTE_COLOR.V : VOTE_COLOR.F }}>{hit ? 'acertou' : 'errou'}</strong>
        </span>
    );
};

export const VerdictStage = ({ claim, vote }: VerdictStageProps) => {
    const reduce = useReducedMotion() ?? false;
    const color = VOTE_COLOR[claim.answer];
    return (
        <Panel state="active" glow={color} className="flex min-w-0 flex-1 flex-col">
            <motion.div key={claim.id} className="flex h-full flex-col px-7 pb-5 pt-5"
                initial={{ opacity: 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.4 }}>
                <div className="flex items-start justify-between gap-6">
                    <p className="font-display text-[1.45rem] font-semibold leading-tight text-gray-100">“{claim.claim}”</p>
                    <div className="shrink-0 pt-1"><ClassVote claim={claim} vote={vote} /></div>
                </div>

                <div className="mt-4 flex min-h-0 flex-1 gap-7">
                    <div className="flex flex-1 flex-col justify-center gap-2">
                        <p className="font-display text-[4.2rem] font-bold uppercase leading-none tracking-wide" style={{ color }}>
                            {VOTE_LABEL[claim.answer]}
                        </p>
                        <p className="font-display text-[1.6rem] font-semibold leading-tight text-white">{claim.headline}</p>
                        <p className="text-[18px] leading-snug text-gray-200">{claim.why}</p>
                    </div>
                    <div className="flex w-[326px] shrink-0 flex-col justify-center gap-3 rounded-2xl border px-5 py-4"
                        style={{ borderColor: `${color}55`, background: `${color}0f` }}>
                        <div>
                            <p className="whitespace-nowrap font-display text-[2.3rem] font-bold leading-none text-white">{claim.stat}</p>
                            <p className="mt-1.5 text-[16px] leading-snug text-gray-300">{claim.statNote}</p>
                        </div>
                        <StatViz viz={claim.viz} />
                    </div>
                </div>

                <p className="mt-3 border-t border-white/10 pt-2.5 font-mono text-[16px] text-gray-400">fonte · {claim.source}</p>
            </motion.div>
        </Panel>
    );
};
