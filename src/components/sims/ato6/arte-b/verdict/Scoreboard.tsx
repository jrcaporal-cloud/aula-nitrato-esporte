import { motion, useReducedMotion } from 'framer-motion';
import { Check, Lock, X } from 'lucide-react';
import { C } from '../../../kit/palette';
import { VOTE_COLOR } from '../../../ato1/voteLook';
import { VOTE_LABEL, type Claim, type Vote } from '../../claimsBridge';
import { STAMP_COLOR } from '../../verdictContent';
import { Rise } from '../kit';

/** Placar da plenária: uma linha por frase, com o voto da turma numa pista V—F, o anel dos dados e o carimbo FALSO. */

const END_V = 20;
const END_F = 156;
const MID = (END_V + END_F) / 2;

const Ball = ({ vote, hit, open, reduce }: { vote: Vote; hit: boolean; open: boolean; reduce: boolean }) => {
    const col = VOTE_COLOR[vote];
    return (
        <motion.span className="absolute top-1/2 flex h-[30px] w-[30px] items-center justify-center rounded-full font-display text-[16px] font-bold text-[#07050B]"
            style={{ background: col, boxShadow: `0 0 14px ${col}`, marginTop: -15, marginLeft: -15 }}
            initial={reduce ? false : { left: MID, scale: 0.5 }} animate={{ left: vote === 'V' ? END_V : END_F, scale: 1 }}
            transition={{ type: 'spring', stiffness: 160, damping: 16, delay: 0.1 }}>
            {vote}
            {open && (
                <span className="absolute -right-2 -top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#07050B]" style={{ background: hit ? C.no : C.risk }}>
                    {hit ? <Check size={12} strokeWidth={4} color="#07050B" aria-label="acertou" /> : <X size={12} strokeWidth={4} color="#07050B" aria-label="errou" />}
                </span>
            )}
        </motion.span>
    );
};

const Track = ({ vote, answer, open, reduce }: { vote: Vote | undefined; answer: Vote; open: boolean; reduce: boolean }) => {
    const hit = vote === answer;
    const ansX = answer === 'V' ? END_V : END_F;
    return (
        <div className="relative h-[44px] w-[176px]">
            <div className="absolute top-1/2 h-[6px] -translate-y-1/2 rounded-full bg-white/10" style={{ left: END_V, right: 176 - END_F }} />
            {vote && <div className="absolute top-1/2 h-[6px] -translate-y-1/2 rounded-full" style={{ left: vote === 'V' ? END_V : MID, width: (END_F - END_V) / 2, background: `linear-gradient(${vote === 'V' ? '270deg' : '90deg'}, ${VOTE_COLOR[vote]}00, ${VOTE_COLOR[vote]}aa)` }} />}
            {open && (
                <motion.span className="absolute top-1/2 h-[40px] w-[40px] rounded-full border-2 border-dashed" aria-hidden
                    style={{ left: ansX, marginLeft: -20, marginTop: -20, borderColor: STAMP_COLOR, boxShadow: `0 0 16px -2px ${STAMP_COLOR}` }}
                    initial={reduce ? false : { opacity: 0, scale: 1.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.4 }} />
            )}
            {vote ? <Ball key={String(open)} vote={vote} hit={hit} open={open} reduce={reduce} />
                : <span className="absolute inset-x-0 top-1/2 -mt-[9px] text-center font-mono text-[14px] leading-none text-gray-500">sem voto</span>}
        </div>
    );
};

interface RowProps { claim: Claim; vote: Vote | undefined; open: boolean; current: boolean; index: number }

const Row = ({ claim, vote, open, current, index }: RowProps) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <Rise delay={index * 0.05} className="min-h-0 flex-1">
            <div className="grid h-full grid-cols-[30px_minmax(0,1fr)_176px_112px] items-center gap-3 rounded-xl border px-3 transition-[border-color,box-shadow,background] duration-500"
                style={{
                    borderColor: open ? `${STAMP_COLOR}${current ? 'cc' : '55'}` : 'rgba(255,255,255,0.12)',
                    background: open ? `linear-gradient(90deg, ${STAMP_COLOR}12, rgba(10,6,14,0.74) 70%)` : 'rgba(10,6,14,0.74)',
                    boxShadow: open && current ? `0 0 26px -10px ${STAMP_COLOR}` : 'none',
                }}>
                <span className="font-mono text-[16px] text-gray-400">{String(claim.id).padStart(2, '0')}</span>
                <p className="m-0 font-display text-[16px] font-semibold leading-tight text-white">“{claim.claim}”</p>
                <Track vote={vote} answer={claim.answer} open={open} reduce={reduce} />
                {open ? (
                    <motion.span className="flex h-[46px] w-fit items-center justify-center rounded-md border-[3px] px-2.5 font-display text-[21px] font-bold uppercase tracking-wide"
                        style={{ borderColor: STAMP_COLOR, color: STAMP_COLOR, boxShadow: `inset 0 0 0 1px ${STAMP_COLOR}66` }}
                        initial={reduce ? false : { opacity: 0, scale: 1.9, rotate: -14 }} animate={{ opacity: 1, scale: 1, rotate: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}>
                        {VOTE_LABEL[claim.answer]}
                    </motion.span>
                ) : <Lock size={22} className="text-gray-500" aria-label="resposta ainda fechada" />}
            </div>
        </Rise>
    );
};

export const Scoreboard = ({ claims, votes, revealed }: { claims: readonly Claim[]; votes: Readonly<Record<number, Vote | undefined>>; revealed: number }) => (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {claims.map((c, i) => <Row key={c.id} claim={c} vote={votes[c.id]} open={c.id <= revealed} current={c.id === revealed || c.id === revealed - 1} index={i} />)}
    </div>
);
