import { seg, smooth } from '../shared/math';
import type { Cond } from './colors';
import { DATA } from './content';
import type { Fiber } from './layout';

/*
 * Cinética do modelo: funções puras do tempo `t` (s do laço da etapa). O 3D e o HUD leem as mesmas
 * funções, então o espectro, os contadores e os sarcômeros nunca se desencontram. O tempo é
 * comprimido; só os números do dossiê aparecem como valores.
 */

/** Duração do laço de cada etapa (s). */
export const LOOP_S: readonly number[] = [14, 18, 8, 12, 16];

/** Etapa 1: repouso até 1,6 s, subida até 3,0 s, platô até 10,5 s, descida até 12 s, recuperação. */
export const LOW = { rest: 1.6, up: 3.0, hold: 10.5, down: 12, tau: 2.4, recover: 1.1 } as const;

/** Etapa 2: o laço representa 0–800 s de exercício; depois uma pausa. */
export const HIGH = { runS: 16.2, span: 800, slowStart: 120 } as const;

/** Faíscas de ATP por segundo por sarcômero na referência (turnover de 296 µM/s). */
const SPARK_BASE = 15;

export interface Signals {
    /** Ativação 0..1: encurtamento do sarcômero e liberação de Ca²⁺. */
    act: number;
    /** Fator de amplitude do Ca²⁺ (1 = placebo; maior na fibra rápida com nitrato). */
    amp: number;
    /** Velocidade relativa do ciclo das pontes cruzadas. */
    cycle: number;
    /** Eventos visuais de hidrólise de ATP por segundo. */
    sparks: number;
    /** Turnover de ATP lido no HUD (µM/s). */
    atp: number;
    /** Queda da PCr lida no HUD (mM). */
    dpcr: number;
    /** 0..1: sarcômero chegou à exaustão (etapa 2). */
    fatigue: number;
}

const IDLE: Signals = { act: 0, amp: 1, cycle: 1, sparks: 0, atp: 0, dpcr: 0, fatigue: 0 };

/** Segundos de exercício representados na etapa 2 no instante `t`. */
export const secAt = (t: number): number => Math.min((t / HIGH.runS) * HIGH.span, HIGH.span);

/** Queda da PCr (mM) na etapa 1: aproximação exponencial que chega exatamente ao valor do dossiê no fim do platô. */
export const dpcrAt = (cond: Cond, t: number): number => {
    const delta = DATA.low.dPcr[cond];
    const reached = 1 - Math.exp(-(LOW.hold - LOW.rest) / LOW.tau);
    if (t < LOW.hold) return (delta * (1 - Math.exp(-Math.max(t - LOW.rest, 0) / LOW.tau))) / reached;
    return delta * Math.exp(-(t - LOW.hold) / LOW.recover);
};

const lowIntensity = (cond: Cond, t: number): Signals => {
    const act = smooth(seg(t, LOW.rest, LOW.up)) * (1 - smooth(seg(t, LOW.hold, LOW.down)));
    const atpPlateau = DATA.low.atp[cond];
    return {
        ...IDLE,
        act,
        cycle: atpPlateau / DATA.low.atp.placebo,
        sparks: SPARK_BASE * (atpPlateau / DATA.low.atp.placebo) * act,
        atp: atpPlateau * act,
        dpcr: dpcrAt(cond, t),
    };
};

/** Deriva do custo (componente lento) em fração do custo inicial, proporcional ao dado do dossiê. */
const driftOf = (cond: Cond): number => (DATA.high.vo2Slow[cond] / DATA.high.vo2Slow.placebo) * 0.6;

const highIntensity = (cond: Cond, t: number): Signals => {
    const tte = DATA.high.tte[cond];
    const sec = secAt(t);
    const endT = (tte / HIGH.span) * HIGH.runS;
    const act = smooth(seg(t, 0, 1)) * (1 - smooth(seg(t, endT, endT + 0.9)));
    const slow = smooth(seg(sec, HIGH.slowStart, tte));
    const cost = (1 + driftOf(cond) * slow) * (DATA.high.atp[cond] / DATA.high.atp.placebo);
    return {
        ...IDLE,
        act,
        cycle: cost,
        sparks: SPARK_BASE * 2 * cost * act,
        atp: DATA.high.atp[cond] * (1 + driftOf(cond) * slow) * act,
        fatigue: smooth(seg(sec, tte, tte + 30)),
    };
};

/** Tetania de 1 a 5 s; amplitude de Ca²⁺ maior só na fibra rápida com nitrato. */
const tetanus = (cond: Cond, fiber: Fiber, t: number): Signals => {
    const act = smooth(seg(t, 1, 1.7)) * (1 - smooth(seg(t, 5, 5.8)));
    return { ...IDLE, act, amp: cond === 'nitrate' && fiber === 'II' ? 1.75 : 1, sparks: SPARK_BASE * act };
};

/** Sinais de um sarcômero na etapa `step` (0–2); fora dela, tudo parado. */
export const signals = (step: number, cond: Cond, fiber: Fiber, t: number): Signals => {
    if (step === 0) return lowIntensity(cond, t);
    if (step === 1) return highIntensity(cond, t);
    if (step === 2) return tetanus(cond, fiber, t);
    return IDLE;
};

/** Instante representativo de cada etapa quando o movimento está reduzido (prefers-reduced-motion). */
export const REDUCED_T: readonly number[] = [9, 9, 3.5, 4, 6];
