import { useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import { useStageTools } from './stageStore';

const isTypingTarget = (el: EventTarget | null) =>
    el instanceof HTMLElement && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));

/**
 * Atalhos de palco: L = holofote, K = caneta laser, Shift+K = troca a cor da caneta,
 * Esc = desliga as ferramentas (só se alguma estiver ligada). Com um modelo 3D aberto
 * (`modalOpen`), nada disso responde e as ferramentas desligam — o modal é dono do teclado.
 */
export const useStageKeys = () => {
    const modalOpen = useStore(s => s.modalOpen);

    useEffect(() => {
        if (modalOpen) useStageTools.getState().allOff();
    }, [modalOpen]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (useStore.getState().modalOpen || isTypingTarget(e.target)) return;
            if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
            const tools = useStageTools.getState();
            const key = e.key.toLowerCase();
            if (key === 'l') {
                tools.toggleSpotlight();
            } else if (key === 'k') {
                if (e.shiftKey && tools.pen) tools.cyclePenColor();
                else tools.togglePen();
            } else if (e.key === 'Escape' && (tools.spotlight || tools.pen)) {
                tools.allOff();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);
};
