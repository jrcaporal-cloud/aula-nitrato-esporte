import { C } from '../../sims/kit/palette';

/*
 * Cores do modelo. A linguagem da aula vale (magenta = nitrato, ardósia = placebo, verde = NO,
 * azul = O₂). Ca²⁺ ganha um azul-céu próprio; as estruturas ficam em tons neutros para que a cor
 * diga sempre "quem recebeu o quê". Energia (PCr, Pi, ATP) usa cores que não colidem com o âmbar do nitrito.
 */
export const COL = {
    placebo: C.placebo,
    nitrate: C.nitrate,
    nitrateSoft: C.nitrateSoft,
    no: C.no,
    o2: C.o2,
    ca: '#38BDF8',
    thick: '#D9DEE9',
    thin: '#6C86B8',
    head: '#F4F6FB',
    zdisc: '#9AA7BD',
    mline: '#6B7280',
    membrane: '#7C8DB5',
    tubule: '#CFE0FF',
    cisterna: '#5E75B8',
    fiberII: '#F8FAFC',
    fiberI: '#4B5A70',
    pcr: '#2DD4BF',
    pi: '#A5B4FC',
    atp: '#F3F4F6',
    bg: '#07050B',
    muted: '#9CA3AF',
} as const;

export type Cond = 'placebo' | 'nitrate';
export const condColor = (c: Cond): string => (c === 'placebo' ? COL.placebo : COL.nitrate);
