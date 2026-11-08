import type { ReactNode } from 'react';
import { C } from '../kit/palette';
import { BigStat } from './ui';
import type { FactsKind } from './mouthwash.content';

/** Painel de dados de cada passo do interruptor do enxaguante. */

const Stats = ({ items }: { items: { value: string; label: string; color: string }[] }) => (
    <div className="flex h-full flex-col justify-center gap-3.5">
        {items.map(s => <BigStat key={s.label} {...s} size={items.length > 2 ? 30 : 38} />)}
    </div>
);

interface EffectProps { label: string; value: string; fill: number; color: string; outline?: number }

const Effect = ({ label, value, fill, color, outline }: EffectProps) => (
    <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
            <span className="text-[16px] text-gray-100">{label}</span>
            <span className="font-display text-[1.45rem] font-semibold leading-none" style={{ color }}>{value}</span>
        </div>
        <div className="relative h-2.5 rounded bg-white/8">
            {outline !== undefined && <div className="absolute h-full rounded opacity-40" style={{ width: `${outline * 100}%`, background: color }} />}
            <div className="relative h-full rounded" style={{ width: `${fill * 100}%`, background: color }} />
        </div>
    </div>
);

const Chlorhexidine = () => (
    <div className="flex h-full flex-col justify-center gap-3">
        <Effect label="Produção oral de nitrito" value="−90%" fill={0.9} color={C.nitrite} />
        <Effect label="Nitrito no plasma" value="−25%" fill={0.25} color={C.nitrite} />
        <Effect label="Pressão arterial" value="+2 a 3,5 mmHg" fill={2 / 5} outline={3.5 / 5} color={C.risk} />
        <p className="text-[14px] leading-snug text-gray-400">Quanto mais o nitrito caiu, mais a PA subiu (r² = 0,56). Nitrato salivar, plasmático e urinário aumentaram.</p>
    </div>
);

const RANK = [
    { label: 'Água', w: 1, color: C.nitrite },
    { label: 'Enxaguante fraco', w: 0.62, color: C.nitrite },
    { label: 'Enxaguante forte (clorexidina)', w: 0.28, color: C.nitrite },
];

const Gradient = () => (
    <div className="flex h-full flex-col justify-center gap-3">
        <p className="text-[15px] text-gray-300">Aumento do nitrito plasmático em 2 h</p>
        {RANK.map(r => (
            <div key={r.label} className="flex flex-col gap-1">
                <span className="text-[16px] text-gray-100">{r.label}</span>
                <div className="h-2.5 rounded bg-white/8"><div className="h-full rounded" style={{ width: `${r.w * 100}%`, background: r.color }} /></div>
            </div>
        ))}
        <p className="text-[14px] leading-snug text-gray-400">Ordem medida (todos p &lt; 0,05); tamanhos ilustrativos. Forte vs água: −200 ± 174 nM.</p>
    </div>
);

const CHECKS: { ok: boolean; label: string; value: string }[] = [
    { ok: true, label: 'Nitrato no plasma', value: 'igual' },
    { ok: true, label: 'Potássio no plasma', value: 'igual' },
    { ok: false, label: 'Nitrito no plasma (2,5 h)', value: 'não subiu' },
    { ok: false, label: 'Queda da pressão sistólica', value: 'bloqueada' },
    { ok: false, label: 'Inibição das plaquetas', value: 'abolida' },
];

const Spit = () => (
    <div className="flex h-full flex-col justify-center gap-2">
        {CHECKS.map(c => (
            <div key={c.label} className="flex items-center gap-2.5 rounded-lg border border-white/8 px-3 py-1.5">
                <span className="font-mono text-[17px] font-bold" style={{ color: c.ok ? C.placebo : C.risk }}>{c.ok ? '=' : '✕'}</span>
                <span className="flex-1 text-[16px] text-gray-100">{c.label}</span>
                <span className="font-mono text-[15px] font-semibold" style={{ color: c.ok ? C.placebo : C.risk }}>{c.value}</span>
            </div>
        ))}
    </div>
);

const LINKS: { label: string; state: 'ok' | 'open'; note: string }[] = [
    { label: 'Nitrito oral ↓', state: 'ok', note: '−90%' },
    { label: 'Nitrito plasmático ↓', state: 'ok', note: '−25%' },
    { label: 'Pressão arterial ↑', state: 'ok', note: '+2 a 3,5 mmHg' },
    { label: 'Desempenho atlético', state: 'open', note: 'cadeia não fechada' },
];

const Chain = () => (
    <div className="flex h-full flex-col justify-center gap-1.5">
        {LINKS.map((l, i) => (
            <div key={l.label} className="flex flex-col items-start">
                <div className="flex w-full items-center gap-2.5 rounded-lg border px-3 py-1.5"
                    style={{ borderColor: l.state === 'ok' ? `${C.no}66` : `${C.hypoxia}99`, borderStyle: l.state === 'ok' ? 'solid' : 'dashed', background: l.state === 'ok' ? 'rgba(52,211,153,0.06)' : 'rgba(251,146,60,0.06)' }}>
                    <span className="font-mono text-[17px] font-bold" style={{ color: l.state === 'ok' ? C.no : C.hypoxia }}>{l.state === 'ok' ? '✓' : '?'}</span>
                    <span className="flex-1 text-[16px] font-semibold text-gray-100">{l.label}</span>
                    <span className="font-mono text-[14px]" style={{ color: l.state === 'ok' ? C.noSoft : C.hypoxia }}>{l.note}</span>
                </div>
                {i < LINKS.length - 1 && <span className="ml-5 text-[14px] leading-none text-gray-500">↓</span>}
            </div>
        ))}
    </div>
);

const FACTS: Record<FactsKind, () => ReactNode> = {
    water: () => <Stats items={[
        { value: '2–3 h', label: 'pico do nitrito no plasma', color: C.nitrite },
        { value: '−10,4/−8 mmHg', label: 'queda máxima da PA ~3 h após 500 mL de suco', color: C.no },
    ]} />,
    gradient: Gradient,
    chlorhexidine: Chlorhexidine,
    spit: Spit,
    exercise: () => <Stats items={[
        { value: '−5,2 mmHg', label: 'PAS 1 h após a corrida, com placebo (−3,8 a 2 h)', color: C.placebo },
        { value: '−61%', label: 'da hipotensão a 1 h com o antibacteriano', color: C.bacteria },
        { value: 'abolida', label: 'a hipotensão a 2 h, com o antibacteriano', color: C.risk },
    ]} />,
    chain: Chain,
};

export const MouthwashFacts = ({ kind }: { kind: FactsKind }) => <>{FACTS[kind]()}</>;
