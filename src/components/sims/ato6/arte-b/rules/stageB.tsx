import { C } from '../../../kit/palette';
import { Glass, Kick, Rise, Src } from '../kit';
import { KeyFact } from '../../../kit/rhythm';
import { CountText } from '../../../ato5/countText';

/** Passos 3 e 4 do painel de árbitros: o texto da Anvisa e a UE; depois a balança entre a regra e o laudo. */

const Dots = ({ total, lit, color }: { total: number; lit: number; color: string }) => (
    <div className="flex gap-[5px]">
        {Array.from({ length: total }, (_, i) => (
            <span key={i} className="block h-[16px] w-[16px] rounded-full"
                style={{ background: i < lit ? color : 'rgba(255,255,255,0.12)', boxShadow: i < lit ? `0 0 8px ${color}` : 'none' }} />
        ))}
    </div>
);

const ABSENT = ['nitrato de sódio', 'nitrato de potássio', 'extrato de beterraba como fonte de nitrato'] as const;
const PRESENT = ['nitrato de tiamina', 'fibra de beterraba'] as const;

export const BrEuStage = () => (
    <div className="grid min-w-0 grid-cols-2 gap-3">
        <Glass color={C.placebo} glow={1} dashed className="flex flex-col gap-2 p-4">
            <div className="flex items-center justify-between"><Kick color={C.placebo}>Brasil · IN 28/2018, texto original</Kick></div>
            <div className="flex flex-col gap-1.5">
                {ABSENT.map((t, i) => (
                    <Rise key={t} delay={i * 0.12} className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-white/25 px-3 py-1.5">
                        <span className="text-[16px] leading-tight text-gray-300 line-through decoration-white/50">{t}</span>
                        <span className="shrink-0 font-mono text-[14px] uppercase" style={{ color: C.risk }}>não consta</span>
                    </Rise>
                ))}
            </div>
            <Rise delay={0.5}>
                <p className="m-0 mb-1.5 text-[15px] text-gray-300">As únicas ocorrências:</p>
                <div className="flex flex-wrap gap-1.5">{PRESENT.map(t => <span key={t} className="rounded-md border border-white/20 bg-white/5 px-2.5 py-1 text-[15px] text-gray-100">{t}</span>)}</div>
            </Rise>
            <div className="mt-auto"><Src>Anvisa 2018</Src></div>
        </Glass>
        <Glass color={C.o2} glow={1} className="flex flex-col gap-2.5 p-4">
            <Kick color={C.o2}>União Europeia</Kick>
            <Rise delay={0.1} className="flex items-center justify-between gap-2 rounded-lg border border-dashed px-3 py-2" style={{ borderColor: `${C.o2}88` }}>
                <span className="text-[16px] leading-tight text-gray-100">alegação de saúde autorizada para nitrato</span>
                <span className="shrink-0 font-display text-[22px] font-semibold uppercase" style={{ color: C.risk }}><KeyFact color={C.risk} delay={0.3}>nenhuma</KeyFact></span>
            </Rise>
            <Rise delay={0.35}><p className="m-0 mb-1.5 text-[15px] text-gray-300">Em 18 produtos:</p></Rise>
            <Rise delay={0.4} className="flex flex-col gap-1">
                <Dots total={18} lit={11} color={C.no} />
                <p className="m-0 text-[15px] leading-tight text-gray-100"><b style={{ color: C.no }}><CountText text="61,1%" delayMs={400} /></b> com dose na faixa recomendada</p>
            </Rise>
            <Rise delay={0.55} className="flex flex-col gap-1">
                <Dots total={18} lit={10} color={C.nitrate} />
                <p className="m-0 text-[15px] leading-tight text-gray-100"><b style={{ color: C.nitrate }}><CountText text="55,6%" delayMs={550} /></b> usavam celebridades ou influenciadores</p>
            </Rise>
            <div className="mt-auto"><Src>Estevan Navarro 2026</Src></div>
        </Glass>
    </div>
);

const CHECKS = ['ingrediente único', 'dose declarada', 'laudo de terceiro (ex.: Informed Sport)'] as const;

