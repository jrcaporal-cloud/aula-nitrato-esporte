import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { KIDNEY } from './anatomy';
import { damp, matOf } from './fx';
import { fresnelMaterial } from './materials';
import { useStructure } from './selection';
import type { VnStateRef } from './state';
import { bumpTexture } from './textures';

/*
 * Rim em forma de feijão: córtex translúcido, pirâmides medulares por dentro (cones em anel) e o hilo
 * voltado para o tronco. Acende em magenta quando o nitrato é filtrado (etapa 8).
 */

const PYRAMIDS = 8;
const NITRATE = new THREE.Color(C.nitrate);
const BASE_EMI = new THREE.Color('#A87888');
const CORTEX = new THREE.Color('#8A5468');

/** Esfera unitária com o entalhe do hilo (lado +x). */
const beanGeometry = (): THREE.BufferGeometry => {
    const g = new THREE.SphereGeometry(1, 40, 28);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
        const x = p.getX(i);
        const y = p.getY(i);
        const z = p.getZ(i);
        if (x > 0) p.setX(i, x - 0.7 * x * Math.exp(-(y * y) / 0.1 - (z * z) / 0.3));
    }
    g.computeVertexNormals();
    return g;
};

export const Kidney = ({ stateRef }: { stateRef: VnStateRef }) => {
    const { bind, lit } = useStructure('rim');
    const litRef = useRef(lit);
    useEffect(() => { litRef.current = lit; }, [lit]);
    const dim = useRef(0.5);
    const parts = useMemo(() => {
        const tex = bumpTexture('mottle').clone();
        tex.repeat.set(3, 3);
        tex.needsUpdate = true;
        return {
            tex,
            bean: beanGeometry(),
            cone: new THREE.ConeGeometry(0.2, 0.55, 6).translate(0, 0.27, 0),
            cortex: new THREE.MeshPhysicalMaterial({ color: '#7A4C5E', emissive: BASE_EMI.clone(), emissiveIntensity: 0.16, roughness: 0.4, clearcoat: 0.7, clearcoatRoughness: 0.3, transparent: true, opacity: 0.82, bumpMap: tex, bumpScale: 0.6 }),
            core: new THREE.MeshStandardMaterial({ color: '#5A2E3C', emissive: '#B0506A', emissiveIntensity: 0.35, roughness: 0.6 }),
            shell: fresnelMaterial(C.placebo, 0.7),
        };
    }, []);
    useEffect(() => () => {
        parts.tex.dispose(); parts.bean.dispose(); parts.cone.dispose();
        parts.cortex.dispose(); parts.core.dispose(); parts.shell.dispose();
    }, [parts]);

    const pyr = useRef<THREE.InstancedMesh>(null);
    const cortexRef = useRef<THREE.Mesh>(null);
    useEffect(() => {
        const m = pyr.current;
        if (!m) return;
        const q = new THREE.Quaternion();
        const mx = new THREE.Matrix4();
        const pos = new THREE.Vector3();
        const sc = new THREE.Vector3(1, 1, 1);
        for (let i = 0; i < PYRAMIDS; i++) {
            // cones de dentro para fora, em volta do hilo (eixo +x), apontando para a superfície
            const a = (i / PYRAMIDS) * Math.PI * 2;
            const dir = new THREE.Vector3(-0.25, Math.cos(a), Math.sin(a) * 0.9).normalize();
            q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
            pos.set(0.05, 0, 0).addScaledVector(dir, 0.06);
            m.setMatrixAt(i, mx.compose(pos, q, sc.setScalar(0.85)));
        }
        m.instanceMatrix.needsUpdate = true;
    }, []);

    useFrame(({ clock }, delta) => {
        const f = stateRef.current.f;
        dim.current = damp(dim.current, f.focus.rim, 5, Math.min(delta, 0.1));
        const k = litRef.current ? 1 : dim.current;
        const hot = f.w.urine * (0.7 + 0.3 * Math.sin(clock.elapsedTime * 2.4));
        const cx = matOf<THREE.MeshPhysicalMaterial>(cortexRef);
        const core = matOf<THREE.MeshStandardMaterial>(pyr);
        if (cx) {
            cx.emissive.copy(BASE_EMI).lerp(NITRATE, hot * 0.55);
            cx.emissiveIntensity = (litRef.current ? 0.6 : 0.1 + 0.3 * k) + hot * 0.45;
            cx.color.copy(CORTEX).multiplyScalar(0.55 + 0.6 * k);
        }
        if (core) core.emissiveIntensity = 0.15 + 0.3 * k + hot * 0.5;
    });

    const [x, y, z] = KIDNEY.pos;
    return (
        <group position={[x, y, z]} rotation={[0, 0, KIDNEY.tilt]} scale={[KIDNEY.r[0], KIDNEY.r[1], KIDNEY.r[2]]}>
            <instancedMesh ref={pyr} args={[parts.cone, parts.core, PYRAMIDS]} frustumCulled={false} />
            <mesh ref={cortexRef} geometry={parts.bean} material={parts.cortex} renderOrder={1} {...bind} />
            <mesh geometry={parts.bean} material={parts.shell} scale={1.05} renderOrder={2} />
        </group>
    );
};
