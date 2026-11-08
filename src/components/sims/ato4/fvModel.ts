/**
 * Modelo ilustrativo da relação força-velocidade e da parábola de potência (slide 52).
 * Âncoras MEDIDAS (Coggan 2015, extensores do joelho): velocidade máxima 13,1 → 14,5 rad/s e
 * potência máxima 7,44 → 7,90 W/kg. A forma entre as âncoras é uma hipérbole de Hill normalizada
 * (valores ilustrativos); a curvatura da curva com nitrato é resolvida para reproduzir 7,90 W/kg.
 * A força em velocidade zero (F0) é a mesma nas duas curvas.
 */

export const V0_PLACEBO = 13.1;
export const V0_NITRATE = 14.5;
export const P_PLACEBO = 7.44;
export const P_NITRATE = 7.9;
/** Velocidade (rad/s) em que o pico de potência foi medido (+4%). */
export const V_PEAK_TESTED = 6.28;

const CURVATURE_PLACEBO = 2.2;

/** Torque relativo à força máxima (0–1) na velocidade v. */
const relForce = (v: number, v0: number, c: number): number => {
    if (v >= v0) return 0;
    return (1 - v / v0) / (1 + (c * v) / v0);
};

const peakOf = (v0: number, c: number): { v: number; value: number } => {
    let best = { v: 0, value: 0 };
    for (let i = 1; i <= 400; i += 1) {
        const v = (v0 * i) / 400;
        const value = v * relForce(v, v0, c);
        if (value > best.value) best = { v, value };
    }
    return best;
};

/** Curvatura da curva com nitrato que dá exatamente a razão de potência medida. */
const solveCurvature = (): number => {
    const scale = P_PLACEBO / peakOf(V0_PLACEBO, CURVATURE_PLACEBO).value;
    let lo = 0;
    let hi = 40;
    for (let i = 0; i < 60; i += 1) {
        const mid = (lo + hi) / 2;
        if (scale * peakOf(V0_NITRATE, mid).value > P_NITRATE) lo = mid;
        else hi = mid;
    }
    return (lo + hi) / 2;
};

const POWER_SCALE = P_PLACEBO / peakOf(V0_PLACEBO, CURVATURE_PLACEBO).value;
const CURVATURE_NITRATE = solveCurvature();

export type Arm = 'placebo' | 'nitrate';

const PARAMS: Record<Arm, { v0: number; c: number }> = {
    placebo: { v0: V0_PLACEBO, c: CURVATURE_PLACEBO },
    nitrate: { v0: V0_NITRATE, c: CURVATURE_NITRATE },
};

/** Torque relativo (% da força máxima) na velocidade v. */
export const torquePct = (arm: Arm, v: number): number => 100 * relForce(v, PARAMS[arm].v0, PARAMS[arm].c);

/** Potência (W/kg) na velocidade v. */
export const powerAt = (arm: Arm, v: number): number => POWER_SCALE * v * relForce(v, PARAMS[arm].v0, PARAMS[arm].c);

export const peakVelocity = (arm: Arm): number => peakOf(PARAMS[arm].v0, PARAMS[arm].c).v;
