import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { HYPOXIA_POS, STOMACH_PATH } from './anatomy';
import { HALO_PLANE, atomMaterial, haloMaterial, put, putHalo } from './materials';
import { ringTexture } from './textures';
import { srand } from './rand';
import type { VnStateRef } from './state';
import { buildLut, lutPoint } from './tubes';

/*
 * NO = faíscas verdes que nascem no estômago ácido (nitrito + H⁺) e no músculo com pouco O₂ e
 * flutuam até sumir. O número de faíscas segue o nitrito que chega (e cai com a clorexidina).
 */

const PER = 22;
const STOMACH_LUT = buildLut(STOMACH_PATH, 80);
const P = new THREE.Vector3();
const D = new THREE.Vector3();
const COL = new THREE.Color();
/** Fração inicial da vida da faísca em que o anel do "estalo" (nitrito virando NO) se abre. */
const BIRTH = 0.22;

interface Spark { home: THREE.Vector3; dir: THREE.Vector3; ph: number; sp: number }

const makeSparks = (seed: number, home: (r: () => number, out: THREE.Vector3) => void): Spark[] => {
    const r = srand(seed);
    return Array.from({ length: PER }, () => {
        const h = new THREE.Vector3();
        home(r, h);
        return { home: h, dir: new THREE.Vector3(r() - 0.5, r() * 0.7 + 0.1, r() - 0.5).normalize(), ph: r(), sp: 0.7 + r() * 0.6 };
    });
};

export const Sparks = ({ stateRef }: { stateRef: VnStateRef }) => {
    const body = useRef<THREE.InstancedMesh>(null);
    const halo = useRef<THREE.InstancedMesh>(null);
    const ring = useRef<THREE.InstancedMesh>(null);
    const groups = useMemo(() => [
        makeSparks(5, (r, out) => lutPoint(STOMACH_LUT, 0.2 + r() * 0.65, (r() - 0.5) * 1.1, (r() - 0.5) * 1.1, out)),
        makeSparks(9, (r, out) => out.set(HYPOXIA_POS[0] + (r() - 0.5) * 2.4, HYPOXIA_POS[1] + (r() - 0.5) * 0.9, HYPOXIA_POS[2] + (r() - 0.5) * 0.7)),
    ], []);
    const geo = useMemo(() => new THREE.OctahedronGeometry(1, 0), []);
    const mats = useMemo(() => ({
        body: atomMaterial(C.no, 1.15),
        halo: haloMaterial(C.no, 0.62),
        ring: new THREE.MeshBasicMaterial({ map: ringTexture(), color: C.noSoft, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
    }), []);
    useEffect(() => () => { geo.dispose(); mats.body.dispose(); mats.halo.dispose(); mats.ring.dispose(); }, [geo, mats]);
    useEffect(() => {
        const r = ring.current;
        if (r) for (let i = 0; i < PER * 2; i++) r.setColorAt(i, COL.setScalar(1));
    }, []);

    useFrame(({ clock, camera }) => {
        const b = body.current;
        const h = halo.current;
        const rg = ring.current;
        if (!b || !h || !rg) return;
        const f = stateRef.current.f;
        const t = clock.elapsedTime;
        let c = 0;
        let cr = 0;
        for (let gi = 0; gi < groups.length; gi++) {
            const list = groups[gi];
            const dens = gi === 0
                ? f.w.noStomach * (0.4 + 0.6 * f.nitrate) * (1 - 0.9 * f.chx)
                : f.w.noMuscle * Math.min(f.nitrite * 1.25, 1) * (1 - 0.25 * f.chx);
            const want = Math.min(Math.max(dens, 0), 1) * PER;
            for (let i = 0; i < Math.ceil(want); i++) {
                const sp = list[i];
                const p = (t * 0.42 * sp.sp + sp.ph) % 1;
                const flick = 0.8 + 0.2 * Math.sin(t * 15 + sp.ph * 40);
                const k = 0.19 * Math.sin(Math.PI * p) ** 0.6 * flick * Math.min(want - i, 1);
                P.copy(sp.home).addScaledVector(D.copy(sp.dir), p * 0.9);
                put(b, c, P, k);
                putHalo(h, c, P, camera.quaternion, k * 5.5);
                c++;
                if (p < BIRTH) {
                    const kk = p / BIRTH;
                    putHalo(rg, cr, sp.home, camera.quaternion, (0.25 + 1.0 * kk) * Math.min(want - i, 1));
                    rg.setColorAt(cr++, COL.setScalar(1.1 * (1 - kk) ** 1.4));
                }
            }
        }
        b.count = c;
        h.count = c;
        rg.count = cr;
        // sem faíscas na etapa: nada é enviado nem desenhado
        b.visible = h.visible = c > 0;
        rg.visible = cr > 0;
        if (cr > 0) {
            rg.instanceMatrix.needsUpdate = true;
            if (rg.instanceColor) rg.instanceColor.needsUpdate = true;
        }
        if (c > 0) {
            b.instanceMatrix.needsUpdate = true;
            h.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <group>
            <instancedMesh ref={body} args={[geo, mats.body, PER * 2]} frustumCulled={false} />
            <instancedMesh ref={halo} args={[HALO_PLANE, mats.halo, PER * 2]} frustumCulled={false} renderOrder={10} />
            <instancedMesh ref={ring} args={[HALO_PLANE, mats.ring, PER * 2]} frustumCulled={false} renderOrder={13} />
        </group>
    );
};
