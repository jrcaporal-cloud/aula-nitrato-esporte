import * as THREE from 'three';

/*
 * Órgãos tubulares do corte esquemático: curva + perfil de raio, geometria de tubo (inteiro ou só a
 * metade de trás, que é o "corte"), borda do corte e uma tabela de pontos para posicionar partículas.
 */

type P3 = readonly [number, number, number];

export const makeCurve = (pts: readonly P3[]): THREE.CatmullRomCurve3 =>
    new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)), false, 'centripetal');

/** Perfil de raio por Catmull-Rom 1D, com chaves igualmente espaçadas em u ∈ [0, 1]. */
export const radiusProfile = (keys: readonly number[]) => (u: number): number => {
    const n = keys.length - 1;
    const x = Math.min(Math.max(u, 0), 1) * n;
    const i = Math.min(Math.floor(x), n - 1);
    const t = x - i;
    const p0 = keys[Math.max(i - 1, 0)];
    const p1 = keys[i];
    const p2 = keys[i + 1];
    const p3 = keys[Math.min(i + 2, n)];
    return 0.5 * (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (3 * p1 - p0 - 3 * p2 + p3) * t * t * t);
};

export interface Organ { curve: THREE.Curve<THREE.Vector3>; radius: (u: number) => number }

/** Órgão de raio constante. */
export const pipe = (pts: readonly P3[], r: number): Organ => ({ curve: makeCurve(pts), radius: () => r });

const Z = new THREE.Vector3(0, 0, 1);
const tT = new THREE.Vector3();

/** Referencial em u: normal no plano da cena (n) e binormal (b, quase sempre +z). */
const frameAt = (c: THREE.Curve<THREE.Vector3>, u: number, n: THREE.Vector3, b: THREE.Vector3): void => {
    c.getTangentAt(u, tT);
    n.crossVectors(Z, tT).normalize();
    b.crossVectors(tT, n).normalize();
};

/** Espessura da parede de um órgão de raio r (a fatia do corte e a casca de fora usam a mesma). */
export const wallOf = (r: number): number => 0.03 + 0.11 * r;

/**
 * Tubo de raio variável. `arc` limita o ângulo: [π, 2π] é a metade de trás (o corte), [0, 2π] o tubo
 * inteiro. `outer` soma a espessura da parede (casca de fora). UV: u ao longo do eixo, v em volta.
 */
