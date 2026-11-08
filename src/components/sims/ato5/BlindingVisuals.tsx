import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import { br } from '../kit/format';
import { SvgText } from '../kit/ui';
import { VIS_H, VIS_W } from './ui';

/** Desenhos do BlindingSim. Caixa 672 × 440. */

const PIGMENT = '#B4234F';

/** Passo 1: a escala do índice de Bang com os dois braços de López-Samanes 2026. */
export const BangScale = () => {
    const x = (v: number) => 336 + v * 276;
    const ticks = [-1, -0.5, 0, 0.5, 1];
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Índice de cegamento de Bang">
            <defs>
                <linearGradient id="bang-grad" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0" stopColor={C.bacteria} stopOpacity="0.85" />
                    <stop offset="0.5" stopColor={C.no} stopOpacity="0.9" />
                    <stop offset="1" stopColor={C.risk} stopOpacity="0.9" />
                </linearGradient>
            </defs>
            <SvgText x={VIS_W / 2} y={36} text="Índice de cegamento de Bang" anchor="middle" size={20} color="#fff" weight={700} />
            <SvgText x={VIS_W / 2} y={62} text="“o que você acha que tomou?” · 12 velocistas" anchor="middle" size={16} color={C.muted} weight={500} />

            <rect x={60} y={186} width={552} height={30} rx={15} fill="url(#bang-grad)" />
            {ticks.map(t => (
                <g key={t}>
                    <line x1={x(t)} x2={x(t)} y1={216} y2={226} stroke="rgba(255,255,255,0.6)" />
                    <SvgText x={x(t)} y={248} text={t === 0 ? '0' : t > 0 ? br(t, Number.isInteger(t) ? 0 : 1) : `−${br(-t, Number.isInteger(t) ? 0 : 1)}`}
                        anchor="middle" size={17} color={C.muted} weight={600} />
                </g>
            ))}
            <SvgText x={60} y={282} text="−1  palpite invertido" size={16} color={C.bacteria} weight={600} />
            <SvgText x={336} y={282} text="0  cego perfeito" anchor="middle" size={16} color={C.noSoft} weight={700} />
            <SvgText x={612} y={282} text="1  cego quebrado" anchor="end" size={16} color={C.risk} weight={600} />

            {[{ v: 0.08, c: C.nitrate, label: 'beterraba', anchor: 'end' as const, dx: -10, delay: 0.5 },
              { v: 0.16, c: C.placebo, label: 'placebo', anchor: 'start' as const, dx: 10, delay: 0.1 }].map(p => (
                <motion.g key={p.label} initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: p.delay }}>
                    <line x1={x(p.v)} x2={x(p.v)} y1={170} y2={201} stroke={p.c} strokeWidth={2.5} />
                    <circle cx={x(p.v)} cy={201} r={12} fill={p.c} stroke="#fff" strokeWidth={2.5} />
                    <SvgText x={x(p.v) + p.dx} y={160} text={`${p.label} ${br(p.v, 2)}`} anchor={p.anchor} size={18} color="#fff" weight={700} />
                </motion.g>
            ))}

            <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.5 }}>
                {[{ x0: 60, n: '0,16', t: 'braço placebo', c: C.placebo }, { x0: 348, n: '0,08', t: 'braço beterraba', c: C.nitrate }].map(card => (
                    <g key={card.t}>
                        <rect x={card.x0} y={312} width={264} height={96} rx={14} fill="rgba(255,255,255,0.04)" stroke={card.c} strokeOpacity={0.6} />
                        <SvgText x={card.x0 + 20} y={366} text={card.n} size={44} color="#fff" weight={700} />
                        <SvgText x={card.x0 + 112} y={348} text={card.t} size={17} color={card.c === C.placebo ? '#E5E7EB' : C.nitrateSoft} weight={700} />
                        <SvgText x={card.x0 + 112} y={374} text="quase perfeito" size={16} color={C.muted} weight={500} />
                        <SvgText x={card.x0 + 112} y={394} text="segundo os autores" size={16} color={C.muted} weight={500} />
                    </g>
                ))}
            </motion.g>
        </svg>
    );
};

/** Probabilidade binomial P(X = k) para n = 10 e p = 0,5. */
const BINOM = [1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1].map(c => c / 1024);

