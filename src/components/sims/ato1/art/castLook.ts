import { C } from '../../kit/palette';

export type Sport = 'cycle' | 'sprint' | 'football' | 'jog';

export interface CastLook {
    /** Cor de identidade do personagem (brilho do cartão, silhueta, medidores). */
    color: string;
    soft: string;
    sport: Sport;
}

/** Identidade visual por personagem: uma cor e uma cena de prova. */
export const CAST_LOOK: Readonly<Record<string, CastLook>> = {
    Lia: { color: C.nitrate, soft: C.nitrateSoft, sport: 'cycle' },
    'Tomás': { color: C.o2, soft: C.o2Soft, sport: 'sprint' },
    Bruno: { color: C.hypoxia, soft: '#FED7AA', sport: 'football' },
    Helena: { color: C.no, soft: C.noSoft, sport: 'jog' },
};
