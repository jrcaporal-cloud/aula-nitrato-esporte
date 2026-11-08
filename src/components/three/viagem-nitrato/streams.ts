import * as THREE from 'three';
import {
    BLADDER, BRANCH_S, CAPILLARIES, CAP_X, DRIP, DUCT_P, DUCT_S, ESOPHAGUS, FEMORAL, GUT, GUT_COLLECTOR, ORAL_SURFACE, POUR_ARC,
    RENAL, STOMACH_PATH, TIP_LOOP, TRUNK, URETER,
} from './anatomy';
import { URINE_48H } from './pk';
import { leg, route, routeAt, routePoint, type Route } from './routes';
import type { VnFrame } from './state';
import { buildLut, lutPoint, nearestU, pipe } from './tubes';
import type { WeightKey } from './weights';

/*
 * As correntes de íons: cada uma é um grupo de partículas que percorre uma rota, com a densidade
 * (nível) e a espécie (nitrato/nitrito) decididas por quadro a partir do relógio da dose.
 */

export type Species = 1 | 2;
export const NITRATE: Species = 1;
export const NITRITE: Species = 2;

export interface IonSeed { i: number; r: number; u: number; ph: number; sp: number; a: number; b: number; axis: THREE.Vector3; spin: number }

export interface StreamDef {
    weight: WeightKey;
    count: number;
    /** Segundos por volta completa da rota. */
    period: number;
    /** Sem desvanecer nas pontas (íons que ficam parados, como na bexiga). */
    resident?: boolean;
    place: (sd: IonSeed, s: number, t: number, out: THREE.Vector3) => void;
    level: (f: VnFrame) => number;
    species: (f: VnFrame, sd: IonSeed, s: number) => Species;
    /** Posição s da rota em que o nitrato vira nitrito (dá um pulso de tamanho). */
    convertAt?: number;
}

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const nitrateOnly = (): Species => NITRATE;
const plasmaLevel = (f: VnFrame) => Math.max(f.nitrate, 0.8 * f.nitrite);
/** Fração de nitrito no plasma: até 55% no pico, −25% com clorexidina (KAPIL2013). */
const plasmaSpecies = (f: VnFrame, sd: IonSeed): Species => (sd.r < f.nitrite * 0.55 * (1 - 0.25 * f.chx) ? NITRITE : NITRATE);

/** Posição dentro do tubo da rota, com um balanço leve. */
const along = (r: Route, spread: number) => (sd: IonSeed, s: number, t: number, out: THREE.Vector3) =>
    routePoint(r, s, sd.a * spread + 0.1 * Math.sin(t * 2.1 + sd.ph * 6.3), sd.b * spread + 0.1 * Math.cos(t * 1.7 + sd.ph * 6.3), out);

const GUT_LUT = buildLut(GUT, 220);
const PORTAL = route(leg(TRUNK, 0, 0.2));
const ORAL_JOIN_P = nearestU(ORAL_SURFACE.curve, V(-1.35, 10.6, 0));
const ORAL_JOIN_S = nearestU(ORAL_SURFACE.curve, V(-2.7, 10.7, 0));
const TRUNK_AT_BRANCH = nearestU(TRUNK.curve, V(2.4, 7.2, -0.9));
const TRUNK_AT_RENAL = nearestU(TRUNK.curve, V(3.6, 1.8, -0.9));
const TRUNK_AT_FEMORAL = nearestU(TRUNK.curve, V(3.7, -3.0, -0.9));

const GLAND_IN_P = pipe([[1.75, 9.3, -0.1], [1.85, 9.85, 0], [1.3, 10.1, 0]], 0.35);
const GLAND_IN_S = pipe([[-1.6, 8.1, -0.1], [-1.9, 8.3, 0], [-1.8, 8.6, 0]], 0.3);
const KIDNEY_IN = pipe([[2.85, 1.8, -0.1], [2.55, 1.4, -0.05], [2.5, 1.1, -0.1]], 0.2);

const swallowRoute = route(leg(POUR_ARC), leg(ORAL_SURFACE), leg(ESOPHAGUS), leg(STOMACH_PATH), leg(GUT, 0, 0.5));
const salivaP = route(leg(GLAND_IN_P), leg(DUCT_P), leg(DRIP), leg(ORAL_SURFACE, ORAL_JOIN_P, 1), leg(ESOPHAGUS), leg(STOMACH_PATH), leg(GUT, 0, 0.3));
const salivaS = route(leg(GLAND_IN_S), leg(DUCT_S), leg(TIP_LOOP), leg(ORAL_SURFACE, ORAL_JOIN_S, 1), leg(ESOPHAGUS), leg(STOMACH_PATH), leg(GUT, 0, 0.3));
const legRoutes = CAPILLARIES.map((cap, k) => route(
    leg(TRUNK, 0, TRUNK_AT_FEMORAL),
    leg(FEMORAL, 0, nearestU(FEMORAL.curve, V(CAP_X[k], -6.75, -0.9))),
    leg(cap),
));

