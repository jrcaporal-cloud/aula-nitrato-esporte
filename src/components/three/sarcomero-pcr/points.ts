import { useCallback, useEffect, useMemo } from 'react';
import type { RootState } from '@react-three/fiber';
import * as THREE from 'three';

/*
 * Nuvem de pontos aditivos (Ca²⁺, faíscas de ATP, fluxo): posições e escalas num par de arrays
 * tipados que o dono da nuvem reescreve por quadro, sem estado do React.
 */

const VS = `
attribute float aScale;
uniform float uSize;
uniform float uPx;
void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * uPx / max(-mv.z, 0.1);
    if (aScale < 0.02) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`;
const FS = `
uniform vec3 uColor;
uniform float uOpacity;
void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float halo = pow(max(1.0 - d, 0.0), 2.0);
    float core = smoothstep(0.38, 0.0, d);
    vec3 c = mix(uColor, vec3(1.0), core * 0.55);
    float a = (halo * 0.8 + core) * uOpacity;
    gl_FragColor = vec4(c * a, a);
}`;

export interface Cloud { n: number; pos: Float32Array; scale: Float32Array }

export const makeCloud = (n: number): Cloud => ({ n, pos: new Float32Array(n * 3), scale: new Float32Array(n) });

/** Pixels por unidade de cena a 1 de distância (para o tamanho do ponto acompanhar a perspectiva). */
export const pxPerUnit = ({ gl, camera, size }: RootState): number => {
    const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 40;
    return (size.height * gl.getPixelRatio()) / (2 * Math.tan((fov * Math.PI) / 360));
};

/** Escreve um uniform de ShaderMaterial (função de módulo, ver look.ts). */
export const setUniform = (m: THREE.ShaderMaterial, name: string, v: number): void => { m.uniforms[name].value = v; };

export const usePointCloud = (n: number, color: string, size: number, opacity = 0.9) => {
    const cloud = useMemo(() => makeCloud(n), [n]);
    const built = useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(cloud.pos, 3).setUsage(THREE.DynamicDrawUsage));
        geometry.setAttribute('aScale', new THREE.BufferAttribute(cloud.scale, 1).setUsage(THREE.DynamicDrawUsage));
        geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4);
        const material = new THREE.ShaderMaterial({
            vertexShader: VS,
            fragmentShader: FS,
            uniforms: { uSize: { value: size }, uPx: { value: 400 }, uColor: { value: new THREE.Color(color) }, uOpacity: { value: opacity } },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        return { geometry, material };
    }, [cloud, color, size, opacity]);
    useEffect(() => () => { built.geometry.dispose(); built.material.dispose(); }, [built]);

    /** Chamar no fim do `useFrame`, depois de escrever os arrays. */
    const flush = useCallback((state: RootState, alpha = 1) => {
        built.geometry.getAttribute('position').needsUpdate = true;
        built.geometry.getAttribute('aScale').needsUpdate = true;
        setUniform(built.material, 'uPx', pxPerUnit(state));
        setUniform(built.material, 'uOpacity', opacity * alpha);
    }, [built, opacity]);

    return { cloud, geometry: built.geometry, material: built.material, flush };
};

export const noRaycast = (): void => undefined;
