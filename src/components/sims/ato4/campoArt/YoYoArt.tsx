import { useEffect, useRef } from 'react';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import type { YoYoRun } from '../teamContent';
import { Cone, Turf } from './Pitch';

/**
 * Passos 2 e 3 — o Yo-Yo IR1 no gramado: dois jogadores fazem o vaivém de 20 m até "esgotar"; o placar soma os metros.
 * O ritmo da animação é ilustrativo; os totais (e a diferença, em cálculo) são os do artigo. viewBox 720 × 448.
 */

const X0 = 96;
const X1 = 560;
const LANES = [{ y: 112, key: 'placebo' }, { y: 188, key: 'nitrate' }] as const;
const DURATION = 4200;
const EASE = 1.35;
const BAR0 = 40;
const BAR1 = 400;
const BAR_MAX = 1800;

const metros = (m: number) => `${Math.round(m).toLocaleString('pt-BR')} m`;
/** Posição no corredor depois de correr d metros (cada perna do vaivém vale 20 m no desenho). */
const laneX = (d: number) => {
    const s = d / 20;
    const leg = Math.floor(s);
    const f = s - leg;
    return X0 + (leg % 2 === 0 ? f : 1 - f) * (X1 - X0);
};
const barW = (m: number) => (m / BAR_MAX) * (BAR1 - BAR0);

interface Props {
    run: YoYoRun;
    dose: string;
    reduce: boolean;
}

export const YoYoArt = ({ run, dose, reduce }: Props) => {
    const dots = useRef<(SVGCircleElement | null)[]>([]);
    const counts = useRef<(SVGTextElement | null)[]>([]);
    const bars = useRef<(SVGRectElement | null)[]>([]);

    useEffect(() => {
        const finals = [run.placebo, run.nitrate];
        const paint = (k: number) => {
            const shared = run.nitrate * Math.pow(k, EASE);
            finals.forEach((fin, i) => {
                const d = Math.min(shared, fin);
                const done = shared >= fin;
                dots.current[i]?.setAttribute('cx', laneX(d).toFixed(1));
                dots.current[i]?.setAttribute('opacity', done && i === 0 && k < 1 ? '0.55' : '1');
                const c = counts.current[i];
                if (c) c.textContent = metros(d);
                bars.current[i]?.setAttribute('width', barW(d).toFixed(1));
            });
        };
        if (reduce) {
            paint(1);
            return;
        }
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
            const k = Math.min(Math.max((now - start) / DURATION, 0), 1);
            paint(k);
            if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [run, reduce]);

    const colors = [C.placebo, C.nitrate];
    const names = ['Placebo (suco sem nitrato)', 'Suco de beterraba'];
    return (
        <svg viewBox="0 0 720 448" width="100%" height="100%" role="img" aria-label={`Yo-Yo IR1: ${run.title}`}>
            <SvgText x={24} y={32} text={`Yo-Yo IR1 · ${run.title}`} size={18} weight={700} color="#E5E7EB" />
            <SvgText x={696} y={32} text={dose} size={16} weight={600} anchor="end" color={C.nitrateSoft} />
            <Turf x={24} y={50} w={672} h={184} band={56} id="yoyo-turf" />
            <SvgText x={(X0 + X1) / 2} y={76} text="ida e volta, em ritmo crescente (esquema)" size={16} weight={600} anchor="middle" color="#D1FAE5" />
            <line x1={X0} x2={X0} y1={60} y2={226} stroke="#fff" strokeOpacity={0.5} strokeWidth={2} />
            <line x1={X1} x2={X1} y1={60} y2={226} stroke="#fff" strokeOpacity={0.5} strokeWidth={2} />
            {LANES.map((l, i) => (
                <g key={l.key}>
                    <line x1={X0} x2={X1} y1={l.y} y2={l.y} stroke={colors[i]} strokeOpacity={0.35} strokeWidth={2} strokeDasharray="2 8" />
                    <Cone x={X0} y={l.y - 2} s={0.9} />
                    <Cone x={X1} y={l.y - 2} s={0.9} />
                    <circle ref={el => { dots.current[i] = el; }} cx={X0} cy={l.y} r={13} fill={colors[i]} stroke="#fff" strokeWidth={2.5}
                        style={{ filter: `drop-shadow(0 0 8px ${colors[i]})` }} />
                    <SvgText x={X1 + 26} y={l.y + 6} text={i === 0 ? 'placebo' : 'beterraba'} size={17} weight={700} color={i === 0 ? '#CBD5E1' : C.nitrateSoft} />
                </g>
            ))}
            {[0, 1].map(i => {
                const y = 262 + i * 70;
                return (
                    <g key={i}>
                        <rect x={24} y={y} width={400} height={60} rx={10} fill="#05080A" stroke={`${colors[i]}88`} />
                        <SvgText x={BAR0} y={y + 22} text={names[i]} size={16} weight={600} color={i === 0 ? '#CBD5E1' : C.nitrateSoft} />
                        <rect x={BAR0} y={y + 34} width={BAR1 - BAR0} height={14} rx={7} fill="rgba(255,255,255,0.06)" />
                        <rect ref={el => { bars.current[i] = el; }} x={BAR0} y={y + 34} width={0} height={14} rx={7} fill={colors[i]} />
                        <text ref={el => { counts.current[i] = el; }} x={412} y={y + 24} textAnchor="end" fontSize={24} fontWeight={700} fill="#fff"
                            style={{ fontFamily: 'var(--font-mono)' }}>0 m</text>
                    </g>
                );
            })}
            <line x1={BAR0 + barW(run.placebo)} x2={BAR0 + barW(run.placebo)} y1={290} y2={386} stroke="#CBD5E1" strokeDasharray="3 4" />
            <SvgText x={24} y={420} text={`+${run.gap} m (cálculo): a diferença no fim do teste`} size={16} weight={600} color="#fff" />
            <text x={566} y={330} textAnchor="middle" fontSize={78} fontWeight={700} fill={C.nitrateSoft} style={{ fontFamily: 'var(--font-display)' }}>{run.delta}</text>
            <SvgText x={566} y={362} text="distância total," size={16} weight={500} anchor="middle" color={C.muted} />
            <SvgText x={566} y={384} text="beterraba vs placebo" size={16} weight={500} anchor="middle" color={C.muted} />
        </svg>
    );
};
