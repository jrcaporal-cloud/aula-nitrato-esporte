import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { br, signed } from '../kit/format';
import { SvgText } from '../kit/ui';
import { RESPONDER_CUT, TRUE_MEAN } from './responderModel';
import { VIS_H, VIS_W } from './ui';

/** Desenhos do ResponderSim. Caixa 672 × 440. */

const toneOf = (v: number, colored: boolean): string => {
    if (!colored) return C.nitrate;
    if (v > RESPONDER_CUT) return C.no;
    if (v < 0) return C.risk;
    return C.placebo;
};

interface BarsProps {
    values: readonly number[];
    colored: boolean;
    x0: number;
    width: number;
    top: number;
    height: number;
    lo: number;
    hi: number;
    headR?: number;
    ticks?: readonly number[];
    showTicks?: boolean;
}

/** Doze bonecos-barra: a barra vai de 0 até a mudança; a cabeça fica na ponta. */
const PersonBars = ({ values, colored, x0, width, top, height, lo, hi, headR = 10, ticks = [-10, 0, 10, 20, 30], showTicks = true }: BarsProps) => {
    const y = (v: number) => top + ((hi - v) / (hi - lo)) * height;
    const slot = width / values.length;
    return (
        <g>
            {showTicks && ticks.filter(t => t >= lo && t <= hi).map(t => (
                <g key={t}>
                    <line x1={x0} x2={x0 + width} y1={y(t)} y2={y(t)} stroke={t === 0 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.07)'} />
                    <SvgText x={x0 - 8} y={y(t) + 6} text={t === 0 ? '0' : `${signed(t, 0)}%`} anchor="end" size={16} color={C.muted} weight={500} />
                </g>
            ))}
            {values.map((v, i) => {
                const cx = x0 + slot * i + slot / 2;
                const color = toneOf(v, colored);
                const y0 = y(0);
                const yv = y(v);
                const headY = v >= 0 ? yv - headR - 2 : yv + headR + 2;
                return (
                    <g key={i}>
                        <rect x={cx - slot * 0.3} y={Math.min(y0, yv)} width={slot * 0.6} height={Math.max(Math.abs(yv - y0), 2)} rx={3} fill={color} fillOpacity={0.85} />
                        <circle cx={cx} cy={headY} r={headR} fill={color} stroke="#fff" strokeWidth={1.5} />
                    </g>
                );
            })}
        </g>
    );
};

interface OneWorldProps {
    values: readonly number[];
    colored: boolean;
    title: string;
    sub: string;
    stats?: { above: number; below: number; min: number; max: number } | null;
    showLiterature?: boolean;
}

/** Passos 1, 2 e 5: um único gráfico de barras individuais. */
export const OneWorld = ({ values, colored, title, sub, stats, showLiterature = false }: OneWorldProps) => {
    const lo = -16;
    const hi = 32;
    const top = 84;
    const height = 270;
    const y = (v: number) => top + ((hi - v) / (hi - lo)) * height;
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Mudança individual de 12 atletas">
            <SvgText x={VIS_W / 2} y={30} text={title} anchor="middle" size={19} color="#fff" weight={700} />
            <SvgText x={VIS_W / 2} y={54} text={sub} anchor="middle" size={16} color={C.muted} weight={500} />
            <PersonBars values={values} colored={colored} x0={64} width={560} top={top} height={height} lo={lo} hi={hi} />
            <line x1={64} x2={624} y1={y(TRUE_MEAN)} y2={y(TRUE_MEAN)} stroke={C.nitrite} strokeWidth={2} strokeDasharray="6 5" />
            <SvgText x={70} y={y(TRUE_MEAN) - 8} text="verdade +4,4%" size={16} color={C.nitrite} weight={700} />
            {showLiterature && [-9.6, 26.8].map(v => (
                <g key={v}>
                    <line x1={64} x2={624} y1={y(v)} y2={y(v)} stroke={C.nitriteSoft} strokeOpacity={0.55} strokeDasharray="2 6" strokeWidth={2} />
                    <SvgText x={628} y={y(v) + (v < 0 ? 20 : -6)} text={`Coggan: ${signed(v, 1)}%`} anchor="end" size={16} color={C.nitriteSoft} weight={600} />
                </g>
            ))}
            {stats && (
                <g>
                    <circle cx={30} cy={VIS_H - 26} r={8} fill={C.no} />
                    <SvgText x={46} y={VIS_H - 20} text={`${stats.above} “respondedores” (> +${RESPONDER_CUT}%)`} size={16} color={C.noSoft} weight={700} />
                    <circle cx={330} cy={VIS_H - 26} r={8} fill={C.risk} />
                    <SvgText x={346} y={VIS_H - 20} text={`${stats.below} “não respondedores” (< 0)`} size={16} color={C.risk} weight={700} />
                </g>
            )}
        </svg>
    );
};

interface WorldPanelProps {
    x0: number;
    title: string;
    tone: string;
    supp: readonly number[];
    plac?: readonly number[];
    revealed: boolean;
    sdSupp: number;
    sdPlac: number;
    sdTrue: number;
}

