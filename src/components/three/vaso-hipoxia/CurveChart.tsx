import { useEffect, useRef } from 'react';
import { C } from '../../sims/kit/palette';
import { hbYield, nosActivity, sampleCurve } from './model';
import type { CtlRef } from './types';

/*
 * Gráfico do HUD: as duas curvas de NO sobrepostas (NOS × redução do nitrito pela Hb) e o ponto atual
 * dos controles. Onde a NOS cai, a redução sobe. As formas são ILUSTRATIVAS; só o pico em 40–60%
 * (HUANG2005) e o fator 5× do pH 6,6 (MODIN2001) são dados. Escrita direta no SVG por quadro.
 */

const W = 340;
const H = 152;
const X0 = 30;
const X1 = 330;
const Y0 = 26;
const Y1 = 102;

const px = (s: number) => X0 + s * (X1 - X0);
const py = (v: number) => Y1 - v * (Y1 - Y0);

const pathOf = (vals: readonly number[]) =>
    vals.map((v, i) => `${i ? 'L' : 'M'}${px(i / (vals.length - 1)).toFixed(1)},${py(v).toFixed(1)}`).join('');

const NOS_PATH = pathOf(sampleCurve(nosActivity));
const redPath = (ph: number) => pathOf(sampleCurve(s => hbYield(s, ph)));
const area = (d: string) => `${d}L${px(1)},${py(0)}L${px(0)},${py(0)}Z`;

export const CurveChart = ({ ctlRef }: { ctlRef: CtlRef }) => {
    const red = useRef<SVGGElement>(null);
    const redLegend = useRef<HTMLSpanElement>(null);
    const redPathEl = useRef<SVGPathElement>(null);
    const redArea = useRef<SVGPathElement>(null);
    const cursor = useRef<SVGLineElement>(null);
    const redDot = useRef<SVGCircleElement>(null);
    const nosDot = useRef<SVGCircleElement>(null);

    useEffect(() => {
        let raf = 0;
        let lastPh = Number.NaN;
        let lastSat = Number.NaN;
        let lastPhDot = Number.NaN;
        let lastShown = '';
        const tick = () => {
            const c = ctlRef.current;
            const phMoved = Number.isNaN(lastPh) || Math.abs(c.ph - lastPh) > 0.002;
            if (phMoved) {
                lastPh = c.ph;
                const d = redPath(c.ph);
                redPathEl.current?.setAttribute('d', d);
                redArea.current?.setAttribute('d', area(d));
            }
            // o DOM só é tocado quando o valor muda (em repouso, nada a escrever por quadro)
            if (c.sat !== lastSat || c.ph !== lastPhDot) {
                lastSat = c.sat;
                lastPhDot = c.ph;
                const x = px(c.sat).toFixed(1);
                cursor.current?.setAttribute('x1', x);
                cursor.current?.setAttribute('x2', x);
                nosDot.current?.setAttribute('cx', x);
                nosDot.current?.setAttribute('cy', py(nosActivity(c.sat)).toFixed(1));
                redDot.current?.setAttribute('cx', x);
                redDot.current?.setAttribute('cy', py(hbYield(c.sat, c.ph)).toFixed(1));
            }
            // a curva de redução só entra na história na 3ª etapa
            const shown = c.stage >= 2 ? '1' : '0';
            if (shown !== lastShown) {
                lastShown = shown;
                if (red.current) red.current.style.opacity = shown;
                if (redLegend.current) redLegend.current.style.opacity = shown;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [ctlRef]);

    return (
        <div className="w-[364px] rounded-xl border border-white/10 bg-[linear-gradient(160deg,rgba(24,14,34,0.94),rgba(8,5,12,0.94))] shadow-[0_10px_40px_rgba(0,0,0,0.5)] px-3 pt-2.5 pb-2" role="img"
            aria-label="Gráfico: produção de NO pela NOS e pela redução do nitrito, em função da saturação de O₂">
            <div className="flex items-center gap-4 text-[14px] font-semibold text-gray-100">
                <span className="flex items-center gap-1.5"><i className="w-3 h-1 rounded" style={{ background: C.o2 }} />NOS</span>
                <span ref={redLegend} className="flex items-center gap-1.5 transition-opacity duration-500" style={{ opacity: 0 }}>
                    <i className="w-3 h-1 rounded" style={{ background: C.nitrite }} />Redução do nitrito
                </span>
            </div>
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block mt-0.5">
                <rect x={px(0.4)} y={Y0 - 6} width={px(0.6) - px(0.4)} height={Y1 - Y0 + 6} fill={`${C.nitrite}22`} stroke={`${C.nitrite}66`} />
                <text x={(px(0.4) + px(0.6)) / 2} y={Y0 - 10} textAnchor="middle" fontSize={14} fontWeight={600} fill={C.nitrite}>40–60%</text>
                <line x1={X0} y1={Y1} x2={X1} y2={Y1} stroke="#6B7280" />
                <line x1={X0} y1={Y0 - 6} x2={X0} y2={Y1} stroke="#6B7280" />
                <text x={X0 - 6} y={Y0 + 4} textAnchor="end" fontSize={14} fill="#9CA3AF">NO</text>
                {[0, 0.5, 1].map(s => (
                    <text key={s} x={px(s)} y={Y1 + 18} textAnchor={s === 0 ? 'start' : s === 1 ? 'end' : 'middle'} fontSize={14} fill="#9CA3AF">{s * 100}</text>
                ))}
                <text x={(X0 + X1) / 2} y={Y1 + 36} textAnchor="middle" fontSize={14} fill="#D1D5DB">saturação de O₂ da Hb (%)</text>
                <defs>
                    <linearGradient id="vaso-nos-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.o2} stopOpacity={0.32} /><stop offset="1" stopColor={C.o2} stopOpacity={0} /></linearGradient>
                    <linearGradient id="vaso-red-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.nitrite} stopOpacity={0.38} /><stop offset="1" stopColor={C.nitrite} stopOpacity={0} /></linearGradient>
                    <filter id="vaso-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" /></filter>
                </defs>
                <line ref={cursor} x1={px(1)} x2={px(1)} y1={Y0 - 6} y2={Y1} stroke="#E5E7EB" strokeOpacity={0.35} strokeDasharray="3 4" />
                <path d={area(NOS_PATH)} fill="url(#vaso-nos-fill)" />
                <path d={NOS_PATH} fill="none" stroke={C.o2} strokeWidth={5} strokeOpacity={0.35} filter="url(#vaso-glow)" />
                <path d={NOS_PATH} fill="none" stroke={C.o2} strokeWidth={2.6} strokeLinejoin="round" />
                <g ref={red} className="transition-opacity duration-500" style={{ opacity: 0 }}>
                    <path ref={redArea} d={area(redPath(7.4))} fill="url(#vaso-red-fill)" />
                    <path ref={redPathEl} d={redPath(7.4)} fill="none" stroke={C.nitrite} strokeWidth={2.6} strokeLinejoin="round" />
                    <circle ref={redDot} r={5.5} fill={C.nitrite} stroke="#fff" strokeWidth={1.8} cx={px(1)} cy={py(0)} />
                </g>
                <circle ref={nosDot} r={5.5} fill={C.o2} stroke="#fff" strokeWidth={1.8} cx={px(1)} cy={py(1)} />
            </svg>
            <p className="text-[14px] text-gray-400 leading-snug">curvas ilustrativas · pico em 40–60% (Huang 2005)</p>
        </div>
    );
};
