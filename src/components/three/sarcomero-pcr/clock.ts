import { REDUCED_T } from './kinetics';

/** Quem está em foco nos pares da cena: os dois, só o placebo ou só o nitrato (tecla P). */
export type View = 'both' | 'placebo' | 'nitrate';

/** Estado compartilhado entre o 3D e o HUD, relido por quadro (nunca por render). */
export interface Clock {
    /** Segundos desde o início do laço da etapa. */
    t: number;
    step: number;
    view: View;
    /** 0..1: segunda coluna de sarcômeros (etapa das fibras). */
    mix: number;
    /** 0..1: efeito do nitrato ligado nas estações do rato e dos humanos. */
    nit: number;
    /** Brilho dos pares: 1 = em foco, menor = esmaecido. */
    dimP: number;
    dimN: number;
}

export type ClockRef = { readonly current: Clock };

export const makeClock = (reduced: boolean): Clock => ({
    t: reduced ? REDUCED_T[0] : 0, step: 0, view: 'both', mix: 0, nit: 1, dimP: 1, dimN: 1,
});

/** Aproxima `from` de `to` com amortecimento exponencial independente da taxa de quadros. */
export const damp = (from: number, to: number, rate: number, dt: number): number =>
    from + (to - from) * (1 - Math.exp(-rate * dt));

export interface Targets { step: number; view: View; reduced: boolean }

/**
 * Próximo estado do relógio. Sem `out`, devolve um objeto novo (função pura); com `out` (pode ser o próprio
 * `c`), escreve nele, para o laço por quadro não alocar.
 */
export const advance = (c: Clock, dt: number, tg: Targets, loopS: number, out?: Clock): Clock => {
    const stepped = tg.step !== c.step;
    const t = tg.reduced ? REDUCED_T[tg.step] : stepped ? 0 : (c.t + dt) % loopS;
    const wantP = tg.view === 'nitrate' ? 0.16 : 1;
    const wantN = tg.view === 'placebo' ? 0.16 : 1;
    const mix = damp(c.mix, tg.step === 2 ? 1 : 0, 3.2, dt);
    const nit = damp(c.nit, tg.view === 'placebo' ? 0 : 1, 4, dt);
    const dimP = damp(c.dimP, wantP, 6, dt);
    const dimN = damp(c.dimN, wantN, 6, dt);
    const o = out ?? { ...c };
    o.t = t;
    o.step = tg.step;
    o.view = tg.view;
    o.mix = mix;
    o.nit = nit;
    o.dimP = dimP;
    o.dimN = dimN;
    return o;
};
