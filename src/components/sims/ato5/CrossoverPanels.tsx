import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { VIS_W } from './ui';
import { T } from './arte/text';
import { Count, SvgKeyFact } from './countText';
import { Ord } from './svgOrderA';

/** Quadros dos passos 1 a 3 do CrossoverSim (abaixo do cronograma). Coordenadas absolutas na caixa 672 × 440. */

const TILE_W = 208;

/** Passo 1: três exigências do desenho, cada uma com o seu ícone. */
const TILES = [
    { n: '7 dias', c: C.nitrite, lines: ['washout mediano', 'faixa de 4 a 14 dias', 'nos 45 ECRs'] },
    { n: '24–48 h', c: C.no, lines: ['sem alimentos ricos', 'em nitrato antes do teste', 'e sem enxaguante'] },
    { n: '95%', c: C.o2, lines: ['com sessão-controle', 'sem suplemento', '(80 estudos)'] },
] as const;

const Calendar = ({ cx, cy }: { cx: number; cy: number }) => (
    <g>
        <rect x={cx - 24} y={cy - 20} width={48} height={42} rx={8} fill="rgba(251,191,36,0.12)" stroke={C.nitrite} strokeWidth={2.4} />
        <path d={`M${cx - 24} ${cy - 7}H${cx + 24}`} stroke={C.nitrite} strokeWidth={2.4} />
        <path d={`M${cx - 12} ${cy - 26}V${cy - 14}M${cx + 12} ${cy - 26}V${cy - 14}`} stroke={C.nitrite} strokeWidth={4} strokeLinecap="round" />
        {[-12, 0, 12].map(dx => [4, 14].map(dy => <circle key={`${dx}${dy}`} cx={cx + dx} cy={cy + dy} r={2.6} fill={C.nitriteSoft} fillOpacity={dx === 12 && dy === 14 ? 1 : 0.5} />))}
    </g>
);

/** Folha e frasco de enxaguante, cada um cortado por uma barra vermelha. */
const NoRinse = ({ cx, cy }: { cx: number; cy: number }) => (
    <g>
        {[-30, 30].map((dx, i) => (
            <g key={dx}>
                <circle cx={cx + dx} cy={cy} r={21} fill="rgba(52,211,153,0.1)" stroke={C.no} strokeWidth={2.2} />
                {i === 0 ? <path d={`M${cx + dx - 9} ${cy + 8}C${cx + dx - 11} ${cy - 8} ${cx + dx} ${cy - 11} ${cx + dx + 10} ${cy - 11}C${cx + dx + 10} ${cy} ${cx + dx + 2} ${cy + 10} ${cx + dx - 9} ${cy + 8}Z`} fill={C.no} fillOpacity={0.7} />
                    : <g><rect x={cx + dx - 6} y={cy - 4} width={12} height={15} rx={3} fill={C.o2} fillOpacity={0.7} /><rect x={cx + dx - 3} y={cy - 10} width={6} height={6} rx={1} fill="#CBD5E1" /></g>}
                <path d={`M${cx + dx - 15} ${cy + 15}L${cx + dx + 15} ${cy - 15}`} stroke={C.risk} strokeWidth={3.2} strokeLinecap="round" />
            </g>
        ))}
    </g>
);

const Ring = ({ cx, cy }: { cx: number; cy: number }) => {
    const r = 23;
    const len = 2 * Math.PI * r;
    return (
        <g transform={`rotate(-90 ${cx} ${cy})`}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={7} />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.o2} strokeWidth={7} strokeLinecap="round" strokeDasharray={`${len * 0.95} ${len}`} />
        </g>
    );
};

