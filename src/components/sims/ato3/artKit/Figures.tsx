import { C } from '../../kit/palette';

/** Figuras de pictograma compartilhadas pelas cenas: corredor, ciclista, bandeira, coração, pulmão, xícara e beterraba. */

const RUN_A = 'M 2 -42 L 10 -36 L 16 -44 M 2 -42 L -7 -34 L -12 -26 M -3 -26 L 9 -18 L 4 -4 M -3 -26 L -8 -14 L -20 -9';
const RUN_B = 'M 2 -42 L -7 -34 L -12 -26 M 2 -42 L 10 -36 L 16 -44 M -3 -26 L -8 -14 L -20 -9 M -3 -26 L 9 -18 L 4 -4';

interface RunnerProps {
    x: number;
    y: number;
    s?: number;
    color: string;
    still?: boolean;
    /** Espelha para correr para a esquerda. */
    flip?: boolean;
}

/** Corredor de perfil, de frente para a direita; (x, y) é o pé. A passada alterna com <animate> do SVG. */
export const Runner = ({ x, y, s = 1, color, still = false, flip = false }: RunnerProps) => (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} stroke={color} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <circle cx={5} cy={-52} r={6.5} fill={color} stroke="none" />
        <path d="M 3 -44 L -3 -26" />
        <path d={RUN_A}>
            {!still && <animate attributeName="d" values={`${RUN_A};${RUN_B};${RUN_A}`} dur="0.5s" repeatCount="indefinite" />}
        </path>
    </g>
);

interface Pt { x: number; y: number }

/** Joelho de uma perna de duas partes (cinemática inversa simples), com o joelho para a frente (+x). */
const knee = (h: Pt, f: Pt, l1: number, l2: number): Pt => {
    const dx = f.x - h.x;
    const dy = f.y - h.y;
    const d = Math.hypot(dx, dy);
    const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
    const k = Math.sqrt(Math.max(l1 * l1 - a * a, 0));
    return { x: h.x + (a * dx) / d + (k * dy) / d, y: h.y + (a * dy) / d - (k * dx) / d };
};

const HIP: Pt = { x: -8, y: -56 };
const legPath = (theta: number): string => {
    const one = (t: number) => {
        const f = { x: 11 * Math.cos(t), y: -22 + 11 * Math.sin(t) };
        const k = knee(HIP, f, 27, 29);
        return `M ${HIP.x} ${HIP.y} L ${k.x.toFixed(1)} ${k.y.toFixed(1)} L ${f.x.toFixed(1)} ${f.y.toFixed(1)}`;
    };
    return `${one(theta)} ${one(theta + Math.PI)}`;
};
const PEDAL = Array.from({ length: 9 }, (_, i) => legPath((i / 8) * Math.PI * 2)).join(';');

/** Ciclista no rolo de laboratório (pedalando no lugar); (x, y) é o chão sob o eixo. Largura ≈ 110, altura ≈ 100. */
export const Cyclist = ({ x, y, s = 1, color, still = false }: { x: number; y: number; s?: number; color: string; still?: boolean }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M -48 0 H 8 M -34 -2 L -26 -14 H -42 Z" stroke="rgba(255,255,255,0.3)" strokeWidth={3} />
        {[-34, 34].map(cx => (
            <g key={cx} transform={`translate(${cx} -24)`}>
                <circle r={24} stroke={color} strokeWidth={3.5} />
                <g stroke={color} strokeWidth={1.5} opacity={0.55}>
                    <path d="M -24 0 H 24 M 0 -24 V 24 M -17 -17 L 17 17 M -17 17 L 17 -17" />
                    {!still && <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="0.7s" repeatCount="indefinite" />}
                </g>
            </g>
        ))}
        <path d="M -34 -24 L -4 -26 L -10 -52 L 24 -52 L 34 -24 M -4 -26 L 24 -52 M 26 -54 L 32 -62 M -12 -54 L -16 -58" stroke={color} strokeWidth={4} />
        <path d="M -8 -56 L 14 -76 M 14 -74 L 28 -60" stroke="#F3F4F6" strokeWidth={6} />
        <circle cx={22} cy={-86} r={7.5} fill="#F3F4F6" stroke="none" />
        <path d={legPath(0.4)} stroke="#F3F4F6" strokeWidth={6}>
            {!still && <animate attributeName="d" values={PEDAL} dur="0.9s" repeatCount="indefinite" />}
        </path>
    </g>
);

