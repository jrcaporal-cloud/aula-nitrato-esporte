import { useReducedMotion } from 'framer-motion';
import { C } from '../../../kit/palette';
import { cv, SPARKS } from '../util';
import { BEET, MOUTH, MUSCLE } from './geometry';
import { Beet, Mouth, Muscle, StationDefs } from './Stations';

/**
 * Arte do fecho: o ânion sai da beterraba (NO₃⁻), passa pela boca (NO₂⁻) e chega ao músculo (NO).
 * Partículas correm pela fita com <animateMotion> (sem React por quadro); com movimento reduzido ficam paradas.
 */

const W = 1136;
const H = 320;

type Pt = readonly [number, number];
const A: readonly Pt[] = [[222, 150], [340, 30], [450, 30], [MOUTH.x - 80, MOUTH.y]];
const B: readonly Pt[] = [[MOUTH.x + 80, MOUTH.y], [720, 270], [800, 270], [MUSCLE.x - 82, MUSCLE.y]];
const d = (p: readonly Pt[]): string => `M ${p[0][0]} ${p[0][1]} C ${p[1][0]} ${p[1][1]}, ${p[2][0]} ${p[2][1]}, ${p[3][0]} ${p[3][1]}`;
const at = (p: readonly Pt[], t: number): Pt => {
    const u = 1 - t;
    const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
    return [k.reduce((s, w, i) => s + w * p[i][0], 0), k.reduce((s, w, i) => s + w * p[i][1], 0)];
};

const N = 6;
const DUR = 3.6;

const Particles = ({ path, colors, reduce }: { path: readonly Pt[]; colors: string; reduce: boolean }) => {
    const first = colors.split(';')[0];
    if (reduce) return <>{Array.from({ length: N }, (_, i) => { const [x, y] = at(path, (i + 0.5) / N); return <circle key={i} cx={x} cy={y} r="6" fill={first} />; })}</>;
    return (
        <>
            {Array.from({ length: N }, (_, i) => (
                <circle key={i} r="6" fill={first} opacity="0" style={{ filter: `drop-shadow(0 0 6px ${first})` }}>
                    <animateMotion dur={`${DUR}s`} begin={`${1 + (i * DUR) / N}s`} repeatCount="indefinite" path={d(path)} />
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur={`${DUR}s`} begin={`${1 + (i * DUR) / N}s`} repeatCount="indefinite" />
                    {colors.includes(';') && <animate attributeName="fill" values={colors} dur={`${DUR}s`} begin={`${1 + (i * DUR) / N}s`} repeatCount="indefinite" />}
                </circle>
            ))}
        </>
    );
};

const Label = ({ x, name, ion, color }: { x: number; name: string; ion: string; color: string }) => (
    <g style={{ fontFamily: 'var(--font-body)' }}>
        <text x={x} y={282} textAnchor="middle" fontSize="17" fill="#D1D5DB" letterSpacing="2">{name.toUpperCase()}</text>
        <text x={x} y={312} textAnchor="middle" fontSize="26" fontWeight="700" fill={color} style={{ fontFamily: 'var(--font-display)' }}>{ion}</text>
    </g>
);

export const Journey = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block overflow-visible" role="img" aria-label="O nitrato sai da beterraba, vira nitrito na boca e óxido nítrico no músculo">
            <StationDefs />
            {SPARKS.map((s, i) => (
                <circle key={i} cx={(s.x / 100) * W} cy={(s.y / 100) * H} r={i % 3 ? 1.6 : 2.4} fill="#fff" className="ab-a" style={cv({ animation: `ab-twinkle ${3 + (i % 4)}s ${s.d}s ease-in-out infinite` })} opacity="0.5" />
            ))}
            <path d={`${d(A)} ${d(B).replace('M', 'M')}`} fill="none" stroke="url(#cl-ribbon)" strokeWidth="14" strokeOpacity="0.14" strokeLinecap="round" />
            <path d={d(A)} fill="none" stroke="url(#cl-ribbon)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 10" className="ab-a" style={cv({ animation: 'ab-dash 1.6s linear infinite' })} />
            <path d={d(B)} fill="none" stroke="url(#cl-ribbon)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 10" className="ab-a" style={cv({ animation: 'ab-dash 1.6s linear infinite' })} />
            <Particles path={A} colors={C.nitrate} reduce={reduce} />
            <Particles path={B} colors={`${C.nitrite};${C.nitrite};${C.no};${C.no}`} reduce={reduce} />
            <Beet />
            <Mouth />
            <Muscle />
            <Label x={BEET.x} name="beterraba" ion="NO₃⁻" color={C.nitrate} />
            <Label x={MOUTH.x} name="boca" ion="NO₂⁻" color={C.nitrite} />
            <Label x={MUSCLE.x} name="músculo" ion="NO" color={C.no} />
        </svg>
    );
};
