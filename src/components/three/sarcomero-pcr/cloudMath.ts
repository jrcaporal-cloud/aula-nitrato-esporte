import { lerp, rng, seg, smooth } from '../shared/math';
import { SARC, THICK_SITES } from './layout';
import type { Cloud } from './points';

/* Matemática por quadro das nuvens de um sarcômero (funções de módulo que escrevem nos arrays tipados). */

export const N_CA = 84;
export const N_SPARK = 40;

interface CaSite { side: 1 | -1; gap: -1 | 1; homeA: number; homeJ: number; tx: number; tr: number; ta: number; wob: number }

const CA_SITES: readonly CaSite[] = (() => {
    const rnd = rng(5);
    return Array.from({ length: N_CA }, (_, i) => ({
        side: i % 2 ? 1 : -1,
        gap: (Math.floor(i / 2) % 2 ? 1 : -1),
        homeA: rnd() * Math.PI * 2,
        homeJ: (rnd() - 0.5) * 0.06,
        tx: (rnd() * 2 - 1) * 0.92,
        tr: 0.04 + rnd() * 0.38,
        ta: rnd() * Math.PI * 2,
        wob: rnd() * 6.28,
    }));
})();

/**
 * Ca²⁺: guardado nas cisternas (pontos pequenos); com `frac` (fração liberada, 0..1) os pontos saem para
 * o meio dos filamentos e voltam quando a ativação cai. `bigger` aumenta os pontos liberados.
 */
export const writeCalcium = (cloud: Cloud, h: number, frac: number, bigger: number, time: number): void => {
    for (let i = 0; i < N_CA; i++) {
        const s = CA_SITES[i];
        const k = smooth(seg(frac, (i + 0.5) / N_CA, (i + 0.5) / N_CA + 0.1));
        const hx = s.side * (h - SARC.tubuleOffset) + s.gap * SARC.cisternaGap + s.homeJ;
        const hr = SARC.ringR + 0.03;
        const w = k * 0.03;
        const o = i * 3;
        cloud.pos[o] = lerp(hx, s.tx * (h - 0.12), k) + w * Math.sin(time * 3 + s.wob);
        cloud.pos[o + 1] = lerp(hr * Math.cos(s.homeA), s.tr * Math.cos(s.ta), k) + w * Math.sin(time * 2.3 + s.wob * 2);
        cloud.pos[o + 2] = lerp(hr * Math.sin(s.homeA), s.tr * Math.sin(s.ta), k) + w * Math.cos(time * 2.7 + s.wob);
        cloud.scale[i] = lerp(0.45, bigger, k);
    }
};

export interface SparkState {
    age: Float32Array;
    life: Float32Array;
    vel: Float32Array;
    alive: Uint8Array;
    acc: number;
    cursor: number;
}

export const makeSparks = (): SparkState => ({
    age: new Float32Array(N_SPARK),
    life: new Float32Array(N_SPARK),
    vel: new Float32Array(N_SPARK * 3),
    alive: new Uint8Array(N_SPARK),
    acc: 0,
    cursor: 0,
});

const spawn = (st: SparkState, cloud: Cloud, slot: number): void => {
    const [cy, cz] = THICK_SITES[Math.floor(Math.random() * THICK_SITES.length)];
    const x = (Math.random() < 0.5 ? -1 : 1) * (0.14 + Math.random() * 0.6);
    const a = Math.random() * Math.PI * 2;
    const o = slot * 3;
    cloud.pos[o] = x;
    cloud.pos[o + 1] = cy + 0.09 * Math.cos(a);
    cloud.pos[o + 2] = cz + 0.09 * Math.sin(a);
    st.vel[o] = (Math.random() - 0.5) * 0.1;
    st.vel[o + 1] = 0.3 * Math.cos(a) + 0.1;
    st.vel[o + 2] = 0.3 * Math.sin(a);
    st.age[slot] = 0;
    st.life[slot] = 0.45 + Math.random() * 0.25;
    st.alive[slot] = 1;
};

/** Faíscas brancas de ATP: nascem junto aos filamentos grossos à taxa `rate` (por segundo) e sobem apagando. */
export const stepSparks = (st: SparkState, cloud: Cloud, dt: number, rate: number): void => {
    st.acc += rate * dt;
    while (st.acc >= 1) {
        st.acc -= 1;
        let slot = -1;
        for (let k = 0; k < N_SPARK; k++) {
            const j = (st.cursor + k) % N_SPARK;
            if (!st.alive[j]) { slot = j; break; }
        }
        if (slot < 0) break;
        st.cursor = (slot + 1) % N_SPARK;
        spawn(st, cloud, slot);
    }
    for (let i = 0; i < N_SPARK; i++) {
        if (!st.alive[i]) { cloud.scale[i] = 0; continue; }
        st.age[i] += dt;
        if (st.age[i] >= st.life[i]) { st.alive[i] = 0; cloud.scale[i] = 0; continue; }
        const o = i * 3;
        cloud.pos[o] += st.vel[o] * dt;
        cloud.pos[o + 1] += st.vel[o + 1] * dt;
        cloud.pos[o + 2] += st.vel[o + 2] * dt;
        cloud.scale[i] = Math.sin((Math.PI * st.age[i]) / st.life[i]);
    }
};
