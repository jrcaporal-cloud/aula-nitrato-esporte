import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { getGlowTexture } from '../shared/glow';
import type { ClockRef } from './clock';
import { COL } from './colors';
import { STATION_X } from './layout';
import { MUSCLES, SKIN_R } from './limb';
import { FIBRES } from './limbFibers';
import { LEN, buildFlow } from './limbFx';
import { noRaycast, pxPerUnit, setUniform } from './points';
import { armPin, useSelection } from './selection';

/*
 * Estação C: corte do membro posterior do rato com 28 músculos. Na face de cada músculo, o mosaico de fibras
 * (claras e lisas = tipo II; escuras e foscas = tipo I) na % do músculo. Com nitrato, anéis verdes (NO) com
 * halo e ondas crescem na proporção do ganho de fluxo, e os glóbulos saem mais depressa dos músculos rápidos.
 */

const N = MUSCLES.length;
const CAP_Z = LEN / 2;
const M4 = new THREE.Matrix4();
const P = new THREE.Vector3();
const Q = new THREE.Quaternion();
const S = new THREE.Vector3();
const COLR = new THREE.Color();
const NO_COLOR = new THREE.Color(C.no);

const bodyColor = (pct: number): THREE.Color =>
    new THREE.Color(COL.fiberI).lerp(new THREE.Color(COL.fiberII), Math.pow(pct / 100, 1.25)).multiplyScalar(0.42);

const placeDots = (m: THREE.InstancedMesh | null, dots: typeof FIBRES.fast) => {
    if (!m) return;
    dots.forEach((d, i) => m.setMatrixAt(i, M4.compose(P.set(d.x, d.y, CAP_Z + 0.025), Q.identity(), S.set(d.r, d.r, 1))));
    m.instanceMatrix.needsUpdate = true;
};

