import gsap from 'gsap';
import type { Preset } from './content';
import type { Ctl } from './sim';

/** Etapa (índice) em que a saturação varre a faixa inteira antes de assentar no pico. */
export const SWEEP_STAGE = 2;

/**
 * Leva a saturação e o pH ao preset da etapa. Na etapa do pico, a saturação desce de ponta a ponta e
 * volta: assim o espectador vê o eritrócito acender e apagar (um pico, não uma rampa).
 */
export const playPreset = (ctl: Ctl, preset: Preset, sweep: boolean, reduced: boolean): gsap.core.Timeline => {
    const tl = gsap.timeline();
    if (reduced) return tl.set(ctl, { sat: preset.sat, ph: preset.ph });
    if (sweep) {
        tl.to(ctl, { sat: 0.92, ph: preset.ph, duration: 0.9, ease: 'power2.inOut' })
            .to(ctl, { sat: 0.1, duration: 5.4, ease: 'sine.inOut' })
            .to(ctl, { sat: preset.sat, duration: 1.8, ease: 'power2.inOut' });
    } else {
        tl.to(ctl, { sat: preset.sat, ph: preset.ph, duration: 1.8, ease: 'power2.inOut' });
    }
    return tl;
};