/** Na saliva, o nitrato vira nitrito na língua: 85% sem clorexidina, −90% com ela (KAPIL2013). */
const salivaSpecies = (convertAt: number) => (f: VnFrame, sd: IonSeed, s: number): Species =>
    (s > convertAt && sd.r < 0.85 * (1 - 0.9 * f.chx) ? NITRITE : NITRATE);

const absorbPlace = (sd: IonSeed, s: number, _t: number, out: THREE.Vector3): void => {
    const u0 = 0.1 + sd.u * 0.5;
    if (s < 0.3) {
        // atravessa a parede, para trás (−z), em direção ao capilar
        const k = s / 0.3;
        lutPoint(GUT_LUT, u0, sd.a * 0.4 * (1 - k), sd.b * 0.4 * (1 - k) - 2.6 * k, out);
    } else if (s < 0.62) {
        const k = (s - 0.3) / 0.32;
        const e = k * k * (3 - 2 * k);
        lutPoint(GUT_LUT, u0, 0, -2.6, out).lerp(V(GUT_COLLECTOR[0], GUT_COLLECTOR[1], GUT_COLLECTOR[2]), e);
    } else {
        routePoint(PORTAL, (s - 0.62) / 0.38, sd.a * 0.4, sd.b * 0.4, out);
    }
};

const bladderPlace = (sd: IonSeed, _s: number, t: number, out: THREE.Vector3): void => {
    const rad = BLADDER.r * 0.62 * Math.cbrt(sd.u);
    out.set(sd.a, sd.b, Math.sin(sd.ph * 6.3)).normalize().multiplyScalar(rad);
    out.x += Math.sin(t * 0.9 + sd.ph * 6.3) * 0.04;
    out.y += Math.cos(t * 0.8 + sd.ph * 6.3) * 0.04;
    out.add(V(BLADDER.pos[0], BLADDER.pos[1], BLADDER.pos[2]));
};

const convP = routeAt(salivaP, 3, 0.4);
const convS = routeAt(salivaS, 3, 0.55);

export const STREAMS: readonly StreamDef[] = [
    { weight: 'swallow', count: 30, period: 24, place: along(swallowRoute, 0.55), level: () => 1, species: nitrateOnly },
    { weight: 'absorb', count: 26, period: 7, place: absorbPlace, level: f => Math.max(0.35, 1 - f.nitrate * 0.3), species: nitrateOnly },
    { weight: 'plasmaP', count: 16, period: 16, place: along(route(leg(TRUNK)), 0.6), level: plasmaLevel, species: plasmaSpecies },
    { weight: 'plasmaS', count: 12, period: 16, place: along(route(leg(TRUNK, 0, TRUNK_AT_BRANCH), leg(BRANCH_S)), 0.6), level: plasmaLevel, species: plasmaSpecies },
    { weight: 'plasmaK', count: 12, period: 11, place: along(route(leg(TRUNK, 0, TRUNK_AT_RENAL), leg(RENAL)), 0.6), level: plasmaLevel, species: plasmaSpecies },
    ...legRoutes.map<StreamDef>(r => ({ weight: 'plasmaL', count: 7, period: 15, place: along(r, 0.6), level: plasmaLevel, species: plasmaSpecies })),
    { weight: 'salivaP', count: 30, period: 15, place: along(salivaP, 0.8), level: f => f.nitrate, species: salivaSpecies(convP), convertAt: convP },
    { weight: 'salivaS', count: 22, period: 15, place: along(salivaS, 0.8), level: f => f.nitrate, species: salivaSpecies(convS), convertAt: convS },
    { weight: 'urine', count: 22, period: 9, place: along(route(leg(KIDNEY_IN), leg(URETER)), 0.5), level: () => 1, species: nitrateOnly },
    { weight: 'bladder', count: 36, period: 1, resident: true, place: bladderPlace, level: f => Math.min(f.excreted / URINE_48H, 1), species: nitrateOnly },
];

export const TOTAL_IONS = STREAMS.reduce((n, s) => n + s.count, 0);