export const LimbStation = ({ clockRef }: { clockRef: ClockRef }) => {
    const group = useRef<THREE.Group>(null);
    const muscles = useRef<THREE.InstancedMesh>(null);
    const fast = useRef<THREE.InstancedMesh>(null);
    const slow = useRef<THREE.InstancedMesh>(null);
    const sheaths = useRef<THREE.InstancedMesh>(null);
    const rings = useRef<THREE.InstancedMesh>(null);
    const halos = useRef<THREE.InstancedMesh>(null);
    const flow = useMemo(() => buildFlow(C.o2Soft), []);
    const kit = useMemo(() => ({
        body: new THREE.CylinderGeometry(1, 1, LEN, 32).rotateX(Math.PI / 2),
        hex: new THREE.CylinderGeometry(1, 1, 0.05, 6).rotateX(Math.PI / 2).rotateZ(Math.PI / 6),
        sheath: new THREE.TorusGeometry(1, 0.03, 6, 40),
        ring: new THREE.RingGeometry(0.86, 1, 48),
        plane: new THREE.PlaneGeometry(1, 1),
        bone: new THREE.CylinderGeometry(0.3, 0.3, LEN + 0.12, 28).rotateX(Math.PI / 2),
        marrow: new THREE.CircleGeometry(0.17, 28),
        fastM: new THREE.MeshStandardMaterial({ color: COL.fiberII, roughness: 0.18, metalness: 0.2, emissive: '#ffffff', emissiveIntensity: 0.06 }),
        slowM: new THREE.MeshStandardMaterial({ color: '#56657E', roughness: 0.85, metalness: 0 }),
        bodyM: new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.1 }),
        sheathM: new THREE.MeshStandardMaterial({ color: '#8D9BB8', roughness: 0.35, metalness: 0.3 }),
        ringM: new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }),
        haloM: new THREE.MeshBasicMaterial({ map: getGlowTexture(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }),
    }), []);
    useEffect(() => () => {
        flow.geometry.dispose(); flow.material.dispose();
        Object.values(kit).forEach(o => o.dispose());
    }, [flow, kit]);

    useLayoutEffect(() => {
        const m = muscles.current;
        const sh = sheaths.current;
        if (!m || !sh) return;
        MUSCLES.forEach((mu, i) => {
            m.setMatrixAt(i, M4.compose(P.set(mu.x, mu.y, 0), Q.identity(), S.set(mu.radius, mu.radius, 1)));
            m.setColorAt(i, bodyColor(mu.pct));
            sh.setMatrixAt(i, M4.compose(P.set(mu.x, mu.y, CAP_Z + 0.01), Q.identity(), S.set(mu.radius * 0.97, mu.radius * 0.97, 1)));
        });
        m.instanceMatrix.needsUpdate = true;
        sh.instanceMatrix.needsUpdate = true;
        if (m.instanceColor) m.instanceColor.needsUpdate = true;
        placeDots(fast.current, FIBRES.fast);
        placeDots(slow.current, FIBRES.slow);
    }, []);

    useFrame(state => {
        const c = clockRef.current;
        if (group.current) group.current.visible = Math.abs(state.camera.position.x - STATION_X.c) < 24;
        const time = state.clock.elapsedTime;
        setUniform(flow.material, 'uTime', time);
        setUniform(flow.material, 'uNit', c.nit);
        setUniform(flow.material, 'uPx', pxPerUnit(state));
        const rm = rings.current;
        const hm = halos.current;
        if (!rm || !hm) return;
        MUSCLES.forEach((mu, i) => {
            // anel de NO: maior e mais brilhante onde o ganho de fluxo é maior; duas ondas saem dele
            const g = c.nit * mu.gain;
            const breathe = 0.92 + 0.08 * Math.sin(time * 2.2 + i);
            const r = mu.radius * (1.04 + 0.42 * g);
            rm.setMatrixAt(i, M4.compose(P.set(mu.x, mu.y, CAP_Z + 0.04), Q, S.set(r, r, 1)));
            rm.setColorAt(i, COLR.copy(NO_COLOR).multiplyScalar((0.15 + 0.85 * g) * g * breathe * 1.25));
            for (let w = 0; w < 2; w++) {
                const ph = (time * (0.35 + 0.45 * g) + w * 0.5 + i * 0.13) % 1;
                const rr = r * (1 + 0.7 * ph);
                rm.setMatrixAt(N + i * 2 + w, M4.compose(P.set(mu.x, mu.y, CAP_Z + 0.035), Q, S.set(rr, rr, 1)));
                rm.setColorAt(N + i * 2 + w, COLR.copy(NO_COLOR).multiplyScalar(g * g * 0.5 * (1 - ph) * (1 - ph)));
            }
            const hr = mu.radius * (2.4 + 1.2 * g);
            hm.setMatrixAt(i, M4.compose(P.set(mu.x, mu.y, CAP_Z + 0.02), Q, S.set(hr, hr, 1)));
            hm.setColorAt(i, COLR.copy(NO_COLOR).multiplyScalar(g * g * g * 0.22 * breathe));
        });
        rm.instanceMatrix.needsUpdate = true;
        hm.instanceMatrix.needsUpdate = true;
        if (rm.instanceColor) rm.instanceColor.needsUpdate = true;
        if (hm.instanceColor) hm.instanceColor.needsUpdate = true;
    });

    const onOver = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        const id = e.instanceId === undefined ? 'musculo' : MUSCLES[e.instanceId].id;
        useSelection.getState().setHover(id);
    };
    const onOut = () => useSelection.getState().setHover(null);
    const onDown = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        armPin(e.instanceId === undefined ? 'musculo' : MUSCLES[e.instanceId].id);
    };

    return (
        <group ref={group} position={[STATION_X.c, 0, 0]}>
            <mesh position={[0, 0, -CAP_Z - 0.02]} raycast={noRaycast}>
                <circleGeometry args={[SKIN_R, 72]} />
                <meshBasicMaterial color="#140d1f" />
            </mesh>
            <mesh position={[0, 0, CAP_Z - 0.03]} raycast={noRaycast}>
                <ringGeometry args={[SKIN_R - 0.16, SKIN_R, 96]} />
                <meshStandardMaterial color="#3A2A45" roughness={0.6} transparent opacity={0.85} />
            </mesh>
            <mesh raycast={noRaycast}>
                <cylinderGeometry args={[SKIN_R, SKIN_R, LEN, 96, 1, true]} />
                <meshStandardMaterial color="#5B4A6E" roughness={0.3} metalness={0.1} transparent opacity={0.16} depthWrite={false} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, CAP_Z]} raycast={noRaycast}>
                <torusGeometry args={[SKIN_R, 0.03, 8, 120]} />
                <meshStandardMaterial color="#94A3B8" roughness={0.3} metalness={0.4} />
            </mesh>
            <instancedMesh ref={muscles} args={[kit.body, kit.bodyM, N]} frustumCulled={false} onPointerOver={onOver} onPointerOut={onOut} onPointerDown={onDown} />
            <instancedMesh ref={fast} args={[kit.hex, kit.fastM, FIBRES.fast.length]} frustumCulled={false} raycast={noRaycast} />
            <instancedMesh ref={slow} args={[kit.hex, kit.slowM, FIBRES.slow.length]} frustumCulled={false} raycast={noRaycast} />
            <instancedMesh ref={sheaths} args={[kit.sheath, kit.sheathM, N]} frustumCulled={false} raycast={noRaycast} />
            <mesh geometry={kit.bone} raycast={noRaycast}>
                <meshStandardMaterial color="#E7E2D6" roughness={0.45} />
            </mesh>
            <mesh geometry={kit.marrow} position={[0, 0, CAP_Z + 0.065]} raycast={noRaycast}>
                <meshStandardMaterial color="#8A5A6A" roughness={0.7} />
            </mesh>
            <instancedMesh ref={halos} args={[kit.plane, kit.haloM, N]} frustumCulled={false} raycast={noRaycast} renderOrder={5} />
            <instancedMesh ref={rings} args={[kit.ring, kit.ringM, N * 3]} frustumCulled={false} raycast={noRaycast} renderOrder={6} />
            <points geometry={flow.geometry} material={flow.material} frustumCulled={false} raycast={noRaycast} renderOrder={7} />
        </group>
    );
};
