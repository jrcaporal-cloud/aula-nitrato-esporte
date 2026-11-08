import { useEffect, useRef } from 'react';

export interface SarcoKeyActions {
    next: () => void;
    prev: () => void;
    /** Esc: solta a estrutura fixada; sem nada fixado, fecha. */
    escape: () => void;
    close: () => void;
    cycleView: () => void;
    togglePlay: () => void;
    recenter: () => void;
}

/**
 * Teclado do modal, capturado antes da aula (fase de captura + stopPropagation): ←/→ e PageUp/PageDown
 * trocam de etapa, P alterna placebo × nitrato, Espaço liga o avanço automático, R recentra, Esc solta
 * ou fecha, 3 fecha. Com botão ou controle focado, Espaço e Enter ficam com ele. Ctrl, Cmd e Alt passam.
 */
export const useSarcoKeys = (actions: SarcoKeyActions): void => {
    const latest = useRef(actions);
    useEffect(() => { latest.current = actions; });

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            const a = latest.current;
            const onButton = e.target instanceof HTMLButtonElement;
            if (e.key === 'ArrowRight' || e.key === 'PageDown') a.next();
            else if (e.key === 'ArrowLeft' || e.key === 'PageUp') a.prev();
            else if (e.key === 'Escape') a.escape();
            else if (e.key === '3') a.close();
            else if (e.key === 'p' || e.key === 'P') a.cycleView();
            else if (e.key === 'r' || e.key === 'R') a.recenter();
            else if (e.key === ' ' && !onButton) a.togglePlay();
            else return;
            e.preventDefault();
            e.stopPropagation();
        };
        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
    }, []);
};
