import { useLayoutEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SPHERE_HI, SPHERE_PICK } from './geometry';
import type { Mito, Nucleus } from './layout';
import { noRaycast, proxyRaycast } from './pick';
import { useStructure } from './selection';
import type { FiberMats } from './fiberShaders';
import type { SimRef } from './types';
import { setU } from './uniforms';

/* Organelas da fibra: mitocôndrias (cápsulas com cristas, instanciadas) e núcleos periféricos alongados. */

const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const X_AXIS = new THREE.Vector3(1, 0, 0);
const PICK = proxyRaycast(SPHERE_PICK);

interface Props {
    simRef: SimRef;
    mito: readonly Mito[];
    nuclei: readonly Nucleus[];
    mats: FiberMats;
    interactive: boolean;
    fade?: () => number;
}

export const FiberOrganelles = ({ simRef, mito, nuclei, mats, interactive, fade }: Props) => {
    const mitoMesh = useRef<THREE.InstancedMesh>(null);
    const nucMesh = useRef<THREE.InstancedMesh>(null);
    const nucMat = useRef<THREE.MeshStandardMaterial>(null);
    const { bind, lit } = useStructure('mitocondria');
    useLayoutEffect(() => {
        const m = mitoMesh.current;
        if (!m) return;
        mito.forEach((o, i) => {
            Q.setFromAxisAngle(X_AXIS, o.rot);
            m.setMatrixAt(i, M.compose(P.set(o.p[0], o.p[1], o.p[2]), Q, S.set(0.34 * o.s, 0.12 * o.s, 0.12 * o.s)));
        });
        m.instanceMatrix.needsUpdate = true;
        const n = nucMesh.current;
        if (!n) return;
        nuclei.forEach((o, i) => n.setMatrixAt(i, M.compose(P.set(o.p[0], o.p[1], o.p[2]), Q.identity(), S.set(o.len / 2, 0.24, 0.2))));
        n.instanceMatrix.needsUpdate = true;
    }, [mito, nuclei]);
    useFrame(() => {
        const sim = simRef.current;
        setU(mats.mito, 'uNoK', interactive ? Math.min(sim.rates.total * sim.gate.mb, 1) : 0);
        setU(mats.mito, 'uLit', lit && interactive ? 1 : 0);
        if (nucMat.current && fade) nucMat.current.opacity = fade();
    });
    return (
        <>
            <instancedMesh ref={mitoMesh} args={[SPHERE_HI, mats.mito, mito.length]} frustumCulled={false} {...(interactive ? { ...bind, raycast: PICK } : { raycast: noRaycast })} />
            <instancedMesh ref={nucMesh} args={[SPHERE_HI, undefined, nuclei.length]} frustumCulled={false} raycast={noRaycast}>
                <meshStandardMaterial ref={nucMat} color="#7a5fb0" emissive="#2b1a52" emissiveIntensity={0.5} roughness={0.55} transparent={!!fade} />
            </instancedMesh>
        </>
    );
};
