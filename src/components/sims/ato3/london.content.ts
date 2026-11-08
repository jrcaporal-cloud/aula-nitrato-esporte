import { C } from '../kit/palette';

/** Slide 48 — "A Reta de Londres". LANE2014 (ensaio) e EXETER2012 (comunicado: relato, não ensaio). */

export const LONDON_TABS = ['Londres, 2012', 'No laboratório', 'No pódio', 'Laboratório × pódio'] as const;

/** LANE2014: 24 ciclistas (12 H + 12 M), mudança na potência média no percurso simulado, vs controle. */
export const LAB_BARS = [
    { id: 'caff', label: 'Cafeína (goma, 3 mg/kg)', value: 3.9, text: '+3,9%', note: 'p < 0,01', color: C.nitrite },
    { id: 'both', label: 'Cafeína + beterraba', value: 3.0, text: '+3,0%', note: 'p < 0,01', color: C.bacteria },
    { id: 'br', label: 'Beterraba (8,4 mmol)', value: -0.4, text: '−0,4%', note: 'p = 0,6', color: C.nitrate },
] as const;

export const PODIUM_CLAIMS = [
    { who: 'Team GB', what: 'citada como usuária do suco' },
    { who: 'EUA, Canadá, Austrália, Nova Zelândia e Holanda', what: 'atletas citados como usuários' },
    { who: 'David Weir', what: 'disse à mídia britânica que o suco ajudou nas quatro medalhas de ouro paralímpicas' },
] as const;

export const LONDON_FEET: readonly string[] = [
    'Londres, 2012: um ensaio reproduziu em ergômetro o percurso olímpico do contrarrelógio, com 24 ciclistas competitivos.',
    'Resultado do ensaio: a cafeína ganhou 3–4% e a beterraba, sozinha, −0,4% (p = 0,6). Somada à cafeína, não acrescentou nada.',
    'No pódio, o que existe é um comunicado da universidade que pesquisa o suco: atletas teriam usado. É relato, não ensaio.',
    'O laboratório mede, mas é um cenário controlado. O pódio é real, mas não mede nada. Uso por atleta de elite não é prova de eficácia.',
];
