/**
 * Slide 13 · "O Mapa da Aula": os seis atos como estações da viagem do íon (roteiro).
 * A pergunta da aula é PARA QUEM e QUANDO, não "funciona?". Números do fecho: Senefeld 2020 (dossiê 02).
 */
import { Dumbbell, Gavel, Route, Scale, Sprout, Timer, type LucideIcon } from 'lucide-react';
import { C } from '../kit/palette';

export interface Act {
    roman: string;
    /** Título completo (no cartão) e curto (na aba). */
    title: string;
    tab: string;
    color: string;
    Icon: LucideIcon;
    question: string;
    /** Três pontos do que o ato traz. */
    topics: readonly [string, string, string];
}

export const ACTS: readonly Act[] = [
    {
        roman: 'I', title: 'A Raiz', tab: 'Raiz', color: C.nitrate, Icon: Sprout,
        question: 'De onde vem a ideia, e o que todo mundo acha que sabe?',
        topics: ['Seis frases que todo mundo sabe', 'Quatro atletas fictícios', 'O gás que virou Nobel'],
    },
    {
        roman: 'II', title: 'A Viagem', tab: 'Viagem', color: C.nitrite, Icon: Route,
        question: 'Como um íon do prato chega à fibra muscular?',
        topics: ['Boca, sangue e músculo', 'Onde falta oxigênio, nasce NO', 'O custo de O₂ cai: e por quê'],
    },
    {
        roman: 'III', title: 'A Pista', tab: 'Pista', color: C.o2, Icon: Timer,
        question: 'Em que prova, com que dose e para quem?',
        topics: ['+16% ou 1%: exaustão × contrarrelógio', 'Dose, hora e o teto do treinado', 'Elite, altitude e Londres 2012'],
    },
    {
        roman: 'IV', title: 'O Sprint e a Força', tab: 'Sprint', color: C.hypoxia, Icon: Dumbbell,
        question: 'E no jogo, no sprint e na força?',
        topics: ['Esporte coletivo e sprints repetidos', 'Mais rápido, não mais forte', 'O dia de judô'],
    },
    {
        roman: 'V', title: 'O Contra-Interrogatório', tab: 'Tribunal', color: C.bacteria, Icon: Scale,
        question: 'Dá para confiar nos estudos?',
        topics: ['Placebo, cegamento e ruído do teste', 'Dez atletas e uma esperança', 'Respondedor, funil e viés'],
    },
    {
        roman: 'VI', title: 'O Veredito', tab: 'Veredito', color: C.no, Icon: Gavel,
        question: 'O que fazer no consultório?',
        topics: ['Prato, rótulo e protocolo', 'Os quatro casos, um a um', 'Regras do jogo e o que levar'],
    },
];

/** Passo final: a pergunta da aula e o prêmio realista. */
export const PRIZE = {
    notAsk: 'Funciona?',
    ask: 'Para quem? Quando?',
    title: 'o prêmio realista',
    items: [
        { value: 'pequeno', text: 'efeito médio no conjunto: d 0,17 (80 estudos)', color: C.nitrateSoft },
        { value: '≈ 0', text: 'em elite de endurance: d 0,02 com VO₂pico ≥ 65 mL/kg/min', color: C.placebo },
    ],
    source: 'Senefeld 2020',
    cast: 'Lia, Tomás, Bruno e Helena voltam no Ato VI',
} as const;

export const TAB_LABELS: readonly string[] = [...ACTS.map(a => a.tab), 'A pergunta'];
