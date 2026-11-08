import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { ForestPlot, type ForestRow } from '../kit/ForestPlot';
import { SvgText } from '../kit/ui';
import { Tag, VIS_H, VIS_W } from './ui';

/** Desenhos do SexGapSim. Caixa 672 × 440. Homens em azul, mulheres em rosa (cores do kit). */

const MEN = C.o2;
const WOMEN = C.nitrateSoft;

const Person = ({ cx, cy, color, delay = 0, size = 1 }: { cx: number; cy: number; color: string; delay?: number; size?: number }) => (
    <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, duration: 0.3 }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx={cx} cy={cy - 6 * size} r={4.6 * size} fill={color} />
        <path d={`M${cx - 7 * size} ${cy + 9 * size} Q${cx} ${cy - 3 * size} ${cx + 7 * size} ${cy + 9 * size} Z`} fill={color} fillOpacity={0.9} />
    </motion.g>
);

/** Passo 1: cem participantes, 12 mulheres. */
export const ParticipantPictogram = () => (
    <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Cem participantes: 88 homens e 12 mulheres">
        <SvgText x={40} y={34} text="A cada 100 participantes" size={19} color="#fff" weight={700} />
        {Array.from({ length: 100 }, (_, i) => (
            <Person key={i} cx={52 + (i % 10) * 26} cy={86 + Math.floor(i / 10) * 32} color={i < 88 ? MEN : WOMEN} delay={0.006 * i} size={1.1} />
        ))}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.5 }}>
            <SvgText x={340} y={110} text="1.179" size={54} color={MEN} weight={700} />
            <SvgText x={340} y={138} text="homens" size={20} color="#E5E7EB" weight={600} />
            <SvgText x={340} y={226} text="156" size={54} color={WOMEN} weight={700} />
            <SvgText x={340} y={254} text="mulheres" size={20} color="#E5E7EB" weight={600} />
            <line x1={340} x2={640} y1={282} y2={282} stroke="rgba(255,255,255,0.15)" />
            <SvgText x={340} y={314} text="80 estudos, 2009 a 2019" size={18} color={C.muted} weight={600} />
            <SvgText x={340} y={342} text="~10% da amostra (os autores)" size={18} color={C.muted} weight={600} />
            <SvgText x={340} y={370} text="156 ÷ 1.335 = 11,7% (cálculo)" size={18} color={C.nitrite} weight={700} />
        </motion.g>
    </svg>
);

const SETS = [
    { n: 79, color: MEN, label: '79% só homens', sub: '90 conjuntos' },
    { n: 16, color: C.placebo, label: '16% mistos', sub: '17 conjuntos' },
    { n: 5, color: WOMEN, label: '5% só mulheres', sub: '6 conjuntos' },
] as const;

/** Passo 2: cem conjuntos de dados por composição de sexo. */
export const DatasetSquares = () => {
    const cells = SETS.flatMap(s => Array.from({ length: s.n }, () => s.color));
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Cem conjuntos de dados por composição de sexo">
            <SvgText x={40} y={34} text="A cada 100 conjuntos de dados" size={19} color="#fff" weight={700} />
            {cells.map((color, i) => (
                <motion.rect key={i} x={40 + (i % 10) * 29} y={56 + Math.floor(i / 10) * 29} width={25} height={25} rx={5} fill={color} fillOpacity={color === C.placebo ? 0.6 : 0.9}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.008 * i }} />
            ))}
            {SETS.map((s, i) => (
                <motion.g key={s.label} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + 0.2 * i, duration: 0.4 }}>
                    <rect x={356} y={86 + i * 100} width={22} height={22} rx={5} fill={s.color} />
                    <SvgText x={388} y={104 + i * 100} text={s.label} size={22} color="#fff" weight={700} />
                    <SvgText x={388} y={130 + i * 100} text={s.sub} size={17} color={C.muted} weight={500} />
                </motion.g>
            ))}
        </svg>
    );
};

const FOREST: readonly ForestRow[] = [
    { id: 'all', label: 'Todos os conjuntos', sub: '111 conjuntos', est: 0.174, lo: 0.12, hi: 0.229, kind: 'pooled', color: C.no },
    { id: 'women', label: 'Só mulheres', sub: '6 conjuntos · p = 0,347', est: 0.116, lo: -0.126, hi: 0.358, kind: 'pooled', color: WOMEN },
];

/** Passo 3: o efeito geral e o de só mulheres, com o intervalo largo. */
export const WomenInterval = () => (
    <div className="h-full p-3 flex flex-col gap-3">
        <div style={{ height: 250 }}>
            <ForestPlot rows={FOREST} width={VIS_W - 24} height={250} domain={[-0.4, 0.6]} ticks={[-0.4, -0.2, 0, 0.2, 0.4, 0.6]}
                axisLabel="tamanho de efeito (d)" labelWidth={230} valueWidth={190} decimals={3} sides={['contra o nitrato', 'a favor']} />
        </div>
        <div className="rounded-xl border px-4 py-3 flex flex-col gap-1.5" style={{ borderColor: `${C.nitrite}80`, background: 'rgba(251,191,36,0.08)' }}>
            <span className="font-display text-[1.35rem] font-semibold leading-tight" style={{ color: C.nitriteSoft }}>“provavelmente espúria”</span>
            <span className="text-[16px] leading-snug text-gray-100">
                O intervalo das mulheres vai de −0,126 a 0,358 e contém tanto o zero quanto o efeito geral (0,174).
            </span>
        </div>
    </div>
);

