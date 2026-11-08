import { clamp01, rng } from '../shared/math';
import {
    CAP_X0, CAP_X1, CAP_Y, H_FIBER_HOME, MB_SITES, NOS_SITES, PATH_L, PATH_X0, SLOW_CAP_R, SLOW_CAP_Y,
    XOR_SITES, tubeR,
} from './layout';
import { acidity, hbYield, rates, type Gates, type Rates } from './model';
import { advanceSparks, emit } from './sparks';

/*
 * A simulação didática, avançada uma vez por quadro (sem estado do React). As taxas vêm de `model.ts`;
 * o fluxo, a dilatação e as faíscas de NO são só de cena — as proporções são ILUSTRATIVAS.
 */

/** Controles lidos por quadro: saturação (0–1), pH, etapa atual e movimento reduzido. */
export interface Ctl { sat: number; ph: number; stage: number; reduced: boolean }
export const createCtl = (sat: number, ph: number, reduced: boolean): Ctl => ({ sat, ph, stage: 0, reduced });

/** `halo` é o brilho 0–1 de cada ponto (o mesmo array de `scale` nas partículas simples). */
export interface Pool { n: number; pos: Float32Array; scale: Float32Array; halo: Float32Array }
export interface CellPool extends Pool { sat: Float32Array }
export interface Sparks extends Pool { age: Float32Array; life: Float32Array; vel: Float32Array; home: Uint8Array; seed: Float32Array; cursor: number }

export const POOL = { rbc: 24, rbcB: 8, nitrite: 56, o2: 44, h: 72, no: 180, sites: NOS_SITES.length + XOR_SITES.length + MB_SITES.length } as const;
const H_PLASMA = 36;

const makePool = (n: number, ownHalo = false): Pool => {
    const scale = new Float32Array(n);
    return { n, pos: new Float32Array(n * 3), scale, halo: ownHalo ? new Float32Array(n) : scale };
};

export interface Sim {
    clock: number;
    /** Distância percorrida pelo sangue (unidades de mundo) na fibra rápida e no capilar da lenta. */
    flow: number;
    flowB: number;
    /** Dilatação da arteríola (0–1), seguindo o NO total. */
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
    sites: Pool;
    rand: () => number;
}

export const createSim = (): Sim => {
    const sites = makePool(POOL.sites, true);
    [...NOS_SITES, ...XOR_SITES, ...MB_SITES].forEach((p, i) => sites.pos.set(p, i * 3));
    const no = makePool(POOL.no);
    const n = POOL.no;
    return {
        clock: 0, flow: 0, flowB: 0, dilate: 0.5, slow: 0, ring: 0,
        gate: { hb: 0.12, mb: 0, xor: 0 },
        rates: { nos: 1, hb: 0, mb: 0, xor: 0, total: 0.55 },
        acc: [0, 0, 0, 0],
        rbc: { ...makePool(POOL.rbc, true), sat: new Float32Array(POOL.rbc) },
        rbcB: { ...makePool(POOL.rbcB), sat: new Float32Array(POOL.rbcB) },
        nitrite: makePool(POOL.nitrite),
        o2: makePool(POOL.o2),
        h: makePool(POOL.h),
        no: { ...no, age: new Float32Array(n).fill(9), life: new Float32Array(n).fill(1), vel: new Float32Array(n * 3), home: new Uint8Array(n), seed: new Float32Array(n), cursor: 0 },
        sites,
        rand: rng(97),
    };
};

/* ---------- Sementes fixas das partículas que só flutuam (posição = função do tempo) ---------- */

interface Slot { u0: number; a: number; rr: number; sp: number; th: number; ph: number }

const slots = (n: number, seed: number, rrMax: number, spread: number): Slot[] => {
    const r = rng(seed);
    return Array.from({ length: n }, (_, i) => ({
        u0: ((i + r() * 0.6) / n) * PATH_L, a: r() * Math.PI * 2, rr: 0.15 + Math.sqrt(r()) * (rrMax - 0.15),
        sp: 1 + (r() - 0.5) * spread, th: ((i * 7) % n) / n, ph: r() * Math.PI * 2,
    }));
};

const NITRITE = slots(POOL.nitrite, 11, 0.8, 0.2);
const O2 = slots(POOL.o2, 12, 0.8, 0.2);
const H_PLASMA_SLOTS = slots(H_PLASMA, 13, 0.8, 0.2);
const CELLS = slots(POOL.rbc, 14, 0.42, 0).map((s, i) => ({ ...s, a: i * 2.399 }));
const CELLS_B = slots(POOL.rbcB, 15, 0.4, 0).map((s, i) => ({ ...s, a: i * 2.399 }));

const wrap = (u: number, len: number) => ((u % len) + len) % len;

