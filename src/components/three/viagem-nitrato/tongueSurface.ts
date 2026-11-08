import * as THREE from 'three';
import { TONGUE, TONGUE_Z } from './anatomy';
import { buildLut, lutPoint } from './tubes';

/* Pontos na superfície da língua (onde ficam as papilas e as bactérias). */

const TONGUE_LUT = buildLut(TONGUE, 140);

/** Ponto na superfície da língua (já com o achatamento em z) em u ao longo do eixo; φ = 0 é o topo. */
export const tonguePoint = (u: number, phi: number, m: number, out: THREE.Vector3): THREE.Vector3 => {
    lutPoint(TONGUE_LUT, u, Math.cos(phi) * m, Math.sin(phi) * m, out);
    out.z *= TONGUE_Z;
    return out;
};
