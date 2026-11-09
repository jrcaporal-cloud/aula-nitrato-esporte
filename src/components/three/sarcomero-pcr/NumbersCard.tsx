import { useEffect, useRef } from 'react';
import { br } from '../../sims/kit/format';
import type { ClockRef } from './clock';
import { COL } from './colors';
import { STATS, STEP_TEXTS, type StatSpec } from './content';
import { dpcrAt, signals } from './kinetics';

/* Cartão de números do HUD: pares placebo → nitrato do dossiê; na etapa 1, ΔPCr e turnover de ATP ao vivo. */

const liveValue = (kind: 'dpcr' | 'atp', cond: 'placebo' | 'nitrate', t: number): string =>
    kind === 'dpcr' ? br(dpcrAt(cond, t), 1) : String(Math.round(signals(0, cond, 'II', t).atp));

const LiveRow = ({ stat, clockRef }: { stat: StatSpec; clockRef: ClockRef }) => {
    const p = useRef<HTMLSpanElement>(null);
    const n = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        let raf = 0;
        const kind = stat.live;
        // o DOM só é tocado quando o texto ou a opacidade mudam de fato (não a cada quadro)
        const last = { p: '', n: '', op: -1, on: -1 };
        const paint = () => {
            const c = clockRef.current;
            const pe = p.current, ne = n.current;
            if (kind && pe && ne) {
                const pv = liveValue(kind, 'placebo', c.t);
                const nv = liveValue(kind, 'nitrate', c.t);
                const op = Math.round((0.4 + 0.6 * c.dimP) * 100) / 100;
                const on = Math.round((0.4 + 0.6 * c.dimN) * 100) / 100;
                if (pv !== last.p) { pe.textContent = pv; last.p = pv; }
                if (nv !== last.n) { ne.textContent = nv; last.n = nv; }
                if (op !== last.op) { pe.style.opacity = String(op); last.op = op; }
                if (on !== last.on) { ne.style.opacity = String(on); last.on = on; }
            }
            raf = requestAnimationFrame(paint);
        };
        raf = requestAnimationFrame(paint);
        return () => cancelAnimationFrame(raf);
    }, [stat.live, clockRef]);
    return (
        <>
            <span ref={p} className="tabular-nums" style={{ color: COL.placebo }}>0</span>
            <span className="text-gray-400 mx-1.5">→</span>
            <span ref={n} className="tabular-nums" style={{ color: COL.nitrate }}>0</span>
        </>
    );
};

const Row = ({ stat, clockRef }: { stat: StatSpec; clockRef: ClockRef }) => (
    <div className="leading-tight">
        <div className="text-[14px] text-gray-300">{stat.label}</div>
        <div className="text-[19px] font-bold text-white">
            {stat.live ? <LiveRow stat={stat} clockRef={clockRef} /> : stat.from ? (
                <>
                    <span style={{ color: COL.placebo }}>{stat.from}</span>
                    <span className="text-gray-400 mx-1.5">→</span>
                    <span style={{ color: COL.nitrate }}>{stat.to}</span>
                </>
            ) : <span className="text-[17px]">{stat.text}</span>}
            {stat.unit && <span className="ml-1.5 text-[14px] font-medium text-gray-300">{stat.unit}</span>}
        </div>
    </div>
);

export const NumbersCard = ({ step, clockRef }: { step: number; clockRef: ClockRef }) => (
    <div className="shrink-0 w-[318px] rounded-2xl border border-white/10 px-4 py-3 flex flex-col justify-between" style={{ background: 'rgba(10,6,14,0.74)' }}>
        <p className="text-[14px] font-mono uppercase tracking-wider text-gray-400 truncate">{STEP_TEXTS[step].hudTitle}</p>
        {STATS[step].map(s => <Row key={`${step}-${s.label}`} stat={s} clockRef={clockRef} />)}
    </div>
);
