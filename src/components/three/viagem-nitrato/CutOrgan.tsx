import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { damp, flowOf, flowify, matOf } from './fx';
import { fresnelMaterial } from './materials';
import { useStructure } from './selection';
import type { VnFrame, VnStateRef } from './state';
import type { StructureId } from './structures';
import { bumpTexture, type BumpKind } from './textures';
import { withStriations } from './tissue';
import { sectionGeometry, tubeGeometry, type Organ } from './tubes';

/*
 * Órgão tubular em corte anatômico: a metade de trás (a mucosa vista por dentro, com relevo), a fatia do
 * corte (a espessura da parede, em fita clara), uma casca de vidro na frente e, se pedido, um pulso de
 * luz que corre pelo tubo no sentido do fluxo. O foco da etapa acende o órgão em destaque e
 * esmaece os outros. `tint` empurra o brilho da parede para outra cor conforme a cena (o ácido do estômago).
 */

const BACK: readonly [number, number] = [Math.PI, Math.PI * 2];

export interface Tint { color: string; amount: (f: VnFrame) => number }

export interface BumpSpec { kind: BumpKind; repeat: readonly [number, number]; scale: number }

export interface FlowSpec {
    color: string;
    freq: number;
    speed: number;
    /** Intensidade do pulso (padrão 0,9); `level` a multiplica por quadro (0 … 1). */
    amount?: number;
    level?: (f: VnFrame) => number;
    /** Troca a cor do pulso por quadro (ex.: nitrato → nitrito no plasma). */
    tint?: (f: VnFrame, out: THREE.Color) => void;
}

export interface CutOrganProps {
    id: StructureId;
    organ: Organ;
    base: string;
    emissive: string;
    /** Cor da casca de vidro. */
    rim: string;
    /** Cor da fatia do corte. */
    cut?: string;
    tubular: number;
    radial: number;
    /** Força da casca da frente (0 = sem casca, para vasos finos). */
    shell?: number;
    stateRef: VnStateRef;
    tint?: Tint;
    bump?: BumpSpec;
    flow?: FlowSpec;
    /** Brilho de repouso da parede (padrão 0,16). */
    glow?: number;
    /** Tecido procedural da parede (tissue.ts): 'muscle' = fibras e estrias. */
    surface?: 'muscle';
}

export const CutOrgan = ({ id, organ, base, emissive, rim, cut = '#D8B9BF', tubular, radial, shell = 0.5, stateRef, tint, bump, flow, glow = 0.16, surface }: CutOrganProps) => {
    const geo = useMemo(() => ({
        wall: tubeGeometry(organ, tubular, radial, BACK),
        shell: shell > 0 ? tubeGeometry(organ, tubular, radial, [0, Math.PI * 2], true) : null,
        cut: sectionGeometry(organ, tubular),
    }), [organ, tubular, radial, shell]);

    const res = useMemo(() => {
        const tex = bump ? bumpTexture(bump.kind).clone() : null;
        if (tex && bump) {
            tex.repeat.set(bump.repeat[0], bump.repeat[1]);
            tex.needsUpdate = true;
        }
        const wall = new THREE.MeshStandardMaterial({
            color: new THREE.Color(base), emissive: new THREE.Color(emissive), emissiveIntensity: glow,
            roughness: 0.38, metalness: 0.02, side: THREE.DoubleSide,
        });
        if (tex && bump) {
            wall.bumpMap = tex;
            wall.bumpScale = bump.scale;
        }
        if (flow) flowify(wall, { color: flow.color, freq: flow.freq, speed: flow.speed });
        if (surface === 'muscle') withStriations(wall);
        return {
            tex, wall,
            shell: shell > 0 ? fresnelMaterial(rim, shell) : null,
            cut: new THREE.MeshStandardMaterial({ color: new THREE.Color(cut), emissive: new THREE.Color(cut), emissiveIntensity: 0.3, roughness: 0.6, side: THREE.DoubleSide }),
        };
    }, [base, emissive, glow, bump, flow, shell, rim, cut, surface]);

    const { bind, lit } = useStructure(id);
    const litRef = useRef(lit);
    useEffect(() => { litRef.current = lit; }, [lit]);
    const cols = useMemo(() => ({ base: new THREE.Color(base), emi: new THREE.Color(emissive), tint: tint ? new THREE.Color(tint.color) : null, cut: new THREE.Color(cut) }), [base, emissive, tint, cut]);
    const dim = useRef(0.5);
    const wallRef = useRef<THREE.Mesh>(null);
    const cutRef = useRef<THREE.Mesh>(null);
    const shellRef = useRef<THREE.Mesh>(null);

    useEffect(() => () => {
        Object.values(geo).forEach(g => g?.dispose());
        res.wall.dispose(); res.shell?.dispose(); res.cut.dispose(); res.tex?.dispose();
    }, [geo, res]);

    useFrame((_, delta) => {
        const f = stateRef.current.f;
        dim.current = damp(dim.current, f.focus[id], 5, Math.min(delta, 0.1));
        const k = litRef.current ? 1 : dim.current;
        const shade = 0.5 + 0.5 * k;
        const t = tint ? tint.amount(f) : 0;
        const w = matOf<THREE.MeshStandardMaterial>(wallRef);
        const c = matOf<THREE.MeshStandardMaterial>(cutRef);
        const sh = matOf<THREE.ShaderMaterial>(shellRef);
        if (!w || !c) return;
        w.color.copy(cols.base).multiplyScalar(shade);
        w.emissive.copy(cols.emi);
        if (cols.tint) w.emissive.lerp(cols.tint, Math.min(t, 1));
        w.emissiveIntensity = (litRef.current ? 0.5 : glow * (0.45 + 0.9 * k)) + t * 0.2;
        c.emissiveIntensity = 0.06 + 0.3 * k + (litRef.current ? 0.4 : 0);
        c.color.copy(cols.cut).multiplyScalar(0.3 + 0.6 * k);
        if (sh) sh.uniforms.uK.value = shell * (0.55 + 0.8 * k);
        const fh = flowOf(w);
        if (fh && flow) {
            fh.amount.value = (flow.amount ?? 0.9) * (flow.level ? flow.level(f) : 1) * (0.15 + 0.85 * k);
            if (flow.tint) flow.tint(f, fh.color.value);
        }
    });

    return (
        <group>
            {/* com casca, só ela recebe o raio do ponteiro (envolve a parede): metade dos triângulos testados */}
            <mesh ref={wallRef} geometry={geo.wall} material={res.wall} {...(geo.shell ? undefined : bind)} />
            {geo.shell && res.shell && <mesh ref={shellRef} geometry={geo.shell} material={res.shell} renderOrder={2} {...bind} />}
            <mesh ref={cutRef} geometry={geo.cut} material={res.cut} />
        </group>
    );
};
