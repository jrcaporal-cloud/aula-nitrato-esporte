import { Check, X } from 'lucide-react';
import { Panel } from '../kit/ui';
import { VOTE_LABEL, type Claim, type Vote } from './claims';
import { VOTE_COLOR } from './voteLook';

/** Carta de votação (passo 1 do slide 10): a frase e dois botões grandes. O clique é extra: ele só grava o voto. */

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
            className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border text-[17px] font-bold transition-colors"
            style={{
                borderColor: selected ? color : 'rgba(255,255,255,0.22)',
                background: selected ? `${color}2e` : 'rgba(255,255,255,0.04)',
                color: selected ? color : '#E5E7EB',
            }}>
            <Icon size={20} aria-hidden />
            {VOTE_LABEL[option]}
        </button>
    );
};

export const VoteCard = ({ claim, vote, onVote }: VoteCardProps) => (
    <Panel className="flex h-full flex-col gap-3 px-4 pb-4 pt-3" state={vote ? 'active' : 'idle'} glow={vote ? VOTE_COLOR[vote] : undefined}>
        <span className="font-mono text-[16px] text-gray-400">{String(claim.id).padStart(2, '0')}</span>
        <p className="flex-1 font-display text-[1.5rem] font-semibold leading-tight text-white">“{claim.claim}”</p>
        <div className="flex gap-2.5">
            <VoteButton option="V" selected={vote === 'V'} onVote={() => onVote('V')} />
            <VoteButton option="F" selected={vote === 'F'} onVote={() => onVote('F')} />
        </div>
    </Panel>
);
