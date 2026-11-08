import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import { Calc } from './ui';
import { DOSE_BANDS } from './shared';

/** Visuais dos cinco mitos (slide 86). Cada um mostra o número que vira o mito do avesso. */

const Chip = ({ label, state }: { label: string; state: 'down' | 'same' }) => (
    <div className="flex items-center justify-between gap-2 rounded-xl border px-3 py-2"
        style={{ borderColor: state === 'down' ? `${C.hypoxia}aa` : 'rgba(255,255,255,0.15)', background: state === 'down' ? `${C.hypoxia}18` : 'rgba(255,255,255,0.03)' }}>
        <span className="text-[16px] text-gray-100">{label}</span>
        <span className="font-display text-[22px] font-semibold" style={{ color: state === 'down' ? C.hypoxia : C.placebo }}>{state === 'down' ? '↓' : '='}</span>
    </div>
);

const DEPLETION: readonly { label: string; state: 'down' | 'same' }[] = [
    { label: 'Nitrato da saliva', state: 'down' }, { label: 'Nitrito da saliva', state: 'down' }, { label: 'Nitrato do plasma', state: 'down' }, { label: 'Nitrito do plasma', state: 'same' },
    { label: 'Nitrato do músculo', state: 'same' }, { label: 'Nitrito do músculo', state: 'same' }, { label: 'Pressão arterial', state: 'same' }, { label: 'Desempenho', state: 'same' },
];

export const DepletionVisual = () => (
    <div className="flex flex-col gap-2">
        <p className="m-0 font-mono text-[14px] uppercase tracking-wider text-gray-400">depois de 7 dias de dieta pobre em nitrato</p>
        <div className="grid grid-cols-4 gap-2">{DEPLETION.map(d => <Chip key={d.label} {...d} />)}</div>
    </div>
);

export const NitriteVisual = () => {
    const cols = [
        { when: '2 h após a dose', nitrite: 'sobe', vo2: '−3%', note: 'p = 0,06' },
        { when: '7 dias', nitrite: 'sobe', vo2: '−3%', note: 'p < 0,05' },
        { when: '28–30 dias, sem dose aguda', nitrite: 'volta ao basal', vo2: '−3%', note: 'p < 0,05' },
    ];
    return (
        <div className="grid grid-cols-3 gap-3">
            {cols.map((c, i) => (
                <div key={c.when} className="flex flex-col gap-2 rounded-xl border border-white/15 p-3">
                    <p className="m-0 font-mono text-[14px] text-gray-300">{c.when}</p>
                    <p className="m-0 text-[16px] text-gray-200">nitrito plasmático: <strong style={{ color: i === 2 ? C.placebo : C.nitrite }}>{c.nitrite}</strong></p>
                    <p className="m-0 text-[16px] text-gray-200">VO₂ no exercício moderado: <strong className="font-display text-[22px]" style={{ color: C.no }}>{c.vo2}</strong> <span className="font-mono text-[14px] text-gray-400">{c.note}</span></p>
                </div>
            ))}
        </div>
    );
};

const VBar = ({ value, max, color, label, shown, delay = 0 }: { value: number; max: number; color: string; label: string; shown: string; delay?: number }) => {
    const reduce = useReducedMotion();
    return (
        <div className="flex w-[110px] flex-col items-center gap-1">
            <span className="font-display text-[20px] font-semibold leading-none text-white">{shown}</span>
            <div className="flex h-[70px] w-14 items-end rounded-t-md bg-white/5">
                <motion.div className="w-full rounded-t-md" style={{ background: color }} initial={reduce ? false : { height: 0 }} animate={{ height: `${(value / max) * 100}%` }} transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }} />
            </div>
            <span className="font-mono text-[14px] text-gray-300">{label}</span>
        </div>
    );
};

const Pair = ({ title, a, b, sa, sb, max, unit, verdict, color, bad, la = 'antes', lb = 'depois' }: { title: string; a: number; b: number; sa: string; sb: string; max: number; unit: string; verdict: string; color: string; bad?: boolean; la?: string; lb?: string }) => (
    <div className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-white/15 p-3">
        <p className="m-0 text-[16px] font-semibold text-gray-100">{title}</p>
        <div className="flex items-end gap-4">
            <VBar value={a} max={max} color={C.placebo} label={la} shown={sa} />
            <VBar value={b} max={max} color={color} label={lb} shown={sb} delay={0.15} />
        </div>
        <p className="m-0 text-center text-[15px] leading-snug" style={{ color: bad ? C.hypoxia : color }}>{verdict} <span className="text-gray-400">· {unit}</span></p>
    </div>
);

export const ForceVisual = () => (
    <div className="flex gap-3">
        <Pair title="Força voluntária máxima" a={596} b={602} sa="596" sb="602" max={700} unit="N, sem mudança" verdict="igual" color={C.placebo} />
        <Pair title="Twitch evocado (baixa frequência)" a={136.5} b={164} sa="136,5" sb="164,0" max={700} unit="N, p < 0,01" verdict="maior" color={C.o2} />
    </div>
);

export const Vo2Visual = () => (
    <div className="flex gap-3">
        <Pair title="VO₂max" a={3.72} b={3.62} sa="3,72" sb="3,62" max={4.2} unit="L/min, p < 0,05" verdict="caiu 2,7%" color={C.hypoxia} bad la="controle" lb="nitrato" />
        <Pair title="Tempo até a exaustão" a={524} b={563} sa="524" sb="563" max={640} unit="s, p = 0,13" verdict="tendeu a subir" color={C.no} la="controle" lb="nitrato" />
    </div>
);

const AX = 9;
const at = (mmol: number): string => `${(mmol / AX) * 100}%`;

export const PowderVisual = () => (
    <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between"><p className="m-0 font-mono text-[14px] uppercase tracking-wider text-gray-400">mmol de nitrato por porção</p><Calc /></div>
        <div className="relative h-[92px]">
            <div className="absolute top-1 flex h-8 items-center justify-center rounded-md border" style={{ left: at(DOSE_BANDS.ioc.lo), width: `calc(${at(DOSE_BANDS.ioc.hi)} - ${at(DOSE_BANDS.ioc.lo)})`, borderColor: `${C.no}aa`, background: `${C.no}28` }}>
                <span className="text-[15px] font-semibold" style={{ color: C.no }}>dose do IOC: 5–9</span>
            </div>
            <div className="absolute top-[52px] h-6 rounded-md" style={{ left: at(0.4), width: `calc(${at(2.6)} - ${at(0.4)})`, background: C.hypoxia }} />
            <span className="absolute top-[52px] whitespace-nowrap text-[16px] font-semibold" style={{ left: at(2.6), marginLeft: 10, color: C.hypoxia }}>6 pós: 0,4–2,6</span>
            <div className="absolute top-[46px] h-9 w-[3px] -translate-x-1/2 rounded bg-white" style={{ left: at(1.03) }} />
            <span className="absolute top-[78px] -translate-x-1/2 whitespace-nowrap font-mono text-[14px] text-white" style={{ left: at(1.03) }}>Superbeets 5 g: 1,03</span>
        </div>
        <div className="relative h-5 border-t border-white/20">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(t => <span key={t} className="absolute top-0.5 -translate-x-1/2 font-mono text-[14px] text-gray-300" style={{ left: at(t) }}>{t}</span>)}
        </div>
    </div>
);
