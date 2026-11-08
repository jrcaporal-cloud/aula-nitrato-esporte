import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clamp01 } from '../shared/math';
import type { ClockRef } from './clock';
import { COL } from './colors';
import { pcrUse } from './pcrUse';
import { getGlyph } from './glyphs';
import { TANK_X, type UnitSpec } from './layout';
import { unitDim, unitIdle } from './look';
import { signals } from './kinetics';
import { noRaycast } from './points';

/*
 * Estoque de PCr (tubo da esquerda) e de creatina livre (direita): cada conta é uma fração do estoque.
 * A PCr gasta vira creatina, então o tubo da PCr esvazia e o da creatina enche; o nitrato esvazia menos.
 */

const N = 14;
const STEP_Y = 0.058;
const Y0 = -0.36;
const R_BEAD = 0.04;
const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const Q = new THREE.Quaternion();
const S = new THREE.Vector3();

interface Props { spec: UnitSpec; clockRef: ClockRef }

export const Tank = ({ spec, clockRef }: Props) => {
    const group = useRef<THREE.Group>(null);
    const pcr = useRef<THREE.InstancedMesh>(null);
    const cr = useRef<THREE.InstancedMesh>(null);
    const kit = useMemo(() => ({
        tubeG: new THREE.CylinderGeometry(0.1, 0.1, N * STEP_Y + 0.12, 20, 1, true),
        capG: new THREE.CylinderGeometry(0.11, 0.11, 0.025, 20),
        beadG: new THREE.SphereGeometry(R_BEAD, 12, 9),
        glassM: new THREE.MeshBasicMaterial({ color: '#5B6FA8', transparent: true, opacity: 0.09, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),
        capM: new THREE.MeshStandardMaterial({ color: '#7C8DB5', roughness: 0.4, metalness: 0.4 }),
        pcrM: new THREE.MeshStandardMaterial({ color: COL.pcr, roughness: 0.2, emissive: COL.pcr, emissiveIntensity: 0.55 }),
        crM: new THREE.MeshStandardMaterial({ color: COL.cr, roughness: 0.45, emissive: COL.cr, emissiveIntensity: 0.12 }),
    }), []);
    useEffect(() => () => Object.values(kit).forEach(o => o.dispose()), [kit]);

    const labelPcr = getGlyph('PCr', COL.pcr);
    const labelCr = getGlyph('Cr', '#8FB3B8');
    const yMid = Y0 + (N * STEP_Y) / 2 - STEP_Y / 2;

    useLayoutEffect(() => {
        for (const m of [pcr.current, cr.current]) m?.setMatrixAt(0, M.identity());
    }, []);

    useFrame(state => {
        const c = clockRef.current;
        if (unitIdle(c, spec, state.camera.position.x)) return;
        const sig = signals(c.step, spec.cond, spec.fiber, c.t);
        const g = group.current;
        if (g) {
            const show = clamp01(1 - c.mix * 2) * (0.35 + 0.65 * unitDim(c, spec, sig.fatigue));
            g.scale.setScalar(Math.max(show, 1e-4));
            g.visible = show > 0.02;
        }
        const used = pcrUse(c.step, spec.cond, c.t);
        const nP = N * (1 - used);
        const nC = N * used;
        const time = state.clock.elapsedTime;
        const fill = (mesh: THREE.InstancedMesh | null, count: number, x: number, off: number) => {
            if (!mesh) return;
            for (let k = 0; k < N; k++) {
                const s = clamp01(count - k);
                const bob = 0.006 * Math.sin(time * 2 + k * 1.7 + off);
                const dx = (k % 2 ? 0.025 : -0.025);
                mesh.setMatrixAt(k, M.compose(P.set(x + dx, Y0 + k * STEP_Y + bob, 0), Q, S.setScalar(Math.max(s, 1e-4))));
            }
            mesh.instanceMatrix.needsUpdate = true;
        };
        fill(pcr.current, nP, TANK_X.pcr, 0);
        fill(cr.current, nC, TANK_X.cr, 2);
    });

    const top = Y0 + N * STEP_Y;
    return (
        <group ref={group}>
            {[TANK_X.pcr, TANK_X.cr].map(x => (
                <group key={x}>
                    <mesh geometry={kit.tubeG} material={kit.glassM} position={[x, yMid, 0]} raycast={noRaycast} renderOrder={5} />
                    <mesh geometry={kit.capG} material={kit.capM} position={[x, Y0 - 0.05, 0]} raycast={noRaycast} />
                    <mesh geometry={kit.capG} material={kit.capM} position={[x, top + 0.02, 0]} raycast={noRaycast} />
                </group>
            ))}
            <instancedMesh ref={pcr} args={[kit.beadG, kit.pcrM, N]} frustumCulled={false} raycast={noRaycast} />
            <instancedMesh ref={cr} args={[kit.beadG, kit.crM, N]} frustumCulled={false} raycast={noRaycast} />
            <mesh material={labelPcr.material} position={[TANK_X.pcr, Y0 - 0.2, 0.05]} scale={[0.17 * labelPcr.aspect, 0.17, 1]} raycast={noRaycast}>
                <planeGeometry args={[1, 1]} />
            </mesh>
            <mesh material={labelCr.material} position={[TANK_X.cr, Y0 - 0.2, 0.05]} scale={[0.17 * labelCr.aspect, 0.17, 1]} raycast={noRaycast}>
                <planeGeometry args={[1, 1]} />
            </mesh>
        </group>
    );
};
