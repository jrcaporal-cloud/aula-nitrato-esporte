import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import { VIS_H, VIS_W } from './ui';
import { Person } from './arte/figures';
import { Glow, T } from './arte/text';
import { MEN, WOMEN } from './SexVisuals';

/** Passo 5 do SexGapSim: a Helena (caso fictício) diante do campo de dados, em escala (1.179 × 156). Caixa 672 × 440. */

const ROWS = 11;
const COLS = 122;
const STEP = 4.9;
const FIELD_X = 36;
const FIELD_Y = 44;

/** Campo de pontos em escala: 1.179 azuis e 156 rosa, preenchidos por coluna (cada ponto é um participante). */
const fieldPath = (from: number, to: number) => {
    const parts: string[] = [];
    for (let i = from; i < to; i++) parts.push(`M${(FIELD_X + Math.floor(i / ROWS) * STEP).toFixed(1)} ${(FIELD_Y + (i % ROWS) * STEP).toFixed(1)}h0`);
    return parts.join('');
};
const MEN_PATH = fieldPath(0, 1179);
const WOMEN_PATH = fieldPath(1179, 1335);

/** Larguras e posições dos três cartões (o terceiro tem a frase mais longa). */
const CARD_X = [14, 224, 428] as const;
const CARD_WS = [202, 196, 230] as const;

/** Faixa de aptidão: a Helena (VO₂max ~38) fica no lado baixo. */
const Fitness = ({ x0 }: { x0: number }) => (
    <g>
        <defs><linearGradient id="sh-fit" x1="0" x2="1"><stop offset="0" stopColor={C.no} /><stop offset="1" stopColor={C.hypoxia} stopOpacity="0.5" /></linearGradient></defs>
        <rect x={x0 + 14} y={316} width={166} height={10} rx={5} fill="url(#sh-fit)" />
        <T x={x0 + 14} y={344} size={16} color={C.noSoft} weight={700}>baixa</T>
        <T x={x0 + 182} y={344} size={16} color={C.muted} weight={500} anchor="end">alta</T>
        <circle cx={x0 + 14 + 0.28 * 166} cy={321} r={9} fill={WOMEN} stroke="#fff" strokeWidth={2.4} />
    </g>
);

/** 111 conjuntos pequenos, 6 só de mulheres. */
const FewSets = ({ x0 }: { x0: number }) => (
    <g>
        {Array.from({ length: 111 }, (_, i) => (
            <rect key={i} x={x0 + 14 + (i % 37) * 4.4} y={314 + Math.floor(i / 37) * 6} width={3.6} height={4.6} rx={1} fill={i >= 105 ? WOMEN : MEN} fillOpacity={i >= 105 ? 1 : 0.4} />
        ))}
    </g>
);

const SameBars = ({ x0 }: { x0: number }) => (
    <g>
        <rect x={x0 + 14} y={314} width={164} height={8} rx={4} fill={MEN} fillOpacity={0.8} />
        <rect x={x0 + 14} y={328} width={164} height={8} rx={4} fill={WOMEN} fillOpacity={0.8} />
    </g>
);

const CARDS = [
    { t: 'Aptidão baixa', c: C.no, lines: ['efeito costuma aparecer:', '~3% perto de VO₂pico 40', '(dado secundário)'] },
    { t: 'Poucas mulheres', c: C.nitrite, lines: ['156 participantes e 6', 'conjuntos só de', 'mulheres, em 80 estudos'] },
    { t: 'Sem dado ≠ sem efeito', c: C.nitrite, lines: ['He 2026: sem diferença', 'entre sexos; Fry e Brennan:', 'nada, com ciclo controlado'] },
] as const;

export const HelenaCard = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Helena diante de um campo de dados quase só de homens">
            <T x={FIELD_X} y={30} size={16} color={MEN} weight={700}>1.179 homens</T>
            <T x={FIELD_X + COLS * STEP - 40} y={30} size={16} color={WOMEN} weight={700} anchor="end">156 mulheres</T>
            <path d={MEN_PATH} stroke={MEN} strokeOpacity={0.55} strokeWidth={3.2} strokeLinecap="round" />
            <path d={WOMEN_PATH} stroke={WOMEN} strokeWidth={3.4} strokeLinecap="round" />

            {/* Helena em meio ao vazio */}
            <Glow id="sh-hg" cx={96} cy={196} r={96} color={C.nitrate} opacity={0.45} pulse={!reduce} />
            <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                <ellipse cx={96} cy={238} rx={34} ry={6} fill="rgba(0,0,0,0.5)" />
                <Person cx={96} cy={196} s={3.5} color={WOMEN} woman />
            </motion.g>
            <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.4 }}>
                <T x={160} y={164} size={30} color={WOMEN} weight={700} display>Helena</T>
                <T x={160} y={192} size={17} color="#E5E7EB" weight={500}>41 anos · corredora recreacional</T>
                <T x={160} y={216} size={17} color="#E5E7EB" weight={500}>VO₂max ~38 · primeira meia maratona</T>
            </motion.g>
            <path d="M472 150C520 150 560 140 588 108" fill="none" stroke={C.nitrite} strokeWidth={2.4} strokeDasharray="6 7" strokeLinecap="round">
                {!reduce && <animate attributeName="stroke-dashoffset" values="0;-26" dur="1.4s" repeatCount="indefinite" />}
            </path>
            <T x={606} y={160} size={46} color={C.nitrite} weight={700} display>?</T>

            {CARDS.map((c, i) => {
                const x0 = CARD_X[i];
                return (
                    <motion.g key={c.t} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + 0.15 * i, duration: 0.4 }}>
                        <rect x={x0} y={262} width={CARD_WS[i]} height={150} rx={14} fill="rgba(255,255,255,0.035)" stroke={c.c} strokeOpacity={0.6} strokeWidth={1.6} />
                        <T x={x0 + 14} y={290} size={17} color={c.c} weight={700}>{c.t}</T>
                        {i === 0 && <Fitness x0={x0} />}
                        {i === 1 && <FewSets x0={x0} />}
                        {i === 2 && <SameBars x0={x0} />}
                        {c.lines.map((l, j) => <T key={l} x={x0 + 14} y={(i === 0 ? 366 : 360) + 19 * j} size={16} color="#E5E7EB" weight={500}>{l}</T>)}
                    </motion.g>
                );
            })}
            <T x={VIS_W / 2} y={VIS_H - 6} size={18} color={C.nitriteSoft} weight={700} anchor="middle" display>Quantas das 156 mulheres se pareciam com a Helena?</T>
        </svg>
    );
};
