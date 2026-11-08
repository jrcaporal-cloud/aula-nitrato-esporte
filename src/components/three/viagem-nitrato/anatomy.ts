import * as THREE from 'three';
import { pipe, radiusProfile, makeCurve, type Organ } from './tubes';

/*
 * Geografia da cena: corte esquemático de um atleta sentado, de perfil, olhando para a esquerda
 * (plano z = 0; a câmera olha de +z). Cabeça e tronco em corte, uma coxa à esquerda.
 * Órgãos em z ≈ 0; vasos um pouco atrás (z = −0.9), para não cruzar o esôfago na projeção.
 * Escalas fora de proporção: o objetivo é o circuito, não a anatomia métrica.
 */

export type V3 = readonly [number, number, number];

/** Silhueta fechada (x, y), sentido anti-horário a partir do alto da cabeça. */
export const OUTLINE: readonly (readonly [number, number])[] = [
    [0.2, 16.6], [-1.8, 16.2], [-3.1, 15.2], [-3.8, 14.0], [-4.0, 13.2], [-4.6, 12.7], [-5.4, 12.0], [-4.5, 11.6],
    [-4.6, 11.2], [-4.2, 10.6], [-3.8, 10.3], [-4.2, 9.9], [-4.5, 9.4], [-4.1, 8.8], [-4.5, 8.0], [-3.5, 7.3],
    [-2.4, 6.8], [-2.3, 5.8], [-3.0, 4.4], [-3.6, 2.0], [-3.9, -0.8], [-3.9, -2.5], [-4.8, -3.3],
    [-6.6, -3.5], [-9.6, -3.9], [-11.6, -4.5], [-12.3, -5.7], [-11.7, -7.0], [-9.0, -7.5], [-5.5, -7.6], [-2.0, -7.9],
    [2.4, -8.0], [4.0, -7.4], [4.7, -5.8], [4.7, -3.0], [4.4, 0.5], [4.1, 4.0], [3.6, 6.5], [3.1, 8.0],
    [4.0, 10.4], [4.5, 12.6], [3.6, 15.1], [2.2, 16.2],
];

/** Cavidade da boca: palato (teto) e posições dos dentes. */
export const PALATE: readonly V3[] = [[-4.05, 11.0, 0], [-3.2, 11.05, 0], [-2.2, 11.1, 0], [-1.3, 11.1, 0], [-0.6, 10.9, 0], [-0.2, 10.5, 0]];
export const TEETH: readonly V3[] = [[-3.95, 10.8, 0], [-3.9, 9.75, 0]];

/** Língua: eixo da ponta à raiz; o dorso posterior (u ≈ 0,5–0,85) é onde moram as bactérias. */
export const TONGUE: Organ = {
    curve: makeCurve([[-3.3, 9.55, 0], [-2.5, 9.7, 0], [-1.6, 9.65, 0], [-0.9, 9.35, 0], [-0.5, 8.95, 0]]),
    radius: u => radiusProfile([0.3, 0.58, 0.7, 0.64, 0.48])(u) * Math.sqrt(Math.min(u / 0.07, 1)),
};
export const TONGUE_Z = 1.3;
export const BACTERIA_U: readonly [number, number] = [0.5, 0.86];

/** Trajeto das gotas por cima da língua, dos lábios à faringe. */
export const ORAL_SURFACE: Organ = pipe([[-4.0, 10.45, 0], [-3.5, 10.55, 0], [-2.8, 10.7, 0], [-2.0, 10.78, 0], [-1.35, 10.6, 0], [-0.8, 10.15, 0], [-0.4, 9.6, 0], [-0.3, 9.35, 0]], 0.1);
export const POUR_ARC: Organ = pipe([[-8.1, 11.6, 0], [-7.0, 12.2, 0], [-5.8, 11.7, 0], [-4.8, 10.9, 0], [-4.3, 10.5, 0]], 0.1);
export const GLASS_POS: V3 = [-8.9, 10.2, 0];

/** Esôfago e estômago contínuos: um só tubo do pescoço ao piloro. */
export const ESOPHAGUS: Organ = pipe([[-0.3, 9.4, 0], [0.15, 8.3, 0], [0.4, 6.8, 0], [0.4, 5.0, 0], [0.3, 3.6, 0], [0.25, 2.75, 0]], 0.34);
const stomachKeys = radiusProfile([0.5, 0.85, 1.1, 1.25, 1.1, 0.8, 0.5, 0.36]);
export const STOMACH: Organ = {
    curve: makeCurve([[-0.4, 3.3, 0], [-0.45, 2.4, 0], [-0.9, 1.0, 0], [-1.35, -0.4, 0], [-1.0, -1.6, 0], [0.2, -2.2, 0], [1.3, -1.75, 0], [1.85, -0.9, 0]]),
    radius: u => stomachKeys(u) * Math.sqrt(Math.min(u / 0.08, 1)),
};
/** Trajeto interno (não desenhado): sai do esôfago e acompanha o eixo do estômago até o piloro. */
export const STOMACH_PATH: Organ = {
    curve: makeCurve([[0.25, 2.75, 0], [-0.35, 1.9, 0], [-0.9, 0.8, 0], [-1.25, -0.4, 0], [-0.95, -1.5, 0], [0.2, -2.1, 0], [1.3, -1.7, 0], [1.85, -0.9, 0]]),
    radius: u => 0.5 + 0.5 * Math.sin(Math.PI * Math.min(u * 1.1, 1)),
};

