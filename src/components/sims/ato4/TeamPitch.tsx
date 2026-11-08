import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/** Campo visto de cima, com a rota de um meio-campista e o corredor do Yo-Yo (viewBox 720 × 448). */

const ROUTE = 'M 150 330 C 210 230, 260 140, 340 170 S 430 300, 500 230 S 580 120, 640 150';
const SPRINTS = [
    'M 196 252 C 214 214, 236 178, 262 156',
    'M 372 186 C 396 220, 410 258, 440 270',
    'M 540 196 C 560 168, 580 140, 606 130',
];

const Pitch = () => (
    <g fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={2}>
        <rect x={24} y={24} width={672} height={400} rx={14} fill="url(#pitch-fill)" />
        <line x1={360} y1={24} x2={360} y2={424} />
        <circle cx={360} cy={224} r={52} />
        <rect x={24} y={134} width={96} height={180} />
        <rect x={600} y={134} width={96} height={180} />
        <rect x={24} y={184} width={38} height={80} />
        <rect x={658} y={184} width={38} height={80} />
    </g>
);

const Cone = ({ x, y }: { x: number; y: number }) => (
    <polygon points={`${x - 9},${y + 9} ${x + 9},${y + 9} ${x},${y - 11}`} fill={C.hypoxia} stroke="#fff" strokeOpacity={0.6} />
);

export const TeamPitch = ({ reduce }: { reduce: boolean }) => (
    <svg viewBox="0 0 720 448" width="100%" height="100%" role="img" aria-label="Campo com a rota de Bruno e o corredor do Yo-Yo">
        <defs>
            <linearGradient id="pitch-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0B3B2C" stopOpacity={0.55} />
                <stop offset="100%" stopColor="#06201A" stopOpacity={0.85} />
            </linearGradient>
            <filter id="bruno-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="5" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
        </defs>
        <Pitch />
        <path d={ROUTE} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={3} strokeDasharray="3 9" strokeLinecap="round" />
        {SPRINTS.map(d => (
            <path key={d} d={d} fill="none" stroke={C.hypoxia} strokeWidth={6} strokeLinecap="round" opacity={0.95} />
        ))}
        <g filter="url(#bruno-glow)">
            <circle cx={reduce ? 340 : 0} cy={reduce ? 170 : 0} r={13} fill={C.nitrate} stroke="#fff" strokeWidth={2.5}>
                {!reduce && <animateMotion dur="9s" repeatCount="indefinite" path={ROUTE} />}
            </circle>
        </g>
        <SvgText x={150} y={366} text="Bruno" size={18} weight={700} color={C.nitrateSoft} />
        <g>
            <rect x={36} y={36} width={238} height={64} rx={10} fill="rgba(7,5,11,0.78)" stroke="rgba(255,255,255,0.14)" />
            <SvgText x={50} y={62} text="meio-campista amador" size={16} color="#E5E7EB" />
            <SvgText x={50} y={86} text="━ arrancada   ┅ corrida moderada" size={16} color={C.muted} weight={500} />
        </g>
        <g>
            <rect x={398} y={330} width={286} height={82} rx={12} fill="rgba(7,5,11,0.82)" stroke={`${C.hypoxia}88`} />
            <SvgText x={414} y={356} text="Yo-Yo IR1" size={18} weight={700} color={C.hypoxia} />
            <SvgText x={414} y={380} text="ida e volta, ritmo crescente," size={16} color="#E5E7EB" weight={500} />
            <SvgText x={414} y={402} text="pausa curta entre as corridas" size={16} color="#E5E7EB" weight={500} />
            <Cone x={564} y={346} />
            <Cone x={664} y={346} />
            <circle cx={reduce ? 614 : 564} cy={346} r={7} fill={C.nitrateSoft} stroke="#fff" strokeWidth={1.5}>
                {!reduce && <animate attributeName="cx" values="564;664;564" dur="2.6s" repeatCount="indefinite" />}
            </circle>
        </g>
    </svg>
);
