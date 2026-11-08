import { rng } from '../shared/math';
import { MB_SITES, NOS_SPECS, XOR_SITES, nosPoint } from './layout';
import { rates, type Gates, type Rates } from './model';
import { advanceFeeds, advanceFlashes, emit, type Feed, type Timed } from './feeds';
import { updateCells, updatePlasma, updateSlowCells } from './plasma';
import { advanceSparks } from './sparks';

/*
 * A simulação didática, avançada uma vez por quadro (sem estado do React). As taxas vêm de `model.ts`;
 * o fluxo, a dilatação e as faíscas de NO são só de cena — as proporções são ILUSTRATIVAS.
 */

/** Controles lidos por quadro: saturação (0–1), pH, etapa atual e movimento reduzido. */
export interface Ctl { sat: number; ph: number; stage: number; reduced: boolean }
export const createCtl = (sat: number, ph: number, reduced: boolean): Ctl => ({ sat, ph, stage: 0, reduced });

/** `halo` é o tamanho do brilho de cada ponto e `alpha` a opacidade dele (nas partículas simples, `halo` = `scale`). */
export interface Pool { n: number; pos: Float32Array; scale: Float32Array; halo: Float32Array; alpha: Float32Array; hold: Float32Array }
export interface CellPool extends Pool { sat: Float32Array }
export interface Sparks extends Timed { vel: Float32Array; home: Uint8Array; seed: Float32Array }

export const POOL = {
    rbc: 24, rbcB: 8, nitrite: 56, o2: 44, h: 72, no: 300, feedA: 30, feedB: 14, flashW: 20, flashB: 12,
    sites: NOS_SPECS.length + XOR_SITES.length + MB_SITES.length,
} as const;

export const makePool = (n: number, ownHalo = false): Pool => {
    const scale = new Float32Array(n);
    return { n, pos: new Float32Array(n * 3), scale, halo: ownHalo ? new Float32Array(n) : scale, alpha: new Float32Array(n).fill(1), hold: new Float32Array(n) };
};

export interface Sim {
    clock: number;
    dt: number;
    /** Distância percorrida pelo sangue (unidades de mundo) na fibra rápida e no capilar da lenta. */
    flow: number;
    flowB: number;
    /** Dilatação da arteriola (0–1), seguindo o NO total. */
    dilate: number;
    /** Presença da fibra lenta (0–1): entra só na última etapa. */
    slow: number;
    /** Brilho do músculo liso (chegada de faíscas de NO). */
    ring: number;
    gate: Gates;
    rates: Rates;
    acc: [number, number, number, number];
    rbc: CellPool;
    rbcB: CellPool;
    nitrite: Pool;
    o2: Pool;
    h: Pool;
    no: Sparks;
    feedA: Feed;
    feedB: Feed;
    flashW: Timed;
    flashB: Timed;
    sites: Pool;
    rand: () => number;
}

const timed = (n: number, ownHalo = true): Timed => ({ ...makePool(n, ownHalo), age: new Float32Array(n).fill(9), life: new Float32Array(n).fill(1), cursor: 0 });

export const createSim = (): Sim => {
    const sites = makePool(POOL.sites, true);
    [...NOS_SPECS.map((_, i) => nosPoint(i, 0.6)), ...XOR_SITES, ...MB_SITES].forEach((p, i) => sites.pos.set(p, i * 3));
    const n = POOL.no;
    const feed = (k: number): Feed => ({ ...timed(k, false), from: new Float32Array(k * 3), tk: new Uint8Array(k), ti: new Uint16Array(k) });
    return {
        clock: 0, dt: 0.016, flow: 0, flowB: 0, dilate: 0.5, slow: 0, ring: 0,
        gate: { hb: 0.12, mb: 0, xor: 0 },
        rates: { nos: 1, hb: 0, mb: 0, xor: 0, total: 0.55 },
        acc: [0, 0, 0, 0],
        rbc: { ...makePool(POOL.rbc, true), sat: new Float32Array(POOL.rbc) },
        rbcB: { ...makePool(POOL.rbcB), sat: new Float32Array(POOL.rbcB) },
        nitrite: makePool(POOL.nitrite),
        o2: makePool(POOL.o2),
        h: makePool(POOL.h),
        no: { ...timed(n), vel: new Float32Array(n * 3), home: new Uint8Array(n), seed: new Float32Array(n) },
        feedA: feed(POOL.feedA), feedB: feed(POOL.feedB),
        flashW: timed(POOL.flashW), flashB: timed(POOL.flashB),
        sites,
        rand: rng(97),
    };
};

const approach = (cur: number, goal: number, dt: number, rate: number) => cur + (goal - cur) * (1 - Math.exp(-dt * rate));

export const stepSim = (sim: Sim, ctl: Ctl, dtRaw: number) => {
    const dt = Math.min(dtRaw, 0.05);
    const calm = ctl.reduced ? 0.3 : 1;
    sim.dt = dt;
    sim.clock += dt;
    const g = sim.gate;
    g.hb = approach(g.hb, ctl.stage >= 2 ? 1 : 0.12, dt, 2.2);
    g.mb = approach(g.mb, ctl.stage >= 4 ? 1 : 0, dt, 2.2);
    g.xor = approach(g.xor, ctl.stage >= 4 ? 1 : 0, dt, 2.2);
    sim.rates = rates(ctl.sat, ctl.ph, g);
    sim.dilate = approach(sim.dilate, 0.18 + 0.82 * sim.rates.total, dt, 1.4);
    sim.slow = approach(sim.slow, ctl.stage >= 5 ? 1 : 0, dt, 2.2);
    sim.flow += 1.6 * (0.65 + 0.9 * sim.dilate) * calm * dt;
    sim.flowB += 1.0 * calm * dt;
    sim.ring *= Math.exp(-dt * 1.6);

    updateCells(sim, ctl);
    updateSlowCells(sim);
    updatePlasma(sim, ctl);
    emit(sim, dt);
    advanceFeeds(sim, dt);
    advanceSparks(sim, dt);
    advanceFlashes(sim, dt);

    const s = sim.sites;
    const nn = NOS_SPECS.length;
    for (let i = 0; i < nn; i++) {
        s.pos.set(nosPoint(i, sim.dilate), i * 3);
        s.halo[i] = sim.rates.nos * 0.9;
    }
    for (let i = 0; i < XOR_SITES.length; i++) s.halo[nn + i] = sim.rates.xor;
    for (let i = 0; i < MB_SITES.length; i++) s.halo[nn + XOR_SITES.length + i] = sim.rates.mb * 0.55;
};
