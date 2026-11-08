import { useState } from 'react';

interface Override { step: number; value: number }

/**
 * Valor de um controle (slider) que o passador define em cada passo e o mouse pode sobrescrever.
 * A mudança manual vale só dentro do passo em que foi feita: ao trocar de passo, volta o valor do roteiro.
 */
export const useStepValue = (step: number, planned: number): [number, (value: number) => void, boolean] => {
    const [override, setOverride] = useState<Override | null>(null);
    const active = override !== null && override.step === step;
    return [active ? override.value : planned, (value: number) => setOverride({ step, value }), active];
};

/** Limita um número ao intervalo [lo, hi]. */
export const clamp = (n: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, n));

/** Posição normalizada (0…1) de `v` entre `a` e `b`; funciona com a > b (eixos invertidos). */
export const norm = (v: number, a: number, b: number): number => (v - a) / (b - a);