/** Passo 2: a urna de acertos (3 de 10) ao lado da distribuição do chute puro. */
export const UrnVsChance = () => {
    const reduce = useReducedMotion() ?? false;
    const rows = [{ n: 4, y: 318 }, { n: 3, y: 280 }, { n: 3, y: 242 }];
    const correct = new Set([1, 5, 8]);
    let idx = 0;
    const balls = rows.flatMap(r => Array.from({ length: r.n }, (_, i) => {
        const k = idx++;
        return { k, cx: 140 + (i - (r.n - 1) / 2) * 40, cy: r.y, ok: correct.has(k) };
    }));
    const bx = (k: number) => 322 + k * 31;
    const baseY = 318;
    const hOf = (p: number) => (p / 0.25) * 170;
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Três acertos em dez, comparados ao acaso">
            <SvgText x={140} y={34} text="Os 10 escaladores" anchor="middle" size={19} color="#fff" weight={700} />
            <path d="M52 204 H228 V336 Q228 356 208 356 H72 Q52 356 52 336 Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
            <rect x={44} y={194} width={192} height={14} rx={7} fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.4)" />
            {balls.map(b => (
                <motion.g key={b.k} initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : 0.12 * b.k }}>
                    <circle cx={b.cx} cy={b.cy} r={17} fill={b.ok ? C.no : C.placebo} fillOpacity={b.ok ? 0.95 : 0.55} stroke="#fff" strokeOpacity={0.6} />
                </motion.g>
            ))}
            <circle cx={64} cy={388} r={8} fill={C.no} />
            <SvgText x={80} y={394} text="acertou: 3" size={17} color={C.noSoft} weight={700} />
            <circle cx={64} cy={416} r={8} fill={C.placebo} fillOpacity={0.6} />
            <SvgText x={80} y={422} text="errou: 7" size={17} color="#E5E7EB" weight={600} />

            <SvgText x={482} y={34} text="Se todos chutassem" anchor="middle" size={19} color="#fff" weight={700} />
            <SvgText x={482} y={58} text="acertos em 10 palpites entre 2 opções" anchor="middle" size={16} color={C.muted} weight={500} />
            <line x1={308} x2={640} y1={baseY} y2={baseY} stroke="rgba(255,255,255,0.3)" />
            {BINOM.map((p, k) => (
                <motion.rect key={k} x={bx(k)} width={25} rx={4} y={baseY - hOf(p)} height={hOf(p)}
                    fill={k <= 3 ? C.no : C.placebo} fillOpacity={k === 3 ? 0.95 : k < 3 ? 0.55 : 0.35}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : 0.6 + 0.04 * k }} />
            ))}
            {[0, 2, 4, 6, 8, 10].map(k => <SvgText key={k} x={bx(k) + 12.5} y={baseY + 24} text={String(k)} anchor="middle" size={17} color={C.muted} weight={600} />)}
            <line x1={bx(5) + 12.5} x2={bx(5) + 12.5} y1={100} y2={baseY} stroke="rgba(255,255,255,0.5)" strokeDasharray="5 5" />
            <SvgText x={bx(5) + 20} y={114} text="esperado: 5" size={17} color="#E5E7EB" weight={700} />
            <SvgText x={bx(3) + 12.5} y={baseY - hOf(BINOM[3]) - 12} text="observado: 3" anchor="middle" size={17} color="#fff" weight={700} />
            <path d={`M${bx(0)} ${baseY + 40} V${baseY + 50} H${bx(3) + 25} V${baseY + 40}`} stroke={C.noSoft} strokeWidth={2} fill="none" />
            <SvgText x={bx(0)} y={baseY + 76} text="3 ou menos: 17% das vezes (cálculo)" size={17} color={C.noSoft} weight={700} />
        </svg>
    );
};

const PERSON_IDS = Array.from({ length: 100 }, (_, i) => i);
const BEETURIC = new Set([13, 37, 62, 88]);

const Grid = ({ x0, title, color, reduce }: { x0: number; title: string; color: string; reduce: boolean }) => (
    <g>
        <SvgText x={x0 + 110} y={96} text={title} anchor="middle" size={18} color={color} weight={700} />
        {PERSON_IDS.map(i => {
            const cx = x0 + (i % 10) * 22 + 11;
            const cy = 116 + Math.floor(i / 10) * 22 + 11;
            const red = BEETURIC.has(i);
            return (
                <circle key={i} cx={cx} cy={cy} r={red ? 9 : 7.5} fill={red ? PIGMENT : C.placebo} fillOpacity={red ? 1 : 0.4}
                    stroke={red ? '#fff' : 'none'} strokeWidth={red ? 1.6 : 0}>
                    {red && !reduce && <animate attributeName="fill-opacity" values="1;0.55;1" dur="2.2s" repeatCount="indefinite" />}
                </circle>
            );
        })}
    </g>
);

