import { motion, useReducedMotion } from 'framer-motion';
import { Timer } from 'lucide-react';
import { Reveal } from '../kit/rhythm';
import { Panel } from '../kit/ui';
import type { CastMember } from './cast';
import { CastScene } from './art/CastScenes';
import { CAST_LOOK } from './art/castLook';
import { DurationBar } from './art/DurationBar';
import { VoGauge } from './art/VoGauge';

/**
 * Ficha de um caso fictício: cena da prova, VO₂max em medidor, duração na régua e o dilema num balão. Antes de entrar, é só uma silhueta.
 * Ao entrar: cena e ficha → o VO₂max sobe no medidor (com destaque, ver VoGauge) → o dilema.
 */

interface CastCardProps {
    member: CastMember;
    revealed: boolean;
    state: 'idle' | 'active' | 'dim';
}

const Placeholder = ({ member }: { member: CastMember }) => {
    const look = CAST_LOOK[member.name];
    return (
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-dashed border-white/15">
            <CastScene sport={look.sport} color="#64748B" soft="#94A3B8" animate={false} ghost />
            <div className="flex flex-1 flex-col items-center justify-center gap-2">
                <span className="font-display text-[3.4rem] font-semibold leading-none text-white/20">?</span>
                <span className="font-mono text-[16px] text-gray-500">próximo caso</span>
            </div>
        </div>
    );
};

export const CastCard = ({ member, revealed, state }: CastCardProps) => {
    const reduce = useReducedMotion() ?? false;
    const look = CAST_LOOK[member.name];
    if (!revealed) return <Placeholder member={member} />;
    return (
        <Panel state={state} glow={look.color} className="h-full">
            <motion.div className="flex h-full flex-col" initial={{ opacity: 0, y: reduce ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.45 }}>
                <div className="relative">
                    <CastScene sport={look.sport} color={look.color} soft={look.soft} animate={!reduce} />
                    <div className="absolute right-2 top-2"><VoGauge value={member.vo2max} color={look.color} soft={look.soft} /></div>
                    <span className="absolute bottom-1 left-2 flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[15px] font-semibold leading-none text-white backdrop-blur-sm"
                        style={{ borderColor: `${look.color}77`, background: 'rgba(7,5,11,0.66)' }}>
                        <Timer size={16} style={{ color: look.soft }} aria-hidden />
                        {member.durationLabel}
                    </span>
                </div>

                <div className="flex flex-1 flex-col gap-1.5 px-3.5 pb-2.5 pt-2">
                    <div>
                        <p className="flex items-baseline gap-2 leading-none">
                            <span className="font-display text-[1.65rem] font-semibold text-white">{member.name}</span>
                            <span className="font-mono text-[16px] text-gray-400">{member.age} anos</span>
                        </p>
                        <p className="mt-1 text-[16px] leading-tight text-gray-300">{member.role}</p>
                        <p className="text-[16px] font-semibold leading-tight" style={{ color: look.soft }}>{member.event}</p>
                    </div>

                    <DurationBar member={member} color={look.color} soft={look.soft} />

                    <Reveal order={2} delay={0.3} className="relative mt-auto rounded-2xl border px-3 pb-1.5 pt-1" style={{ borderColor: `${look.color}77`, background: `${look.color}18` }}>
                        <span aria-hidden className="absolute -top-[7px] left-6 size-3 rotate-45 border-l border-t" style={{ borderColor: `${look.color}77`, background: '#150E1B' }} />
                        <p className="font-mono text-[14px] leading-none" style={{ color: look.soft }}>dilema</p>
                        <p className="mt-0.5 text-[16px] leading-[1.3] text-gray-100">{member.dilemma}</p>
                    </Reveal>
                </div>
            </motion.div>
        </Panel>
    );
};
