import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { COL } from './colors';
import { SARC, THIN_SITES } from './layout';

/*
 * Geometrias estáticas do sarcômero, construídas uma vez no módulo e compartilhadas por todos os
 * sarcômeros da cena (cores por vértice onde a peça tem partes de tons diferentes).
 */

const paintVertices = (g: THREE.BufferGeometry, color: THREE.Color): THREE.BufferGeometry => {
    const n = g.getAttribute('position').count;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) color.toArray(arr, i * 3);
    g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
    return g;
};

const mergeParts = (parts: THREE.BufferGeometry[]): THREE.BufferGeometry => {
    const merged = mergeGeometries(parts, false);
    parts.forEach(p => p.dispose());
    return merged;
};

/** Filamento grosso (miosina): ponta afilada, haste cheia e zona nua mais fina e escura no meio. */
export const buildThick = (): THREE.BufferGeometry => {
    const half = SARC.thickHalf;
    const profile: THREE.Vector2[] = [];
    const ys = [-half, -half + 0.03, -half + 0.09, -SARC.bare - 0.02, -SARC.bare, 0, SARC.bare, SARC.bare + 0.02, half - 0.09, half - 0.03, half];
    const rs = [0.018, 0.04, SARC.thickR, SARC.thickR, 0.034, 0.03, 0.034, SARC.thickR, SARC.thickR, 0.04, 0.018];
    ys.forEach((y, i) => profile.push(new THREE.Vector2(rs[i], y)));
    const g = new THREE.LatheGeometry(profile, 14).rotateZ(-Math.PI / 2);
    const pos = g.getAttribute('position');
    const colors = new Float32Array(pos.count * 3);
    const light = new THREE.Color('#ffffff');
    const dark = new THREE.Color('#8E94A6');
    for (let i = 0; i < pos.count; i++) (Math.abs(pos.getX(i)) < SARC.bare ? dark : light).toArray(colors, i * 3);
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return g;
};

/** Cabeça de miosina: haste fina (S2) e lóbulo (S1), apontando para +y a partir da origem. */
export const buildHead = (): THREE.BufferGeometry => {
    const rod = new THREE.CylinderGeometry(0.009, 0.012, 0.07, 5).translate(0, 0.035, 0);
    const lobe = new THREE.SphereGeometry(0.028, 8, 6).scale(0.8, 1.45, 0.8).translate(0, 0.098, 0);
    return mergeParts([paintVertices(rod, new THREE.Color('#fff')), paintVertices(lobe, new THREE.Color('#fff'))]);
};

const HELIX_PITCH = 0.3;
const HELIX_R = 0.017;
const BEAD_STEP = 0.058;

/** Hélice dupla de actina (contas) com a tropomiosina no sulco; a origem fica na linha Z e o filamento vai para -x. */
export const buildThin = (): THREE.BufferGeometry => {
    const parts: THREE.BufferGeometry[] = [];
    const beads = new THREE.Color(COL.thin).lerp(new THREE.Color('#ffffff'), 0.25);
    const count = Math.floor(SARC.thinLen / BEAD_STEP);
    for (let s = 0; s < 2; s++) {
        for (let k = 0; k < count; k++) {
            const x = -0.03 - k * BEAD_STEP;
            const a = (2 * Math.PI * x) / HELIX_PITCH + s * Math.PI;
            const b = new THREE.SphereGeometry(0.0125, 7, 5).translate(x, HELIX_R * Math.cos(a), HELIX_R * Math.sin(a));
            parts.push(paintVertices(b, beads));
        }
    }
    const pts: THREE.Vector3[] = [];
    for (let x = -0.01; x > -SARC.thinLen; x -= 0.03) {
        const a = (2 * Math.PI * x) / HELIX_PITCH + Math.PI / 2;
        pts.push(new THREE.Vector3(x, (HELIX_R + 0.012) * Math.cos(a), (HELIX_R + 0.012) * Math.sin(a)));
    }
    const tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 90, 0.0055, 5, false);
    parts.push(paintVertices(tube, new THREE.Color('#E6EDFB')));
    return mergeParts(parts);
};

/** Posições (x local, ângulo) das troponinas ao longo do filamento fino. */
export const TROPONIN_X = [-0.15, -0.4, -0.65, -0.9] as const;
export const troponinAngle = (x: number): number => (2 * Math.PI * x) / HELIX_PITCH + Math.PI / 2;
export const TROPONIN_R = HELIX_R + 0.03;

/** Disco Z: placa com furos onde os filamentos finos atravessam; fica voltada para o eixo x. */
export const buildZDisc = (): THREE.BufferGeometry => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, SARC.myoR + 0.07, 0, Math.PI * 2, false);
    // depois de girar em y, (x, y) da forma viram (-z, y) no mundo
    THIN_SITES.forEach(([y, z]) => {
        const hole = new THREE.Path();
        hole.absarc(-z, y, 0.04, 0, Math.PI * 2, true);
        shape.holes.push(hole);
    });
    const g = new THREE.ExtrudeGeometry(shape, {
        depth: 0.04, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2, curveSegments: 36,
    });
    g.translate(0, 0, -0.02).rotateY(Math.PI / 2);
    return g;
};

/** Titina: mola de comprimento 1 ao longo de +x (esticada pelo `scale.x`). */
export const buildTitin = (): THREE.BufferGeometry => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 80; i++) {
        const u = i / 80;
        const a = u * Math.PI * 2 * 7;
        pts.push(new THREE.Vector3(u, 0.016 * Math.cos(a), 0.016 * Math.sin(a)));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 140, 0.0038, 4, false);
};

export const GEO = {
    thick: buildThick(),
    head: buildHead(),
    thin: buildThin(),
    zdisc: buildZDisc(),
    titin: buildTitin(),
    troponin: new THREE.SphereGeometry(0.026, 8, 6).scale(1.15, 1, 1),
    bridge: new THREE.CylinderGeometry(0.006, 0.006, 1, 5),
};
