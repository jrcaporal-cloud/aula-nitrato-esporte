/**
 * Slide 11 · "Quatro Atletas, uma Pergunta": os quatro casos FICTÍCIOS que atravessam a aula (roteiro).
 * Idade, esporte e VO₂max vêm do roteiro; a duração é a do esforço de cada um (aproximada, do personagem).
 * Bruno não tem VO₂max informado: aparece como "não informado", sem número inventado.
 */

export interface CastMember {
    name: string;
    initial: string;
    age: number;
    role: string;
    event: string;
    /** Duração do esforço em minutos (régua comum de 0 a 120 min) e o texto dela. */
    minutes: number;
    durationLabel: string;
    /** VO₂max em mL/kg/min; `null` = não informado. */
    vo2max: number | null;
    /** Perfil de esforço: contínuo, ou intermitente (sprints sobre uma base leve). */
    effort: 'steady' | 'intermittent';
    /** Nível relativo do esforço contínuo, de 0 a 1. */
    intensity: number;
    dilemma: string;
}

export const CAST: readonly CastMember[] = [
    {
        name: 'Lia', initial: 'L', age: 29, role: 'ciclista de clube', event: 'contrarrelógio de 16 km',
        minutes: 27, durationLabel: 'cerca de 27 min', vo2max: 52, effort: 'steady', intensity: 0.78,
        dilemma: 'O “aguentar mais” do laboratório vira “chegar antes” contra o relógio?',
    },
    {
        name: 'Tomás', initial: 'T', age: 24, role: 'corredor de elite', event: '1.500 m',
        minutes: 4, durationLabel: 'cerca de 4 min', vo2max: 80, effort: 'steady', intensity: 0.96,
        dilemma: 'Segundos decidem a prova. Em elite, a média dos estudos é ~0: e para ele?',
    },
    {
        name: 'Bruno', initial: 'B', age: 27, role: 'meio-campista amador', event: 'jogo de 90 min com sprints',
        minutes: 90, durationLabel: '90 min, com sprints', vo2max: null, effort: 'intermittent', intensity: 0.3,
        dilemma: 'Sprints curtos, pausas curtas, 90 minutos: o protocolo decide o efeito?',
    },
    {
        name: 'Helena', initial: 'H', age: 41, role: 'corredora recreacional', event: 'primeira meia maratona',
        minutes: 120, durationLabel: 'cerca de 2 h', vo2max: 38, effort: 'steady', intensity: 0.5,
        dilemma: 'A maioria dos estudos é com homens jovens. Serve para ela?',
    },
];

/** Régua comum do perfil de esforço (minutos) e da escala de VO₂max (mL/kg/min). */
export const RULER_MINUTES = 120;
export const VO2_MIN = 30;
export const VO2_MAX = 80;

export const FINAL_QUESTION = 'O suco de beterraba muda a vida de quem?';
