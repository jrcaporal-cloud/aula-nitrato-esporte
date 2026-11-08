import { clamp01, rng, smooth } from '../shared/math';

/*
 * Geometria da cena (unidades do mundo, escala esquemática). Tudo corre ao longo de x e o sangue vai
 * de -x (arteriola) para +x. O capilar fica acima da fibra rápida; a fibra lenta e o capilar dela
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
/** Onde o vaso começa a afunilar (arteríola → capilar). */
export const TAPER_X0 = CAP_X0 - 1.8;
/** Para onde seguem as faíscas de NO que vão relaxar a arteríola (faixa de músculo liso). */
export const ART_TARGET: Vec3 = [-8.6, CAP_Y + 1.25, 0.5];

export const FIB_Y = -0.75;
export const FIB_R = 2.0;
export const FIB_X0 = -6.2;
export const FIB_X1 = 6.8;
/** Comprimento de um sarcômero (escala esquemática). */
export const SARC = 0.56;

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
/** O capilar também abre um pouco com o NO (esquemático, para a dilatação aparecer em qualquer plano). */
export const capR = (dil: number) => CAP_R * (0.86 + 0.26 * dil);

/** Raio do tubo em x: arteríola larga, afunilando até o capilar (mesma conta do vertex shader). */
export const tubeR = (x: number, dil: number) => {
    const k = smooth(clamp01((x - TAPER_X0) / (CAP_X0 - TAPER_X0)));
    return artR(dil) * (1 - k) + capR(dil) * k;
};

/** Ponto na parede do vaso: `phi` é o ângulo a partir do fundo (0 = parede de trás, π/2 = em cima). */
export const wallPoint = (x: number, phi: number, inset: number, dil: number): Vec3 => {
    const r = tubeR(x, dil) - inset;
    return [x, CAP_Y + Math.sin(phi) * r, -Math.cos(phi) * r];
};

/* ---------- Posições fixas, geradas uma vez (determinísticas) ---------- */

export interface NosSpec { x: number; phi: number }

/** Sítios da NOS na parede de trás do capilar. */
export const NOS_SPECS: readonly NosSpec[] = [-5.2, -3.6, -2.0, -0.4, 1.2, 2.8, 4.4, 6.0]
    .map((x, i) => ({ x, phi: [-0.55, 0.35, -0.2, 0.6, -0.45, 0.25, -0.1, 0.5][i] }));

const REST_DIL = 0.6;
/** Posições de repouso (âncoras dos rótulos); a cena segue a parede com `nosPoint`. */
export const NOS_SITES: readonly Vec3[] = NOS_SPECS.map(s => wallPoint(s.x, s.phi, 0.05, REST_DIL));
export const nosPoint = (i: number, dil: number): Vec3 => wallPoint(NOS_SPECS[i].x, NOS_SPECS[i].phi, 0.05, dil);

/** Sítios da XOR no sarcoplasma (parte aberta da fibra, onde dá para ver o anel). */
export const XOR_SITES: readonly Vec3[] = [-4.2, -1.4, 1.8, 4.6]
    .map((x, i) => [x, FIB_Y + [0.95, -0.55, 0.45, -0.95][i], 0.3] as Vec3);

export interface Mito { p: Vec3; s: number; rot: number }

/** Mitocôndrias: fileiras intermiofibrilares (junto das linhas Z) e um cacho sob o sarcolema. */
const makeMito = (cy: number, r: number, rowStep: number, rows: number, count: number, seed: number, x0: number, x1: number): Mito[] => {
    const rand = rng(seed);
    const nz = Math.floor((x1 - x0 - 0.8) / SARC);
    const inner = Array.from({ length: count }, () => {
        const row = Math.floor(rand() * rows) - Math.floor(rows / 2);
        const x = x0 + 0.4 + Math.floor(rand() * nz) * SARC + (rand() - 0.5) * 0.12;
        return { p: [x, cy + (row + 0.5) * rowStep, -0.1 - rand() * 0.1] as Vec3, s: 0.8 + rand() * 0.45, rot: (rand() - 0.5) * 0.5 };
    });
    const rim = Array.from({ length: 8 }, (_, i) => {
        const side = i % 2 ? 1 : -1;
        return { p: [x0 + 0.8 + (i / 8) * (x1 - x0 - 1.6) + (rand() - 0.5) * 0.4, cy + side * (r - 0.34), -0.12 - rand() * 0.25] as Vec3, s: 1.15 + rand() * 0.4, rot: (rand() - 0.5) * 0.4 };
    });
    return [...inner, ...rim];
};

