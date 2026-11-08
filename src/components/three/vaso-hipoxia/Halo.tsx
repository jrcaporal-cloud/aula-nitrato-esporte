import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { MB_SITES, NOS_SPECS, XOR_SITES } from './layout';
import { POOL, type Pool, type Sim } from './sim';
import type { SimRef } from './types';
import { dirty, setU } from './uniforms';

/*
 * Brilhos: UM só Points aditivo para tudo (halo dos íons, eritrócitos que reduzem nitrito, sítios da
 * NOS/XOR/Mb, esferas em voo, clarões e a pluma de NO). Cada ponto tem tamanho (`halo`) e opacidade (`alpha`).
 */

type PoolKey = 'rbc' | 'sites' | 'nitrite' | 'o2' | 'h' | 'feedA' | 'feedB' | 'flashW' | 'flashB' | 'no';
interface Layer { key: PoolKey; from: number; count: number; color: string; k: number }

const NN = NOS_SPECS.length;
const LAYERS: readonly Layer[] = [
    { key: 'rbc', from: 0, count: POOL.rbc, color: C.no, k: 2.4 },
    { key: 'sites', from: 0, count: NN, color: C.o2, k: 1.2 },
    { key: 'sites', from: NN, count: XOR_SITES.length, color: C.hypoxia, k: 1.2 },
    { key: 'sites', from: NN + XOR_SITES.length, count: MB_SITES.length, color: C.no, k: 0.8 },
    { key: 'nitrite', from: 0, count: POOL.nitrite, color: C.nitrite, k: 0.38 },
    { key: 'o2', from: 0, count: POOL.o2, color: C.o2, k: 0.34 },
    { key: 'h', from: 0, count: POOL.h, color: C.hypoxia, k: 0.3 },
    { key: 'feedA', from: 0, count: POOL.feedA, color: C.nitrite, k: 0.55 },
    { key: 'feedB', from: 0, count: POOL.feedB, color: C.o2, k: 0.55 },
    { key: 'flashW', from: 0, count: POOL.flashW, color: '#FFF1C2', k: 1.7 },
    { key: 'flashB', from: 0, count: POOL.flashB, color: '#CFE6FF', k: 1.5 },
    { key: 'no', from: 0, count: POOL.no, color: C.no, k: 0.95 },
];
const TOTAL = LAYERS.reduce((n, l) => n + l.count, 0);

const VS = `
attribute float aScale; attribute float aAlpha; attribute vec3 aColor;
uniform float uPx; varying vec3 vC; varying float vA;
void main() {
    vC = aColor; vA = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * uPx / max(-mv.z, 0.1);
    if (aScale < 0.02 || aAlpha < 0.01) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`;
const FS = `
varying vec3 vC; varying float vA;
void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = pow(max(1.0 - d, 0.0), 2.2) * 0.75 * vA;
    gl_FragColor = vec4(vC * a, a);
}`;

const poolOf = (sim: Sim, key: PoolKey): Pool => sim[key];

export const Halo = ({ simRef }: { simRef: SimRef }) => {
    const points = useRef<THREE.Points>(null);
    const { geo, mat } = useMemo(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TOTAL * 3), 3).setUsage(THREE.DynamicDrawUsage));
        g.setAttribute('aScale', new THREE.BufferAttribute(new Float32Array(TOTAL), 1).setUsage(THREE.DynamicDrawUsage));
        g.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array(TOTAL), 1).setUsage(THREE.DynamicDrawUsage));
        const colors = new Float32Array(TOTAL * 3);
        let off = 0;
        for (const l of LAYERS) {
            const c = new THREE.Color(l.color);
            for (let i = 0; i < l.count; i++) c.toArray(colors, (off + i) * 3);
            off += l.count;
        }
        g.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
        g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4);
        const m = new THREE.ShaderMaterial({
            vertexShader: VS, fragmentShader: FS, uniforms: { uPx: { value: 400 } },
            transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        });
        return { geo: g, mat: m };
    }, []);
    useLayoutEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

    useFrame(({ gl, camera, size }) => {
        const sim = simRef.current;
        const pos = geo.getAttribute('position') as THREE.BufferAttribute;
        const sc = geo.getAttribute('aScale') as THREE.BufferAttribute;
        const al = geo.getAttribute('aAlpha') as THREE.BufferAttribute;
        let off = 0;
        for (const l of LAYERS) {
            const p = poolOf(sim, l.key);
            (pos.array as Float32Array).set(p.pos.subarray(l.from * 3, (l.from + l.count) * 3), off * 3);
            for (let i = 0; i < l.count; i++) {
                (sc.array as Float32Array)[off + i] = p.halo[l.from + i] * l.k;
                (al.array as Float32Array)[off + i] = p.alpha[l.from + i];
            }
            off += l.count;
        }
        dirty(pos);
        dirty(sc);
        dirty(al);
        const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 40;
        setU(mat, 'uPx', (size.height * gl.getPixelRatio()) / (2 * Math.tan((fov * Math.PI) / 360)));
    });
    return <points ref={points} geometry={geo} material={mat} frustumCulled={false} raycast={() => undefined} renderOrder={8} />;
};
