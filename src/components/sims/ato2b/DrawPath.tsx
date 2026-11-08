import type { ReactNode } from 'react';

interface DrawPathProps {
    d: string;
    color: string;
    show: boolean;
    reduce: boolean;
    width?: number;
    ms?: number;
    delay?: number;
    opacity?: number;
}

/** Traço que "se desenha" (dash offset por CSS), sem animar o atributo `d`. */
export const DrawPath = ({ d, color, show, reduce, width = 3.5, ms = 1100, delay = 0, opacity = 1 }: DrawPathProps) => (
    <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} strokeDasharray="1 1" strokeDashoffset={show ? 0 : 1}
        style={{ opacity: show ? opacity : 0, transition: reduce ? 'none' : `stroke-dashoffset ${ms}ms ease ${delay}ms, opacity 200ms ease ${delay}ms` }} />
);

interface FadeProps {
    show: boolean;
    reduce: boolean;
    delay?: number;
    children: ReactNode;
}

/** Grupo SVG que aparece/some com opacidade. */
export const FadeG = ({ show, reduce, delay = 0, children }: FadeProps) => (
    <g style={{ opacity: show ? 1 : 0, transition: reduce ? 'none' : `opacity 450ms ease ${show ? delay : 0}ms` }}>{children}</g>
);
