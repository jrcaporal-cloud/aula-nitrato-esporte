import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import { PRESETS, type PresetCase } from './protocolContent';
import { FOODS } from './foodContent';
import { Card } from './ui';
import { SHOT_MMOL, gramsFor, mmolToMg, num } from './shared';

/** Passo 5 do ProtocolSim: o dia de cada personagem (relógio de 04h às 21h) com a janela de 2–4 h e a conta da dose. */

const T0 = 4;
const T1 = 23;
const at = (clock: number): string => `${((clock - T0) / (T1 - T0)) * 100}%`;
const clockText = (c: number): string => {
    const h = Math.floor(c);
    const m = Math.round((c - h) * 60);
    return `${String(h).padStart(2, '0')}h${m === 0 ? '' : String(m).padStart(2, '0')}`;
};
const GUIDES = [4, 8, 12, 16, 20];

/** Faixa do dia: janela de 2–4 h antes da prova, a última dose (com a hora) e a prova (barra azul com a hora). */
const Lane = ({ p }: { p: PresetCase }) => {
    const doseAt = p.eventAt - p.hoursBefore;
    const eventEnd = p.eventAt + p.eventHours;
    return (
        <div className="relative h-[46px]">
            {GUIDES.map(g => <div key={g} className="absolute inset-y-0 border-l border-white/10" style={{ left: at(g) }} />)}
            <div className="absolute inset-y-1 rounded-md" style={{ left: at(p.eventAt - 4), width: `calc(${at(p.eventAt - 2)} - ${at(p.eventAt - 4)})`, background: `${C.no}26`, border: `1px solid ${C.no}77` }} />
            <div className="absolute top-1/2 h-4 -translate-y-1/2 rounded-sm" style={{ left: at(p.eventAt), width: `max(calc(${at(eventEnd)} - ${at(p.eventAt)}), 6px)`, background: C.o2 }} />
            <span className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[14px] leading-none" style={{ left: `calc(${at(eventEnd)} + 8px)`, color: C.o2Soft }}>{clockText(p.eventAt)}</span>
            <div className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: at(doseAt), background: C.nitrate, boxShadow: `0 0 10px ${C.nitrate}` }} />
            <span className="absolute -top-0.5 -translate-x-1/2 whitespace-nowrap font-mono text-[14px] font-semibold leading-none" style={{ left: at(doseAt), color: C.nitrateSoft }}>{clockText(doseAt)}</span>
        </div>
    );
};

export const PresetsView = () => {
    const reduce = useReducedMotion();
    return (
        <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="m-0 flex h-6 items-center gap-5 text-[15px] text-gray-200">
                <span><span className="mr-1.5 inline-block h-3 w-3 rounded-full align-middle" style={{ background: C.nitrate }} />última dose</span>
                <span><span className="mr-1.5 inline-block h-3 w-5 rounded-sm align-middle" style={{ background: `${C.no}55`, border: `1px solid ${C.no}` }} />janela de 2–4 h antes</span>
                <span><span className="mr-1.5 inline-block h-3 w-5 rounded-sm align-middle" style={{ background: C.o2 }} />prova</span>
                <span className="text-gray-400">linhas a cada 4 h (04h–20h) · exemplos de cálculo, não são prescrição</span>
            </p>
            {PRESETS.map((p, i) => {
                const shots = p.mmol / SHOT_MMOL;
                return (
                    <motion.div key={p.id} className="min-h-0 flex-1" initial={reduce ? false : { opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.14, duration: 0.4 }}>
                        <Card className="grid h-full grid-cols-[178px_minmax(0,1fr)_300px] items-center gap-5 px-4 py-2">
                            <div className="leading-tight">
                                <p className="m-0 font-display text-[26px] font-semibold text-white">{p.name}</p>
                                <p className="m-0 text-[15px] text-gray-200">{p.sport}</p>
                                <p className="m-0 font-mono text-[14px] text-gray-400">{p.vo2}</p>
                            </div>
                            <div className="min-w-0">
                                <Lane p={p} />
                                <p className="m-0 mt-1 text-[15px] leading-tight text-gray-100">{p.scheme}</p>
                            </div>
                            <div className="leading-tight">
                                <p className="m-0 font-display text-[24px] font-semibold text-white">{num(p.mmol, 1)} mmol <span className="font-mono text-[14px] font-normal text-gray-300">{num(mmolToMg(p.mmol))} mg</span></p>
                                <p className="m-0 mt-0.5 text-[15px] text-gray-100">≈ {num(shots, 1)} shot · {num(gramsFor(p.mmol, FOODS[0].mgPerKg))} g de rúcula</p>
                                <p className="m-0 mt-0.5 font-mono text-[14px] text-gray-400">{p.source}</p>
                            </div>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
};
