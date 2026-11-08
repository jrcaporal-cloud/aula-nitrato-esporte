import { BadgeCheck, FileSearch, Landmark, Scale, ShieldCheck } from 'lucide-react';
import type { ComponentType } from 'react';
import { RULE_CARDS, TONE_COLOR, type RuleCard, type RuleId, type Tone } from '../../rulesContent';
import { Glass, Rise } from '../kit';

/** Painel de árbitros: cinco selos com semáforo (verde, âmbar ou ardósia tracejado) que acendem conforme o passo. */

const ICONS: Record<RuleId, ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
    wada: ShieldCheck, ais: BadgeCheck, ioc: Landmark, issn: Scale, br: FileSearch,
};

const LAMPS: readonly Tone[] = ['ok', 'mid', 'unknown'];

const Lamps = ({ tone, active }: { tone: Tone; active: boolean }) => (
    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-2 py-1.5" aria-hidden>
        {LAMPS.map(l => {
            const on = l === tone;
            const col = TONE_COLOR[l];
            return (
                <span key={l} className={`block h-3 w-3 rounded-full ${on && active ? 'ab-a' : ''}`}
                    style={{
                        background: on ? col : 'rgba(255,255,255,0.1)', opacity: on ? 1 : 0.6,
                        boxShadow: on && active ? `0 0 12px 2px ${col}` : 'none',
                        animation: on && active ? 'ab-pulse 2.2s ease-in-out infinite' : 'none',
                    }} />
            );
        })}
    </div>
);

const Seal = ({ card, active, index }: { card: RuleCard; active: boolean; index: number }) => {
    const color = TONE_COLOR[card.tone];
    const Icon = ICONS[card.id];
    return (
        <Rise delay={index * 0.06} y={14} className="min-w-0">
            <Glass color={color} glow={active ? 1 : 0} dashed={card.tone === 'unknown'} className="flex h-[144px] flex-col items-center gap-0.5 px-2 pb-2 pt-2"
                style={{ opacity: active ? 1 : 0.42 }}>
                <div className="flex w-full items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border-2"
                        style={{ borderColor: color, borderStyle: card.tone === 'unknown' ? 'dashed' : 'solid', background: `radial-gradient(circle, ${color}33, transparent 70%)` }}>
                        <Icon size={23} color={color} strokeWidth={2.2} />
                    </span>
                    <Lamps tone={card.tone} active={active} />
                </div>
                <p className="m-0 mt-0.5 w-full text-left font-display text-[18px] font-semibold leading-tight text-white">{card.org}</p>
                <p className="m-0 w-full text-left font-mono text-[14px] font-semibold uppercase leading-tight tracking-wide" style={{ color }}>{card.seal}</p>
                <p className="m-0 w-full text-left text-[14px] leading-tight text-gray-300">{card.line}</p>
            </Glass>
        </Rise>
    );
};

export const SealPanel = ({ active }: { active: readonly RuleId[] }) => (
    <div className="grid grid-cols-5 gap-2.5">
        {RULE_CARDS.map((c, i) => <Seal key={c.id} card={c} active={active.includes(c.id)} index={i} />)}
    </div>
);
