import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br } from '../kit/format';
import { VIS_H, VIS_W } from './ui';

/** Desenhos dos passos 2 a 5 do PlaceboSim. Caixa 672 × 440. */

const fadeUp = (i: number) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay: 0.12 * i } });

const SAME_ROWS = [
    { label: 'Cor (UV-vis)', value: 'dentro da variação entre cultivares' },
    { label: 'Sabor', value: 'sem diferença no teste cego' },
    { label: 'Açúcar', value: 'sem diferença' },
    { label: 'RMN de próton', value: 'sem diferença' },
    { label: 'Ascorbato', value: 'indetectável nos dois' },
] as const;

/** Passo 2: dois copos iguais, uma linha diferente. */
export const SameJuice = () => (
    <div className="h-full p-4 flex flex-col gap-2">
        <div className="grid grid-cols-[170px_1fr_1fr] items-end gap-3">
            <span />
            {['Suco de beterraba', 'Placebo depletado'].map((t, i) => (
                <div key={t} className="flex flex-col items-center gap-1.5">
                    <div className="h-10 w-16 rounded-b-2xl rounded-t-md border border-white/40" style={{ background: `linear-gradient(${C.nitrateDeep}, #5B0F33)`, boxShadow: `0 0 18px -4px ${i === 0 ? C.nitrate : C.placebo}` }} />
                    <span className="text-[16px] font-semibold text-gray-100">{t}</span>
                </div>
            ))}
        </div>
        {SAME_ROWS.map((r, i) => (
            <motion.div key={r.label} {...fadeUp(i)} className="grid grid-cols-[170px_1fr] items-center gap-3 rounded-xl border border-white/10 px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="text-[16px] text-gray-300">{r.label}</span>
                <span className="flex items-center justify-center gap-2 text-[16px] font-semibold" style={{ color: C.noSoft }}>
                    <span className="font-mono text-[18px]">=</span> {r.value}
                </span>
            </motion.div>
        ))}
        <motion.div {...fadeUp(SAME_ROWS.length + 1)} className="grid grid-cols-[170px_1fr_1fr] items-center gap-3 rounded-xl border px-3 py-2"
            style={{ borderColor: `${C.nitrate}b3`, background: 'rgba(240,67,126,0.1)', boxShadow: `0 0 24px -10px ${C.nitrate}` }}>
            <span className="text-[16px] font-bold leading-tight" style={{ color: C.nitrateSoft }}>Nitrato<br /><span className="font-normal text-gray-300">por 250 mL</span></span>
            <span className="text-center font-display text-[1.3rem] font-semibold tabular-nums" style={{ color: C.nitrate }}>7,5 mmol</span>
            <span className="text-center font-display text-[1.3rem] font-semibold tabular-nums text-gray-200">0,002 mmol</span>
        </motion.div>
    </div>
);

const ARMS = [
    { id: 'ctl', x: 130, name: 'Controle', sub: 'nada', color: C.placebo, o2: 0.87, ghost: true },
    { id: 'pl', x: 336, name: 'Suco depletado', sub: '~0,003 mmol', color: C.placebo, o2: 0.87, ghost: false },
    { id: 'br', x: 542, name: 'Suco de beterraba', sub: '~6,2 mmol', color: C.nitrate, o2: 0.7, ghost: false },
] as const;
const BASE = 330;
const barTop = (v: number) => BASE - ((v - 0.5) / 0.45) * 200;

/** Passo 3: o desenho de três braços (custo de O₂ da caminhada). */
export const ThreeArms = () => (
    <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Três braços: controle, depletado e beterraba">
        <SvgText x={VIS_W / 2} y={30} text="Custo de O₂ da caminhada em esteira (L/min)" anchor="middle" size={18} color="#E5E7EB" weight={700} />
        <line x1={50} x2={VIS_W - 50} y1={BASE} y2={BASE} stroke="rgba(255,255,255,0.3)" />
        {ARMS.map((a, i) => {
            const top = barTop(a.o2);
            return (
                <motion.g key={a.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.2 * i }}>
                    <rect x={a.x - 52} y={top} width={104} height={BASE - top} rx={8}
                        fill={a.ghost ? 'none' : a.color} fillOpacity={a.id === 'br' ? 0.85 : 0.55}
                        stroke={a.color} strokeWidth={a.ghost ? 2 : 1} strokeDasharray={a.ghost ? '7 6' : undefined} />
                    <SvgText x={a.x} y={top - 12} text={a.ghost ? '≈ depletado' : br(a.o2, 2)}
                        anchor="middle" size={a.ghost ? 16 : 22} color={a.id === 'br' ? C.nitrateSoft : '#E5E7EB'} weight={700} />
                    <SvgText x={a.x} y={BASE + 28} text={a.name} anchor="middle" size={17} color="#F3F4F6" weight={700} />
                    <SvgText x={a.x} y={BASE + 50} text={a.sub} anchor="middle" size={16} color={C.muted} weight={500} />
                </motion.g>
            );
        })}
        {/* elo controle = depletado */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.4 }}>
            <SvgText x={233} y={72} text="controle = depletado" anchor="middle" size={17} color="#E5E7EB" weight={700} />
            <SvgText x={233} y={94} text="nitrito, pressão e exercício iguais" anchor="middle" size={16} color={C.muted} weight={500} />
            <path d="M130 124 V108 H336 V124" stroke={C.placebo} strokeWidth={2} fill="none" />
            <path d="M392 176 C 450 120, 500 130, 530 196" stroke={C.nitrate} strokeWidth={2.5} fill="none" strokeDasharray="6 5" />
            <SvgText x={520} y={86} text="só o nitrato mudou" anchor="middle" size={17} color={C.nitrateSoft} weight={700} />
            <SvgText x={520} y={108} text="nitrito 183 → 373 nM" anchor="middle" size={16} color={C.nitrite} weight={600} />
        </motion.g>
        <SvgText x={VIS_W / 2} y={VIS_H - 14} text="betalaínas, polifenóis, potássio e açúcar: nos dois sucos" anchor="middle" size={16} color={C.muted} weight={500} />
    </svg>
);

