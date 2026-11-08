import { C } from '../kit/palette';

/**
 * Slide 87 — a explicação final de cada uma das 6 frases do slide 10. As frases, o gabarito e a chave do localStorage
 * vêm de `ato1/claims.ts` (CLAIMS, VOTES_KEY); aqui só ficam as abas e o texto da explicação, com a fonte.
 */

export const VERDICT_TABS = ['Os votos', 'Frases 1 e 2', 'Frases 3 e 4', 'Frases 5 e 6'] as const;

export interface Explain {
    headline: string;
    line: string;
    source: string;
}

/** Indexado pelo id da frase (1…6). */
export const EXPLAIN: Readonly<Record<number, Explain>> = {
    1: { headline: 'O 16% é de outro teste', line: 'É tempo até a exaustão (583 → 675 s, 8 homens). No contrarrelógio, o ganho vai de 0 a 3%.', source: 'Bailey 2009 · Lansley 2011 · Senefeld 2020' },
    2: { headline: 'O efeito encolhe com o preparo', line: 'Com VO₂pico ≥ 65 mL/kg/min o efeito médio é d 0,02 (IC95% −0,10 a 0,14).', source: 'Senefeld 2020' },
    3: { headline: 'Dobrar a dose não dobra o efeito', line: '4,2 mmol: nada. 8,4 e 16,8 mmol: o mesmo ganho, +14% e +12% no tempo até a falha.', source: 'Wylie 2013' },
    4: { headline: 'É o nitrato, não o pigmento', line: 'O mesmo suco sem nitrato (~0,003 mmol) não mudou o tempo até a exaustão.', source: 'Lansley 2011' },
    5: { headline: 'Arginina não é nitrato', line: '20,5 g/dia de L-arginina por 3 dias: nenhuma mudança, nem no nitrato do plasma.', source: 'Bescós 2009' },
    6: { headline: 'O pico chega horas depois', line: 'O nitrito do plasma pica de 2 a 3 h após a dose; a janela é de 2 a 3,5 h antes.', source: 'Wylie 2013 · Senefeld 2020' },
};

/** Quantas frases já estão viradas em cada passo (o passo 0 mostra só os votos). */
export const REVEALED_BY_STEP: readonly number[] = [0, 2, 4, 6];

export const STAMP_COLOR = C.nitrate;
