import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ClockRef } from './clock';
import { COL } from './colors';
import { signals } from './kinetics';
import { halfLen, type UnitSpec } from './layout';
import { baseColor, paint, setGlow, slowTint, unitDim, unitIdle } from './look';
import { noRaycast, setUniform } from './points';

/*
 * Mitocôndrias atrás do sarcômero: casca dupla translúcida com cristas instanciadas que brilham em branco
 * conforme o ATP que a contração pede (menos no nitrato). A fibra lenta (tipo I) tem mitocôndrias maiores.
 */

const N_CRISTA = 11;
const HALF = 0.5;
const RAD = 0.21;
const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const Q = new THREE.Quaternion();
const E = new THREE.Euler();
const CRISTA = baseColor(COL.crista);

const SHELL_VS = `varying vec3 vN; varying vec3 vV;
void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = -mv.xyz; gl_Position = projectionMatrix * mv; }`;
const SHELL_FS = `varying vec3 vN; varying vec3 vV; uniform vec3 uColor; uniform float uOpacity;
void main() { float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2); float a = (0.06 + 0.9 * f) * uOpacity; gl_FragColor = vec4(uColor * a, a); }`;

/** Casca da mitocôndria: só a borda brilha (dupla membrana vista de lado), o miolo fica transparente. */
const makeShell = () => new THREE.ShaderMaterial({
    vertexShader: SHELL_VS, fragmentShader: SHELL_FS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color(COL.mito) }, uOpacity: { value: 1 } },
});

const SLOTS = [{ side: 1 as const, dy: 0.12, ph: 0 }, { side: -1 as const, dy: -0.1, ph: 1.7 }];

interface Props { spec: UnitSpec; clockRef: ClockRef }

export const Mito = ({ spec, clockRef }: Props) => {
    const groups = useRef<(THREE.Group | null)[]>([]);
    const cristae = useRef<(THREE.InstancedMesh | null)[]>([]);
    const kit = useMemo(() => ({
        shellG: new THREE.SphereGeometry(1, 28, 18),
        cristaG: new THREE.CylinderGeometry(1, 1, 0.018, 24).rotateZ(Math.PI / 2),
        shellM: makeShell(),
        cristaM: new THREE.MeshStandardMaterial({ color: COL.crista, roughness: 0.4, emissive: '#FFF4E6', emissiveIntensity: 0.2 }),
    }), []);
    useEffect(() => () => Object.values(kit).forEach(o => o.dispose()), [kit]);

    useLayoutEffect(() => {
        cristae.current.forEach((im, si) => {
            if (!im) return;
            for (let i = 0; i < N_CRISTA; i++) {
                const u = (i + 0.5) / N_CRISTA * 2 - 1;
                const prof = Math.sqrt(Math.max(1 - u * u, 0.05)) * 0.8;
                const alt = i % 2 ? 1 : -1;
                // cristas vêm de cima e de baixo, sem fechar o meio (matriz continua visível)
                const sy = prof * (0.62 + 0.08 * ((i + si) % 3));
                im.setMatrixAt(i, M.compose(
                    P.set(u * HALF * 0.88, alt * RAD * prof * 0.32, 0),
                    Q.setFromEuler(E.set(0, 0, 0)),
                    S.set(1, RAD * sy * 1.1, RAD * prof * 0.9),
                ));
            }
            im.instanceMatrix.needsUpdate = true;
        });
    }, []);

    useFrame(state => {
        const c = clockRef.current;
        if (unitIdle(c, spec, state.camera.position.x)) return;
        const sig = signals(c.step, spec.cond, spec.fiber, c.t);
        const dim = unitDim(c, spec, sig.fatigue);
        const h = halfLen(sig.act);
        const demand = Math.min(sig.sparks / 32, 1);
        const big = spec.fiber === 'I' ? 1.22 : 1;
        paint(kit.cristaM, CRISTA, dim, slowTint(c, spec) * 0.4);
        setGlow(kit.cristaM, (0.12 + 1.1 * demand * (0.75 + 0.25 * Math.sin(state.clock.elapsedTime * 3))) * dim);
        setUniform(kit.shellM, 'uOpacity', 0.25 + 0.75 * dim);
        SLOTS.forEach((s, i) => {
            const g = groups.current[i];
            if (!g) return;
            g.position.set(s.side * (h - 0.62), s.dy, -0.86 - 0.04 * Math.sin(state.clock.elapsedTime * 0.7 + s.ph));
            g.scale.setScalar(big);
        });
    });

    return (
        <>
            {SLOTS.map((s, i) => (
                <group key={s.side} ref={el => { groups.current[i] = el; }} rotation={[0, 0, s.side * 0.05]}>
                    <mesh geometry={kit.shellG} material={kit.shellM} scale={[HALF, RAD, RAD]} raycast={noRaycast} renderOrder={1} />
                    <instancedMesh ref={el => { cristae.current[i] = el; }} args={[kit.cristaG, kit.cristaM, N_CRISTA]} frustumCulled={false} raycast={noRaycast} />
                </group>
            ))}
        </>
    );
};
