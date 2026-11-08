import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { Cone, FullPitch } from './Pitch';

/** Passo 1 — Bruno (caso fictício) no campo: corridas moderadas, arrancadas em laranja e o vaivém do Yo-Yo IR1 no canto. */

const ROUTE = 'M 150 330 C 210 230, 260 140, 340 170 S 430 300, 500 230 S 580 120, 640 150';
const SPRINTS = [
    'M 196 252 C 214 214, 236 178, 262 156',
    'M 372 186 C 396 220, 410 258, 440 270',
    'M 540 196 C 560 168, 580 140, 606 130',
];
/** Posições ilustrativas dos outros jogadores (cinza = time do Bruno, contorno = adversário). */
const MATES = [[110, 120], [250, 300], [300, 90], [420, 360], [470, 120], [560, 290], [120, 380], [600, 380]] as const;
const RIVALS = [[200, 180], [330, 260], [400, 80], [520, 340], [610, 220], [660, 90], [260, 400], [450, 210]] as const;

const ClockRing = ({ reduce }: { reduce: boolean }) => (
    <g transform="translate(652 74)">
        <circle r={34} fill="rgba(7,5,11,0.8)" stroke="rgba(255,255,255,0.2)" />
        <circle r={27} fill="none" stroke={C.hypoxia} strokeWidth={5} strokeDasharray="170 0" opacity={0.35} />
        <line x1={0} y1={0} x2={0} y2={-22} stroke="#fff" strokeWidth={3} strokeLinecap="round">
            {!reduce && <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="9s" repeatCount="indefinite" />}
        </line>
        <SvgText x={0} y={54} text="90 min" size={16} weight={700} anchor="middle" color="#fff" />
    </g>
);

export const BrunoArt = ({ reduce }: { reduce: boolean }) => (
    <svg viewBox="0 0 720 448" width="100%" height="100%" role="img" aria-label="Bruno no campo, com arrancadas e o teste Yo-Yo">
        <defs>
            <filter id="bruno-glow2" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="6" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
        </defs>
        <FullPitch />
        {MATES.map(([x, y]) => <circle key={`m${x}`} cx={x} cy={y} r={9} fill={C.placebo} opacity={0.75} />)}
        {RIVALS.map(([x, y]) => <circle key={`r${x}`} cx={x} cy={y} r={9} fill="none" stroke="#E5E7EB" strokeWidth={2.5} opacity={0.55} />)}
        <path d={ROUTE} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={3} strokeDasharray="3 9" strokeLinecap="round" />
        {SPRINTS.map((d, i) => (
            <g key={d}>
                <path d={d} fill="none" stroke={C.hypoxia} strokeWidth={14} strokeLinecap="round" opacity={0.18} />
                <path d={d} fill="none" stroke={C.hypoxia} strokeWidth={6} strokeLinecap="round" strokeDasharray="18 8">
                    {!reduce && <animate attributeName="stroke-dashoffset" values="52;0" dur={`${0.7 + i * 0.1}s`} repeatCount="indefinite" />}
                </path>
            </g>
        ))}
        <g filter="url(#bruno-glow2)">
            <circle cx={reduce ? 340 : 0} cy={reduce ? 170 : 0} r={14} fill={C.nitrate} stroke="#fff" strokeWidth={3}>
                {!reduce && <animateMotion dur="9s" repeatCount="indefinite" path={ROUTE} />}
            </circle>
        </g>
        <SvgText x={150} y={360} text="Bruno" size={19} weight={700} color={C.nitrateSoft} />
        <ClockRing reduce={reduce} />
        <g>
            <rect x={36} y={36} width={250} height={66} rx={10} fill="rgba(7,5,11,0.8)" stroke="rgba(255,255,255,0.16)" />
            <SvgText x={50} y={62} text="meio-campista amador" size={16} color="#E5E7EB" />
            <line x1={52} x2={80} y1={83} y2={83} stroke={C.hypoxia} strokeWidth={5} strokeLinecap="round" />
            <SvgText x={88} y={89} text="arrancada" size={16} color={C.hypoxia} weight={600} />
            <line x1={176} x2={204} y1={83} y2={83} stroke="rgba(255,255,255,0.6)" strokeWidth={3} strokeDasharray="3 6" strokeLinecap="round" />
            <SvgText x={212} y={89} text="trote" size={16} color={C.muted} weight={500} />
        </g>
        <g>
            <rect x={398} y={322} width={292} height={98} rx={12} fill="rgba(7,5,11,0.86)" stroke={`${C.hypoxia}99`} />
            <SvgText x={414} y={348} text="Yo-Yo IR1" size={18} weight={700} color={C.hypoxia} />
            <SvgText x={414} y={372} text="ida e volta, ritmo crescente," size={16} color="#E5E7EB" weight={500} />
            <SvgText x={414} y={394} text="pausa curta entre as corridas" size={16} color="#E5E7EB" weight={500} />
            <Cone x={560} y={342} s={0.8} />
            <Cone x={672} y={342} s={0.8} />
            <circle cx={reduce ? 616 : 560} cy={345} r={7} fill={C.nitrateSoft} stroke="#fff" strokeWidth={1.5}>
                {!reduce && <animate attributeName="cx" values="560;672;560" dur="2.6s" repeatCount="indefinite" />}
            </circle>
        </g>
    </svg>
);
