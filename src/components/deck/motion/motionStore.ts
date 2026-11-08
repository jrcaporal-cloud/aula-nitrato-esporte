import { create } from 'zustand';

/** Ponto da tela (relativo ao deck) onde o íon pousa enquanto o cartão de ato está aberto. */
export interface IonStop {
    x: number;
    y: number;
    size: number;
}

interface MotionState {
    /** Nó do ato atual na trilha do cartão de abertura; null = o íon segue o slide. */
    ionStop: IonStop | null;
    setIonStop: (stop: IonStop | null) => void;
}

export const useMotionStore = create<MotionState>(set => ({
    ionStop: null,
    setIonStop: ionStop => set({ ionStop }),
}));