const TIMELINE = [
    { year: '2009', who: 'Exeter · Bailey', placebo: 'Xarope de groselha-preta', detail: 'Outra fruta, sem equivalência de matriz; cego não testado. TTE 675 ± 203 s × 583 ± 145 s.', color: C.nitrite },
    { year: '2011', who: 'Mesmo grupo · Lansley', placebo: 'Suco de beterraba depletado', detail: 'Braço controle + depletado (~0,003 mmol): o placebo se comporta como não tomar nada.', color: C.o2 },
    { year: '2014', who: 'Gilchrist e cols.', placebo: 'Resina Purolite A520e', detail: 'UV-vis, RMN, açúcar e degustação cega: o placebo ganha laudo e vira padrão.', color: C.no },
] as const;

/** Passo 4: três artigos, cinco anos. */
export const PlaceboTimeline = () => (
    <div className="h-full p-5 flex flex-col gap-3">
        <div className="relative flex items-center justify-between px-6 pt-2">
            <div className="absolute left-6 right-6 top-1/2 h-[2px]" style={{ background: 'linear-gradient(90deg,#FBBF24,#60A5FA,#34D399)', opacity: 0.6 }} />
            {TIMELINE.map(t => (
                <span key={t.year} className="relative z-10 rounded-full border-2 px-3 py-0.5 font-display text-[1.25rem] font-semibold"
                    style={{ borderColor: t.color, color: t.color, background: '#07050B' }}>{t.year}</span>
            ))}
        </div>
        <div className="grid grid-cols-3 gap-3 flex-1">
            {TIMELINE.map((t, i) => (
                <motion.div key={t.year} {...fadeUp(i)} className="rounded-xl border p-3 flex flex-col gap-2"
                    style={{ borderColor: `${t.color}80`, background: 'rgba(255,255,255,0.03)' }}>
                    <span className="text-[15px] text-gray-300">{t.who}</span>
                    <span className="font-display text-[1.1rem] font-semibold leading-tight" style={{ color: t.color }}>{t.placebo}</span>
                    <span className="text-[15px] leading-snug text-gray-200">{t.detail}</span>
                </motion.div>
            ))}
        </div>
        <p className="text-[15px] leading-snug text-gray-300">
            Não repita: Flueck 2019 voltou a usar água como placebo num contrarrelógio de handbike. Água não cega suco.
        </p>
    </div>
);

/** Passo 5: suco × sal, com o mesmo nitrito no plasma. */
export const JuiceVsSalt = () => (
    <div className="h-full p-5 flex flex-col gap-3">
        <div className="flex items-end gap-5">
            <div className="flex-1">
                <p className="text-[16px] font-semibold text-gray-100 mb-2">VO₂ ao fim do exercício severo (6 mmol, equimolar)</p>
                <div className="flex items-end gap-5 h-[150px]">
                    {[{ n: 'Sal (NaNO₃)', h: 130, c: C.placebo }, { n: 'Suco de beterraba', h: 125, c: C.nitrate }].map(b => (
                        <div key={b.n} className="flex flex-col items-center gap-1.5">
                            <motion.div initial={{ height: 0 }} animate={{ height: b.h }} transition={{ duration: 0.6 }} className="w-24 rounded-t-lg"
                                style={{ background: b.c, opacity: 0.8 }} />
                            <span className="text-[15px] text-gray-200">{b.n}</span>
                        </div>
                    ))}
                    <div className="flex flex-col gap-1 pb-9">
                        <span className="font-display text-[1.9rem] font-semibold leading-none" style={{ color: C.nitrateSoft }}>≈ −4%</span>
                        <span className="text-[15px] text-gray-300">com suco (p = 0,003)</span>
                    </div>
                </div>
            </div>
            <div className="w-[170px] rounded-xl border border-white/10 p-3 flex flex-col gap-1" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="text-[15px] text-gray-300">nitrito plasmático, 6 mmol</span>
                <span className="font-display text-[1.3rem] font-semibold" style={{ color: C.nitrite }}>igual</span>
                <span className="text-[15px] text-gray-300">p = 0,27</span>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
            {[
                { t: 'A · algo na beterraba', d: 'um cofator além do nitrato age no músculo', c: C.nitrate },
                { t: 'B · ruído', d: 'sete visitas por pessoa e várias comparações', c: C.nitrite },
            ].map(b => (
                <div key={b.t} className="rounded-xl border p-3" style={{ borderColor: `${b.c}80`, background: 'rgba(255,255,255,0.03)' }}>
                    <p className="font-display text-[1.05rem] font-semibold" style={{ color: b.c }}>{b.t}</p>
                    <p className="text-[15px] leading-snug text-gray-200">{b.d}</p>
                </div>
            ))}
        </div>
        <div className="rounded-xl border border-white/10 p-3 mt-auto" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-[15px] leading-snug text-gray-100">
                <span className="font-semibold" style={{ color: C.no }}>Contrarrelógio de 10 km em handbike:</span> suco, sal e água, sem diferença
                (p = 0,80 sem deficiência; p = 0,61 paraciclistas).
            </p>
        </div>
    </div>
);
