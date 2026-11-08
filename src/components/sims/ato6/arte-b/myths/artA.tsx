import { C } from '../../../kit/palette';
import { Kick, Src } from '../kit';
import { Reveal } from '../../../kit/rhythm';
import { cv } from '../util';
import { Count, SvgKeyFact } from '../../../ato5/countText';

/** Mito 1 (depleção): oito tubos de ensaio. Os que caem perdem líquido; os que ficam seguem cheios. Mito 2 (nitrito): nitrito sobe e volta, o VO₂ fica −3%. */

interface Tube { label: string; color: string; down: boolean }
interface Group { name: string; tubes: readonly Tube[] }

const GROUPS: readonly Group[] = [
    { name: 'saliva', tubes: [{ label: 'nitrato', color: C.nitrate, down: true }, { label: 'nitrito', color: C.nitrite, down: true }] },
    { name: 'plasma', tubes: [{ label: 'nitrato', color: C.nitrate, down: true }, { label: 'nitrito', color: C.nitrite, down: false }] },
    { name: 'músculo', tubes: [{ label: 'nitrato', color: C.nitrate, down: false }, { label: 'nitrito', color: C.nitrite, down: false }] },
    { name: 'resultado', tubes: [{ label: 'pressão arterial', color: C.o2, down: false }, { label: 'desempenho', color: C.no, down: false }] },
];

const TubeView = ({ t, delay }: { t: Tube; delay: number }) => (
    <div className="flex w-[84px] flex-col items-center gap-1.5">
        <Reveal order={1} delay={delay}><span className="font-display text-[26px] font-semibold leading-none" style={{ color: t.down ? C.hypoxia : C.placebo }}>{t.down ? '↓' : '='}</span></Reveal>
        <div className="relative h-[150px] w-[48px] overflow-hidden rounded-b-[22px] rounded-t-md border-2 border-white/35 bg-white/5">
            <div className="ab-a absolute inset-x-0 bottom-0" style={cv({ background: `linear-gradient(180deg, ${t.color}, ${t.color}aa)`, height: t.down ? '36%' : '82%', '--ab-from': '82%', '--ab-to': '36%', animation: t.down ? `ab-drop 1s ${delay}s ease-in-out both` : 'none' })} />
            <span className="absolute inset-x-0 h-[2px] border-t-2 border-dashed border-white/60" style={{ top: '18%' }} />
        </div>
        <span className="text-center text-[14px] leading-tight text-gray-200">{t.label}</span>
    </div>
);

export const DepletionArt = () => (
    <div className="flex flex-col gap-2">
        <Kick>depois de 7 dias de dieta pobre em nitrato · pontilhado = nível de antes</Kick>
        <div className="grid grid-cols-4 gap-2">
            {GROUPS.map((g, gi) => (
                <div key={g.name} className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-black/25 px-1 pb-2 pt-1.5">
                    <p className="m-0 font-mono text-[14px] uppercase tracking-wide text-gray-400">{g.name}</p>
                    <div className="flex gap-1">{g.tubes.map((t, ti) => <TubeView key={t.label} t={t} delay={0.55 + (gi * 2 + ti) * 0.08} />)}</div>
                </div>
            ))}
        </div>
    </div>
);

interface Col { when: string; high: boolean; word: string; p: string }

const COLS: readonly Col[] = [
    { when: '2 h após a dose', high: true, word: 'sobe', p: 'p = 0,06' },
    { when: '7 dias', high: true, word: 'sobe', p: 'p < 0,05' },
    { when: '28–30 dias, sem dose aguda', high: false, word: 'volta ao basal', p: 'p < 0,05' },
];

/** O −3% sobe junto com a barra verde do VO₂. */
const VoText = ({ delay }: { delay: number }) => (
    <text x="154" y="136" textAnchor="middle" fontSize="22" fontWeight="700" fill={C.no} style={{ fontFamily: 'var(--font-display)' }}><Count text="−3%" delayMs={delay * 1000} ms={700} /></text>
);

const NitriteCol = ({ c, i }: { c: Col; i: number }) => (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-black/25 px-2 pb-2 pt-2">
        <p className="m-0 text-center font-mono text-[14px] leading-tight text-gray-300">{c.when}</p>
        <svg viewBox="0 0 220 176" width="100%" height={176} role="img" aria-label={`Nitrito plasmático ${c.word}; VO₂ −3%`}>
            <line x1="14" x2="206" y1="88" y2="88" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.5" />
            <rect x="40" y={c.high ? 14 : 80} width="52" height={c.high ? 74 : 8} rx="5" fill={C.nitrite} className="ab-a"
                style={cv({ transformOrigin: '66px 88px', animation: c.high ? `ab-grow 0.7s ${0.5 + i * 0.12}s ease-out both` : 'none' })} />
            {!c.high && <rect x="40" y="14" width="52" height="74" rx="5" fill="none" stroke={C.nitrite} strokeWidth="2" strokeDasharray="5 5" opacity="0.6" />}
            <rect x="128" y="88" width="52" height="22" rx="5" fill={C.no} className="ab-a"
                style={cv({ transformOrigin: '154px 88px', animation: `ab-grow 0.7s ${0.65 + i * 0.12}s ease-out both` })} />
            <text x="66" y="168" textAnchor="middle" fontSize="15" fontWeight="600" fill={C.nitrite} style={{ fontFamily: 'var(--font-body)' }}>nitrito</text>
            <text x="154" y="168" textAnchor="middle" fontSize="15" fontWeight="600" fill={C.no} style={{ fontFamily: 'var(--font-body)' }}>VO₂</text>
            {c.high ? <VoText delay={0.65 + i * 0.12} /> : <SvgKeyFact color={C.no} delay={1.2}><VoText delay={0.65 + i * 0.12} /></SvgKeyFact>}
        </svg>
        <p className="m-0 text-center text-[14px] leading-tight text-gray-200"><b style={{ color: c.high ? C.nitrite : C.placebo }}>{c.word}</b> · <Src>{c.p}</Src></p>
    </div>
);

export const NitriteArt = () => (
    <div className="flex flex-col gap-2">
        <Kick>nitrito plasmático × VO₂ no exercício moderado · barras esquemáticas</Kick>
        <div className="grid grid-cols-3 gap-2.5">{COLS.map((c, i) => <NitriteCol key={c.when} c={c} i={i} />)}</div>
    </div>
);
