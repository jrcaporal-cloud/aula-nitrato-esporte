import { create } from 'zustand';
import { C } from '../../sims/kit/palette';

/** Cores da caneta laser: vermelho (risco/atenção) e verde (NO), da linguagem de cor da aula. */
export const PEN_COLORS = [
    { id: 'vermelha', label: 'vermelha', hex: C.risk },
    { id: 'verde', label: 'verde', hex: C.no },
] as const;

export type PenColorId = (typeof PEN_COLORS)[number]['id'];

interface StageToolsState {
    /** Holofote (L): escurece tudo menos um círculo em volta do mouse. */
    spotlight: boolean;
    /** Clique fixa o holofote no lugar; outro clique solta. */
    spotlightPinned: boolean;
    /** Caneta laser (K): traço brilhante que se apaga sozinho. */
    pen: boolean;
    penColor: PenColorId;
    toggleSpotlight: () => void;
    togglePinned: () => void;
    togglePen: () => void;
    cyclePenColor: () => void;
    setPenColor: (color: PenColorId) => void;
    allOff: () => void;
}

export const useStageTools = create<StageToolsState>(set => ({
    spotlight: false,
    spotlightPinned: false,
    pen: false,
    penColor: 'vermelha',
    toggleSpotlight: () => set(s => ({ spotlight: !s.spotlight, spotlightPinned: false })),
    togglePinned: () => set(s => ({ spotlightPinned: !s.spotlightPinned })),
    togglePen: () => set(s => ({ pen: !s.pen })),
    cyclePenColor: () => set(s => ({ penColor: s.penColor === 'vermelha' ? 'verde' : 'vermelha' })),
    setPenColor: penColor => set({ penColor }),
    allOff: () => set({ spotlight: false, spotlightPinned: false, pen: false }),
}));

export const penHex = (id: PenColorId) => PEN_COLORS.find(c => c.id === id)?.hex ?? C.risk;
