import { createContext, useContext } from 'react';
import type { TargetAndTransition, Variants } from 'framer-motion';

/**
 * Como o slide entrou: `lateral` = mesmo ato (ou voltando), `act` = abriu um ato novo
 * (o cartão de abertura cobre a troca). `d` = 1 avançando, -1 voltando.
 */
export type TransitionKind = 'lateral' | 'act';

export interface SlideMotion {
    d: 1 | -1;
    kind: TransitionKind;
    reduced: boolean;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;

/** Troca do slide inteiro: curta (≤ 0,5 s) e sem fila — o slide novo entra enquanto o velho sai. */
export const SECTION_VARIANTS: Variants = {
    enter: (m: SlideMotion) => {
        if (m.reduced) return { opacity: 0 };
        if (m.kind === 'act') return { opacity: 0, scale: 0.985, x: 0 };
        return { opacity: 0, x: m.d * 40, scale: 1 };
    },
    center: (m: SlideMotion) => ({
        opacity: 1,
        x: 0,
        scale: 1,
        // A opacidade do novo espera 80 ms: o velho já quase sumiu e os títulos não se sobrepõem.
        transition: m.reduced
            ? { duration: 0.2 }
            : { duration: 0.42, ease: EASE_OUT, opacity: { duration: 0.3, delay: 0.08, ease: 'easeOut' } },
    }),
    exit: (m: SlideMotion) => {
        if (m.reduced || m.kind === 'act') {
            return { opacity: 0, transition: { duration: 0.22 } };
        }
        return { opacity: 0, x: m.d * -48, transition: { duration: 0.24, ease: EASE_IN, opacity: { duration: 0.16, ease: 'easeIn' } } };
    },
};

/**
 * Passado como `onUpdate` da section: obriga o framer a animar a opacidade no JS em vez do WAAPI.
 * Com WAAPI, no fim da animação havia um quadro com a opacidade inicial (0) — o slide piscava.
 */
export const KEEP_JS_ANIMATION = (): void => undefined;

export const SlideMotionContext = createContext<SlideMotion>({ d: 1, kind: 'lateral', reduced: false });

export const useSlideMotion = (): SlideMotion => useContext(SlideMotionContext);

interface Layer {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
}

/**
 * Parallax de entrada: o cabeçalho entra primeiro e anda menos; o conteúdo vem 60 ms depois
 * e anda mais. `offset` = deslocamento extra (px) em relação ao slide; `delay` em segundos.
 */
export const enterLayer = (m: SlideMotion, offset: number, delay: number): Layer => {
    if (m.reduced) {
        return { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.2 } } };
    }
    const from = m.kind === 'act' ? { opacity: 0, y: offset * 0.3, x: 0 } : { opacity: 0, x: m.d * offset, y: 0 };
    return {
        initial: from,
        animate: { opacity: 1, x: 0, y: 0, transition: { duration: 0.42, delay, ease: EASE_OUT } },
    };
};
