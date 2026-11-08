import { rng } from '../shared/math';
import { SARC, THICK_SITES } from './layout';

/** Uma cabeça de miosina: onde fica no filamento grosso, para onde olha e em que fase do ciclo começa. */
export interface HeadDef { cy: number; cz: number; cos: number; sin: number; x: number; sgn: 1 | -1; phase: number; gate: number }

/** 7 filamentos × 2 metades × 7 coroas × 3 cabeças = 294. */
export const HEADS: readonly HeadDef[] = (() => {
    const rnd = rng(11);
    const out: HeadDef[] = [];
    THICK_SITES.forEach(([cy, cz], ci) => {
        for (const sgn of [1, -1] as const) {
            for (let k = 0; k < 7; k++) {
                for (let j = 0; j < 3; j++) {
                    const th = j * 2.094 + k * 0.7 + ci;
                    out.push({ cy, cz, cos: Math.cos(th), sin: Math.sin(th), x: sgn * (SARC.bare + 0.06 + k * 0.095), sgn, phase: rnd(), gate: rnd() });
                }
            }
        }
    });
    return out;
})();

/** Ângulo da cabeça (rad) no ciclo p 0..1: golpe de força até 0,6, depois solta e rearma. */
export const stroke = (p: number): number => (p < 0.6 ? -0.5 + (1.2 * p) / 0.6 : 0.7 - (1.2 * (p - 0.6)) / 0.4);
