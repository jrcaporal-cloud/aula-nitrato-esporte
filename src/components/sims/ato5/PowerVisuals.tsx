import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { br } from '../kit/format';
import { SvgText } from '../kit/ui';
import { FILTER_STUDIES, MBI_ERRORS, NULL_P_VALUES, powerAt } from './powerModel';
import { VIS_H, VIS_W } from './ui';

/** Desenhos do StatPowerSim. Caixa 672 × 440. */

const Dots100 = ({ x0, y0, hot, color, label, sub }: { x0: number; y0: number; hot: number; color: string; label: string; sub: string }) => (
    <g>
        {Array.from({ length: 100 }, (_, i) => {
            const on = i < hot;
            return <circle key={i} cx={x0 + (i % 10) * 17 + 8} cy={y0 + Math.floor(i / 10) * 17 + 8} r={6} fill={on ? color : C.placebo} fillOpacity={on ? 1 : 0.28}
                stroke={on ? '#fff' : 'none'} strokeWidth={1} />;
        })}
        <SvgText x={x0 + 85} y={y0 + 196} text={label} anchor="middle" size={20} color={color} weight={700} />
        <SvgText x={x0 + 85} y={y0 + 218} text={sub} anchor="middle" size={16} color={C.muted} weight={500} />
    </g>
);

/** Passo 1: dez atletas e duas listas de 100 artigos. */
export const TypicalStudy = () => (
    <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="n mediano de 10, 15% com cálculo de amostra, 14% com desfecho primário">
        <SvgText x={VIS_W / 2} y={28} text="O grupo típico" anchor="middle" size={18} color="#fff" weight={700} />
        {Array.from({ length: 10 }, (_, i) => (
            <motion.g key={i} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 * i }}>
                <circle cx={96 + i * 53} cy={62} r={11} fill={C.nitrateSoft} />
                <path d={`M${96 + i * 53 - 14} 96 Q${96 + i * 53} 70 ${96 + i * 53 + 14} 96 Z`} fill={C.nitrate} fillOpacity={0.85} />
            </motion.g>
        ))}
        <SvgText x={VIS_W / 2} y={120} text="n mediano = 10 por grupo (IQR 8 a 15)" anchor="middle" size={18} color={C.nitrateSoft} weight={700} />
        <line x1={14} x2={VIS_W - 14} y1={138} y2={138} stroke="rgba(255,255,255,0.12)" />
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}>
            <Dots100 x0={58} y0={152} hot={15} color={C.no} label="15 em 100" sub="calcularam a amostra" />
            <Dots100 x0={394} y0={152} hot={14} color={C.nitrite} label="14 em 100" sub="declararam desfecho primário" />
        </motion.g>
    </svg>
);

/** Passo 2: 30 testes sem efeito algum; os que caem abaixo de 0,05 acendem. */
export const ThirtyTests = () => {
    const hits = NULL_P_VALUES.filter(p => p < 0.05).length;
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Trinta valores p de testes sem efeito real">
            <SvgText x={VIS_W / 2} y={28} text="30 testes, nenhum efeito real" anchor="middle" size={18} color="#fff" weight={700} />
            {NULL_P_VALUES.map((p, i) => {
                const hit = p < 0.05;
                const x = 14 + (i % 6) * 108;
                const y = 48 + Math.floor(i / 6) * 50;
                return (
                    <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.03 * i }}>
                        <rect x={x} y={y} width={100} height={42} rx={9} fill={hit ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.04)'}
                            stroke={hit ? C.nitrite : 'rgba(255,255,255,0.12)'} strokeWidth={hit ? 2.5 : 1} />
                        <SvgText x={x + 50} y={y + 27} text={`p = ${br(p, 2)}`} anchor="middle" size={17} color={hit ? C.nitriteSoft : C.muted} weight={hit ? 700 : 500} />
                    </motion.g>
                );
            })}
            <SvgText x={14} y={338} text={`${hits} “achados” sem efeito algum`} size={20} color={C.nitrite} weight={700} />
            <rect x={14} y={360} width={VIS_W - 28} height={22} rx={11} fill="rgba(255,255,255,0.08)" />
            <motion.rect x={14} y={360} height={22} rx={11} fill={C.nitrite} fillOpacity={0.9} initial={{ width: 0 }} animate={{ width: (VIS_W - 28) * 0.785 }} transition={{ delay: 1.2, duration: 0.9 }} />
            <SvgText x={14} y={412} text="chance de pelo menos 1 achado em 30 testes: 79% (cálculo)" size={18} color="#fff" weight={700} />
        </svg>
    );
};

