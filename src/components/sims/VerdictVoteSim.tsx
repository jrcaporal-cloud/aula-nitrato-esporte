import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Gavel, Hand, RotateCcw } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { CLAIMS, type Vote } from './ato1/claims';
import { ClaimRail } from './ato1/ClaimRail';
import { Scoreboard } from './ato1/Scoreboard';
import { VerdictStage } from './ato1/VerdictStage';
import { VoteCard } from './ato1/VoteCard';
import { readVotes, withVote, writeVotes, type Votes } from './ato1/votesStorage';

/**
 * "O Que Todo Mundo Sabe" (slide 10). Passo 1: seis frases na mesa, a turma vota verdadeiro ou falso
 * (o professor toca na maioria; o voto fica no localStorage para o slide 87). Passos 2–7: o passador
 * vira uma frase por vez com a resposta, o número que a decide e a fonte. O clique é extra: sem votar, a história anda igual.
 */

const LAST_STEP = CLAIMS.length;

const hitsOf = (votes: Votes, upTo: number) => {
    const seen = CLAIMS.slice(0, upTo).filter(c => votes[c.id]);
    return { voted: seen.length, hits: seen.filter(c => votes[c.id] === c.answer).length };
};

const Headline = ({ step, votes }: { step: number; votes: Votes }) => {
    const { voted, hits } = hitsOf(votes, step);
    if (step === 0) {
        return (
            <p className="flex items-center gap-2 text-[1.12rem] text-gray-100">
                <Hand size={20} className="shrink-0" style={{ color: C.nitrite }} aria-hidden />
                Seis frases que todo mundo sabe. Verdadeiro ou falso? Vote antes de virar.
            </p>
        );
    }
    return (
        <p className="flex items-center gap-2 text-[1.12rem] text-gray-100">
            <Gavel size={20} className="shrink-0" style={{ color: C.nitrate }} aria-hidden />
            {step === LAST_STEP
                ? <strong className="font-semibold text-white">Seis frases. Nenhuma sobrevive inteira.</strong>
                : <>Frase {step} de {CLAIMS.length}</>}
            {voted > 0 && <span className="text-gray-300">· a turma acertou <strong className="text-white">{hits} de {voted}</strong></span>}
        </p>
    );
};

const VerdictVoteSim = () => {
    const { step, setStep } = useSlideSteps(CLAIMS.length + 1);
    const reduce = useReducedMotion() ?? false;
    const [votes, setVotes] = useState<Votes>(readVotes);

    const castVote = (id: number, vote: Vote) => {
        const next = withVote(votes, id, vote);
        setVotes(next);
        writeVotes(next);
    };
    const clearVotes = () => {
        setVotes({});
        writeVotes({});
    };
    const counted = CLAIMS.filter(c => votes[c.id]).length;

    return (
        <div className="not-prose flex w-full select-none flex-col gap-3 font-body text-white" style={{ height: 500 }}>
            <div className="flex h-10 items-center justify-between gap-3">
                <motion.div key={step === 0 ? 'vote' : step === LAST_STEP ? 'end' : 'reveal'}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : 0.3 }}>
                    <Headline step={step} votes={votes} />
                </motion.div>
                <div className="flex shrink-0 items-center gap-3 font-mono text-[16px] text-gray-400">
                    <Scoreboard revealed={step} votes={votes} />
                    <span title="votos registrados">{counted}/{CLAIMS.length}</span>
                    {counted > 0 && (
                        <button type="button" onClick={clearVotes} title="Zerar a votação"
                            className="flex cursor-pointer items-center gap-1.5 rounded-md border border-white/15 px-2 py-0.5 text-gray-300 transition-colors hover:border-white/40">
                            <RotateCcw size={15} aria-hidden /> zerar
                        </button>
                    )}
                </div>
            </div>

            {step === 0 ? (
                <motion.div key="board" className="grid min-h-0 flex-1 grid-cols-3 grid-rows-2 gap-3"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : 0.35 }}>
                    {CLAIMS.map(claim => (
                        <VoteCard key={claim.id} claim={claim} vote={votes[claim.id]} onVote={v => castVote(claim.id, v)} />
                    ))}
                </motion.div>
            ) : (
                <div className="flex min-h-0 flex-1 gap-3">
                    <ClaimRail current={step - 1} votes={votes} onSelect={i => setStep(i + 1)} />
                    <VerdictStage claim={CLAIMS[step - 1]} vote={votes[CLAIMS[step - 1].id]} />
                </div>
            )}
        </div>
    );
};

export default VerdictVoteSim;
