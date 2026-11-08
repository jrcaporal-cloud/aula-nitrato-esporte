import { rng } from '../shared/math';
import { DATA } from './content';
import { correlatedWith } from './curves';
import type { StructureId } from './content';

/*
 * Corte do membro posterior do rato: 28 músculos em três anéis. A porcentagem de fibras IIb + d/x
 * de cada um é ilustrativa (só gastrocnêmio 91% e sóleo 9% vêm do dossiê); o ganho de fluxo é
 * gerado com correlação exata r = 0,74 com essa porcentagem (FERGUSON2013).
 */

export interface Muscle {
    index: number;
    id: StructureId;
    x: number;
    y: number;
    radius: number;
    /** % de fibras IIb + d/x. */
    pct: number;
    /** Ganho relativo de fluxo com nitrato (unidade arbitrária, 0..1). */
    gain: number;
}

/** Escala do corte (o disco inteiro cabe no quadro com o HUD e o cabeçalho). */
const K = 0.85;
const RINGS = [
    { n: 6, rad: 0.85 * K, r: 0.34 * K, off: 0 },
    { n: 10, rad: 1.65 * K, r: 0.42 * K, off: 18 },
    { n: 12, rad: 2.55 * K, r: 0.44 * K, off: 0 },
] as const;

/** Raio do contorno do membro. */
export const SKIN_R = 3.3 * K;

const SOLEUS_SLOT = 6 + 7;   // anel do meio, ângulo 270°
const GASTRO_SLOT = 16 + 9;  // anel de fora, ângulo 270°

const slots = RINGS.flatMap((ring, ri) =>
    Array.from({ length: ring.n }, (_, k) => {
        const a = ((ring.off + (360 / ring.n) * k) * Math.PI) / 180;
        return { x: ring.rad * Math.cos(a), y: ring.rad * Math.sin(a), r: ring.r, ri };
    }),
);

const buildPct = (): number[] => {
    const rnd = rng(7);
    const others = Array.from({ length: 26 }, (_, i) => 14 + (72 * i) / 25 + (rnd() - 0.5) * 4);
    for (let i = others.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [others[i], others[j]] = [others[j], others[i]];
    }
    const out: number[] = [];
    let k = 0;
    for (let i = 0; i < DATA.limb.muscles; i++) {
        if (i === SOLEUS_SLOT) out.push(DATA.limb.soleusPct);
        else if (i === GASTRO_SLOT) out.push(DATA.limb.gastroPct);
        else out.push(others[k++]);
    }
    return out;
};

const PCT = buildPct();
const GAIN_RAW = correlatedWith(PCT, DATA.limb.r, 3);
const gMin = Math.min(...GAIN_RAW);
const gMax = Math.max(...GAIN_RAW);

export const MUSCLES: readonly Muscle[] = slots.map((s, i) => ({
    index: i,
    id: i === GASTRO_SLOT ? 'gastro' : i === SOLEUS_SLOT ? 'soleo' : 'musculo',
    x: s.x,
    y: s.y,
    radius: s.r,
    pct: PCT[i],
    gain: 0.12 + (0.88 * (GAIN_RAW[i] - gMin)) / (gMax - gMin),
}));

export const GASTRO = MUSCLES[GASTRO_SLOT];
export const SOLEUS = MUSCLES[SOLEUS_SLOT];
