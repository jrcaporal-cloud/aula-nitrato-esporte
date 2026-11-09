import * as THREE from 'three';
import { SARC } from './layout';

/*
 * Raycast em casca low-poly: as estruturas clicáveis continuam com o desenho detalhado, mas o hover
 * (que roda a cada movimento do ponteiro) testa só uma forma simples do mesmo tamanho. O filamento fino,
 * por exemplo, tem ~3.500 triângulos por cópia; a casca dele tem 12.
 */

type RaycastFn = (raycaster: THREE.Raycaster, intersects: THREE.Intersection[]) => void;

/** Raycast que troca a geometria pela casca só durante o teste (serve para Mesh e InstancedMesh). */
export const proxyRaycast = (proxy: THREE.BufferGeometry): RaycastFn =>
    function raycastProxy(this: THREE.Mesh, raycaster: THREE.Raycaster, intersects: THREE.Intersection[]) {
        const real = this.geometry;
        this.geometry = proxy;
        try {
            if (this instanceof THREE.InstancedMesh) THREE.InstancedMesh.prototype.raycast.call(this, raycaster, intersects);
            else THREE.Mesh.prototype.raycast.call(this, raycaster, intersects);
        } finally {
            this.geometry = real;
        }
    };

const along = (r: number, len: number, seg: number): THREE.BufferGeometry =>
    new THREE.CylinderGeometry(r, r, len, seg, 1, false).rotateZ(Math.PI / 2);

/** Cascas compartilhadas por todos os sarcômeros (criadas uma vez no módulo, como as geometrias de geoms.ts). */
export const PICK = {
    thick: proxyRaycast(along(SARC.thickR * 1.6, SARC.thickHalf * 2, 6)),
    thin: proxyRaycast(along(0.035, SARC.thinLen, 6).translate(-SARC.thinLen / 2, 0, 0)),
    zdisc: proxyRaycast(along(SARC.myoR + 0.07, 0.07, 20)),
    tubule: proxyRaycast(new THREE.TorusGeometry(SARC.ringR, 0.05, 4, 20).rotateY(Math.PI / 2)),
    cisterna: proxyRaycast(new THREE.TorusGeometry(SARC.ringR + 0.03, 0.08, 4, 20).rotateY(Math.PI / 2)),
    dhpr: proxyRaycast(new THREE.IcosahedronGeometry(0.055, 0)),
    casq: proxyRaycast(new THREE.IcosahedronGeometry(0.042, 0)),
};
