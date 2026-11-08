import { lerp } from '../shared/math';
import type { Cond } from './colors';
import type { StationId } from './content';

/** Fibra do sarcômero (só importa na etapa das fibras). */
export type Fiber = 'II' | 'I';
export type Vec3 = readonly [number, number, number];
export interface Pose { pos: Vec3; tgt: Vec3 }

/** Proporção do quadro 3D (largura/altura) para a qual as poses foram desenhadas (1280×720 com o HUD). */
const REF_ASPECT = 1.83;

/**
 * Quadros mais estreitos recuam a câmera, para o que cabe em largura continuar cabendo. Quadros altos (telas
 * grandes) aproximam um pouco: os rótulos têm tamanho fixo em pixels e sobra espaço para eles.
 */
export const fitPose = (pose: Pose, aspect: number, heightPx = 468): Pose => {
    const tall = Math.min(Math.max((heightPx - 468) / 360, 0), 1);
    const k = Math.max(1, REF_ASPECT / Math.max(aspect, 0.5)) * (1 - 0.16 * tall);
    const [px, py, pz] = pose.pos;
    const [tx, ty, tz] = pose.tgt;
    return { pos: [tx + (px - tx) * k, ty + (py - ty) * k, tz + (pz - tz) * k], tgt: pose.tgt };
};

/** Um sarcômero na tela: condição (quem tomou o quê) e tipo de fibra. */
export interface UnitSpec { id: string; cond: Cond; fiber: Fiber; col: 0 | 1 }

export const UNITS: readonly UnitSpec[] = [
    { id: 'II-placebo', cond: 'placebo', fiber: 'II', col: 0 },
    { id: 'II-nitrate', cond: 'nitrate', fiber: 'II', col: 0 },
    { id: 'I-placebo', cond: 'placebo', fiber: 'I', col: 1 },
    { id: 'I-nitrate', cond: 'nitrate', fiber: 'I', col: 1 },
];

/** Medidas do sarcômero em unidades de cena (esquemático, escalas fora de proporção). */
export const SARC = {
    halfRelaxed: 1.6,
    halfContracted: 1.2,
    thickHalf: 0.78,
    bare: 0.1,
    thinLen: 1.15,
    latt: 0.3,
    thickR: 0.05,
    thinR: 0.024,
    myoR: 0.47,
    srR: 0.64,
    ringR: 0.52,
    tubuleOffset: 0.34,
    cisternaGap: 0.15,
} as const;

/** Meio comprimento do sarcômero (distância da linha Z ao centro) conforme a ativação 0..1. */
export const halfLen = (act: number): number => lerp(SARC.halfRelaxed, SARC.halfContracted, act);

/** Cada estação da cena fica num ponto do eixo x; a câmera voa de uma à outra. */
export const STATION_X: Readonly<Record<StationId, number>> = { a: 0, c: 38, d: 76 };

export const ROW_Y: Readonly<Record<Cond, number>> = { placebo: 0.95, nitrate: -0.95 };

/** Posição (no sarcômero) dos tubos de estoque de PCr e de Cr. */
export const TANK_X = { pcr: 2.3, cr: 2.62 } as const;
export const COL_X = [-2.05, 2.05] as const;

/** Origem do sarcômero; `mix` 0 = coluna única, 1 = duas colunas (etapa das fibras). */
export const unitOrigin = (spec: UnitSpec, mix: number): Vec3 =>
    [lerp(0, COL_X[spec.col], mix), ROW_Y[spec.cond], 0];

/** Sítios do retículo hexagonal visto em corte: 7 filamentos grossos e 12 finos por meio-sarcômero. */
const hexRing = (radius: number, offsetDeg: number): readonly (readonly [number, number])[] =>
    Array.from({ length: 6 }, (_, k) => {
        const a = ((offsetDeg + 60 * k) * Math.PI) / 180;
        return [radius * Math.cos(a), radius * Math.sin(a)] as const;
    });

export const THICK_SITES: readonly (readonly [number, number])[] = [[0, 0], ...hexRing(SARC.latt, 0)];
export const THIN_SITES: readonly (readonly [number, number])[] = [
    ...hexRing(SARC.latt / Math.sqrt(3), 30),
    ...hexRing((2 * SARC.latt) / Math.sqrt(3), 30),
];