export const MITOCHONDRIA: readonly Mito[] = makeMito(FIB_Y, FIB_R, 0.6, 6, 18, 21, FIB_X0, FIB_X1);
export const SLOW_MITO: readonly Mito[] = makeMito(SLOW_FIB_Y, SLOW_FIB_R, 0.5, 5, 18, 23, FIB_X0, FIB_X1);

export interface Nucleus { p: Vec3; len: number }

/** Núcleos periféricos (sob o sarcolema), alongados no eixo da fibra. */
export const NUCLEI: readonly Nucleus[] = [
    { p: [-3.6, FIB_Y + 1.58, -0.3], len: 1.25 }, { p: [1.9, FIB_Y + 1.62, -0.25], len: 1.1 },
    { p: [-1.0, FIB_Y - 1.6, -0.3], len: 1.2 }, { p: [4.3, FIB_Y - 1.58, -0.3], len: 1.15 },
];
export const SLOW_NUCLEI: readonly Nucleus[] = [
    { p: [-2.4, SLOW_FIB_Y + 0.98, -0.2], len: 1.0 }, { p: [3.2, SLOW_FIB_Y - 0.98, -0.2], len: 1.0 },
];

/** Mioglobina: pontos soltos no sarcoplasma, junto das mitocôndrias (parte aberta, para aparecer). */
export const MB_SITES: readonly Vec3[] = (() => {
    const r = rng(33);
    return Array.from({ length: 36 }, () => {
        const phi = r() * Math.PI * 2;
        const rad = Math.sqrt(r()) * (FIB_R - 0.55);
        return [FIB_X0 + 0.5 + r() * (FIB_X1 - FIB_X0 - 1), FIB_Y + Math.sin(phi) * rad, 0.05 + r() * 0.5] as Vec3;
    });
})();

/** H⁺ da fibra: pontos de origem; ficam balançando em volta deles. */
export const H_FIBER_HOME: readonly Vec3[] = (() => {
    const r = rng(47);
    return Array.from({ length: 36 }, () => {
        const phi = r() * Math.PI * 2;
        const rad = Math.sqrt(r()) * (FIB_R - 0.35);
        return [FIB_X0 + 0.4 + r() * (FIB_X1 - FIB_X0 - 0.8), FIB_Y + Math.sin(phi) * rad, -0.1 + r() * 0.9] as Vec3;
    });
})();

/** Miofibrilas: grade hexagonal na metade de trás da fibra (a da frente é o palco do sarcoplasma). */
const makeFibrils = (cy: number, r: number, step: number, layers: number, half: number): { y: number; z: number }[] => {
    const out: { y: number; z: number }[] = [];
    for (let i = -half; i <= half; i++) {
        for (let j = 0; j < layers; j++) {
            const y = cy + (i + (j % 2 ? 0.5 : 0)) * step;
            const z = -0.35 - j * step * 0.866;
            if (Math.hypot(y - cy, z) < r - 0.4) out.push({ y, z });
        }
    }
    return out;
};

export const MYOFIBRILS = makeFibrils(FIB_Y, FIB_R, 0.6, 4, 4);
export const SLOW_MYOFIBRILS = makeFibrils(SLOW_FIB_Y, SLOW_FIB_R, 0.5, 3, 2);
