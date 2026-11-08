import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import { VIS_H, VIS_W } from './ui';
import { Person } from './arte/figures';
import { Glow, T } from './arte/text';

/** Passos 1 e 2 do SexGapSim. Caixa 672 × 440. Homens em azul, mulheres em rosa (cores do kit). */

export const MEN = C.o2;
export const WOMEN = C.nitrateSoft;

/** Passo 1: cem participantes (88 homens, 12 mulheres) e as barras em escala 1.179 × 156. */
export const ParticipantPictogram = () => {
    const reduce = useReducedMotion() ?? false;
    const wBar = 300;
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Cem participantes: 88 homens e 12 mulheres">
            <defs>
                <linearGradient id="sv-men" x1="0" x2="1"><stop offset="0" stopColor={C.o2Soft} /><stop offset="1" stopColor={MEN} /></linearGradient>
                <linearGradient id="sv-wom" x1="0" x2="1"><stop offset="0" stopColor={C.nitrateSoft} /><stop offset="1" stopColor={C.nitrate} /></linearGradient>
            </defs>
            <T x={30} y={34} size={19} color="#fff" weight={700}>A cada 100 participantes</T>
            <Glow id="sv-gw" cx={168} cy={374} r={150} color={C.nitrate} opacity={0.28} pulse={!reduce} />
            {Array.from({ length: 100 }, (_, i) => {
                const woman = i >= 88;
                return (
                    <motion.g key={i} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: woman ? 1 : 0.8, scale: 1 }} transition={{ delay: reduce ? 0 : 0.006 * i, duration: 0.3 }}
                        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                        <Person cx={42 + (i % 10) * 29} cy={78 + Math.floor(i / 10) * 33} s={1.2} color={woman ? WOMEN : MEN} woman={woman} />
                    </motion.g>
                );
            })}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }}>
                <T x={354} y={92} size={46} color={MEN} weight={700} display>1.179</T>
                <T x={484} y={92} size={20} color="#E5E7EB" weight={600}>homens</T>
                <rect x={354} y={104} width={wBar} height={18} rx={9} fill="url(#sv-men)" />
                <T x={354} y={186} size={46} color={WOMEN} weight={700} display>156</T>
                <T x={456} y={186} size={20} color="#E5E7EB" weight={600}>mulheres</T>
                <rect x={354} y={198} width={(wBar * 156) / 1179} height={18} rx={9} fill="url(#sv-wom)" />
                <T x={408} y={213} size={16} color={C.muted} weight={500}>mesma escala</T>
                <line x1={354} x2={VIS_W - 30} y1={248} y2={248} stroke="rgba(255,255,255,0.15)" />
                <T x={354} y={284} size={18} color={C.muted} weight={600}>80 estudos, 2009 a 2019</T>
                <T x={354} y={314} size={18} color={C.muted} weight={600}>~10% da amostra (os autores)</T>
                <T x={354} y={344} size={18} color={C.nitrite} weight={700}>156 ÷ 1.335 = 11,7% (cálculo)</T>
            </motion.g>
        </svg>
    );
};

const SETS = [
    { n: 79, color: MEN, label: '79% só homens', big: '79%', name: 'só homens', sub: '90 conjuntos' },
    { n: 16, color: C.placebo, label: '16% mistos', big: '16%', name: 'mistos', sub: '17 conjuntos' },
    { n: 5, color: WOMEN, label: '5% só mulheres', big: '5%', name: 'só mulheres', sub: '6 conjuntos' },
] as const;

/** Cada célula é um conjunto de dados, com o pictograma de quem foi estudado dentro dele. */
const Cell = ({ x, y, kind }: { x: number; y: number; kind: 0 | 1 | 2 }) => {
    const color = SETS[kind].color;
    return (
        <g>
            <rect x={x} y={y} width={28} height={28} rx={6} fill={color} fillOpacity={kind === 1 ? 0.14 : 0.18} stroke={color} strokeOpacity={kind === 1 ? 0.6 : 0.85} strokeWidth={1.3} />
            {kind === 1 ? (
                <g><Person cx={x + 9} cy={y + 14} s={0.5} color={MEN} /><Person cx={x + 19} cy={y + 14} s={0.5} color={WOMEN} woman /></g>
            ) : <Person cx={x + 14} cy={y + 14} s={0.8} color={color} woman={kind === 2} />}
        </g>
    );
};

/** Passo 2: cem conjuntos de dados, por composição de sexo. */
export const DatasetSquares = () => {
    const reduce = useReducedMotion() ?? false;
    const kinds = SETS.flatMap((s, k) => Array.from({ length: s.n }, () => k as 0 | 1 | 2));
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Cem conjuntos de dados por composição de sexo">
            <T x={24} y={34} size={19} color="#fff" weight={700}>A cada 100 conjuntos de dados</T>
            <Glow id="sv-g5" cx={280} cy={366} r={76} color={C.nitrate} opacity={0.5} pulse={!reduce} />
            {kinds.map((k, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : 0.008 * i }}>
                    <Cell x={24 + (i % 10) * 32} y={54 + Math.floor(i / 10) * 32} kind={k} />
                </motion.g>
            ))}
            {SETS.map((s, i) => (
                <motion.g key={s.label} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + 0.2 * i, duration: 0.4 }}>
                    <rect x={362} y={72 + i * 112} width={290} height={96} rx={16} fill={`${s.color}14`} stroke={s.color} strokeOpacity={0.7} strokeWidth={1.6} />
                    <T x={380} y={128 + i * 112} size={52} color={s.color === C.placebo ? '#E5E7EB' : s.color} weight={700} display>{s.big}</T>
                    <T x={500} y={112 + i * 112} size={21} color="#fff" weight={700}>{s.name}</T>
                    <T x={500} y={138 + i * 112} size={17} color={C.muted} weight={500}>{s.sub}</T>
                </motion.g>
            ))}
        </svg>
    );
};
