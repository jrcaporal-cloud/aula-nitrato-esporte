import { C } from '../kit/palette';
import { Card, Kicker, RangeRow } from './ui';
import { DOSE_AXIS_MAX, WYLIE_POINTS } from './protocolContent';
import { mmolToMg, num } from './shared';

/** Passo 1 do ProtocolSim: eixo de dose (mmol) com as faixas dos consensos e os três pontos de Wylie 2013. */

const at = (mmol: number): string => `${(mmol / DOSE_AXIS_MAX) * 100}%`;
const TICKS = [0, 2, 4, 6, 8, 10, 12, 14, 16];
const LEFT = 176;

const Row = ({ label, when, lo, hi, color, text }: { label: string; when: string; lo: number; hi: number; color: string; text: string }) => (
    <div className="flex h-[44px] items-center">
        <span className="shrink-0 leading-tight" style={{ width: LEFT }}>
            <span className="block text-[16px] font-semibold text-gray-100">{label}</span>
            <span className="block font-mono text-[14px] text-gray-400">{when}</span>
        </span>
        <div className="relative h-full flex-1">
            <div className="absolute inset-y-1 flex items-center justify-center rounded-md border px-2"
                style={{ left: at(lo), width: `calc(${at(hi)} - ${at(lo)})`, borderColor: `${color}aa`, background: `${color}28` }}>
                <span className="whitespace-nowrap text-[15px] font-semibold" style={{ color }}>{text}</span>
            </div>
        </div>
    </div>
);

export const DoseView = ({ dose, onDose }: { dose: number; onDose: (v: number) => void }) => (
    <Card className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-5">
        <Kicker>mmol de nitrato · 1 mmol = 62 mg</Kicker>
        <div className="relative">
            {/* linha da dose escolhida atravessa todas as faixas */}
            <div className="pointer-events-none absolute inset-y-0 z-10" style={{ left: `calc(${LEFT}px + (100% - ${LEFT}px) * ${dose / DOSE_AXIS_MAX})` }}>
                <div className="h-full w-[3px] -translate-x-1/2 rounded" style={{ background: C.nitrate, boxShadow: `0 0 10px ${C.nitrate}` }} />
            </div>
            <Row label="IOC 2018" when="2–3 h antes" lo={5} hi={9} color={C.no} text="5–9" />
            <Row label="Delphi, agudo" when="2–4 h antes" lo={8} hi={16} color={C.o2} text="8–16 mmol" />
            <Row label="Delphi, crônico" when="última: 2–4 h antes" lo={4} hi={16} color={C.bacteria} text="4–16 mmol por dia" />
            <div className="mt-1 flex h-[100px]">
                <div className="shrink-0 pr-2 text-[15px] font-semibold leading-snug text-gray-100" style={{ width: LEFT }}>
                    Wylie 2013<br /><span className="font-normal text-gray-300">tempo até a falha</span>
                </div>
                <div className="relative flex-1 border-b border-white/25">
                    <div className="absolute inset-y-0 left-0 bg-white/[0.04]" style={{ width: at(4) }} />
                    {WYLIE_POINTS.map(p => (
                        <div key={p.mmol} className="absolute bottom-0 flex -translate-x-1/2 flex-col items-center" style={{ left: at(p.mmol) }}>
                            <span className="font-display text-[20px] font-semibold leading-none" style={{ color: p.gain ? C.nitrate : C.placebo }}>{p.label}</span>
                            <div className="mt-1 w-9 rounded-t-md" style={{ height: Math.max(p.gain * 4.5, 4), background: p.gain ? C.nitrate : C.placebo }} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="relative mt-1 h-6" style={{ marginLeft: LEFT }}>
                {TICKS.map(t => <span key={t} className="absolute top-0.5 -translate-x-1/2 font-mono text-[14px] text-gray-300" style={{ left: at(t) }}>{t}</span>)}
                {WYLIE_POINTS.map(p => <span key={p.mmol} className="absolute top-5 -translate-x-1/2 font-mono text-[14px] font-semibold text-white" style={{ left: at(p.mmol) }}>{num(p.mmol, 1)}</span>)}
            </div>
        </div>
        <div className="mt-5">
            <RangeRow label="Sua dose" value={dose} min={1} max={16.8} step={0.2} onChange={onDose} color={C.nitrate}
                right={<><span className="font-display text-[24px] font-semibold text-white">{num(dose, 1)} mmol</span>
                    <span className="ml-2 font-mono text-[14px] text-gray-300">{num(mmolToMg(dose))} mg</span></>} />
        </div>
    </Card>
);
