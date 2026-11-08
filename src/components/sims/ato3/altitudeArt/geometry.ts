/** Geometria da serra e da régua de altitude (compartilhada pelas cenas do slide 27). */

export const RIDGE: readonly (readonly [number, number])[] = [
    [-40, 384], [120, 352], [300, 310], [440, 282], [560, 262], [660, 236], [760, 215], [840, 232], [940, 258], [1040, 290], [1140, 320],
];

/** Altura (y) da serra principal numa posição x. */
export const ridgeY = (x: number): number => {
    for (let i = 1; i < RIDGE.length; i++) {
        const [x1, y1] = RIDGE[i - 1];
        const [x2, y2] = RIDGE[i];
        if (x <= x2) return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
    }
    return RIDGE[RIDGE.length - 1][1];
};

/** Metros → y na régua da esquerda (nível do mar em 350). */
export const altY = (m: number): number => 350 - m * 0.0505;
