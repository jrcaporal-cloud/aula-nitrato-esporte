import parsedPresentation from '../../../data/parsedPresentation.json';
import { C } from '../../sims/kit/palette';
import { DECK } from '../slides';

/** Um dos seis atos da aula: numeral, nome (tirado do JSON) e a cor do assunto. */
export interface Act {
    numeral: string;
    name: string;
    /** Cor principal do ato (nó da trilha, numeral, brilho do fundo). */
    color: string;
    /** Segunda cor do brilho do fundo (o Ato II vai do âmbar ao verde: a viagem). */
    colorB: string;
}

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI'] as const;

/**
 * Cor de cada ato, na linguagem de cor da aula: I nitrato (magenta), II a viagem
 * (âmbar → verde), III O₂ / pista (azul), IV sprint e força (laranja),
 * V o tribunal (ardósia → violeta), VI o veredito (verde).
 */
const ACT_COLORS: ReadonlyArray<[string, string]> = [
    [C.nitrate, C.nitrate],
    [C.nitrite, C.no],
    [C.o2, C.o2],
    [C.hypoxia, C.hypoxia],
    [C.placebo, C.bacteria],
    [C.no, C.no],
];

/** "Ato II · A Viagem" → { numeral: 'II', name: 'A Viagem' }. */
const parseSection = (section: string): { numeral: string; name: string } | null => {
    const match = section.match(/^\s*Ato\s+([IVX]+)\s*[·•\-–—:]\s*(.+?)\s*$/i);
    return match ? { numeral: match[1].toUpperCase(), name: match[2] } : null;
};

const nameOf = (numeral: string): string => {
    for (const raw of parsedPresentation as Array<{ sectionName?: string | null }>) {
        const parsed = parseSection(raw.sectionName ?? '');
        if (parsed?.numeral === numeral) return parsed.name;
    }
    return '';
};

export const ACTS: readonly Act[] = NUMERALS.map((numeral, i) => ({
    numeral,
    name: nameOf(numeral),
    color: ACT_COLORS[i][0],
    colorB: ACT_COLORS[i][1],
}));

/** Ato (0–5) de cada posição do deck; a capa (id 0) fica fora dos atos: dela nasce a abertura do Ato I. */
const ACT_BY_INDEX: ReadonlyArray<number | null> = DECK.map(item => {
    if (item.slide.id === 0) return null;
    const parsed = parseSection(item.section);
    const i = parsed ? NUMERALS.indexOf(parsed.numeral as (typeof NUMERALS)[number]) : -1;
    return i >= 0 ? i : null;
});

export const actOf = (deckIndex: number): number | null => ACT_BY_INDEX[deckIndex] ?? null;
