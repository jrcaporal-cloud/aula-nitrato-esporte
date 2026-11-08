import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { GLASS_POS, OUTLINE, PALATE, TEETH, outlinePoints } from './anatomy';
import { fresnelMaterial, rimMaterial } from './materials';
import type { VnStateRef } from './state';
import { makeCurve } from './tubes';

/* Silhueta do corpo em corte, teto da boca, dentes e o copo de suco de beterraba. */

/** Contorno (tubo fino brilhante) e preenchimento translúcido atrás de tudo. */
export const BodyShell = () => {
    const parts = useMemo(() => {
        const ring = new THREE.CatmullRomCurve3(OUTLINE.map(([x, y]) => new THREE.Vector3(x, y, 0)), true, 'centripetal');
        return {
            line: new THREE.TubeGeometry(ring, 420, 0.035, 6, true),
            fill: new THREE.ShapeGeometry(new THREE.Shape(outlinePoints(280))),
            lineMat: rimMaterial(C.placebo, 0.8),
            fillMat: new THREE.MeshBasicMaterial({ color: '#3B3F55', transparent: true, opacity: 0.2, depthWrite: false, side: THREE.DoubleSide }),
        };
    }, []);
    useEffect(() => () => Object.values(parts).forEach(p => p.dispose()), [parts]);
    return (
        <group>
            <mesh geometry={parts.line} material={parts.lineMat} />
            <mesh geometry={parts.fill} material={parts.fillMat} position={[0, 0, -1.9]} />
        </group>
    );
};

/** Teto da boca (palato duro e mole) e os incisivos. */
export const MouthParts = () => {
    const parts = useMemo(() => ({
        palate: new THREE.TubeGeometry(makeCurve(PALATE), 40, 0.05, 6, false),
        tooth: new THREE.CapsuleGeometry(0.1, 0.34, 4, 10),
        rim: rimMaterial(C.placebo, 1),
        toothMat: new THREE.MeshStandardMaterial({ color: '#E9E5EE', emissive: '#E9E5EE', emissiveIntensity: 0.25, roughness: 0.4 }),
    }), []);
    useEffect(() => () => Object.values(parts).forEach(p => p.dispose()), [parts]);
    return (
        <group>
            <mesh geometry={parts.palate} material={parts.rim} />
            {TEETH.map((p, i) => <mesh key={i} geometry={parts.tooth} material={parts.toothMat} position={[p[0], p[1], p[2]]} />)}
        </group>
    );
};

/** Copo inclinado com suco: aparece na etapa 1 e some quando a história segue. */
export const Glass = ({ stateRef }: { stateRef: VnStateRef }) => {
    const g = useRef<THREE.Group>(null);
    const juiceMesh = useRef<THREE.Mesh>(null);
    const shellMesh = useRef<THREE.Mesh>(null);
    const parts = useMemo(() => {
        const outer = [[0.5, 0], [0.62, 0.9], [0.76, 1.85]].map(([x, y]) => new THREE.Vector2(x, y));
        const juice = [[0, 0.08], [0.55, 0.08], [0.62, 0.9], [0.7, 1.45]].map(([x, y]) => new THREE.Vector2(x, y));
        return {
            shell: new THREE.LatheGeometry(outer, 28),
            juice: new THREE.LatheGeometry(juice, 28),
            shellMat: fresnelMaterial(C.nitrateSoft, 0.8),
            juiceMat: new THREE.MeshStandardMaterial({ color: C.nitrateDeep, emissive: C.nitrate, emissiveIntensity: 0.5, roughness: 0.3, transparent: true, opacity: 0.9 }),
        };
    }, []);
    useEffect(() => () => Object.values(parts).forEach(p => p.dispose()), [parts]);
    useFrame(() => {
        const w = stateRef.current.f.w.glass;
        if (!g.current) return;
        g.current.visible = w > 0.02;
        const juice = juiceMesh.current?.material as THREE.MeshStandardMaterial | undefined;
        const shell = shellMesh.current?.material as THREE.ShaderMaterial | undefined;
        if (juice) juice.opacity = 0.9 * w;
        if (shell) shell.uniforms.uK.value = 0.8 * w;
    });
    return (
        <group ref={g} position={[GLASS_POS[0], GLASS_POS[1], GLASS_POS[2]]} rotation={[0, 0, -0.5]}>
            <mesh ref={juiceMesh} geometry={parts.juice} material={parts.juiceMat} />
            <mesh ref={shellMesh} geometry={parts.shell} material={parts.shellMat} />
        </group>
    );
};
