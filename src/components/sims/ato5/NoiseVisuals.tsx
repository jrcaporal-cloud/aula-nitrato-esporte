import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { br, signed } from '../kit/format';
import { SvgText } from '../kit/ui';
import { AMANN, TTE_PER_TT, TYPICAL_N, Z_TT, Z_TTE, bell, signalToNoise, type NoiseStudy } from './noiseModel';
import { VIS_H, VIS_W } from './ui';
import { Count, SvgKeyFact } from './countText';
import { Ord } from './svgOrderA';

/** Desenhos do TestNoiseSim. Caixa 672 × 440. */

/** Número com vírgula e sem zeros à direita (26,6; 3,35; 2). */
const fmtCv = (v: number): string => String(v).replace('.', ',');

const TTE_COLOR = C.hypoxia;
const TT_COLOR = C.no;

/** Passo 1: oito repetições do mesmo teste no mesmo atleta (nuvem de pontos em escala comum). */
export const RepeatStrips = ({ study }: { study: NoiseStudy }) => {
    const x = (v: number) => 36 + ((v - 40) / 120) * 600;
    const rows = [
        { y: 152, label: 'Tempo até a exaustão', cv: study.tte, z: Z_TTE, color: TTE_COLOR },
        { y: 332, label: 'Contrarrelógio', cv: study.tt, z: Z_TT, color: TT_COLOR },
    ];
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Oito repetições do mesmo teste">
            <SvgText x={VIS_W / 2} y={30} text="Um atleta, 8 testes idênticos: o valor verdadeiro é sempre 100%" anchor="middle" size={18} color="#fff" weight={700} />
            {rows.map(r => (
                <g key={r.label}>
                    <SvgText x={36} y={r.y - 78} text={r.label} size={19} color={r.color} weight={700} />
                    <Ord at={0.5}>
                        {r.color === TTE_COLOR ? (
                            <SvgKeyFact color={TTE_COLOR} delay={0.6}>
                                <SvgText x={VIS_W - 36} y={r.y - 78} text={`CV ${fmtCv(r.cv)}%`} anchor="end" size={26} color="#fff" weight={700} />
                            </SvgKeyFact>
                        ) : <SvgText x={VIS_W - 36} y={r.y - 78} text={`CV ${fmtCv(r.cv)}%`} anchor="end" size={26} color="#fff" weight={700} />}
                    </Ord>
                    <rect x={x(100 - r.cv)} y={r.y - 46} width={x(100 + r.cv) - x(100 - r.cv)} height={92} rx={12} fill={r.color} fillOpacity={0.1} stroke={r.color} strokeOpacity={0.4} strokeDasharray="5 5" />
                    <line x1={36} x2={VIS_W - 36} y1={r.y} y2={r.y} stroke="rgba(255,255,255,0.25)" />
                    <line x1={x(100)} x2={x(100)} y1={r.y - 52} y2={r.y + 52} stroke="rgba(255,255,255,0.6)" strokeDasharray="4 4" />
                    {r.z.map((z, i) => (
                        <motion.circle key={`${study.id}-${i}`} cx={x(100 + r.cv * z)} cy={r.y + (i % 2 === 0 ? -16 : 16)} r={9}
                            fill={r.color} stroke="#fff" strokeWidth={1.5} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.06 * i, duration: 0.3 }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
                    ))}
                    {[50, 100, 150].map(t => <SvgText key={t} x={x(t)} y={r.y + 72} text={`${t}%`} anchor="middle" size={16} color={C.muted} weight={500} />)}
                </g>
            ))}
            <Ord at={0.7}>
                <SvgText x={VIS_W / 2} y={VIS_H - 10} text={`faixa tracejada = ±1 DP · ${study.caption}`} anchor="middle" size={16} color={C.muted} weight={500} />
            </Ord>
        </svg>
    );
};

