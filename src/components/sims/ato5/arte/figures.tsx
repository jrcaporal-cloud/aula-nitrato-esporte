/** Figuras de pictograma: homem (ombros retos) e mulher (vestido), com altura ≈ 24·s. */

interface PersonProps {
    cx: number;
    cy: number;
    s?: number;
    color: string;
    woman?: boolean;
    opacity?: number;
}

export const Person = ({ cx, cy, s = 1, color, woman = false, opacity = 1 }: PersonProps) => (
    <g opacity={opacity}>
        <circle cx={cx} cy={cy - 9 * s} r={4.4 * s} fill={color} />
        {woman ? (
            <path d={`M${cx - 3.2 * s} ${cy - 3.6 * s}H${cx + 3.2 * s}L${cx + 8 * s} ${cy + 11 * s}H${cx - 8 * s}Z`} fill={color} />
        ) : (
            <path d={`M${cx - 6.5 * s} ${cy + 11 * s}V${cy + 1 * s}Q${cx - 6.5 * s} ${cy - 3.6 * s} ${cx - 2.5 * s} ${cy - 3.6 * s}H${cx + 2.5 * s}Q${cx + 6.5 * s} ${cy - 3.6 * s} ${cx + 6.5 * s} ${cy + 1 * s}V${cy + 11 * s}Z`} fill={color} />
        )}
    </g>
);

/** Selo de carimbo: anel duplo e marca (✓, ✕ ou –) desenhada em traço. */
export const Seal = ({ cx, cy, r, color, mark, rotate = 0, lit = true }: { cx: number; cy: number; r: number; color: string; mark: 'ok' | 'no' | 'dash'; rotate?: number; lit?: boolean }) => {
    const k = r * 0.42;
    return (
        <g transform={`rotate(${rotate} ${cx} ${cy})`} opacity={lit ? 1 : 0.28} style={{ transition: 'opacity 0.5s' }}>
            <circle cx={cx} cy={cy} r={r} fill={`${color}22`} stroke={color} strokeWidth={3} />
            <circle cx={cx} cy={cy} r={r - 6} fill="none" stroke={color} strokeWidth={1.4} strokeDasharray="3 4" strokeOpacity={0.8} />
            {mark === 'ok' && <path d={`M${cx - k} ${cy + 1}L${cx - k * 0.3} ${cy + k * 0.8}L${cx + k} ${cy - k * 0.7}`} stroke={color} strokeWidth={r * 0.17} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
            {mark === 'no' && <path d={`M${cx - k * 0.8} ${cy - k * 0.8}L${cx + k * 0.8} ${cy + k * 0.8}M${cx + k * 0.8} ${cy - k * 0.8}L${cx - k * 0.8} ${cy + k * 0.8}`} stroke={color} strokeWidth={r * 0.17} fill="none" strokeLinecap="round" />}
            {mark === 'dash' && <path d={`M${cx - k} ${cy}H${cx + k}`} stroke={color} strokeWidth={r * 0.17} strokeLinecap="round" />}
        </g>
    );
};
