/**
 * Íon nitrato (NO₃⁻) em traço fino: a marca d'água da capa. Trigonal plano, ângulos de 120°;
 * as três ligações têm um traço tracejado ao lado porque a carga está deslocalizada (ressonância).
 */
export const NitrateMark = ({ className }: { className?: string }) => {
    const N = { x: 300, y: 300 };
    const arm = 175;
    const at = (deg: number, r = arm) => ({ x: N.x + r * Math.cos((deg * Math.PI) / 180), y: N.y - r * Math.sin((deg * Math.PI) / 180) });
    const angles = [90, 210, 330];
    return (
        <svg viewBox="0 0 600 600" className={className} aria-hidden>
            <defs>
                <radialGradient id="nm-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#F0437E" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#F0437E" stopOpacity="0" />
                </radialGradient>
            </defs>
            <circle cx={N.x} cy={N.y} r={260} fill="url(#nm-glow)" opacity={0.25} />
            <g stroke="#F9A8D4" strokeWidth={3} fill="none" strokeLinecap="round">
                {angles.map(deg => {
                    const a = at(deg, 40);
                    const b = at(deg, arm - 38);
                    const nx = -Math.sin((deg * Math.PI) / 180) * 11;
                    const ny = -Math.cos((deg * Math.PI) / 180) * 11;
                    return (
                        <g key={deg}>
                            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                            <line x1={a.x + nx} y1={a.y + ny} x2={b.x + nx} y2={b.y + ny} strokeDasharray="7 9" opacity={0.7} />
                        </g>
                    );
                })}
            </g>
            <g fontFamily="'Clash Display', sans-serif" fontWeight={600} fill="#FCE7F3" textAnchor="middle" dominantBaseline="central">
                <text x={N.x} y={N.y} fontSize={58}>N</text>
                {angles.map(deg => {
                    const o = at(deg);
                    return <text key={deg} x={o.x} y={o.y} fontSize={54}>O</text>;
                })}
            </g>
            {/* colchete com a carga do íon inteiro */}
            <g stroke="#F9A8D4" strokeWidth={2.5} fill="none" opacity={0.75}>
                <path d="M 110 80 L 92 80 L 92 520 L 110 520" />
                <path d="M 490 80 L 508 80 L 508 520 L 490 520" />
            </g>
            <text x={530} y={86} fontSize={46} fill="#34D399" fontFamily="'Clash Display', sans-serif" fontWeight={600}>−</text>
        </svg>
    );
};
