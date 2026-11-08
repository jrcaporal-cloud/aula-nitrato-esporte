import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { C } from '../../sims/kit/palette';
import { CAPILLARIES } from './anatomy';
import { damp, flowOf, flowify, matOf } from './fx';
import { useStructure } from './selection';
import type { VnStateRef } from './state';
import { tubeGeometry } from './tubes';

/*
 * Capilares do músculo: cinco tubos finos com pulso de fluxo. Na etapa 7 o NO os dilata: uma luva verde
 * aditiva incha em volta de cada um (o aceno ao modelo vaso-hipoxia).
 */

const BACK: readonly [number, number] = [Math.PI, Math.PI * 2];
const merged = (list: THREE.BufferGeometry[]): THREE.BufferGeometry => mergeGeometries(list, false) ?? new THREE.BufferGeometry();

export const Capillaries = ({ stateRef }: { stateRef: VnStateRef }) => {
    const { bind, lit } = useStructure('vasos');
    const litRef = useRef(lit);
    useEffect(() => { litRef.current = lit; }, [lit]);
    const dim = useRef(0.5);
    const parts = useMemo(() => {
        const wall = new THREE.MeshStandardMaterial({ color: '#4A3A40', emissive: '#CDBFB0', emissiveIntensity: 0.16, roughness: 0.4, side: THREE.DoubleSide });
        flowify(wall, { color: C.nitrate, freq: 3, speed: 0.6 });
        return {
            wallGeo: merged(CAPILLARIES.map(o => tubeGeometry(o, 24, 10, BACK))),
            sleeveGeo: merged(CAPILLARIES.map(o => tubeGeometry(o, 24, 12, [0, Math.PI * 2], true))),
            wall,
            sleeve: new THREE.MeshBasicMaterial({ color: C.no, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
        };
    }, []);
    useEffect(() => () => {
        parts.wallGeo.dispose(); parts.sleeveGeo.dispose();
        parts.wall.dispose(); parts.sleeve.dispose();
    }, [parts]);
    const sleeve = useRef<THREE.Mesh>(null);
    const wallRef = useRef<THREE.Mesh>(null);
    useFrame(({ clock }, delta) => {
        const f = stateRef.current.f;
        dim.current = damp(dim.current, f.focus.vasos, 5, Math.min(delta, 0.1));
        const k = litRef.current ? 1 : dim.current;
        const w = matOf<THREE.MeshStandardMaterial>(wallRef);
        const fh = flowOf(w);
        if (w) w.emissiveIntensity = (litRef.current ? 0.5 : 0.16) * (0.5 + k);
        if (fh) fh.amount.value = 1.1 * (0.35 + 0.65 * Math.max(f.nitrate, f.nitrite)) * (0.15 + 0.85 * k);
        const dil = f.w.noMuscle * Math.min(f.nitrite * 1.25, 1) * (1 - 0.25 * f.chx);
        const m = sleeve.current;
        if (m) {
            m.visible = dil > 0.02;
            (m.material as THREE.MeshBasicMaterial).opacity = 0.42 * dil * (0.8 + 0.2 * Math.sin(clock.elapsedTime * 2.6));
        }
    });
    return (
        <group>
            <mesh ref={wallRef} geometry={parts.wallGeo} material={parts.wall} {...bind} />
            <mesh ref={sleeve} geometry={parts.sleeveGeo} material={parts.sleeve} renderOrder={9} />
        </group>
    );
};
