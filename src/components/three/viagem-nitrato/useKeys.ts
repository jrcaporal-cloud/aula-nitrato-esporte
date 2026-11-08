import { useEffect, useRef } from 'react';

export interface VnKeyActions {
    next: () => void;
    prev: () => void;
    togglePlay: () => void;
    recenter: () => void;
    toggleChx: () => void;
    /** Esc: solta a estrutura fixada; sem nada fixado, fecha. */
    escape: () => void;
    close: () => void;
}

/**
 * Teclado do modal: setas / PageUp / PageDown trocam de etapa, espaço reproduz, R recentra,
 * C liga o bochecho, Esc solta ou fecha, 3 fecha. Com Ctrl, Cmd ou Alt nada é capturado; com o foco
 * num botão ou campo, as teclas dele valem (o modal tira o foco dos controles ao soltar o mouse).
 */
export const useVnKeys = (actions: VnKeyActions): void => {
    const latest = useRef(actions);
    useEffect(() => { latest.current = actions; });

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            const a = latest.current;
            const t = e.target;
            const inInput = t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement;
            const onButton = t instanceof HTMLButtonElement;
            if (!inInput && ['ArrowRight', 'PageDown', 'ArrowDown'].includes(e.key)) { e.preventDefault(); a.next(); }
            else if (!inInput && ['ArrowLeft', 'PageUp', 'ArrowUp'].includes(e.key)) { e.preventDefault(); a.prev(); }
            else if (e.key === ' ' && !onButton && !inInput) { e.preventDefault(); a.togglePlay(); }
            else if ((e.key === 'r' || e.key === 'R') && !inInput) a.recenter();
            else if ((e.key === 'c' || e.key === 'C') && !inInput) a.toggleChx();
            else if (e.key === 'Escape') a.escape();
            else if (e.key === '3') a.close();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);
};
