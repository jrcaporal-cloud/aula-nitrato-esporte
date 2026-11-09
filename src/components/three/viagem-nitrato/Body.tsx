import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { C } from '../../sims/kit/palette';
import { GLASS_POS, PALATE, POUR_ARC, TEETH, outlinePoints } from './anatomy';
import { FX_TIME, flowify, matOf } from './fx';
import { HALO_PLANE, fresnelMaterial, haloMaterial } from './materials';
import type { VnStateRef } from './state';
import { makeCurve } from './tubes';

/* Corpo com volume (casca de vidro de cabeça, pescoço, tronco e coxa), teto da boca, dentes e o copo de suco. */

const VERT = `varying vec3 vN; varying vec3 vV; varying vec3 vW;
    void main(){ vec4 w = modelMatrix * vec4(position,1.0); vec4 mv = viewMatrix * w; vW = w.xyz;
        vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`;

const FRONT = `uniform float uTime; uniform float uK; varying vec3 vN; varying vec3 vV; varying vec3 vW;
    void main(){
        // perto da câmera (close-ups) a casca recua: as faces laterais do perfil viram lâminas se vistas de lado
        float near = smoothstep(7.0, 22.0, distance(cameraPosition, vW));
        float f = 1.0 - abs(dot(normalize(vN), normalize(vV))); f *= f;
        vec3 col = mix(vec3(0.62,0.66,0.86), vec3(0.95,0.72,0.84), smoothstep(2.0, 16.0, vW.y) * 0.55);
        float band = 0.5 + 0.5 * sin(vW.y * 0.7 - uTime * 0.5);
        gl_FragColor = vec4(col, (0.03 + 0.5 * f * (0.35 + 0.65 * near)) * (0.88 + 0.12 * band) * uK);
    }`;

const BACK = `uniform float uK; varying vec3 vN; varying vec3 vV; varying vec3 vW;
    void main(){
        float f = 1.0 - abs(dot(normalize(vN), normalize(vV))); f *= f;
        float core = exp(-length(vW.xy - vec2(-2.0, 3.0)) / 11.0);
        vec3 col = mix(vec3(0.11,0.09,0.2), vec3(0.2,0.14,0.3), core);
        gl_FragColor = vec4(col, (0.2 + 0.18 * core + 0.35 * f) * uK);
    }`;

const shellMaterial = (frag: string, side: THREE.Side): THREE.ShaderMaterial => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side, uniforms: { uTime: FX_TIME, uK: { value: 1 } }, vertexShader: VERT, fragmentShader: frag,
});

/** Extrusão arredondada da silhueta: vista de frente quase some; nas bordas e por trás dá o volume. */
const bodyGeometry = (): THREE.BufferGeometry => {
    const pts = outlinePoints(300);
    if (pts.length > 1 && pts[0].distanceTo(pts[pts.length - 1]) < 1e-4) pts.pop();
    const ex = new THREE.ExtrudeGeometry(new THREE.Shape(pts), {
        depth: 3.4, steps: 1, curveSegments: 1, bevelEnabled: true, bevelThickness: 0.8, bevelSize: 0.28, bevelOffset: -0.28, bevelSegments: 6,
    });
    ex.translate(0, 0, -1.7);
    ex.deleteAttribute('normal');
    ex.deleteAttribute('uv');
    const g = mergeVertices(ex, 1e-3);
    ex.dispose();
    g.computeVertexNormals();
    return g;
};

export const BodyShell = () => {
    const parts = useMemo(() => ({
        geo: bodyGeometry(),
        front: shellMaterial(FRONT, THREE.FrontSide),
        back: shellMaterial(BACK, THREE.BackSide),
    }), []);
    useEffect(() => () => { parts.geo.dispose(); parts.front.dispose(); parts.back.dispose(); }, [parts]);
    return (
        <group>
            <mesh geometry={parts.geo} material={parts.back} renderOrder={-5} />
            <mesh geometry={parts.geo} material={parts.front} renderOrder={1} />
        </group>
    );
};