const EFFECT_CURVES = [1, 2, 3] as const;
const CURVE_COLORS: Record<number, string> = { 1: C.nitrate, 2: C.nitrite, 3: C.no };

interface PowerChartProps { effect: number; n: number }

/** Passos 3 e 4: curva de poder × n, com o marcador de n e a linha de 80%. */
export const PowerChart = ({ effect, n }: PowerChartProps) => {
    const x0 = 70;
    const x1 = 640;
    const yTop = 70;
    const yBase = 330;
    const sx = (v: number) => x0 + (v / 200) * (x1 - x0);
    const sy = (p: number) => yBase - p * (yBase - yTop);
    const path = (e: number) => Array.from({ length: 99 }, (_, i) => {
        const nn = 4 + i * 2;
        return `${i === 0 ? 'M' : 'L'}${sx(nn).toFixed(1)} ${sy(powerAt(nn, e)).toFixed(1)}`;
    }).join(' ');
    const p = powerAt(n, effect);
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Poder em função do número de atletas">
            <SvgText x={VIS_W / 2} y={28} text="Poder de detectar o efeito, 1 teste por braço" anchor="middle" size={18} color="#fff" weight={700} />
            {[0, 0.25, 0.5, 0.75, 1].map(t => (
                <g key={t}>
                    <line x1={x0} x2={x1} y1={sy(t)} y2={sy(t)} stroke="rgba(255,255,255,0.08)" />
                    <SvgText x={x0 - 10} y={sy(t) + 6} text={`${Math.round(t * 100)}%`} anchor="end" size={16} color={C.muted} weight={500} />
                </g>
            ))}
            {[0, 50, 100, 150, 200].map(t => <SvgText key={t} x={sx(t)} y={yBase + 26} text={String(t)} anchor="middle" size={16} color={C.muted} weight={500} />)}
            <SvgText x={(x0 + x1) / 2} y={yBase + 52} text="atletas (cruzado)" anchor="middle" size={16} color={C.muted} weight={500} />
            <line x1={x0} x2={x1} y1={sy(0.8)} y2={sy(0.8)} stroke={C.noSoft} strokeDasharray="7 5" strokeWidth={2} />
            <SvgText x={330} y={sy(0.8) - 8} text="80% de poder" size={16} color={C.noSoft} weight={700} />
            <SvgText x={x0} y={56} text="efeito real:" size={16} color={C.muted} weight={500} />
            {EFFECT_CURVES.map((e, i) => <SvgText key={e} x={x0 + 94 + i * 56} y={56} text={`${e}%`} size={17} color={CURVE_COLORS[e]} weight={700} />)}
            {EFFECT_CURVES.map(e => (
                <g key={e}>
                    <path d={path(e)} fill="none" stroke={CURVE_COLORS[e]} strokeWidth={e === effect ? 4 : 2} strokeOpacity={e === effect ? 1 : 0.35} />
                </g>
            ))}
            <line x1={sx(n)} x2={sx(n)} y1={sy(p)} y2={yBase} stroke="#fff" strokeDasharray="4 4" />
            <line x1={x0} x2={sx(n)} y1={sy(p)} y2={sy(p)} stroke="#fff" strokeDasharray="4 4" strokeOpacity={0.5} />
            <circle cx={sx(n)} cy={sy(p)} r={9} fill={CURVE_COLORS[effect]} stroke="#fff" strokeWidth={2.5} />
            <rect x={Math.min(sx(n) + 16, x1 - 150)} y={Math.max(sy(p) - 62, yTop - 8)} width={150} height={44} rx={10} fill="#07050B" stroke={CURVE_COLORS[effect]} />
            <SvgText x={Math.min(sx(n) + 16, x1 - 150) + 75} y={Math.max(sy(p) - 62, yTop - 8) + 20} text={`n = ${Math.round(n)}`} anchor="middle" size={16} color={C.muted} weight={600} />
            <SvgText x={Math.min(sx(n) + 16, x1 - 150) + 75} y={Math.max(sy(p) - 62, yTop - 8) + 39} text={`poder ${Math.round(p * 100)}%`} anchor="middle" size={18} color="#fff" weight={700} />
        </svg>
    );
};

