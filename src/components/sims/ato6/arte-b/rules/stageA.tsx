import { C } from '../../../kit/palette';
import { Glass, Kick, Rise, Src } from '../kit';
import { KeyFact } from '../../../kit/rhythm';

/** Passos 1 e 2 do painel de árbitros: a Lista Proibida varrida página a página e a escada de evidência. */

const PAGES = 26;
const TERMS = ['nitrate', 'nitrite', 'beetroot', 'nitric oxide'] as const;

export const ListStage = () => (
    <Glass color={C.no} glow={1} className="flex min-w-0 flex-col gap-3 p-4">
        <div className="flex items-center justify-between"><Kick color={C.no}>Lista Proibida 2026 · texto integral, 26 páginas</Kick><Src>WADA 2026</Src></div>
        <div className="relative h-[68px]">
            <div className="flex h-full gap-[5px]">
                {Array.from({ length: PAGES }, (_, i) => (
                    <span key={i} className="ab-a block h-full flex-1 rounded-[3px]"
                        style={{ background: C.no, '--ab-to': C.no, animation: `ab-check 0.3s ${0.15 + i * 0.035}s both` } as React.CSSProperties} />
                ))}
            </div>
            <span className="ab-a pointer-events-none absolute -top-1 left-0 block h-[76px] w-[3px] rounded"
                style={{ background: '#fff', boxShadow: `0 0 14px 3px ${C.no}`, '--ab-scan': '640px', animation: 'ab-scan 1.1s 0.15s ease-in-out both' } as React.CSSProperties} />
        </div>
        <div className="grid grid-cols-4 gap-2.5">
            {TERMS.map((t, i) => (
                <Rise key={t} delay={0.5 + i * 0.1}>
                    <div className="flex items-center justify-between rounded-xl border border-white/15 bg-black/30 px-3 py-2">
                        <div className="min-w-0">
                            <p className="m-0 font-mono text-[15px] text-gray-100">“{t}”</p>
                            <p className="m-0 text-[14px] text-gray-400">ocorrências</p>
                        </div>
                        <span className="font-mono text-[34px] font-semibold leading-none" style={{ color: C.no }}>0</span>
                    </div>
                </Rise>
            ))}
        </div>
        <Rise delay={0.95} className="mt-auto flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5" style={{ borderColor: `${C.no}66`, background: `${C.no}12` }}>
            <p className="m-0 text-[17px] leading-snug text-gray-100">No consenso Delphi: o nitrato viola o espírito do esporte? <Src>Shannon 2022</Src></p>
            <span className="font-display text-[30px] font-semibold uppercase leading-none" style={{ color: C.no }}><KeyFact color={C.no} delay={1.1}>não</KeyFact></span>
        </Rise>
    </Glass>
);

interface Rung { org: string; seal: string; color: string; chips: readonly string[]; src: string }

const RUNGS: readonly Rung[] = [
    { org: 'AIS', seal: 'Grupo A', color: C.no, chips: ['cafeína', 'beta-alanina', 'bicarbonato', 'creatina', 'glicerol'], src: 'AIS' },
    { org: 'IOC 2018', seal: 'boa evidência', color: C.no, chips: ['cafeína', 'creatina', 'tamponantes', '5–9 mmol, 2–3 h antes'], src: 'Maughan 2018' },
    { org: 'ISSN 2018', seal: 'limitada ou mista', color: C.nitrite, chips: ['categoria II', 'sem position stand só de nitrato (busca de 04/11/2026)'], src: 'Kerksick 2018' },
];

const YEARS = [2018, 2020, 2022, 2026] as const;
const pos = (y: number): string => `${((y - 2018) / 8) * 100}%`;

export const LadderStage = () => (
    <Glass color={C.nitrite} glow={1} className="flex min-w-0 flex-col gap-2.5 p-4">
        <div className="flex flex-col gap-1.5">
            {RUNGS.map((r, i) => (
                <Rise key={r.org} delay={i * 0.12} className="flex items-center gap-3 rounded-xl border px-3 py-1.5" style={{ borderColor: `${r.color}66`, background: `${r.color}12` }}>
                    <span className="w-[100px] shrink-0 font-display text-[18px] font-semibold text-white">{r.org}</span>
                    <span className="w-[126px] shrink-0 font-mono text-[14px] font-semibold uppercase leading-tight" style={{ color: r.color }}>{r.seal}</span>
                    <span className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                        {r.chips.map(c => <span key={c} className="rounded-md border border-white/15 px-2 py-0.5 text-[14px] leading-tight text-gray-200">{c}</span>)}
                    </span>
                </Rise>
            ))}
        </div>
        <Rise delay={0.5} className="mt-auto">
            <Kick>quando cada voz foi escrita</Kick>
            <div className="relative mx-12 mb-6 mt-4 h-[40px]">
                <div className="absolute inset-x-0 top-[22px] h-[3px] rounded bg-white/15" />
                <div className="absolute top-[18px] h-[11px] rounded-full" style={{ left: pos(2020), right: 0, background: `linear-gradient(90deg, ${C.o2}00, ${C.o2}99)` }} />
                {YEARS.map(y => <span key={y} className="absolute top-[31px] -translate-x-1/2 font-mono text-[14px] text-gray-400" style={{ left: pos(y) }}>{y}</span>)}
                <Mark at={pos(2018)} color={C.nitrite} label="ISSN · IOC" />
                <Mark at={pos(2020)} color={C.o2} label="meta-análises" />
                <Mark at={pos(2022)} color={C.no} label="Delphi"  />
            </div>
        </Rise>
    </Glass>
);

const Mark = ({ at, color, label }: { at: string; color: string; label: string; up?: boolean }) => (
    <>
        <span className="absolute top-[16px] h-[15px] w-[15px] -translate-x-1/2 rounded-full border-2 border-[#07050B]" style={{ left: at, background: color, boxShadow: `0 0 12px ${color}` }} />
        <span className="absolute -translate-x-1/2 whitespace-nowrap text-[14px] font-semibold" style={{ left: at, color, top: -4 }}>{label}</span>
    </>
);
