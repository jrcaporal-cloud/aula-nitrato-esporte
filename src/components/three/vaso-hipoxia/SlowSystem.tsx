import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { smooth } from '../shared/math';
import { DEOXY_COLOR, OXY_COLOR } from './content';
import { DISC, MYOFIBRIL, SHELL_CAP, SHELL_FIB, makeStriationTexture } from './geometry';
import { CAP_X0, CAP_X1, FIB_X0, FIB_X1, SLOW_CAP_R, SLOW_CAP_Y, SLOW_FIB_R, SLOW_FIB_Y, SLOW_MYOFIBRILS, WEDGE_CAP, WEDGE_FIB } from './layout';
import { useStructure } from './selection';
import { POOL } from './sim';
import { Tube } from './Tube';
import type { SimRef } from './types';

/*
 * A fibra lenta (tipo I) e o capilar dela: entram só na última etapa, para comparar com a fibra rápida.
 * O fluxo aqui NÃO muda com o NO (no rato, a PO₂ microvascular do sóleo ficou igual).
 */

const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const Q2 = new THREE.Quaternion();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const TMP = new THREE.Color();
const X_AXIS = new THREE.Vector3(1, 0, 0);
const Z_AXIS = new THREE.Vector3(0, 0, 1);
const CX = (FIB_X0 + FIB_X1) / 2;

const SlowCells = ({ simRef }: { simRef: SimRef }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    useFrame(({ clock }) => {
        const m = mesh.current;
        if (!m) return;
        const p = simRef.current.rbcB;
        const t = clock.elapsedTime;
        for (let i = 0; i < p.n; i++) {
            const s = p.scale[i] * 0.22;
            if (s <= 0.004) { m.setMatrixAt(i, M.makeScale(0, 0, 0)); continue; }
            Q.setFromAxisAngle(X_AXIS, t * 0.6 + i * 1.3);
            Q2.setFromAxisAngle(Z_AXIS, Math.PI / 2 + Math.sin(t * 0.8 + i) * 0.4);
            m.setMatrixAt(i, M.compose(P.set(p.pos[i * 3], p.pos[i * 3 + 1], p.pos[i * 3 + 2]), Q.multiply(Q2), S.set(s, s, s)));
            m.setColorAt(i, TMP.set(DEOXY_COLOR).lerp(TMP.set(OXY_COLOR), 0.6));
        }
        m.instanceMatrix.needsUpdate = true;
        if (m.instanceColor) m.instanceColor.needsUpdate = true;
    });
    return (
        <instancedMesh ref={mesh} args={[DISC, undefined, POOL.rbcB]} frustumCulled={false} raycast={() => undefined}>
            <meshStandardMaterial color="#ffffff" roughness={0.5} emissive="#7A1230" emissiveIntensity={0.15} />
        </instancedMesh>
    );
};

const SlowFibrils = ({ simRef }: { simRef: SimRef }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const mat = useRef<THREE.MeshStandardMaterial>(null);
    const tex = useMemo(() => makeStriationTexture(), []);
    useLayoutEffect(() => {
        const m = mesh.current;
        if (!m) return;
        SLOW_MYOFIBRILS.forEach((f, i) => m.setMatrixAt(i, M.compose(P.set(CX, f.y, f.z), Q.identity(), S.set(FIB_X1 - FIB_X0 - 0.3, 0.24, 0.24))));
        m.instanceMatrix.needsUpdate = true;
    }, []);
    useLayoutEffect(() => () => tex.dispose(), [tex]);
    useFrame(() => { if (mat.current) mat.current.opacity = simRef.current.slow; });
    return (
        <instancedMesh ref={mesh} args={[MYOFIBRIL, undefined, SLOW_MYOFIBRILS.length]} raycast={() => undefined}>
            <meshStandardMaterial ref={mat} map={tex} transparent roughness={0.6} emissive="#5B2238" emissiveIntensity={0.2} />
        </instancedMesh>
    );
};

export const SlowSystem = ({ simRef }: { simRef: SimRef }) => {
    const group = useRef<THREE.Group>(null);
    const { bind, lit } = useStructure('fibra-lenta');
    const fade = () => smooth(simRef.current.slow);
    useFrame(() => { if (group.current) group.current.visible = simRef.current.slow > 0.01; });
    return (
        <group ref={group} visible={false}>
            <group {...bind}>
                <Tube geo={SHELL_FIB} x0={FIB_X0} x1={FIB_X1} y={SLOW_FIB_Y} r={SLOW_FIB_R} wedge={WEDGE_FIB} outer="#8E97BE" inner="#241A30" rim="#A5B4FC"
                    outerOpacity={0.3} innerOpacity={0.92} lit={lit} fade={fade} />
            </group>
            <SlowFibrils simRef={simRef} />
            <Tube geo={SHELL_CAP} x0={CAP_X0} x1={CAP_X1} y={SLOW_CAP_Y} r={SLOW_CAP_R} wedge={WEDGE_CAP} outer="#E7A3B8" inner="#241626" rim="#F5C2D1"
                outerOpacity={0.22} innerOpacity={0.6} lit={false} fade={fade} />
            <SlowCells simRef={simRef} />
        </group>
    );
};
