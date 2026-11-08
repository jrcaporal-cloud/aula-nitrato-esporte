import { motion, useReducedMotion } from 'framer-motion';
import { C } from './kit/palette';
import { ArteStyles } from './ato6/arte-b/kit';
import { Journey } from './ato6/arte-b/closing/Journey';
import { KeyFact } from './kit/rhythm';

/**
 * Slide final (id 99) — tela cheia de arte: o ânion percorre beterraba → boca → músculo (NO₃⁻ → NO₂⁻ → NO) e a frase
 * de fecho se compõe em três linhas, com a segunda metade em verde (hl-no). Sem passos.
 * Entra pelo QuoteSlide (slide sem título), que monta o [[COMP:ClosingSim]] em tela cheia.
 */
const W = 1136;
const HEIGHT = 600;

const LINES: readonly { text: string; hl?: boolean }[] = [
    { text: 'Um ânion que a beterraba guardou' },
    { text: 'e que a boca soube usar:' },
    { text: 'pequeno efeito, grande método', hl: true },
];

const ClosingSim = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div data-closing-sim className="not-prose relative mx-auto flex select-none flex-col items-center justify-center gap-4 font-body" style={{ width: W, height: HEIGHT }}>
            <ArteStyles />
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10"
                style={{ background: `radial-gradient(ellipse 480px 130px at 50% 84%, ${C.no}1a, transparent)` }} />
            <motion.div initial={reduce ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>
                <Journey />
            </motion.div>
            <div className="flex flex-col items-center text-center">
                {LINES.map((l, i) => (
                    <motion.p key={l.text} className="m-0 font-display text-[54px] font-semibold leading-[1.12] tracking-[-0.01em] text-white"
                        style={{ textShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
                        initial={reduce ? false : { opacity: 0, y: 18, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.9, delay: 0.5 + i * 0.45, ease: [0.16, 1, 0.3, 1] }}>
                        {l.hl ? <><KeyFact color={C.no} delay={0.5 + i * 0.45 + 0.7}><span className="hl-no" style={{ textShadow: `0 0 40px ${C.no}88` }}>{l.text}</span></KeyFact>.</> : l.text}
                    </motion.p>
                ))}
            </div>
        </div>
    );
};

export default ClosingSim;
