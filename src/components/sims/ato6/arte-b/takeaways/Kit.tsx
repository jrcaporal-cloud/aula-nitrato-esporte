import { Check } from 'lucide-react';
import { TAKEAWAYS, type Takeaway } from '../../takeawaysContent';
import { Rise } from '../kit';
import { KIT } from './kitData';

/** Kit de consultório do slide 88: um ícone grande por mensagem; acende no passo dela e ganha o “ok” depois. */

/** Medalhão do ícone, com anel de brilho quando aceso. */
export const Medal = ({ t, size, lit }: { t: Takeaway; size: number; lit: boolean }) => {
    const { icon: I } = KIT[t.n];
    return (
        <span className="relative flex shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500"
            style={{ width: size, height: size, borderColor: lit ? t.color : 'rgba(255,255,255,0.18)', background: lit ? `radial-gradient(circle at 35% 30%, ${t.color}55, ${t.color}14 70%)` : 'rgba(255,255,255,0.04)', boxShadow: lit ? `0 0 26px -4px ${t.color}` : 'none' }}>
            {lit && <span className="ab-a absolute inset-[-5px] rounded-full border" style={{ borderColor: `${t.color}88`, animation: 'ab-breathe 2.4s ease-in-out infinite' }} aria-hidden />}
            <I size={Math.round(size * 0.46)} color={lit ? t.color : '#6B7280'} strokeWidth={1.9} />
        </span>
    );
};

export const KitRail = ({ shown, done }: { shown: readonly number[]; done: readonly number[] }) => (
    <div className="grid grid-cols-6 gap-2.5">
        {TAKEAWAYS.map((t, i) => {
            const lit = shown.includes(t.n);
            const ok = done.includes(t.n);
            return (
                <Rise key={t.n} delay={i * 0.04} className="flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 transition-[opacity,border-color] duration-500"
                    style={{ borderColor: lit ? `${t.color}aa` : 'rgba(255,255,255,0.1)', background: lit ? `linear-gradient(160deg, ${t.color}22, rgba(10,6,14,0.82))` : 'rgba(10,6,14,0.74)', opacity: lit || ok ? 1 : 0.45 }}>
                    <span className="relative">
                        <Medal t={t} size={48} lit={lit || ok} />
                        {ok && <span className="absolute -bottom-1 -right-1 flex h-[20px] w-[20px] items-center justify-center rounded-full border-2 border-[#07050B]" style={{ background: t.color }}><Check size={12} strokeWidth={4} color="#07050B" /></span>}
                    </span>
                    <span className="min-w-0">
                        <span className="block font-mono text-[14px] leading-none text-gray-400">{t.n} de 6</span>
                        <span className="block text-[15px] font-semibold leading-tight text-white">{KIT[t.n].label}</span>
                    </span>
                </Rise>
            );
        })}
    </div>
);
