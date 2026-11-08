import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import type { TimeRef } from '../shared/Label3D';
import type { CameraPath } from './camera';
import { matOf } from './fx';
import { HALO_PLANE, haloMaterial } from './materials';

/*
 * Halo de foco: uma mancha de luz suave atrás do órgão da etapa, que acompanha o alvo da câmera e muda
 * de cor com a história (magenta = nitrato, âmbar = nitrito, verde = NO).
 */

const STEP_COLORS: readonly string[] = [C.nitrate, C.nitrate, C.nitrate, C.nitrite, C.hypoxia, C.nitrite, C.no, C.nitrate];
const COLS = STEP_COLORS.map(c => new THREE.Color(c));
const TG = new THREE.Vector3();

export const Spotlight = ({ path, timeRef }: { path: CameraPath; timeRef: TimeRef }) => {
    const mesh = useRef<THREE.Mesh>(null);
    const mat = useMemo(() => haloMaterial('#ffffff', 0.16), []);
    useEffect(() => () => mat.dispose(), [mat]);
    useFrame(({ clock }) => {
        const m = mesh.current;
        const sm = matOf<THREE.MeshBasicMaterial>(mesh);
        if (!m || !sm) return;
        const T = Math.min(Math.max(timeRef.current.t, 0), COLS.length - 1);
        const i = Math.min(Math.floor(T), COLS.length - 2);
        sm.color.copy(COLS[i]).lerp(COLS[i + 1], T - i);
        sm.opacity = 0.17 + 0.03 * Math.sin(clock.elapsedTime * 0.8);
        path.tgt(T, TG);
        m.position.set(TG.x, TG.y, -2.4);
    });
    return <mesh ref={mesh} geometry={HALO_PLANE} material={mat} scale={15} renderOrder={-4} />;
};
