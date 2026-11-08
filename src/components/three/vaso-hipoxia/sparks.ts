import { ART_TARGET, MB_SITES, NOS_SITES, XOR_SITES } from './layout';
import { POOL, type Pool, type Sim } from './sim';

/* Faíscas de NO: nascem nas fontes (NOS, eritrócitos, mioglobina, XOR), derivam e somem; na última etapa
   uma parte segue para a arteríola e acende o músculo liso. */

const HIDDEN_Y = -1e4;
const hide = (p: Pool, i: number) => { p.scale[i] = 0; p.pos[i * 3 + 1] = HIDDEN_Y; };

const spawn = (sim: Sim, x: number, y: number, z: number, speed: number, biasY: number, life: number, canHome: boolean) => {
    const s = sim.no;
    const i = s.cursor;
    s.cursor = (i + 1) % s.n;
    const r = sim.rand;
    const th = r() * Math.PI * 2;
    const c = r() * 2 - 1;
    const sn = Math.sqrt(1 - c * c);
    s.vel[i * 3] = sn * Math.cos(th) * speed;
    s.vel[i * 3 + 1] = c * speed + biasY;
    s.vel[i * 3 + 2] = sn * Math.sin(th) * speed;
    s.pos[i * 3] = x;
    s.pos[i * 3 + 1] = y;
    s.pos[i * 3 + 2] = z;
    s.age[i] = 0;
    s.seed[i] = r() * 6.28;
    s.home[i] = canHome && r() < 0.38 ? 1 : 0;
    s.life[i] = s.home[i] ? 2.0 + r() * 0.4 : life * (0.8 + 0.4 * r());
};

const pick = (sim: Sim, list: readonly (readonly [number, number, number])[]) => list[Math.floor(sim.rand() * list.length)];

export const emit = (sim: Sim, stage: number, dt: number) => {
    const r = sim.rates;
    const canHome = stage >= 5;
    const acc = sim.acc;
    acc[0] += 26 * r.nos * dt;
    acc[1] += 52 * r.hb * dt;
    acc[2] += 30 * r.mb * dt;
    acc[3] += 16 * r.xor * dt;
    for (let guard = 0; acc[0] >= 1 && guard < 8; guard++) {
        acc[0] -= 1;
        const p = pick(sim, NOS_SITES);
        spawn(sim, p[0], p[1], p[2] + 0.1, 0.7, -0.35, 1.5, canHome);
    }
    for (let guard = 0; acc[1] >= 1 && guard < 8; guard++) {
        acc[1] -= 1;
        const i = Math.floor(sim.rand() * POOL.rbc);
        const c = sim.rbc;
        if (c.scale[i] > 0.5) spawn(sim, c.pos[i * 3], c.pos[i * 3 + 1], c.pos[i * 3 + 2], 0.8, -0.35, 1.3, canHome);
    }
    for (let guard = 0; acc[2] >= 1 && guard < 8; guard++) {
        acc[2] -= 1;
        const p = pick(sim, MB_SITES);
        spawn(sim, p[0], p[1], p[2], 0.6, 0, 1.4, canHome);
    }
    for (let guard = 0; acc[3] >= 1 && guard < 6; guard++) {
        acc[3] -= 1;
        const p = pick(sim, XOR_SITES);
        spawn(sim, p[0], p[1], p[2] + 0.3, 0.7, 0, 1.5, canHome);
    }
};

export const advanceSparks = (sim: Sim, dt: number) => {
    const s = sim.no;
    const [tx, ty, tz] = ART_TARGET;
    for (let i = 0; i < s.n; i++) {
        if (s.age[i] >= s.life[i]) { hide(s, i); continue; }
        s.age[i] += dt;
        if (s.age[i] >= s.life[i]) { hide(s, i); continue; }
        const o = i * 3;
        const u = s.age[i] / s.life[i];
        if (s.home[i]) {
            const dx = tx - s.pos[o];
            const dy = ty - s.pos[o + 1];
            const dz = tz - s.pos[o + 2];
            const dist = Math.hypot(dx, dy, dz);
            if (dist < 0.4) { sim.ring = Math.min(sim.ring + 0.14, 1.4); s.age[i] = s.life[i]; hide(s, i); continue; }
            const k = 1 / Math.max(s.life[i] - s.age[i], 0.12);
            const w = Math.sin(s.age[i] * 13 + s.seed[i]) * 0.9;
            s.pos[o] += dx * k * dt;
            s.pos[o + 1] += (dy * k + w) * dt;
            s.pos[o + 2] += (dz * k + Math.cos(s.age[i] * 11 + s.seed[i]) * 0.6) * dt;
        } else {
            const damp = 1 - 0.9 * dt;
            s.vel[o] = (s.vel[o] + (sim.rand() - 0.5) * 3 * dt) * damp;
            s.vel[o + 1] = (s.vel[o + 1] + (sim.rand() - 0.5) * 3 * dt) * damp;
            s.vel[o + 2] = (s.vel[o + 2] + (sim.rand() - 0.5) * 3 * dt) * damp;
            s.pos[o] += s.vel[o] * dt;
            s.pos[o + 1] += s.vel[o + 1] * dt;
            s.pos[o + 2] += s.vel[o + 2] * dt;
        }
        s.scale[i] = Math.pow(1 - u, 0.6) * Math.min(1, s.age[i] * 12);
    }
};