const TRIALS = [
    { who: 'He 2026', sub: '19 homens e 17 mulheres · 4 × 30 s de Wingate', result: 'nenhuma interação sexo × suplemento (todos p > 0,05); o nitrato atenuou a queda de potência', color: C.no },
    { who: 'Fry 2026', sub: '12 mulheres · fase folicular inicial e tardia', result: 'sem efeito em potência, velocidade ou torque, em nenhuma fase', color: C.placebo },
    { who: 'Brennan 2026', sub: '18 mulheres treinadas · folicular precoce', result: 'sem diferenças, salvo dois desfechos piores (p 0,047 e 0,049)', color: C.placebo },
] as const;

/** Passo 4: o ensaio desenhado para as duas e dois ensaios com o ciclo controlado. */
export const DesignedTrial = () => (
    <div className="h-full p-4 flex flex-col gap-3">
        <svg width={640} height={104} viewBox="0 0 640 104" role="img" aria-label="19 homens e 17 mulheres">
            {Array.from({ length: 36 }, (_, i) => <Person key={i} cx={24 + (i % 18) * 34} cy={24 + Math.floor(i / 18) * 34} color={i < 19 ? MEN : WOMEN} delay={0.02 * i} size={1.25} />)}
            <circle cx={20} cy={92} r={6} fill={MEN} />
            <SvgText x={34} y={98} text="19 homens" size={16} color={MEN} weight={700} />
            <circle cx={170} cy={92} r={6} fill={WOMEN} />
            <SvgText x={184} y={98} text="17 mulheres" size={16} color={WOMEN} weight={700} />
        </svg>
        {TRIALS.map((t, i) => (
            <motion.div key={t.who} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + 0.15 * i, duration: 0.35 }}
                className="rounded-xl border p-3" style={{ borderColor: `${t.color}80`, background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-[16px] leading-snug"><span className="font-display text-[1.1rem] font-semibold" style={{ color: t.color === C.placebo ? '#E5E7EB' : t.color }}>{t.who}</span>
                    <span className="text-gray-400"> · {t.sub}</span></p>
                <p className="text-[16px] leading-snug text-gray-100 mt-0.5">{t.result}</p>
            </motion.div>
        ))}
    </div>
);

const HELENA_POINTS = [
    { mark: '✓', color: C.no, t: 'Aptidão baixa (VO₂max ~38)', d: 'perfil em que o efeito costuma aparecer (~3% perto de VO₂pico 40; dado secundário)' },
    { mark: '?', color: C.nitrite, t: 'Poucas mulheres nos estudos', d: '156 participantes e 6 conjuntos só de mulheres, em 80 estudos' },
    { mark: '?', color: C.nitrite, t: 'Sem dado ≠ sem efeito', d: 'He 2026: sem diferença entre sexos. Fry e Brennan: nada, com ciclo controlado' },
] as const;

/** Passo 5: Helena diante da lacuna. */
export const HelenaCard = () => (
    <div className="h-full p-4 flex flex-col gap-2.5">
        <div className="flex items-center gap-4 rounded-2xl border p-3" style={{ borderColor: `${WOMEN}80`, background: 'rgba(244,114,182,0.08)' }}>
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full font-display text-[2rem] font-semibold" style={{ background: C.nitrateDeep, color: '#fff' }}>H</span>
            <div className="flex flex-col gap-0.5 min-w-0">
                <span className="font-display text-[1.5rem] font-semibold leading-none" style={{ color: WOMEN }}>Helena</span>
                <span className="text-[16px] text-gray-200 leading-snug">41 anos · corredora recreacional · VO₂max ~38 · primeira meia maratona</span>
            </div>
            <span className="ml-auto shrink-0"><Tag color={C.nitrite}>caso fictício</Tag></span>
        </div>
        {HELENA_POINTS.map((p, i) => (
            <motion.div key={p.t} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 * i + 0.2, duration: 0.35 }}
                className="flex gap-3 rounded-xl border border-white/10 px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[18px] font-bold" style={{ background: `${p.color}26`, color: p.color }}>{p.mark}</span>
                <span className="flex flex-col"><span className="text-[17px] font-semibold text-gray-50">{p.t}</span><span className="text-[15px] leading-snug text-gray-300">{p.d}</span></span>
            </motion.div>
        ))}
        <p className="mt-auto text-[17px] font-semibold" style={{ color: C.nitriteSoft }}>Quantas das 156 mulheres se pareciam com a Helena?</p>
    </div>
);
