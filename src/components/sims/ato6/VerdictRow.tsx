import { motion, useReducedMotion } from 'framer-motion';
import { Check, Lock, X } from 'lucide-react';
import { C } from '../kit/palette';
import { VOTE_LABEL, type Claim, type Vote } from './claimsBridge';
import { EXPLAIN, STAMP_COLOR } from './verdictContent';

/** Uma linha do quadro de vereditos: a frase, o voto deste navegador, o carimbo e a explicação (quando virada). */

interface RowProps {
    claim: Claim;
    vote: Vote | undefined;
    open: boolean;
    current: boolean;
}

const VoteCell = ({ vote, answer, open }: { vote: Vote | undefined; answer: Vote; open: boolean }) => {
    if (!vote) return <span className="font-mono text-[15px] text-gray-500">sem voto</span>;
    const hit = vote === answer;
    return (
        <span className="flex items-center gap-1.5 font-mono text-[15px] text-gray-100">
            {VOTE_LABEL[vote]}
            {open && (hit ? <Check size={18} strokeWidth={3} color={C.no} aria-label="acertou" /> : <X size={18} strokeWidth={3} color={C.risk} aria-label="errou" />)}
        </span>
    );
};

export const VerdictRow = ({ claim, vote, open, current }: RowProps) => {
    const reduce = useReducedMotion();
    const ex = EXPLAIN[claim.id];
    return (
        <div className="grid min-h-0 flex-1 grid-cols-[34px_286px_112px_104px_minmax(0,1fr)] items-center gap-3 rounded-xl border px-3 transition-[border-color,box-shadow] duration-500"
            style={{
                borderColor: open ? `${STAMP_COLOR}${current ? 'bb' : '55'}` : 'rgba(255,255,255,0.12)',
                background: open ? 'rgba(240,67,126,0.06)' : 'rgba(10,6,14,0.74)',
                boxShadow: open && current ? `0 0 24px -10px ${STAMP_COLOR}` : 'none',
            }}>
            <span className="font-mono text-[16px] text-gray-400">{String(claim.id).padStart(2, '0')}</span>
            <p className="m-0 font-display text-[17px] font-semibold leading-tight text-white">“{claim.claim}”</p>
            <VoteCell vote={vote} answer={claim.answer} open={open} />
            {open ? (
                <motion.span className="w-fit rounded-md border px-2.5 py-0.5 font-display text-[19px] font-semibold uppercase tracking-wide"
                    style={{ borderColor: STAMP_COLOR, color: STAMP_COLOR }}
                    initial={reduce ? false : { opacity: 0, scale: 1.25, rotate: -6 }} animate={{ opacity: 1, scale: 1, rotate: -3 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}>
                    {VOTE_LABEL[claim.answer]}
                </motion.span>
            ) : <Lock size={20} className="text-gray-500" aria-label="resposta ainda fechada" />}
            {open ? (
                <motion.div className="leading-tight" initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <p className="m-0 text-[17px] font-semibold text-white">{ex.headline}</p>
                    <p className="m-0 text-[15px] text-gray-200">{ex.line} <span className="font-mono text-[14px] text-gray-400">{ex.source}</span></p>
                </motion.div>
            ) : <p className="m-0 text-[16px] text-gray-500">Qual foi o voto da turma?</p>}
        </div>
    );
};
