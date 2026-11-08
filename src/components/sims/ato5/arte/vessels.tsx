import type { ReactNode } from 'react';
import { C } from '../../kit/palette';

/** Copos, frascos e partículas de nitrato: a mesma "cenografia" nos sims do Ato V. */

/** Gradientes de líquido: suco (magenta), água/sal (ardósia translúcida). Definidos uma vez por <svg>. */
export const VesselDefs = () => (
    <defs>
        <linearGradient id="av-juice" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#E0246B" />
            <stop offset="1" stopColor="#6B0F3B" />
        </linearGradient>
        <linearGradient id="av-water" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#CBD5E1" stopOpacity="0.6" />
            <stop offset="1" stopColor="#94A3B8" stopOpacity="0.32" />
        </linearGradient>
        <linearGradient id="av-lab" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#7C93C9" />
            <stop offset="1" stopColor="#3C4E7E" />
        </linearGradient>
    </defs>
);

interface GlassProps {
    /** Prefixo único (clipPath). */
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    level?: number;
    fill?: string;
    surface?: string;
    /** Fração da largura que o copo afunila embaixo (0 = béquer reto). */
    taper?: number;
    ghost?: boolean;
    children?: ReactNode;
}

/** Copo de vidro com líquido, brilho e borda. `children` desenha dentro do líquido (recortado). */
export const Glass = ({ id, x, y, w, h, level = 0.8, fill = 'url(#av-juice)', surface = '#F472B6', taper = 0.13, ghost = false, children }: GlassProps) => {
    const inset = w * taper;
    const bottom = y + h;
    const body = `M${x} ${y}H${x + w}L${x + w - inset} ${bottom - 8}Q${x + w - inset - 1} ${bottom} ${x + w - inset - 10} ${bottom}H${x + inset + 10}Q${x + inset + 1} ${bottom} ${x + inset} ${bottom - 8}Z`;
    const ly = y + h * (1 - level);
    const k = (ly - y) / h;
    const xl = x + inset * k;
    const xr = x + w - inset * k;
    return (
        <g>
            <clipPath id={`${id}-c`}><path d={body} /></clipPath>
            {!ghost && (
                <g clipPath={`url(#${id}-c)`}>
                    <rect x={x} y={ly} width={w} height={bottom - ly} fill={fill} />
                    {children}
                    <ellipse cx={(xl + xr) / 2} cy={ly} rx={(xr - xl) / 2} ry={5} fill={surface} fillOpacity={0.92} />
                </g>
            )}
            <path d={body} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.62)" strokeWidth={2} strokeDasharray={ghost ? '7 6' : undefined} />
            <ellipse cx={x + w / 2} cy={y} rx={w / 2} ry={6} fill="none" stroke="rgba(255,255,255,0.62)" strokeWidth={2} strokeDasharray={ghost ? '7 6' : undefined} />
            {!ghost && <path d={`M${x + 11} ${y + 14}L${x + inset + 9} ${bottom - 18}`} stroke="#fff" strokeOpacity={0.3} strokeWidth={5} strokeLinecap="round" />}
        </g>
    );
};

interface DotsProps {
    x: number;
    y: number;
    w: number;
    h: number;
    count: number;
    color?: string;
    r?: number;
    reduce?: boolean;
}

/** Partículas de nitrato espalhadas (posições fixas); cintilam devagar. */
export const NitrateDots = ({ x, y, w, h, count, color = C.nitrateSoft, r = 3, reduce = false }: DotsProps) => (
    <g>
        {Array.from({ length: count }, (_, i) => {
            const px = x + 8 + ((i * 53 + 17) % 97) / 97 * (w - 16);
            const py = y + 6 + ((i * 37 + 11) % 89) / 89 * (h - 12);
            return (
                <circle key={i} cx={px} cy={py} r={r} fill={color} stroke="#fff" strokeOpacity={0.7} strokeWidth={0.8}>
                    {!reduce && <animate attributeName="opacity" values="1;0.35;1" dur={`${2 + (i % 5) * 0.4}s`} begin={`${(i % 7) * 0.3}s`} repeatCount="indefinite" />}
                </circle>
            );
        })}
    </g>
);

/** Frasco de laboratório (erlenmeyer) com solução e cristais, para o sal de nitrato. */
export const Flask = ({ id, cx, y, s = 1 }: { id: string; cx: number; y: number; s?: number }) => {
    const body = `M${cx - 9 * s} ${y}V${y + 22 * s}L${cx - 34 * s} ${y + 64 * s}Q${cx - 38 * s} ${y + 72 * s} ${cx - 28 * s} ${y + 72 * s}H${cx + 28 * s}Q${cx + 38 * s} ${y + 72 * s} ${cx + 34 * s} ${y + 64 * s}L${cx + 9 * s} ${y + 22 * s}V${y}Z`;
    return (
        <g>
            <clipPath id={`${id}-f`}><path d={body} /></clipPath>
            <g clipPath={`url(#${id}-f)`}>
                <rect x={cx - 40 * s} y={y + 40 * s} width={80 * s} height={36 * s} fill="url(#av-water)" />
                {[[-14, 62], [2, 66], [16, 60], [-4, 58], [10, 68]].map(([dx, dy], i) => (
                    <rect key={i} x={cx + dx * s - 3 * s} y={y + dy * s - 3 * s} width={6 * s} height={6 * s} fill="#F8FAFC" transform={`rotate(${20 + i * 17} ${cx + dx * s} ${y + dy * s})`} />
                ))}
            </g>
            <path d={body} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.62)" strokeWidth={2} strokeLinejoin="round" />
            <rect x={cx - 12 * s} y={y - 4 * s} width={24 * s} height={6 * s} rx={3} fill="rgba(255,255,255,0.55)" />
        </g>
    );
};
