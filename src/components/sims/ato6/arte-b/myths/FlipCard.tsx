import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { C } from '../../../kit/palette';
import { MYTHS, type Myth } from '../../mythsContent';
import { Kick } from '../kit';
import { cv } from '../util';

/** Carta do mito: nasce com a frase riscada e vira para o avesso (clique vira de volta). Chamar com `key={passo}`. */

const FLIP_MS = 650;

const Numeral = ({ n, color }: { n: number; color: string }) => (
    <div className="flex flex-1 items-center justify-center" aria-hidden>
        <span className="font-display text-[170px] font-semibold leading-none" style={{ color: 'transparent', WebkitTextStroke: `2px ${color}`, opacity: 0.45, textShadow: `0 0 50px ${color}` }}>{n}</span>
    </div>
);

const Pips = ({ index, color }: { index: number; color: string }) => (
    <div className="flex items-center gap-1.5" aria-hidden>
        {MYTHS.map((m, i) => (
            <span key={m.id} className="block h-2.5 rounded-full transition-all" style={{ width: i === index ? 26 : 10, background: i <= index ? color : 'rgba(255,255,255,0.18)' }} />
        ))}
    </div>
);

export const FlipCard = ({ myth, index }: { myth: Myth; index: number }) => {
    const reduce = useReducedMotion() ?? false;
    const [flipped, setFlipped] = useState(reduce);
    useEffect(() => {
        if (reduce) return undefined;
        const t = window.setTimeout(() => setFlipped(true), FLIP_MS);
        return () => window.clearTimeout(t);
    }, [reduce]);

    const face = 'absolute inset-0 flex flex-col gap-3 rounded-2xl border p-5 [backface-visibility:hidden]';
    return (
        <button type="button" onClick={() => setFlipped(f => !f)} aria-label="Virar a carta" aria-pressed={flipped}
            className="relative block h-full w-[326px] shrink-0 cursor-pointer text-left [perspective:1200px]">
            <div className="absolute inset-0 transition-transform duration-[800ms] ease-[cubic-bezier(.3,1.2,.5,1)] [transform-style:preserve-3d]"
                style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                <div className={face} style={{ borderColor: `${C.risk}88`, borderStyle: 'dashed', background: `linear-gradient(160deg, ${C.risk}26, rgba(10,6,14,0.9) 70%)` }}>
                    <div className="flex items-center justify-between"><Kick color={C.risk}>mito {index + 1} de 5</Kick><Pips index={index} color={C.risk} /></div>
                    <span className="font-display text-[64px] font-semibold leading-[0.6] text-white/20" aria-hidden>“</span>
                    <p className="m-0 font-display text-[23px] italic leading-snug text-gray-200 line-through decoration-[3px] decoration-[#F87171]/70">{myth.myth.replace(/[“”]/g, '')}</p>
                    <Numeral n={index + 1} color={C.risk} />
                    <svg viewBox="0 0 280 60" width="100%" height={60} aria-hidden>
                        <path d="M6 44 C 60 6, 90 58, 140 26 S 230 8, 274 40" fill="none" stroke={C.risk} strokeWidth="5" strokeLinecap="round" opacity="0.85"
                            className="ab-a" style={cv({ strokeDasharray: 330, '--ab-len': 330, animation: 'ab-draw 0.55s 0.1s ease-out both' })} />
                    </svg>
                </div>
                <div className={face} style={{ borderColor: `${myth.color}cc`, background: `linear-gradient(160deg, ${myth.color}30, rgba(10,6,14,0.92) 72%)`, transform: 'rotateY(180deg)', boxShadow: `0 0 40px -12px ${myth.color}` }}>
                    <div className="flex items-center justify-between"><Kick color={myth.color}>mito {index + 1} · do avesso</Kick><Pips index={index} color={myth.color} /></div>
                    <h3 className="m-0 mt-2 font-display text-[31px] font-semibold leading-[1.12] text-white">{myth.flip}</h3>
                    <Numeral n={index + 1} color={myth.color} />
                    <p className="m-0 text-[14px] italic leading-snug text-gray-400 line-through decoration-white/30">{myth.myth}</p>
                </div>
            </div>
        </button>
    );
};
