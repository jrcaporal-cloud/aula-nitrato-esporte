import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { br } from '../kit/format';
import { SvgText } from '../kit/ui';
import { VIS_H, VIS_W } from './ui';
import type { CrossoverStep } from './crossoverContent';

/** Desenhos do CrossoverSim: cronograma fixo no alto (acende por passo) e quadro do passo embaixo. Caixa 672 × 440. */

type Focus = CrossoverStep['focus'];
const BR = C.nitrate;
const PL = C.placebo;

interface BlockProps { x: number; y: number; w: number; label: string; color: string; hatched?: boolean; dim: boolean }

const Block = ({ x, y, w, label, color, hatched = false, dim }: BlockProps) => (
    <g style={{ opacity: dim ? 0.3 : 1, transition: 'opacity 0.4s' }}>
        <rect x={x} y={y} width={w} height={38} rx={10} fill={hatched ? 'url(#xo-hatch)' : color} fillOpacity={hatched ? 1 : 0.38}
            stroke={color} strokeWidth={hatched ? 1.6 : 1.4} strokeDasharray={hatched ? '5 4' : undefined} />
        <SvgText x={x + w / 2} y={y + 25} text={label} anchor="middle" size={16} color="#fff" weight={600} />
    </g>
);

const LANES = [
    { y: 32, name: 'Sequência A', v1: ['beterraba', BR], v2: ['placebo', PL] },
    { y: 80, name: 'Sequência B', v1: ['placebo', PL], v2: ['beterraba', BR] },
] as const;

const Timeline = ({ focus }: { focus: Focus }) => {
    const dim = (g: Focus) => focus !== 'all' && focus !== g && !(focus === 'order' && (g === 'wash'));
    return (
        <g>
            <defs>
                <pattern id="xo-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="8" height="8" fill="rgba(251,191,36,0.06)" />
                    <line x1="0" y1="0" x2="0" y2="8" stroke={C.nitrite} strokeOpacity="0.5" strokeWidth="2" />
                </pattern>
            </defs>
            {[{ x: 130, w: 80, t: 'familiar.' }, { x: 216, w: 120, t: 'visita 1' }, { x: 342, w: 94, t: 'washout' }, { x: 442, w: 120, t: 'visita 2' }].map(h => (
                <SvgText key={h.t} x={h.x + h.w / 2} y={18} text={h.t} anchor="middle" size={16} color={C.muted} weight={500} />
            ))}
            {LANES.map(l => (
                <g key={l.name}>
                    <SvgText x={14} y={l.y + 25} text={l.name} size={16} color="#E5E7EB" weight={700} />
                    <Block x={130} y={l.y} w={80} label="treino" color={C.o2} dim={dim('famil')} />
                    <Block x={216} y={l.y} w={120} label={l.v1[0]} color={l.v1[1]} dim={dim('order')} />
                    <Block x={342} y={l.y} w={94} label="intervalo" color={C.nitrite} hatched dim={dim('wash')} />
                    <Block x={442} y={l.y} w={120} label={l.v2[0]} color={l.v2[1]} dim={dim('order')} />
                </g>
            ))}
            {focus === 'famil' && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <SvgText x={618} y={64} text="+1,2%" anchor="middle" size={22} color={C.nitrite} weight={700} />
                    <SvgText x={618} y={86} text="de graça" anchor="middle" size={16} color={C.nitriteSoft} weight={600} />
                </motion.g>
            )}
            {focus === 'wash' && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <SvgText x={618} y={64} text="7 d" anchor="middle" size={22} color={C.nitrite} weight={700} />
                    <SvgText x={618} y={86} text="bastam?" anchor="middle" size={16} color={C.nitriteSoft} weight={600} />
                </motion.g>
            )}
            {focus === 'order' && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <SvgText x={618} y={64} text="sorteio" anchor="middle" size={20} color={C.nitrateSoft} weight={700} />
                    <SvgText x={618} y={86} text="da ordem" anchor="middle" size={16} color={C.nitrateSoft} weight={600} />
                </motion.g>
            )}
        </g>
    );
};

const rule = <line x1={14} x2={VIS_W - 14} y1={140} y2={140} stroke="rgba(255,255,255,0.12)" />;

