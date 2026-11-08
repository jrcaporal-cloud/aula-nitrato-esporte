import * as THREE from 'three';
import { WEDGE_CAP, WEDGE_FIB } from './layout';

/* Geometrias compartilhadas, criadas uma vez no carregamento do módulo (raio e comprimento unitários). */

const alongX = (g: THREE.BufferGeometry) => g.rotateZ(-Math.PI / 2);

/** Casca de raio 1 e comprimento 1 ao longo de x, sem a fatia da frente (θ = 0 aponta para +z). */
const shell = (w: number, segs: number) => alongX(new THREE.CylinderGeometry(1, 1, 1, 72, segs, true, w, Math.PI * 2 - 2 * w));

/** Muitos segmentos em x: o raio é levado pelo vertex shader (afunilamento e dilatação). */
export const SHELL_CAP = shell(WEDGE_CAP, 150);
export const SHELL_FIB = shell(WEDGE_FIB, 4);

/** Tampa da ponta da fibra, com a mesma abertura (o círculo fica no plano YZ). */
export const CAP_FIB = new THREE.CircleGeometry(1, 48, WEDGE_FIB, Math.PI * 2 - 2 * WEDGE_FIB).rotateY(-Math.PI / 2);

export const MYOFIBRIL = alongX(new THREE.CylinderGeometry(1, 1, 1, 16, 1));

/** Eritrócito: disco bicôncavo (perfil de Evans–Fung; o eixo do disco é y). */
export const DISC = (() => {
    const half = (r: number) => 0.5 * Math.sqrt(Math.max(1 - r * r, 0)) * (0.2072 + 2.0026 * r * r - 1.1228 * r ** 4);
    const rs = Array.from({ length: 19 }, (_, i) => i / 18);
    const top = rs.map(r => new THREE.Vector2(r, half(r)));
    const bottom = [...rs].reverse().map(r => new THREE.Vector2(r, -half(r)));
    return new THREE.LatheGeometry([...top, ...bottom.slice(1)], 40);
})();

export const SPHERE = new THREE.SphereGeometry(1, 12, 9);
export const SPHERE_HI = new THREE.SphereGeometry(1, 24, 16);
export const OCTA = new THREE.OctahedronGeometry(1, 0);
/** Anel da XOR (eixo z). */
export const RING = new THREE.TorusGeometry(1, 0.22, 10, 32);
/** Placa unitária (streaks, flashes). */
export const QUAD = new THREE.PlaneGeometry(1, 1);
