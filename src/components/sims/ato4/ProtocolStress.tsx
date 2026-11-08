import { br } from '../kit/format';
import { C } from '../kit/palette';
import { Panel } from '../kit/ui';

/** Passo 5 do slide 51: calor úmido (Smith 2019) e sprint até a exaustão (Martin 2014). */

interface PairProps {
    label: string;
    placebo: number;
    nitrate: number;
    max: number;
    unit: string;
    nitrateColor: string;
    p: string;
    decimals?: number;
}

const fmt = (v: number, d: number) => (d > 0 ? br(v, d) : String(v));

const Row = ({ value, max, color, unit, d, strong }: { value: number; max: number; color: string; unit: string; d: number; strong?: boolean }) => (
    <div className="relative h-[19px] rounded bg-white/[0.05]">
        <div className="absolute inset-y-0 left-0 flex items-center justify-end rounded pr-2" style={{ width: `${(value / max) * 100}%`, background: `${color}${strong ? 'dd' : '99'}` }}>
            <span className="font-mono text-[15px] font-bold leading-none text-white">{fmt(value, d)} {unit}</span>
        </div>
    </div>
);

/** Duas barras (placebo, beterraba) com o P do contraste. */
const Pair = ({ label, placebo, nitrate, max, unit, nitrateColor, p, decimals = 0 }: PairProps) => (
    <div className="flex flex-col gap-0.5">
        <div className="flex items-baseline justify-between">
            <span className="text-[16px] font-semibold text-gray-100">{label}</span>
            <span className="font-mono text-[15px] text-gray-300">{p}</span>
        </div>
        <Row value={placebo} max={max} color={C.placebo} unit={unit} d={decimals} />
        <Row value={nitrate} max={max} color={nitrateColor} unit={unit} d={decimals} strong />
    </div>
);

const Thermometer = () => (
    <svg viewBox="0 0 44 120" width={40} height={110} aria-hidden>
        <rect x={15} y={4} width={14} height={86} rx={7} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" />
        <rect x={19} y={22} width={6} height={74} rx={3} fill={C.hypoxia} />
        <circle cx={22} cy={98} r={13} fill={C.hypoxia} stroke="#fff" strokeOpacity={0.5} />
    </svg>
);

export const HeatCard = () => (
    <Panel className="h-full p-4 flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
            <span className="font-display text-[1.35rem] font-semibold text-white">Calor úmido</span>
            <span className="font-mono text-[15px] text-gray-300">Smith 2019 · n = 12 · 6,2 mmol</span>
        </div>
        <p className="text-[16px] leading-snug text-gray-100">
            20 sprints de 6 s. A 22 °C e 35% de umidade: <b className="text-white">sem efeito</b>.
        </p>
        <div className="flex min-h-0 flex-1 items-start gap-3">
            <Thermometer />
            <div className="flex flex-1 flex-col gap-2">
                <span className="text-[16px] font-bold" style={{ color: C.hypoxia }}>30 °C · 70% de umidade</span>
                <Pair label="Pico de potência" placebo={693} nitrate={659} max={800} unit="W" nitrateColor={C.hypoxia} p="P = 0,056" />
                <Pair label="Potência média" placebo={575} nitrate={543} max={800} unit="W" nitrateColor={C.hypoxia} p="P = 0,081" />
            </div>
        </div>
        <p className="text-[16px] font-medium text-white">Tendência contra a beterraba; ~75% pioraram.</p>
    </Panel>
);

const Dots = ({ count, color }: { count: number; color: string }) => (
    <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: count }, (_, i) => (
            <span key={i} className="size-[19px] rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}88` }} />
        ))}
    </div>
);

export const ExhaustCard = () => (
    <Panel className="h-full p-4 flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
            <span className="font-display text-[1.35rem] font-semibold text-white">Até a exaustão</span>
            <span className="font-mono text-[15px] text-gray-300">Martin 2014 · n = 16 · ≈ 4,8 mmol</span>
        </div>
        <p className="text-[16px] leading-snug text-gray-100">Sprints de 8 s com 30 s de pausa, repetidos até não conseguir.</p>
        <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
                <span className="text-[16px] font-semibold text-gray-100">Sprints feitos (média; 1 bolinha = 1)</span>
                <span className="font-mono text-[15px] text-gray-300">P = 0,005</span>
            </div>
            <div className="flex items-center gap-3"><span className="w-[116px] shrink-0 text-[15px] text-gray-300">placebo · 15</span><Dots count={15} color={C.placebo} /></div>
            <div className="flex items-center gap-3"><span className="w-[116px] shrink-0 text-[15px]" style={{ color: C.nitrateSoft }}>beterraba · 13</span><Dots count={13} color={C.nitrate} /></div>
        </div>
        <Pair label="Trabalho total" placebo={57.8} nitrate={49.2} max={70} unit="kJ" nitrateColor={C.nitrate} p="P = 0,027" decimals={1} />
    </Panel>
);
