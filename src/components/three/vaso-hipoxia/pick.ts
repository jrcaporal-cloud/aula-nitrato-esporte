import * as THREE from 'three';

/*
 * Raycast do ponteiro numa geometria low-poly de mesmo contorno (o R3F testa a cada movimento do mouse):
 * troca a geometria só durante o teste e devolve a original. Em InstancedMesh, a esfera envolvente é
 * refeita a cada teste porque as instâncias andam (eritrócitos) e o `count` muda.
 */

type Hits = THREE.Intersection[];

export const proxyRaycast = (proxy: THREE.BufferGeometry) =>
    function raycast(this: THREE.Mesh, rc: THREE.Raycaster, hits: Hits): void {
        const own = this.geometry;
        const inst = this as unknown as THREE.InstancedMesh;
        this.geometry = proxy;
        try {
            if (inst.isInstancedMesh) {
                inst.boundingSphere = null;
                THREE.InstancedMesh.prototype.raycast.call(inst, rc, hits);
            } else {
                THREE.Mesh.prototype.raycast.call(this, rc, hits);
            }
        } finally {
            this.geometry = own;
            if (inst.isInstancedMesh) inst.boundingSphere = null;
        }
    };

/** Para o que nunca é clicável (partículas, brilhos, vidro). */
export const noRaycast = (): void => undefined;
