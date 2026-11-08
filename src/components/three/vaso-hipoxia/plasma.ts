import { clamp01, rng, smooth } from '../shared/math';
import { CAP_X0, CAP_X1, CAP_Y, H_FIBER_HOME, PATH_L, PATH_X0, SLOW_CAP_R, SLOW_CAP_Y, tubeR } from './layout';
import { acidity, hbYield } from './model';
import type { Ctl, Sim } from './sim';

/* Posição de cada partícula que só flutua: é função do tempo e do percurso (nada é guardado por quadro). */

interface Slot { u0: number; a: number; rr: number; sp: number; th: number; ph: number }

/** Velocidade relativa em perfil parabólico: rápida no eixo (rr = 0), lenta junto da parede (rr → 1). */
const profile = (rr: number) => 0.5 + 0.85 * (1 - rr * rr);

const slots = (n: number, seed: number, rrMin: number, rrMax: number): Slot[] => {
    const r = rng(seed);
    return Array.from({ length: n }, (_, i) => {
        const rr = rrMin + Math.sqrt(r()) * (rrMax - rrMin);
        return { u0: ((i + r() * 0.6) / n) * PATH_L, a: r() * Math.PI * 2, rr, sp: profile(rr) * (0.96 + r() * 0.08), th: ((i * 7) % n) / n, ph: r() * Math.PI * 2 };
    });
};

const POOLS = { nitrite: 56, o2: 44, h: 72, rbc: 24, rbcB: 8 } as const;
const H_PLASMA = 36;
const NITRITE = slots(POOLS.nitrite, 11, 0.12, 0.85);
const O2 = slots(POOLS.o2, 12, 0.12, 0.85);
const H_SLOTS = slots(H_PLASMA, 13, 0.12, 0.85);
const CELLS = slots(POOLS.rbc, 14, 0.04, 0.3).map((s, i) => ({ ...s, a: i * 2.399 }));
const CELLS_B = slots(POOLS.rbcB, 15, 0.1, 0.5).map((s, i) => ({ ...s, a: i * 2.399 }));

const wrap = (u: number, len: number) => ((u % len) + len) % len;

/** Some perto das pontas do percurso (a parede também se apaga ali). */
export const edge = (x: number) => smooth(clamp01((x - PATH_X0) / 2)) * (1 - smooth(clamp01((x - (CAP_X1 - 2)) / 2)));

const place = (arr: Float32Array, i: number, u: number, a: number, rr: number, dil: number) => {
    const x = PATH_X0 + u;
    const R = tubeR(x, dil) * rr;
    arr[i * 3] = x;
    arr[i * 3 + 1] = CAP_Y + Math.cos(a) * R;
    arr[i * 3 + 2] = Math.sin(a) * R;
    return x;
};

export const updateCells = (sim: Sim, ctl: Ctl) => {
    const p = sim.rbc;
    const dens = 0.45 + 0.55 * sim.dilate;
    CELLS.forEach((s, i) => {
        const x = place(p.pos, i, wrap(s.u0 + sim.flow * s.sp, PATH_L), s.a, s.rr, sim.dilate);
        const prog = clamp01((x - CAP_X0) / (CAP_X1 - CAP_X0));
        const sat = clamp01(ctl.sat + (0.5 - prog) * 0.14 + Math.sin(s.ph * 3) * 0.03);
        p.sat[i] = sat;
        const vis = clamp01((dens - s.th) * 8) * edge(x);
        p.scale[i] = vis;
        p.halo[i] = vis * Math.pow(hbYield(sat, ctl.ph) * sim.gate.hb, 0.4);
    });
};

export const updateSlowCells = (sim: Sim) => {
    const p = sim.rbcB;
    const len = CAP_X1 - CAP_X0;
    CELLS_B.forEach((s, i) => {
        const x = CAP_X0 + wrap(s.u0 * (len / PATH_L) + sim.flowB * s.sp, len);
        const R = SLOW_CAP_R * s.rr;
        p.pos[i * 3] = x;
        p.pos[i * 3 + 1] = SLOW_CAP_Y + Math.cos(s.a) * R;
        p.pos[i * 3 + 2] = Math.sin(s.a) * R;
        p.sat[i] = 0.62;
        p.scale[i] = sim.slow * smooth(clamp01((x - CAP_X0) / 1.5)) * (1 - smooth(clamp01((x - (CAP_X1 - 1.5)) / 1.5)));
    });
};

/** Partícula "consumida" (virou uma esfera que voa para o redutor): some até `hold` zerar. */
const shown = (sim: Sim, pool: { scale: Float32Array; hold: Float32Array }, i: number, v: number) => {
    if (pool.hold[i] > 0) pool.hold[i] -= sim.dt;
    pool.scale[i] = pool.hold[i] > 0 ? 0 : v;
};

export const updatePlasma = (sim: Sim, ctl: Ctl) => {
    const wob = (s: Slot) => s.a + Math.sin(sim.clock * 1.3 + s.ph) * 0.25;
    const nitriteDens = 1 - 0.45 * sim.rates.hb;
    NITRITE.forEach((s, i) => {
        const x = place(sim.nitrite.pos, i, wrap(s.u0 + sim.flow * s.sp, PATH_L), wob(s), s.rr, sim.dilate);
        shown(sim, sim.nitrite, i, clamp01((nitriteDens - s.th) * 10) * edge(x));
    });
    O2.forEach((s, i) => {
        const x = place(sim.o2.pos, i, wrap(s.u0 + sim.flow * s.sp, PATH_L), wob(s), s.rr, sim.dilate);
        shown(sim, sim.o2, i, clamp01((ctl.sat - s.th) * 8) * edge(x));
    });
    const hDens = 0.05 + 0.95 * acidity(ctl.ph);
    const t = sim.clock;
    H_SLOTS.forEach((s, i) => {
        const x = place(sim.h.pos, i, wrap(s.u0 + sim.flow * s.sp, PATH_L), wob(s), s.rr, sim.dilate);
        sim.h.scale[i] = clamp01((hDens - s.th) * 10) * edge(x);
    });
    H_FIBER_HOME.forEach((home, k) => {
        const i = H_PLASMA + k;
        const ph = H_SLOTS[k % H_PLASMA].ph + k;
        sim.h.pos[i * 3] = home[0] + Math.sin(t * 1.7 + ph) * 0.22;
        sim.h.pos[i * 3 + 1] = home[1] + Math.sin(t * 1.3 + ph * 2) * 0.22;
        sim.h.pos[i * 3 + 2] = home[2] + Math.cos(t * 1.5 + ph) * 0.22;
        sim.h.scale[i] = clamp01((hDens - H_SLOTS[k % H_PLASMA].th) * 10);
    });
};
