import { C } from '../../sims/kit/palette';
import type { LabelSpec } from '../shared/Label3D';
import { BLADDER, GLAND_P, GLAND_S, HYPOXIA_POS, SIALIN_POS } from './anatomy';

/*
 * Rótulos 3D de cada etapa (âncora no mundo + deslocamento da caixa em px). Sempre `big`: texto de
 * 17 px e subtítulo de 14 px, legíveis no projetor.
 */

type P3 = [number, number, number];
const L = (id: string, text: string, sub: string | undefined, color: string, at: P3, dx: number, dy: number): LabelSpec =>
    ({ id, text, sub, color, at, dx, dy, big: true });

export const labelsForStep = (step: number): LabelSpec[] => {
    switch (step) {
        case 0:
            return [
                L('copo', 'Suco de beterraba', 'nitrato inorgânico, NO₃⁻', C.nitrate, [-8.9, 11.6, 0], -10, -52),
                L('boca', 'Boca e língua', 'só passa: nada acontece ainda', C.placebo, [-2.6, 10.8, 0], 100, -75),
                L('gla', 'Glândulas salivares', 'a volta vem depois', C.placebo, [GLAND_P.pos[0] + 0.6, GLAND_P.pos[1] - 0.2, 0], 130, 50),
                L('est', 'Estômago', undefined, C.placebo, [-1.35, -0.2, 0], -150, -20),
                L('int', 'Intestino delgado', undefined, C.placebo, [1.2, -6.2, 0], 130, -5),
                L('vas', 'Plasma e vasos', 'o sangue leva o nitrato', C.placebo, [3.7, -1.5, -0.9], 130, 40),
                L('rim', 'Rim', undefined, C.placebo, [2.9, 2.4, 0], 120, -40),
                L('mus', 'Músculo da coxa', 'o destino', C.placebo, [-10.2, -4.4, 0], -55, -65),
            ];
        case 1:
            return [
                L('int', 'Intestino delgado', 'o nitrato atravessa a parede', C.nitrate, [-2.6, -4.1, 0], -60, -90),
                L('pla', 'Nitrato no plasma', 'pico em 1–2 h', C.nitrate, [3.7, -2.0, -0.9], 60, -70),
            ];
        case 2:
            return [
                L('sia', 'Sialina', 'cotransportador 2 NO₃⁻/H⁺', C.nitrateSoft, [SIALIN_POS[0], SIALIN_POS[1], SIALIN_POS[2] + 0.55], 50, 80),
                L('par', 'Parótida', undefined, C.placebo, [GLAND_P.pos[0] + 0.6, GLAND_P.pos[1] + 0.9, 0], 130, -20),
                L('sub', 'Submandibular', undefined, C.placebo, [GLAND_S.pos[0] - 0.3, GLAND_S.pos[1] - 0.5, 0], -120, 50),
                L('sal', 'Saliva ≈ 11× o plasma', 'após a carga (≈ 5× no basal)', C.nitrate, [0.2, 10.5, 0], -60, -80),
            ];
        case 3:
            return [
                L('bac', 'Bactérias redutoras', 'Veillonella · Actinomyces · Rothia', C.bacteria, [-1.25, 10.35, 0.5], -70, -110),
                L('red', 'NO₃⁻ → NO₂⁻', 'nitrato reduzido a nitrito', C.nitrite, [-1.0, 10.75, 0], 90, -100),
            ];
        case 4:
            return [
                L('esf', 'Esôfago', 'só trânsito', C.placebo, [0.35, 3.9, 0], -110, 0),
                L('nit', 'Nitrito da saliva', 'engolido', C.nitrite, [0.25, 3.0, 0], 120, -30),
                L('aci', 'pH < 2', 'ácido gástrico', C.hypoxia, [-1.2, 0.2, 0.4], -150, 20),
                L('no', 'NO gasoso', '14,8 → 89,4 ppm em 60 min', C.no, [-0.4, -0.7, 0.4], 150, 80),
            ];
        case 5:
            return [
                L('nit', 'Nitrito no plasma', 'pico em 2–3 h', C.nitrite, [3.7, 1.0, -0.9], 80, -60),
                L('mus', 'Nitrato no músculo', 'pico em 3 h · ~4× o plasma', C.nitrate, [-7.2, -4.8, 0.4], -10, -80),
            ];
        case 6:
            return [
                L('hip', 'Onde falta O₂', 'o nitrito vira NO · detalhe no modelo vaso-hipoxia', C.hypoxia, [HYPOXIA_POS[0], HYPOXIA_POS[1], HYPOXIA_POS[2]], 0, -105),
                L('cap', 'Capilares', 'NO dilata o vaso', C.no, [-5.4, -6.2, -0.4], 60, 95),
                L('est', 'Estoque de nitrato', 'consumido pelo exercício', C.nitrate, [-10.4, -5.5, 0], 20, 95),
            ];
        default:
            return [
                L('rim', 'Rim', '~60% da dose na urina em 48 h', C.nitrate, [2.9, 2.4, 0], 130, 40),
                L('ure', 'Ureter', undefined, C.placebo, [2.9, -2.2, -0.3], 120, 0),
                L('bex', 'Bexiga', 'meia-vida do nitrato ~5 h', C.nitrate, [BLADDER.pos[0], BLADDER.pos[1], BLADDER.pos[2]], 130, 0),
            ];
    }
};
