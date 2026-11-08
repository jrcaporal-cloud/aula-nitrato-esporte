import { motion, useReducedMotion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Panel } from '../kit/ui';
import { VOTE_LABEL, type Claim, type Vote } from './claims';
import { ClaimIcon } from './art/ClaimIcons';
import { CLAIM_ACCENT } from './art/claimLook';
import { GlowLayer } from './art/GlowLayer';
import { Medal } from './art/Medal';
import { VOTE_COLOR } from './voteLook';

/** Cartão de votação (passo 1 do slide 10): selo grande, a frase e dois botões. O clique é extra: ele só grava o voto da turma. */

interface VoteCardProps {
    claim: Claim;
    vote: Vote | undefined;
    onVote: (vote: Vote) => void;
}

const VoteButton = ({ option, selected, onVote }: { option: Vote; selected: boolean; onVote: () => void }) => {
    const color = VOTE_COLOR[option];
    const Icon = option === 'V' ? Check : X;
    return (
        <button type="button" onClick={onVote} aria-pressed={selected}
            className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border text-[17px] font-bold transition-all duration-200 hover:brightness-125"
            style={{
                borderColor: selected ? color : 'rgba(255,255,255,0.22)',
                background: selected ? `${color}38` : 'rgba(255,255,255,0.04)',
                color: selected ? color : '#E5E7EB',
                boxShadow: selected ? `0 0 18px -4px ${color}` : 'none',
            }}>
            <Icon size={20} aria-hidden />
            {VOTE_LABEL[option]}
        </button>
    );
};

/** Carimbo do voto que "pousa" no canto do selo (o voto da turma, não o gabarito). */
const VoteBadge = ({ vote, reduce }: { vote: Vote; reduce: boolean }) => {
    const color = VOTE_COLOR[vote];
    const Icon = vote === 'V' ? Check : X;
    return (
        <motion.span key={vote} className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full border-2 text-[#07050B]"
            style={{ background: color, borderColor: '#07050B', boxShadow: `0 0 16px ${color}` }}
            initial={{ scale: reduce ? 1 : 2.4, rotate: reduce ? 0 : -30, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 520, damping: 20 }}>
            <Icon size={22} strokeWidth={3.5} aria-hidden />
        </motion.span>
    );
};

export const VoteCard = ({ claim, vote, onVote }: VoteCardProps) => {
    const reduce = useReducedMotion() ?? false;
    const accent = CLAIM_ACCENT[claim.id];
    const tint = vote ? VOTE_COLOR[vote] : accent;
    return (
        <Panel className="flex h-full flex-col gap-3 px-4 pb-4 pt-3" state={vote ? 'active' : 'idle'} glow={vote ? VOTE_COLOR[vote] : undefined}>
            <GlowLayer spots={[{ x: 100, y: 0, color: tint, r: 230, a: 0.32 }]} />
            <div className="relative flex min-h-0 flex-1 items-center gap-4">
                <Medal color={accent} size={96}
                    badge={vote ? <VoteBadge vote={vote} reduce={reduce} /> : undefined}>
                    <ClaimIcon id={claim.id} size={58} />
                </Medal>
                <div className="min-w-0">
                    <span className="font-mono text-[16px] text-gray-400">{String(claim.id).padStart(2, '0')}</span>
                    <p className="font-display text-[1.38rem] font-semibold leading-tight text-white">“{claim.claim}”</p>
                </div>
            </div>
            <div className="relative flex gap-2.5">
                <VoteButton option="V" selected={vote === 'V'} onVote={() => onVote('V')} />
                <VoteButton option="F" selected={vote === 'F'} onVote={() => onVote('F')} />
            </div>
        </Panel>
    );
};