/** Passo 2: régua logarítmica do efeito e do ruído (dados dos estudos). */
export const NoiseRuler = () => {
    const lo = Math.log10(0.5);
    const hi = Math.log10(30);
    const x = (v: number) => 40 + ((Math.log10(v) - lo) / (hi - lo)) * 590;
    const ticks = [1, 2, 3, 5, 10, 20];
    const rows = [
        { y: 100, label: 'Diferença entre o 1º e o 2º lugar', a: 0.5, b: 1, text: 'menos de 1%', color: C.risk },
        { y: 190, label: 'Ruído do contrarrelógio (CV)', a: 2.0, b: 3.4, text: '2 a 3,4%', color: TT_COLOR },
        { y: 280, label: 'Ruído do tempo até a exaustão (CV)', a: 13.2, b: 26.6, text: '13 a 27%', color: TTE_COLOR },
    ];
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Régua de efeito e ruído">
            <SvgText x={VIS_W / 2} y={30} text="Em % do desempenho (escala logarítmica)" anchor="middle" size={18} color="#fff" weight={700} />
            {ticks.map(t => (
                <g key={t}>
                    <line x1={x(t)} x2={x(t)} y1={56} y2={352} stroke="rgba(255,255,255,0.07)" />
                    <SvgText x={x(t)} y={376} text={`${t}%`} anchor="middle" size={16} color={C.muted} weight={600} />
                </g>
            ))}
            <line x1={36} x2={VIS_W - 36} y1={356} y2={356} stroke="rgba(255,255,255,0.3)" />
            {rows.map((r, i) => (
                <motion.g key={r.label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 * i, duration: 0.45 }}>
                    <SvgText x={40} y={r.y - 22} text={r.label} size={17} color="#E5E7EB" weight={700} />
                    <rect x={x(r.a)} y={r.y - 8} width={x(r.b) - x(r.a)} height={26} rx={13} fill={r.color} fillOpacity={0.85} />
                    <text x={x(r.b) + 120 > VIS_W ? x(r.a) - 12 : x(r.b) + 12} y={r.y + 12} textAnchor={x(r.b) + 120 > VIS_W ? 'end' : 'start'} fontSize={18} fontWeight={700} fill={r.color}
                        style={{ fontFamily: 'var(--font-body)', paintOrder: 'stroke', stroke: '#07050B', strokeWidth: 4, strokeLinejoin: 'round' }}>
                        <Count text={r.text} all delayMs={300 * i + 150} ms={700} />
                    </text>
                </motion.g>
            ))}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.5 }}>
                <line x1={x(2.8)} x2={x(2.8)} y1={52} y2={356} stroke={C.nitrate} strokeWidth={3} strokeDasharray="7 5" />
                <rect x={x(2.8) - 74} y={394} width={148} height={30} rx={8} fill="#07050B" stroke={C.nitrate} />
                <SvgKeyFact color={C.nitrate} delay={1.25}>
                    <text x={x(2.8)} y={415} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.nitrateSoft}
                        style={{ fontFamily: 'var(--font-body)', paintOrder: 'stroke', stroke: '#07050B', strokeWidth: 4, strokeLinejoin: 'round' }}>
                        <Count text="efeito: ~3%" delayMs={1100} ms={600} />
                    </text>
                </SvgKeyFact>
            </motion.g>
        </svg>
    );
};

/** Os números sinal/ruído entram depois das barras dos dois painéis. */
const SNR_AT = 0.8;

interface PanelDef { x0: number; title: string; sub: string; color: string; domain: readonly [number, number]; rows: readonly { cond: string; mean: number; sd: number }[] }

const AMANN_PANELS: readonly PanelDef[] = [
    { x0: 14, title: 'Tempo até a exaustão', sub: 'duração: −45% e +123%', color: TTE_COLOR, domain: [-100, 180], rows: AMANN.tte },
    { x0: 346, title: 'Contrarrelógio de 5 km', sub: 'tempo: +5,7% e −4,1%', color: TT_COLOR, domain: [-8, 8], rows: AMANN.tt },
];