/** Bandeira de estudo: mastro com altura h e galhardete virado para a direita. */
export const Flag = ({ x, y, h, color, w = 26, wave = true }: { x: number; y: number; h: number; color: string; w?: number; wave?: boolean }) => (
    <g>
        <line x1={x} x2={x} y1={y} y2={y - h} stroke="#E5E7EB" strokeWidth={3} strokeLinecap="round" />
        <path d={`M ${x} ${y - h} L ${x + w} ${y - h + 8} L ${x} ${y - h + 16} Z`} fill={color} stroke="#fff" strokeOpacity={0.7} strokeWidth={1.5}>
            {wave && <animate attributeName="d" dur="2.4s" repeatCount="indefinite"
                values={`M ${x} ${y - h} L ${x + w} ${y - h + 8} L ${x} ${y - h + 16} Z;M ${x} ${y - h} L ${x + w - 5} ${y - h + 11} L ${x} ${y - h + 16} Z;M ${x} ${y - h} L ${x + w} ${y - h + 8} L ${x} ${y - h + 16} Z`} />}
        </path>
        <circle cx={x} cy={y} r={3.5} fill={color} />
    </g>
);

/** Coração de contorno suave, centrado em (x, y), com batida opcional. */
export const Heart = ({ x, y, s = 1, color, beat = true }: { x: number; y: number; s?: number; color: string; beat?: boolean }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
        <g>
            <path d="M 0 22 C -34 -2 -26 -26 -10 -24 C -4 -23 0 -18 0 -14 C 0 -18 4 -23 10 -24 C 26 -26 34 -2 0 22 Z"
                fill={`${color}30`} stroke={color} strokeWidth={3.5} strokeLinejoin="round" />
            {beat && <animateTransform attributeName="transform" type="scale" values="1;1.1;1;1.05;1" keyTimes="0;0.15;0.3;0.42;1" dur="1.1s" repeatCount="indefinite" additive="sum" />}
        </g>
    </g>
);

/** Pulmões (dois lobos e traqueia), centrados em (x, y). */
export const Lungs = ({ x, y, s = 1, color }: { x: number; y: number; s?: number; color: string }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={`${color}26`} stroke={color} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round">
        <path d="M -5 -20 C -22 -20 -32 6 -30 22 C -29 28 -20 28 -16 22 C -10 14 -6 4 -5 -6 Z" />
        <path d="M 5 -20 C 22 -20 32 6 30 22 C 29 28 20 28 16 22 C 10 14 6 4 5 -6 Z" />
        <path d="M 0 -30 V -8 M 0 -8 L -6 -2 M 0 -8 L 6 -2" fill="none" />
    </g>
);

/** Xícara de cafeína com vapor. */
export const Cup = ({ x, y, s = 1, color }: { x: number; y: number; s?: number; color: string }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M -10 -5 H 10 V 6 Q 10 14 0 14 Q -10 14 -10 6 Z" fill={`${color}33`} />
        <path d="M 10 -1 H 14 A 4.5 4.5 0 0 1 14 8 H 9" />
        <path d="M -4 -9 Q -1 -13 -4 -17 M 3 -9 Q 6 -13 3 -17" opacity={0.8} />
    </g>
);

/** Beterraba com as folhas. */
export const Beet = ({ x, y, s = 1, color = C.nitrate }: { x: number; y: number; s?: number; color?: string }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M 0 -8 C -3 -15 -9 -17 -10 -23 M 0 -8 C 3 -15 9 -17 10 -23" fill="none" stroke={C.nitrateSoft} strokeWidth={3} strokeLinecap="round" />
        <path d="M 0 17 L 1 24" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
        <circle cy={4} r={12} fill={`${color}55`} stroke={color} strokeWidth={3} />
    </g>
);
