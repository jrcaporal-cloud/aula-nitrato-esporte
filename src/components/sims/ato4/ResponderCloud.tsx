import { useState } from 'react';
import { br, signed } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { useEntered } from './hooks';
import { RESPONDERS } from './velocityContent';

/**
 * Nuvem de 20 respondedores: cada ponto é uma pessoa, posição = variação da potência máxima,
 * cor = aumento de nitrito (âmbar = mais). viewBox 720 × 448.
 */

const X0 = 50;
const X1 = 690;
const LO = -15;
const HI = 30;
const px = (pct: number) => X0 + ((pct - LO) / (HI - LO)) * (X1 - X0);
const BASE = 330;
const R = 12;
const MEAN = 4.4;

const mix = (t: number): string => {
    // ardósia (#64748B) → âmbar (#FBBF24)
    const a = [100, 116, 139];
    const b = [251, 191, 36];
    return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;
};

interface Dot { value: number; rank: number; x: number; y: number }

/** Posição empilhada (sem sobreposição) de cada ponto sobre o eixo. */
const layout = (): readonly Dot[] => {
    const placed: Dot[] = [];
    [...RESPONDERS].sort((a, b) => a[0] - b[0]).forEach(([value, rank]) => {
        const x = px(value);
        let lift = 0;
        while (placed.some(p => Math.hypot(p.x - x, p.y - (BASE - R - 4 - lift)) < 2 * R + 2)) lift += 4;
        placed.push({ value, rank, x, y: BASE - R - 4 - lift });
    });
    return placed;
};

const DOTS = layout();

export const ResponderCloud = ({ reduce }: { reduce: boolean }) => {
    const entered = useEntered(reduce);
    const [hover, setHover] = useState<number | null>(null);
    const dots = DOTS;
    const lowest = dots[0];
    const highest = dots[dots.length - 1];
    return (
        <svg viewBox="0 0 720 448" width="100%" height="100%" role="img" aria-label="Variação individual da potência máxima em 20 pessoas">
            <SvgText x={X0} y={34} text="Variação da potência máxima, por pessoa (n = 20)" size={18} weight={700} color="#E5E7EB" />
            <rect x={X0} y={52} width={px(0) - X0} height={BASE - 52} fill={C.risk} fillOpacity={0.06} />
            <rect x={px(0)} y={52} width={X1 - px(0)} height={BASE - 52} fill={C.no} fillOpacity={0.05} />
            <line x1={px(0)} x2={px(0)} y1={52} y2={BASE + 8} stroke="rgba(255,255,255,0.5)" strokeDasharray="5 5" />
            <SvgText x={px(0) - 8} y={72} text="← piora" size={16} weight={500} color={C.muted} anchor="end" />
            <SvgText x={px(0) + 8} y={72} text="melhora →" size={16} weight={500} color={C.muted} />
            <line x1={X0} x2={X1} y1={BASE} y2={BASE} stroke="rgba(255,255,255,0.3)" />
            {[-10, 0, 10, 20, 30].map(t => (
                <g key={t}>
                    <line x1={px(t)} x2={px(t)} y1={BASE} y2={BASE + 8} stroke="rgba(255,255,255,0.4)" />
                    <SvgText x={px(t)} y={BASE + 30} text={t === 0 ? '0%' : `${signed(t)}%`} size={16} weight={500} color={C.muted} anchor="middle" />
                </g>
            ))}
            <line x1={px(MEAN)} x2={px(MEAN)} y1={96} y2={BASE} stroke={C.no} strokeWidth={3} />
            <SvgText x={px(MEAN) + 10} y={112} text={`média ${signed(MEAN, 1)}%`} size={18} weight={700} color={C.noSoft} />
            {dots.map((d, i) => (
                <circle key={i} cx={d.x} cy={d.y} r={R} fill={mix(d.rank)} stroke="#fff" strokeOpacity={hover === i ? 1 : 0.55} strokeWidth={hover === i ? 3 : 1.5}
                    style={{ transform: `translateY(${entered ? 0 : -60}px)`, opacity: entered ? 1 : 0, transition: `transform 0.7s cubic-bezier(0.3, 1.3, 0.5, 1) ${i * 0.04}s, opacity 0.4s ease ${i * 0.04}s`, cursor: 'pointer' }}
                    onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
            ))}
            <SvgText x={lowest.x + 4} y={lowest.y - 20} text={`−${br(9.6, 1)}%`} size={18} weight={700} color={C.risk} anchor="middle" />
            <SvgText x={highest.x} y={highest.y - 20} text={`+${br(26.8, 1)}%`} size={18} weight={700} color={C.nitriteSoft} anchor="middle" />
            {hover !== null && <SvgText x={dots[hover].x} y={dots[hover].y - 20} text={`${signed(dots[hover].value, 1)}%`} size={17} weight={700} color="#fff" anchor="middle" />}
            <defs>
                <linearGradient id="nit-scale" x1="0" x2="1">
                    <stop offset="0%" stopColor={mix(0)} />
                    <stop offset="100%" stopColor={mix(1)} />
                </linearGradient>
            </defs>
            <rect x={X0} y={398} width={180} height={12} rx={6} fill="url(#nit-scale)" />
            <SvgText x={X0 + 192} y={410} text="menor → maior aumento de nitrito plasmático" size={16} weight={500} color="#CBD5E1" />
        </svg>
    );
};