/** Passo 3: as mesmas mudanças em escalas 20 vezes diferentes, com a razão mudança ÷ DP. */
export const AmannPanels = () => (
    <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Mudança e ruído em TTE e contrarrelógio">
        {AMANN_PANELS.map(p => {
            const w = 312;
            const sx = (v: number) => p.x0 + 12 + ((v - p.domain[0]) / (p.domain[1] - p.domain[0])) * (w - 24);
            return (
                <g key={p.title}>
                    <rect x={p.x0} y={12} width={w} height={416} rx={14} fill="rgba(255,255,255,0.03)" stroke={p.color} strokeOpacity={0.45} />
                    <SvgText x={p.x0 + w / 2} y={42} text={p.title} anchor="middle" size={19} color={p.color} weight={700} />
                    <SvgText x={p.x0 + w / 2} y={66} text={p.sub} anchor="middle" size={16} color={C.muted} weight={500} />
                    <line x1={sx(0)} x2={sx(0)} y1={86} y2={300} stroke="rgba(255,255,255,0.5)" strokeDasharray="5 5" />
                    {p.rows.map((r, i) => {
                        const y = 130 + i * 92;
                        const lo = sx(Math.min(0, r.mean));
                        const hi = sx(Math.max(0, r.mean));
                        return (
                            <motion.g key={r.cond} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 * i + (p.x0 > 100 ? 0.15 : 0), duration: 0.4 }}>
                                <SvgText x={p.x0 + 16} y={y - 24} text={r.cond} size={17} color="#E5E7EB" weight={700} />
                                <rect x={lo} y={y - 10} width={hi - lo} height={28} rx={6} fill={p.color} fillOpacity={0.75} />
                                <line x1={sx(r.mean - r.sd)} x2={sx(r.mean + r.sd)} y1={y + 4} y2={y + 4} stroke="#fff" strokeWidth={2.5} />
                                <line x1={sx(r.mean - r.sd)} x2={sx(r.mean - r.sd)} y1={y - 6} y2={y + 14} stroke="#fff" strokeWidth={2.5} />
                                <line x1={sx(r.mean + r.sd)} x2={sx(r.mean + r.sd)} y1={y - 6} y2={y + 14} stroke="#fff" strokeWidth={2.5} />
                                <SvgText x={p.x0 + w - 16} y={y - 24} text={`${signed(r.mean, r.mean % 1 === 0 ? 0 : 1)}% ± ${br(r.sd, r.sd % 1 === 0 ? 0 : 1)}`} anchor="end" size={17} color="#fff" weight={700} />
                            </motion.g>
                        );
                    })}
                    <line x1={p.x0 + 16} x2={p.x0 + w - 16} y1={306} y2={306} stroke="rgba(255,255,255,0.15)" />
                    <Ord at={SNR_AT}>
                        {(() => {
                            const nums = p.rows.map((r, i) => (
                                <text key={r.cond} x={p.x0 + w / 4 + (i * w) / 2} y={382} textAnchor="middle" fontSize={38} fontWeight={700} fill="#fff"
                                    style={{ fontFamily: 'var(--font-body)', paintOrder: 'stroke', stroke: '#07050B', strokeWidth: 4, strokeLinejoin: 'round' }}>
                                    <Count text={br(signalToNoise(r.mean, r.sd), 1)} delayMs={SNR_AT * 1000} ms={800} />
                                </text>
                            ));
                            return p.color === TT_COLOR ? <SvgKeyFact color={TT_COLOR} delay={SNR_AT + 0.35}>{nums}</SvgKeyFact> : nums;
                        })()}
                    </Ord>
                    <Ord at={SNR_AT + 0.32}>
                        <SvgText x={p.x0 + w / 2} y={332} text="mudança ÷ DP (cálculo)" anchor="middle" size={16} color={C.muted} weight={500} />
                        {p.rows.map((r, i) => (
                            <SvgText key={`c${r.cond}`} x={p.x0 + w / 4 + (i * w) / 2} y={408} text={r.cond} anchor="middle" size={16} color={C.muted} weight={500} />
                        ))}
                    </Ord>
                </g>
            );
        })}
    </svg>
);

/** Largura de uma curva por passo de x (pontos do caminho). */
const curve = (x0: number, w: number, base: number, h: number, mu: number, sigma: number, lo: number, hi: number): { line: string; right: string; left: string; sx: (v: number) => number } => {
    const sx = (v: number) => x0 + ((v - lo) / (hi - lo)) * w;
    const pts: [number, number][] = [];
    for (let i = 0; i <= 80; i++) {
        const v = lo + ((hi - lo) * i) / 80;
        pts.push([sx(v), base - h * bell(v, mu, sigma)]);
    }
    const path = (arr: [number, number][]) => arr.map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' ');
    const zeroX = sx(0);
    const rightPts = pts.filter(([px]) => px >= zeroX);
    const leftPts = pts.filter(([px]) => px <= zeroX);
    const zeroY = base - h * bell(0, mu, sigma);
    const rightArea = `M${zeroX.toFixed(1)} ${base} L${zeroX.toFixed(1)} ${zeroY.toFixed(1)} ${path(rightPts).replace('M', 'L')} L${rightPts[rightPts.length - 1][0].toFixed(1)} ${base} Z`;
    const leftArea = `M${leftPts[0][0].toFixed(1)} ${base} ${path(leftPts).replace('M', 'L')} L${zeroX.toFixed(1)} ${zeroY.toFixed(1)} L${zeroX.toFixed(1)} ${base} Z`;
    return { line: path(pts), right: rightArea, left: leftArea, sx };
};

