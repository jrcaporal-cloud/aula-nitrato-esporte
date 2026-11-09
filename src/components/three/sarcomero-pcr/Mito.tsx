import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ClockRef } from './clock';
import { COL } from './colors';
import { makeShell, patchCrista, type MitoUniforms } from './mitoShaders';
import { halfLen, type UnitSpec } from './layout';
import { baseColor, paint, setGlow, setU, slowTint, unitDim, unitIdle, unitSignals } from './look';
import { noRaycast, setUniform } from './points';

/*
 * Mitocôndrias atrás do sarcômero: casca dupla translúcida com cristas instanciadas que brilham em branco
 * conforme o ATP que a contração pede (menos no nitrato). Superfícies em mitoShaders. A fibra lenta (tipo I) tem mitocôndrias maiores.
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

const SLOTS = [{ side: 1 as const, dy: 0.12, ph: 0 }, { side: -1 as const, dy: -0.1, ph: 1.7 }];

interface Props { spec: UnitSpec; clockRef: ClockRef }

export const Mito = ({ spec, clockRef }: Props) => {
    const groups = useRef<(THREE.Group | null)[]>([]);
    const cristae = useRef<(THREE.InstancedMesh | null)[]>([]);
    const kit = useMemo(() => {
        const u: MitoUniforms = { uDemand: { value: 0 }, uTime: { value: 0 } };
        const cristaM = new THREE.MeshStandardMaterial({ color: COL.crista, roughness: 0.4, emissive: '#FFF4E6', emissiveIntensity: 0.2 });
        patchCrista(cristaM, u);
        return {
            u,
            shellG: new THREE.SphereGeometry(1, 28, 18),
            cristaG: new THREE.CylinderGeometry(1, 1, 0.018, 24).rotateZ(Math.PI / 2),
            shellM: makeShell(u),
            cristaM,
        };
    }, []);
    useEffect(() => () => {
        kit.shellG.dispose();
        kit.cristaG.dispose();
        kit.shellM.dispose();
        kit.cristaM.dispose();
    }, [kit]);

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
        const sig = unitSignals(c, spec);
        const dim = unitDim(c, spec, sig.fatigue);
        const h = halfLen(sig.act);
        const demand = Math.min(sig.sparks / 32, 1);
        const big = spec.fiber === 'I' ? 1.22 : 1;
        paint(kit.cristaM, CRISTA, dim, slowTint(c, spec) * 0.4);
        setGlow(kit.cristaM, (0.12 + 1.1 * demand * (0.75 + 0.25 * Math.sin(state.clock.elapsedTime * 3))) * dim);
        setUniform(kit.shellM, 'uOpacity', 0.25 + 0.75 * dim);
        setU(kit.u.uDemand, demand * dim);
        setU(kit.u.uTime, state.clock.elapsedTime);
        for (let i = 0; i < SLOTS.length; i++) {
            const s = SLOTS[i];
            const g = groups.current[i];
            if (!g) continue;
            g.position.set(s.side * (h - 0.62), s.dy, -0.86 - 0.04 * Math.sin(state.clock.elapsedTime * 0.7 + s.ph));
            g.scale.setScalar(big);
        }
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
