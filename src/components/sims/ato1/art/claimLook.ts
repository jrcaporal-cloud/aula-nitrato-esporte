import { C } from '../../kit/palette';

/** Cor de identidade de cada frase da votação (o selo e o brilho do cartão). */
export const CLAIM_ACCENT: Readonly<Record<number, string>> = {
    1: C.nitrate,
    2: C.o2,
    3: C.nitrate,
    4: C.nitrateSoft,
    5: C.o2Soft,
    6: C.nitrite,
};
