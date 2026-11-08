import type { StructureId } from './structures';
import { weightAt } from './weights';

/*
 * Foco por etapa: 1 = em destaque, valores menores = esmaecido. Uma linha por estrutura, uma coluna
 * por etapa (boca, intestino, glândulas, língua, estômago, plasma, músculo, excreção).
 */

const DIM = 0.32;
const row = (...v: number[]): readonly number[] => v;

export const FOCUS: Readonly<Record<StructureId, readonly number[]>> = {
    lingua: row(1, DIM, 0.5, 1, DIM, DIM, DIM, DIM),
    glandulas: row(DIM, DIM, 1, 0.6, DIM, DIM, DIM, DIM),
    sialina: row(DIM, 0.4, 1, 0.5, DIM, DIM, DIM, DIM),
    esofago: row(0.7, DIM, DIM, DIM, 0.8, DIM, DIM, DIM),
    estomago: row(0.5, 0.5, DIM, DIM, 1, DIM, DIM, DIM),
    intestino: row(DIM, 1, DIM, DIM, DIM, DIM, DIM, DIM),
    vasos: row(DIM, 0.6, 0.55, DIM, 0.4, 1, 0.8, 0.5),
    musculo: row(DIM, DIM, DIM, DIM, DIM, 0.8, 1, DIM),
    rim: row(DIM, DIM, DIM, DIM, DIM, 0.5, DIM, 1),
    bexiga: row(DIM, DIM, DIM, DIM, DIM, DIM, DIM, 1),
};

export const FOCUS_KEYS = Object.keys(FOCUS) as StructureId[];

export const focusAt = (id: StructureId, T: number): number => weightAt(FOCUS[id], T);
