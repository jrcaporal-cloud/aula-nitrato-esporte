import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { StructureId } from './content';
import { makeFiberMats } from './fiberShaders';
import { FiberOrganelles } from './FiberOrganelles';
import { CAP_FIB, MYOFIBRIL, SHELL_FIB } from './geometry';
import { FIB_X0, FIB_X1, WEDGE_FIB, type Mito, type Nucleus } from './layout';
import { useStructure } from './selection';
import { noRaycast } from './pick';
import { makeShell } from './shellShader';
import type { SimRef } from './types';
import { setOpacity, setU } from './uniforms';

/*
 * Uma fibra em corte (rápida ou lenta): sarcolema (parede escura com o campo de O₂ + vidro da frente),
 * miofibrilas estriadas, mitocôndrias e núcleos periféricos. Na lenta (`fade`) tudo aparece junto, por opacidade.
 */

const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const LEN = FIB_X1 - FIB_X0;
const CX = (FIB_X0 + FIB_X1) / 2;

interface Props {
    simRef: SimRef;
    id: StructureId;
    cy: number;
    r: number;
    fibrils: readonly { y: number; z: number }[];
    mito: readonly Mito[];
    nuclei: readonly Nucleus[];
    fibrilR: number;
    fade?: () => number;
}

export const FiberBody = ({ simRef, id, cy, r, fibrils, mito, nuclei, fibrilR, fade }: Props) => {
    const { bind, lit } = useStructure(id);
    const fibrilMesh = useRef<THREE.InstancedMesh>(null);
    const capMesh = useRef<THREE.InstancedMesh>(null);
    const hasFade = !!fade;
    const { wall, glass, mats, cap } = useMemo(() => {
        const spec = { cx: CX, len: LEN, r0: r, wedge: WEDGE_FIB, fixedR: r, fiber: { cy }, fade: hasFade };
        return {
            wall: makeShell({ ...spec, kind: 'wall', base: '#2a1a38', rim: '#c7d2fe' }),
            glass: makeShell({ ...spec, kind: 'glass', base: '#8e97be', rim: '#c7d2fe' }),
            mats: makeFiberMats(cy, r, hasFade),
            cap: new THREE.MeshBasicMaterial({ color: '#1e1626', transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false }),
        };
    }, [cy, r, hasFade]);
    useLayoutEffect(() => () => { wall.dispose(); glass.dispose(); mats.fibril.dispose(); mats.mito.dispose(); cap.dispose(); }, [wall, glass, mats, cap]);
    useLayoutEffect(() => {
        const m = fibrilMesh.current;
        if (!m) return;
        fibrils.forEach((f, i) => m.setMatrixAt(i, M.compose(P.set(CX, f.y, f.z), Q.identity(), S.set(LEN - 0.3, fibrilR, fibrilR))));
        m.instanceMatrix.needsUpdate = true;
    }, [fibrils, fibrilR]);
    // as duas tampas das pontas num só desenho
    useLayoutEffect(() => {
        const m = capMesh.current;
        if (!m) return;
        m.setMatrixAt(0, M.compose(P.set(FIB_X0, cy, 0), Q.identity(), S.set(1, r, r)));
        m.setMatrixAt(1, M.compose(P.set(FIB_X1, cy, 0), Q.identity(), S.set(1, r, r)));
        m.instanceMatrix.needsUpdate = true;
    }, [cy, r]);
    useFrame(() => {
        const k = fade ? fade() : 1;
        const l = lit ? 1 : 0;
        setU(wall, 'uFade', k);
        setU(wall, 'uLit', l);
        setU(glass, 'uFade', k);
        setU(glass, 'uLit', l);
        setU(mats.fibril, 'uFade', k);
        setU(mats.fibril, 'uLit', l * 0.6);
        setU(mats.mito, 'uFade', k);
        setOpacity(cap, 0.6 * k);
    });
    return (
        <group>
            <group {...bind}>
                <mesh geometry={SHELL_FIB} material={wall} position={[CX, cy, 0]} scale={[LEN, r, r]} />
                <mesh geometry={SHELL_FIB} material={glass} position={[CX, cy, 0]} scale={[LEN, r, r]} renderOrder={6} raycast={noRaycast} />
                <instancedMesh ref={capMesh} args={[CAP_FIB, cap, 2]} frustumCulled={false} renderOrder={1} raycast={noRaycast} />
            </group>
            <instancedMesh ref={fibrilMesh} args={[MYOFIBRIL, mats.fibril, fibrils.length]} raycast={noRaycast} frustumCulled={false} />
            <FiberOrganelles simRef={simRef} mito={mito} nuclei={nuclei} mats={mats} interactive={id === 'fibra'} fade={fade} />
        </group>
    );
};
