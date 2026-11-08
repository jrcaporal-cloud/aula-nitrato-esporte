import { seg, smooth } from '../shared/math';
import type { Cond } from './colors';
import { DATA } from './content';
import { dpcrAt, HIGH, secAt } from './kinetics';

/* Funções puras do tempo para a camada de energia (estoque de PCr, potencial de ação). Sem números novos na tela. */

/** Queda da PCr (mM) que esvazia todo o tubo de estoque: escala esquemática, igual para os dois sarcômeros. */
const TANK_REF_MM = 16;

/** Fração do estoque de PCr já usada (0..1) no instante `t` do laço da etapa. */
export const pcrUse = (step: number, cond: Cond, t: number): number => {
    if (step === 0) return Math.min(dpcrAt(cond, t) / TANK_REF_MM, 1);
    if (step !== 1) return 0;
    const sec = Math.min(secAt(t), DATA.high.tte[cond]);
    const fast = 0.45 * (1 - Math.exp(-sec / 35));
    const slow = 0.5 * (DATA.high.pcrSlow[cond] / DATA.high.pcrSlow.placebo) * smooth(seg(sec, HIGH.slowStart, DATA.high.tte[cond]));
    return Math.min(fast + slow, 1);
};

/** Trem de potenciais de ação (~2,4 por segundo) que dispara a liberação de Ca²⁺: pico 1 → decai. */
export const apPulse = (time: number, act: number): number => {
    const ph = (time * 2.4) % 1;
    return Math.exp(-5 * ph) * Math.min(act * 3, 1);
};
