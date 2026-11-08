import { useLayoutEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { SPHERE_HI } from './geometry';
import { CAP_Y, NOS_SPECS, nosPoint } from './layout';
import { useStructure } from './selection';
import type { SimRef } from './types';

/* NOS endotelial: cúpulas azuis coladas na parede (seguem o raio vivo do vaso); apagam quando falta O₂. */

const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const N = new THREE.Vector3();
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const ON = new THREE.Color(C.o2);
const OFF = new THREE.Color('#3d4766');
const TMP = new THREE.Color();

export const NosSites = ({ simRef }: { simRef: SimRef }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const mat = useRef<THREE.MeshStandardMaterial>(null);
    const { bind, lit } = useStructure('nos');
    useLayoutEffect(() => { if (mesh.current) mesh.current.instanceMatrix.setUsage(THREE.DynamicDrawUsage); }, []);
    useFrame(() => {
        const m = mesh.current;
        if (!m) return;
        const sim = simRef.current;
        NOS_SPECS.forEach((_, i) => {
            const p = nosPoint(i, sim.dilate);
            N.set(0, p[1] - CAP_Y, p[2]).normalize().negate();
            m.setMatrixAt(i, M.compose(P.set(p[0], p[1], p[2]), Q.setFromUnitVectors(Y_AXIS, N), S.set(0.27, 0.12, 0.27)));
        });
        m.instanceMatrix.needsUpdate = true;
        if (mat.current) {
            const k = sim.rates.nos;
            mat.current.color.copy(TMP.copy(OFF).lerp(ON, k));
            mat.current.emissiveIntensity = 0.08 + 1.7 * k + (lit ? 0.6 : 0);
        }
    });
    return (
        <instancedMesh ref={mesh} args={[SPHERE_HI, undefined, NOS_SPECS.length]} frustumCulled={false} {...bind}>
            <meshStandardMaterial ref={mat} color={C.o2} emissive={C.o2} roughness={0.35} />
        </instancedMesh>
    );
};
