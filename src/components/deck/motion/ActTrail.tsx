import type { RefObject } from 'react';
import { motion } from 'framer-motion';
import { C } from '../../sims/kit/palette';
import { ACTS } from './acts';

interface ActTrailProps {
    current: number;
    /** Nó do ato atual: o cartão mede a posição para o íon pousar em cima. */
    nodeRef: RefObject<HTMLSpanElement | null>;
    reduced: boolean;
}

const NODE = 'clamp(16px, 2.3vmin, 24px)';
const COLS = ACTS.length;
/** Centro da primeira e da última coluna (a linha liga os nós, não as bordas). */
const EDGE = `${100 / (COLS * 2)}%`;

/** A trilha dos seis atos: os já vistos acesos na cor de cada um, o atual pulsando, os próximos apagados. */
export const ActTrail = ({ current, nodeRef, reduced }: ActTrailProps) => {
    const litWidth = `${(current / COLS) * 100}%`;
    const gradient = `linear-gradient(90deg, ${ACTS.slice(0, current + 1).map(a => a.color).join(', ')}${current === 0 ? `, ${ACTS[0].color}` : ''})`;
    return (
        <div className="relative mt-[clamp(28px,6vmin,64px)] grid" style={{ width: 'min(940px, 90vw)', gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
            <div className="absolute h-[2px] rounded-full bg-white/12" style={{ left: EDGE, right: EDGE, top: `calc(${NODE} / 2 - 1px)` }} />
            <motion.div
                className="absolute h-[2px] rounded-full origin-left"
                style={{ left: EDGE, width: litWidth, top: `calc(${NODE} / 2 - 1px)`, background: gradient }}
                initial={reduced ? false : { scaleX: current === 0 ? 0 : (current - 1) / current }}
                animate={{ scaleX: 1, transition: { delay: 0.25, duration: 0.55, ease: 'easeOut' } }}
            />
            {ACTS.map((act, i) => {
                const seen = i < current;
                const isNow = i === current;
                const lit = seen || isNow;
                return (
                    <div key={act.numeral} className="relative flex flex-col items-center px-1">
                        <span
                            ref={isNow ? nodeRef : undefined}
                            className="relative block rounded-full"
                            style={{
                                width: NODE,
                                height: NODE,
                                background: lit ? act.color : '#07050B',
                                border: `2px solid ${lit ? act.color : C.placebo}`,
                                opacity: lit ? 1 : 0.5,
                                boxShadow: isNow ? `0 0 18px ${act.color}` : undefined,
                            }}
                        >
                            {isNow && !reduced && (
                                <motion.span
                                    className="absolute -inset-[2px] rounded-full"
                                    style={{ border: `2px solid ${act.color}` }}
                                    initial={{ scale: 1, opacity: 0.9 }}
                                    animate={{ scale: 2.4, opacity: 0 }}
                                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
                                />
                            )}
                        </span>
                        <span
                            className="mt-3 font-display leading-tight"
                            style={{ fontSize: 'clamp(15px, 1.9vmin, 19px)', color: isNow ? '#fff' : seen ? '#d1d5db' : '#8b93a1', fontWeight: isNow ? 600 : 400 }}
                        >
                            <span style={{ color: lit ? act.color : undefined }}>{act.numeral}</span>
                            <br />
                            {act.name}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