/** Passo 3: 100 pessoas, 4 com urina vermelha, as mesmas nos dois braços. */
export const BeeturiaGrids = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Quatro em cem com beterrúria, nos dois braços">
            <SvgText x={VIS_W / 2} y={34} text="100 pessoas, 4 com urina visivelmente vermelha" anchor="middle" size={19} color="#fff" weight={700} />
            <Grid x0={34} title="braço beterraba" color={C.nitrateSoft} reduce={reduce} />
            <Grid x0={418} title="braço placebo depletado" color="#E5E7EB" reduce={reduce} />
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
                <path d="M262 246 H410" stroke={C.placebo} strokeWidth={2} strokeDasharray="6 5" />
                <path d="M400 238 L412 246 L400 254" stroke={C.placebo} strokeWidth={2} fill="none" />
                <SvgText x={336} y={206} text="as mesmas 4" anchor="middle" size={17} color="#fff" weight={700} />
                <SvgText x={336} y={228} text="pessoas" anchor="middle" size={17} color="#fff" weight={700} />
            </motion.g>
            <circle cx={44} cy={388} r={8} fill={PIGMENT} stroke="#fff" strokeWidth={1.6} />
            <SvgText x={60} y={394} text="urina vermelha" size={17} color="#F9A8D4" weight={700} />
            <SvgText x={44} y={424} text="A resina tirou o ânion, não o pigmento: o placebo continua vermelho." size={16} color={C.muted} weight={500} />
        </svg>
    );
};

const REPORT_ROWS = [
    { who: 'López-Samanes 2026', sub: '12 velocistas', measured: true, shown: true, result: 'Bang 0,16 e 0,08' },
    { who: 'Berlanga 2023', sub: '10 escaladores', measured: true, shown: true, result: '3 de 10 acertaram' },
    { who: 'Brennan 2026', sub: '18 mulheres treinadas', measured: true, shown: false, result: 'avaliou; o número não aparece' },
    { who: 'Xie 2026', sub: '45 ECRs em atletas', measured: false, shown: false, result: '13 com reservas sobre placebo, cego ou enxaguante' },
] as const;

const Mark = ({ ok, unknown = false }: { ok: boolean; unknown?: boolean }) => (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full font-mono text-[18px] font-bold"
        style={{ background: unknown ? 'rgba(148,163,184,0.2)' : ok ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)', color: unknown ? C.placebo : ok ? C.no : C.risk }}>
        {unknown ? '–' : ok ? '✓' : '✕'}
    </span>
);

/** Passo 4: quem mediu e quem mostrou o número do cego. */
export const ReportTable = () => (
    <div className="h-full p-4 flex flex-col gap-2.5">
        <div className="grid grid-cols-[1fr_74px_92px_1.2fr] gap-2 px-3 text-[15px] text-gray-300">
            <span>Estudo</span><span className="text-center">mediu</span><span className="text-center">mostrou</span><span>o que aparece</span>
        </div>
        {REPORT_ROWS.map((r, i) => (
            <motion.div key={r.who} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * i, duration: 0.35 }}
                className="grid grid-cols-[1fr_74px_92px_1.2fr] items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="leading-tight">
                    <span className="block text-[16px] font-semibold text-gray-100">{r.who}</span>
                    <span className="block text-[15px] text-gray-400">{r.sub}</span>
                </span>
                <span className="text-center"><Mark ok={r.measured} unknown={i === 3} /></span>
                <span className="text-center"><Mark ok={r.shown} unknown={i === 3} /></span>
                <span className="text-[15px] leading-snug text-gray-200">{r.result}</span>
            </motion.div>
        ))}
        <p className="mt-auto text-[15px] leading-snug text-gray-300">
            Bang 2004: apesar de milhares de ensaios “duplo-cegos” por ano, medir a eficácia do cegamento raramente é discutido.
        </p>
    </div>
);
