import { FOCUS_KEYS, focusAt } from './focus';
import type { StructureId } from './structures';
import { SWEEP_S, STEP_CLOCK, excreted, muscleNitrate, plasmaNitrate, plasmaNitrite } from './pk';
import { WEIGHTS, WEIGHT_KEYS, weightAt, type WeightKey } from './weights';

/*
 * Estado lido por quadro pela cena e pelo HUD, numa ref (sem re-render do React):
 *  - `in`: entradas que só mudam quando o usuário mexe nos controles (escritas num efeito do modal);
 *  - `f`: o quadro atual, escrito uma vez por quadro pelo relógio da cena (`SceneClock`).
 */

export interface VnInputs {
    /** Bochecho de clorexidina ligado. */
    chx: boolean;
}

export interface VnFrame {
    /** Tempo da aula (etapa contínua, animada na transição de câmera). */
    T: number;
    /** Relógio da dose, em horas. */
    hours: number;
    /** Segundos desde que a câmera assentou na etapa. */
    arrive: number;
    /** Clorexidina suavizada (0 = sem, 1 = com). */
    chx: number;
    /** Presença de cada sistema (0 … 1). */
    w: Record<WeightKey, number>;
    /** Destaque de cada estrutura na etapa (1 = foco, ~0,3 = esmaecida). */
    focus: Record<StructureId, number>;
    nitrate: number;
    nitrite: number;
    muscle: number;
    excreted: number;
}

export interface VnState { in: VnInputs; f: VnFrame }
export type VnStateRef = { readonly current: VnState };

const zeroWeights = (): Record<WeightKey, number> =>
    Object.fromEntries(WEIGHT_KEYS.map(k => [k, 0])) as Record<WeightKey, number>;

const zeroFocus = (): Record<StructureId, number> =>
    Object.fromEntries(FOCUS_KEYS.map(k => [k, 0.5])) as Record<StructureId, number>;

export const makeState = (): VnState => ({
    in: { chx: false },
    f: { T: 0, hours: 0, arrive: 0, chx: 0, w: zeroWeights(), focus: zeroFocus(), nitrate: 0, nitrite: 0, muscle: 0, excreted: 0 },
});

const easeOut = (x: number) => 1 - (1 - x) * (1 - x);

export const writeFrame = (st: VnState, T: number, dt: number): void => {
    const f = st.f;
    f.T = T;
    for (const k of WEIGHT_KEYS) f.w[k] = weightAt(WEIGHTS[k], T);
    for (const k of FOCUS_KEYS) f.focus[k] = focusAt(k, T);
    const step = Math.min(Math.max(Math.round(T), 0), STEP_CLOCK.length - 1);
    f.arrive = Math.abs(T - step) < 0.02 ? f.arrive + dt : 0;
    const [h0, h1] = STEP_CLOCK[step];
    const target = h0 + (h1 - h0) * easeOut(Math.min(f.arrive / SWEEP_S, 1));
    f.hours += (target - f.hours) * (1 - Math.exp(-dt * 4));
    f.chx += ((st.in.chx ? 1 : 0) - f.chx) * (1 - Math.exp(-dt * 2.4));
    f.nitrate = plasmaNitrate(f.hours);
    f.nitrite = plasmaNitrite(f.hours);
    f.muscle = muscleNitrate(f.hours);
    f.excreted = excreted(f.hours);
};
