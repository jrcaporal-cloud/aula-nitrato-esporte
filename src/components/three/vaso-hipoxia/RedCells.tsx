import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { DEOXY_COLOR, OXY_COLOR } from './content';
import { DISC, DISC_PICK } from './geometry';
import { GLSL_NOISE } from './glsl';
import { noRaycast, proxyRaycast } from './pick';
import { useStructure } from './selection';
import { POOL, type CellPool, type Sim } from './sim';
import { dirty, setU, srgb } from './uniforms';
import type { SimRef } from './types';

/*
 * Eritrócitos: disco bicôncavo (perfil de Evans–Fung), instanciado, com shader próprio. Rolam em
 * precessão em volta do eixo do fluxo e deformam em "paraquedas" (mais quando o vaso aperta); a cor vai de
 * oxi (rosa vivo) a desoxi (escuro) com a saturação de CADA célula; quem reduz nitrito ganha borda verde.
 */

const VERT = /* glsl */ `
attribute float aSat; attribute vec2 aInfo;
varying vec3 vN; varying vec3 vMV; varying vec3 vL; varying float vSat; varying float vGlow;
void main() {
    vec3 p = position;
    p.y -= aInfo.x * dot(p.xz, p.xz) * 0.24;
    vec4 mv = modelViewMatrix * instanceMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vN = normalize(mat3(modelViewMatrix * instanceMatrix) * normal);
    vMV = mv.xyz; vL = position; vSat = aSat; vGlow = aInfo.y;
}`;

const FRAG = /* glsl */ `
${GLSL_NOISE}
uniform vec3 uOxy; uniform vec3 uDeoxy; uniform vec3 uGlow; uniform vec3 uO2; uniform float uLit;
varying vec3 vN; varying vec3 vMV; varying vec3 vL; varying float vSat; varying float vGlow;
const vec3 L = vec3(0.32, 0.72, 0.62);
void main() {
    vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
    vec3 V = normalize(-vMV);
    float sat = smoothstep(0.0, 1.0, vSat);
    vec3 base = mix(uDeoxy, uOxy, sat);
    float r = length(vL.xz);
    base *= 1.0 + 0.32 * (1.0 - smoothstep(0.0, 0.55, r));            // centro fino: deixa passar luz
    // membrana: textura fina de citoesqueleto que some quando a célula fica pequena na tela (sem cintilar)
    vec2 q = vL.xz * 9.0;
    float fine = 1.0 - smoothstep(0.35, 0.9, length(fwidth(q)));
    base *= 1.0 + (vnoise(q) - 0.5) * 0.14 * fine;
    base *= mix(0.8, 1.0, sat);                                        // desoxi: célula mais funda e opaca
    float lam = 0.38 + 0.72 * max(dot(N, L), 0.0);
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.4);
    vec3 col = base * lam + mix(vec3(0.55, 0.12, 0.3), vec3(1.0, 0.5, 0.58), vSat) * fres * 0.4;
    col += uO2 * fres * 0.3 * smoothstep(0.35, 1.0, vSat);             // O₂ ligado: brilho azul na borda que apaga na hipóxia
    col += vec3(1.0, 0.85, 0.9) * pow(max(dot(reflect(-L, N), V), 0.0), 22.0) * 0.22;
    col += uGlow * vGlow * (0.18 + 0.9 * fres) + vec3(0.25, 0.1, 0.12) * uLit;
    gl_FragColor = vec4(col, 1.0);
}`;

const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const AX = new THREE.Vector3();
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const PICK = proxyRaycast(DISC_PICK);
const MAX_CELLS = 64;
/** Por célula (fixos): inclinação do eixo, fase e velocidade da precessão. */
const TILT = Float32Array.from({ length: MAX_CELLS }, (_, i) => 0.5 + 0.55 * Math.sin(i * 2.3) ** 2);
const SPIN = Float32Array.from({ length: MAX_CELLS }, (_, i) => (0.55 + 0.5 * ((i * 7) % 5) / 5) * (i % 2 ? 1 : -1));

interface Props {
    simRef: SimRef;
    poolKey: 'rbc' | 'rbcB';
    /** Raio do disco por unidade de escala do pool. */
    size: number;
    interactive?: boolean;
    /** Borda verde das células que reduzem nitrito. */
    glow?: boolean;
}

const poolOf = (sim: Sim, key: Props['poolKey']): CellPool => sim[key];

export const RedCells = ({ simRef, poolKey, size, interactive, glow }: Props) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const { bind, lit } = useStructure('hemacia');
    const n = POOL[poolKey];
    const { geo, mat, sat, info } = useMemo(() => {
        const g = DISC.clone();
        const sa = new THREE.InstancedBufferAttribute(new Float32Array(n), 1).setUsage(THREE.DynamicDrawUsage);
        const inf = new THREE.InstancedBufferAttribute(new Float32Array(n * 2), 2).setUsage(THREE.DynamicDrawUsage);
        g.setAttribute('aSat', sa);
        g.setAttribute('aInfo', inf);
        const m = new THREE.ShaderMaterial({
            vertexShader: VERT, fragmentShader: FRAG, side: THREE.DoubleSide,
            uniforms: { uOxy: { value: srgb(OXY_COLOR) }, uDeoxy: { value: srgb(DEOXY_COLOR) }, uGlow: { value: srgb(C.no) }, uO2: { value: srgb(C.o2) }, uLit: { value: 0 } },
        });
        return { geo: g, mat: m, sat: sa, info: inf };
    }, [n]);
    useLayoutEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

    useFrame(({ clock }) => {
        const m = mesh.current;
        if (!m) return;
        const sim = simRef.current;
        const p = poolOf(sim, poolKey);
        const t = clock.elapsedTime;
        setU(mat, 'uLit', lit ? 1 : 0);
        // só as células visíveis entram no desenho: escritas em sequência e `count` corta o resto
        let j = 0;
        for (let i = 0; i < p.n; i++) {
            const s = p.scale[i] * size;
            if (s <= 0.004) continue;
            const ph = i * 1.7;
            const alpha = TILT[i];
            const phi = t * SPIN[i] + ph;
            AX.set(Math.cos(alpha), Math.sin(alpha) * Math.cos(phi), Math.sin(alpha) * Math.sin(phi));
            Q.setFromUnitVectors(Y_AXIS, AX);
            const bend = 0.3 + 0.4 * (1 - sim.dilate) + 0.12 * Math.sin(t * 1.7 + ph);
            m.setMatrixAt(j, M.compose(P.set(p.pos[i * 3], p.pos[i * 3 + 1], p.pos[i * 3 + 2]), Q, S.set(s, s * (1 + 0.25 * bend), s)));
            sat.setX(j, p.sat[i]);
            info.setXY(j, bend, glow ? p.halo[i] : 0);
            j++;
        }
        m.count = j;
        m.instanceMatrix.needsUpdate = true;
        dirty(sat);
        dirty(info);
    });
    return (
        <instancedMesh ref={mesh} args={[geo, mat, n]} frustumCulled={false} raycast={interactive ? PICK : noRaycast} {...(interactive ? bind : {})} />
    );
};
