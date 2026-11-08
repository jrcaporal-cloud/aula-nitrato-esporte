import { C } from '../kit/palette';
import { CONDITIONS, type Cell } from './judoContent';

/**
 * Grade do dia de judô: colunas = as 5 lutas (cada uma um tatame), linhas = cafeína, suco, os dois.
 * Uma linha entra a cada passo; o cansaço acumulado é uma faixa ilustrativa sob os tatames.
 */

const FIGHTS = [1, 2, 3, 4, 5] as const;
const ROW_COLOR = { caf: C.hypoxia, bj: C.nitrate, both: C.no } as const;
const COLS = '200px repeat(5, 1fr)';

const Glyph = ({ cell, color, shown }: { cell: Cell; color: string; shown: boolean }) => {
    const base = 'flex size-[40px] items-center justify-center rounded-full font-mono text-[20px] font-bold transition-all duration-500';
    if (!shown) return <span className={base} style={{ border: '1px dashed rgba(255,255,255,0.12)', opacity: 0.6 }} />;
    if (cell === 'up') return <span className={base} style={{ background: `${color}33`, border: `2px solid ${color}`, color, boxShadow: `0 0 16px ${color}88` }}>▲</span>;
    if (cell === 'none') return <span className={base} style={{ border: `2px solid ${C.risk}`, color: C.risk }}>✕</span>;
    if (cell === 'unknown') return <span className={base} style={{ border: '1px dashed rgba(255,255,255,0.3)', color: C.muted }}>?</span>;
    return <span className={base} style={{ border: '1px solid rgba(255,255,255,0.15)', color: C.muted }}>·</span>;
};

const Mat = ({ n }: { n: number }) => (
    <div className="flex flex-col items-center gap-1">
        <div className="relative h-[40px] w-[84px] overflow-hidden rounded-lg border border-white/15"
            style={{ background: 'repeating-linear-gradient(90deg, rgba(163,230,53,0.20) 0 14px, rgba(163,230,53,0.10) 14px 28px)' }}>
            <div className="absolute inset-[6px] rounded border border-white/25" />
        </div>
        <span className="font-display text-[1.05rem] font-semibold text-white">Luta {n}</span>
    </div>
);

export const JudoMats = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col justify-between px-5 py-2.5">
        <div className="grid items-end gap-2" style={{ gridTemplateColumns: COLS }}>
            <span />
            {FIGHTS.map(n => <div key={n} className="flex justify-center"><Mat n={n} /></div>)}
        </div>
        <div className="grid items-center gap-2" style={{ gridTemplateColumns: COLS }}>
            <span className="text-[15px] leading-tight text-gray-300">cansaço (ilustrativo)</span>
            <div className="col-span-5 h-[12px] rounded-full" style={{ background: `linear-gradient(90deg, ${C.hypoxia}00, ${C.hypoxia}`, boxShadow: `0 0 14px ${C.hypoxia}55` }} />
        </div>
        {CONDITIONS.map(c => {
            const shown = step >= c.fromStep;
            const color = ROW_COLOR[c.id];
            return (
                <div key={c.id} className="grid items-center gap-2 rounded-xl px-1 py-0.5 transition-opacity duration-500"
                    style={{ gridTemplateColumns: COLS, opacity: shown ? 1 : 0.5, background: step === c.fromStep ? `${color}14` : 'transparent' }}>
                    <span className="font-display text-[1.15rem] font-semibold leading-tight" style={{ color }}>{c.name}</span>
                    {c.fights.map((cell, i) => (
                        <div key={i} className="flex justify-center"><Glyph cell={cell} color={color} shown={shown} /></div>
                    ))}
                </div>
            );
        })}
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 font-mono text-[15px] text-gray-300">
            <span><b style={{ color: C.no }}>▲</b> melhorou</span>
            <span><b style={{ color: C.risk }}>✕</b> não melhorou (dito no resumo)</span>
            <span><b>·</b> sem melhora relatada</span>
            <span><b>?</b> luta 4 não descrita</span>
            <span className="text-gray-400">· vs placebo · SJFT, neuromuscular, cognição</span>
        </div>
    </div>
);
