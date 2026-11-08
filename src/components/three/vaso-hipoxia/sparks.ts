import { ART_TARGET } from './layout';
import type { Pool, Sim } from './sim';

/*
 * NO: pluma de difusão. Cada partícula nasce no redutor, deriva (agitação + viés), cresce e esmaece,
 * como uma nuvem que se espalha. Na última etapa uma parte segue para a arteriola e acende o músculo liso.
 */

const HIDDEN_Y = -1e4;
const hide = (p: Pool, i: number) => { p.scale[i] = 0; p.alpha[i] = 0; p.pos[i * 3 + 1] = HIDDEN_Y; };

/** Solta uma partícula de NO em (x, y, z); `bz` empurra para dentro do lúmen/sarcoplasma. */
export const spawnNo = (sim: Sim, x: number, y: number, z: number, speed: number, biasY: number, life: number, canHome: boolean, biasZ = 0) => {
    const s = sim.no;
    const i = s.cursor;
    s.cursor = (i + 1) % s.n;
    const r = sim.rand;
    const th = r() * Math.PI * 2;
    const c = r() * 2 - 1;
    const sn = Math.sqrt(1 - c * c);
    s.vel[i * 3] = sn * Math.cos(th) * speed;
    s.vel[i * 3 + 1] = c * speed + biasY;
    s.vel[i * 3 + 2] = sn * Math.sin(th) * speed + biasZ;
    s.pos[i * 3] = x;
    s.pos[i * 3 + 1] = y;
    s.pos[i * 3 + 2] = z;
    s.age[i] = 0;
    s.seed[i] = r() * 6.28;
    s.home[i] = canHome && r() < 0.38 ? 1 : 0;
    s.life[i] = s.home[i] ? 2.0 + r() * 0.4 : life * (0.8 + 0.4 * r());
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
            if (Math.hypot(dx, dy, dz) < 0.4) { sim.ring = Math.min(sim.ring + 0.14, 1.4); s.age[i] = s.life[i]; hide(s, i); continue; }
            const k = 1 / Math.max(s.life[i] - s.age[i], 0.12);
            s.pos[o] += dx * k * dt;
            s.pos[o + 1] += (dy * k + Math.sin(s.age[i] * 13 + s.seed[i]) * 0.9) * dt;
            s.pos[o + 2] += (dz * k + Math.cos(s.age[i] * 11 + s.seed[i]) * 0.6) * dt;
        } else {
            const damp = 1 - 0.9 * dt;
            for (let k = 0; k < 3; k++) s.vel[o + k] = (s.vel[o + k] + (sim.rand() - 0.5) * 3 * dt) * damp;
            s.pos[o] += s.vel[o] * dt;
            s.pos[o + 1] += s.vel[o + 1] * dt;
            s.pos[o + 2] += s.vel[o + 2] * dt;
        }
        const fadeIn = Math.min(1, s.age[i] * 9);
        s.scale[i] = Math.pow(1 - u, 0.6) * fadeIn;
        s.halo[i] = 0.35 + 1.15 * Math.sqrt(u);          // a nuvem se espalha
        s.alpha[i] = Math.pow(1 - u, 1.3) * fadeIn;
    }
};