const WorldPanel = ({ x0, title, tone, supp, plac, revealed, sdSupp, sdPlac, sdTrue }: WorldPanelProps) => (
    <g>
        <rect x={x0} y={12} width={322} height={416} rx={14} fill="rgba(255,255,255,0.03)" stroke={tone} strokeOpacity={0.5} />
        <SvgText x={x0 + 161} y={42} text={title} anchor="middle" size={19} color={tone} weight={700} />
        <SvgText x={x0 + 14} y={76} text={revealed ? 'braço ativo (suplemento)' : 'mudança com o suplemento'} size={16} color="#E5E7EB" weight={600} />
        <PersonBars values={supp} colored={false} x0={x0 + 34} width={274} top={92} height={revealed ? 104 : 250} lo={-16} hi={32} headR={5} ticks={[0]} showTicks={false} />
        {revealed && plac && (
            <g>
                <SvgText x={x0 + 14} y={226} text="braço placebo (efeito real zero)" size={16} color="#E5E7EB" weight={600} />
                <PersonBars values={plac} colored={false} x0={x0 + 34} width={274} top={242} height={104} lo={-16} hi={32} headR={5} ticks={[0]} showTicks={false} />
                <line x1={x0 + 14} x2={x0 + 308} y1={354} y2={354} stroke="rgba(255,255,255,0.15)" />
                <SvgText x={x0 + 14} y={378} text="DP das mudanças" size={16} color={C.muted} weight={500} />
                <SvgText x={x0 + 308} y={378} text={`${br(sdSupp, 1)} × ${br(sdPlac, 1)}`} anchor="end" size={19} color="#fff" weight={700} />
                <SvgText x={x0 + 14} y={408} text="DP da resposta verdadeira" size={16} color={C.muted} weight={500} />
                <SvgText x={x0 + 308} y={408} text={`${br(sdTrue, 1)}%`} anchor="end" size={22} color={tone} weight={700} />
            </g>
        )}
    </g>
);

export interface WorldData { supp: number[]; plac: number[]; sdSupp: number; sdPlac: number; sdTrue: number }

/** Passos 3 e 4: os dois mundos lado a lado; no passo 4 eles são revelados e o teste certo aparece. */
export const TwoWorlds = ({ half, all, revealed }: { half: WorldData; all: WorldData; revealed: boolean }) => (
    <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Dois mundos com o mesmo gráfico">
        <WorldPanel x0={14} title={revealed ? 'Metade responde' : 'Mundo 1'} tone={C.nitrate} supp={half.supp} plac={half.plac} revealed={revealed}
            sdSupp={half.sdSupp} sdPlac={half.sdPlac} sdTrue={half.sdTrue} />
        <WorldPanel x0={346} title={revealed ? 'Todos iguais' : 'Mundo 2'} tone={C.no} supp={all.supp} plac={all.plac} revealed={revealed}
            sdSupp={all.sdSupp} sdPlac={all.sdPlac} sdTrue={all.sdTrue} />
    </svg>
);

/** Passo 6: classificação inconsistente (Hecksteden) e oscilação do nitrito na mesma pessoa (Miller). */
export const MarkerNoise = () => {
    const sx = (v: number) => 380 + (v / 1400) * 250;
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Classificação inconsistente e nitrito oscilante">
            <SvgText x={14} y={32} text="Ensaio de treino, 20 pessoas" size={18} color="#fff" weight={700} />
            {Array.from({ length: 20 }, (_, i) => (
                <motion.circle key={i} cx={36 + (i % 4) * 54} cy={86 + Math.floor(i / 4) * 54} r={19} fill={i < 11 ? C.no : C.placebo} fillOpacity={i < 11 ? 0.9 : 0.4}
                    stroke="#fff" strokeOpacity={0.5} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * i }} />
            ))}
            <SvgText x={14} y={368} text="11 de 20 iguais" size={18} color={C.noSoft} weight={700} />
            <SvgText x={14} y={392} text="entre os métodos" size={16} color={C.muted} weight={500} />
            <line x1={262} x2={262} y1={20} y2={VIS_H - 20} stroke="rgba(255,255,255,0.12)" />

            <SvgText x={290} y={32} text="Nitrito plasmático" size={18} color="#fff" weight={700} />
            <SvgText x={290} y={56} text="mudança após a dose, em %" size={16} color={C.muted} weight={500} />
            <line x1={sx(0)} x2={sx(1400)} y1={250} y2={250} stroke="rgba(255,255,255,0.3)" />
            {[0, 400, 800, 1200].map(t => <SvgText key={t} x={sx(t)} y={282} text={`${t}%`} anchor="middle" size={16} color={C.muted} weight={500} />)}
            <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
                <rect x={sx(-7.4)} y={226} width={sx(1324) - sx(-7.4)} height={24} rx={12} fill={C.nitrite} fillOpacity={0.85} />
                <SvgText x={sx(0)} y={212} text="mesma pessoa, de semana a semana" size={16} color={C.nitriteSoft} weight={700} />
                <SvgText x={sx(-7.4)} y={306} text="−7,4%" anchor="middle" size={17} color="#fff" weight={700} />
                <SvgText x={sx(1324)} y={306} text="+1.324%" anchor="middle" size={17} color="#fff" weight={700} />
            </motion.g>
            {[{ v: 400, t: 'média, semana 1: +400%', y: 120 }, { v: 140, t: 'média, semana 12: +140%', y: 160 }].map(m => (
                <g key={m.v}>
                    <line x1={sx(m.v)} x2={sx(m.v)} y1={m.y + 8} y2={250} stroke={C.no} strokeDasharray="4 4" />
                    <circle cx={sx(m.v)} cy={m.y} r={8} fill={C.no} stroke="#fff" strokeWidth={1.5} />
                    <SvgText x={sx(m.v) + 14} y={m.y + 6} text={m.t} size={16} color={C.noSoft} weight={700} />
                </g>
            ))}
            <SvgText x={290} y={VIS_H - 16} text="resumo de congresso · n = 6 no braço ativo" size={16} color={C.nitrite} weight={600} />
        </svg>
    );
};
