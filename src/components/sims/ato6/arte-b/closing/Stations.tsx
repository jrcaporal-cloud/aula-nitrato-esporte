import { C } from '../../../kit/palette';
import { cv } from '../util';
import { BEET, MOUTH, MUSCLE } from './geometry';

/** As três paradas do fecho, desenhadas em SVG: a beterraba (guarda o nitrato), a boca (as bactérias reduzem) e o músculo (NO). */


export const StationDefs = () => (
    <defs>
        <radialGradient id="cl-beet" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#FF7AA8" /><stop offset="0.55" stopColor={C.nitrate} /><stop offset="1" stopColor={C.nitrateDeep} /></radialGradient>
        <radialGradient id="cl-muscle" cx="45%" cy="35%" r="75%"><stop offset="0" stopColor="#D9707F" /><stop offset="1" stopColor="#6B2232" /></radialGradient>
        {[['n', C.nitrate], ['b', C.bacteria], ['o', C.no]].map(([k, col]) => (
            <radialGradient key={k} id={`cl-halo-${k}`} r="50%"><stop offset="0" stopColor={col} stopOpacity="0.55" /><stop offset="0.55" stopColor={col} stopOpacity="0.16" /><stop offset="1" stopColor={col} stopOpacity="0" /></radialGradient>
        ))}
        <linearGradient id="cl-ribbon" x1="0" x2="1"><stop offset="0" stopColor={C.nitrate} /><stop offset="0.5" stopColor={C.nitrite} /><stop offset="1" stopColor={C.no} /></linearGradient>
        <clipPath id="cl-fiber"><path d="M900 150 C 940 98, 1020 98, 1060 150 C 1020 202, 940 202, 900 150 Z" /></clipPath>
    </defs>
);

const Halo = ({ x, y, r, tone }: { x: number; y: number; r: number; tone: 'n' | 'b' | 'o' }) => (
    <circle cx={x} cy={y} r={r} fill={`url(#cl-halo-${tone})`} className="ab-a" style={cv({ transformOrigin: `${x}px ${y}px`, animation: 'ab-breathe 4s ease-in-out infinite' })} />
);

export const Beet = () => (
    <g>
        <Halo x={BEET.x} y={BEET.y + 20} r={130} tone="n" />
        <g className="ab-a" style={cv({ transformOrigin: `${BEET.x}px 120px`, animation: 'ab-bob 5s ease-in-out infinite' })}>
            {[-34, -8, 22].map((dx, i) => (
                <g key={dx}>
                    <path d={`M150 118 Q ${150 + dx * 0.6} 80 ${150 + dx} ${46 + i * 6}`} stroke={C.nitrate} strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d={`M${150 + dx} ${46 + i * 6} q ${-20 + i * 8} -30 ${6 + dx * 0.3} -40 q ${18 + i * 4} 24 -6 40 z`} fill="#2F6B4F" stroke="#4E9A72" strokeWidth="1.5" />
                </g>
            ))}
            <path d="M150 112 C 212 112, 226 176, 150 226 C 74 176, 88 112, 150 112 Z" fill="url(#cl-beet)" />
            <path d="M150 226 Q 156 248 146 266" stroke={C.nitrateDeep} strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M118 150 Q 150 160 182 150 M124 178 Q 150 188 176 178" stroke="#fff" strokeOpacity="0.18" strokeWidth="3" fill="none" />
            <ellipse cx="132" cy="140" rx="12" ry="20" fill="#fff" opacity="0.16" />
        </g>
    </g>
);

const BACTERIA = [0, 51, 103, 154, 206, 257, 309];

export const Mouth = () => (
    <g>
        <Halo x={MOUTH.x} y={MOUTH.y} r={135} tone="b" />
        <g className="ab-a" style={cv({ transformOrigin: `${MOUTH.x}px ${MOUTH.y}px`, animation: 'ab-spin 22s linear infinite' })}>
            {BACTERIA.map(a => {
                const t = (a * Math.PI) / 180;
                const x = MOUTH.x + 96 * Math.cos(t);
                const y = MOUTH.y + 96 * Math.sin(t);
                return <ellipse key={a} cx={x} cy={y} rx="11" ry="6" transform={`rotate(${a + 90} ${x} ${y})`} fill={C.bacteria} opacity="0.85" />;
            })}
        </g>
        <path d="M490 150 Q 568 86 646 150 Q 568 222 490 150 Z" fill="#2A0F22" stroke={C.nitrateSoft} strokeWidth="5" strokeLinejoin="round" />
        <path d="M506 146 Q 568 118 630 146 L 630 152 Q 568 130 506 152 Z" fill="#F3F4F6" opacity="0.9" />
        <path d="M522 170 Q 568 196 614 170 Q 568 182 522 170 Z" fill="#E879A0" opacity="0.8" />
    </g>
);

export const Muscle = () => (
    <g>
        <Halo x={MUSCLE.x} y={MUSCLE.y} r={150} tone="o" />
        <path d="M860 150 H900 M1060 150 H1100" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
        <path d="M900 150 C 940 98, 1020 98, 1060 150 C 1020 202, 940 202, 900 150 Z" fill="url(#cl-muscle)" />
        <g clipPath="url(#cl-fiber)" opacity="0.45">
            {Array.from({ length: 16 }, (_, i) => <line key={i} x1={906 + i * 10} x2={906 + i * 10} y1="96" y2="204" stroke="#fff" strokeWidth="2" strokeOpacity={i % 2 ? 0.25 : 0.5} />)}
            {[126, 150, 174].map(y => <line key={y} x1="896" x2="1064" y1={y} y2={y} stroke="#3B0A16" strokeWidth="2.5" />)}
        </g>
        <path d="M900 150 C 940 98, 1020 98, 1060 150 C 1020 202, 940 202, 900 150 Z" fill="none" stroke={C.no} strokeWidth="3" className="ab-a"
            style={cv({ animation: 'ab-breathe 2.6s ease-in-out infinite' })} />
    </g>
);
