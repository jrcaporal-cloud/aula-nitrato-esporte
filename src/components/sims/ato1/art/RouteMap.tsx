import { useReducedMotion } from 'framer-motion';
import { useTween } from '../../kit/useTween';
import { ACTS } from '../acts';
import { C } from '../../kit/palette';
import { ION, MAP_H, MAP_W, ROUTE_D, STATIONS, TITLE_LINES, ionAt, litFraction, pointAt } from './mapGeom';

/**
 * O mapa da aula em grande formato: seis estações numa trilha sinuosa; o íon (NO₃⁻ → NO₂⁻ → NO) viaja até o ato da vez
 * e acende o caminho atrás de si. Estações alcançadas ganham luz; a atual pulsa.
 */

const mix = (a: string, b: string, t: number) => {
    const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16));
    const pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
    return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(' ')})`;
};
const ionColor = (p: number) => {
    const s = Math.min(Math.max(p, 0), 2);
    const k = Math.min(Math.floor(s), 1);
    return mix(ION[k].color, ION[k + 1].color, s - k);
};

const TEXT = { fontFamily: 'var(--font-body)', paintOrder: 'stroke', stroke: '#07050B', strokeWidth: 4, strokeLinejoin: 'round' } as const;

const Backdrop = () => (
    <g aria-hidden>
        <defs>
            <linearGradient id="map-ridge" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#1B1226" />
                <stop offset="1" stopColor="#07050B" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="map-route" x1="95" x2="1015" y1="0" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor={C.nitrate} />
                <stop offset="0.2" stopColor={C.nitrite} />
                <stop offset="0.4" stopColor={C.no} />
                <stop offset="1" stopColor={C.noSoft} />
            </linearGradient>
        </defs>
        <path d={`M0 236 Q140 176 290 218 T600 200 T900 222 T${MAP_W} 210 V${MAP_H} H0Z`} fill="url(#map-ridge)" opacity={0.9} />
        <path d={`M0 150 Q180 96 360 140 T720 120 T${MAP_W} 128 V${MAP_H} H0Z`} fill="url(#map-ridge)" opacity={0.45} />
        {Array.from({ length: 38 }, (_, i) => (
            <circle key={i} cx={(i * 211) % MAP_W} cy={14 + ((i * 97) % 120)} r={i % 5 === 0 ? 1.6 : 1} fill="#fff" opacity={0.12 + (i % 4) * 0.06} />
        ))}
    </g>
);

const Station = ({ i, reached, here, reduce }: { i: number; reached: boolean; here: boolean; reduce: boolean }) => {
    const act = ACTS[i];
    const [x, y] = STATIONS[i];
    const color = reached ? act.color : '#4B5563';
    return (
        <g>
            <circle cx={x} cy={y} r={78} fill={act.color} opacity={reached ? (here ? 0.2 : 0.09) : 0} style={{ transition: 'opacity 700ms' }} />
            {here && (
                <circle cx={x} cy={y} r={40} fill="none" stroke={act.color} strokeWidth={3}>
                    {!reduce && <animate attributeName="r" values="40;56;40" dur="2s" repeatCount="indefinite" />}
                    {!reduce && <animate attributeName="opacity" values="0.9;0;0.9" dur="2s" repeatCount="indefinite" />}
                </circle>
            )}
            <circle cx={x} cy={y} r={here ? 40 : 34} fill={reached ? '#120B18' : '#0B0710'} stroke={color} strokeWidth={here ? 4 : 2.5}
                style={{ transition: 'r 400ms, stroke 500ms', filter: here ? `drop-shadow(0 0 16px ${act.color})` : undefined }} />
            <act.Icon x={x - (here ? 22 : 18)} y={y - (here ? 22 : 18)} width={here ? 44 : 36} height={here ? 44 : 36} color={color} strokeWidth={2} />
            <text x={x} y={y - (here ? 52 : 46)} textAnchor="middle" fontSize={16} fill={color} style={{ ...TEXT, fontFamily: 'var(--font-mono)' }}>ato {act.roman}</text>
            {TITLE_LINES[i].map((line, k) => (
                <text key={line} x={x} y={y + (here ? 66 : 58) + k * 20} textAnchor="middle" fontSize={here ? 19 : 17} fontWeight={600}
                    fill={here ? '#fff' : reached ? '#D1D5DB' : '#6B7280'} style={{ ...TEXT, fontFamily: 'var(--font-display)' }}>{line}</text>
            ))}
        </g>
    );
};

export const RouteMap = ({ current, done }: { current: number; done: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    const p = useTween(current, reduce, 1300);
    const [ox, oy] = pointAt(p - 0.42);
    const ion = ionAt(p);
    const color = ionColor(p);
    const lit = litFraction(p);
    return (
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width="100%" height={MAP_H} role="img" aria-label={`Mapa da aula: ato ${ACTS[current].roman}`} className="block">
            <Backdrop />
            <path d={ROUTE_D} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={6} strokeLinecap="round" strokeDasharray="2 12" />
            <path d={ROUTE_D} fill="none" stroke="url(#map-route)" strokeWidth={14} strokeLinecap="round" opacity={0.18}
                pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - lit} />
            <path d={ROUTE_D} fill="none" stroke="url(#map-route)" strokeWidth={5} strokeLinecap="round"
                pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - lit} />
            <defs><clipPath id="map-lit"><rect x={0} y={0} width={ox} height={MAP_H} /></clipPath></defs>
            {!reduce && (
                <g clipPath="url(#map-lit)">
                    {Array.from({ length: 9 }, (_, i) => (
                        <circle key={i} r={3} fill="#fff" opacity={0.8}>
                            <animateMotion dur="6s" begin={`${-i * 0.66}s`} repeatCount="indefinite" path={ROUTE_D} />
                        </circle>
                    ))}
                </g>
            )}
            {ACTS.map((_, i) => <Station key={i} i={i} reached={i <= current} here={!done && i === current} reduce={reduce} />)}
            <g transform={`translate(${ox} ${oy - 2})`}>
                <circle r={30} fill={color} opacity={0.22} />
                <circle r={23} fill={color} stroke="#fff" strokeWidth={2.5} style={{ filter: `drop-shadow(0 0 12px ${color})` }} />
                <text y={5} textAnchor="middle" fontSize={15} fontWeight={800} fill="#07050B" style={{ fontFamily: 'var(--font-body)' }}>{ion.label}</text>
            </g>
        </svg>
    );
};
