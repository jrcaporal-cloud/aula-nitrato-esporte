import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { EGGER, FILL, POOLED, STUDIES } from './funnelModel';
import { VIS_H, VIS_W } from './ui';

/** Desenhos do FunnelSim. Caixa 672 × 440. */

const X0 = 64;
const X1 = 650;
const TOP = 62;
const BOT = 322;
const G_LO = -1.4;
const G_HI = 1.8;
const SE_MAX = 0.8;
const sx = (g: number) => X0 + ((g - G_LO) / (G_HI - G_LO)) * (X1 - X0);
const sy = (se: number) => TOP + (se / SE_MAX) * (BOT - TOP);
const DIAMOND_Y = 374;

interface FunnelProps { layer: number }

/** Passos 1 a 4: o funil de efeito × erro padrão, com as camadas Egger e trim-and-fill. */
export const FunnelPlot = ({ layer }: FunnelProps) => {
    const c = POOLED.est;
    const showShape = layer >= 1;
    const showEgger = layer === 2;
    const showFill = layer >= 3;
    const est = showFill ? FILL.adjusted.est : c;
    const half = 1.96 * (showFill ? FILL.adjusted.se : POOLED.se);
    const halfPx = half * ((X1 - X0) / (G_HI - G_LO));
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Funil de viés de publicação">
            <defs><clipPath id="funnel-clip"><rect x={X0} y={TOP - 6} width={X1 - X0} height={BOT - TOP + 12} /></clipPath></defs>
            <SvgText x={VIS_W / 2} y={28} text="Potência de pico em atletas · efeito (g) × erro padrão" anchor="middle" size={18} color="#fff" weight={700} />
            {[-1, 0, 1].map(t => (
                <g key={t}>
                    <line x1={sx(t)} x2={sx(t)} y1={TOP} y2={BOT} stroke={t === 0 ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.07)'} strokeDasharray={t === 0 ? '5 5' : undefined} />
                    <SvgText x={sx(t)} y={BOT + 22} text={t === 0 ? '0' : t > 0 ? `+${t}` : `−${-t}`} anchor="middle" size={16} color={C.muted} weight={600} />
                </g>
            ))}
            <SvgText x={sx(0) - 8} y={TOP + 16} text="sem efeito" anchor="end" size={16} color={C.muted} weight={500} />
            <SvgText x={X0 + 6} y={BOT - 6} text="menos preciso ↓" size={16} color={C.muted} weight={500} />

            {showShape && (
                <motion.g clipPath="url(#funnel-clip)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                    <polygon points={`${sx(c)},${sy(0)} ${sx(c - 1.96 * SE_MAX)},${sy(SE_MAX)} ${sx(c + 1.96 * SE_MAX)},${sy(SE_MAX)}`} fill="rgba(255,255,255,0.03)"
                        stroke="rgba(255,255,255,0.4)" strokeDasharray="6 5" />
                    {layer === 1 && <polygon points={`${sx(c - 1.96 * 0.3)},${sy(0.3)} ${sx(-0.15)},${sy(0.3)} ${sx(-0.15)},${sy(SE_MAX)} ${sx(c - 1.96 * SE_MAX)},${sy(SE_MAX)}`}
                        fill={C.nitrite} fillOpacity={0.2} stroke={C.nitrite} strokeOpacity={0.5} strokeDasharray="4 4" />}
                </motion.g>
            )}
            {layer === 1 && <SvgText x={sx(-0.82)} y={sy(0.5)} text="faltam estudos aqui" anchor="middle" size={18} color={C.nitriteSoft} weight={700} />}

            {showEgger && (
                <motion.line x1={sx(EGGER.a + EGGER.b * 0.14)} x2={sx(EGGER.a + EGGER.b * 0.74)} y1={sy(0.14)} y2={sy(0.74)} stroke={C.nitrite} strokeWidth={3.5} strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: 'easeOut' }} />
            )}
            {showEgger && <SvgText x={sx(EGGER.a + EGGER.b * 0.74) + 12} y={sy(0.74) - 4} text="reta de Egger" size={17} color={C.nitriteSoft} weight={700} />}

            {showFill && FILL.ghosts.map((p, i) => (
                <motion.g key={`ghost${i}`} initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * i + 0.1, duration: 0.5 }}>
                    <circle cx={sx(p.g)} cy={sy(p.se)} r={9} fill="rgba(251,191,36,0.15)" stroke={C.nitrite} strokeWidth={2.5} strokeDasharray="4 3" />
                </motion.g>
            ))}
            {STUDIES.map((p, i) => (
                <motion.circle key={i} cx={sx(p.g)} cy={sy(p.se)} r={8} fill={C.no} fillOpacity={0.9} stroke="#fff" strokeWidth={1.5}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.04 * i }} />
            ))}

            <line x1={X0} x2={X1} y1={DIAMOND_Y - 22} y2={DIAMOND_Y - 22} stroke="rgba(255,255,255,0.12)" />
            <SvgText x={14} y={DIAMOND_Y + 6} text="agrupado" size={16} color="#E5E7EB" weight={700} />
            {showFill && (
                <g opacity={0.35}>
                    <polygon points={`${sx(c) - 1.96 * POOLED.se * ((X1 - X0) / (G_HI - G_LO))},${DIAMOND_Y} ${sx(c)},${DIAMOND_Y - 13} ${sx(c) + 1.96 * POOLED.se * ((X1 - X0) / (G_HI - G_LO))},${DIAMOND_Y} ${sx(c)},${DIAMOND_Y + 13}`}
                        fill="none" stroke="#fff" strokeDasharray="4 4" />
                </g>
            )}
            <motion.g initial={false} animate={{ x: sx(est) }} transition={{ duration: 1.1, ease: 'easeInOut' }}>
                <polygon points={`${-halfPx},${DIAMOND_Y} 0,${DIAMOND_Y - 13} ${halfPx},${DIAMOND_Y} 0,${DIAMOND_Y + 13}`} fill={showFill ? C.risk : C.no} fillOpacity={0.9} stroke="#fff" strokeWidth={1.5} />
            </motion.g>
            <SvgText x={VIS_W - 14} y={DIAMOND_Y + 40} text={showFill ? 'ajustado ≈ 0 (praticamente zero)' : 'g = 0,13 (−0,07 a 0,32)'}
                anchor="end" size={16} color={showFill ? C.risk : C.noSoft} weight={700} />
        </svg>
    );
};

