import { motion } from 'framer-motion';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { CONDITIONS, JUDO_STEPS, type Cell, type Condition } from '../judoContent';
import { ConditionIcon, JudoPair } from './Judoka';
import { wrap } from './wrap';

/**
 * Arte do dia de judô (viewBox 1100 × 308): cinco tatames em linha do tempo, o cansaço subindo (ilustrativo),
 * e uma linha por condição com ícones grandes; a faixa colorida atrás mostra em que lutas houve melhora.
 */

export const DOJO_W = 1100;
export const DOJO_H = 300;
const COL = (j: number) => 262 + j * 190;
const ROW_Y = [156, 201, 246] as const;
const ROW_COLOR = { caf: C.hypoxia, bj: C.nitrate, both: C.no } as const;

/** Trechos contíguos de lutas com melhora (para a faixa de efeito). */
const upRuns = (cells: readonly Cell[]): [number, number][] =>
    cells.reduce<[number, number][]>((runs, c, j) => {
        if (c !== 'up') return runs;
        const last = runs[runs.length - 1];
        if (last && last[1] === j - 1) return [...runs.slice(0, -1), [last[0], j]];
        return [...runs, [j, j]];
    }, []);

const Badge = ({ cell }: { cell: Cell }) => {
    if (cell === 'up') return <g><circle r={9} fill={C.ok} /><path d="M -4 2.5 L 0 -3.5 L 4 2.5 Z" fill="#07050B" /></g>;
    if (cell === 'none') return <g><circle r={9} fill={C.risk} /><path d="M -3.5 -3.5 L 3.5 3.5 M 3.5 -3.5 L -3.5 3.5" stroke="#07050B" strokeWidth={2.5} strokeLinecap="round" /></g>;
    return null;
};

const Token = ({ c, j, y, shown, delay }: { c: Condition; j: number; y: number; shown: boolean; delay: number }) => {
    const cell = c.fights[j];
    const color = ROW_COLOR[c.id];
    const x = COL(j);
    if (!shown) return <circle cx={x} cy={y} r={19} fill="none" stroke="rgba(255,255,255,0.14)" strokeDasharray="3 5" />;
    const dim = cell === 'silent';
    return (
        <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, delay }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <circle cx={x} cy={y} r={20} fill={cell === 'up' ? `${color}33` : 'rgba(7,5,11,0.85)'} stroke={cell === 'unknown' ? 'rgba(255,255,255,0.35)' : color}
                strokeWidth={cell === 'up' ? 2.5 : 1.5} strokeDasharray={cell === 'unknown' ? '3 4' : undefined} opacity={dim ? 0.4 : 1}
                style={cell === 'up' ? { filter: `drop-shadow(0 0 8px ${color})` } : undefined} />
            {cell === 'unknown'
                ? <SvgText x={x} y={y + 7} text="?" size={20} weight={700} anchor="middle" color={C.muted} />
                : <g opacity={dim ? 0.35 : 1}><ConditionIcon id={c.id} x={x} y={y} color={color} /></g>}
            <g transform={`translate(${x + 16} ${y - 15})`}><Badge cell={cell} /></g>
        </motion.g>
    );
};

const FATIGUE = (() => {
    const pts = Array.from({ length: 41 }, (_, i) => {
        const t = i / 40;
        return `${(180 + t * 920).toFixed(0)},${(130 - 24 * Math.pow(t, 1.3)).toFixed(1)}`;
    });
    return `M 180 132 L ${pts.join(' L ')} L 1100 132 Z`;
})();

