import { useEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { FX_TIME } from './fx';
import { srand } from './rand';

/*
 * Poeira de ambiente: pontos suaves que sobem devagar e piscam, em volta do corpo. Todo o movimento é
 * feito no shader (um único desenho, sem custo por quadro na CPU).
 */

const COUNT = 320;

const VERT = `uniform float uTime; uniform float uDpr; attribute vec3 aSeed; varying float vA; varying float vT;
    void main(){
        vec3 p = position;
        float span = 34.0;
        float y = mod(uTime * aSeed.x * 0.35 + aSeed.y * span, span);
        p.y += y - 12.0;
        p.x += sin(uTime * 0.21 + aSeed.y * 40.0) * 0.9;
        p.z += cos(uTime * 0.17 + aSeed.x * 30.0) * 0.9;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSeed.z * 420.0 * uDpr / max(-mv.z, 1.0);
        vA = smoothstep(0.0, 4.0, y) * (1.0 - smoothstep(span - 5.0, span, y)) * (0.55 + 0.45 * sin(uTime * 0.9 + aSeed.y * 60.0));
        vT = aSeed.x;
    }`;
const FRAG = `varying float vA; varying float vT;
    void main(){
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = 1.0 - smoothstep(0.0, 1.0, d); a *= a;
        vec3 col = mix(vec3(0.72,0.7,1.0), vec3(1.0,0.55,0.78), step(0.72, vT));
        gl_FragColor = vec4(col, a * vA * 0.5);
    }`;

export const Dust = () => {
    const dpr = useThree(s => s.gl.getPixelRatio());
    const parts = useMemo(() => {
        const r = srand(404);
        const pos = new Float32Array(COUNT * 3);
        const seed = new Float32Array(COUNT * 3);
        for (let i = 0; i < COUNT; i++) {
            pos.set([-20 + r() * 34, 0, -9 + r() * 24], i * 3);
            seed.set([0.4 + r() * 0.9, r(), 0.4 + r() * 1.1], i * 3);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 3));
        const mat = new THREE.ShaderMaterial({
            transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
            uniforms: { uTime: FX_TIME, uDpr: { value: 1 } }, vertexShader: VERT, fragmentShader: FRAG,
        });
        return { geo, mat };
    }, []);
    const pts = useRef<THREE.Points>(null);
    useEffect(() => {
        const m = pts.current?.material as THREE.ShaderMaterial | undefined;
        if (m) m.uniforms.uDpr.value = dpr;
    }, [dpr]);
    useEffect(() => () => { parts.geo.dispose(); parts.mat.dispose(); }, [parts]);
    return <points ref={pts} geometry={parts.geo} material={parts.mat} frustumCulled={false} renderOrder={8} />;
};
