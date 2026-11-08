import { C } from '../../kit/palette';

/** Gramado: faixas de corte, luz de refletor e linhas brancas. Peças do slide "Bola Rolando" (viewBox 720 × 448). */

interface TurfProps {
    x: number;
    y: number;
    w: number;
    h: number;
    /** Largura de cada faixa de corte. */
    band?: number;
    id: string;
    rx?: number;
}

/** Retângulo de grama com faixas alternadas e brilho de refletor no alto. */
export const Turf = ({ x, y, w, h, band = 60, id, rx = 14 }: TurfProps) => (
    <g>
        <defs>
            <clipPath id={`${id}-clip`}><rect x={x} y={y} width={w} height={h} rx={rx} /></clipPath>
            <radialGradient id={`${id}-light`} cx="0.5" cy="0" r="0.9">
                <stop offset="0" stopColor="#D1FAE5" stopOpacity={0.16} />
                <stop offset="1" stopColor="#D1FAE5" stopOpacity={0} />
            </radialGradient>
        </defs>
        <g clipPath={`url(#${id}-clip)`}>
            <rect x={x} y={y} width={w} height={h} fill="#0A3324" />
            {Array.from({ length: Math.ceil(w / band) }, (_, i) => (
                i % 2 === 0 ? null : <rect key={i} x={x + i * band} y={y} width={band} height={h} fill="#0D3D2C" />
            ))}
            <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-light)`} />
        </g>
        <rect x={x} y={y} width={w} height={h} rx={rx} fill="none" stroke="rgba(255,255,255,0.18)" />
    </g>
);

/** Campo inteiro visto de cima. */
export const FullPitch = () => (
    <g>
        <Turf x={14} y={14} w={692} h={420} band={58} id="pitch-full" />
        <g fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={2}>
            <rect x={30} y={30} width={660} height={388} rx={4} />
            <line x1={360} y1={30} x2={360} y2={418} />
            <circle cx={360} cy={224} r={52} />
            <rect x={30} y={134} width={96} height={180} />
            <rect x={594} y={134} width={96} height={180} />
            <rect x={30} y={184} width={38} height={80} />
            <rect x={652} y={184} width={38} height={80} />
            <path d="M 126 196 A 34 34 0 0 1 126 252 M 594 196 A 34 34 0 0 0 594 252" />
        </g>
        <circle cx={360} cy={224} r={3} fill="rgba(255,255,255,0.6)" />
    </g>
);

/** Cone de treino visto de lado. */
export const Cone = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
        <polygon points="-10,10 10,10 0,-13" fill={C.hypoxia} stroke="#fff" strokeOpacity={0.6} />
        <rect x={-12} y={9} width={24} height={4} rx={2} fill={C.hypoxia} opacity={0.7} />
    </g>
);
