/**
 * O íon personagem: em cada slide (por id do JSON) ele é uma das três espécies da via
 * e pousa logo depois do fim do título, na linha do título — um lugar que nunca cobre conteúdo.
 * Coordenadas no palco de 1280 px (x = centro do íon, y = centro; origem no topo do slide).
 */
export type IonSpecies = 'nitrate' | 'nitrite' | 'no';

export interface IonState {
    species: IonSpecies;
    x: number;
    y: number;
    /** Diâmetro em px do palco. */
    size: number;
    visible: boolean;
}

/** Linha do título (h2 de 2,9rem com o respiro do slide): o centro vertical fica em ~41 px. */
const TITLE_Y = 41;
const SIZE = 54;

const N: IonSpecies = 'nitrate';
const N2: IonSpecies = 'nitrite';
const NO: IonSpecies = 'no';

/**
 * [id, espécie, x]. A história: a beterraba entra como nitrato (Ato I e começo do II), vira nitrito
 * na boca (22–23), vira NO onde falta oxigênio e no músculo (24+); o músculo guarda nitrato (25).
 * Atos III–VI seguem o assunto do slide: dose, protocolo, prato e rótulo são nitrato; efeito
 * no corpo e no desempenho é NO. x = fim do título + 56 px (medido em 1280×720).
 */
const PATH: ReadonlyArray<[number, IonSpecies, number]> = [
    [10, N, 713], [11, N, 844], [12, N, 660], [13, N, 506],
    [20, N, 678], [21, N, 596], [22, N2, 751], [23, N2, 821], [24, NO, 850], [25, N, 749],
    [26, NO, 542], [27, NO, 876], [28, NO, 883], [29, NO, 490], [30, NO, 705], [31, N, 801],
    [32, N2, 598], [33, NO, 684],
    [40, N, 580], [41, NO, 428], [42, N, 701], [43, N, 600], [44, NO, 838], [45, NO, 592],
    [46, NO, 598], [47, NO, 411], [48, N, 577],
    [50, NO, 452], [51, N, 596], [52, NO, 787], [53, NO, 574], [54, N, 466], [55, NO, 895],
    [60, N, 1062], [61, N, 518], [62, N, 723], [63, NO, 540], [64, NO, 823], [65, NO, 908],
    [66, N, 702], [67, NO, 961], [68, NO, 419],
    [80, N, 829], [81, N, 579], [82, N, 627], [83, NO, 777], [84, N, 517], [85, NO, 863],
    [86, N, 768], [87, NO, 636], [88, NO, 870],
];

const BY_ID = new Map<number, IonState>(
    PATH.map(([id, species, x]) => [id, { species, x, y: TITLE_Y, size: SIZE, visible: true }])
);

/** Capa e fecho têm arte própria: o íon se recolhe (mantém a última espécie e a posição). */
const HIDDEN: IonState = { species: 'nitrate', x: 1150, y: TITLE_Y, size: SIZE, visible: false };

export const ionStateFor = (slideId: number): IonState => BY_ID.get(slideId) ?? HIDDEN;
