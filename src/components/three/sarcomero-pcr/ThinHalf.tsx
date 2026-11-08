import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clamp01, rng } from '../shared/math';
import type { ClockRef } from './clock';
import { COL } from './colors';
import { GEO, TROPONIN_R, TROPONIN_X, troponinAngle } from './geoms';
import { signals } from './kinetics';
import { THIN_SITES, halfLen, type UnitSpec } from './layout';
import { baseColor, paint, setGlow, slowTint, unitDim, unitIdle } from './look';
import { useStructureBind } from './selection';

/*
 * Uma metade "fina" do sarcômero: disco Z com furos, 12 filamentos de actina (hélice dupla com tropomiosina)
 * e as troponinas, que acendem em azul quando o Ca²⁺ chega. A metade inteira é um grupo que anda com o disco Z,
 * então o encurtamento custa uma translação por quadro.
 */

const M = new THREE.Matrix4();
const E = new THREE.Euler();
const Q = new THREE.Quaternion();
const P = new THREE.Vector3();
const ONE = new THREE.Vector3(1, 1, 1);
const WHITE = baseColor('#ffffff');
const Z_BASE = baseColor(COL.zdisc);
const TROP_BASE = baseColor('#C7D2FE');
const CA = new THREE.Color(COL.ca);

interface Props { spec: UnitSpec; clockRef: ClockRef; side: 1 | -1 }

export const ThinHalf = ({ spec, clockRef, side }: Props) => {
    const group = useRef<THREE.Group>(null);
    const thin = useRef<THREE.InstancedMesh>(null);
    const trop = useRef<THREE.InstancedMesh>(null);
    const kit = useMemo(() => ({
        thinM: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, metalness: 0.2 }),
        zM: new THREE.MeshStandardMaterial({ color: COL.zdisc, roughness: 0.32, metalness: 0.35, transparent: true, opacity: 0.88 }),
        tropM: new THREE.MeshStandardMaterial({ color: '#C7D2FE', roughness: 0.35, emissive: CA, emissiveIntensity: 0 }),
    }), []);
    useEffect(() => () => Object.values(kit).forEach(o => o.dispose()), [kit]);

    const phases = useMemo(() => { const r = rng(side === 1 ? 3 : 4); return THIN_SITES.map(() => r() * Math.PI * 2); }, [side]);
    useLayoutEffect(() => {
        const tm = thin.current;
        const rm = trop.current;
        if (!tm || !rm) return;
        THIN_SITES.forEach(([y, z], i) => {
            tm.setMatrixAt(i, M.compose(P.set(0, y, z), Q.setFromEuler(E.set(phases[i], 0, 0)), ONE));
            TROPONIN_X.forEach((x, k) => {
                const a = troponinAngle(x) + phases[i];
                rm.setMatrixAt(i * TROPONIN_X.length + k, M.compose(P.set(x, y + TROPONIN_R * Math.cos(a), z + TROPONIN_R * Math.sin(a)), Q.identity(), ONE));
            });
        });
        tm.instanceMatrix.needsUpdate = true;
        rm.instanceMatrix.needsUpdate = true;
    }, [phases]);

    useFrame(state => {
        const c = clockRef.current;
        if (unitIdle(c, spec, state.camera.position.x)) return;
        const sig = signals(c.step, spec.cond, spec.fiber, c.t);
        const dim = unitDim(c, spec, sig.fatigue);
        const tint = slowTint(c, spec);
        if (group.current) group.current.position.x = side * halfLen(sig.act);
        paint(kit.thinM, WHITE, dim, tint);
        paint(kit.zM, Z_BASE, dim, tint);
        paint(kit.tropM, TROP_BASE, dim, tint);
        setGlow(kit.tropM, clamp01(sig.act * (0.45 + 0.4 * sig.amp)) * 1.5 * dim);
    });

    const bindAct = useStructureBind('actina');
    const bindZ = useStructureBind('linhaZ');
    return (
        <group ref={group} rotation={[0, side === 1 ? 0 : Math.PI, 0]}>
            <mesh geometry={GEO.zdisc} material={kit.zM} {...bindZ} />
            <instancedMesh ref={thin} args={[GEO.thin, kit.thinM, THIN_SITES.length]} frustumCulled={false} {...bindAct} />
            <instancedMesh ref={trop} args={[GEO.troponin, kit.tropM, THIN_SITES.length * TROPONIN_X.length]} frustumCulled={false} {...bindAct} />
        </group>
    );
};