/** Escreve a posição de um ponto do percurso (x = u + início, deslocado dentro do tubo). */
const place = (arr: Float32Array, i: number, u: number, a: number, rr: number, dil: number) => {
    const x = PATH_X0 + u;
    const R = tubeR(x, dil) * rr;
    arr[i * 3] = x;
    arr[i * 3 + 1] = CAP_Y + Math.cos(a) * R;
    arr[i * 3 + 2] = Math.sin(a) * R;
};


const approach = (cur: number, goal: number, dt: number, rate: number) => cur + (goal - cur) * (1 - Math.exp(-dt * rate));

/* ---------- Atualização por tipo ---------- */

const updateCells = (sim: Sim, ctl: Ctl) => {
    const p = sim.rbc;
    const dens = 0.45 + 0.55 * sim.dilate;
    CELLS.forEach((s, i) => {
        const u = wrap(s.u0 + sim.flow, PATH_L);
        place(p.pos, i, u, s.a, s.rr, sim.dilate);
        const prog = clamp01((PATH_X0 + u - CAP_X0) / (CAP_X1 - CAP_X0));
        const sat = clamp01(ctl.sat + (0.5 - prog) * 0.14 + Math.sin(s.ph * 3) * 0.03);
        p.sat[i] = sat;
        const vis = clamp01((dens - s.th) * 8);
        p.scale[i] = vis;
        p.halo[i] = vis * Math.pow(hbYield(sat, ctl.ph) * sim.gate.hb, 0.4);
    });
};

const updateSlowCells = (sim: Sim) => {
    const p = sim.rbcB;
    const len = CAP_X1 - CAP_X0;
    CELLS_B.forEach((s, i) => {
        const x = CAP_X0 + wrap(s.u0 * (len / PATH_L) + sim.flowB, len);
        const R = SLOW_CAP_R * s.rr;
        p.pos[i * 3] = x;
        p.pos[i * 3 + 1] = SLOW_CAP_Y + Math.cos(s.a) * R;
        p.pos[i * 3 + 2] = Math.sin(s.a) * R;
        p.sat[i] = 0.62;
        p.scale[i] = sim.slow;
    });
};

const updatePlasma = (sim: Sim, ctl: Ctl) => {
    const dilation = sim.dilate;
    const wob = (s: Slot) => s.a + Math.sin(sim.clock * 1.3 + s.ph) * 0.25;
    const nitriteDens = 1 - 0.45 * sim.rates.hb;
    NITRITE.forEach((s, i) => {
        place(sim.nitrite.pos, i, wrap(s.u0 + sim.flow * s.sp, PATH_L), wob(s), s.rr, dilation);
        sim.nitrite.scale[i] = clamp01((nitriteDens - s.th) * 10);
    });
    O2.forEach((s, i) => {
        place(sim.o2.pos, i, wrap(s.u0 + sim.flow * s.sp, PATH_L), wob(s), s.rr, dilation);
        sim.o2.scale[i] = clamp01((ctl.sat - s.th) * 8);
    });
    const hDens = 0.05 + 0.95 * acidity(ctl.ph);
    const t = sim.clock;
    H_PLASMA_SLOTS.forEach((s, i) => {
        place(sim.h.pos, i, wrap(s.u0 + sim.flow * s.sp, PATH_L), wob(s), s.rr, dilation);
        sim.h.scale[i] = clamp01((hDens - s.th) * 10);
    });
    H_FIBER_HOME.forEach((home, k) => {
        const i = H_PLASMA + k;
        const ph = H_PLASMA_SLOTS[k % H_PLASMA].ph + k;
        sim.h.pos[i * 3] = home[0] + Math.sin(t * 1.7 + ph) * 0.22;
        sim.h.pos[i * 3 + 1] = home[1] + Math.sin(t * 1.3 + ph * 2) * 0.22;
        sim.h.pos[i * 3 + 2] = home[2] + Math.cos(t * 1.5 + ph) * 0.22;
        sim.h.scale[i] = clamp01((hDens - H_PLASMA_SLOTS[k % H_PLASMA].th) * 10);
    });
};

export const stepSim = (sim: Sim, ctl: Ctl, dtRaw: number) => {
    const dt = Math.min(dtRaw, 0.05);
    const calm = ctl.reduced ? 0.3 : 1;
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
    emit(sim, ctl.stage, dt);
    advanceSparks(sim, dt);

    const sites = sim.sites;
    for (let i = 0; i < NOS_SITES.length; i++) sites.halo[i] = sim.rates.nos * 0.9;
    for (let i = 0; i < XOR_SITES.length; i++) sites.halo[NOS_SITES.length + i] = sim.rates.xor;
    for (let i = 0; i < MB_SITES.length; i++) sites.halo[NOS_SITES.length + XOR_SITES.length + i] = sim.rates.mb * 0.55;
};
