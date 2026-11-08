/*
 * Texto e câmera das 8 etapas do modelo "A viagem do nitrato" (slides 21 e 22).
 * Fonte única dos números: dossiê 01 (siglas = blocos do dossiê). Nada de número fora dele.
 */

export type Vec3 = readonly [number, number, number];
export interface Pose { pos: Vec3; tgt: Vec3 }

export interface VnStep {
    badge: string;
    title: string;
    short: string;
    text: string;
    sources: string;
    pose: Pose;
}

export const STEPS: readonly VnStep[] = [
    {
        badge: 't = 0', title: 'O íon entra pela boca', short: 'Boca: o nitrato é engolido',
        text: 'Um copo de suco de beterraba traz o nitrato inorgânico (NO₃⁻: um N com três O, em magenta). Ele é engolido ainda como nitrato: na boca e no esôfago nada acontece com ele. O corpo humano não tem a enzima que o reduz; quem faz isso vem depois.',
        sources: 'HYDE2014 · LUNDBERG2018',
        pose: { pos: [-0.8, 4.6, 43], tgt: [-2.2, 4.1, 0] },
    },
    {
        badge: '0–2 h', title: 'Do intestino ao plasma', short: 'Intestino: absorção',
        text: 'No intestino delgado a absorção é rápida e a nuvem de íons entra no plasma. O nitrato plasmático pica em 1–2 h e só volta ao basal em ~24 h. A meia-vida do nitrato é de ~5 h.',
        sources: 'JONES2014 · WAGNER1983',
        pose: { pos: [0.8, -3.9, 23], tgt: [0.2, -4.1, 0] },
    },
    {
        badge: '1–2 h', title: 'Um em cada quatro desvia para a saliva', short: 'Glândulas: sialina',
        text: 'Cerca de 25% do nitrato circulante é bombeado para as glândulas salivares pela sialina, um cotransportador 2 NO₃⁻/H⁺. A saliva chega a ~5× o plasma no basal e a ~11× depois da carga (1516,7 vs 134 µmol/L): o desvio pela boca é obrigatório.',
        sources: 'QIN2012 · MCKNIGHT1997 · JONES2014',
        pose: { pos: [0.8, 8.9, 16], tgt: [-0.2, 8.5, 0] },
    },
    {
        badge: '1–3 h', title: 'As bactérias da língua fazem a redução', short: 'Língua: nitrato → nitrito',
        text: 'No dorso posterior da língua, Veillonella, Actinomyces e Rothia reduzem o nitrato a nitrito (NO₂⁻, âmbar). A etapa é bacteriana: o rato germ-free não a realiza. Ligue o bochecho com clorexidina e as bactérias somem.',
        sources: 'DUNCAN1995 · DOEL2005 · HYDE2014 · KAPIL2013',
        pose: { pos: [-1.6, 9.7, 11], tgt: [-2.0, 9.35, 0] },
    },
    {
        badge: '1–3 h', title: 'No ácido, parte do nitrito vira NO', short: 'Estômago: nitrito → NO',
        text: 'O nitrito da saliva é engolido e encontra o estômago ácido (pH < 2). Parte vira NO (verde) por via química, sem enzima: o NO gástrico subiu de 14,8 para 89,4 ppm em 60 min após 2 mmol de nitrato. O que não reage segue adiante.',
        sources: 'MCKNIGHT1997 · LUNDBERG1994',
        pose: { pos: [0.4, 0.2, 19], tgt: [-0.2, -0.15, 0] },
    },
    {
        badge: '2–3 h', title: 'O nitrito pica no plasma, o nitrato no músculo', short: 'Plasma: picos de nitrito e nitrato',
        text: 'O nitrito plasmático pica em 2–3 h e o nitrato muscular em 3 h (181 ± 128 nmol/g). É esse alinhamento que sustenta a janela de dose de 2–4 h antes do esforço. No basal, o músculo guarda ~4× o nitrato e ~29× o nitrito do plasma.',
        sources: 'JONES2014 · KADACH2022 · WYLIE2019 · SHANNON2022',
        pose: { pos: [-2.8, -1.0, 41], tgt: [-3.6, -1.4, 0] },
    },
    {
        badge: '~3 h', title: 'Onde falta O₂, o nitrito vira NO', short: 'Músculo e vasos: NO',
        text: 'No músculo que trabalha e nos vasos, pouco O₂ e pH baixo favorecem a redução do nitrito a NO, que dilata o vaso. Aqui é só um aceno: o mecanismo está no modelo vaso-hipoxia. O exercício intenso consome ~39% do estoque muscular, mas só se ele estiver elevado.',
        sources: 'JONES2014 · PIKNOVA2016 · WYLIE2019',
        pose: { pos: [-6.6, -6.0, 15], tgt: [-7.0, -6.6, 0] },
    },
    {
        badge: 'até 48 h', title: 'O que sobra sai pela urina', short: 'Excreção',
        text: 'A meia-vida do nitrato é de ~5 h: cerca de 60% da dose aparece na urina em 48 h, e o plasma volta ao basal em ~24 h. Urina avermelhada (beterrúria) vem do pigmento da beterraba e não indica a dose de nitrato.',
        sources: 'WAGNER1983 · JONES2014 · WATTS1993',
        pose: { pos: [3.0, -2.3, 23], tgt: [2.2, -2.7, 0] },
    },
];

export const LAST_STEP = STEPS.length - 1;

/** Efeitos do bochecho (KAPIL2013: 19 voluntários saudáveis, 7 dias, 2×/dia, sem suplemento de nitrato). */
export const CHX_EFFECTS: readonly { label: string; value: string; color: 'nitrite' | 'risk' }[] = [
    { label: 'Nitrito oral', value: '−90%', color: 'nitrite' },
    { label: 'Nitrito plasmático', value: '−25%', color: 'nitrite' },
    { label: 'PA sistólica e diastólica', value: '+2 a 3,5 mmHg', color: 'risk' },
];
export const CHX_NOTE = 'O enxaguante não impede a absorção do nitrato: mata o catalisador (GOVONI2008). Desenho sequencial, sem placebo-enxaguante concorrente.';
