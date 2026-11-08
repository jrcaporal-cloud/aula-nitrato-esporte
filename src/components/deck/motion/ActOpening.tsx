import { useEffect, useLayoutEffect, useRef } from 'react';
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'framer-motion';
import { ACTS } from './acts';
import { ActTrail } from './ActTrail';
import { useMotionStore } from './motionStore';
import { KEEP_JS_ANIMATION } from './transitions';

const CARD_MS = 2200;
/** Teclas que, com o cartão na tela, só fecham o cartão (não avançam passo nem slide). */
const CLOSE_KEYS = new Set(['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter', 'Escape']);

interface ActOpeningProps {
    act: number | null;
    cardKey: number;
    onClose: () => void;
}

interface CardProps {
    act: number;
    onClose: () => void;
}

const Card = ({ act, onClose }: CardProps) => {
    const reduced = useReducedMotion() ?? false;
    const nodeRef = useRef<HTMLSpanElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const { numeral, name, color, colorB } = ACTS[act];
    // Saindo (animação de saída): já não segura teclas — o próximo → volta a navegar na hora.
    const isPresent = useIsPresent();

    // Fecha sozinho; →/espaço/Enter/Esc fecham sem chegar à navegação (fase de captura).
    useEffect(() => {
        if (!isPresent) return;
        const timer = window.setTimeout(onClose, CARD_MS);
        const onKey = (e: KeyboardEvent) => {
            if (!CLOSE_KEYS.has(e.key) || e.metaKey || e.ctrlKey || e.altKey) return;
            e.preventDefault();
            e.stopImmediatePropagation();
            onClose();
        };
        window.addEventListener('keydown', onKey, true);
        return () => { window.clearTimeout(timer); window.removeEventListener('keydown', onKey, true); };
    }, [onClose, isPresent]);

    // O íon personagem pousa logo acima do nó do ato atual enquanto o cartão está aberto.
    useLayoutEffect(() => {
        const node = nodeRef.current;
        const root = rootRef.current?.parentElement;
        if (!node || !root) return;
        const n = node.getBoundingClientRect();
        const r = root.getBoundingClientRect();
        const size = Math.max(34, n.width * 2.1);
        const stop = { x: n.left - r.left + n.width / 2, y: n.top - r.top - size * 0.72, size };
        useMotionStore.getState().setIonStop(stop);
        // Só solta o íon se o pouso ainda é deste cartão (um cartão novo pode já ter assumido).
        return () => { if (useMotionStore.getState().ionStop === stop) useMotionStore.getState().setIonStop(null); };
    }, []);

    return (
        <motion.div
            ref={rootRef}
            role="status"
            aria-live="polite"
            aria-label={`Ato ${numeral}: ${name}`}
            className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.22 } }}
            exit={{ opacity: 0, transition: { duration: 0.28 } }}
            onUpdate={KEEP_JS_ANIMATION}
            onClick={onClose}
        >
            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(ellipse 70% 60% at 50% 42%, ${color}24 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 85% 100%, ${colorB}1c 0%, transparent 70%), rgba(7,5,11,0.985)`,
                }}
            />
            <div className="relative flex flex-col items-center text-center px-6">
                <motion.p
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.08, duration: 0.4 } }}
                    className="uppercase tracking-[0.45em] text-gray-300 font-display"
                    style={{ fontSize: 'clamp(16px, 2.4vmin, 24px)' }}
                >
                    Ato
                </motion.p>
                <motion.p
                    initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] } }}
                    className="leading-none"
                    style={{
                        // Numeral romano com serifa: na fonte de título o "III" vira três barras.
                        fontFamily: "Georgia, 'Times New Roman', serif",
                        fontWeight: 400,
                        fontSize: 'clamp(110px, 24vmin, 240px)',
                        backgroundImage: `linear-gradient(120deg, ${color}, ${colorB})`,
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        filter: `drop-shadow(0 0 28px ${color}55)`,
                    }}
                >
                    {numeral}
                </motion.p>
                <motion.p
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.22, duration: 0.45 } }}
                    className="font-display font-semibold text-white mt-2"
                    style={{ fontSize: 'clamp(30px, 5.6vmin, 58px)' }}
                >
                    {name}
                </motion.p>
                <ActTrail current={act} nodeRef={nodeRef} reduced={reduced} />
            </div>
        </motion.div>
    );
};

/** Cartão de abertura de ato (~2,2 s): numeral, nome e a trilha dos seis atos. Clique ou → fecha. */
export const ActOpening = ({ act, cardKey, onClose }: ActOpeningProps) => (
    <AnimatePresence>
        {act !== null && <Card key={cardKey} act={act} onClose={onClose} />}
    </AnimatePresence>
);
