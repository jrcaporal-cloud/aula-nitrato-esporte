import { motion, useReducedMotion } from 'framer-motion';
import { Panel } from '../kit/ui';
import { VOTE_LABEL, type Claim, type Vote } from './claims';
import { ClaimIcon } from './art/ClaimIcons';
import { CLAIM_ACCENT } from './art/claimLook';
import { ClaimArt } from './art/ClaimArt';
import { GlowLayer } from './art/GlowLayer';
import { Medal } from './art/Medal';
import { VerdictStamp } from './art/VerdictStamp';
import { VOTE_COLOR } from './voteLook';

/**
 * Palco do veredito (passos 2–7 do slide 10): a frase com o seu selo; um instante de suspensão; o martelo bate e o carimbo da
 * resposta pousa (clarão e tremor); só então aparecem o número que decide e o gráfico.
 */

interface VerdictStageProps {
    claim: Claim;
    vote: Vote | undefined;
}

const SLAM = 0.85;

const ClassVote = ({ claim, vote }: VerdictStageProps) => {
    const reduce = useReducedMotion() ?? false;
    if (!vote) return <span className="font-mono text-[16px] text-gray-500">a turma não votou nesta</span>;
    const hit = vote === claim.answer;
    return (
        <motion.span className="text-[17px] text-gray-200" initial={{ opacity: reduce ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : SLAM + 0.3 }}>
            a turma votou <strong style={{ color: VOTE_COLOR[vote] }}>{VOTE_LABEL[vote].toLowerCase()}</strong>
            {' · '}
            <strong style={{ color: hit ? VOTE_COLOR.V : VOTE_COLOR.F }}>{hit ? 'acertou' : 'errou'}</strong>
        </motion.span>
    );
};

export const VerdictStage = ({ claim, vote }: VerdictStageProps) => {
    const reduce = useReducedMotion() ?? false;
    const color = VOTE_COLOR[claim.answer];
    const accent = CLAIM_ACCENT[claim.id];
    const after = reduce ? 0 : SLAM + 0.15;
    const reveal = { initial: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }, animate: { opacity: 1, y: 0 } };
    return (
        <Panel state="active" glow={color} className="flex min-w-0 flex-1 flex-col">
            <GlowLayer spots={[{ x: 0, y: 0, color: accent, r: 340, a: 0.3 }, { x: 100, y: 100, color, r: 380, a: 0.22 }]} />
            <motion.div key={claim.id} className="relative flex h-full flex-col px-6 pb-3 pt-3"
                animate={reduce ? undefined : { x: [0, 0, -7, 6, -3, 0], y: [0, 0, 3, -2, 1, 0] }}
                transition={{ delay: SLAM, duration: 0.4, times: [0, 0.01, 0.25, 0.5, 0.75, 1] }}>
                <motion.span aria-hidden className="pointer-events-none absolute inset-0 z-10" style={{ background: color }}
                    initial={{ opacity: 0 }} animate={{ opacity: reduce ? 0 : [0, 0.28, 0] }} transition={{ delay: SLAM, duration: 0.5, times: [0, 0.05, 1] }} />
                <div className="flex items-center justify-between gap-5">
                    <div className="flex min-w-0 items-center gap-4">
                        <Medal color={accent} size={68}><ClaimIcon id={claim.id} size={42} /></Medal>
                        <p className="font-display text-[1.45rem] font-semibold leading-tight text-gray-100">“{claim.claim}”</p>
                    </div>
                    <div className="shrink-0"><ClassVote claim={claim} vote={vote} /></div>
                </div>

                <div className="mt-2 flex min-h-0 flex-1 gap-5">
                    <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5">
                        <div className="pb-1 pt-3"><VerdictStamp label={VOTE_LABEL[claim.answer]} color={color} delay={SLAM} /></div>
                        <motion.div {...reveal} transition={{ delay: after, duration: 0.4 }} className="flex flex-col gap-1.5">
                            <p className="font-display text-[1.6rem] font-semibold leading-tight text-white">{claim.headline}</p>
                            <p className="text-[18px] leading-snug text-gray-200">{claim.why}</p>
                        </motion.div>
                    </div>
                    <motion.div {...reveal} transition={{ delay: after + 0.1, duration: 0.45 }}
                        className="flex w-[392px] shrink-0 flex-col justify-center gap-3 rounded-2xl border px-5 py-3"
                        style={{ borderColor: `${color}55`, background: `linear-gradient(160deg, ${color}18, rgba(10,6,14,0.5))` }}>
                        <div>
                            <p className="whitespace-nowrap font-display text-[2.1rem] font-bold leading-none text-white">{claim.stat}</p>
                            <p className="mt-1.5 text-[16px] leading-snug text-gray-300">{claim.statNote}</p>
                        </div>
                        <ClaimArt viz={claim.viz} delay={after + 0.3} />
                    </motion.div>
                </div>

                <p className="mt-2 border-t border-white/10 pt-2 font-mono text-[16px] text-gray-400">fonte · {claim.source}</p>
            </motion.div>
        </Panel>
    );
};
