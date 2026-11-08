/** Posição x (em unidades do viewBox) de um valor, para linhas de referência e chaves. */
export const barX = (value: number, x: number, labelW: number, barW: number, max: number): number =>
    x + labelW + (value / max) * barW;
