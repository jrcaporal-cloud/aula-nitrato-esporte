import { useId } from 'react';
import type { CaseVerdict } from '../cases';

/**
 * Retrato geométrico dos quatro casos fictícios: mesmo disco com brilho radial e borda do avatar do slide 3 (Quatro Atletas),
 * agora com busto e um acessório do esporte (capacete, faixa, bola, número de prova). Centrado em (0,0), raio `r`.
 */

type Who = CaseVerdict['id'];
const SKIN = '#F1D3BF';
const DARK = '#0B0710';

const Accessory = ({ who, r }: { who: Who; r: number }) => {
    const hy = -0.14 * r;
    const hr = 0.3 * r;
    if (who === 'lia') {
        return (
            <g>
                <path d={`M${-hr * 1.12},${hy - hr * 0.1} A${hr * 1.12},${hr * 1.18} 0 0 1 ${hr * 1.12},${hy - hr * 0.1}Z`} fill="#fff" />
                <path d={`M${-hr * 0.5},${hy - hr * 1.0} L${-hr * 0.2},${hy - hr * 0.2} M0,${hy - hr * 1.15} L0,${hy - hr * 0.2} M${hr * 0.5},${hy - hr * 1.0} L${hr * 0.2},${hy - hr * 0.2}`} stroke={DARK} strokeWidth={r * 0.045} strokeLinecap="round" />
            </g>
        );
    }
    if (who === 'tomas') {
        return (
            <g>
                <path d={`M${-hr},${hy - hr * 0.55} Q0,${hy - hr * 1.25} ${hr},${hy - hr * 0.55} L${hr},${hy - hr * 0.25} Q0,${hy - hr * 0.95} ${-hr},${hy - hr * 0.25}Z`} fill="#fff" />
                <path d={`M${-0.78 * r},${-0.5 * r} L${-0.5 * r},${-0.5 * r} M${-0.82 * r},${-0.36 * r} L${-0.56 * r},${-0.36 * r}`} stroke="#fff" strokeWidth={r * 0.05} strokeLinecap="round" opacity={0.7} />
            </g>
        );
    }
    if (who === 'bruno') {
        return (
            <g transform={`translate(${0.5 * r} ${0.5 * r})`}>
                <circle r={0.24 * r} fill="#fff" stroke={DARK} strokeWidth={r * 0.04} />
                <path d={`M0,${-0.1 * r} L${0.09 * r},${-0.03 * r} L${0.055 * r},${0.08 * r} L${-0.055 * r},${0.08 * r} L${-0.09 * r},${-0.03 * r}Z`} fill={DARK} />
            </g>
        );
    }
    return (
        <g>
            <path d={`M${hr * 0.9},${hy - hr * 0.2} Q${hr * 2.0},${hy + hr * 0.2} ${hr * 1.3},${hy + hr * 1.5}`} stroke={DARK} strokeWidth={hr * 0.55} strokeLinecap="round" fill="none" />
            <rect x={-0.22 * r} y={0.36 * r} width={0.44 * r} height={0.26 * r} rx={r * 0.04} fill="#fff" />
            <path d={`M${-0.1 * r},${0.44 * r} L${0.1 * r},${0.44 * r} M${-0.1 * r},${0.52 * r} L${0.06 * r},${0.52 * r}`} stroke={DARK} strokeWidth={r * 0.04} strokeLinecap="round" />
        </g>
    );
};

export const Portrait = ({ who, color, r = 40 }: { who: Who; color: string; r?: number }) => {
    const id = useId();
    return (
        <g>
            <defs>
                <radialGradient id={`${id}-bg`} cx="30%" cy="26%" r="85%">
                    <stop offset="0%" stopColor={color} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.28} />
                </radialGradient>
                <clipPath id={`${id}-clip`}><circle r={r} /></clipPath>
            </defs>
            <circle r={r} fill="#14101C" />
            <circle r={r} fill={`url(#${id}-bg)`} />
            <g clipPath={`url(#${id}-clip)`}>
                <ellipse cx={0} cy={0.86 * r} rx={0.7 * r} ry={0.52 * r} fill={who === 'bruno' ? '#fff' : DARK} opacity={who === 'bruno' ? 0.9 : 0.55} />
                <rect x={-0.07 * r} y={0.12 * r} width={0.14 * r} height={0.18 * r} fill={SKIN} />
                <circle cx={0} cy={-0.14 * r} r={0.3 * r} fill={SKIN} />
                <Accessory who={who} r={r} />
            </g>
            <circle r={r} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={Math.max(1.5, r * 0.04)} />
        </g>
    );
};
