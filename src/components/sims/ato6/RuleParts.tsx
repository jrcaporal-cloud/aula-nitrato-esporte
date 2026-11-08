import { motion, useReducedMotion } from 'framer-motion';
import { BadgeCheck, FileSearch, Landmark, Scale, ShieldCheck } from 'lucide-react';
import type { ComponentType } from 'react';
import { Kicker } from './ui';
import { RULE_CARDS, TONE_COLOR, type RuleCard, type RuleId, type RuleStep } from './rulesContent';

/** Peças do slide 84: os cinco selos (WADA, AIS, IOC, ISSN, Anvisa) e o painel de detalhe do passo. */

const ICONS: Record<RuleId, ComponentType<{ size?: number; color?: string }>> = {
    wada: ShieldCheck, ais: BadgeCheck, ioc: Landmark, issn: Scale, br: FileSearch,
};

const Seal = ({ card, active }: { card: RuleCard; active: boolean }) => {
    const color = TONE_COLOR[card.tone];
    const Icon = ICONS[card.id];
    const dashed = card.tone === 'unknown';
    return (
        <div className="flex flex-col gap-1.5 rounded-2xl border p-3 transition-[opacity,box-shadow,border-color] duration-500"
            style={{
                opacity: active ? 1 : 0.4, borderStyle: dashed ? 'dashed' : 'solid', borderColor: active ? `${color}cc` : 'rgba(255,255,255,0.15)',
                background: active ? `linear-gradient(170deg, ${color}22, rgba(10,6,14,0.8) 70%)` : 'rgba(10,6,14,0.7)',
                boxShadow: active ? `0 0 28px -10px ${color}` : 'none',
            }}>
            <div className="flex items-center gap-2">
                <Icon size={22} color={color} />
                <span className="font-display text-[19px] font-semibold leading-tight text-white">{card.org}</span>
            </div>
            <p className="m-0 font-mono text-[15px] font-semibold uppercase tracking-wide" style={{ color }}>{card.seal}</p>
            <p className="m-0 text-[15px] leading-snug text-gray-300">{card.line}</p>
        </div>
    );
};

export const SealRow = ({ active }: { active: readonly RuleId[] }) => (
    <div className="grid grid-cols-5 gap-3">
        {RULE_CARDS.map(c => <Seal key={c.id} card={c} active={active.includes(c.id)} />)}
    </div>
);

export const DetailPanel = ({ step, id }: { step: RuleStep; id: number }) => {
    const reduce = useReducedMotion();
    const flagColor = TONE_COLOR[step.flagTone];
    return (
        <motion.div key={id} className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_340px] gap-3"
            initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <div className="flex flex-col gap-2.5 rounded-2xl border border-white/10 p-4" style={{ background: 'rgba(10,6,14,0.74)' }}>
                <Kicker color={flagColor}>{step.kicker}</Kicker>
                <h3 className="m-0 font-display text-[26px] font-semibold leading-tight text-white">{step.title}</h3>
                <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                    {step.items.map(it => (
                        <li key={it.text} className="flex gap-2.5 text-[16px] leading-snug text-gray-100">
                            <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: flagColor }} />
                            <span>{it.text} <span className="font-mono text-[14px] text-gray-400">{it.src}</span></span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl border p-5" style={{ borderColor: `${flagColor}99`, borderStyle: step.flagTone === 'unknown' ? 'dashed' : 'solid', background: `${flagColor}12` }}>
                <Kicker color={flagColor}>{step.flagTitle}</Kicker>
                <p className="m-0 text-[18px] leading-snug text-gray-100">{step.flag}</p>
            </div>
        </motion.div>
    );
};