/** Passo 5: 100 réplicas do mesmo estudo (n = 10, efeito real 1%). */
export const FilterDots = () => {
    const x0 = 60;
    const x1 = 640;
    const sx = (v: number) => x0 + ((v + 6) / 16) * (x1 - x0);
    const sy = (se: number) => 70 + (se / 2.4) * 250;
    const sig = FILTER_STUDIES.filter(s => s.significant);
    const meanSig = sig.reduce((a, s) => a + s.effect, 0) / Math.max(sig.length, 1);
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Cem réplicas do mesmo estudo com n = 10">
            <SvgText x={VIS_W / 2} y={28} text="100 réplicas: 10 atletas, efeito real = 1%" anchor="middle" size={18} color="#fff" weight={700} />
            {[-4, 0, 4, 8, 10].map(t => (
                <g key={t}>
                    <line x1={sx(t)} x2={sx(t)} y1={56} y2={332} stroke="rgba(255,255,255,0.07)" />
                    <SvgText x={sx(t)} y={356} text={t === 0 ? '0' : t > 0 ? `+${t}%` : `−${-t}%`} anchor="middle" size={16} color={C.muted} weight={500} />
                </g>
            ))}
            <line x1={sx(1)} x2={sx(1)} y1={56} y2={332} stroke={C.no} strokeWidth={2.5} strokeDasharray="6 5" />
            <SvgText x={sx(1) - 8} y={72} text="efeito real: 1%" anchor="end" size={16} color={C.noSoft} weight={700} />
            {FILTER_STUDIES.map(s => (
                <motion.circle key={s.id} cx={sx(Math.max(Math.min(s.effect, 9.6), -5.6))} cy={sy(Math.min(s.se, 2.35))} r={s.significant ? 8 : 6}
                    fill={s.significant ? C.nitrite : C.placebo} fillOpacity={s.significant ? 1 : 0.45} stroke={s.significant ? '#fff' : 'none'} strokeWidth={1.5}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.008 * s.id }} />
            ))}
            <SvgText x={14} y={VIS_H - 52} text="mais preciso ↑   menos preciso ↓ (erro padrão)" size={16} color={C.muted} weight={500} />
            <rect x={14} y={VIS_H - 40} width={VIS_W - 28} height={32} rx={10} fill="rgba(251,191,36,0.1)" stroke={C.nitrite} strokeOpacity={0.6} />
            <SvgText x={VIS_W / 2} y={VIS_H - 18} text={`${sig.length} com p < 0,05: média ${br(meanSig, 1)}% (${br(meanSig, 0)}× o efeito real)`} anchor="middle" size={18} color={C.nitriteSoft} weight={700} />
        </svg>
    );
};

/** Passo 6: erro tipo I da MBI contra os 5% nominais. */
export const MbiBars = () => {
    const x0 = 60;
    const sx = (v: number) => x0 + (v / 50) * 560;
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Erro tipo I da inferência baseada em magnitude">
            <SvgText x={VIS_W / 2} y={30} text="Falso positivo com 8 a 15 atletas por grupo" anchor="middle" size={18} color="#fff" weight={700} />
            {[0, 10, 20, 30, 40, 50].map(t => (
                <g key={t}>
                    <line x1={sx(t)} x2={sx(t)} y1={70} y2={330} stroke="rgba(255,255,255,0.07)" />
                    <SvgText x={sx(t)} y={354} text={`${t}%`} anchor="middle" size={16} color={C.muted} weight={500} />
                </g>
            ))}
            <line x1={sx(5)} x2={sx(5)} y1={62} y2={330} stroke={C.noSoft} strokeWidth={3} strokeDasharray="7 5" />
            <SvgText x={sx(5) + 10} y={86} text="5% nominal" size={17} color={C.noSoft} weight={700} />
            {MBI_ERRORS.map((m, i) => {
                const y = 150 + i * 92;
                return (
                    <motion.g key={m.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 * i + 0.2, duration: 0.5 }}>
                        <SvgText x={x0} y={y - 18} text={m.label} size={18} color="#E5E7EB" weight={700} />
                        <rect x={sx(m.lo)} y={y - 4} width={sx(m.hi) - sx(m.lo)} height={34} rx={10} fill={C.risk} fillOpacity={0.85} />
                        <SvgText x={sx(m.hi) + 12} y={y + 22} text={`${m.lo} a ${m.hi}%`} size={20} color={C.risk} weight={700} />
                    </motion.g>
                );
            })}
            <SvgText x={VIS_W / 2} y={VIS_H - 22} text="erro tipo I de 12 a 22% e de 22 a 45%, contra 5% do teste nulo" anchor="middle" size={16} color={C.muted} weight={500} />
        </svg>
    );
};

