/** Poses de corrida em coordenadas locais (origem = quadril), usadas pelo `Runner`. */

export type P = readonly [number, number];

/** Pose de corrida em coordenadas locais (origem = quadril): tronco, braços e pernas à frente e atrás. */
export interface Pose {
    neck: P; head: P; shoulder: P;
    armF: readonly [P, P]; armB: readonly [P, P];
    legF: readonly [P, P]; legB: readonly [P, P];
}

export const SPRINT: Pose = {
    neck: [21, -29], head: [28, -39], shoulder: [19, -26],
    armF: [[40, -16], [50, -30]], armB: [[2, -17], [-14, -8]],
    legF: [[30, 10], [26, 36]], legB: [[-18, 17], [-44, 22]],
};

export const JOG: Pose = {
    neck: [8, -33], head: [10, -44], shoulder: [7, -29],
    armF: [[22, -20], [30, -28]], armB: [[-8, -21], [-17, -13]],
    legF: [[16, 13], [13, 36]], legB: [[-9, 17], [-24, 31]],
};
