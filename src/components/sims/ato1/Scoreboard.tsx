import { motion, useReducedMotion } from 'framer-motion';
import { CLAIMS } from './claims';
import type { Votes } from './votesStorage';
import { VOTE_COLOR } from './voteLook';

/**
 * Placar da plenária: seis lâmpadas, uma por frase. Na votação cada lâmpada acende na cor do voto da turma
 * (verdadeiro ou falso, sem gabarito). Ao virar uma frase, a lâmpada vira o carimbo da resposta, com o ponto verde se a turma acertou.
 */

interface ScoreboardProps {
    /** Quantas frases já foram viradas (0 = votação). */
    revealed: number;
    votes: Votes;
}

const Lamp = ({ index, revealed, votes }: { index: number; revealed: number; votes: Votes }) => {
    const reduce = useReducedMotion() ?? false;
    const claim = CLAIMS[index];
    const vote = votes[claim.id];
    const isRevealed = index < revealed;
    const current = index === revealed - 1;
    const color = isRevealed ? VOTE_COLOR[claim.answer] : vote ? VOTE_COLOR[vote] : 'rgba(255,255,255,0.28)';
    const hit = isRevealed && vote === claim.answer;
    const filled = isRevealed || (vote !== undefined && revealed === 0);
    return (
        <motion.span key={`${index}-${isRevealed}-${vote ?? 'x'}`} className="relative flex size-9 items-center justify-center rounded-full border-2 font-mono text-[16px] font-bold"
            style={{
                borderColor: color,
                color: filled ? '#07050B' : vote ? color : '#9CA3AF',
                background: filled ? color : 'rgba(255,255,255,0.04)',
                boxShadow: current ? `0 0 0 4px ${color}44, 0 0 18px ${color}` : filled ? `0 0 12px -2px ${color}` : 'none',
            }}
            initial={{ scale: reduce ? 1 : 1.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 460, damping: 18 }}
            title={`frase ${claim.id}`}>
            {isRevealed ? claim.answer : vote ?? claim.id}
            {hit && <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-[#07050B]" style={{ background: VOTE_COLOR.V }} />}
        </motion.span>
    );
};

export const Scoreboard = ({ revealed, votes }: ScoreboardProps) => (
    <div className="flex items-center gap-1.5" role="img" aria-label="Placar da plenária">
        {CLAIMS.map((_, i) => <Lamp key={i} index={i} revealed={revealed} votes={votes} />)}
    </div>
);
