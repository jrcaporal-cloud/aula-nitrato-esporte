import { motion, useReducedMotion } from 'framer-motion';
import { Panel } from '../kit/ui';
import { C } from '../kit/palette';
import type { CastMember } from './cast';
import { EffortProfile } from './EffortProfile';
import { Vo2Meter } from './Vo2Meter';

/** Ficha de um caso fictício: quem é, o esforço numa régua comum, o VO₂max e o dilema. Antes de entrar, é só uma vaga. */

interface CastCardProps {
    member: CastMember;
    revealed: boolean;
    state: 'idle' | 'active' | 'dim';
}

const Avatar = ({ initial }: { initial: string }) => (
    <span className="flex size-[44px] shrink-0 items-center justify-center rounded-full border border-white/30 font-display text-[1.4rem] font-bold text-white"
        style={{ background: `radial-gradient(circle at 30% 28%, ${C.nitrate}88, ${C.nitrateDeep} 72%)` }}>
        {initial}
    </span>
);

const Placeholder = () => (
    <div className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15">
        <span className="font-display text-[3.4rem] font-semibold leading-none text-white/20">?</span>
        <span className="font-mono text-[16px] text-gray-500">próximo caso</span>
    </div>
);

export const CastCard = ({ member, revealed, state }: CastCardProps) => {
    const reduce = useReducedMotion() ?? false;
    if (!revealed) return <Placeholder />;
    return (
        <Panel state={state} glow={C.nitrate} className="h-full">
            <motion.div className="flex h-full flex-col gap-2 px-4 pb-3 pt-3"
                initial={{ opacity: 0, y: reduce ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.45 }}>
                <div className="flex items-center gap-3">
                    <Avatar initial={member.initial} />
                    <div className="min-w-0">
                        <p className="font-display text-[1.7rem] font-semibold leading-none text-white">{member.name}</p>
                        <p className="mt-1 text-[16px] leading-none text-gray-400">{member.age} anos</p>
                    </div>
                </div>

                <div>
                    <p className="text-[16px] leading-tight text-gray-300">{member.role}</p>
                    <p className="text-[16px] font-semibold leading-tight" style={{ color: C.nitrateSoft }}>{member.event}</p>
                </div>

                <div>
                    <p className="mb-1 text-[16px] leading-none text-gray-200">esforço: {member.durationLabel}</p>
                    <EffortProfile member={member} />
                </div>

                <Vo2Meter value={member.vo2max} />

                <div className="mt-auto rounded-xl border px-3 py-2" style={{ borderColor: `${C.nitrate}66`, background: `${C.nitrate}12` }}>
                    <p className="font-mono text-[16px] leading-none" style={{ color: C.nitrateSoft }}>o dilema</p>
                    <p className="mt-1 text-[16px] leading-snug text-gray-100">{member.dilemma}</p>
                </div>
            </motion.div>
        </Panel>
    );
};
