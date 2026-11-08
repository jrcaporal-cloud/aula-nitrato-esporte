/** Texto e números do slide 55 (dossiê 03: ZAMANI2015, BORLAUG2018, ZAMANI2025, PAVITT2020, DERELLA2024). */

export interface PilotStep {
    tab: string;
    kicker: string;
    headline: string;
    text: string;
    facts: readonly (readonly [string, string])[];
    takeaway: string;
    source: string;
}

export const PILOT_STEPS: readonly PilotStep[] = [
    {
        tab: 'Piloto 2015',
        kicker: 'Zamani 2015 · ICFEp · n = 17 · cruzado',
        headline: 'O piloto que animou',
        text: 'Uma dose única de suco de beterraba (12,9 mmol) em 17 pacientes com insuficiência cardíaca de fração de ejeção preservada: VO₂pico de 11,6 para 12,6 mL/kg/min e mais trabalho total (55,6 vs 49,2 kJ).',
        facts: [['placebo', '11,6'], ['beterraba', '12,6'], ['P', '0,005']],
        takeaway: 'O "sim" que motivou os ensaios maiores.',
        source: 'Zamani 2015, Circulation.',
    },
    {
        tab: 'INDIE 2018',
        kicker: 'INDIE-HFpEF · n = 105 · nitrito inalado',
        headline: 'O ensaio grande apagou o sinal',
        text: 'Mais de seis vezes os pacientes, em 17 centros, mas com nitrito inalado, não nitrato oral. VO₂pico 13,5 vs 13,7 (−0,20; IC95% −0,56 a 0,16; P = 0,27); classe funcional e NT-proBNP também iguais.',
        facts: [['nitrito inalado', '13,5'], ['placebo', '13,7'], ['P', '0,27']],
        takeaway: 'Via e molécula diferentes: não é o nulo do suco de beterraba.',
        source: 'Borlaug 2018, JAMA.',
    },
    {
        tab: 'Nitrato oral 2025',
        kicker: 'Zamani 2025 · n = 84 · KNO₃ oral por 6 semanas',
        headline: 'Nitrato oral, 6 semanas: nada',
        text: 'Nitrato de potássio, 6 mmol três vezes ao dia por 6 semanas, contra KCl. Os metabólitos do NO subiram cerca de dez vezes, e o VO₂pico ficou em 10,23 vs 10,17 (P = 0,73).',
        facts: [['metabólitos do NO', '418,4 vs 40,1 µM'], ['VO₂pico', '10,23 vs 10,17'], ['trabalho total', '25,9 vs 23,6 kJ']],
        takeaway: 'Com o NO muito mais alto, o desempenho não se mexeu.',
        source: 'Zamani 2025, JAMA Cardiol.',
    },
    {
        tab: 'DPOC',
        kicker: 'ON-EPIC · DPOC · n = 165 · 4 centros',
        headline: 'DPOC: o treino é o parceiro',
        text: '12,9 mmol 3 h antes de cada sessão de reabilitação, duas vezes por semana, por 8 semanas: shuttle walk +60 m contra +30 m. O ganho veio junto com o treino, não de uma pílula isolada.',
        facts: [['beterraba', '+60 m'], ['placebo', '+30 m'], ['efeito', '30 m (IC95% 10 a 40)']],
        takeaway: 'Potencializa o treino; sozinho, o nitrato não foi testado assim.',
        source: 'Pavitt 2020, Thorax.',
    },
    {
        tab: 'Agrupado clínico',
        kicker: 'Derella 2024 · 22 estudos clínicos',
        headline: 'Somados, os clínicos dão nulo',
        text: '46% dos estudos individuais relataram benefício, mas o agrupado foi nulo em todos os desfechos, com baixo poder estatístico. Dar certo em quase metade dos estudos não é o mesmo que funcionar.',
        facts: [['estudos "positivos"', '46%'], ['VO₂pico', 'SMD 0,002'], ['TTE máximo', 'SMD 0,11']],
        takeaway: 'Piloto positivo ≠ terapia.',
        source: 'Derella 2024, Nutrients.',
    },
];

export interface Trial {
    id: string;
    year: number;
    name: string;
    n: number;
    /** Linha de apoio sob a bolha. */
    detail: string;
    /** Diferença em VO₂pico (mL/kg/min); só para a linha da ICFEp. */
    effect?: number;
    color: string;
    /** Passo em que a bolha entra (índice do passador). */
    fromStep: number;
    /** Via diferente de nitrato oral. */
    note?: string;
}
