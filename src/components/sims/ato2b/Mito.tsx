import { C } from '../kit/palette';

interface MitoProps {
    cx: number;
    cy: number;
    /** Escala do desenho (1 = 270 px de largura). */
    s?: number;
    /** Quantas translocases (ANT) ficam ativas, com vazamento de H⁺ (0–5). */
    leaks: number;
    /** Cor do contorno e do brilho. */
    accent?: string;
    glow?: boolean;
    opacity?: number;
    reduce: boolean;
}

const POS = [-84, -42, 0, 42, 84] as const;

/** Mitocôndria esquemática: membranas, cristas, ANT (vazamento de prótons) e ATP sintase. */
export const Mito = ({ cx, cy, s = 1, leaks, accent = C.placebo, glow = false, opacity = 1, reduce }: MitoProps) => (
    <g transform={`translate(${cx} ${cy}) scale(${s})`} opacity={opacity}
        style={glow ? { filter: `drop-shadow(0 0 10px ${accent}aa)` } : undefined}>
        <ellipse rx={136} ry={82} fill="rgba(251,146,60,0.06)" stroke={accent} strokeWidth={3} />
        <ellipse rx={118} ry={62} fill="none" stroke={accent} strokeWidth={1.5} strokeOpacity={0.55} />
        {POS.map((x, i) => (
            <g key={x}>
                <rect x={x - 9} y={-60} width={18} height={66} rx={9} fill="rgba(255,255,255,0.03)" stroke={accent} strokeOpacity={0.5} strokeWidth={1.5} />
                <rect x={x + 12} y={-8} width={18} height={66} rx={9} fill="rgba(255,255,255,0.03)" stroke={accent} strokeOpacity={0.5} strokeWidth={1.5} />
                <circle cx={x} cy={8} r={5} fill={C.ok} opacity={0.85} />
                <circle cx={x + 21} cy={-10} r={5} fill={C.ok} opacity={0.85} />
                <rect x={x - 8} y={-72} width={16} height={12} rx={3} fill={i < leaks ? C.hypoxia : 'none'} fillOpacity={0.9}
                    stroke={C.hypoxia} strokeWidth={1.5} strokeDasharray={i < leaks ? undefined : '3 3'} strokeOpacity={i < leaks ? 1 : 0.5} />
                {i < leaks && (
                    <circle cx={x} cy={-80} r={4.5} fill={C.hypoxia}>
                        {!reduce && <animateMotion dur="1.5s" begin={`${i * 0.3}s`} repeatCount="indefinite" path="M0 0 V46" />}
                    </circle>
                )}
            </g>
        ))}
    </g>
);
