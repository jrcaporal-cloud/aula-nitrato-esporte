import * as THREE from 'three';
import { srand } from './rand';

/*
 * Texturas procedurais (canvas, uma vez por tipo): relevo de mucosa, língua, fibra muscular, biofilme
 * e anel de onda. Todas repetem sem emenda. UV.x corre ao longo do órgão, UV.y em volta dele.
 */

export type BumpKind = 'rugae' | 'folds' | 'plicae' | 'tongue' | 'muscle' | 'mottle';

const SIZE = 256;
const TAU = Math.PI * 2;
const cache = new Map<string, THREE.CanvasTexture>();

const make = (key: string, draw: (g: CanvasRenderingContext2D) => void): THREE.CanvasTexture => {
    const hit = cache.get(key);
    if (hit) return hit;
    const c = document.createElement('canvas');
    c.width = c.height = SIZE;
    const g = c.getContext('2d');
    if (g) draw(g);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 4;
    cache.set(key, t);
    return t;
};

/** Altura por pixel (periódica em x e y) para as texturas de relevo "matemáticas". */
const heightField = (kind: BumpKind, x: number, y: number): number => {
    switch (kind) {
        case 'rugae': {
            const w = 0.3 * Math.sin(TAU * (2 * x + 0.2)) + 0.18 * Math.sin(TAU * (5 * x + 3 * y));
            return 1 - Math.abs(Math.sin(TAU * (3 * y + w)));
        }
        case 'folds': {
            const w = 0.12 * Math.sin(TAU * (3 * x + y));
            return 0.5 + 0.5 * Math.sin(TAU * (5 * y + w));
        }
        case 'plicae': {
            const w = 0.08 * Math.sin(TAU * (2 * y));
            return 0.5 + 0.5 * Math.sin(TAU * (10 * x + w));
        }
        case 'muscle': {
            const f = 0.5 + 0.5 * Math.sin(TAU * (12 * y + 0.25 * Math.sin(TAU * 2 * x)));
            return f * (0.78 + 0.22 * Math.sin(TAU * 36 * x));
        }
        default:
            return 0.5 + 0.25 * Math.sin(TAU * (7 * x + 3 * y)) + 0.25 * Math.sin(TAU * (4 * x - 9 * y));
    }
};

/** Mapa de relevo em tons de cinza (claro = alto). */
export const bumpTexture = (kind: BumpKind): THREE.CanvasTexture => make(`bump-${kind}`, g => {
    if (kind === 'tongue') {
        g.fillStyle = '#555';
        g.fillRect(0, 0, SIZE, SIZE);
        const r = srand(17);
        for (let i = 0; i < 260; i++) {
            const x = r() * SIZE;
            const y = r() * SIZE;
            const rad = 2.2 + r() * 3.2;
            for (const [ox, oy] of [[0, 0], [SIZE, 0], [-SIZE, 0], [0, SIZE], [0, -SIZE]]) {
                const grd = g.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, rad);
                grd.addColorStop(0, '#fff');
                grd.addColorStop(1, '#5550');
                g.fillStyle = grd;
                g.fillRect(x + ox - rad, y + oy - rad, rad * 2, rad * 2);
            }
        }
        return;
    }
    const img = g.createImageData(SIZE, SIZE);
    for (let j = 0; j < SIZE; j++) {
        for (let i = 0; i < SIZE; i++) {
            const v = Math.round(255 * heightField(kind, i / SIZE, j / SIZE));
            const k = (j * SIZE + i) * 4;
            img.data[k] = img.data[k + 1] = img.data[k + 2] = v;
            img.data[k + 3] = 255;
        }
    }
    g.putImageData(img, 0, 0);
});

/** Manchas suaves (alfa) para o biofilme: o filme é grosso aqui e fino ali. */
export const blotchTexture = (): THREE.CanvasTexture => make('blotch', g => {
    g.fillStyle = '#000';
    g.fillRect(0, 0, SIZE, SIZE);
    const r = srand(33);
    for (let i = 0; i < 70; i++) {
        const x = r() * SIZE;
        const y = r() * SIZE;
        const rad = 14 + r() * 34;
        const grd = g.createRadialGradient(x, y, 0, x, y, rad);
        grd.addColorStop(0, `rgba(255,255,255,${0.35 + r() * 0.5})`);
        grd.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = grd;
        g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
});

/** Anel suave que se abre: o "estalo" de uma conversão. */
export const ringTexture = (): THREE.CanvasTexture => make('ring', g => {
    const grd = g.createRadialGradient(SIZE / 2, SIZE / 2, 0, SIZE / 2, SIZE / 2, SIZE / 2);
    grd.addColorStop(0, 'rgba(255,255,255,0.0)');
    grd.addColorStop(0.62, 'rgba(255,255,255,0.0)');
    grd.addColorStop(0.8, 'rgba(255,255,255,1)');
    grd.addColorStop(0.9, 'rgba(255,255,255,0.35)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, SIZE, SIZE);
});
