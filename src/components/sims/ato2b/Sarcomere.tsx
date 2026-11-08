import { C } from '../kit/palette';

interface SarcomereProps {
    x: number;
    y: number;
    w: number;
    h: number;
    /** Filamento fino (actina) e grosso (miosina). */
    thin?: string;
    thick?: string;
    /** Encurta e alonga em ciclo (SMIL), só quando não há redução de movimento. */
    beat?: boolean;
    /** Duração do ciclo, em segundos (carga igual = mesmo ritmo). */
    dur?: number;
    glow?: string;
    opacity?: number;
}

/** Sarcômero esquemático: discos Z, filamentos finos presos neles e filamentos grossos no centro. */
export const Sarcomere = ({ x, y, w, h, thin = C.o2Soft, thick = C.nitrateSoft, beat = false, dur = 1.6, glow, opacity = 1 }: SarcomereProps) => {
    const cx = x + w / 2;
    const thinLen = w * 0.4;
    const amp = w * 0.09;
    const thinRows = [-0.16, 0.16];
    const thickRows = [-0.32, 0, 0.32];
    const move = (dx: number) => beat && (
        <animateTransform attributeName="transform" type="translate" values={`0 0;${dx} 0;0 0`} dur={`${dur}s`} repeatCount="indefinite" keyTimes="0;0.5;1"
            calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
    );
    return (
        <g opacity={opacity} style={glow ? { filter: `drop-shadow(0 0 8px ${glow})` } : undefined}>
            <g>
                {move(amp)}
                <rect x={x} y={y - h / 2} width={9} height={h} rx={3} fill={C.text} opacity={0.9} />
                {thinRows.map(r => <line key={r} x1={x + 9} x2={x + 9 + thinLen} y1={y + r * h} y2={y + r * h} stroke={thin} strokeWidth={3.5} strokeLinecap="round" />)}
            </g>
            <g>
                {move(-amp)}
                <rect x={x + w - 9} y={y - h / 2} width={9} height={h} rx={3} fill={C.text} opacity={0.9} />
                {thinRows.map(r => <line key={r} x1={x + w - 9} x2={x + w - 9 - thinLen} y1={y + r * h} y2={y + r * h} stroke={thin} strokeWidth={3.5} strokeLinecap="round" />)}
            </g>
            {thickRows.map(r => (
                <g key={r}>
                    <line x1={cx - w * 0.26} x2={cx + w * 0.26} y1={y + r * h} y2={y + r * h} stroke={thick} strokeWidth={8} strokeLinecap="round" />
                    <line x1={cx - w * 0.24} x2={cx + w * 0.24} y1={y + r * h} y2={y + r * h} stroke={C.text} strokeOpacity={0.55} strokeWidth={15} strokeDasharray="2 7" />
                </g>
            ))}
        </g>
    );
};
