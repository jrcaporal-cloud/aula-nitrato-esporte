import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { VIS_H, VIS_W } from './ui';
import { Person } from './arte/figures';
import { T } from './arte/text';
import { MEN, WOMEN } from './SexVisuals';

/** Passos 3 e 4 do SexGapSim. Caixa 672 × 440. */

const AX = (v: number) => 80 + ((v + 0.4) / 1.0) * 540;

/** Passo 3: o efeito geral e o de só mulheres, com o intervalo largo que engole o zero e o efeito geral. */
export const WomenInterval = () => (
    <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Intervalo de só mulheres contém o zero e o efeito geral">
        <defs>
            <linearGradient id="ss-wom" x1="0" x2="1"><stop offset="0" stopColor={C.nitrateDeep} /><stop offset="0.5" stopColor={C.nitrate} /><stop offset="1" stopColor={C.nitrateDeep} /></linearGradient>
        </defs>
        <rect x={AX(0.12)} y={64} width={AX(0.229) - AX(0.12)} height={236} rx={6} fill={C.no} fillOpacity={0.16} />
        <line x1={AX(0)} x2={AX(0)} y1={64} y2={300} stroke="rgba(255,255,255,0.6)" strokeDasharray="6 6" />
        <line x1={AX(0.174)} x2={AX(0.174)} y1={64} y2={300} stroke={C.no} strokeOpacity={0.7} strokeWidth={1.6} />
        <T x={AX(0)} y={56} size={16} color="#E5E7EB" weight={700} anchor="middle">zero</T>
        <T x={AX(0.174)} y={56} size={16} color={C.noSoft} weight={700} anchor="middle">efeito geral 0,174</T>

        <T x={80} y={96} size={17} color="#fff" weight={700}>Todos os conjuntos</T>
        <T x={236} y={96} size={16} color={C.muted} weight={500}>111 conjuntos</T>
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <line x1={AX(0.12)} x2={AX(0.229)} y1={126} y2={126} stroke={C.no} strokeWidth={6} strokeLinecap="round" />
            <polygon points={`${AX(0.174) - 11},126 ${AX(0.174)},114 ${AX(0.174) + 11},126 ${AX(0.174)},138`} fill={C.no} stroke="#fff" strokeWidth={1.6} />
            <T x={AX(0.229) + 14} y={132} size={16} color="#E5E7EB" weight={600}>d = 0,174 (0,120 a 0,229)</T>
        </motion.g>

        <T x={80} y={190} size={17} color={WOMEN} weight={700}>Só mulheres</T>
        {Array.from({ length: 6 }, (_, i) => <Person key={i} cx={216 + i * 15} cy={185} s={0.7} color={WOMEN} woman />)}
        <T x={318} y={190} size={16} color={C.muted} weight={500}>6 conjuntos · p = 0,347</T>
        <motion.g initial={{ opacity: 0, scaleX: 0.2 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.5, duration: 0.6 }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <rect x={AX(-0.126)} y={212} width={AX(0.358) - AX(-0.126)} height={26} rx={13} fill="url(#ss-wom)" stroke="#fff" strokeOpacity={0.6} strokeWidth={1.6} />
            <path d={`M${AX(-0.126)} 204V246M${AX(0.358)} 204V246`} stroke="#fff" strokeWidth={2.6} strokeLinecap="round" />
            <circle cx={AX(0.116)} cy={225} r={12} fill={WOMEN} stroke="#fff" strokeWidth={2.6} />
        </motion.g>
        <T x={AX(0.116)} y={274} size={16} color="#E5E7EB" weight={600} anchor="middle">d = 0,116 (−0,126 a 0,358)</T>

        <line x1={80} x2={620} y1={300} y2={300} stroke="rgba(255,255,255,0.3)" />
        {[-0.4, -0.2, 0, 0.2, 0.4, 0.6].map(t => (
            <g key={t}><line x1={AX(t)} x2={AX(t)} y1={300} y2={308} stroke="rgba(255,255,255,0.4)" /><T x={AX(t)} y={328} size={16} color={C.muted} weight={600} anchor="middle">{t === 0 ? '0' : (t < 0 ? '−' : '') + String(Math.abs(t)).replace('.', ',')}</T></g>
        ))}
        <T x={80} y={352} size={16} color={C.muted} weight={500}>← contra o nitrato</T>
        <T x={620} y={352} size={16} color={C.muted} weight={500} anchor="end">a favor →</T>

        <motion.g initial={{ opacity: 0, scale: 1.5, rotate: -10 }} animate={{ opacity: 1, scale: 1, rotate: -4 }} transition={{ delay: 1, type: 'spring', stiffness: 220, damping: 14 }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <rect x={30} y={374} width={290} height={50} rx={10} fill="rgba(251,191,36,0.1)" stroke={C.nitrite} strokeWidth={3} />
            <T x={175} y={407} size={24} color={C.nitrite} weight={700} anchor="middle" display>“provavelmente espúria”</T>
        </motion.g>
        <T x={344} y={394} size={16} color="#E5E7EB" weight={500}>o intervalo contém o zero</T>
        <T x={344} y={414} size={16} color="#E5E7EB" weight={500}>e o efeito geral</T>
    </svg>
);

/** Anel do ciclo (esquemático): quatro quartos; os acesos são as fases testadas. */
const CycleRing = ({ cx, cy, lit }: { cx: number; cy: number; lit: readonly number[] }) => {
    const arc = (k: number) => {
        const a0 = (k * Math.PI) / 2 - Math.PI / 2 + 0.06;
        const a1 = ((k + 1) * Math.PI) / 2 - Math.PI / 2 - 0.06;
        const [r0, r1] = [38, 64];
        const p = (r: number, a: number) => `${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)}`;
        return `M${p(r0, a0)}L${p(r1, a0)}A${r1} ${r1} 0 0 1 ${p(r1, a1)}L${p(r0, a1)}A${r0} ${r0} 0 0 0 ${p(r0, a0)}Z`;
    };
    return (
        <g>
            {[0, 1, 2, 3].map(k => <path key={k} d={arc(k)} fill={lit.includes(k) ? WOMEN : 'rgba(255,255,255,0.06)'} fillOpacity={lit.includes(k) ? 0.9 : 1} stroke={lit.includes(k) ? '#fff' : 'rgba(255,255,255,0.2)'} strokeOpacity={0.7} strokeWidth={1.4} />)}
            <T x={cx} y={cy + 6} size={16} color="#E5E7EB" weight={600} anchor="middle">ciclo</T>
        </g>
    );
};

const CARDS = [
    { who: 'He 2026', color: C.no, sub: ['19 homens e 17 mulheres', '4 × 30 s de Wingate'], res: ['nenhuma interação', 'sexo × suplemento', '(todos p > 0,05);', 'o nitrato atenuou', 'a queda de potência'] },
    { who: 'Fry 2026', color: C.placebo, sub: ['12 mulheres', 'folicular inicial e tardia'], res: ['sem efeito em potência,', 'velocidade ou torque,', 'em nenhuma fase'] },
    { who: 'Brennan 2026', color: C.placebo, sub: ['18 mulheres treinadas', 'folicular precoce'], res: ['sem diferenças, salvo', 'dois desfechos piores', '(p 0,047 e 0,049)'] },
] as const;
const CW = 208;

/** Passo 4: o ensaio desenhado para as duas e dois ensaios com o ciclo controlado. */
export const DesignedTrial = () => (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Ensaios desenhados para as duas: He, Fry e Brennan">
            {CARDS.map((c, i) => {
                const x0 = 14 + i * (CW + 10);
                const cx = x0 + CW / 2;
                return (
                    <motion.g key={c.who} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * i, duration: 0.4 }}>
                        <rect x={x0} y={14} width={CW} height={412} rx={16} fill="rgba(255,255,255,0.035)" stroke={c.color} strokeOpacity={0.6} strokeWidth={1.6} />
                        <T x={cx} y={44} size={21} color={c.color === C.placebo ? '#fff' : c.color} weight={700} anchor="middle" display>{c.who}</T>
                        {c.sub.map((l, j) => <T key={l} x={cx} y={68 + 20 * j} size={16} color={C.muted} weight={500} anchor="middle">{l}</T>)}
                        {i === 0 && (
                            <g>
                                {Array.from({ length: 36 }, (_, k) => <Person key={k} cx={x0 + 22 + (k % 12) * 15.5} cy={126 + Math.floor(k / 12) * 22} s={0.74} color={k < 19 ? MEN : WOMEN} woman={k >= 19} />)}
                                <path d={`M${x0 + 32} 238L${x0 + 176} 212`} stroke={MEN} strokeWidth={4} strokeLinecap="round" />
                                <path d={`M${x0 + 32} 224L${x0 + 176} 198`} stroke={WOMEN} strokeWidth={4} strokeLinecap="round" />
                                <T x={x0 + 20} y={262} size={16} color={C.muted} weight={600}>placebo</T>
                                <T x={x0 + CW - 20} y={262} size={16} color={C.muted} weight={600} anchor="end">nitrato</T>
                            </g>
                        )}
                        {i === 1 && <CycleRing cx={cx} cy={178} lit={[0, 1]} />}
                        {i === 2 && <CycleRing cx={cx} cy={178} lit={[0]} />}
                        {c.res.map((l, j) => <T key={l} x={cx} y={300 + 21 * j} size={16} color="#E5E7EB" weight={500} anchor="middle">{l}</T>)}
                    </motion.g>
                );
            })}
        </svg>
);
