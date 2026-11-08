import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import { BP_AXIS, BP_ROWS, type BpRow } from './bpContent';

/** Gráfico divergente (mmHg) que acumula as linhas de cada passo; as de passos anteriores ficam esmaecidas. */

const span = BP_AXIS.max - BP_AXIS.min;
const at = (v: number): string => `${((v - BP_AXIS.min) / span) * 100}%`;

const Row = ({ row, current }: { row: BpRow; current: boolean }) => {
    const reduce = useReducedMotion();
    const from = Math.min(0, row.value);
    const to = Math.max(0, row.value);
    return (
        <motion.div className="flex h-[38px] shrink-0 items-center transition-opacity duration-500" style={{ opacity: current ? 1 : 0.42 }}
            initial={reduce ? false : { opacity: 0, x: -10 }} animate={{ opacity: current ? 1 : 0.42, x: 0 }} transition={{ duration: 0.4 }}>
            <div className="w-[236px] shrink-0 leading-tight">
                <p className="m-0 text-[16px] font-semibold text-white">{row.label}</p>
                <p className="m-0 font-mono text-[14px] text-gray-400">{row.sub || ' '}</p>
            </div>
            <div className="relative h-full flex-1">
                {row.none ? (
                    <div className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2" style={{ left: at(0), borderColor: row.color }} />
                ) : (
                    <div className="absolute top-1/2 h-5 -translate-y-1/2 rounded-sm" style={{ left: at(from), width: `calc(${at(to)} - ${at(from)})`, background: row.color, boxShadow: current ? `0 0 14px ${row.color}77` : 'none' }} />
                )}
                {row.lo !== undefined && row.hi !== undefined && (
                    <div className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded bg-white" style={{ left: at(row.lo), width: `calc(${at(row.hi)} - ${at(row.lo)})` }} />
                )}
                <span className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[18px] font-semibold"
                    style={row.value < 0 || row.none ? { left: `calc(${at(Math.max(row.value, 0))} + ${row.none ? 14 : 10}px)`, color: row.color } : { right: `calc(100% - ${at(0)} + 10px)`, color: row.color }}>
                    {row.shown}
                </span>
            </div>
        </motion.div>
    );
};

export const BpChart = ({ step }: { step: number }) => {
    const rows = BP_ROWS.filter(r => r.step <= step);
    return (
        <div className="relative flex min-w-0 flex-1 flex-col justify-center rounded-2xl border border-white/10 p-4" style={{ background: 'rgba(10,6,14,0.74)' }}>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 z-0" style={{ left: `calc(236px + (100% - 236px) * ${(0 - BP_AXIS.min) / span})` }}>
                    <div className="h-full w-0 border-l-2 border-white/45" />
                </div>
                <div className="relative z-10 flex flex-col">
                    {rows.map(r => <Row key={r.id} row={r} current={r.step === step} />)}
                </div>
            </div>
            <div className="mt-1 flex h-9 shrink-0 border-t border-white/20">
                <p className="m-0 w-[236px] shrink-0 pt-1 font-mono text-[14px] leading-[1.15]" style={{ color: C.muted }}>mmHg · barra = efeito<br />linha branca = IC95%</p>
                <div className="relative flex-1">
                    {BP_AXIS.ticks.map(t => (
                        <span key={t} className="absolute top-1 -translate-x-1/2 font-mono text-[14px] text-gray-300" style={{ left: at(t) }}>{t > 0 ? `+${t}` : t < 0 ? `−${Math.abs(t)}` : t}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};
