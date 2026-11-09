import { useLayoutEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { clamp01 } from '../shared/math';
import { RING, SPHERE_HI, SPHERE_PICK } from './geometry';
import { proxyRaycast } from './pick';
import { MB_SITES, XOR_SITES } from './layout';
import { useStructure } from './selection';
import type { CtlRef, SimRef } from './types';

/* Mioglobina (esferas que escurecem com a hipóxia e acendem como redutase) e XOR (anel que só liga em hipóxia). */

const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const Q = new THREE.Quaternion();
const OXY_MB = new THREE.Color('#E8584E');
const DEOXY_MB = new THREE.Color('#4A2238');
const TMP = new THREE.Color();
const XOR_OFF = new THREE.Color('#566074');
const XOR_ON = new THREE.Color('#F1F5F9');
const Z_AXIS = new THREE.Vector3(0, 0, 1);
const PICK = proxyRaycast(SPHERE_PICK);

const Myoglobin = ({ simRef, ctlRef }: { simRef: SimRef; ctlRef: CtlRef }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const mat = useRef<THREE.MeshStandardMaterial>(null);
    const { bind, lit } = useStructure('mioglobina');
    useLayoutEffect(() => {
        const m = mesh.current;
        if (!m) return;
        for (let i = 0; i < MB_SITES.length; i++) {
            const p = MB_SITES[i];
            m.setMatrixAt(i, M.compose(P.set(p[0], p[1], p[2]), Q.identity(), S.set(0.12, 0.12, 0.12)));
        }
        m.instanceMatrix.needsUpdate = true;
    }, []);
    const lastSat = useRef(-1);
    useFrame(() => {
        const m = mesh.current;
        if (!m) return;
        // a saturação da fibra acompanha a do sangue, um pouco abaixo (o músculo é o destino do O₂)
        const sat = clamp01(ctlRef.current.sat - 0.12);
        if (Math.abs(sat - lastSat.current) > 1e-3) {
            lastSat.current = sat;
            TMP.copy(DEOXY_MB).lerp(OXY_MB, sat);
            for (let i = 0; i < MB_SITES.length; i++) m.setColorAt(i, TMP);
            if (m.instanceColor) m.instanceColor.needsUpdate = true;
        }
        if (mat.current) mat.current.emissiveIntensity = 0.12 + 1.4 * simRef.current.rates.mb + (lit ? 0.6 : 0);
    });
    return (
        <instancedMesh ref={mesh} args={[SPHERE_HI, undefined, MB_SITES.length]} raycast={PICK} {...bind}>
            <meshStandardMaterial ref={mat} color="#ffffff" emissive={C.no} roughness={0.4} />
        </instancedMesh>
    );
};

const Xor = ({ simRef }: { simRef: SimRef }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const mat = useRef<THREE.MeshStandardMaterial>(null);
    const { bind, lit } = useStructure('xor');
    useFrame(({ clock }) => {
        const m = mesh.current;
        if (!m) return;
        const on = clamp01(simRef.current.rates.xor * 1.4);
        const s = 0.24 + 0.1 * on;
        for (let i = 0; i < XOR_SITES.length; i++) {
            const p = XOR_SITES[i];
            // eixo e posição em vetores separados (antes o eixo sobrescrevia a posição e os 4 anéis caíam no mesmo ponto)
            Q.setFromAxisAngle(Z_AXIS, clock.elapsedTime * 0.6 * on + i);
            m.setMatrixAt(i, M.compose(P.set(p[0], p[1], p[2]), Q, S.set(s, s, s)));
        }
        m.instanceMatrix.needsUpdate = true;
        if (mat.current) {
            mat.current.color.copy(XOR_OFF).lerp(XOR_ON, on);
            mat.current.emissiveIntensity = 0.05 + 2.2 * on + (lit ? 0.6 : 0);
        }
    });
    return (
        <instancedMesh ref={mesh} args={[RING, undefined, XOR_SITES.length]} frustumCulled={false} {...bind}>
            <meshStandardMaterial ref={mat} color="#566074" emissive={C.hypoxia} roughness={0.4} />
        </instancedMesh>
    );
};

export const FiberSites = ({ simRef, ctlRef }: { simRef: SimRef; ctlRef: CtlRef }) => (
    <>
        <Myoglobin simRef={simRef} ctlRef={ctlRef} />
        <Xor simRef={simRef} />
    </>
);
