import { useLayoutEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { DEOXY_COLOR, OXY_COLOR } from './content';
import { DISC, SHELL_CAP, SPHERE_HI } from './geometry';
import { ART_BANDS, ART_R0, ART_X0, CAP_R, CAP_X0, CAP_X1, CAP_Y, NOS_SITES, WEDGE_CAP, artR } from './layout';
import { smooth } from '../shared/math';
import { useStructure } from './selection';
import { POOL } from './sim';
import { Tube } from './Tube';
import type { SimRef } from './types';

/*
 * O vaso da fibra rápida: arteríola (músculo liso que dilata com o NO), capilar em corte, sítios da NOS
 * na parede de trás e os eritrócitos (cor = saturação de cada um; o brilho de quem reduz nitrito
 * vem do halo, no Particles).
 */

const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const Q2 = new THREE.Quaternion();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const X_AXIS = new THREE.Vector3(1, 0, 0);
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const Z_AXIS = new THREE.Vector3(0, 0, 1);
const N = new THREE.Vector3();
const OXY = new THREE.Color(OXY_COLOR);
const DEOXY = new THREE.Color(DEOXY_COLOR);
const TMP = new THREE.Color();

const ART_CX = (ART_X0 + CAP_X0) / 2;

const Arteriole = ({ simRef }: { simRef: SimRef }) => {
    const group = useRef<THREE.Group>(null);
    const bands = useRef<THREE.MeshStandardMaterial>(null);
    const { bind, lit } = useStructure('arteriola');
    useFrame(() => {
        const sim = simRef.current;
        const k = artR(sim.dilate) / ART_R0;
        group.current?.scale.set(1, k, k);
        if (bands.current) bands.current.emissiveIntensity = 0.2 + 0.9 * Math.min(sim.ring, 1.2) + (lit ? 0.5 : 0);
    });
    return (
        <group {...bind}>
            <Tube geo={SHELL_CAP} x0={ART_X0} x1={CAP_X0} y={CAP_Y} r={ART_R0} wedge={WEDGE_CAP} outer="#E7A3B8" inner="#241626" rim="#F5C2D1"
                outerOpacity={0.2} innerOpacity={0.6} lit={lit} groupRef={group}>
                {ART_BANDS.map(x => (
                    <mesh key={x} geometry={SHELL_CAP} position={[x - ART_CX, 0, 0]} scale={[0.34, 1.09, 1.09]} renderOrder={3}>
                        <meshStandardMaterial ref={x === ART_BANDS[0] ? bands : undefined} color="#9B5A74" emissive={C.no} emissiveIntensity={0.2} roughness={0.6} side={THREE.DoubleSide} />
                    </mesh>
                ))}
            </Tube>
        </group>
    );
};

const NosSites = ({ simRef }: { simRef: SimRef }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const mat = useRef<THREE.MeshStandardMaterial>(null);
    const { bind, lit } = useStructure('nos');
    useLayoutEffect(() => {
        const m = mesh.current;
        if (!m) return;
        NOS_SITES.forEach((p, i) => {
            N.set(0, p[1] - CAP_Y, p[2]).normalize();
            m.setMatrixAt(i, M.compose(P.set(p[0], p[1], p[2]), Q.setFromUnitVectors(Y_AXIS, N), S.set(0.24, 0.12, 0.24)));
        });
        m.instanceMatrix.needsUpdate = true;
    }, []);
    useFrame(() => {
        if (mat.current) mat.current.emissiveIntensity = 0.1 + 1.6 * simRef.current.rates.nos + (lit ? 0.5 : 0);
    });
    return (
        <instancedMesh ref={mesh} args={[SPHERE_HI, undefined, NOS_SITES.length]} {...bind}>
            <meshStandardMaterial ref={mat} color="#566DAE" emissive={C.no} roughness={0.45} />
        </instancedMesh>
    );
};

const RedCells = ({ simRef }: { simRef: SimRef }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const { bind, lit } = useStructure('hemacia');
    useFrame(({ clock }) => {
        const m = mesh.current;
        if (!m) return;
        const p = simRef.current.rbc;
        const t = clock.elapsedTime;
        for (let i = 0; i < p.n; i++) {
            const s = p.scale[i] * 0.42;
            if (s <= 0.004) { m.setMatrixAt(i, M.makeScale(0, 0, 0)); continue; }
            const ph = i * 1.7;
            Q.setFromAxisAngle(X_AXIS, t * 0.7 + ph);
            Q2.setFromAxisAngle(Z_AXIS, Math.PI / 2 + Math.sin(t * 0.9 + ph) * 0.4);
            m.setMatrixAt(i, M.compose(P.set(p.pos[i * 3], p.pos[i * 3 + 1], p.pos[i * 3 + 2]), Q.multiply(Q2), S.set(s, s, s)));
            m.setColorAt(i, TMP.copy(DEOXY).lerp(OXY, smooth(p.sat[i])));
        }
        m.instanceMatrix.needsUpdate = true;
        if (m.instanceColor) m.instanceColor.needsUpdate = true;
    });
    return (
        <instancedMesh ref={mesh} args={[DISC, undefined, POOL.rbc]} frustumCulled={false} {...bind}>
            <meshStandardMaterial color="#ffffff" roughness={0.5} emissive="#7A1230" emissiveIntensity={lit ? 0.9 : 0.15} />
        </instancedMesh>
    );
};

export const Vessel = ({ simRef }: { simRef: SimRef }) => {
    const { bind, lit } = useStructure('capilar');
    return (
        <group>
            <Arteriole simRef={simRef} />
            <group {...bind}>
                <Tube geo={SHELL_CAP} x0={CAP_X0} x1={CAP_X1} y={CAP_Y} r={CAP_R} wedge={WEDGE_CAP} outer="#E7A3B8" inner="#241626" rim="#F5C2D1"
                    outerOpacity={0.22} innerOpacity={0.65} lit={lit} />
            </group>
            <NosSites simRef={simRef} />
            <RedCells simRef={simRef} />
        </group>
    );
};
