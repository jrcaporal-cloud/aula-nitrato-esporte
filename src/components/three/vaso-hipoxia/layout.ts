import { clamp01, rng, smooth } from '../shared/math';

/*
 * Geometria da cena (unidades do mundo, escala esquemática). Tudo corre ao longo de x e o sangue vai
 * de -x (arteríola) para +x. O capilar fica acima da fibra rápida; a fibra lenta e o capilar dela
 * aparecem só na última etapa, mais abaixo. O corte tira a fatia da frente (+z) de cada tubo.
 */

export type Vec3 = readonly [number, number, number];

export const CAP_Y = 3.0;
export const CAP_R = 0.9;
export const CAP_X0 = -6.6;
export const CAP_X1 = 7.2;

export const ART_X0 = -11;
export const ART_R0 = 1.0;
export const ART_R1 = 1.5;
/** Faixas de músculo liso da arteríola (o NO as relaxa). */
export const ART_BANDS: readonly number[] = [-10.4, -9.5, -8.6, -7.7, -6.9];
/** Para onde seguem as faíscas de NO que vão relaxar a arteríola. */
export const ART_TARGET: Vec3 = [-8.2, CAP_Y + 0.9, 0.2];

export const FIB_Y = -0.75;
export const FIB_R = 2.0;
export const FIB_X0 = -6.2;
export const FIB_X1 = 6.8;

export const SLOW_FIB_Y = -4.3;
export const SLOW_FIB_R = 1.3;
export const SLOW_CAP_Y = -6.6;
export const SLOW_CAP_R = 0.58;

/** Meia-abertura (rad) do corte da frente em cada tubo. */
export const WEDGE_CAP = 0.95;
export const WEDGE_FIB = 1.05;

/** Percurso do sangue na fibra rápida: da ponta da arteríola ao fim do capilar. */
export const PATH_X0 = ART_X0;
export const PATH_L = CAP_X1 - ART_X0;

export const artR = (dil: number) => ART_R0 + (ART_R1 - ART_R0) * dil;

/** Raio do tubo em x: arteríola larga, afunilando até o capilar. */
export const tubeR = (x: number, dil: number) => {
    const k = smooth(clamp01((x - (CAP_X0 - 1.8)) / 1.8));
    return artR(dil) * (1 - k) + CAP_R * k;
};

/* ---------- Posições fixas, geradas uma vez (determinísticas) ---------- */

/** Ponto na parede de trás de um tubo (visto através do corte), em y/z relativos ao eixo. */
const backWall = (x: number, cy: number, r: number, phi: number): Vec3 =>
    [x, cy + Math.sin(phi) * r, -Math.cos(phi) * r];

/** Sítios da NOS na parede de trás do capilar. */
export const NOS_SITES: readonly Vec3[] = [-5.2, -3.6, -2.0, -0.4, 1.2, 2.8, 4.4, 6.0]
    .map((x, i) => backWall(x, CAP_Y, CAP_R * 0.94, [-0.55, 0.35, -0.2, 0.6, -0.45, 0.25, -0.1, 0.5][i]));

/** Sítios da XOR na parede de trás da fibra. */
export const XOR_SITES: readonly Vec3[] = [-4.2, -1.4, 1.8, 4.6]
    .map((x, i) => backWall(x, FIB_Y, FIB_R - 0.18, [0.5, -0.45, 0.2, -0.6][i]));

export interface Mito { p: Vec3; s: number; rot: number }

/** Mitocôndrias no sarcoplasma: entre as miofibrilas, perto da abertura. */
export const MITOCHONDRIA: readonly Mito[] = (() => {
    const r = rng(21);
    return Array.from({ length: 11 }, (_, i) => {
        const phi = (r() - 0.5) * 2.0;
        const rad = 0.5 + r() * 1.0;
        return {
            p: [-5.4 + i * 1.12 + (r() - 0.5) * 0.5, FIB_Y + Math.sin(phi) * rad, -0.25 + Math.cos(phi) * rad * 0.35] as Vec3,
            s: 0.8 + r() * 0.5,
            rot: r() * Math.PI,
        };
    });
})();

/** Mioglobina: pontos soltos no sarcoplasma, junto das mitocôndrias. */
export const MB_SITES: readonly Vec3[] = (() => {
    const r = rng(33);
    return Array.from({ length: 36 }, () => {
        const phi = r() * Math.PI * 2;
        const rad = Math.sqrt(r()) * (FIB_R - 0.55);
        return [FIB_X0 + 0.5 + r() * (FIB_X1 - FIB_X0 - 1), FIB_Y + Math.sin(phi) * rad, Math.cos(phi) * rad * 0.5] as Vec3;
    });
})();

/** H⁺ da fibra: pontos de origem; ficam balançando em volta deles. */
export const H_FIBER_HOME: readonly Vec3[] = (() => {
    const r = rng(47);
    return Array.from({ length: 36 }, () => {
        const phi = r() * Math.PI * 2;
        const rad = Math.sqrt(r()) * (FIB_R - 0.35);
        return [FIB_X0 + 0.4 + r() * (FIB_X1 - FIB_X0 - 0.8), FIB_Y + Math.sin(phi) * rad, Math.cos(phi) * rad * 0.7] as Vec3;
    });
})();

/** Miofibrilas: grade hexagonal na metade de trás da fibra (a da frente é o palco do sarcoplasma). */
export const MYOFIBRILS: readonly { y: number; z: number }[] = (() => {
    const out: { y: number; z: number }[] = [];
    const step = 0.6;
    for (let i = -4; i <= 4; i++) {
        for (let j = 0; j <= 3; j++) {
            const y = FIB_Y + (i + (j % 2 ? 0.5 : 0)) * step;
            const z = -0.35 - j * step * 0.866;
            if (Math.hypot(y - FIB_Y, z) < FIB_R - 0.4) out.push({ y, z });
        }
    }
    return out;
})();

export const SLOW_MYOFIBRILS: readonly { y: number; z: number }[] = [-0.7, -0.2, 0.3, 0.8].flatMap((dy, j) =>
    [0, 1].map(k => ({ y: SLOW_FIB_Y + dy * 0.9, z: -0.3 - k * 0.45 - (j % 2) * 0.1 })));
