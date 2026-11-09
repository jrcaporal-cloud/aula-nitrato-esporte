import * as THREE from 'three';
import { GLSL_FIELD, GLSL_NOISE, GLSL_RADIUS } from './glsl';
import { TAPER_X0, CAP_X0 } from './layout';
import { C } from '../../sims/kit/palette';
import { U, srgb } from './uniforms';

/*
 * Cascos de tubo em corte (vaso, arteríola, fibra). Um mesmo vertex shader leva o raio ao longo de x
 * (afunilamento e dilatação, sem remontar geometria); cada tipo muda só o fragment:
 *  wall     — parede de trás (endotélio em mosaico, ou sarcolema escuro com o campo de O₂ na fibra);
 *  glass    — as tiras da frente, translúcidas;
 *  lumen    — luz do sangue + glicocálice (aditivo);
 *  muscle   — células de músculo liso em volta da arteriola.
 */

export type ShellKind = 'wall' | 'glass' | 'lumen' | 'muscle';

export interface ShellSpec {
    kind: ShellKind;
    /** Centro e comprimento (x) do tubo, e o raio da geometria (a escala da malha, usada no picking). */
    cx: number; len: number; r0: number;
    wedge: number;
    /** Multiplicador do raio (casca interna do lúmen, bainha de músculo). */
    mul?: number;
    /** Raio fixo em vez do raio vivo do vaso (fibra, capilar da fibra lenta). */
    fixedR?: number;
    fiber?: { cy: number };
    /** Cor-base do fundo e da borda do corte. */
    base?: string; rim?: string;
    fade?: boolean;
    /** Brilho da estrutura sob o ponteiro, lido por quadro. */
    lit?: { value: number };
}

const VERT = /* glsl */ `
${GLSL_RADIUS}
uniform float uCx; uniform float uLen; uniform float uR0; uniform float uMul; uniform float uCy;
varying vec3 vN; varying vec3 vMV; varying float vWx; varying float vPhi; varying float vWy; varying float vR;
void main() {
    float wx = uCx + position.x * uLen;
    float R = radiusAt(wx) * uMul;
    vec3 p = vec3(position.x, position.yz * (R / uR0));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vMV = mv.xyz;
    vN = normalMatrix * normalize(vec3(0.0, position.yz));
    vWx = wx; vPhi = atan(position.y, -position.z); vWy = uCy + position.y * R; vR = R;
}`;