export const DesignPanel = () => (
    <g>
        {TILES.map((t, i) => {
            const x0 = 14 + i * (TILE_W + 10);
            const cx = x0 + TILE_W / 2;
            return (
                <motion.g key={t.n} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 * i, duration: 0.4 }}>
                    <rect x={x0} y={258} width={TILE_W} height={174} rx={16} fill="rgba(255,255,255,0.035)" stroke={t.c} strokeOpacity={0.6} strokeWidth={1.6} />
                    {i === 0 && <Calendar cx={cx} cy={296} />}
                    {i === 1 && <NoRinse cx={cx} cy={292} />}
                    {i === 2 && <Ring cx={cx} cy={292} />}
                    <Ord at={0.12 * i + 0.16}>
                        {i === 0 ? (
                            <SvgKeyFact color={C.nitrite} delay={0.4}>
                                <T x={cx} y={356} size={32} color={t.c} weight={700} anchor="middle" display><Count text={t.n} delayMs={160} ms={700} /></T>
                            </SvgKeyFact>
                        ) : <T x={cx} y={356} size={32} color={t.c} weight={700} anchor="middle" display><Count text={t.n} delayMs={120 * i + 160} ms={700} /></T>}
                    </Ord>
                    <Ord at={0.12 * i + 0.32}>
                        {t.lines.map((l, j) => <T key={l} x={cx} y={382 + 19 * j} size={16} color={j === 0 ? '#fff' : C.muted} weight={j === 0 ? 700 : 500} anchor="middle">{l}</T>)}
                    </Ord>
                </motion.g>
            );
        })}
    </g>
);

/** Passo 2: a curva de aprendizado: o salto da 1ª para a 2ª tentativa, depois quase nada. */
const POINTS = [[70, 392], [160, 340], [250, 332], [340, 324]] as const;
const CURVE = `M${POINTS[0][0]} ${POINTS[0][1]}C115 392 115 340 ${POINTS[1][0]} ${POINTS[1][1]}S205 333 ${POINTS[2][0]} ${POINTS[2][1]}S295 325 ${POINTS[3][0]} ${POINTS[3][1]}`;

const Gift = ({ cx, cy }: { cx: number; cy: number }) => (
    <g>
        <rect x={cx - 15} y={cy - 4} width={30} height={22} rx={4} fill="rgba(251,191,36,0.2)" stroke={C.nitrite} strokeWidth={2} />
        <rect x={cx - 17} y={cy - 12} width={34} height={9} rx={3} fill="rgba(251,191,36,0.3)" stroke={C.nitrite} strokeWidth={2} />
        <path d={`M${cx} ${cy - 12}V${cy + 18}`} stroke={C.nitrite} strokeWidth={2.4} />
        <path d={`M${cx} ${cy - 12}C${cx - 12} ${cy - 24} ${cx - 16} ${cy - 10} ${cx} ${cy - 12}C${cx + 12} ${cy - 24} ${cx + 16} ${cy - 10} ${cx} ${cy - 12}`} fill="none" stroke={C.nitrite} strokeWidth={2.2} />
    </g>
);

export const LearningPanel = ({ reduce }: { reduce: boolean }) => (
    <g>
        <line x1={50} x2={410} y1={404} y2={404} stroke="rgba(255,255,255,0.3)" />
        {['1ª', '2ª', '3ª', '4ª'].map((t, i) => <T key={t} x={POINTS[i][0]} y={428} size={16} color={C.muted} weight={600} anchor="middle">{t}</T>)}
        <path d={CURVE} fill="none" stroke="url(#xo-learn)" strokeWidth={5} strokeLinecap="round" strokeDasharray="520" strokeDashoffset={reduce ? 0 : 520}>
            {!reduce && <animate attributeName="stroke-dashoffset" values="520;0" dur="1s" begin="0.1s" fill="freeze" />}
        </path>
        <defs><linearGradient id="xo-learn" gradientUnits="userSpaceOnUse" x1={70} x2={340} y1={0} y2={0}><stop offset="0" stopColor={C.nitrite} /><stop offset="0.5" stopColor={C.nitrite} /><stop offset="1" stopColor={C.placebo} /></linearGradient></defs>
        {POINTS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 1 ? 10 : 7} fill={i < 2 ? C.nitrite : C.placebo} stroke="#fff" strokeWidth={2} />)}
        <Gift cx={96} cy={290} />
        <Ord order={1}>
            <SvgKeyFact color={C.nitrite} delay={0.4}>
                <T x={130} y={284} size={28} color={C.nitrite} weight={700} display><Count text="+1,2%" /></T>
            </SvgKeyFact>
            <T x={296} y={308} size={19} color="#E5E7EB" weight={700} anchor="middle" display><Count text="+0,2%" /></T>
        </Ord>
        <Ord order={2}>
            <T x={130} y={306} size={16} color={C.nitriteSoft} weight={600}>1ª → 2ª tentativa</T>
            <T x={296} y={286} size={16} color="#E5E7EB" weight={600} anchor="middle">seguintes:</T>
        </Ord>

        <rect x={440} y={262} width={218} height={168} rx={14} fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.14)" />
        <T x={549} y={288} size={16} color="#fff" weight={700} anchor="middle">erro típico</T>
        {[{ x: 478, h: 78, c: C.nitrite, n: '1,3×', t: '1ª → 2ª' }, { x: 564, h: 60, c: C.placebo, n: '1×', t: 'seguintes' }].map((b, i) => (
            <motion.g key={b.t} initial={{ opacity: 0, scaleY: 0.3 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: 0.5 + 0.15 * i }} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
                <rect x={b.x} y={400 - b.h} width={58} height={b.h} rx={8} fill={b.c} fillOpacity={0.85} />
                <T x={b.x + 29} y={394 - b.h} size={20} color="#fff" weight={700} anchor="middle" display><Count text={b.n} delayMs={500 + 150 * i} ms={600} /></T>
            </motion.g>
        ))}
        <T x={507} y={422} size={16} color="#E5E7EB" weight={600} anchor="middle">1ª → 2ª</T>
        <T x={593} y={422} size={16} color="#E5E7EB" weight={600} anchor="middle">seguintes</T>
    </g>
);

