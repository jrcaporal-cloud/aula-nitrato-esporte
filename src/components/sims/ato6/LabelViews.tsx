import { C } from '../kit/palette';
import { Card, Kicker } from './ui';
import { CATEGORIES, EXAMPLES, POWDER_RANGE } from './labelContent';
import { DOSE_BANDS, SHOT_MMOL, num } from './shared';

/** Passos 3 e 4 do LabelSim: rótulo × medido (haltere) e as causas da variação. */

const AXIS_MAX = 9;
const at = (mmol: number): string => `${(mmol / AXIS_MAX) * 100}%`;
const TICKS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** Passo 3 — cada linha liga o valor do rótulo (círculo vazio) ao medido (círculo cheio). */
export const DumbbellView = () => (
    <Card className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-5">
        <div className="flex items-center justify-between">
            <Kicker>mmol de nitrato por porção</Kicker>
            <span className="flex items-center gap-4 text-[15px] text-gray-200">
                <span><span className="inline-block h-3 w-3 rounded-full border-2 border-white align-middle" /> rótulo</span>
                <span><span className="inline-block h-3 w-3 rounded-full bg-white align-middle" /> medido</span>
            </span>
        </div>
        <div className="relative">
            {/* linha da dose mínima do IOC */}
            <div className="pointer-events-none absolute inset-y-0 z-0" style={{ left: `calc(210px + (100% - 210px) * ${DOSE_BANDS.ioc.lo / AXIS_MAX})` }}>
                <div className="h-full w-0 border-l-2 border-dashed" style={{ borderColor: C.no }} />
            </div>
            <div className="flex flex-col gap-1.5">
                {EXAMPLES.map(e => {
                    const lo = Math.min(e.label ?? e.measured, e.measured);
                    const hi = Math.max(e.label ?? e.measured, e.measured);
                    const worse = e.label !== undefined && e.measured < e.label * 0.7;
                    const color = e.measured >= 5 ? C.no : C.hypoxia;
                    return (
                        <div key={e.id} className="flex h-[45px] items-center">
                            <div className="w-[210px] shrink-0 leading-tight">
                                <p className="m-0 text-[17px] font-semibold text-white">{e.name}</p>
                                <p className="m-0 font-mono text-[14px] text-gray-300">{e.serving}</p>
                            </div>
                            <div className="relative h-full flex-1">
                                <div className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded" style={{ left: at(lo), width: `calc(${at(hi)} - ${at(lo)})`, background: worse ? C.risk : 'rgba(255,255,255,0.35)' }} />
                                {e.sd !== undefined && (
                                    <div className="absolute top-1/2 h-[10px] -translate-y-1/2 rounded-sm" style={{ left: at(e.measured - e.sd), width: `calc(${at(e.measured + e.sd)} - ${at(e.measured - e.sd)})`, background: `${color}55` }} />
                                )}
                                {e.label !== undefined && (
                                    <div className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#07050B]" style={{ left: at(e.label) }} />
                                )}
                                <div className="absolute top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: at(e.measured), background: color, boxShadow: `0 0 12px ${color}` }} />
                                <span className="absolute -top-0.5 -translate-x-1/2 whitespace-nowrap font-mono text-[14px] font-semibold leading-none" style={{ left: at(e.measured), color }}>{num(e.measured, 2)}</span>
                            </div>
                        </div>
                    );
                })}
                <div className="flex h-[45px] items-center">
                    <div className="w-[210px] shrink-0 leading-tight">
                        <p className="m-0 text-[17px] font-semibold text-white">6 pós comuns</p>
                        <p className="m-0 font-mono text-[14px] text-gray-300">faixa medida</p>
                    </div>
                    <div className="relative h-full flex-1">
                        <div className="absolute top-1/2 h-4 -translate-y-1/2 rounded-md" style={{ left: at(POWDER_RANGE.lo), width: `calc(${at(POWDER_RANGE.hi)} - ${at(POWDER_RANGE.lo)})`, background: C.hypoxia }} />
                        <span className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[14px] font-semibold" style={{ left: at(POWDER_RANGE.hi), color: C.hypoxia, marginLeft: 8 }}>
                            {num(POWDER_RANGE.lo, 1)}–{num(POWDER_RANGE.hi, 1)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="relative ml-[210px] mt-1 h-6 border-t border-white/20">
                {TICKS.map(t => (
                    <span key={t} className="absolute top-1 -translate-x-1/2 font-mono text-[14px] text-gray-300" style={{ left: at(t) }}>{t}</span>
                ))}
            </div>
        </div>
        <p className="m-0 text-[16px] leading-snug text-gray-200">
            <span style={{ color: C.no }}>┆ 5 mmol</span> = dose mínima do IOC. Faixa sombreada = ± 1 DP do medido (quando informado). BeetElite e Superbeets: só o valor medido.
        </p>
    </Card>
);

/** Passo 4 — concentração por categoria, variação entre lotes e o shot de 2013 × o de hoje. */
export const WhyView = () => (
    <Card className="flex min-w-0 flex-1 flex-col justify-center gap-4 p-5">
        <Kicker>concentração média por categoria · 6 produtos cada</Kicker>
        <div className="grid grid-cols-4 gap-3">
            {CATEGORIES.map(c => (
                <div key={c.id} className="rounded-xl border px-3 py-3" style={{ borderColor: `${c.color}77`, background: `${c.color}12` }}>
                    <p className="m-0 text-[16px] font-semibold text-gray-100">{c.name}</p>
                    <p className="m-0 mt-1 font-display text-[30px] font-semibold leading-none text-white">{c.mean}</p>
                    <p className="m-0 mt-1 font-mono text-[14px] text-gray-300">{c.unit}</p>
                </div>
            ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/15 px-4 py-3">
                <p className="m-0 font-display text-[34px] font-semibold leading-none" style={{ color: C.hypoxia }}>30 ± 26%</p>
                <p className="m-0 mt-2 text-[16px] leading-snug text-gray-200">variação entre lotes do mesmo produto (de 2% a 83%)</p>
            </div>
            <div className="rounded-xl border border-white/15 px-4 py-3">
                <p className="m-0 font-display text-[34px] font-semibold leading-none" style={{ color: C.hypoxia }}>≈ 50×</p>
                <p className="m-0 mt-2 text-[16px] leading-snug text-gray-200">do menor ao maior produto analisado</p>
            </div>
            <div className="rounded-xl border border-white/15 px-4 py-3">
                <p className="m-0 font-display text-[34px] font-semibold leading-none" style={{ color: C.nitrate }}>4,2 → {num(SHOT_MMOL, 1)}</p>
                <p className="m-0 mt-2 text-[16px] leading-snug text-gray-200">mmol no shot de 70 mL: o de 2013 (Wylie) × o medido em 2017–18</p>
            </div>
        </div>
        <p className="m-0 rounded-xl border border-white/10 px-4 py-2 text-[17px] leading-snug text-gray-100">
            O pó típico (5 g) entrega cerca de 1 mmol: <strong className="text-white">um quinto da dose mínima</strong>. Pode explicar parte dos estudos nulos: a dose do rótulo nem sempre é a que chega.
        </p>
    </Card>
);
