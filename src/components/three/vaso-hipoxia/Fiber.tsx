import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { CAP_FIB, MYOFIBRIL, SHELL_FIB, SPHERE_HI, makeStriationTexture } from './geometry';
import { FIB_R, FIB_X0, FIB_X1, FIB_Y, MITOCHONDRIA, MYOFIBRILS, WEDGE_FIB } from './layout';
import { useStructure } from './selection';
import { FiberSites } from './FiberSites';
import { Tube } from './Tube';
import type { CtlRef, SimRef } from './types';

/*
 * A fibra rápida em corte: sarcolema, miofibrilas estriadas ao fundo e mitocôndrias no sarcoplasma
 * (a fatia aberta da frente é o palco da mioglobina, da XOR e dos íons).
 */

const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const X_AXIS = new THREE.Vector3(1, 0, 0);
const LEN = FIB_X1 - FIB_X0;
const CX = (FIB_X0 + FIB_X1) / 2;

const Myofibrils = () => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const tex = useMemo(() => makeStriationTexture(), []);
    useLayoutEffect(() => {
        const m = mesh.current;
        if (!m) return;
        MYOFIBRILS.forEach((f, i) => m.setMatrixAt(i, M.compose(P.set(CX, f.y, f.z), Q.identity(), S.set(LEN - 0.3, 0.27, 0.27))));
        m.instanceMatrix.needsUpdate = true;
    }, []);
    useLayoutEffect(() => () => tex.dispose(), [tex]);
    return (
        <instancedMesh ref={mesh} args={[MYOFIBRIL, undefined, MYOFIBRILS.length]} raycast={() => undefined}>
            <meshStandardMaterial map={tex} roughness={0.6} emissive="#5B2238" emissiveIntensity={0.2} />
        </instancedMesh>
    );
};

const Mitochondria = () => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const { bind, lit } = useStructure('mitocondria');
    useLayoutEffect(() => {
        const m = mesh.current;
        if (!m) return;
        MITOCHONDRIA.forEach((o, i) => {
            Q.setFromAxisAngle(X_AXIS, o.rot);
            m.setMatrixAt(i, M.compose(P.set(o.p[0], o.p[1], o.p[2]), Q, S.set(0.7 * o.s, 0.3 * o.s, 0.3 * o.s)));
        });
        m.instanceMatrix.needsUpdate = true;
    }, []);
    return (
        <instancedMesh ref={mesh} args={[SPHERE_HI, undefined, MITOCHONDRIA.length]} {...bind}>
            <meshStandardMaterial color="#C9B79C" roughness={0.5} emissive="#7A5A2E" emissiveIntensity={lit ? 1.2 : 0.35} />
        </instancedMesh>
    );
};

export const Fiber = ({ simRef, ctlRef }: { simRef: SimRef; ctlRef: CtlRef }) => {
    const { bind, lit } = useStructure('fibra');
    return (
        <group>
            <group {...bind}>
                <Tube geo={SHELL_FIB} x0={FIB_X0} x1={FIB_X1} y={FIB_Y} r={FIB_R} wedge={WEDGE_FIB} outer="#8E97BE" inner="#241A30" rim="#C7D2FE"
                    outerOpacity={0.3} innerOpacity={0.92} lit={lit} />
                {[FIB_X0, FIB_X1].map(x => (
                    <mesh key={x} geometry={CAP_FIB} position={[x, FIB_Y, 0]} scale={[1, FIB_R, FIB_R]} renderOrder={1}>
                        <meshBasicMaterial color="#1E1626" transparent opacity={0.6} side={THREE.DoubleSide} depthWrite={false} />
                    </mesh>
                ))}
            </group>
            <Myofibrils />
            <Mitochondria />
            <FiberSites simRef={simRef} ctlRef={ctlRef} />
        </group>
    );
};