/** Balança: a regra (“pode?”) de um lado, o laudo (“quanto chega ao copo?”) do outro; o laudo pesa mais. */
const Balance = () => (
    <svg viewBox="0 0 460 262" width={460} height={262} className="shrink-0" role="img" aria-label="Balança: a regra responde pode, o laudo responde quanto chega ao copo">
        <defs>
            <linearGradient id="ab-beam" x1="0" x2="1"><stop offset="0" stopColor="#475569" /><stop offset="1" stopColor={C.nitriteSoft} /></linearGradient>
        </defs>
        <path d="M230 76 L230 232 M180 236 H280" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />
        <g className="ab-a" style={{ transformOrigin: '230px 76px', animation: 'ab-tilt 1s 0.2s cubic-bezier(.3,1.4,.5,1) both', '--ab-deg': '7deg' } as React.CSSProperties}>
            <rect x="80" y="72" width="300" height="8" rx="4" fill="url(#ab-beam)" />
            <circle cx="230" cy="76" r="9" fill={C.nitrite} />
            <Pan x={90} label="Regra: pode?" color={C.no} content={<RuleChecks />} />
            <Pan x={370} label="Laudo: quanto chega ao copo?" color={C.nitrite} content={<Beaker />} />
        </g>
    </svg>
);

const Pan = ({ x, label, color, content }: { x: number; label: string; color: string; content: React.ReactNode }) => (
    <g className="ab-a" style={{ transformOrigin: `${x}px 76px`, animation: 'ab-untilt 1s 0.2s cubic-bezier(.3,1.4,.5,1) both', '--ab-deg': '7deg' } as React.CSSProperties}>
        <path d={`M${x} 76 L${x - 62} 140 M${x} 76 L${x + 62} 140`} stroke="#64748B" strokeWidth="1.5" />
        <path d={`M${x - 70} 140 H${x + 70} Q${x + 62} 160 ${x} 160 Q${x - 62} 160 ${x - 70} 140 Z`} fill={`${color}33`} stroke={color} strokeWidth="2" />
        <g transform={`translate(${x}, 140)`}>{content}</g>
        <text x={x} y={190} textAnchor="middle" fontSize="16" fontWeight="600" fill={color} style={{ fontFamily: 'var(--font-body)' }}>{label.split(': ')[0] + ':'}</text>
        <text x={x} y={210} textAnchor="middle" fontSize="16" fontWeight="600" fill="#E5E7EB" style={{ fontFamily: 'var(--font-body)' }}>{label.split(': ')[1]}</text>
    </g>
);

const RuleChecks = () => (
    <g>{[-44, -22, 0, 22, 44].map(dx => (
        <g key={dx} transform={`translate(${dx}, -14)`}>
            <circle r="9" fill={`${C.no}33`} stroke={C.no} strokeWidth="1.5" />
            <path d="M-4 0 L-1 3.5 L4.5 -3" stroke={C.no} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
    ))}</g>
);

const Beaker = () => (
    <g transform="translate(0,-34)">
        <path d="M-20 0 L-16 36 Q-16 40 -12 40 H12 Q16 40 16 36 L20 0" fill="none" stroke="#E5E7EB" strokeWidth="2" />
        <path d="M-17.5 14 H17.5 L16 36 Q16 40 12 40 H-12 Q-16 40 -16 36 Z" fill={C.nitrate} opacity="0.85" />
        <path d="M-20 10 H-8" stroke="#fff" strokeWidth="2" />
    </g>
);

export const ScaleStage = () => (
    <Glass color={C.no} glow={1} className="flex min-w-0 items-center gap-3 px-3 py-3">
        <Balance />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
            {CHECKS.map((c, i) => (
                <Rise key={c} delay={0.5 + i * 0.1} className="flex items-center gap-2 text-[16px] leading-tight text-gray-100">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-[#07050B]" style={{ background: C.no }}>✓</span>{c}
                </Rise>
            ))}
            <Rise delay={0.85}><p className="m-0 text-[15px] leading-snug text-gray-300">A certificação reduz o risco; não zera. <Src>IOC 2018</Src></p></Rise>
            <Rise delay={0.95} className="mt-1 flex flex-col gap-1.5">
                <div className="flex flex-wrap gap-[4px]">
                    {Array.from({ length: 24 }, (_, i) => <span key={i} className="block h-[14px] w-[14px] rounded-full" style={{ background: i < 5 ? C.nitrate : 'rgba(255,255,255,0.12)', boxShadow: i < 5 ? `0 0 8px ${C.nitrate}` : 'none' }} />)}
                </div>
                <p className="m-0 text-[15px] leading-tight text-gray-100">Só <b style={{ color: C.nitrate }}><KeyFact color={C.nitrate} delay={1.05}><CountText text="5" delayMs={950} /> de 24</KeyFact></b> produtos deram ≥ 5 mmol por porção, de forma consistente. <Src>Gallardo 2019</Src></p>
            </Rise>
        </div>
    </Glass>
);