export const tubeGeometry = (o: Organ, tubular: number, radial: number, arc: readonly [number, number] = [0, Math.PI * 2], outer = false): THREE.BufferGeometry => {
    const pos: number[] = [];
    const nor: number[] = [];
    const uvs: number[] = [];
    const idx: number[] = [];
    const pt = new THREE.Vector3();
    const n = new THREE.Vector3();
    const b = new THREE.Vector3();
    for (let i = 0; i <= tubular; i++) {
        const u = i / tubular;
        o.curve.getPointAt(u, pt);
        frameAt(o.curve, u, n, b);
        const r0 = o.radius(u);
        const r = outer ? r0 + wallOf(r0) : r0;
        for (let j = 0; j <= radial; j++) {
            const th = arc[0] + ((arc[1] - arc[0]) * j) / radial;
            const cx = Math.cos(th);
            const sy = Math.sin(th);
            const dx = n.x * cx + b.x * sy;
            const dy = n.y * cx + b.y * sy;
            const dz = n.z * cx + b.z * sy;
            pos.push(pt.x + dx * r, pt.y + dy * r, pt.z + dz * r);
            nor.push(dx, dy, dz);
            uvs.push(u, j / radial);
        }
    }
    for (let i = 0; i < tubular; i++) {
        for (let j = 0; j < radial; j++) {
            const a = i * (radial + 1) + j;
            const c = a + radial + 1;
            idx.push(a, c, a + 1, c, c + 1, a + 1);
        }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    g.setIndex(idx);
    return g;
};

/**
 * Fatia do corte: duas fitas planas (θ = π e θ = 0) entre a parede de dentro e a de fora, que mostram a
 * espessura da parede como numa lâmina anatômica. UV: u ao longo do eixo, v de dentro (0) para fora (1).
 */
export const sectionGeometry = (o: Organ, tubular: number): THREE.BufferGeometry => {
    const pos: number[] = [];
    const nor: number[] = [];
    const uvs: number[] = [];
    const idx: number[] = [];
    const pt = new THREE.Vector3();
    const n = new THREE.Vector3();
    const b = new THREE.Vector3();
    let base = 0;
    for (const sign of [-1, 1]) {
        for (let i = 0; i <= tubular; i++) {
            const u = i / tubular;
            o.curve.getPointAt(u, pt);
            frameAt(o.curve, u, n, b);
            const r = o.radius(u);
            for (const k of [0, 1]) {
                const rr = r + k * wallOf(r);
                pos.push(pt.x + n.x * sign * rr, pt.y + n.y * sign * rr, pt.z + n.z * sign * rr);
                nor.push(b.x, b.y, b.z);
                uvs.push(u, k);
            }
        }
        for (let i = 0; i < tubular; i++) {
            const a = base + i * 2;
            idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
        }
        base += (tubular + 1) * 2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    g.setIndex(idx);
    return g;
};

/* ── Tabela de pontos: ponto, normal, binormal e raio por amostra, para colocar partículas dentro do tubo ── */

export interface Lut { n: number; p: Float32Array; nx: Float32Array; bz: Float32Array; r: Float32Array }

export const buildLut = (o: Organ, n = 160): Lut => {
    const lut: Lut = { n, p: new Float32Array(n * 3), nx: new Float32Array(n * 3), bz: new Float32Array(n * 3), r: new Float32Array(n) };
    const pt = new THREE.Vector3();
    const nn = new THREE.Vector3();
    const bb = new THREE.Vector3();
    for (let i = 0; i < n; i++) {
        const u = i / (n - 1);
        o.curve.getPointAt(u, pt);
        frameAt(o.curve, u, nn, bb);
        pt.toArray(lut.p, i * 3);
        nn.toArray(lut.nx, i * 3);
        bb.toArray(lut.bz, i * 3);
        lut.r[i] = o.radius(u);
    }
    return lut;
};

/** Ponto do tubo em u, deslocado (a, b) em frações do raio ao longo da normal e da binormal. */
export const lutPoint = (l: Lut, u: number, a: number, b: number, out: THREE.Vector3): THREE.Vector3 => {
    const x = Math.min(Math.max(u, 0), 1) * (l.n - 1);
    const i = Math.min(Math.floor(x), l.n - 2);
    const k = x - i;
    const j = i + 1;
    const r = l.r[i] + (l.r[j] - l.r[i]) * k;
    for (let c = 0; c < 3; c++) {
        const p = l.p[i * 3 + c] + (l.p[j * 3 + c] - l.p[i * 3 + c]) * k;
        const nn = l.nx[i * 3 + c] + (l.nx[j * 3 + c] - l.nx[i * 3 + c]) * k;
        const bb = l.bz[i * 3 + c] + (l.bz[j * 3 + c] - l.bz[i * 3 + c]) * k;
        out.setComponent(c, p + (nn * a + bb * b) * r);
    }
    return out;
};

/** Parâmetro u do ponto da curva mais próximo de `p` (para ligar ramos ao tronco). */
export const nearestU = (c: THREE.Curve<THREE.Vector3>, p: THREE.Vector3, samples = 400): number => {
    const q = new THREE.Vector3();
    let best = 0;
    let bd = Infinity;
    for (let i = 0; i <= samples; i++) {
        const d = c.getPointAt(i / samples, q).distanceToSquared(p);
        if (d < bd) { bd = d; best = i / samples; }
    }
    return best;
};
