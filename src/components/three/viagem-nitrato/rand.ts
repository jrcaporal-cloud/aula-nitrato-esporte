import { rng } from '../shared/math';

/**
 * Gerador determinístico "aquecido": o LCG de `rng` devolve valores minúsculos e correlacionados nas
 * primeiras chamadas quando a semente é pequena, o que enviesaria a espécie e a posição dos primeiros íons.
 */
export const srand = (seed: number): (() => number) => {
    const r = rng(seed * 7919 + 104729);
    for (let i = 0; i < 16; i++) r();
    return r;
};
