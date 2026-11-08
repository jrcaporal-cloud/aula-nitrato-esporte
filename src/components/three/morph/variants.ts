import type { Transition, Variants } from 'framer-motion';
import type { ArtRect } from './measureArt';

/** Abertura e fechamento: ambos ≤ 0,7 s (o fechamento é mais curto para não segurar o professor). */
const OPEN_S = 0.6;
const CLOSE_S = 0.5;
const EASE_OPEN = [0.33, 1, 0.68, 1] as const;
const EASE_CLOSE = [0.32, 0.72, 0, 1] as const;
/** Cantos arredondados do retângulo enquanto ele ainda é "a arte do slide". */
const ART_RADIUS = 18;
/** Escuridão do resto do slide durante a cena (o 3D cobre tudo; isso só aparece na transição). */
const DIM = 0.6;

const FULL = 'inset(0px 0px 0px 0px round 0px)';
const insetOf = (r: ArtRect | null) =>
    r ? `inset(${r.top}px ${r.right}px ${r.bottom}px ${r.left}px round ${ART_RADIUS}px)` : FULL;

export interface MorphVariants {
    root: Variants;
    dim: Variants;
    door: Variants;
    veil: Variants;
    content: Variants;
    flash: Variants;
}

/** Variantes compartilhadas por nome (hidden → shown → gone); com movimento reduzido, troca direta. */
export const buildMorphVariants = (reduced: boolean): MorphVariants => {
    const open: Transition = reduced ? { duration: 0 } : { duration: OPEN_S, ease: EASE_OPEN };
    const close: Transition = reduced ? { duration: 0 } : { duration: CLOSE_S, ease: EASE_CLOSE };
    const instant: Transition = { duration: 0 };

    return {
        // A raiz não se move: só segura a saída até as camadas internas terminarem.
        root: {
            hidden: { opacity: 1 },
            shown: { opacity: 1, transition: instant },
            gone: { opacity: 1, transition: close },
        },
        dim: {
            hidden: { opacity: 0 },
            shown: { opacity: DIM, transition: open },
            gone: { opacity: 0, transition: close },
        },
        door: {
            hidden: (r: ArtRect | null) => ({ clipPath: reduced ? FULL : insetOf(r) }),
            shown: { clipPath: FULL, transition: open },
            gone: (r: ArtRect | null) => ({ clipPath: reduced ? FULL : insetOf(r), transition: close }),
        },
        // Véu escuro dentro do retângulo: começa translúcido (a arte ainda aparece) e fecha; na volta, abre.
        veil: {
            hidden: { opacity: reduced ? 1 : 0.2 },
            shown: { opacity: 1, transition: reduced ? instant : { duration: OPEN_S * 0.55, ease: 'easeOut' } },
            gone: { opacity: 0, transition: reduced ? instant : { duration: CLOSE_S * 0.7, delay: CLOSE_S * 0.3, ease: 'easeIn' } },
        },
        content: {
            hidden: { scale: reduced ? 1 : 0.94 },
            shown: { scale: 1, transition: open },
            gone: { scale: reduced ? 1 : 0.96, transition: close },
        },
        flash: {
            hidden: { opacity: 0 },
            shown: reduced
                ? { opacity: 0, transition: instant }
                : { opacity: [0, 1, 0], transition: { duration: OPEN_S + 0.1, times: [0, 0.3, 1], ease: 'easeOut' } },
            gone: reduced
                ? { opacity: 0, transition: instant }
                : { opacity: [0, 0.7, 0], transition: { duration: CLOSE_S, times: [0, 0.45, 1], ease: 'easeInOut' } },
        },
    };
};
