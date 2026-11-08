import { Brain, Zap } from 'lucide-react';
import type { ReactNode } from 'react';
import { C } from '../../../kit/palette';
import { Kick, Src } from '../kit';
import { cv } from '../util';
import { KeyFact } from '../../../kit/rhythm';
import { Count, CountText } from '../../../ato5/countText';

/** Mito 3 (força): voluntária × evocada no mesmo eixo de newtons. Mito 4 (VO₂max): mostrador que desce e cronômetro que avança. */

const MAX_N = 700;

const Bar = ({ value, ghost, color, delay }: { value: number; ghost?: number; color: string; delay: number }) => (
    <div className="relative h-9 flex-1 rounded-md bg-white/5">
        <div className="ab-a absolute inset-y-0 left-0 rounded-md" style={cv({ width: `${(value / MAX_N) * 100}%`, background: color, transformOrigin: 'left', animation: `ab-growx 0.8s ${delay}s ease-out both` })} />
        {ghost !== undefined && <span className="absolute inset-y-[-3px] w-[3px] rounded bg-white" style={{ left: `${(ghost / MAX_N) * 100}%` }} />}
    </div>
);

const Row = ({ icon, title, sub, a, b, shownA, shownB, color, verdict, delay, keyFact = false }: { icon: ReactNode; title: string; sub: string; a: number; b: number; shownA: string; shownB: string; color: string; verdict: string; delay: number; keyFact?: boolean }) => (
    <div className="flex items-center gap-3 rounded-xl border bg-black/25 px-3 py-4" style={{ borderColor: `${color}55` }}>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2" style={{ borderColor: color, background: `${color}22` }}>{icon}</span>
        <div className="w-[150px] shrink-0"><p className="m-0 text-[16px] font-semibold leading-tight text-white">{title}</p><p className="m-0 text-[14px] leading-tight text-gray-400">{sub}</p></div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex items-center gap-2"><span className="w-[52px] shrink-0 font-mono text-[14px] text-gray-400">antes</span><Bar value={a} color={C.placebo} delay={delay} /><span className="w-[58px] shrink-0 text-right font-display text-[18px] font-semibold text-gray-200"><CountText text={shownA} delayMs={delay * 1000} ms={800} /></span></div>
            <div className="flex items-center gap-2"><span className="w-[52px] shrink-0 font-mono text-[14px] text-gray-400">depois</span><Bar value={b} ghost={a} color={color} delay={delay + 0.2} /><span className="w-[58px] shrink-0 text-right font-display text-[18px] font-semibold" style={{ color }}><CountText text={shownB} delayMs={(delay + 0.2) * 1000} ms={800} /></span></div>
        </div>
        <span className="w-[74px] shrink-0 text-center font-display text-[22px] font-semibold uppercase leading-none" style={{ color }}>{keyFact ? <KeyFact color={color} delay={delay + 1}>{verdict}</KeyFact> : verdict}</span>
    </div>
);

export const ForceArt = () => (
    <div className="flex flex-col gap-2">
        <Kick>newtons, mesmo eixo de 0 a 700 N · traço branco = valor de antes</Kick>
        <Row icon={<Brain size={24} color={C.placebo} />} title="Força voluntária máxima" sub="sem mudança" a={596} b={602} shownA="596" shownB="602" color={C.placebo} verdict="igual" delay={0.5} />
        <Row icon={<Zap size={24} color={C.o2} />} title="Twitch evocado" sub="baixa frequência · p < 0,01" a={136.5} b={164} shownA="136,5" shownB="164,0" color={C.o2} verdict="maior" delay={0.9} keyFact />
        <div className="relative h-5 border-t border-white/20" style={{ marginLeft: 295, marginRight: 164 }}>
            {[0, 350, 700].map(t => <span key={t} className="absolute top-0.5 -translate-x-1/2 font-mono text-[14px] text-gray-400" style={{ left: `${(t / MAX_N) * 100}%` }}>{t}</span>)}
        </div>
    </div>
);

/** Mostrador semicircular (0–4,2 L/min) e anel do cronômetro (0–640 s), cada um com o “antes” fantasma. */
const CX = 150;
const CY = 150;
const R = 118;
const ang = (v: number): number => -90 + (v / 4.2) * 180;
const arc = (a: number): string => {
    const t = (a * Math.PI) / 180;
    return `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R * Math.sin(t)} ${CY - R * Math.cos(t)}`;
};

