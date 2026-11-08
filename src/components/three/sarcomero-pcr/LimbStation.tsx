import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { rng } from '../shared/math';
import { C } from '../../sims/kit/palette';
import type { ClockRef } from './clock';
import { COL } from './colors';
import { STATION_X } from './layout';
import { MUSCLES, SKIN_R } from './limb';
import { noRaycast, pxPerUnit, setUniform } from './points';
import { armPin, useSelection } from './selection';

/*
 * Estação C: corte do membro posterior do rato com 28 músculos. A cor de cada músculo é a sua % de fibras
 * IIb + d/x (claro = rápido); com nitrato, halos verdes (NO) crescem na proporção do ganho de fluxo e os
 * glóbulos (pontos azul-claros) correm mais depressa nos músculos rápidos.
 */

const LEN = 0.9;
const PER_MUSCLE = 10;

const FLOW_VS = `
attribute float aSeed;
attribute float aGain;
attribute float aSpeed;
uniform float uTime;
uniform float uNit;
uniform float uPx;
uniform float uLen;
varying float vA;
void main() {
    float spd = aSpeed * (1.0 + uNit * aGain * 1.8);
    float u = fract(aSeed + uTime * spd / uLen);
    vec4 mv = modelViewMatrix * vec4(position.xy, (u - 0.5) * uLen, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = 0.085 * uPx / max(-mv.z, 0.1);
    vA = smoothstep(0.0, 0.12, u) * (1.0 - smoothstep(0.88, 1.0, u));
}`;
const FLOW_FS = `
uniform vec3 uColor;
varying float vA;
void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = smoothstep(1.0, 0.2, d) * vA;
    gl_FragColor = vec4(uColor * a, a);
}`;

const RING_M = new THREE.Matrix4();
const RING_P = new THREE.Vector3();
const RING_Q = new THREE.Quaternion();
const RING_S = new THREE.Vector3();
const RING_C = new THREE.Color();
const NO_COLOR = new THREE.Color(C.no);

const colorOf = (pct: number): THREE.Color => new THREE.Color(COL.fiberI).lerp(new THREE.Color(COL.fiberII), Math.pow(pct / 100, 1.25));

const buildFlow = () => {
    const rnd = rng(23);
    const n = MUSCLES.length * PER_MUSCLE;
    const pos = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    const gain = new Float32Array(n);
    const speed = new Float32Array(n);
    MUSCLES.forEach((m, mi) => {
        for (let k = 0; k < PER_MUSCLE; k++) {
            const i = mi * PER_MUSCLE + k;
            const a = rnd() * Math.PI * 2;
            const r = Math.sqrt(rnd()) * m.radius * 0.78;
            pos[i * 3] = m.x + r * Math.cos(a);
            pos[i * 3 + 1] = m.y + r * Math.sin(a);
            seed[i] = rnd();
            gain[i] = m.gain;
            speed[i] = 0.5 + rnd() * 0.25;
        }
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    geometry.setAttribute('aGain', new THREE.BufferAttribute(gain, 1));
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4);
    const material = new THREE.ShaderMaterial({
        vertexShader: FLOW_VS,
        fragmentShader: FLOW_FS,
        uniforms: { uTime: { value: 0 }, uNit: { value: 1 }, uPx: { value: 400 }, uLen: { value: LEN + 0.5 }, uColor: { value: new THREE.Color(C.o2Soft) } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });
    return { geometry, material };
};

export const LimbStation = ({ clockRef }: { clockRef: ClockRef }) => {
    const group = useRef<THREE.Group>(null);
    const muscles = useRef<THREE.InstancedMesh>(null);
    const flow = useMemo(() => buildFlow(), []);
    const rings = useRef<THREE.InstancedMesh>(null);
    const ringG = useMemo(() => new THREE.RingGeometry(0.8, 1, 40), []);
    const geo = useMemo(() => new THREE.CylinderGeometry(1, 1, LEN, 28).rotateX(Math.PI / 2), []);
    const boneG = useMemo(() => new THREE.CylinderGeometry(0.3, 0.3, LEN + 0.1, 20).rotateX(Math.PI / 2), []);
    useEffect(() => () => { flow.geometry.dispose(); flow.material.dispose(); geo.dispose(); boneG.dispose(); ringG.dispose(); }, [flow, geo, boneG, ringG]);

    useLayoutEffect(() => {
        const m = muscles.current;
        if (!m) return;
        const mat = new THREE.Matrix4();
        MUSCLES.forEach((mu, i) => {
            m.setMatrixAt(i, mat.compose(new THREE.Vector3(mu.x, mu.y, 0), new THREE.Quaternion(), new THREE.Vector3(mu.radius, mu.radius, 1)));
            m.setColorAt(i, colorOf(mu.pct));
        });
        m.instanceMatrix.needsUpdate = true;
        if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }, []);

    useFrame(state => {
        const c = clockRef.current;
        if (group.current) group.current.visible = Math.abs(state.camera.position.x - STATION_X.c) < 24;
        const time = state.clock.elapsedTime;
        setUniform(flow.material, 'uTime', time);
        setUniform(flow.material, 'uNit', c.nit);
        setUniform(flow.material, 'uPx', pxPerUnit(state));
        const rm = rings.current;
        if (rm) {
            MUSCLES.forEach((mu, i) => {
                // anel de NO em volta do músculo: maior e mais brilhante onde o ganho de fluxo é maior
                const g = c.nit * mu.gain * (0.92 + 0.08 * Math.sin(time * 2.2 + i));
                const r = mu.radius * (1.06 + 0.5 * g);
                rm.setMatrixAt(i, RING_M.compose(RING_P.set(mu.x, mu.y, LEN / 2 + 0.02), RING_Q, RING_S.set(r, r, 1)));
                rm.setColorAt(i, RING_C.copy(NO_COLOR).multiplyScalar(g));
            });
            rm.instanceMatrix.needsUpdate = true;
            if (rm.instanceColor) rm.instanceColor.needsUpdate = true;
        }
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
            <instancedMesh ref={muscles} args={[geo, undefined, MUSCLES.length]} frustumCulled={false} onPointerOver={onOver} onPointerOut={onOut} onPointerDown={onDown}>
                <meshStandardMaterial roughness={0.55} metalness={0.05} />
            </instancedMesh>
            <mesh geometry={boneG} raycast={noRaycast}>
                <meshStandardMaterial color="#CBD5E1" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0, -LEN / 2 - 0.02]} raycast={noRaycast}>
                <circleGeometry args={[SKIN_R, 64]} />
                <meshBasicMaterial color="#120d1c" />
            </mesh>
            <mesh raycast={noRaycast}>
                <torusGeometry args={[SKIN_R, 0.025, 8, 96]} />
                <meshBasicMaterial color="#64748B" />
            </mesh>
            <instancedMesh ref={rings} args={[ringG, undefined, MUSCLES.length]} frustumCulled={false} raycast={noRaycast}>
                <meshBasicMaterial transparent depthWrite={false} blending={THREE.AdditiveBlending} />
            </instancedMesh>
            <points geometry={flow.geometry} material={flow.material} frustumCulled={false} raycast={noRaycast} />
        </group>
    );
};