const ROB: readonly { n: number; color: string; label: string }[] = [
    { n: 1, color: C.no, label: '1 baixo risco' },
    { n: 33, color: C.nitrite, label: '33 algumas preocupações' },
    { n: 11, color: C.risk, label: '11 alto risco' },
];

const GRADE = [
    { t: 'moderado', d: 'VO₂max e FC', c: C.no },
    { t: 'baixo', d: 'potência de pico e média', c: C.nitrite },
    { t: 'muito baixo', d: 'lactato e PSE', c: C.risk },
] as const;

/** Passo 5: risco de viés (RoB 2) dos 45 ECRs e certeza GRADE por desfecho. */
export const QualityPanel = () => {
    const cells = ROB.flatMap(r => Array.from({ length: r.n }, () => r.color));
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Risco de viés dos 45 ECRs e GRADE">
            <SvgText x={VIS_W / 2} y={30} text="RoB 2 · 45 ECRs em atletas" anchor="middle" size={19} color="#fff" weight={700} />
            {cells.map((color, i) => (
                <motion.rect key={i} x={26 + (i % 9) * 70} y={50 + Math.floor(i / 9) * 38} width={62} height={30} rx={7} fill={color} fillOpacity={color === C.no ? 1 : 0.7}
                    stroke={color === C.no ? '#fff' : 'none'} strokeWidth={2} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.012 * i }} />
            ))}
            {ROB.map((r, i) => (
                <g key={r.label}>
                    <rect x={[26, 176, 420][i]} y={252} width={16} height={16} rx={4} fill={r.color} />
                    <SvgText x={[48, 198, 442][i]} y={266} text={r.label} size={16} color="#E5E7EB" weight={600} />
                </g>
            ))}
            <line x1={14} x2={VIS_W - 14} y1={288} y2={288} stroke="rgba(255,255,255,0.12)" />
            <SvgText x={VIS_W / 2} y={318} text="Certeza (GRADE) por desfecho" anchor="middle" size={19} color="#fff" weight={700} />
            {GRADE.map((g, i) => (
                <motion.g key={g.t} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + 0.15 * i }}>
                    <rect x={14 + i * 220} y={336} width={206} height={84} rx={12} fill="rgba(255,255,255,0.04)" stroke={g.c} strokeOpacity={0.7} />
                    <SvgText x={117 + i * 220} y={366} text={g.t} anchor="middle" size={20} color={g.c} weight={700} />
                    <SvgText x={117 + i * 220} y={396} text={g.d} anchor="middle" size={16} color="#E5E7EB" weight={500} />
                </motion.g>
            ))}
        </svg>
    );
};
