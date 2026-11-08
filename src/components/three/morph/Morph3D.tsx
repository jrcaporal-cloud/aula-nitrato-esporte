import { Suspense, useEffect, useState, type ReactNode } from 'react';
import { motion, useIsPresent, useReducedMotion } from 'framer-motion';
import type { ArtRect } from './measureArt';
import type { MorphAccent } from './accent';
import { buildMorphVariants } from './variants';
import { MorphLoading } from './MorphLoading';

interface Morph3DProps {
    /** Retângulo da arte no momento da abertura (o de fechamento chega pelo `custom` do AnimatePresence). */
    from: ArtRect | null;
    accent: MorphAccent;
    /** Fecha antes de o modal montar (Esc ou 3 durante a abertura); depois disso o próprio modal cuida. */
    onClose: () => void;
    children: ReactNode;
}

/**
 * Com `onUpdate` o framer anima pelo próprio relógio em vez do WAAPI. No WAAPI, ao terminar, ele cancela
 * a animação um quadro antes de gravar o valor final: o retângulo da arte piscava por um quadro.
 */
const JS_DRIVEN = () => {};

/** Enquanto o retângulo cresce o modal ainda não existe: Esc e 3 precisam fechar mesmo assim. */
const useEarlyClose = (active: boolean, onClose: () => void) => {
    useEffect(() => {
        if (!active) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey || (e.key !== 'Escape' && e.key !== '3')) return;
            e.preventDefault();
            e.stopPropagation();
            onClose();
        };
        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
    }, [active, onClose]);
};

/**
 * Invólucro do modal 3D: a cena nasce do retângulo da arte do slide e cresce até a tela cheia
 * (`clip-path` de um contêiner que já está em tela cheia — o Canvas não muda de tamanho), com um
 * clarão curto na cor do modelo. Ao fechar, encolhe de volta para a arte. Enquanto o modelo baixa,
 * o retângulo cresce com um véu escuro e um indicador discreto.
 * O modal só é montado quando o retângulo termina de crescer: montar a cena trava a thread principal
 * por alguns quadros e congelaria a animação no meio do caminho.
 * Precisa ser filho direto de `<AnimatePresence custom={rect}>`.
 */
export const Morph3D = ({ from, accent, onClose, children }: Morph3DProps) => {
    const reduced = useReducedMotion() ?? false;
    const v = buildMorphVariants(reduced);
    const present = useIsPresent();
    const [grown, setGrown] = useState(false);
    useEarlyClose(present && !grown, onClose);
    const cx = from?.cx ?? 0;
    const cy = from?.cy ?? 0;
    const glow = `radial-gradient(circle at ${cx}px ${cy}px, ${accent.core}8C 0%, ${accent.edge}33 32%, transparent 68%)`;

    return (
        <motion.div
            className="absolute inset-0 z-50"
            custom={from}
            variants={v.root}
            initial="hidden"
            animate="shown"
            exit="gone"
        >
            {/* o resto do slide escurece enquanto a arte cresce */}
            <motion.div aria-hidden className="absolute inset-0 bg-black pointer-events-none" variants={v.dim} onUpdate={JS_DRIVEN} />

            {/* `custom` também aqui: na entrada cada camada lê o próprio `custom` (na saída vale o do AnimatePresence) */}
            <motion.div className="absolute inset-0 overflow-hidden" style={{ willChange: 'clip-path' }} custom={from} variants={v.door}
                onUpdate={JS_DRIVEN}
                onAnimationComplete={def => { if (def === 'shown') setGrown(true); }}
            >
                <motion.div aria-hidden className="absolute inset-0 bg-[#07050B]" variants={v.veil} onUpdate={JS_DRIVEN} />
                <motion.div className="absolute inset-0" style={{ transformOrigin: `${cx}px ${cy}px` }} variants={v.content}>
                    {present && <MorphLoading accent={accent} />}
                    {grown && <Suspense fallback={null}>{children}</Suspense>}
                </motion.div>
                <motion.div
                    aria-hidden
                    className="absolute inset-0 z-[60] pointer-events-none"
                    style={{ background: glow, mixBlendMode: 'screen' }}
                    variants={v.flash}
                />
            </motion.div>
        </motion.div>
    );
};
