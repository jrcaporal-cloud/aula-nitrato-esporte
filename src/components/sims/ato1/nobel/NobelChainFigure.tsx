import { motion, useReducedMotion } from 'framer-motion';
import { Flame, FlaskConical, Medal } from 'lucide-react';
import type { ReactNode } from 'react';
import { C } from '../../kit/palette';

/** 1998: a ironia de cem anos em três batidas: Nobel e a dinamite → Murad e o NO → o prêmio (Nobel Assembly 1998). */

interface Beat {
    when: string;
    text: string;
    icon: ReactNode;
    color: string;
}

const BEATS: readonly Beat[] = [
    { when: 'fim do século XIX', text: 'Alfred Nobel, o inventor da dinamite, recusa a nitroglicerina que o médico receita para o coração. “Irônico”, escreve.', icon: <Flame size={26} aria-hidden />, color: C.hypoxia },
    { when: '1977', text: 'Murad descobre que a nitroglicerina libera NO.', icon: <FlaskConical size={26} aria-hidden />, color: C.no },
    { when: '1998', text: 'Nobel para Furchgott, Ignarro e Murad, pelo NO como molécula sinalizadora.', icon: <Medal size={26} aria-hidden />, color: C.noSoft },
];

export const NobelChainFigure = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="relative flex h-full flex-col justify-center gap-4 pl-1">
            <div className="absolute bottom-[14%] left-[27px] top-[14%] w-0.5 bg-white/15" />
            {BEATS.map((beat, i) => (
                <motion.div key={beat.when} className="relative flex items-center gap-4"
                    initial={{ opacity: 0, x: reduce ? 0 : 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.2 + i * 0.35 }}>
                    <span className="relative z-10 flex size-[54px] shrink-0 items-center justify-center rounded-full border-2 bg-[#0B0710]"
                        style={{ borderColor: beat.color, color: beat.color, boxShadow: `0 0 18px -4px ${beat.color}` }}>
                        {beat.icon}
                    </span>
                    <div>
                        <p className="font-mono text-[16px] leading-none" style={{ color: beat.color }}>{beat.when}</p>
                        <p className="mt-1.5 text-[18px] leading-snug text-gray-100">{beat.text}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
