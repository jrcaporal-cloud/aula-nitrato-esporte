import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { GUT } from './anatomy';
import { damp, matOf } from './fx';
import { srand } from './rand';
import { useStructure } from './selection';
import type { VnStateRef } from './state';
import { buildLut, lutPoint } from './tubes';

/*
 * Vilosidades do intestino delgado: dedinhos instanciados na parede de trás, apontando para o lume.
 * É por elas que o nitrato atravessa; na etapa 2 acendem em magenta.
 */

const COUNT = 1100;
const UP = new THREE.Vector3(0, 1, 0);
const BASE = new THREE.Color('#C58E9E');
const HOT = new THREE.Color(C.nitrate);
const BODY = new THREE.Color('#B27C8C');

export const Villi = ({ stateRef }: { stateRef: VnStateRef }) => {
    const { lit } = useStructure('intestino');
    const litRef = useRef(lit);
    useEffect(() => { litRef.current = lit; }, [lit]);
    const mesh = useRef<THREE.InstancedMesh>(null);
    const dim = useRef(0.5);
    const geo = useMemo(() => new THREE.ConeGeometry(0.032, 0.14, 6, 1).translate(0, 0.07, 0), []);
    const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: BODY, emissive: BASE, emissiveIntensity: 0.2, roughness: 0.45 }), []);
    useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

    useEffect(() => {
        const m = mesh.current;
        if (!m) return;
        const lut = buildLut(GUT, 500);
        const r = srand(61);
        const surf = new THREE.Vector3();
        const axis = new THREE.Vector3();
        const dir = new THREE.Vector3();
        const q = new THREE.Quaternion();
        const s = new THREE.Vector3();
        const mx = new THREE.Matrix4();
        for (let i = 0; i < COUNT; i++) {
            const u = 0.02 + r() * 0.96;
            const th = Math.PI + 0.12 + r() * (Math.PI - 0.24);
            const a = Math.cos(th);
            const b = Math.sin(th);
            lutPoint(lut, u, a * 0.96, b * 0.96, surf);
            lutPoint(lut, u, 0, 0, axis);
            q.setFromUnitVectors(UP, dir.subVectors(axis, surf).normalize());
            m.setMatrixAt(i, mx.compose(surf, q, s.setScalar(0.65 + r() * 0.7)));
        }
        m.instanceMatrix.needsUpdate = true;
    }, []);

    useFrame(({ clock }, delta) => {
        const f = stateRef.current.f;
        dim.current = damp(dim.current, f.focus.intestino, 5, Math.min(delta, 0.1));
        const k = litRef.current ? 1 : dim.current;
        const hot = f.w.absorb * (0.6 + 0.4 * Math.sin(clock.elapsedTime * 3));
        const vm = matOf<THREE.MeshStandardMaterial>(mesh);
        if (!vm) return;
        vm.color.copy(BODY).multiplyScalar(0.55 + 0.45 * k);
        vm.emissive.copy(BASE).lerp(HOT, Math.min(hot, 1) * 0.8);
        vm.emissiveIntensity = (litRef.current ? 0.55 : 0.14 + 0.2 * k) + hot * 0.45;
    });

    // sem handlers: 1100 cones testados a cada movimento do ponteiro; a parede do intestino já recebe o hover
    return <instancedMesh ref={mesh} args={[geo, mat, COUNT]} frustumCulled={false} />;
};
