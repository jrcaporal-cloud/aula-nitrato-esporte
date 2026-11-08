import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import { VIS_H, VIS_W } from './ui';
import { Glow, T } from './arte/text';
import { Glass, VesselDefs } from './arte/vessels';
import { SvgKeyFact } from './countText';

/** Passo 4 do PlaceboSim: três placebos em cinco anos, cada um com o seu frasco. Caixa 672 × 440. */

const XS = [116, 336, 556] as const;
const TRACK_Y = 190;

const CARDS = [
    { year: '2009', who: 'Exeter · Bailey', color: C.nitrite, title: ['Xarope de', 'groselha-preta'], lines: ['outra fruta; cego não', 'testado. TTE 675 ± 203 s', '× 583 ± 145 s'] },
    { year: '2011', who: 'Mesmo grupo · Lansley', color: C.o2, title: ['Suco de beterraba', 'depletado'], lines: ['controle + depletado', '(~0,003 mmol): age como', 'não tomar nada'] },
    { year: '2014', who: 'Gilchrist e cols.', color: C.no, title: ['Resina', 'Purolite A520e'], lines: ['laudo: UV-vis, RMN,', 'açúcar e degustação', 'cega: vira padrão'] },
] as const;

/** 2009: garrafa de xarope escuro com bagas, a outra fruta. */
const Bottle = () => (
    <g>
        <defs>
            <linearGradient id="ph-wine" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#5A1B45" /><stop offset="1" stopColor="#1C0714" /></linearGradient>
        </defs>
        <rect x={104} y={26} width={24} height={34} rx={5} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.55)" strokeWidth={2} />
        <rect x={102} y={20} width={28} height={10} rx={4} fill={C.nitrite} fillOpacity={0.85} />
        <path d="M104 58C84 70 86 80 86 90V140Q86 150 96 150H136Q146 150 146 140V90C146 80 148 70 128 58Z" fill="url(#ph-wine)" stroke="rgba(255,255,255,0.6)" strokeWidth={2} strokeLinejoin="round" />
        <path d="M95 88V138" stroke="#fff" strokeOpacity={0.25} strokeWidth={5} strokeLinecap="round" />
        {[[104, 112], [118, 104], [124, 122]].map(([x, y], i) => (
            <g key={i}><circle cx={x} cy={y} r={8} fill="#2D1024" stroke={C.nitrite} strokeWidth={1.8} /><circle cx={x - 2.5} cy={y - 2.5} r={2} fill="#fff" fillOpacity={0.7} /></g>
        ))}
    </g>
);

/** 2014: coluna de resina e laudo com selo. */
const ResinAndReport = () => (
    <g>
        <rect x={500} y={44} width={44} height={104} rx={12} fill={C.nitrateDeep} fillOpacity={0.35} stroke="rgba(255,255,255,0.55)" strokeWidth={2} />
        {Array.from({ length: 5 * 6 }, (_, k) => (
            <circle key={k} cx={510 + (k % 5) * 6.6 + (Math.floor(k / 5) % 2) * 3} cy={68 + Math.floor(k / 5) * 12} r={4} fill={C.o2} fillOpacity={0.8} stroke={C.o2Soft} strokeOpacity={0.5} />
        ))}
        <rect x={564} y={52} width={58} height={82} rx={6} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.6)" strokeWidth={2} />
        {[68, 80, 92, 104].map(y => <path key={y} d={`M572 ${y}H${y === 104 ? 596 : 614}`} stroke="#CBD5E1" strokeOpacity={0.6} strokeWidth={3} strokeLinecap="round" />)}
        <circle cx={606} cy={122} r={14} fill="#064E3B" stroke={C.no} strokeWidth={2.5} />
        <path d="M599 122L604 127L613 116" stroke={C.noSoft} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
);

export const PlaceboTimeline = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Três placebos: groselha-preta, suco depletado e resina">
            <VesselDefs />
            <defs>
                <linearGradient id="ph-track" gradientUnits="userSpaceOnUse" x1={116} x2={556} y1={0} y2={0}><stop offset="0" stopColor={C.nitrite} /><stop offset="0.5" stopColor={C.o2} /><stop offset="1" stopColor={C.no} /></linearGradient>
            </defs>
            {XS.map((x, i) => <Glow key={x} id={`ph-g${i}`} cx={x} cy={96} r={92} color={CARDS[i].color} opacity={0.2} />)}

            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}><Bottle /></motion.g>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <Glass id="ph-gl" x={290} y={56} w={92} h={94} level={0.8} />
                <T x={336} y={108} size={17} color="#fff" weight={700} anchor="middle">NO₃⁻ ≈ 0</T>
            </motion.g>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}><ResinAndReport /></motion.g>

            {/* trilha do tempo que se desenha da esquerda para a direita */}
            <line x1={XS[0]} x2={XS[2]} y1={TRACK_Y} y2={TRACK_Y} stroke="url(#ph-track)" strokeWidth={5} strokeLinecap="round" strokeDasharray="440" strokeDashoffset={reduce ? 0 : 440}>
                {!reduce && <animate attributeName="stroke-dashoffset" values="440;0" dur="0.9s" begin="0.1s" fill="freeze" />}
            </line>
            {/* cada ano acende quando a trilha chega nele; 2014, o padrão, ganha o destaque */}
            {XS.map((x, i) => {
                const pill = (
                    <>
                        <path d={`M${x} 152V${TRACK_Y - 17}`} stroke={CARDS[i].color} strokeOpacity={0.6} strokeWidth={2} strokeDasharray="4 5" />
                        <rect x={x - 40} y={TRACK_Y - 17} width={80} height={34} rx={17} fill="#07050B" stroke={CARDS[i].color} strokeWidth={2.5} />
                        <T x={x} y={TRACK_Y + 8} size={20} color={CARDS[i].color} weight={700} anchor="middle" display>{CARDS[i].year}</T>
                    </>
                );
                return (
                    <motion.g key={x} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + 0.45 * i, duration: 0.3 }}>
                        {i === 2 ? <SvgKeyFact color={C.no} delay={1.05}>{pill}</SvgKeyFact> : pill}
                    </motion.g>
                );
            })}

            {CARDS.map((c, i) => (
                <motion.g key={c.year} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + 0.45 * i, duration: 0.4 }}>
                    <rect x={XS[i] - 104} y={216} width={208} height={178} rx={14} fill="rgba(255,255,255,0.035)" stroke={c.color} strokeOpacity={0.6} strokeWidth={1.6} />
                    <T x={XS[i] - 92} y={240} size={16} color={C.muted} weight={500}>{c.who}</T>
                    {c.title.map((l, j) => <T key={l} x={XS[i] - 92} y={266 + 22 * j} size={19} color={c.color} weight={700} display>{l}</T>)}
                    {c.lines.map((l, j) => <T key={l} x={XS[i] - 92} y={324 + 21 * j} size={16} color="#E5E7EB" weight={500}>{l}</T>)}
                </motion.g>
            ))}

            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                <rect x={14} y={404} width={VIS_W - 28} height={32} rx={10} fill="rgba(248,113,113,0.08)" stroke={C.risk} strokeOpacity={0.6} />
                <T x={28} y={426} size={16} color={C.risk} weight={700}>Não repita:</T>
                <T x={120} y={426} size={16} color="#E5E7EB" weight={500}>Flueck 2019 usou água como placebo (handbike). Água não cega suco.</T>
            </motion.g>
        </svg>
    );
};
