import { MB_SITES, NOS_SPECS, XOR_SITES, nosPoint } from './layout';
import type { Pool, Sim } from './sim';
import { spawnNo } from './sparks';

/*
 * A causa visível de cada NO: uma esfera âmbar (nitrito) voa para o eritrócito, a mioglobina ou a XOR e,
 * ao chegar, um clarão e uma pluma de NO saem dali; uma esfera azul (O₂) voa para a NOS e faz o mesmo.
 */

export interface Timed extends Pool { age: Float32Array; life: Float32Array; cursor: number }
/** `tk` = tipo do alvo (0 eritrócito, 1 mioglobina, 2 XOR, 3 NOS); `ti` = índice dele. */
export interface Feed extends Timed { from: Float32Array; tk: Uint8Array; ti: Uint16Array }

const HIDDEN_Y = -1e4;
const NO_PER_ARRIVAL = [3, 2, 2, 2] as const;
const OUT: [number, number, number] = [0, 0, 0];

const target = (sim: Sim, kind: number, idx: number): [number, number, number] => {
    if (kind === 0) { const p = sim.rbc.pos; OUT[0] = p[idx * 3]; OUT[1] = p[idx * 3 + 1]; OUT[2] = p[idx * 3 + 2]; }
    else if (kind === 3) { const p = nosPoint(idx, sim.dilate); OUT[0] = p[0]; OUT[1] = p[1]; OUT[2] = p[2]; }
    else { const p = kind === 1 ? MB_SITES[idx] : XOR_SITES[idx]; OUT[0] = p[0]; OUT[1] = p[1]; OUT[2] = p[2]; }
    return OUT;
};

/** O ponto visível mais perto (em x) de `x` num reservatório de plasma; -1 se não houver. */
const nearestVisible = (pool: Pool, x: number): number => {
    let best = -1;
    let bd = 3;
    for (let i = 0; i < pool.n; i++) {
        if (pool.scale[i] < 0.5 || pool.hold[i] > 0) continue;
        const d = Math.abs(pool.pos[i * 3] - x);
        if (d < bd) { bd = d; best = i; }
    }
    return best;
};

const startFeed = (sim: Sim, feed: Feed, from: Pool | null, src: number, kind: number, idx: number) => {
    const i = feed.cursor;
    feed.cursor = (i + 1) % feed.n;
    const [tx, ty, tz] = target(sim, kind, idx);
    if (from && src >= 0) {
        feed.from[i * 3] = from.pos[src * 3]; feed.from[i * 3 + 1] = from.pos[src * 3 + 1]; feed.from[i * 3 + 2] = from.pos[src * 3 + 2];
        from.hold[src] = 1.4;
    } else {
        const a = sim.rand() * Math.PI * 2;
        feed.from[i * 3] = tx + Math.cos(a) * 0.8; feed.from[i * 3 + 1] = ty + Math.sin(a) * 0.8; feed.from[i * 3 + 2] = tz + 0.5;
    }
    feed.tk[i] = kind; feed.ti[i] = idx; feed.age[i] = 0; feed.life[i] = 0.38 + sim.rand() * 0.2;
};

const flash = (pool: Timed, x: number, y: number, z: number) => {
    const i = pool.cursor;
    pool.cursor = (i + 1) % pool.n;
    pool.pos[i * 3] = x; pool.pos[i * 3 + 1] = y; pool.pos[i * 3 + 2] = z;
    pool.age[i] = 0; pool.life[i] = 0.42;
};

const arrive = (sim: Sim, kind: number, x: number, y: number, z: number, canHome: boolean) => {
    flash(kind === 3 ? sim.flashB : sim.flashW, x, y, z);
    const n = NO_PER_ARRIVAL[kind];
    for (let k = 0; k < n; k++) {
        if (kind === 3) spawnNo(sim, x, y, z + 0.1, 0.55, -0.25, 1.7, canHome, 0.5);
        else if (kind === 0) spawnNo(sim, x, y, z, 0.8, -0.35, 1.5, canHome);
        else spawnNo(sim, x, y, z, 0.6, -0.1, 1.5, canHome, 0.25);
    }
};

export const emit = (sim: Sim, dt: number) => {
    const r = sim.rates;
    const acc = sim.acc;
    acc[0] += 14 * r.nos * dt;
    acc[1] += 26 * r.hb * dt;
    acc[2] += 16 * r.mb * dt;
    acc[3] += 9 * r.xor * dt;
    const pick = (n: number) => Math.floor(sim.rand() * n);
    for (let g = 0; acc[0] >= 1 && g < 6; g++) {
        acc[0] -= 1;
        const site = pick(NOS_SPECS.length);
        startFeed(sim, sim.feedB, sim.o2, nearestVisible(sim.o2, nosPoint(site, sim.dilate)[0]), 3, site);
    }
    for (let g = 0; acc[1] >= 1 && g < 6; g++) {
        acc[1] -= 1;
        const c = pick(sim.rbc.n);
        if (sim.rbc.scale[c] < 0.5) continue;
        startFeed(sim, sim.feedA, sim.nitrite, nearestVisible(sim.nitrite, sim.rbc.pos[c * 3]), 0, c);
    }
    for (let g = 0; acc[2] >= 1 && g < 6; g++) { acc[2] -= 1; startFeed(sim, sim.feedA, null, -1, 1, pick(MB_SITES.length)); }
    for (let g = 0; acc[3] >= 1 && g < 4; g++) { acc[3] -= 1; startFeed(sim, sim.feedA, null, -1, 2, pick(XOR_SITES.length)); }
};

export const advanceFeeds = (sim: Sim, dt: number) => {
    const canHome = sim.slow > 0.3;
    for (const feed of [sim.feedA, sim.feedB]) {
        for (let i = 0; i < feed.n; i++) {
            if (feed.age[i] >= feed.life[i]) { feed.scale[i] = 0; feed.pos[i * 3 + 1] = HIDDEN_Y; continue; }
            feed.age[i] += dt;
            const u = Math.min(feed.age[i] / feed.life[i], 1);
            const [tx, ty, tz] = target(sim, feed.tk[i], feed.ti[i]);
            const e = u * u * (3 - 2 * u);
            const o = i * 3;
            feed.pos[o] = feed.from[o] + (tx - feed.from[o]) * e;
            feed.pos[o + 1] = feed.from[o + 1] + (ty - feed.from[o + 1]) * e;
            feed.pos[o + 2] = feed.from[o + 2] + (tz - feed.from[o + 2]) * e;
            feed.scale[i] = 1 - 0.4 * u;
            if (u >= 1) { feed.scale[i] = 0; feed.pos[i * 3 + 1] = HIDDEN_Y; arrive(sim, feed.tk[i], tx, ty, tz, canHome); }
        }
    }
};

export const advanceFlashes = (sim: Sim, dt: number) => {
    for (const f of [sim.flashW, sim.flashB]) {
        for (let i = 0; i < f.n; i++) {
            if (f.age[i] >= f.life[i]) { f.halo[i] = 0; f.alpha[i] = 0; continue; }
            f.age[i] += dt;
            const u = Math.min(f.age[i] / f.life[i], 1);
            f.halo[i] = 0.5 + 1.5 * Math.sqrt(u);
            f.alpha[i] = (1 - u) * (1 - u);
        }
    }
};
