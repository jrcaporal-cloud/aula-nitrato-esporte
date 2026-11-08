import * as THREE from 'three';
import { WEDGE_CAP, WEDGE_FIB } from './layout';

/* Geometrias compartilhadas, criadas uma vez no carregamento do módulo (raio e comprimento unitários). */

const alongX = (g: THREE.BufferGeometry) => g.rotateZ(-Math.PI / 2);

/** Casca de raio 1 e comprimento 1 ao longo de x, sem a fatia da frente (θ = 0 aponta para +z). */
const shell = (w: number) => alongX(new THREE.CylinderGeometry(1, 1, 1, 56, 1, true, w, Math.PI * 2 - 2 * w));

export const SHELL_CAP = shell(WEDGE_CAP);
export const SHELL_FIB = shell(WEDGE_FIB);

/** Tampa da ponta da fibra, com a mesma abertura (o círculo fica no plano YZ). */
export const CAP_FIB = new THREE.CircleGeometry(1, 48, WEDGE_FIB, Math.PI * 2 - 2 * WEDGE_FIB).rotateY(-Math.PI / 2);

/** Aresta do corte. */
export const RIM = alongX(new THREE.CylinderGeometry(0.035, 0.035, 1, 6));

export const MYOFIBRIL = alongX(new THREE.CylinderGeometry(1, 1, 1, 14, 1));

/** Eritrócito: disco bicôncavo (o eixo do disco é y). */
export const DISC = new THREE.LatheGeometry(
    [[0, 0.1], [0.2, 0.15], [0.45, 0.25], [0.7, 0.28], [0.88, 0.2], [1, 0], [0.88, -0.2], [0.7, -0.28], [0.45, -0.25], [0.2, -0.15], [0, -0.1]]
        .map(([x, y]) => new THREE.Vector2(x, y)),
    22,
);

export const SPHERE = new THREE.SphereGeometry(1, 12, 9);
export const SPHERE_HI = new THREE.SphereGeometry(1, 22, 15);
export const OCTA = new THREE.OctahedronGeometry(1, 0);
/** Anel da XOR (eixo z). */
export const RING = new THREE.TorusGeometry(1, 0.28, 8, 24);

/** Faixas do sarcômero (linha Z escura, banda I clara, banda A escura) para as miofibrilas. */
export const makeStriationTexture = (): THREE.Texture => {
    const c = document.createElement('canvas');
    c.width = 4;
    c.height = 64;
    const g = c.getContext('2d');
    if (g) {
        g.fillStyle = '#d8a1ad';
        g.fillRect(0, 0, 4, 64);
        g.fillStyle = '#7d4357';
        g.fillRect(0, 18, 4, 28);
        g.fillStyle = '#9b5a6e';
        g.fillRect(0, 29, 4, 6);
        g.fillStyle = '#4a2433';
        g.fillRect(0, 0, 4, 3);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 14);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
};
