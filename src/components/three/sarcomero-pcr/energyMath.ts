import { lerp, rng, seg, smooth } from '../shared/math';
import { SARC, TANK_X, THICK_SITES } from './layout';

/*
 * Ciclo de energia de um sarcômero: o ATP vai da linha M (onde fica a creatina-quinase) até uma cabeça de
 * miosina, vira ADP + Pi, o ADP volta à linha M e a creatina-quinase passa o fosfato da PCr para ele
 * (flash), devolvendo ATP e deixando creatina livre. Cada "vaga" repete esse ciclo com fase própria.
 */

export const N_SLOT = 16;
export const CYCLE_S = 2.6;

type V3 = readonly [number, number, number];

export interface Slot { head: V3; mline: V3; pcrFrom: V3; crTo: V3; piDir: V3; phase: number }

const rnd = rng(29);
export const SLOTS: readonly Slot[] = Array.from({ length: N_SLOT }, () => {
    const [cy, cz] = THICK_SITES[Math.floor(rnd() * THICK_SITES.length)];
    const sgn = rnd() < 0.5 ? -1 : 1;
    const x = sgn * (SARC.bare + 0.08 + Math.floor(rnd() * 6) * 0.095);
    const a = rnd() * Math.PI * 2;
    const pa = rnd() * Math.PI * 2;
    return {
        head: [x, cy + 0.17 * Math.cos(a), cz + 0.17 * Math.sin(a)],
        mline: [(rnd() - 0.5) * 0.06, (rnd() - 0.5) * 0.5, (rnd() - 0.5) * 0.5],
        pcrFrom: [TANK_X.pcr, -0.35 + rnd() * 0.7, 0.05],
        crTo: [TANK_X.cr, -0.35 + rnd() * 0.7, 0.05],
        piDir: [Math.cos(pa) * 0.1, Math.cos(a) * 0.32, Math.sin(a) * 0.32],
        phase: rnd(),
    };
});

export const ease = (x: number): number => smooth(Math.min(Math.max(x, 0), 1));

type Out3 = [number, number, number];

export interface Parts {
    atp: Out3; atpS: number; atpIsAtp: boolean;
    pcr: Out3; pcrS: number; pcrIsPcr: boolean;
    pi: Out3; piS: number;
    flash: number; flashAt: V3;
}

/** Interpola `a`→`b` em `k` (com arco `lift` em z) escrevendo em `out`, sem alocar. */
const lerp3 = (out: Out3, a: V3, b: V3, k: number, lift = 0): void => {
    out[0] = lerp(a[0], b[0], k);
    out[1] = lerp(a[1], b[1], k);
    out[2] = lerp(a[2], b[2], k) + lift * Math.sin(Math.PI * k);
};
const copy3 = (out: Out3, a: V3): void => { out[0] = a[0]; out[1] = a[1]; out[2] = a[2]; };

/** Posição e escala de cada partícula da vaga no ponto `u` (0..1) do ciclo. Escreve em `out` (sem alocar). */
export const partsAt = (s: Slot, u: number, out: Parts): Parts => {
    const grow = smooth(seg(u, 0, 0.06));
    const fade = 1 - smooth(seg(u, 0.86, 1));
    if (u < 0.3) { lerp3(out.atp, s.mline, s.head, ease(u / 0.3)); out.atpIsAtp = true; out.atpS = grow; }
    else if (u < 0.62) { lerp3(out.atp, s.head, s.mline, ease((u - 0.3) / 0.32)); out.atpIsAtp = false; out.atpS = 0.9; }
    else { copy3(out.atp, s.mline); out.atpIsAtp = true; out.atpS = fade; }

    if (u >= 0.36 && u < 0.62) {
        lerp3(out.pcr, s.pcrFrom, s.mline, ease((u - 0.36) / 0.26), 0.7); out.pcrIsPcr = true; out.pcrS = smooth(seg(u, 0.36, 0.42));
    } else if (u >= 0.62 && u < 0.94) {
        lerp3(out.pcr, s.mline, s.crTo, ease((u - 0.62) / 0.32), 0.7); out.pcrIsPcr = false; out.pcrS = 1 - smooth(seg(u, 0.88, 0.94));
    } else { copy3(out.pcr, s.mline); out.pcrIsPcr = true; out.pcrS = 0; }

    const kp = seg(u, 0.3, 0.85);
    const e = ease(kp);
    out.pi[0] = s.head[0] + s.piDir[0] * e;
    out.pi[1] = s.head[1] + s.piDir[1] * e;
    out.pi[2] = s.head[2] + s.piDir[2] * e;
    out.piS = kp > 0 && kp < 1 ? Math.sin(Math.PI * kp) : 0;
    out.flash = u > 0.6 && u < 0.76 ? Math.sin((Math.PI * (u - 0.6)) / 0.16) : 0;
    out.flashAt = s.mline;
    return out;
};

export const makeParts = (): Parts => ({
    atp: [0, 0, 0], atpS: 0, atpIsAtp: true, pcr: [0, 0, 0], pcrS: 0, pcrIsPcr: true, pi: [0, 0, 0], piS: 0, flash: 0, flashAt: [0, 0, 0],
});
