import { C } from '../../kit/palette';

/** Ilustrações geométricas do slide 30: o camundongo (fibra rápida da pata) e o humano (vasto lateral da coxa). */

interface OrgProps {
    /** Músculo aceso (o fenótipo apareceu). */
    lit: boolean;
    /** Faíscas de Ca²⁺ (só o camundongo, passo 2). */
    sparks?: boolean;
    reduce: boolean;
}

export const MouseArt = ({ lit, sparks = false, reduce }: OrgProps) => (
    <g>
        <circle cx={95} cy={190} r={92} fill={lit ? C.no : C.placebo} opacity={lit ? 0.12 : 0.05} style={{ transition: 'opacity 600ms' }} />
        <path d="M30 214 C-6 220 -4 262 30 262 C52 262 56 246 46 240" fill="none" stroke="#E5C7D4" strokeWidth={4} strokeLinecap="round" />
        <ellipse cx={92} cy={200} rx={66} ry={40} fill="#3B3346" stroke="#C9B8D6" strokeWidth={2.5} />
        <ellipse cx={86} cy={186} rx={40} ry={16} fill="#fff" opacity={0.06} />
        <path d="M60 232 l-6 20 M120 234 l6 18" stroke="#E5C7D4" strokeWidth={5} strokeLinecap="round" />
        <circle cx={146} cy={174} r={28} fill="#3B3346" stroke="#C9B8D6" strokeWidth={2.5} />
        <circle cx={132} cy={146} r={15} fill="#4A4057" stroke="#C9B8D6" strokeWidth={2} />
        <circle cx={132} cy={146} r={8} fill="#F9A8D4" opacity={0.6} />
        <circle cx={156} cy={168} r={4} fill="#07050B" />
        <circle cx={173} cy={182} r={4.5} fill="#F9A8D4" />
        <path d="M168 188 l20 -4 M168 191 l20 4 M166 194 l16 10" stroke="#C9B8D6" strokeWidth={1.5} strokeLinecap="round" />
        <g style={{ transition: 'opacity 600ms' }} opacity={lit ? 1 : 0.35}>
            <ellipse cx={58} cy={214} rx={26} ry={13} fill={lit ? C.no : C.placebo} fillOpacity={0.35} stroke={lit ? C.no : C.placebo} strokeWidth={2}
                style={lit ? { filter: `drop-shadow(0 0 8px ${C.no})` } : undefined} />
            {[-14, -5, 4, 13].map(dx => <line key={dx} x1={58 + dx} x2={58 + dx} y1={204} y2={224} stroke="#fff" strokeOpacity={0.35} strokeWidth={1.5} />)}
        </g>
        {sparks && !reduce && Array.from({ length: 6 }, (_, i) => (
            <circle key={i} cx={40 + i * 7} cy={214} r={3} fill={C.nitriteSoft}>
                <animate attributeName="cy" values={`214;${196 - (i % 3) * 6};214`} dur={`${0.9 + (i % 3) * 0.2}s`} begin={`${i * 0.15}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;1;0" dur={`${0.9 + (i % 3) * 0.2}s`} begin={`${i * 0.15}s`} repeatCount="indefinite" />
            </circle>
        ))}
    </g>
);

export const HumanArt = ({ lit, reduce }: OrgProps) => (
    <g>
        <circle cx={1020} cy={170} r={100} fill={lit ? C.no : C.placebo} opacity={lit ? 0.1 : 0.05} style={{ transition: 'opacity 600ms' }} />
        <circle cx={1020} cy={52} r={20} fill="#3B3346" stroke="#C9B8D6" strokeWidth={2.5} />
        <path d="M992 80 Q1020 70 1048 80 L1054 160 Q1020 168 986 160Z" fill="#3B3346" stroke="#C9B8D6" strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M992 86 L972 150 M1048 86 L1068 150" stroke="#C9B8D6" strokeWidth={9} strokeLinecap="round" />
        <path d="M1000 162 L994 236 L992 296 M1040 162 L1046 236 L1048 296" stroke="#C9B8D6" strokeWidth={12} strokeLinecap="round" />
        <g opacity={lit ? 1 : 0.35} style={{ transition: 'opacity 600ms' }}>
            <ellipse cx={1051} cy={205} rx={11} ry={32} fill={lit ? C.no : C.placebo} fillOpacity={0.45} stroke={lit ? C.no : C.placebo} strokeWidth={2}
                style={lit ? { filter: `drop-shadow(0 0 8px ${C.no})` } : undefined}>
                {lit && !reduce && <animate attributeName="rx" values="11;14;11;11" keyTimes="0;0.12;0.3;1" dur="1.6s" repeatCount="indefinite" />}
            </ellipse>
        </g>
        <path d="M1066 205 h18" stroke={lit ? C.no : C.placebo} strokeWidth={2} strokeDasharray="3 3" />
    </g>
);
