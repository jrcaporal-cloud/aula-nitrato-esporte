import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { VIS_W } from './ui';
import { Seal } from './arte/figures';
import { T } from './arte/text';
import { Glass, VesselDefs } from './arte/vessels';
import { Count, SvgKeyFact } from './countText';
import { Ord } from './svgOrderA';

/** Quadros dos passos 4 e 5 do CrossoverSim (abaixo do cronograma). Coordenadas absolutas na caixa 672 × 440. */

const K = 2.45;
/** Bolhas de bactérias: área proporcional à variação; o anel tracejado é o tamanho "antes". */
const TAXA = [
    { name: 'Neisseria', v: 351, cx: 222, cy: 346 },
    { name: 'Rothia', v: 127, cx: 316, cy: 316 },
    { name: 'Prevotella', v: -60, cx: 398, cy: 372 },
    { name: 'Veillonella', v: -65, cx: 312, cy: 378 },
] as const;

const radius = (v: number) => K * Math.sqrt(Math.abs(v));
const before = (v: number) => radius(v) / Math.sqrt(1 + v / 100);

/** Passo 4: 10 dias de nitrato mudam a saliva; a boca do 1º braço é a do 2º. */
export const BiologyPanel = ({ reduce }: { reduce: boolean }) => (
    <g>
        <VesselDefs />
        <defs>
            <radialGradient id="bp-drop" cx="0.5" cy="0.45" r="0.6"><stop offset="0" stopColor={C.bacteria} stopOpacity="0.22" /><stop offset="1" stopColor={C.bacteria} stopOpacity="0.04" /></radialGradient>
        </defs>
        <T x={VIS_W / 2} y={272} size={17} color="#fff" weight={700} anchor="middle">Saliva após 10 dias de ~12 mmol/dia de nitrato</T>
        <Glass id="bp-gl" x={22} y={308} w={58} h={70} level={0.8} />
        <T x={51} y={402} size={16} color={C.nitrateSoft} weight={700} anchor="middle">1º braço</T>
        <path d="M92 344H126" stroke={C.nitrate} strokeWidth={3} strokeLinecap="round" strokeDasharray="6 7">
            {!reduce && <animate attributeName="stroke-dashoffset" values="0;-26" dur="1.2s" repeatCount="indefinite" />}
        </path>
        <path d="M124 336L134 344L124 352" stroke={C.nitrate} strokeWidth={3} fill="none" strokeLinecap="round" />
        <ellipse cx={304} cy={350} rx={162} ry={66} fill="url(#bp-drop)" stroke={C.bacteria} strokeOpacity={0.6} strokeWidth={2} strokeDasharray="3 6" />
        {TAXA.map((t, i) => {
            const r = radius(t.v);
            const up = t.v > 0;
            return (
                <motion.g key={t.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 * i }}>
                    <circle cx={t.cx} cy={t.cy} r={before(t.v)} fill="none" stroke="#fff" strokeOpacity={0.45} strokeWidth={1.6} strokeDasharray="4 5" />
                    <circle cx={t.cx} cy={t.cy} r={r} fill={C.bacteria} fillOpacity={up ? 0.6 : 0.4} stroke={up ? C.noSoft : C.hypoxia} strokeWidth={up ? 3 : 2.4}>
                        {!reduce && <animate attributeName="r" values={`${r};${r * 1.05};${r}`} dur={`${2.4 + i * 0.4}s`} repeatCount="indefinite" />}
                    </circle>
                </motion.g>
            );
        })}
        {TAXA.map((t, i) => {
            const up = t.v > 0;
            return (
                <motion.g key={t.name} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + 0.12 * i }}>
                    <path d={up ? `M486 ${312 + i * 28}l7 -13l7 13z` : `M486 ${298 + i * 28}l7 13l7 -13z`} fill={up ? C.no : C.hypoxia} />
                    {i === 0 ? (
                        <SvgKeyFact color={C.no} delay={0.55}>
                            <T x={510} y={310 + i * 28} size={17} color={up ? C.noSoft : '#FDBA74'} weight={700}><Count text={`${t.name} ${up ? '+' : '−'}${Math.abs(t.v)}%`} delayMs={300 + 120 * i} ms={700} /></T>
                        </SvgKeyFact>
                    ) : <T x={510} y={310 + i * 28} size={17} color={up ? C.noSoft : '#FDBA74'} weight={700}><Count text={`${t.name} ${up ? '+' : '−'}${Math.abs(t.v)}%`} delayMs={300 + 120 * i} ms={700} /></T>}
                </motion.g>
            );
        })}
        <Ord at={0.95}>
            <T x={VIS_W / 2} y={432} size={17} color={C.nitriteSoft} weight={700} anchor="middle">a beterraba do 1º braço muda o microbioma que vai ativar o 2º braço</T>
        </Ord>
    </g>
);

const SEALS = [
    { l: ['duplo-cego,', '32 jogadores'] },
    { l: ['washout', 'pelo menos 8 dias'] },
    { l: ['placebo:', 'suco depletado'] },
    { l: ['desfecho', 'primário único'] },
    { l: ['financiamento', 'público; conflitos:', 'nenhum'] },
] as const;

/** Passo 5: cinco selos acesos em sequência e o efeito pequeno no Yo-Yo. */
export const GoodPanel = () => (
    <g>
        {SEALS.map((s, i) => {
            const cx = 14 + 64.4 + i * 128.8;
            return (
                <motion.g key={s.l[0]} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 * i, type: 'spring', stiffness: 260, damping: 16 }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                    <Seal cx={cx} cy={282} r={24} color={C.no} mark="ok" />
                    {s.l.map((l, j) => <T key={l} x={cx} y={324 + 19 * j} size={16} color={j === 0 ? '#fff' : '#E5E7EB'} weight={j === 0 ? 700 : 500} anchor="middle">{l}</T>)}
                </motion.g>
            );
        })}
        <line x1={14} x2={VIS_W - 14} y1={374} y2={374} stroke="rgba(255,255,255,0.12)" />
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            {[{ y: 384, w: 300, n: 'placebo', m: '1.574 m', c: C.placebo }, { y: 410, w: 309, n: 'beterraba', m: '1.623 m', c: C.nitrate }].map(b => (
                <g key={b.n}>
                    <rect x={14} y={b.y} width={b.w} height={22} rx={7} fill={b.c} fillOpacity={0.8} stroke="#fff" strokeOpacity={0.4} />
                    <T x={24} y={b.y + 17} size={16} color="#fff" weight={700}>{b.n}</T>
                    <T x={14 + b.w + 10} y={b.y + 17} size={16} color="#E5E7EB" weight={600}><Count text={b.m} delayMs={800} ms={700} /></T>
                </g>
            ))}
            <SvgKeyFact color={C.no} delay={1.0}>
                <T x={470} y={410} size={36} color={C.noSoft} weight={700} display><Count text="+3,4%" delayMs={900} ms={800} /></T>
            </SvgKeyFact>
        </motion.g>
        <Ord at={1.15}>
            <T x={470} y={432} size={16} color={C.muted} weight={500}>no Yo-Yo IR1, não +15%</T>
        </Ord>
    </g>
);