/** Passo 1: o que o desenho exige. */
const DesignCards = () => (
    <g transform="translate(0,150)">
        {[
            { n: '7 dias', lines: ['washout mediano', 'faixa de 4 a 14 dias', 'nos 45 ECRs'], c: C.nitrite },
            { n: '24–48 h', lines: ['sem alimentos ricos', 'em nitrato antes do teste', 'e sem enxaguante'], c: C.no },
            { n: '95%', lines: ['com sessão-controle', 'sem suplemento', '(80 estudos)'], c: C.o2 },
        ].map((k, i) => (
            <motion.g key={k.n} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * i, duration: 0.4 }}>
                <rect x={14 + i * 216} y={14} width={202} height={200} rx={14} fill="rgba(255,255,255,0.04)" stroke={k.c} strokeOpacity={0.6} />
                <SvgText x={115 + i * 216} y={80} text={k.n} anchor="middle" size={38} color={k.c} weight={700} />
                {k.lines.map((l, j) => (
                    <SvgText key={l} x={115 + i * 216} y={122 + j * 28} text={l} anchor="middle" size={j === 0 ? 18 : 16} color={j === 0 ? '#fff' : C.muted} weight={j === 0 ? 700 : 500} />
                ))}
            </motion.g>
        ))}
        <SvgText x={VIS_W / 2} y={258} text="a pessoa é o próprio controle: menos ruído, menos gente" anchor="middle" size={16} color={C.muted} weight={500} />
    </g>
);

/** Passo 2: o ganho entre tentativas. */
const LearningBars = () => {
    const base = 366;
    const k = 100;
    return (
        <g>
            <SvgText x={VIS_W / 2} y={176} text="Melhora entre tentativas do mesmo teste" anchor="middle" size={18} color="#fff" weight={700} />
            <line x1={90} x2={VIS_W - 90} y1={base} y2={base} stroke="rgba(255,255,255,0.3)" />
            {[{ x: 150, v: 1.2, t: '1ª → 2ª tentativa', c: C.nitrite }, { x: 400, v: 0.2, t: 'tentativas seguintes', c: PL }].map((b, i) => (
                <motion.g key={b.t} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 * i, duration: 0.5 }}>
                    <rect x={b.x} y={base - b.v * k} width={120} height={b.v * k} rx={8} fill={b.c} fillOpacity={0.85} />
                    <SvgText x={b.x + 60} y={base - b.v * k - 12} text={`+${br(b.v, 1)}%`} anchor="middle" size={26} color="#fff" weight={700} />
                    <SvgText x={b.x + 60} y={base + 26} text={b.t} anchor="middle" size={17} color="#E5E7EB" weight={600} />
                </motion.g>
            ))}
            <SvgText x={VIS_W / 2} y={VIS_H - 14} text="o erro típico entre as duas primeiras é 1,3× o das seguintes" anchor="middle" size={16} color={C.muted} weight={500} />
        </g>
    );
};

/** Passo 3: ordem fixa × sorteada, com efeito verdadeiro zero (ilustrativo). */
const OrderAxis = () => {
    const x = (v: number) => 440 + v * 90;
    const rows = [
        { y: 235, label: 'ordem fixa: placebo → beterraba', v: 1.2, c: C.risk, note: '+1,2% falso' },
        { y: 285, label: 'sorteada, beterraba em 2º', v: 1.2, c: C.nitrate, note: '+1,2%' },
        { y: 325, label: 'sorteada, beterraba em 1º', v: -1.2, c: C.nitrate, note: '−1,2%' },
    ];
    return (
        <g>
            <SvgText x={VIS_W / 2} y={170} text="Diferença beterraba − placebo (%) · efeito verdadeiro = 0" anchor="middle" size={17} color="#fff" weight={700} />
            {[-2, -1, 0, 1, 2].map(t => (
                <g key={t}>
                    <line x1={x(t)} x2={x(t)} y1={206} y2={388} stroke={t === 0 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.08)'} strokeDasharray={t === 0 ? '5 5' : undefined} />
                    <SvgText x={x(t)} y={414} text={t === 0 ? '0' : t > 0 ? `+${t}` : `−${-t}`} anchor="middle" size={16} color={C.muted} weight={600} />
                </g>
            ))}
            {rows.map((r, i) => (
                <motion.g key={r.label} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 * i, duration: 0.4 }}>
                    <SvgText x={14} y={r.y + 6} text={r.label} size={16} color="#E5E7EB" weight={600} />
                    <circle cx={x(r.v)} cy={r.y} r={11} fill={r.c} stroke="#fff" strokeWidth={2} />
                    <SvgText x={x(r.v) + (r.v > 0 ? 18 : -18)} y={r.y + 6} text={r.note} anchor={r.v > 0 ? 'start' : 'end'} size={16} color={r.c === C.risk ? C.risk : C.nitrateSoft} weight={700} />
                </motion.g>
            ))}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                <SvgText x={14} y={366} text="média da ordem sorteada" size={16} color={C.noSoft} weight={700} />
                <polygon points={`${x(0) - 14},362 ${x(0)},348 ${x(0) + 14},362 ${x(0)},376`} fill={C.no} stroke="#fff" strokeWidth={1.5} />
                <SvgText x={x(0) + 24} y={368} text="zero" size={16} color={C.noSoft} weight={700} />
            </motion.g>
        </g>
    );
};

