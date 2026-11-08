import { C } from '../../sims/kit/palette';

/** Cor do clarão de cada modelo (linguagem de cor da aula): a primeira domina, a segunda tinge a borda. */
export interface MorphAccent {
    core: string;
    edge: string;
}

const ACCENTS: Readonly<Record<string, MorphAccent>> = {
    'vaso-hipoxia': { core: C.no, edge: C.noSoft },
    'viagem-nitrato': { core: C.nitrate, edge: C.nitrateSoft },
    'sarcomero-pcr': { core: C.nitrate, edge: C.nitrite },
};

const NEUTRAL: MorphAccent = { core: C.text, edge: C.muted };

export const accentOf = (model: string | null): MorphAccent => (model && ACCENTS[model]) || NEUTRAL;