const FRAG = /* glsl */ `
${GLSL_NOISE}
${GLSL_FIELD}
uniform float uNos; uniform float uHyp; uniform float uFlow; uniform float uRing; uniform float uDil; uniform float uNoT; uniform vec3 uNoC;
uniform float uLit; uniform float uWedge; uniform float uX0; uniform float uX1; uniform float uFade; uniform float uCy;
uniform float uTx0; uniform float uTx1; uniform vec3 uBase; uniform vec3 uRim;
varying vec3 vN; varying vec3 vMV; varying float vWx; varying float vPhi; varying float vWy; varying float vR;
const vec3 L = vec3(0.30, 0.76, 0.58);
const float PI = 3.14159265;

void main() {
    vec3 V = normalize(-vMV);
    vec3 N = normalize(vN);
#if defined(WALL) || defined(LUMEN)
    N = -N;
#endif
#ifdef MUSCLE
    if (!gl_FrontFacing) N = -N;
#endif
    float ndv = clamp(dot(N, V), 0.0, 1.0);
    float fres = pow(1.0 - ndv, 2.2);
    float fe = smoothstep(uX0, uX0 + 2.0, vWx) * (1.0 - smoothstep(uX1 - 2.0, uX1, vWx));
    float lam = max(dot(N, L), 0.0);
    float edgeD = (PI - uWedge) - abs(vPhi);          // distância angular até a aresta do corte
    float lip = smoothstep(0.14, 0.0, edgeD);

#ifdef WALL
  #ifdef FIBER
    float d = clamp((uCy + vR - vWy) / (2.0 * vR), 0.0, 1.0);
    float g = vnoise(vec2(vWx * 3.0, vWy * 3.0));
    vec3 col = uBase * (0.75 + 0.5 * g) * (0.5 + 0.7 * lam) + vec3(0.55, 0.25, 0.4) * fres * 0.35;
    col += o2Field(d, 0.0) * 0.36;
    // hipóxia: manchas laranja lentas no tecido, mais fortes longe do capilar (d → 1)
    float mott = fbm3(vec2(vWx * 0.9, vWy * 1.3) + vec2(uTime * 0.04, -uTime * 0.025));
    col += vec3(1.0, 0.5, 0.18) * uHyp * smoothstep(0.35, 0.85, mott) * (0.12 + 0.22 * d);
    col += uRim * lip * 0.6 + vec3(0.3, 0.12, 0.2) * uLit;
  #else
    vec2 q = vec2(vWx / 2.1, vPhi * 0.9 / 0.8);
    vec3 vo = voro(q);
    // junções: grossas e escuras com o vaso contraído; finas e lisas quando o NO relaxa a parede
    float jd = vo.y - vo.x;
    float jw = mix(0.15, 0.06, uDil);
    float edge = 1.0 - smoothstep(jw * 0.25, jw + fwidth(jd), jd);
    float nuc = step(vo.z, 0.84) * (1.0 - smoothstep(0.17, 0.27, vo.x));
    vec3 col = mix(uBase * 0.8, uBase * 1.55, vo.z);
    col *= 1.0 + (1.0 - uDil) * 0.22 * (0.5 - smoothstep(0.0, 0.5, vo.x));   // células abauladas quando contraído
    col = mix(col, vec3(0.62, 0.30, 0.5) * mix(0.7, 1.0, uDil), edge * mix(0.65, 0.4, uDil));
    col = mix(col, vec3(0.2, 0.1, 0.34) + vec3(0.1, 0.07, 0.14) * (1.0 - smoothstep(0.0, 0.17, vo.x)), nuc);
    col *= 0.5 + 0.8 * lam;
    col += vec3(0.95, 0.45, 0.62) * fres * 0.5;
    col += vec3(0.3, 0.55, 1.0) * uNos * 0.34 * (1.0 - smoothstep(0.0, 0.5, vo.x)) * (0.75 + 0.25 * sin(uTime * 1.4 + vo.z * 6.28));
    // o NO correndo pelas junções, no sentido do fluxo
    float wave = 0.5 + 0.5 * sin(vWx * 1.4 - uTime * 2.0 + vo.z * 2.0);
    col += uNoC * edge * uNoT * 0.3 * wave * wave;
    col = mix(col, col * vec3(1.35, 0.85, 0.55) + vec3(0.07, 0.03, 0.0), uAcid * 0.55);
    col *= 1.0 - 0.18 * uHyp;
    col += uRim * lip * 0.75 + vec3(0.45, 0.16, 0.28) * uLit;
  #endif
    gl_FragColor = vec4(col * fe, uFade);
#endif

#ifdef GLASS
    float a = (0.06 + 0.5 * pow(1.0 - ndv, 1.6)) * fe + lip * 0.5;
    vec3 col = mix(uBase, uRim, lip);
    gl_FragColor = vec4(col + vec3(0.25, 0.1, 0.15) * uLit, clamp(a * (1.0 + uLit), 0.0, 1.0) * uFade);
#endif

#ifdef LUMEN
    float facing = pow(ndv, 1.4);
    vec3 blood = mix(vec3(0.62, 0.1, 0.22), vec3(0.2, 0.1, 0.5), uHyp);
    blood = mix(blood, blood + vec3(0.32, 0.13, 0.0), uAcid * 0.7);
    float band = 0.82 + 0.18 * sin(vWx * 2.4 - uFlow * 2.2 + vPhi * 2.0);
    float fuzz = smoothstep(0.55, 0.95, vnoise(vec2(vWx * 11.0 - uTime * 0.3, vPhi * 8.0)));
    vec3 col = blood * facing * 0.5 * band + vec3(1.0, 0.62, 0.78) * fuzz * 0.2 * (0.25 + fres);
    col += vec3(0.5, 0.9, 0.7) * uNos * 0.05 * facing;
    gl_FragColor = vec4(col * fe * uFade, 1.0);
#endif

#ifdef MUSCLE
    float row = vWx / 0.5 + 0.18 * sin(vPhi * 2.0);
    float id = floor(row); float f = fract(row);
    float prof = 0.5 + 0.5 * cos((vPhi + id * 1.3) * 1.6);
    float half_ = 0.1 + 0.4 * prof;
    float mask = smoothstep(half_, half_ - 0.07, abs(f - 0.5));
    mask *= 1.0 - smoothstep(uTx0, uTx1, vWx);
    if (mask < 0.35) discard;
    float nuc = smoothstep(0.82, 0.95, prof) * smoothstep(0.2, 0.05, abs(f - 0.5));
    vec3 col = mix(uBase, uBase * 1.3, vnoise(vec2(vWx * 6.0, vPhi * 5.0)));
    col = mix(col, vec3(0.3, 0.14, 0.28), nuc);
    col *= 0.45 + 0.75 * lam;
    col += vec3(1.0, 0.6, 0.7) * fres * 0.25;
    col += vec3(0.2, 0.95, 0.65) * (uRing * 0.5 + uLit * 0.4) * (0.4 + prof * 0.6);
    gl_FragColor = vec4(col * fe, 1.0);
#endif
}`;

const NO_C = { value: srgb(C.no) };

export const makeShell = (s: ShellSpec): THREE.ShaderMaterial => {
    const own = (v: number) => ({ value: v });
    const fixed = s.fixedR !== undefined;
    const mat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        defines: { [s.kind.toUpperCase()]: '', ...(s.fiber ? { FIBER: '' } : {}) },
        uniforms: {
            uTime: U.uTime, uSat: U.uSat, uAcid: U.uAcid, uHyp: U.uHyp, uNos: U.uNos, uFlow: U.uFlow, uRing: U.uRing,
            uDil: U.uDil, uNoT: U.uNoT, uNoC: NO_C,
            uArtR: fixed ? own(s.fixedR as number) : U.uArtR, uCapR: fixed ? own(s.fixedR as number) : U.uCapR,
            uTx0: own(fixed ? 1e4 : TAPER_X0), uTx1: own(fixed ? 1e4 + 1 : CAP_X0),
            uCx: own(s.cx), uLen: own(s.len), uR0: own(s.r0), uMul: own(s.mul ?? 1), uCy: own(s.fiber?.cy ?? 0),
            uWedge: own(s.wedge), uX0: own(s.cx - s.len / 2), uX1: own(s.cx + s.len / 2), uFade: own(1),
            uLit: s.lit ?? own(0),
            uBase: { value: srgb(s.base ?? '#2a1330') },
            uRim: { value: srgb(s.rim ?? '#f5c2d1') },
        },
        side: s.kind === 'wall' || s.kind === 'lumen' ? THREE.BackSide : s.kind === 'muscle' ? THREE.DoubleSide : THREE.FrontSide,
        transparent: s.kind === 'glass' || s.kind === 'lumen' || !!s.fade,
        depthWrite: s.kind === 'wall' || s.kind === 'muscle',
        blending: s.kind === 'lumen' ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    return mat;
};