/** Teto da boca (palato duro e mole) e os incisivos. */
export const MouthParts = () => {
    const parts = useMemo(() => ({
        palate: new THREE.TubeGeometry(makeCurve(PALATE), 40, 0.07, 8, false),
        tooth: new THREE.CapsuleGeometry(0.11, 0.34, 6, 14),
        palateMat: new THREE.MeshPhysicalMaterial({ color: '#B58796', emissive: '#C9A0AC', emissiveIntensity: 0.3, roughness: 0.4, clearcoat: 0.6 }),
        toothMat: new THREE.MeshPhysicalMaterial({ color: '#EFEAF2', emissive: '#E9E5EE', emissiveIntensity: 0.22, roughness: 0.25, clearcoat: 0.8 }),
    }), []);
    useEffect(() => () => Object.values(parts).forEach(p => p.dispose()), [parts]);
    return (
        <group>
            <mesh geometry={parts.palate} material={parts.palateMat} />
            {TEETH.map(p => <mesh key={p.join(',')} geometry={parts.tooth} material={parts.toothMat} position={[p[0], p[1], p[2]]} />)}
        </group>
    );
};

/** Copo inclinado com suco, o fio de suco até a boca e um halo magenta: aparece na etapa 1. */
export const Glass = ({ stateRef }: { stateRef: VnStateRef }) => {
    const g = useRef<THREE.Group>(null);
    const stream = useRef<THREE.Mesh>(null);
    const halo = useRef<THREE.Mesh>(null);
    const juiceRef = useRef<THREE.Mesh>(null);
    const glassRef = useRef<THREE.Mesh>(null);
    const parts = useMemo(() => {
        const outer = [[0.5, 0], [0.62, 0.9], [0.76, 1.85]].map(([x, y]) => new THREE.Vector2(x, y));
        const juice = [[0, 0.08], [0.55, 0.08], [0.62, 0.9], [0.7, 1.45]].map(([x, y]) => new THREE.Vector2(x, y));
        const streamMat = new THREE.MeshStandardMaterial({ color: C.nitrateDeep, emissive: C.nitrate, emissiveIntensity: 0.6, roughness: 0.2, transparent: true, opacity: 0 });
        flowify(streamMat, { color: C.nitrateSoft, freq: 6, speed: 0.9, amount: 1.4 });
        return {
            shell: new THREE.LatheGeometry(outer, 32),
            juice: new THREE.LatheGeometry(juice, 32),
            stream: new THREE.TubeGeometry(POUR_ARC.curve, 60, 0.075, 8, false),
            shellMat: fresnelMaterial(C.nitrateSoft, 0.8),
            juiceMat: new THREE.MeshPhysicalMaterial({ color: C.nitrateDeep, emissive: C.nitrate, emissiveIntensity: 0.55, roughness: 0.2, clearcoat: 0.8, transparent: true, opacity: 0.9 }),
            haloMat: haloMaterial(C.nitrate, 0),
            streamMat,
        };
    }, []);
    useEffect(() => () => {
        parts.shell.dispose(); parts.juice.dispose(); parts.stream.dispose();
        parts.shellMat.dispose(); parts.juiceMat.dispose(); parts.haloMat.dispose(); parts.streamMat.dispose();
    }, [parts]);
    useFrame(({ camera, clock }) => {
        const w = stateRef.current.f.w.glass;
        if (!g.current) return;
        g.current.visible = w > 0.02;
        if (stream.current) stream.current.visible = w > 0.02;
        const jm = matOf<THREE.MeshPhysicalMaterial>(juiceRef);
        const sm = matOf<THREE.ShaderMaterial>(glassRef);
        const st = matOf<THREE.MeshStandardMaterial>(stream);
        const hm = matOf<THREE.MeshBasicMaterial>(halo);
        if (jm) jm.opacity = 0.9 * w;
        if (sm) sm.uniforms.uK.value = 0.8 * w;
        if (st) st.opacity = 0.75 * w;
        if (hm) hm.opacity = 0.5 * w * (0.85 + 0.15 * Math.sin(clock.elapsedTime * 2));
        if (halo.current) {
            halo.current.visible = w > 0.02;
            halo.current.quaternion.copy(camera.quaternion);
        }
    });
    return (
        <>
            <group ref={g} position={[GLASS_POS[0], GLASS_POS[1], GLASS_POS[2]]} rotation={[0, 0, -0.5]}>
                <mesh ref={juiceRef} geometry={parts.juice} material={parts.juiceMat} />
                <mesh ref={glassRef} geometry={parts.shell} material={parts.shellMat} renderOrder={2} />
            </group>
            <mesh ref={halo} geometry={HALO_PLANE} material={parts.haloMat} scale={5} position={[GLASS_POS[0] + 0.5, GLASS_POS[1] + 0.8, GLASS_POS[2] + 0.2]} renderOrder={11} />
            <mesh ref={stream} geometry={parts.stream} material={parts.streamMat} renderOrder={3} />
        </>
    );
};