/** Intestino delgado: duodeno e quatro passadas em serpentina. */
export const GUT: Organ = pipe([
    [1.85, -0.9, 0], [2.1, -1.7, 0.05], [1.7, -2.7, 0.1], [0.9, -3.4, 0], [0, -3.9, 0.1], [-1.6, -3.9, 0], [-2.6, -4.1, 0], [-2.9, -4.7, 0.1],
    [-2.1, -4.95, 0], [-0.6, -4.85, 0.1], [0.9, -4.85, 0], [1.6, -5.1, 0.1], [1.7, -5.6, 0], [1.0, -5.8, 0], [-0.5, -5.7, 0.1], [-2.0, -5.75, 0],
    [-2.6, -6.15, 0.1], [-1.9, -6.5, 0], [-0.4, -6.45, 0.05], [1.0, -6.5, 0], [1.5, -6.5, 0],
], 0.27);
export const GUT_COLLECTOR: V3 = [1.8, -5.3, -0.6];

/** Vasos (z ≈ −0.9): porta → tronco pelas costas → carótida até a parótida, com ramos. */
const trunkKeys = radiusProfile([0.2, 0.28, 0.34, 0.34, 0.34, 0.32, 0.3, 0.26, 0.22, 0.2, 0.18, 0.16]);
export const TRUNK: Organ = {
    curve: makeCurve([[1.8, -5.3, -0.6], [2.7, -4.5, -0.9], [3.4, -3.9, -0.9], [3.7, -2.6, -0.9], [3.7, -0.8, -0.9], [3.7, 1.0, -0.9],
        [3.65, 3.0, -0.9], [3.5, 4.8, -0.9], [3.1, 6.2, -0.9], [2.4, 7.2, -0.9], [1.95, 8.2, -0.7], [1.75, 9.25, -0.25]]),
    radius: trunkKeys,
};
export const BRANCH_S: Organ = pipe([[2.4, 7.2, -0.9], [1.4, 7.5, -0.9], [0.2, 7.6, -0.8], [-0.9, 7.8, -0.5], [-1.6, 8.1, -0.2]], 0.15);
export const RENAL: Organ = pipe([[3.6, 1.8, -0.9], [3.2, 1.8, -0.5], [2.85, 1.8, -0.1]], 0.13);
export const FEMORAL: Organ = pipe([
    [3.7, -3.0, -0.9], [3.95, -4.2, -0.9], [4.0, -5.6, -0.9], [3.7, -6.6, -0.9], [2.9, -7.1, -0.9], [1.0, -7.15, -0.9], [-1.5, -7.0, -0.9],
    [-4, -6.9, -0.9], [-7, -6.6, -0.9], [-10, -6.2, -0.9], [-11.1, -6.0, -0.9],
], 0.3);
export const CAP_X: readonly number[] = [-3.9, -5.4, -6.9, -8.4, -9.9];
/** Capilares do músculo: sobem da femoral para dentro da fibra. */
export const CAPILLARIES: readonly Organ[] = CAP_X.map(x => pipe([[x, -6.75, -0.9], [x + 0.04, -6.2, -0.45], [x, -5.6, -0.05], [x + 0.05, -5.0, 0.2]], 0.12));

/** Glândulas salivares (elipsoides) e seus ductos até a boca. */
export const GLAND_P = { pos: [1.7, 9.9, 0] as V3, r: [0.85, 1.05, 0.55] as V3 };
export const GLAND_S = { pos: [-1.9, 8.15, 0] as V3, r: [0.75, 0.55, 0.5] as V3 };
export const DUCT_P: Organ = pipe([[1.2, 10.1, 0], [0.2, 10.5, 0], [-0.8, 10.8, 0], [-1.5, 10.95, 0]], 0.09);
export const DRIP: Organ = pipe([[-1.5, 10.95, 0], [-1.4, 10.75, 0], [-1.3, 10.55, 0]], 0.07);
export const DUCT_S: Organ = pipe([[-1.8, 8.6, 0], [-2.6, 8.8, 0.1], [-3.3, 8.95, 0.1]], 0.09);
export const TIP_LOOP: Organ = pipe([[-3.3, 8.95, 0.1], [-3.9, 9.35, 0], [-3.9, 10.0, 0], [-3.4, 10.55, 0], [-2.7, 10.7, 0]], 0.09);
/** Sialina: a catraca na entrada da parótida. */
export const SIALIN_POS: V3 = [1.75, 9.25, -0.1];

/** Rim, ureter e bexiga. */
export const KIDNEY = { pos: [2.5, 1.8, 0] as V3, r: [0.5, 1.05, 0.5] as V3, tilt: 0.18 };
export const URETER: Organ = pipe([[2.5, 1.1, -0.1], [2.7, 0, -0.2], [2.8, -1.5, -0.3], [2.9, -3.2, -0.3], [2.8, -4.6, -0.2], [2.7, -5.4, -0.1]], 0.1);
export const BLADDER = { pos: [2.7, -5.95, 0] as V3, r: 0.62 };

/** Músculo (quadríceps): fuso ao longo de x; a mancha laranja é a região com pouco O₂. */
const muscleKeys = radiusProfile([0.25, 0.7, 1.0, 1.15, 1.1, 0.95, 0.7, 0.35]);
export const MUSCLE: Organ = {
    curve: makeCurve([[-11.2, -5.35, 0], [-8.5, -5.3, 0], [-5.5, -5.35, 0], [-3.2, -5.45, 0]]),
    radius: u => muscleKeys(u) * 1.02,
};
export const HYPOXIA_POS: V3 = [-7.8, -5.3, 0.15];

/** Estruturas curvas auxiliares (desenho). */
export const outlinePoints = (n: number): THREE.Vector2[] => {
    const c = new THREE.CatmullRomCurve3(OUTLINE.map(([x, y]) => new THREE.Vector3(x, y, 0)), true, 'centripetal');
    return c.getPoints(n).map(p => new THREE.Vector2(p.x, p.y));
};
