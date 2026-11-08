import { Check, X } from 'lucide-react';
import { Panel } from '../kit/ui';
import { CLAIMS, type Vote } from './claims';
import type { Votes } from './votesStorage';

/**
 * Lista lateral das seis frases (passos 2–7 do slide 10). Mostra onde estamos e, nas já viradas,
 * se a turma acertou. No último passo vira o resumo da votação.
 */

interface ClaimRailProps {
    /** Índice (0…5) da frase em exibição. */
    current: number;
    votes: Votes;
    onSelect: (index: number) => void;
}

const Mark = ({ voted, answer }: { voted: Vote | undefined; answer: Vote }) => {
    if (!voted) return <span className="font-mono text-[16px] text-gray-500">sem voto</span>;
    const hit = voted === answer;
    const Icon = hit ? Check : X;
    return (
        <span className="flex items-center gap-1 text-[16px] font-semibold" style={{ color: hit ? '#A3E635' : '#F87171' }}>
            <Icon size={18} aria-hidden />
            {hit ? 'acertou' : 'errou'}
        </span>
    );
};

export const ClaimRail = ({ current, votes, onSelect }: ClaimRailProps) => (
    <div className="flex w-[268px] shrink-0 flex-col gap-2">
        {CLAIMS.map((claim, i) => {
            const state = i === current ? 'active' : i < current ? 'idle' : 'dim';
            return (
                <button key={claim.id} type="button" onClick={() => onSelect(i)} className="min-h-0 flex-1 cursor-pointer text-left">
                    <Panel state={state} glow="#F87171" className="flex h-full flex-col justify-center gap-0.5 px-3.5">
                        <span className="flex items-baseline gap-2">
                            <span className="font-mono text-[16px] text-gray-400">{claim.id}</span>
                            <span className="text-[16px] font-semibold leading-tight text-gray-100">{claim.short}</span>
                        </span>
                        <span className="pl-5 leading-none">
                            {i <= current ? <Mark voted={votes[claim.id]} answer={claim.answer} /> : <span className="font-mono text-[16px] text-gray-500">a virar</span>}
                        </span>
                    </Panel>
                </button>
            );
        })}
    </div>
);
