import { C } from '../kit/palette';

/** Slide 85 — pressão arterial como contexto. Fontes: SIERVO2013, KAPIL2015, SOBKO2010, KAPIL2013, BONDONNO2021. */

export const BP_TABS = ['Meta-análise', 'Hipertensos', 'Dieta japonesa', 'O mesmo interruptor'] as const;

export interface BpRow {
    id: string;
    /** Passo em que a linha aparece. */
    step: number;
    label: string;
    sub: string;
    value: number;
    lo?: number;
    hi?: number;
    /** Linha sem efeito: círculo vazio na posição zero. */
    none?: boolean;
    shown: string;
    color: string;
}

export const BP_ROWS: readonly BpRow[] = [
    { id: 'siervo-pas', step: 0, label: 'PAS · meta-análise', sub: '16 ECRs · 254 pessoas', value: -4.4, lo: -5.9, hi: -2.8, shown: '−4,4', color: C.no },
    { id: 'siervo-pad', step: 0, label: 'PAD · meta-análise', sub: 'P = 0,06', value: -1.1, lo: -2.2, hi: 0.1, shown: '−1,1', color: C.no },
    { id: 'kapil-pas', step: 1, label: 'PAS · consultório', sub: '68 hipertensos · 4 semanas', value: -7.7, shown: '−7,7', color: C.o2 },
    { id: 'kapil-pad', step: 1, label: 'PAD · consultório', sub: '~6,4 mmol por dia', value: -2.4, shown: '−2,4', color: C.o2 },
    { id: 'kapil-map-pas', step: 1, label: 'PAS · 24 h (MAPA)', sub: 'sem taquifilaxia', value: -7.7, shown: '−7,7', color: C.o2 },
    { id: 'kapil-map-pad', step: 1, label: 'PAD · 24 h (MAPA)', sub: '', value: -5.2, shown: '−5,2', color: C.o2 },
    { id: 'sobko-pad', step: 2, label: 'PAD · dieta japonesa', sub: '25 voluntários · 10 dias', value: -4.5, shown: '−4,5', color: C.nitrate },
    { id: 'sobko-pas', step: 2, label: 'PAS · dieta japonesa', sub: 'sem efeito', value: 0, none: true, shown: 'sem efeito', color: C.placebo },
    { id: 'kapil13', step: 3, label: 'Enxaguante, 7 dias', sub: 'clorexidina, sem nitrato', value: 2.75, lo: 2, hi: 3.5, shown: '+2 a +3,5', color: C.hypoxia },
];

export const BP_STORIES = [
    { kicker: 'meta-análise', color: C.no, title: 'Pouco por pessoa, muito por população', text: 'Em 16 ensaios cruzados, 2 horas a 15 dias, a pressão sistólica caiu 4,4 mmHg. Estudos curtos, pequenos, em geral de normotensos.', source: 'Siervo 2013 · IC95% da PAS −5,9 a −2,8' },
    { kicker: 'hipertensos', color: C.o2, title: 'Com a pressão alta, o efeito é maior', text: 'Um shot por dia (~6,4 mmol) por 4 semanas: −7,7 mmHg no consultório e nas 24 horas, sem perder efeito ao longo do mês.', source: 'Kapil 2015 · ECR duplo-cego, 68 hipertensos' },
    { kicker: 'dieta japonesa', color: C.nitrate, title: 'Comida de verdade também faz', text: 'Dez dias de dieta tradicional japonesa, rica em vegetais, baixaram a diastólica em 4,5 mmHg. A sistólica não mudou.', source: 'Sobko 2010 · ECR cruzado, 25 voluntários' },
    { kicker: 'o mesmo mecanismo', color: C.hypoxia, title: 'Apague as bactérias, a pressão sobe', text: 'Enxaguante com clorexidina por 7 dias, sem nitrato nenhum, subiu a pressão 2 a 3,5 mmHg. É a mesma via que a pista exige.', source: 'Kapil 2013 · 19 voluntários saudáveis' },
] as const;

export const BP_AXIS = { min: -10, max: 4, ticks: [-10, -8, -6, -4, -2, 0, 2, 4] } as const;

export const BP_COHORT = 'Coorte dinamarquesa (53.150 pessoas, 23 anos): ~60 mg/dia de nitrato de vegetais, cerca de 1 xícara de folhosas, já se associou a HR 0,85 para doença cardiovascular. Estudo observacional (Bondonno 2021).';
