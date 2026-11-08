import { useEffect, useRef } from 'react';
import { C } from '../../sims/kit/palette';
import { hoursLabel } from './pk';
import type { VnStateRef } from './state';

/*
 * Faixa de baixo da cena: o relógio da dose (horas) e a régua dos picos (dossiê 01):
 * nitrato plasmático 1–2 h, nitrito plasmático 2–3 h, nitrato muscular 3 h. O cursor lê o quadro
 * por rAF e escreve direto no DOM (sem re-render por quadro).
 */

/** Régua em dois trechos: 0–4 h ocupa 62% da largura, 4–48 h o resto. */
const NEAR = 0.62;
const pos = (h: number) => (h <= 4 ? (h / 4) * NEAR : NEAR + ((Math.min(h, 48) - 4) / 44) * (1 - NEAR));

interface Lane { label: string; from: number; to: number; color: string; ring?: boolean }

const LANES: readonly Lane[] = [
    { label: 'Nitrato (NO₃⁻) no plasma · pico em 1–2 h', from: 1, to: 2, color: C.nitrate },
    { label: 'Nitrito (NO₂⁻) no plasma · pico em 2–3 h', from: 2, to: 3, color: C.nitrite },
    { label: 'Nitrato no músculo · pico em 3 h', from: 2.85, to: 3.15, color: C.nitrate, ring: true },
];
const TICKS: readonly number[] = [0, 1, 2, 3, 4, 24, 48];

export const Hud = ({ stateRef }: { stateRef: VnStateRef }) => {
    const cursor = useRef<HTMLDivElement>(null);
    const clock = useRef<HTMLSpanElement>(null);
    const lanes = useRef<(HTMLDivElement | null)[]>([]);
    const fills = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        let raf = 0;
        let last = '';
        const tick = () => {
            const h = stateRef.current.f.hours;
            const txt = hoursLabel(h);
            if (txt !== last) {
                last = txt;
                if (clock.current) clock.current.textContent = txt;
            }
            if (cursor.current) cursor.current.style.left = `${pos(h) * 100}%`;
            LANES.forEach((l, i) => {
                const el = lanes.current[i];
                if (el) el.style.opacity = h >= l.from - 0.05 && h <= l.to + 0.25 ? '1' : '0.5';
                const fill = fills.current[i];
                if (fill) fill.style.width = `${Math.min(Math.max((h - l.from) / (l.to - l.from), 0), 1) * 100}%`;
            });
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [stateRef]);

    return (
        <div className="flex items-stretch gap-5 rounded-2xl px-4 py-2.5 backdrop-blur-md" style={{ background: 'linear-gradient(180deg, rgba(22,12,30,0.88), rgba(10,6,14,0.9))', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 8px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
            <div className="shrink-0 flex flex-col justify-center w-[104px]">
                <span className="text-[14px] text-gray-400 leading-tight">Relógio da dose</span>
                <span ref={clock} className="font-mono text-[28px] font-semibold text-white leading-tight tabular-nums">0,0 h</span>
            </div>
            <div className="relative flex-1 min-w-0" style={{ height: 84 }}>
                {LANES.map((l, i) => (
                    <div key={l.label} ref={el => { lanes.current[i] = el; }} className="absolute left-0 right-0 flex items-center transition-opacity duration-300" style={{ top: i * 22, height: 20 }}>
                        <div className="absolute rounded-full overflow-hidden" style={{
                            left: `${pos(l.from) * 100}%`, width: `${(pos(l.to) - pos(l.from)) * 100}%`, height: l.ring ? 14 : 10, top: l.ring ? 3 : 5,
                            background: `${l.color}33`, border: l.ring ? `2px solid ${l.color}` : `1px solid ${l.color}88`, boxShadow: `0 0 12px ${l.color}66`,
                        }}>
                            <div ref={el => { fills.current[i] = el; }} className="h-full rounded-full" style={{ width: '0%', background: `linear-gradient(90deg, ${l.color}99, ${l.color})`, boxShadow: `0 0 8px ${l.color}` }} />
                        </div>
                        <span className="absolute whitespace-nowrap text-[14px] text-gray-200 leading-none" style={{ left: `calc(${pos(l.to) * 100}% + 10px)` }}>{l.label}</span>
                    </div>
                ))}
                <div className="absolute left-0 right-0 h-px bg-white/25" style={{ top: 68 }} />
                {TICKS.map(h => (
                    <div key={h} className="absolute" style={{ left: `${pos(h) * 100}%`, top: 66 }}>
                        <div className="w-px h-2 bg-white/40" />
                        <span className={`absolute top-2.5 whitespace-nowrap text-[14px] font-mono text-gray-400 leading-none ${h === 48 ? '-translate-x-full' : '-translate-x-1/2'}`}>{h}{h === 48 ? ' h' : ''}</span>
                    </div>
                ))}
                <div ref={cursor} className="absolute top-0 w-0.5 bg-white -translate-x-1/2" style={{ height: 70, boxShadow: '0 0 10px #fff, 0 0 22px rgba(240,67,126,0.7)' }}>
                    <span className="absolute -top-1 left-1/2 w-2.5 h-2.5 -translate-x-1/2 rounded-full bg-white" style={{ boxShadow: '0 0 10px #fff' }} />
                </div>
            </div>
        </div>
    );
};