const TAXA = [
    { name: 'Neisseria', v: 351 },
    { name: 'Rothia', v: 127 },
    { name: 'Prevotella', v: -60 },
    { name: 'Veillonella', v: -65 },
] as const;

/** Passo 4: o que 10 dias de nitrato fizeram com a saliva. */
const TaxaBars = () => {
    const x0 = 230;
    return (
        <g>
            <SvgText x={VIS_W / 2} y={170} text="Saliva após 10 dias de ~12 mmol/dia de nitrato" anchor="middle" size={18} color="#fff" weight={700} />
            <line x1={x0} x2={x0} y1={190} y2={354} stroke="rgba(255,255,255,0.5)" />
            {TAXA.map((t, i) => {
                const y = 198 + i * 40;
                const w = Math.abs(t.v) * 0.95;
                const up = t.v > 0;
                return (
                    <motion.g key={t.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 * i }}>
                        <SvgText x={14} y={y + 22} text={t.name} size={17} color="#E5E7EB" weight={600} />
                        <rect x={up ? x0 : x0 - w} y={y} width={w} height={30} rx={6} fill={up ? C.no : C.bacteria} fillOpacity={0.8} />
                        <SvgText x={up ? x0 + w + 8 : x0 - w - 8} y={y + 22} text={`${up ? '+' : '−'}${Math.abs(t.v)}%`} anchor={up ? 'start' : 'end'} size={17} color="#fff" weight={700} />
                    </motion.g>
                );
            })}
            <rect x={14} y={372} width={VIS_W - 28} height={54} rx={12} fill="rgba(251,191,36,0.08)" stroke={C.nitrite} strokeOpacity={0.6} />
            <SvgText x={VIS_W / 2} y={396} text="a beterraba do 1º braço muda o microbioma" anchor="middle" size={17} color={C.nitriteSoft} weight={700} />
            <SvgText x={VIS_W / 2} y={417} text="que vai ativar o 2º braço" anchor="middle" size={17} color={C.nitriteSoft} weight={700} />
        </g>
    );
};

const CHECKS = ['Cruzado duplo-cego com 32 jogadores', 'Washout de pelo menos 8 dias', 'Placebo: suco depletado de nitrato', 'Desfecho primário único declarado', 'Financiamento público, conflitos: nenhum'];

/** Passo 5: lista de Nyakayiru 2017. */
const GoodCrossover = () => (
    <g>
        <SvgText x={14} y={172} text="Nyakayiru 2017 · 32 futebolistas · Yo-Yo IR1" size={18} color="#fff" weight={700} />
        {CHECKS.map((c, i) => (
            <motion.g key={c} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 * i, duration: 0.35 }}>
                <rect x={14} y={188 + i * 40} width={VIS_W - 28} height={34} rx={10} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
                <circle cx={38} cy={205 + i * 40} r={11} fill="rgba(52,211,153,0.2)" stroke={C.no} />
                <SvgText x={38} y={211 + i * 40} text="✓" anchor="middle" size={16} color={C.no} weight={700} />
                <SvgText x={60} y={211 + i * 40} text={c} size={17} color="#F3F4F6" weight={600} />
            </motion.g>
        ))}
        <SvgText x={VIS_W - 14} y={VIS_H - 4} text="resultado: +3,4% (1.574 → 1.623 m)" anchor="end" size={16} color={C.noSoft} weight={700} />
    </g>
);

export const CrossoverVisual = ({ step, focus }: { step: number; focus: Focus }) => (
    <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Cronograma de um ensaio cruzado">
        <Timeline focus={focus} />
        {rule}
        {step === 0 && <DesignCards />}
        {step === 1 && <LearningBars />}
        {step === 2 && <OrderAxis />}
        {step === 3 && <TaxaBars />}
        {step === 4 && <GoodCrossover />}
    </svg>
);