const Gauge = () => (
    <svg viewBox="0 0 300 176" width={300} height={176} role="img" aria-label="VO₂max de 3,72 para 3,62 litros por minuto">
        <path d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`} fill="none" stroke="#fff" strokeOpacity="0.1" strokeWidth="16" strokeLinecap="round" />
        <path d={arc(ang(3.72))} fill="none" stroke={C.placebo} strokeOpacity="0.55" strokeWidth="16" strokeLinecap="round" />
        <path d={arc(ang(3.62))} fill="none" stroke={C.hypoxia} strokeWidth="16" strokeLinecap="round" className="ab-a" style={cv({ strokeDasharray: 420, '--ab-len': 420, animation: 'ab-draw 1s 0.4s ease-out both' })} />
        <g className="ab-a" style={cv({ transformOrigin: `${CX}px ${CY}px`, '--ab-a0': '-90deg', '--ab-a1': `${ang(3.62)}deg`, animation: 'ab-rot 1.1s 0.4s cubic-bezier(.3,1.3,.5,1) both' })}>
            <path d={`M ${CX} ${CY} L ${CX} ${CY - 100}`} stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        </g>
        <path d={`M ${CX} ${CY} L ${CX + 100 * Math.sin((ang(3.72) * Math.PI) / 180)} ${CY - 100 * Math.cos((ang(3.72) * Math.PI) / 180)}`} stroke={C.placebo} strokeWidth="3" strokeDasharray="4 5" />
        <circle cx={CX} cy={CY} r="10" fill="#E5E7EB" />
    </svg>
);

const Watch = () => {
    const r = 62;
    const len = 2 * Math.PI * r;
    return (
        <svg viewBox="0 0 176 176" width={176} height={176} role="img" aria-label="Tempo até a exaustão de 524 para 563 segundos">
            <circle cx="88" cy="88" r={r} fill="none" stroke="#fff" strokeOpacity="0.1" strokeWidth="14" />
            <circle cx="88" cy="88" r={r} fill="none" stroke={C.placebo} strokeOpacity="0.55" strokeWidth="14" strokeDasharray={`${len * (524 / 640)} ${len}`} transform="rotate(-90 88 88)" strokeLinecap="round" />
            <circle cx="88" cy="88" r={r - 17} fill="none" stroke={C.no} strokeWidth="10" strokeLinecap="round" transform="rotate(-90 88 88)" className="ab-a"
                strokeDasharray={`${2 * Math.PI * (r - 17) * (563 / 640)} 999`} style={cv({ '--ab-len': 999, animation: 'ab-draw 1s 0.6s ease-out both' })} />
            <path d="M88 20 V28" stroke="#fff" strokeOpacity="0.6" strokeWidth="3" />
        </svg>
    );
};

export const Vo2Art = () => (
    <div className="flex flex-col gap-1.5">
        <Kick>cinza = controle · cor = nitrato · traço = valor do controle</Kick>
        <div className="grid grid-cols-[1fr_1fr] gap-3">
            <div className="flex flex-col items-center rounded-xl border bg-black/25 px-2 pb-2 pt-2" style={{ borderColor: `${C.hypoxia}55` }}>
                <Gauge />
                <p className="m-0 -mt-1 text-center text-[16px] font-semibold text-white">VO₂max <KeyFact color={C.hypoxia} delay={1.2}><span className="font-display text-[22px]" style={{ color: C.hypoxia }}><Count text="3,72 → 3,62" all delayMs={400} /></span></KeyFact> L/min</p>
                <p className="m-0 text-[14px] text-gray-300"><b style={{ color: C.hypoxia }}>caiu 2,7%</b> · <Src>p &lt; 0,05</Src></p>
            </div>
            <div className="flex flex-col items-center rounded-xl border bg-black/25 px-2 pb-2 pt-2" style={{ borderColor: `${C.no}55` }}>
                <Watch />
                <p className="m-0 -mt-1 text-center text-[16px] font-semibold text-white">Tempo até a exaustão <span className="font-display text-[22px]" style={{ color: C.no }}><Count text="524 → 563" all delayMs={600} /></span> s</p>
                <p className="m-0 text-[14px] text-gray-300"><b style={{ color: C.no }}>tendeu a subir</b> · <Src>p = 0,13</Src></p>
            </div>
        </div>
    </div>
);
