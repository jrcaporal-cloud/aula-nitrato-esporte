import * as THREE from 'three';

/*
 * Letras e siglas desenhadas em canvas e coladas em planos (I, A, H, Z, M, PCr, Cr). Cada combinação
 * texto × cor vira um material criado uma única vez e compartilhado por todos os sarcômeros.
 */

const FONT = '800 92px Satoshi, system-ui, sans-serif';
const cache = new Map<string, { material: THREE.MeshBasicMaterial; aspect: number }>();

export interface Glyph { material: THREE.MeshBasicMaterial; aspect: number }

export const getGlyph = (text: string, color: string): Glyph => {
    const key = `${text}|${color}`;
    const hit = cache.get(key);
    if (hit) return hit;
    const probe = document.createElement('canvas').getContext('2d');
    let width = 110;
    if (probe) {
        probe.font = FONT;
        width = Math.ceil(probe.measureText(text).width) + 24;
    }
    const cv = document.createElement('canvas');
    cv.width = width;
    cv.height = 128;
    const g = cv.getContext('2d');
    if (g) {
        g.font = FONT;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillStyle = color;
        g.shadowColor = color;
        g.shadowBlur = 10;
        g.fillText(text, width / 2, 68);
    }
    const map = new THREE.CanvasTexture(cv);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;
    const entry = {
        material: new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false, toneMapped: false }),
        aspect: width / 128,
    };
    cache.set(key, entry);
    return entry;
};
