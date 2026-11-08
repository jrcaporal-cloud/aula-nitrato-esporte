import { useCallback, useState, type RefObject } from 'react';
import { measureArt, type ArtRect } from './measureArt';

interface MorphState {
    /** Modelo aberto (nome do arquivo em `three/models/`), ou null. */
    name: string | null;
    /** Retângulo da arte: de onde a cena nasce e para onde volta ao fechar. */
    from: ArtRect | null;
}

const CLOSED: MorphState = { name: null, from: null };

/**
 * Estado do modelo 3D aberto pela tecla 3. Mede a arte do slide ao abrir e de novo ao fechar
 * (a janela pode ter mudado de tamanho), para que a cena volte exatamente para o desenho.
 */
export const useMorph3D = (rootRef: RefObject<HTMLElement | null>, index: number) => {
    const [state, setState] = useState<MorphState>(CLOSED);

    const open = useCallback((name: string | null) => {
        if (!name) return;
        setState({ name, from: measureArt(rootRef.current, index) });
    }, [rootRef, index]);

    const close = useCallback(() => {
        const from = measureArt(rootRef.current, index);
        setState(s => (s.name ? { name: null, from } : s));
    }, [rootRef, index]);

    /** Depois que a cena encolheu e saiu: o foco não fica preso no botão que abriu o 3D. */
    const onExitComplete = useCallback(() => {
        const active = document.activeElement;
        if (active instanceof HTMLElement && active !== document.body && rootRef.current?.contains(active)) active.blur();
    }, [rootRef]);

    return { name: state.name, from: state.from, open, close, onExitComplete };
};
