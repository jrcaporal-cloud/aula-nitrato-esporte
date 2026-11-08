import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { OCTA, SPHERE } from './geometry';
import { POOL, type Pool, type Sim } from './sim';
import type { SimRef } from './types';

/*
 * Íons e faíscas: uma InstancedMesh por espécie (o núcleo) e UM só Points aditivo para todos os brilhos
 * (halo dos íons, brilho das hemácias que reduzem nitrito e dos sítios da NOS/XOR).
 * Tudo lê os arrays tipados da simulação; matrizes escritas por quadro, sem estado do React.
 */

type CoreKey = 'nitrite' | 'o2' | 'h' | 'no';
type PoolKey = CoreKey | 'rbc' | 'sites';

interface Core { key: CoreKey; geo: THREE.BufferGeometry; size: number; color: string; spin: boolean }

const CORES: readonly Core[] = [
    { key: 'nitrite', geo: SPHERE, size: 0.105, color: C.nitrite, spin: false },
    { key: 'o2', geo: SPHERE, size: 0.1, color: C.o2, spin: false },
    { key: 'h', geo: SPHERE, size: 0.085, color: C.hypoxia, spin: false },
    { key: 'no', geo: OCTA, size: 0.14, color: C.noSoft, spin: true },
];

/** Brilho: de qual reservatório vem, cor e diâmetro (mundo) quando o brilho vale 1. */
const GLOWS: readonly { key: PoolKey; color: string; k: number }[] = [
    { key: 'rbc', color: C.no, k: 3.6 },
    { key: 'sites', color: C.no, k: 1.1 },
    { key: 'nitrite', color: C.nitrite, k: 0.38 },
    { key: 'o2', color: C.o2, k: 0.34 },
    { key: 'h', color: C.hypoxia, k: 0.3 },
    { key: 'no', color: C.no, k: 0.62 },
];

const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const E = new THREE.Euler();
const P = new THREE.Vector3();
const S = new THREE.Vector3();

const poolOf = (sim: Sim, key: PoolKey): Pool => sim[key];

const CoreMesh = ({ core, simRef }: { core: Core; simRef: SimRef }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const n = POOL[core.key];
    useFrame(({ clock }) => {
        const m = mesh.current;
        if (!m) return;
        const pool = poolOf(simRef.current, core.key);
        const t = clock.elapsedTime;
        for (let i = 0; i < n; i++) {
            const s = pool.scale[i] * core.size;
            P.set(pool.pos[i * 3], pool.pos[i * 3 + 1], pool.pos[i * 3 + 2]);
            if (s <= 0) m.setMatrixAt(i, M.makeScale(0, 0, 0));
            else if (core.spin) m.setMatrixAt(i, M.compose(P, Q.setFromEuler(E.set(t * 3 + i, t * 2 + i * 0.7, 0)), S.set(s, s, s)));
            else m.setMatrixAt(i, M.makeScale(s, s, s).setPosition(P));
        }
        m.instanceMatrix.needsUpdate = true;
    });
    return (
        <instancedMesh ref={mesh} args={[core.geo, undefined, n]} frustumCulled={false} raycast={() => undefined}>
            <meshBasicMaterial color={core.color} toneMapped={false} />
        </instancedMesh>
    );
};

const HALO_VS = `
attribute float aScale;
attribute vec3 aColor;
uniform float uPx;
varying vec3 vC;
void main() {
    vC = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * uPx / max(-mv.z, 0.1);
    if (aScale < 0.02) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`;
const HALO_FS = `
varying vec3 vC;
void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = pow(max(1.0 - d, 0.0), 2.2) * 0.75;
    gl_FragColor = vec4(vC * a, a);
}`;

const TOTAL = GLOWS.reduce((n, g) => n + POOL[g.key], 0);

const HaloCloud = ({ simRef }: { simRef: SimRef }) => {
    const points = useRef<THREE.Points>(null);
    const { geo, mat } = useMemo(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TOTAL * 3), 3).setUsage(THREE.DynamicDrawUsage));
        g.setAttribute('aScale', new THREE.BufferAttribute(new Float32Array(TOTAL), 1).setUsage(THREE.DynamicDrawUsage));
        const colors = new Float32Array(TOTAL * 3);
        let off = 0;
        for (const e of GLOWS) {
            const c = new THREE.Color(e.color);
            for (let i = 0; i < POOL[e.key]; i++) c.toArray(colors, (off + i) * 3);
            off += POOL[e.key];
        }
        g.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
        g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4);
        const m = new THREE.ShaderMaterial({
            vertexShader: HALO_VS, fragmentShader: HALO_FS, uniforms: { uPx: { value: 400 } },
            transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        });
        return { geo: g, mat: m };
    }, []);
    useLayoutEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

    useFrame(({ gl, camera, size }) => {
        const pts = points.current;
        if (!pts) return;
        const sim = simRef.current;
        const pos = (pts.geometry.getAttribute('position') as THREE.BufferAttribute);
        const sc = (pts.geometry.getAttribute('aScale') as THREE.BufferAttribute);
        let off = 0;
        for (const e of GLOWS) {
            const p = poolOf(sim, e.key);
            (pos.array as Float32Array).set(p.pos, off * 3);
            for (let i = 0; i < p.n; i++) (sc.array as Float32Array)[off + i] = p.halo[i] * e.k;
            off += p.n;
        }
        pos.needsUpdate = true;
        sc.needsUpdate = true;
        const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 40;
        (pts.material as THREE.ShaderMaterial).uniforms.uPx.value = (size.height * gl.getPixelRatio()) / (2 * Math.tan((fov * Math.PI) / 360));
    });
    return <points ref={points} geometry={geo} material={mat} frustumCulled={false} raycast={() => undefined} renderOrder={5} />;
};

export const Particles = ({ simRef }: { simRef: SimRef }) => (
    <>
        {CORES.map(core => <CoreMesh key={core.key} core={core} simRef={simRef} />)}
        <HaloCloud simRef={simRef} />
    </>
);
