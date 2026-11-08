import type { ReactNode } from 'react';
import { C } from '../kit/palette';
import { Hl } from './ui';

export type FactsKind = 'water' | 'gradient' | 'chlorhexidine' | 'spit' | 'exercise' | 'chain';

export interface MouthStep {
    tab: string;
    /** Posição do interruptor (índice em POSITIONS). */
    position: number;
    headline: string;
    text: ReactNode;
    source: string;
    facts: FactsKind;
    /** Gráfico da hipotensão pós-exercício no lugar das curvas de nitrito. */
    exercise?: boolean;
}

export const MOUTH_STEPS: readonly MouthStep[] = [
    {
        tab: 'Água', position: 0, facts: 'water',
        headline: 'Com água, a via funciona',
        text: <>Sem interferência, o <Hl c={C.nitrate}>nitrato</Hl> do suco vira <Hl c={C.nitrite}>nitrito</Hl> na língua e o nitrito plasmático pica em 2–3 h. Com 500 mL de suco de beterraba, a pressão cai até −10,4/−8 mmHg por volta das 3 h.</>,
        source: 'Webb 2008 (Hypertension) · Wylie 2013 (J Appl Physiol)',
    },
    {
        tab: 'Enxaguante', position: 1, facts: 'gradient',
        headline: 'Enxaguar já desliga uma parte',
        text: <>O bloqueio é graduado: com a mesma carga de nitrato, o nitrito em 2 h subiu menos com enxaguante fraco que com água, e menos ainda com o forte, de clorexidina.</>,
        source: 'McDonagh 2015 (Int J Sports Med, n = 12) · Woessner 2016 (Nitric Oxide)',
    },
    {
        tab: 'Clorexidina', position: 2, facts: 'chlorhexidine',
        headline: 'Sete dias, sem suplemento algum',
        text: <>Em 19 voluntários saudáveis, bochechar clorexidina por 7 dias cortou a produção oral de <Hl c={C.nitrite}>nitrito</Hl> em 90%, o nitrito plasmático em 25% — e a pressão <Hl c={C.risk}>subiu</Hl> 2 a 3,5 mmHg, já no primeiro dia.</>,
        source: 'Kapil 2013 (Free Radic Biol Med) · sem grupo placebo concorrente',
    },
    {
        tab: 'Cuspir', position: 3, facts: 'spit',
        headline: 'O interruptor sem droga nenhuma',
        text: <>Seis voluntários tomaram 500 mL de suco e <Hl c={C.bacteria}>cuspiram a saliva</Hl> por 3 h. O nitrato no sangue subiu igual; o nitrito não subiu e a pressão não caiu. Mesma dose, sem a boca, sem efeito.</>,
        source: 'Webb 2008 · subestudo cruzado, n = 6',
    },
    {
        tab: 'Exercício', position: 2, facts: 'exercise', exercise: true,
        headline: 'Vale até sem suplemento',
        text: <>Em 23 pessoas, bochechar um antibacteriano depois da corrida reduziu a hipotensão pós-exercício em 61% a 1 h e a <Hl c={C.risk}>aboliu</Hl> a 2 h. Nenhum nitrato extra: o NO do próprio exercício também passa pela boca.</>,
        source: 'Clarke 2019 (Free Radic Biol Med) · cruzado duplo-cego, n = 23',
    },
    {
        tab: 'Elo faltante', position: 2, facts: 'chain',
        headline: 'O que ainda não está provado',
        text: <>Nenhum ensaio com atletas mediu juntos função oral, nitrato e nitrito seriados e um teste de desempenho confiável. Nitrito salivar alto mostra que a via funcionou; não diz quem vai render mais.</>,
        source: 'Zhao 2026 (Nutrients, revisão narrativa)',
    },
];