export const DojoArt = ({ step, reduce }: { step: number; reduce: boolean }) => {
    const takeaway = wrap(JUDO_STEPS[step].takeaway, 19);
    return (
        <svg viewBox={`0 0 ${DOJO_W} ${DOJO_H}`} preserveAspectRatio="xMidYMid slice" width="100%" height="100%" role="img" aria-label="Cinco lutas no mesmo dia de judô">
            <defs>
                <linearGradient id="dojo-wall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#1C120C" />
                    <stop offset="1" stopColor="#2A1B10" />
                </linearGradient>
                <linearGradient id="dojo-tired" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor={C.hypoxia} stopOpacity={0.05} />
                    <stop offset="1" stopColor={C.hypoxia} stopOpacity={0.75} />
                </linearGradient>
            </defs>
            <rect x={-20} y={-10} width={1140} height={80} fill="url(#dojo-wall)" />
            <rect x={-20} y={70} width={1140} height={28} fill="#14361F" />
            {Array.from({ length: 24 }, (_, i) => <line key={i} x1={i * 48} x2={i * 48 - 10} y1={70} y2={98} stroke="#0B2414" strokeWidth={2} />)}
            {[0, 1, 2, 3, 4].map(j => (
                <g key={j}>
                    <path d={`M ${COL(j) - 74} 96 L ${COL(j) - 60} 74 L ${COL(j) + 60} 74 L ${COL(j) + 74} 96 Z`} fill="#3F6B2A" opacity={0.55} stroke="#A3E635" strokeOpacity={0.35} />
                    <JudoPair x={COL(j)} y={88} s={1} sweat={j} reduce={reduce} delay={j * 0.35} />
                    <SvgText x={COL(j)} y={22} text={`Luta ${j + 1}`} size={18} weight={700} anchor="middle" color="#fff" />
                </g>
            ))}
            <path d={FATIGUE} fill="url(#dojo-tired)" />
            <SvgText x={16} y={126} text="cansaço (ilustrativo)" size={16} weight={600} color={C.hypoxia} />
            {takeaway.map((l, i) => <SvgText key={l} x={16} y={26 + i * 20} text={l} size={16} weight={700} color={C.nitriteSoft} />)}
            {CONDITIONS.map((c, ri) => {
                const shown = step >= c.fromStep;
                const color = ROW_COLOR[c.id];
                const y = ROW_Y[ri];
                const current = step === c.fromStep;
                return (
                    <g key={c.id}>
                        {shown && upRuns(c.fights).map(([a, b]) => (
                            <motion.rect key={a} x={COL(a) - 40} y={y - 24} width={COL(b) - COL(a) + 80} height={48} rx={24}
                                fill={color} stroke={color} strokeOpacity={0.5} initial={{ opacity: 0 }} animate={{ opacity: current ? 0.24 : 0.12 }}
                                transition={{ duration: 0.6, delay: reduce ? 0 : 0.3 }} />
                        ))}
                        <ConditionIcon id={c.id} x={34} y={y} color={color} s={0.9} />
                        <SvgText x={58} y={y + 6} text={c.name} size={17} weight={700} color={shown ? color : '#6B7280'} />
                        {[0, 1, 2, 3, 4].map(j => <Token key={j} c={c} j={j} y={y} shown={shown} delay={reduce ? 0 : 0.1 + j * 0.08} />)}
                    </g>
                );
            })}
            <SvgText x={16} y={287} text="▲ melhorou · ✕ não melhorou (dito no resumo) · apagado: sem melhora relatada · ? luta 4 não descrita"
                size={15} weight={500} color="#CBD5E1" />
            <SvgText x={1084} y={287} text="vs placebo · SJFT, neuromuscular, cognição" size={15} weight={500} anchor="end" color={C.muted} />
            {step === 4 && (
                <motion.g initial={{ opacity: 0, scale: reduce ? 1 : 1.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduce ? 0 : 0.45 }}
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                    <g transform="rotate(-7 830 206)">
                        <rect x={680} y={160} width={300} height={92} rx={10} fill="rgba(7,5,11,0.86)" stroke={C.nitrite} strokeWidth={4} />
                        <text x={830} y={210} textAnchor="middle" fontSize={46} fontWeight={700} fill={C.nitrite} letterSpacing={3} style={{ fontFamily: 'var(--font-display)' }}>HIPÓTESE</text>
                        <SvgText x={830} y={238} text="estudo único · sem réplica" size={17} weight={600} anchor="middle" color={C.nitriteSoft} />
                    </g>
                </motion.g>
            )}
        </svg>
    );
};