/** Passo 3: ordem fixa × sorteada, com efeito verdadeiro zero (ilustrativo). */
const X0 = 440;
const U = 80;
const ROWS = [
    { y: 306, label: 'ordem fixa: placebo → beterraba', v: 1.2, c: C.risk, note: '+1,2% falso' },
    { y: 344, label: 'sorteada, beterraba em 2º', v: 1.2, c: C.nitrate, note: '+1,2%' },
    { y: 382, label: 'sorteada, beterraba em 1º', v: -1.2, c: C.nitrate, note: '−1,2%' },
] as const;

export const OrderPanel = () => (
    <g>
        <T x={VIS_W / 2} y={272} size={17} color="#fff" weight={700} anchor="middle">Diferença beterraba − placebo (%) · efeito verdadeiro = 0</T>
        {[-2, -1, 0, 1, 2].map(t => (
            <g key={t}>
                <line x1={X0 + t * U} x2={X0 + t * U} y1={288} y2={420} stroke={t === 0 ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.09)'} strokeDasharray={t === 0 ? '5 5' : undefined} />
                <T x={X0 + t * U} y={434} size={16} color={C.muted} weight={600} anchor="middle">{t === 0 ? '0' : t > 0 ? `+${t}` : `−${-t}`}</T>
            </g>
        ))}
        {ROWS.map((r, i) => (
            <motion.g key={r.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 * i }}>
                <T x={14} y={r.y + 6} size={16} color="#E5E7EB" weight={600}>{r.label}</T>
                <motion.rect x={r.v > 0 ? X0 : X0 + r.v * U} y={r.y - 13} width={Math.abs(r.v) * U} height={26} rx={7} fill={r.c} fillOpacity={0.8} stroke="#fff" strokeOpacity={0.5}
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2 * i + 0.1, duration: 0.5 }} style={{ transformBox: 'fill-box', transformOrigin: r.v > 0 ? 'left' : 'right' }} />
                <T x={X0 + r.v * U + (r.v > 0 ? 10 : -10)} y={r.y + 6} size={16} color={r.c === C.risk ? C.risk : C.nitrateSoft} weight={700} anchor={r.v > 0 ? 'start' : 'end'}><Count text={r.note} delayMs={200 * i + 100} ms={500} /></T>
            </motion.g>
        ))}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <T x={14} y={414} size={16} color={C.noSoft} weight={700}>média da ordem sorteada</T>
            <SvgKeyFact color={C.no} delay={1.0}>
                <polygon points={`${X0 - 14},408 ${X0},394 ${X0 + 14},408 ${X0},422`} fill={C.no} stroke="#fff" strokeWidth={1.5} />
                <T x={X0 + 24} y={414} size={16} color={C.noSoft} weight={700}>zero</T>
            </SvgKeyFact>
        </motion.g>
    </g>
);
