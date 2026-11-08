import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { C } from '../kit/palette';
import { br } from '../kit/format';
import { VIS_H, VIS_W } from './ui';
import { Glow, T } from './arte/text';
import { Glass, NitrateDots, VesselDefs } from './arte/vessels';

/** Desenhos dos passos 2 e 3 do PlaceboSim (o 4 e o 5 ficam em PlaceboHistory e PlaceboJuiceSalt). Caixa 672 × 440. */

const fade = (i: number) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.12 * i } });

/** Ícone de instrumento: traço claro dentro de um disco com anel verde. */
const Icon = ({ kind, cx, cy }: { kind: string; cx: number; cy: number }) => {
    const s = { stroke: '#E5E7EB', strokeWidth: 2.4, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
    return (
        <g transform={`translate(${cx} ${cy})`}>
            {kind === 'cor' && <><rect x={-13} y={-10} width={26} height={20} rx={4} fill="url(#sj-spec)" /><path d="M-13 14H13" {...s} /></>}
            {kind === 'sabor' && <><circle cx={0} cy={-6} r={8} {...s} /><path d="M0 2V14" {...s} /></>}
            {kind === 'acucar' && <><path d="M-10 -4L0 -10L10 -4V8L0 14L-10 8Z" {...s} /><path d="M-10 -4L0 2L10 -4M0 2V14" {...s} /></>}
            {kind === 'rmn' && <path d="M-14 4C-9 -14 -5 -14 0 4S9 22 14 -4" {...s} />}
            {kind === 'asc' && <><circle cx={0} cy={0} r={12} {...s} /><path d="M5 -5A6 6 0 1 0 5 5" {...s} /></>}
        </g>
    );
};

const TESTS = [
    { kind: 'cor', x: 72, label: 'Cor (UV-vis)', lines: ['dentro da variação', 'entre cultivares'] },
    { kind: 'sabor', x: 204, label: 'Sabor', lines: ['sem diferença', 'no teste cego'] },
    { kind: 'acucar', x: 336, label: 'Açúcar', lines: ['sem diferença'] },
    { kind: 'rmn', x: 468, label: 'RMN de próton', lines: ['sem diferença'] },
    { kind: 'asc', x: 600, label: 'Ascorbato', lines: ['indetectável', 'nos dois'] },
] as const;

/** Passo 2: cinco instrumentos medem os dois copos; todos dizem "igual", exceto o nitrato. */
export const SameJuice = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Cinco medidas iguais nos dois sucos; só o nitrato difere">
            <VesselDefs />
            <defs>
                <linearGradient id="sj-spec" x1="0" x2="1"><stop offset="0" stopColor={C.nitrate} /><stop offset="0.5" stopColor={C.nitrite} /><stop offset="1" stopColor={C.no} /></linearGradient>
            </defs>
            {TESTS.map((t, i) => (
                <motion.g key={t.kind} {...fade(i)}>
                    <path d={`M${t.x} 148C${t.x} 190 336 190 336 214`} fill="none" stroke={C.no} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="5 7">
                        {!reduce && <animate attributeName="stroke-dashoffset" values="0;-24" dur="1.4s" repeatCount="indefinite" />}
                    </path>
                    <circle cx={t.x} cy={44} r={28} fill="rgba(52,211,153,0.12)" stroke={C.no} strokeWidth={2.4} />
                    <Icon kind={t.kind} cx={t.x} cy={44} />
                    <T x={t.x} y={96} size={17} color="#fff" weight={700} anchor="middle">{t.label}</T>
                    {t.lines.map((l, j) => <T key={l} x={t.x} y={117 + 20 * j} size={16} color={C.noSoft} weight={600} anchor="middle">{l}</T>)}
                </motion.g>
            ))}

            <Glow id="sj-g1" cx={232} cy={250} r={100} color={C.nitrate} opacity={0.22} />
            <Glow id="sj-g2" cx={440} cy={250} r={100} color={C.nitrate} opacity={0.22} />
            <Glass id="sj-a" x={182} y={176} w={100} h={124} level={0.82} />
            <Glass id="sj-b" x={390} y={176} w={100} h={124} level={0.82} />
            <T x={232} y={324} size={17} color="#fff" weight={700} anchor="middle">Suco de beterraba</T>
            <T x={440} y={324} size={17} color="#fff" weight={700} anchor="middle">Placebo depletado</T>
            <motion.g initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 16 }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                <circle cx={336} cy={244} r={30} fill="rgba(52,211,153,0.16)" stroke={C.no} strokeWidth={3} />
                <path d="M322 238H350M322 250H350" stroke={C.noSoft} strokeWidth={5} strokeLinecap="round" />
            </motion.g>

            <motion.g {...fade(6)}>
                <rect x={14} y={346} width={VIS_W - 28} height={86} rx={16} fill="rgba(240,67,126,0.1)" stroke={C.nitrate} strokeOpacity={0.75} strokeWidth={1.6} />
                <T x={40} y={378} size={30} color={C.nitrate} weight={700} display>7,5 mmol</T>
                <rect x={40} y={390} width={226} height={11} rx={5.5} fill="url(#av-juice)" />
                <T x={VIS_W - 40} y={378} size={30} color="#E5E7EB" weight={700} anchor="end" display>0,002 mmol</T>
                <rect x={VIS_W - 40 - 226} y={390} width={226} height={11} rx={5.5} fill="rgba(255,255,255,0.08)" />
                <rect x={VIS_W - 40 - 226} y={390} width={3} height={11} rx={1.5} fill={C.nitrate} />
                <T x={VIS_W / 2} y={382} size={32} color={C.nitrateSoft} weight={700} anchor="middle" display>≠</T>
                <T x={VIS_W / 2} y={422} size={16} color={C.nitrateSoft} weight={700} anchor="middle">nitrato por 250 mL: a única diferença</T>
            </motion.g>
        </svg>
    );
};