interface BellProps { delta: number; nTT: number; nTTE: number; shareTT: number; shareTTE: number }

/** Passos 4 e 5: curvas do que um atleta mostra numa medida por braço e o n necessário. */
export const BellsAndN = ({ delta, nTT, nTTE, shareTT, shareTTE }: BellProps) => {
    const panels = [
        { x0: 14, color: TTE_COLOR, title: 'TTE', mu: delta * TTE_PER_TT, sigma: Math.SQRT2 * 26.6, lo: -120, hi: 120, ticks: [-80, 0, 80], share: shareTTE, n: nTTE },
        { x0: 346, color: TT_COLOR, title: 'Contrarrelógio', mu: delta, sigma: Math.SQRT2 * 3.35, lo: -15, hi: 15, ticks: [-10, 0, 10], share: shareTT, n: nTT },
    ];
    const nx = (n: number) => 150 + (Math.min(n, 200) / 200) * 470;
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Mudança medida em um atleta e atletas necessários">
            {panels.map(p => {
                const c = curve(p.x0 + 12, 292, 170, 92, p.mu, p.sigma, p.lo, p.hi);
                return (
                    <g key={p.title}>
                        <SvgText x={p.x0 + 156} y={28} text={p.title} anchor="middle" size={19} color={p.color} weight={700} />
                        <path d={c.left} fill={C.risk} fillOpacity={0.3} />
                        <path d={c.right} fill={C.no} fillOpacity={0.4} />
                        <path d={c.line} fill="none" stroke={p.color} strokeWidth={2.5} />
                        <line x1={c.sx(0)} x2={c.sx(0)} y1={52} y2={176} stroke="rgba(255,255,255,0.6)" strokeDasharray="4 4" />
                        <line x1={p.x0 + 12} x2={p.x0 + 304} y1={170} y2={170} stroke="rgba(255,255,255,0.3)" />
                        {p.ticks.map(t => <SvgText key={t} x={c.sx(t)} y={194} text={t === 0 ? '0' : signed(t, 0)} anchor="middle" size={16} color={C.muted} weight={500} />)}
                        <SvgText x={p.x0 + 156} y={222} text={`${Math.round(p.share * 100)}% parecem melhorar`} anchor="middle" size={18} color={C.noSoft} weight={700} />
                    </g>
                );
            })}
            <SvgText x={VIS_W / 2} y={252} text="mudança medida em 1 atleta, 1 teste por braço (%)" anchor="middle" size={16} color={C.muted} weight={500} />
            <line x1={14} x2={VIS_W - 14} y1={266} y2={266} stroke="rgba(255,255,255,0.12)" />

            <SvgText x={14} y={292} text="Atletas necessários (80% de poder · cálculo)" size={17} color="#fff" weight={700} />
            {[{ y: 326, label: 'TTE', n: nTTE, color: TTE_COLOR }, { y: 376, label: 'Contrarr.', n: nTT, color: TT_COLOR }].map(b => (
                <g key={b.label}>
                    <SvgText x={14} y={b.y + 8} text={b.label} size={17} color={b.color} weight={700} />
                    <rect x={150} y={b.y - 14} width={Math.max(nx(b.n) - 150, 3)} height={30} rx={8} fill={b.color} fillOpacity={0.85} />
                    <SvgText x={Math.min(nx(b.n) + 10, 572)} y={b.y + 8} text={`${b.n >= 200 ? `${b.n} ▸` : b.n}`} size={22} color="#fff" weight={700} />
                </g>
            ))}
            <line x1={nx(TYPICAL_N)} x2={nx(TYPICAL_N)} y1={300} y2={400} stroke={C.nitrite} strokeWidth={2.5} strokeDasharray="4 4" />
            <SvgText x={nx(TYPICAL_N) + 8} y={VIS_H - 8} text="n típico da área: 10" size={16} color={C.nitrite} weight={700} />
        </svg>
    );
};
