import { C } from '../kit/palette';

/** Slide 86 — cinco mitos de consultório. Fontes: BLACK2024, WYLIE2016DOSE, WEI2024, HAIDER2014, WHITFIELD2017, LAGO2020, LARSEN2010, QIN2026, GALLARDO2019. */

export const MYTH_TABS = ['Depleção', 'Nitrito', 'Força', 'VO₂max', 'Pó'] as const;

export interface Myth {
    id: 'deplecao' | 'nitrito' | 'forca' | 'vo2' | 'po';
    short: string;
    myth: string;
    flip: string;
    text: string;
    source: string;
    color: string;
}

export const MYTHS: readonly Myth[] = [
    {
        id: 'deplecao', short: 'Esvaziar para depois encher', color: C.bacteria,
        myth: '“Antes de começar, esvazie o estoque: uma semana de dieta pobre em nitrato faz o suplemento render mais.”',
        flip: 'Depletar não esvazia o músculo e nada rende mais',
        text: 'Sete dias de dieta pobre derrubaram o nitrato e o nitrito da saliva e o nitrato do plasma. Nitrito do plasma, nitrato e nitrito do músculo, pressão e desempenho ficaram onde estavam. Depois, a dieta rica subiu tudo igual, e a pressão só caiu quando vinha da dieta padrão.',
        source: 'Black 2024 · cruzado com biópsia muscular, adultos jovens saudáveis',
    },
    {
        id: 'nitrito', short: 'Nitrito no sangue mede o efeito', color: C.nitrite,
        myth: '“Peça o nitrito plasmático: ele mostra se o suplemento está funcionando.”',
        flip: 'O efeito sobreviveu ao desaparecimento do nitrito',
        text: 'Com 6 mmol por dia, o VO₂ do exercício moderado ficou 3% menor aos 7 dias e aos 28–30 dias, mesmo na visita em que o nitrito plasmático já tinha voltado ao basal. Em outro estudo, o que acompanhou a pressão diastólica foi o RSNO do sangue total (r −0,68), e o que acompanhou o torque inicial foi o nitrato do músculo (r 0,64).',
        source: 'Wylie 2016 (34 pessoas) · Wei 2024 (12 pessoas, correlações exploratórias)',
    },
    {
        id: 'forca', short: 'Melhora a força máxima', color: C.o2,
        myth: '“Beterraba aumenta a força máxima.”',
        flip: 'Muda a contração provocada, não a força voluntária',
        text: 'Sete dias de suco (~26 mmol/dia): a força voluntária máxima não mudou e o twitch evocado subiu. Com ~9,7 mmol/dia em 19 homens, o mesmo padrão (força voluntária p = 0,54). Na meta-análise de torque isocinético, efeito de −0,01 em 5 estudos. O que sobe é a potência em velocidade alta, não a força.',
        source: 'Whitfield 2017 · Haider 2014 · Lago-Rodríguez 2020',
    },
    {
        id: 'vo2', short: 'O nitrato aumenta o VO₂max', color: C.hypoxia,
        myth: '“O nitrato melhora o desempenho porque aumenta o VO₂max.”',
        flip: 'O VO₂max caiu e o tempo até a exaustão não piorou',
        text: 'Em 9 voluntários, 2 dias de nitrato: VO₂max de 3,72 para 3,62 L/min (p < 0,05) e o tempo até a exaustão tendeu a subir (p = 0,13). O ganho vem de gastar menos O₂ na mesma carga. Na meta-análise de 2026, o VO₂max sobe pouco (SMD 0,24) e fica em 0,07, não significativo, nos muito treinados.',
        source: 'Larsen 2010 · Qin 2026 (38 estudos, 703 participantes)',
    },
    {
        id: 'po', short: 'Pó de beterraba = dose', color: C.nitrate,
        myth: '“Uma colher de pó de beterraba já é a dose.”',
        flip: 'O pó típico entrega um quinto da dose mínima',
        text: 'Os 6 pós analisados deram de 0,4 a 2,6 mmol por porção. Superbeets (5 g) mediu 1,03 mmol, contra os 5 mmol do IOC. Pelo cálculo, seriam cerca de 5 porções só para chegar à dose mínima. O pó serve a outros fins; como fonte de dose, o rótulo e a conta precisam fechar.',
        source: 'Gallardo & Coggan 2019 · cálculo: 5 ÷ 1,03 ≈ 5 porções',
    },
];
