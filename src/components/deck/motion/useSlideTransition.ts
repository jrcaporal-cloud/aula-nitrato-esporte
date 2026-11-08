import { useCallback, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { actOf } from './acts';
import type { SlideMotion } from './transitions';

interface TransitionState {
    prev: number;
    d: 1 | -1;
    crossesAct: boolean;
    /** Ato (0–5) cujo cartão de abertura está na tela; null = sem cartão. */
    cardAct: number | null;
    /** Muda a cada cartão novo (reinicia a animação do cartão). */
    cardKey: number;
}

export interface SlideTransition {
    motion: SlideMotion;
    cardAct: number | null;
    cardKey: number;
    closeCard: () => void;
}

/**
 * Deriva, a cada troca de slide, a direção e se a troca abriu um ato novo.
 * O cartão de ato só aparece avançando (voltar nunca mostra cartão); a capa não tem cartão.
 */
export const useSlideTransition = (index: number): SlideTransition => {
    const reduced = useReducedMotion() ?? false;
    const [state, setState] = useState<TransitionState>({ prev: index, d: 1, crossesAct: false, cardAct: null, cardKey: 0 });

    // Padrão "valor anterior no estado": ajusta durante o render, sem efeito.
    if (state.prev !== index) {
        const fromAct = actOf(state.prev);
        const toAct = actOf(index);
        const forward = index > state.prev;
        const crossesAct = fromAct !== toAct && toAct !== null;
        const opensCard = forward && crossesAct;
        setState({
            prev: index,
            d: forward ? 1 : -1,
            crossesAct: opensCard,
            cardAct: opensCard ? toAct : null,
            cardKey: opensCard ? state.cardKey + 1 : state.cardKey,
        });
    }

    const closeCard = useCallback(() => {
        setState(s => (s.cardAct === null ? s : { ...s, cardAct: null }));
    }, []);

    return {
        motion: { d: state.d, kind: state.crossesAct ? 'act' : 'lateral', reduced },
        cardAct: state.cardAct,
        cardKey: state.cardKey,
        closeCard,
    };
};