const ARMS = [
    { id: 'ctl', x: 112, name: 'Controle', sub: 'nada', color: C.placebo, o2: 0.87, ghost: true, dots: 0 },
    { id: 'pl', x: 336, name: 'Suco depletado', sub: '~0,003 mmol', color: C.placebo, o2: 0.87, ghost: false, dots: 2 },
    { id: 'br', x: 560, name: 'Suco de beterraba', sub: '~6,2 mmol', color: C.nitrate, o2: 0.7, ghost: false, dots: 16 },
] as const;
const DIAL_R = 58;
const DIAL_Y = 118;

/** Mostrador do custo de O₂: a agulha gira da esquerda (baixo) até o valor medido. */
const Dial = ({ cx, o2, color, ghost, reduce }: { cx: number; o2: number; color: string; ghost: boolean; reduce: boolean }) => {
    const sweep = ((o2 - 0.5) / 0.45) * 180;
    const tip = { x: cx - DIAL_R + 10, y: DIAL_Y };
    return (
        <g>
            <path d={`M${cx - DIAL_R} ${DIAL_Y}A${DIAL_R} ${DIAL_R} 0 0 1 ${cx + DIAL_R} ${DIAL_Y}`} fill="none" stroke="url(#ta-dial)" strokeWidth={12} strokeLinecap="round" strokeOpacity={0.85} />
            <path d={`M${cx - DIAL_R + 14} ${DIAL_Y}A${DIAL_R - 14} ${DIAL_R - 14} 0 0 1 ${cx + DIAL_R - 14} ${DIAL_Y}`} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
            <g transform={reduce ? `rotate(${sweep} ${cx} ${DIAL_Y})` : undefined}>
                <line x1={cx} y1={DIAL_Y} x2={tip.x} y2={tip.y} stroke={color} strokeWidth={4.5} strokeLinecap="round" strokeDasharray={ghost ? '6 5' : undefined} />
                {!reduce && <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${DIAL_Y}`} to={`${sweep} ${cx} ${DIAL_Y}`} begin="0.35s" dur="1s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.2 0.8 0.2 1" />}
            </g>
            <circle cx={cx} cy={DIAL_Y} r={8} fill={color} stroke="#fff" strokeWidth={2} />
        </g>
    );
};

const Link = ({ x, children, color }: { x: number; children: ReactNode; color: string }) => (
    <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx={x} cy={104} r={19} fill="#07050B" stroke={color} strokeWidth={2.5} />
        <T x={x} y={113} size={26} color={color} weight={700} anchor="middle" display>{children}</T>
    </motion.g>
);

/** Passo 3: três braços, três mostradores de O₂ e três copos. */
export const ThreeArms = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Três braços: controle, depletado e beterraba">
            <VesselDefs />
            <defs>
                <linearGradient id="ta-dial" x1="0" x2="1"><stop offset="0" stopColor={C.no} /><stop offset="0.55" stopColor={C.nitrite} /><stop offset="1" stopColor={C.hypoxia} /></linearGradient>
            </defs>
            <T x={VIS_W / 2} y={26} size={18} color="#E5E7EB" weight={700} anchor="middle">Custo de O₂ da caminhada em esteira (L/min)</T>
            <Glow id="ta-g" cx={560} cy={236} r={110} color={C.nitrate} opacity={0.28} pulse={!reduce} />
            {ARMS.map((a, i) => (
                <motion.g key={a.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.18 * i }}>
                    <Dial cx={a.x} o2={a.o2} color={a.id === 'br' ? C.nitrate : '#CBD5E1'} ghost={a.ghost} reduce={reduce} />
                    <T x={a.x} y={152} size={a.ghost ? 16 : 24} color={a.id === 'br' ? C.nitrateSoft : '#E5E7EB'} weight={700} anchor="middle" display={!a.ghost}>{a.ghost ? '≈ depletado' : br(a.o2, 2)}</T>
                    <Glass id={`ta-${a.id}`} x={a.x - 48} y={176} w={96} h={118} level={0.8} ghost={a.ghost}>
                        <NitrateDots x={a.x - 40} y={206} w={80} h={84} count={a.dots} r={3.2} reduce={reduce} />
                    </Glass>
                    <T x={a.x} y={322} size={17} color="#F3F4F6" weight={700} anchor="middle">{a.name}</T>
                    <T x={a.x} y={343} size={16} color={C.muted} weight={500} anchor="middle">{a.sub}</T>
                </motion.g>
            ))}
            <Link x={224} color={C.noSoft}>=</Link>
            <Link x={448} color={C.nitrate}>≠</Link>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.4 }}>
                <path d="M112 356V366H336V356" stroke={C.placebo} strokeWidth={2} fill="none" />
                <T x={224} y={390} size={17} color="#fff" weight={700} anchor="middle">controle = depletado</T>
                <T x={224} y={410} size={16} color={C.muted} weight={500} anchor="middle">nitrito, pressão e exercício iguais</T>
                <path d="M560 356V366" stroke={C.nitrate} strokeWidth={2} fill="none" />
                <T x={560} y={390} size={17} color={C.nitrateSoft} weight={700} anchor="middle">só o nitrato mudou</T>
                <T x={560} y={410} size={16} color={C.nitrite} weight={600} anchor="middle">nitrito 183 → 373 nM</T>
            </motion.g>
            <T x={VIS_W / 2} y={VIS_H - 6} size={16} color={C.muted} weight={500} anchor="middle">betalaínas, polifenóis, potássio e açúcar: nos dois sucos</T>
        </svg>
    );
};
