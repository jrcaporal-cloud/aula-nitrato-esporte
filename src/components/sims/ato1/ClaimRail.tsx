import { Check, X } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Panel } from '../kit/ui';
import { CLAIMS, type Vote } from './claims';
import { ClaimIcon } from './art/ClaimIcons';
import { CLAIM_ACCENT } from './art/claimLook';
import type { Votes } from './votesStorage';

/**
 * Lista lateral das seis frases (passos 2–7 do slide 10), cada uma com o seu selo. Mostra onde estamos e, nas já viradas,
 * se a turma acertou (a marca da frase da vez só aparece depois do carimbo).
 */

interface ClaimRailProps {
    /** Índice (0…5) da frase em exibição. */
    current: number;
    votes: Votes;
    onSelect: (index: number) => void;
}

const Mark = ({ voted, answer, late }: { voted: Vote | undefined; answer: Vote; late: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    if (!voted) return <span className="font-mono text-[16px] text-gray-500">sem voto</span>;
    const hit = voted === answer;
    const Icon = hit ? Check : X;
    return (
        <motion.span className="flex items-center gap-1 text-[16px] font-semibold" style={{ color: hit ? '#A3E635' : '#F87171' }}
            initial={{ opacity: late ? 0 : 1 }} animate={{ opacity: 1 }} transition={{ delay: late && !reduce ? 1.1 : 0, duration: 0.3 }}>
            <Icon size={18} aria-hidden />
            {hit ? 'acertou' : 'errou'}
        </motion.span>
    );
};

export const ClaimRail = ({ current, votes, onSelect }: ClaimRailProps) => (
    <div className="flex w-[262px] shrink-0 flex-col gap-2">
        {CLAIMS.map((claim, i) => {
            const state = i === current ? 'active' : i < current ? 'idle' : 'dim';
            const accent = CLAIM_ACCENT[claim.id];
            return (
                <button key={claim.id} type="button" onClick={() => onSelect(i)} className="min-h-0 flex-1 cursor-pointer text-left">
                    <Panel state={state} glow="#F87171" className="flex h-full items-center gap-3 px-3">
                        <span className="flex size-[46px] shrink-0 items-center justify-center rounded-full border"
                            style={{ borderColor: `${accent}88`, background: `radial-gradient(circle at 30% 25%, ${accent}44, ${accent}0f)` }}>
                            <ClaimIcon id={claim.id} size={30} />
                        </span>
                        <span className="flex min-w-0 flex-col gap-0.5">
                            <span className="text-[16px] font-semibold leading-tight text-gray-100">{claim.short}</span>
                            <span className="leading-none">
                                {i <= current
                                    ? <Mark voted={votes[claim.id]} answer={claim.answer} late={i === current} />
                                    : <span className="font-mono text-[16px] text-gray-500">a virar</span>}
                            </span>
                        </span>
                    </Panel>
                </button>
            );
        })}
    </div>
);
