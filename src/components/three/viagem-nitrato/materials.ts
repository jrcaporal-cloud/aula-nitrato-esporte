import * as THREE from 'three';
import { getGlowTexture } from '../shared/glow';

/*
 * Materiais e utilitários de instância. Os tecidos ficam em tons de malva fosco para que a cor
 * saturada seja só dos íons: magenta = nitrato, âmbar = nitrito,
 * verde = NO, violeta = bactérias, laranja = hipóxia/acidez.
 */

/** Casca translúcida de "vidro": brilha na silhueta (fresnel) e quase some de frente. */
export const fresnelMaterial = (hex: string, strength: number): THREE.ShaderMaterial => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
    uniforms: { uColor: { value: new THREE.Color(hex) }, uK: { value: strength } },
    vertexShader: `varying vec3 vN; varying vec3 vV;
        void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uK; varying vec3 vN; varying vec3 vV;
        void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.4); gl_FragColor = vec4(uColor, f * uK); }`,
});

/** Átomo de um íon: esfera com brilho próprio (N mais escuro, O mais claro). */
export const atomMaterial = (hex: string, k = 1): THREE.MeshStandardMaterial =>
    new THREE.MeshStandardMaterial({ color: new THREE.Color(hex).multiplyScalar(k), emissive: new THREE.Color(hex), emissiveIntensity: 0.62, roughness: 0.34, metalness: 0.05 });

/** Halo aditivo (brilho sem pós-processamento): plano que olha para a câmera. */
export const haloMaterial = (hex: string, opacity: number): THREE.MeshBasicMaterial =>
    new THREE.MeshBasicMaterial({
        map: getGlowTexture(),
        color: new THREE.Color(hex),
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
    });

/** Muda o brilho próprio do material de uma malha (lido da malha, não do valor memorizado). */
export const setEmissive = (m: THREE.Material | THREE.Material[] | undefined, v: number): void => {
    if (m && !Array.isArray(m) && 'emissiveIntensity' in m) (m as THREE.MeshStandardMaterial).emissiveIntensity = v;
};

/** Geometrias compartilhadas. */
export const SPHERE_LO = new THREE.IcosahedronGeometry(1, 1);
export const SPHERE_MID = new THREE.IcosahedronGeometry(1, 2);
export const HALO_PLANE = new THREE.PlaneGeometry(1, 1);

const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const S = new THREE.Vector3();

/** Escreve a instância i numa posição com escala uniforme. */
export const put = (m: THREE.InstancedMesh, i: number, p: THREE.Vector3, s: number): void => {
    m.setMatrixAt(i, M.compose(p, Q, S.setScalar(s)));
};

/** Escreve um halo (plano voltado para a câmera) na instância i. */
export const putHalo = (m: THREE.InstancedMesh, i: number, p: THREE.Vector3, camQ: THREE.Quaternion, size: number): void => {
    m.setMatrixAt(i, M.compose(p, camQ, S.setScalar(size)));
};
