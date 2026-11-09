import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { OCTA, SPHERE } from './geometry';
import { Halo } from './Halo';
import { noRaycast } from './pick';
import { POOL, type Pool, type Sim } from './sim';
import type { SimRef } from './types';

/* Íons e faíscas: uma InstancedMesh por espécie (o núcleo brilhante) mais o `Halo` aditivo de todos. */

type CoreKey = 'nitrite' | 'o2' | 'h' | 'no' | 'feedA' | 'feedB';
interface Core { key: CoreKey; geo: THREE.BufferGeometry; size: number; color: string; spin: boolean }

const CORES: readonly Core[] = [
    { key: 'nitrite', geo: SPHERE, size: 0.105, color: C.nitrite, spin: false },
    { key: 'o2', geo: SPHERE, size: 0.1, color: C.o2, spin: false },
    { key: 'h', geo: SPHERE, size: 0.085, color: C.hypoxia, spin: false },
    { key: 'no', geo: OCTA, size: 0.1, color: C.noSoft, spin: true },
    { key: 'feedA', geo: SPHERE, size: 0.13, color: C.nitriteSoft, spin: false },
    { key: 'feedB', geo: SPHERE, size: 0.12, color: C.o2Soft, spin: false },
];

const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const E = new THREE.Euler();
const P = new THREE.Vector3();
const S = new THREE.Vector3();

const poolOf = (sim: Sim, key: CoreKey): Pool => sim[key];

const CoreMesh = ({ core, simRef }: { core: Core; simRef: SimRef }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const n = POOL[core.key];
    useFrame(({ clock }) => {
        const m = mesh.current;
        if (!m) return;
        const pool = poolOf(simRef.current, core.key);
        const t = clock.elapsedTime;
        // partículas ocultas não são escritas nem desenhadas: as visíveis vão em sequência e `count` corta o resto
        let j = 0;
        for (let i = 0; i < n; i++) {
            const s = pool.scale[i] * core.size;
            if (s <= 0) continue;
            P.set(pool.pos[i * 3], pool.pos[i * 3 + 1], pool.pos[i * 3 + 2]);
            if (core.spin) m.setMatrixAt(j, M.compose(P, Q.setFromEuler(E.set(t * 3 + i, t * 2 + i * 0.7, 0)), S.set(s, s, s)));
            else m.setMatrixAt(j, M.makeScale(s, s, s).setPosition(P));
            j++;
        }
        m.count = j;
        if (j === 0) return;
        m.instanceMatrix.needsUpdate = true;
    });
    return (
        <instancedMesh ref={mesh} args={[core.geo, undefined, n]} frustumCulled={false} raycast={noRaycast}>
            <meshBasicMaterial color={core.color} toneMapped={false} />
        </instancedMesh>
    );
};

export const Particles = ({ simRef }: { simRef: SimRef }) => (
    <>
        {CORES.map(core => <CoreMesh key={core.key} core={core} simRef={simRef} />)}
        <Halo simRef={simRef} />
    </>
);
