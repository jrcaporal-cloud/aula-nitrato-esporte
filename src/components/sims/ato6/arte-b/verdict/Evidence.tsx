import { motion, useReducedMotion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { C } from '../../../kit/palette';
import { VOTE_COLOR } from '../../../ato1/voteLook';
import type { Claim, Vote } from '../../claimsBridge';
import { EXPLAIN, STAMP_COLOR } from '../../verdictContent';
import { Glass, Kick, Rise, Src } from '../kit';

/** Coluna da direita: no passo 1 a urna (pilhas de votos × dados fechados); nos demais, o número que decide cada frase virada. */

const Block = ({ id, vote, i }: { id: number; vote: Vote; i: number }) => {
    const reduce = useReducedMotion() ?? false;
    const col = VOTE_COLOR[vote];
    return (
        <motion.div className="flex h-[34px] w-[84px] items-center justify-center rounded-md border font-mono text-[16px] font-semibold"
            style={{ borderColor: `${col}cc`, background: `${col}33`, color: col }}
            initial={reduce ? false : { opacity: 0, y: -60 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.25 + i * 0.12 }}>
            {String(id).padStart(2, '0')}
        </motion.div>
    );
};

const Stack = ({ title, vote, ids, color }: { title: string; vote: Vote; ids: readonly number[]; color: string }) => (
    <div className="flex flex-col items-center gap-2">
        <div className="flex h-[250px] w-[112px] flex-col-reverse items-center gap-1.5 rounded-xl border-b-4 border-x border-white/15 bg-white/5 px-2 pb-2 pt-2" style={{ borderBottomColor: color }}>
            {ids.map((id, i) => <Block key={id} id={id} vote={vote} i={i} />)}
        </div>
        <p className="m-0 font-display text-[20px] font-semibold uppercase" style={{ color }}>{title}</p>
        <p className="m-0 font-mono text-[14px] text-gray-400">{ids.length} de 6</p>
    </div>
);

export const Urn = ({ votes, claims }: { votes: Readonly<Record<number, Vote | undefined>>; claims: readonly Claim[] }) => {
    const ids = (v: Vote): number[] => claims.filter(c => votes[c.id] === v).map(c => c.id);
    return (
        <Glass color={C.o2} glow={1} className="flex min-w-0 flex-1 flex-col gap-2 p-4">
            <Kick color={C.o2}>os votos, empilhados · um bloco por frase</Kick>
            <div className="flex flex-1 items-end justify-around">
                <Stack title="verdadeiro" vote="V" ids={ids('V')} color={VOTE_COLOR.V} />
                <Stack title="falso" vote="F" ids={ids('F')} color={VOTE_COLOR.F} />
                <div className="flex flex-col items-center gap-2">
                    <div className="flex h-[250px] w-[112px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 bg-white/[0.03]">
                        <Lock size={30} className="text-gray-500" aria-hidden />
                        <p className="m-0 px-2 text-center text-[14px] leading-tight text-gray-400">respostas fechadas</p>
                    </div>
                    <p className="m-0 font-display text-[20px] font-semibold uppercase text-gray-300">os dados</p>
                    <p className="m-0 font-mono text-[14px] text-gray-400">6 frases</p>
                </div>
            </div>
        </Glass>
    );
};

const Card = ({ claim, vote, delay }: { claim: Claim; vote: Vote | undefined; delay: number }) => {
    const ex = EXPLAIN[claim.id];
    return (
        <Rise delay={delay} className="min-h-0 flex-1">
            <Glass color={STAMP_COLOR} glow={1} className="flex h-full flex-col justify-center gap-1 px-4 py-3">
                <span className="font-mono text-[14px] text-gray-300">
                    frase {String(claim.id).padStart(2, '0')} · turma <b style={{ color: vote ? VOTE_COLOR[vote] : C.placebo }}>{vote ?? '—'}</b> · dados <b style={{ color: VOTE_COLOR[claim.answer] }}>{claim.answer}</b>
                </span>
                <p className="m-0 whitespace-nowrap font-display text-[34px] font-semibold leading-none" style={{ color: STAMP_COLOR }}>{claim.stat}</p>
                <p className="m-0 text-[18px] font-semibold leading-tight text-white">{ex.headline}</p>
                <p className="m-0 text-[15px] leading-snug text-gray-200">{ex.line}</p>
                <Src>{ex.source}</Src>
            </Glass>
        </Rise>
    );
};

export const EvidencePair = ({ claims, votes }: { claims: readonly Claim[]; votes: Readonly<Record<number, Vote | undefined>> }) => (
    <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        {claims.map((c, i) => <Card key={c.id} claim={c} vote={votes[c.id]} delay={0.1 + i * 0.15} />)}
    </div>
);
