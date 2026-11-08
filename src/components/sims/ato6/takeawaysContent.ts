import { C } from '../kit/palette';

/** Slide 88 — as seis mensagens finais. Fontes: BAILEY2009, LANSLEY2011b, SENEFELD2020, SHANNON2022, IOC2018, GALLARDO2019, COGGAN2018R, ATKINSON2015, HECKSTEDEN2018. */

export const TAKEAWAY_TABS = ['Sobre o efeito', 'Sobre a prática', 'Sobre as lacunas', 'As seis'] as const;

export type VisualId = 'tte' | 'prep' | 'dose' | 'label' | 'resp' | 'gap';

export interface Takeaway {
    n: number;
    visual: VisualId;
    color: string;
    headline: string;
    key: string;
    text: string;
    source: string;
}

export const TAKEAWAYS: readonly Takeaway[] = [
    { n: 1, visual: 'tte', color: C.nitrate, headline: '16% é tempo até a exaustão', key: '+16% × 0–3%', text: 'O número que viralizou mede aguentar mais em homens pouco treinados. Chegar antes, no contrarrelógio, rende de 0 a 3%.', source: 'Bailey 2009 · Lansley 2011 · Senefeld 2020' },
    { n: 2, visual: 'prep', color: C.o2, headline: 'O efeito encolhe com o preparo', key: 'd 0,17 → 0,02', text: 'Do efeito médio de todos os níveis ao efeito de quem passa de 65 mL/kg/min de VO₂pico. O consenso põe o corte em 60.', source: 'Senefeld 2020 · Shannon 2022' },
    { n: 3, visual: 'dose', color: C.no, headline: '8–16 mmol agudo, 2–4 h antes', key: '8–16 mmol · 2–4 h', text: 'Ou 4–16 mmol por dia, o último 2–4 h antes. O IOC fala em 5–9 mmol. Mais do que ~8 mmol não rendeu mais.', source: 'Shannon 2022 · IOC 2018 · Wylie 2013' },
    { n: 4, visual: 'label', color: C.nitrite, headline: 'Dose é mmol; o rótulo erra', key: '5 de 24', text: 'Só 5 de 24 produtos deram 5 mmol ou mais por porção. 1 mmol = 62 mg: faça a conta e peça o laudo.', source: 'Gallardo & Coggan 2019' },
    { n: 5, visual: 'resp', color: C.bacteria, headline: 'Respondedor ainda não é uma entidade medida', key: '−9,6% a +26,8%', text: 'Diferenças individuais de resposta misturam efeito e ruído de medida. Separá-los exige repetir o teste em cada condição.', source: 'Coggan 2018 · Atkinson 2015 · Hecksteden 2018' },
    { n: 6, visual: 'gap', color: C.hypoxia, headline: 'Mulheres e elite de endurance: lacunas', key: '156 de 1.335', text: 'Mulheres foram ~10% dos participantes; os estudos em elite têm n de 8 a 13. Ausência de dado não é ausência de efeito.', source: 'Senefeld 2020' },
];

/** Quais mensagens aparecem em cada passo (o último passo mostra as seis). */
export const TAKEAWAYS_BY_STEP: readonly (readonly number[])[] = [[1, 2], [3, 4], [5, 6], [1, 2, 3, 4, 5, 6]];
