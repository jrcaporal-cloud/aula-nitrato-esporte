import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import type { VisualId } from './takeawaysContent';

/** Mini-visuais das seis mensagens (slide 88): cada um repete o número que sustenta a frase. */

const Track = ({ pct, color, label, shown, delay = 0, narrow = false }: { pct: number; color: string; label: string; shown: string; delay?: number; narrow?: boolean }) => {
    const reduce = useReducedMotion();
    return (
        <div className="flex items-center gap-3">
            <span className={`${narrow ? 'w-[112px]' : 'w-[150px]'} shrink-0 text-[15px] text-gray-200`}>{label}</span>
            <div className={`${narrow ? 'h-5' : 'h-8'} flex-1 rounded-md bg-white/5`}>
                <motion.div className="h-full rounded-md" style={{ background: color }} initial={reduce ? false : { width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }} />
            </div>
            <span className={`${narrow ? 'w-[62px] text-[18px]' : 'w-[74px] text-[20px]'} shrink-0 text-right font-display font-semibold text-white`}>{shown}</span>
        </div>
    );
};

const Dots = ({ total, lit, color, small = false }: { total: number; lit: number; color: string; small?: boolean }) => (
    <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: total }, (_, i) => (
            <span key={i} className={`${small ? 'h-3.5 w-3.5' : 'h-5 w-5'} rounded-full`} style={{ background: i < lit ? color : 'rgba(255,255,255,0.12)', boxShadow: i < lit ? `0 0 10px ${color}` : 'none' }} />
        ))}
    </div>
);

/** Régua −10 … +30 com a faixa individual e a média. */
const RespRange = () => {
    const at = (v: number): string => `${((v + 10) / 40) * 100}%`;
    return (
        <div className="flex flex-col gap-1">
            <div className="relative h-8">
                <div className="absolute top-1/2 h-4 -translate-y-1/2 rounded-md" style={{ left: at(-9.6), width: `calc(${at(26.8)} - ${at(-9.6)})`, background: `${C.bacteria}77` }} />
                <div className="absolute top-1/2 h-7 w-[4px] -translate-x-1/2 -translate-y-1/2 rounded bg-white" style={{ left: at(4.4) }} />
                <div className="absolute inset-y-0 w-px bg-white/40" style={{ left: at(0) }} />
            </div>
            <div className="flex justify-between font-mono text-[14px] text-gray-300"><span>−9,6%</span><span className="text-white">média +4,4%</span><span>+26,8%</span></div>
        </div>
    );
};

export const TakeawayVisual = ({ id, color, narrow = false }: { id: VisualId; color: string; narrow?: boolean }) => {
    switch (id) {
        case 'tte':
            return <div className="flex flex-col gap-2"><Track pct={100} color={C.nitrate} label="até a exaustão" shown="+16%" narrow={narrow} /><Track pct={17} color={C.placebo} label="contrarrelógio" shown="0–3%" delay={0.15} narrow={narrow} /></div>;
        case 'prep':
            return <div className="flex flex-col gap-2"><Track pct={100} color={C.o2} label="todos os níveis" shown="0,17" narrow={narrow} /><Track pct={12} color={C.placebo} label="VO₂pico ≥ 65" shown="0,02" delay={0.15} narrow={narrow} /></div>;
        case 'dose':
            return (
                <div className="flex flex-col gap-1.5">
                    <div className="relative h-8 rounded-md bg-white/5">
                        <div className="absolute inset-y-0 rounded-md" style={{ left: `${(8 / 17) * 100}%`, width: `${(8 / 17) * 100}%`, background: `${C.no}66`, border: `1px solid ${C.no}` }} />
                    </div>
                    <div className="flex justify-between font-mono text-[14px] text-gray-300"><span>0</span><span style={{ color: C.no }}>8–16 mmol</span><span>17</span></div>
                </div>
            );
        case 'label':
            return <Dots total={24} lit={5} color={color} small={narrow} />;
        case 'resp':
            return <RespRange />;
        case 'gap':
            return <div className="flex flex-col gap-2"><Track pct={100} color={C.placebo} label="homens" shown="1.179" narrow={narrow} /><Track pct={13} color={C.hypoxia} label="mulheres" shown="156" delay={0.15} narrow={narrow} /></div>;
    }
};
