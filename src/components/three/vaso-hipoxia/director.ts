import { C } from '../../sims/kit/palette';
import type { LabelSpec } from '../shared/Label3D';
import type { StructureId } from './content';
import { CAP_Y, FIB_Y, MB_SITES, MITOCHONDRIA, NOS_SITES, SLOW_FIB_Y, XOR_SITES, type Vec3 } from './layout';

/*
 * Câmera e rótulos 3D de cada etapa, e o close-up de cada estrutura clicável.
 * Os números dos rótulos são os mesmos de `content.ts` (HUANG2005, MODIN2001, SHIVA2007, FERGUSON2015).
 */

export interface Pose { pos: Vec3; tgt: Vec3 }

export const STEP_POSES: readonly Pose[] = [
    { pos: [-0.6, 6.2, 21.5], tgt: [-1.0, 0.9, 0] },
    { pos: [0.4, 5.6, 18], tgt: [0.4, 1.6, 0] },
    { pos: [-0.6, 5.0, 13.6], tgt: [-0.4, 2.85, 0] },
    { pos: [1.0, 5.0, 16.5], tgt: [1.0, 1.6, 0] },
    { pos: [0.8, 2.6, 15.5], tgt: [0.6, -0.2, 0] },
    { pos: [-3.2, 7.5, 32], tgt: [-3.2, -2.0, 0] },
];

const lab = (id: string, text: string, sub: string, color: string, at: Vec3, dx: number, dy: number): LabelSpec =>
    ({ id, text, sub, color, at: [...at], dx, dy, big: true });

/** O ponto da lista mais perto de um alvo (os rótulos não dependem do sorteio das posições). */
const nearest = (list: readonly Vec3[], target: Vec3): Vec3 =>
    list.reduce((best, p) => (Math.hypot(p[0] - target[0], p[1] - target[1], p[2] - target[2]) < Math.hypot(best[0] - target[0], best[1] - target[1], best[2] - target[2]) ? p : best));

const nos = NOS_SITES[2];
const mito = nearest(MITOCHONDRIA.map(m => m.p), [-2.5, FIB_Y + 0.7, 0.3]);
const mb = nearest(MB_SITES, [3.0, FIB_Y + 0.5, 0.3]);
const xor = XOR_SITES[2];

export const STEP_LABELS: readonly (readonly LabelSpec[])[] = [
    [
        lab('nos', 'NOS endotelial', 'faz NO com O₂ de sobra', C.o2, NOS_SITES[3], 40, 70),
        lab('nit', 'Nitrito', 'quase inerte', C.nitrite, [2.4, CAP_Y + 0.15, 0.3], 60, -62),
        lab('cap', 'Capilar', 'hemoglobina bem saturada', '#E7A3B8', [-4.6, CAP_Y + 0.9, 0], -30, -60),
        lab('fib', 'Fibra muscular', 'corte longitudinal', '#C7D2FE', [3.5, FIB_Y - 1.5, 1.2], 40, 56),
    ],
    [
        lab('hb', 'Hemoglobina desoxi', 'eritrócito escuro', '#B8607A', [-3.6, CAP_Y + 0.1, 0.3], -10, -58),
        lab('nit', 'Nitrito', 'ainda parado', C.nitrite, [3.0, CAP_Y - 0.1, 0.3], 20, -58),
        lab('nos', 'NOS apagando', 'falta O₂, seu substrato', C.o2, nos, -30, 80),
    ],
    [
        lab('hb', 'Desoxi-Hb acesa', 'redutase do nitrito', C.no, [-1.4, CAP_Y + 0.05, 0.3], -40, -66),
        lab('band', 'Taxa máxima', '40–60% de saturação', C.nitrite, [2.6, CAP_Y - 0.1, 0.3], 20, -66),
        // Para a direita: em 1280×720 o gráfico do canto inferior esquerdo cobria o rótulo.
        lab('no', 'NO', 'sai do eritrócito', C.noSoft, [-3.0, CAP_Y - 0.9, 0.4], 170, 40),
    ],
    [
        lab('ec', 'EC₅₀ do nitrito', '200 → 40 µM (pH 7,4 → 6,6)', C.nitrite, [-2.6, CAP_Y + 0.8, 0], 20, -56),
        lab('h', 'H⁺', 'meio ácido', C.hypoxia, [3.6, CAP_Y - 0.1, 0.3], 30, -58),
        lab('no', 'Mais NO', 'mesmo nitrito, mais rendimento', C.no, [0.0, CAP_Y - 1.1, 0.4], -40, 64),
    ],
    [
        lab('mb', 'Desoxi-mioglobina', 'redutase ~36× mais rápida', C.no, mb, 30, -70),
        lab('xor', 'XOR', 'só em hipóxia', C.hypoxia, xor, 40, 80),
        lab('mito', 'Mitocôndria', 'o NO freia a respiração', '#C9B79C', mito, -20, -62),
    ],
    [
        lab('art', 'Arteríola', 'relaxa com o NO', C.no, [-8.6, CAP_Y - 0.9, 0.4], -30, 34),
        lab('fast', 'Fibra rápida', 'PO₂ 14 → 19 mmHg', '#C7D2FE', [-5.4, FIB_Y + 0.2, 1.0], -40, 30),
        lab('slow', 'Fibra lenta', 'PO₂ sem mudança', '#A5B4FC', [-5.4, SLOW_FIB_Y, 1.0], -40, -4),
    ],
];

/** Close-up olhando para um ponto, a partir da frente e um pouco de cima. */
const near = (p: Vec3, back = 6, up = 1.1, side = 0.6): Pose => ({ pos: [p[0] + side, p[1] + up, p[2] + back], tgt: p });

export const STRUCTURE_POSES: Readonly<Record<StructureId, Pose>> = {
    capilar: near([0, CAP_Y, 0], 8, 1.4),
    hemacia: near([0, CAP_Y, 0], 6.5, 1.0),
    nos: near(nos, 5.5),
    arteriola: near([-8.6, CAP_Y, 0], 8.5, 1.5),
    fibra: near([0.5, FIB_Y, 0], 16, 2.6),
    mioglobina: near(mb, 5.5),
    mitocondria: near(mito, 5.5),
    xor: near(xor, 5.5),
    'fibra-lenta': near([0.5, SLOW_FIB_Y, 0], 11, 2),
};
