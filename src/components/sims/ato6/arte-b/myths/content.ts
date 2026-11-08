import type { Myth } from '../../mythsContent';

/** Textos curtos do slide 86 (mesmos números dos de `mythsContent.ts`, só mais enxutos para dar lugar à arte). */
export const BRIEF: Readonly<Record<Myth['id'], string>> = {
    deplecao: '7 dias de dieta pobre derrubaram nitrato e nitrito da saliva e o nitrato do plasma. Nitrito do plasma, músculo, pressão e desempenho ficaram onde estavam. A dieta rica depois subiu tudo igual, e a pressão só caiu vinda da dieta padrão.',
    nitrito: 'Com 6 mmol por dia, o VO₂ do exercício moderado ficou 3% menor aos 7 e aos 28–30 dias, mesmo com o nitrito plasmático de volta ao basal. Em outro estudo, a pressão diastólica acompanhou o RSNO do sangue total (r −0,68) e o torque inicial, o nitrato do músculo (r 0,64).',
    forca: '7 dias de suco (~26 mmol/dia): força voluntária máxima igual, twitch evocado maior. Com ~9,7 mmol/dia em 19 homens, o mesmo padrão (força voluntária p = 0,54). Na meta-análise de torque isocinético, −0,01 em 5 estudos. O que sobe é a potência em velocidade alta.',
    vo2: 'Em 9 voluntários, 2 dias de nitrato: VO₂max de 3,72 para 3,62 L/min (p < 0,05); o tempo até a exaustão tendeu a subir (p = 0,13). O ganho vem de gastar menos O₂ na mesma carga. Na meta-análise de 2026, o VO₂max sobe pouco (SMD 0,24) e fica em 0,07, não significativo, nos muito treinados.',
    po: 'Os 6 pós analisados deram de 0,4 a 2,6 mmol por porção. Superbeets (5 g): 1,03 mmol, contra os 5 mmol do IOC; cerca de 5 porções só para chegar à dose mínima. O pó serve a outros fins; como fonte de dose, o rótulo e a conta precisam fechar.',
};
