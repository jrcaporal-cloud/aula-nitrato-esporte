import type { ReactNode } from 'react';

interface TProps {
    x: number;
    y: number;
    children: ReactNode;
    size?: number;
    color?: string;
    weight?: number;
    anchor?: 'start' | 'middle' | 'end';
    /** Fonte de títulos (Clash Display): para números e manchetes grandes. */
    display?: boolean;
    opacity?: number;
}

/** Texto SVG com contorno escuro (não some sobre formas). Use size ≥ 16 dentro de viewBox 1:1. */
export const T = ({ x, y, children, size = 16, color = '#E5E7EB', weight = 600, anchor = 'start', display = false, opacity }: TProps) => (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={color} opacity={opacity}
        style={{ fontFamily: display ? 'var(--font-display)' : 'var(--font-body)', paintOrder: 'stroke', stroke: '#07050B', strokeWidth: display ? 5 : 4, strokeLinejoin: 'round' }}>
        {children}
    </text>
);

/** Brilho suave: círculo com gradiente radial (sem filtro). `id` único por uso. */
export const Glow = ({ id, cx, cy, r, color, opacity = 0.5, pulse = false }: { id: string; cx: number; cy: number; r: number; color: string; opacity?: number; pulse?: boolean }) => (
    <g>
        <defs>
            <radialGradient id={id}>
                <stop offset="0" stopColor={color} stopOpacity={opacity} />
                <stop offset="1" stopColor={color} stopOpacity="0" />
            </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`}>
            {pulse && <animate attributeName="opacity" values="1;0.45;1" dur="2.6s" repeatCount="indefinite" />}
        </circle>
    </g>
);
