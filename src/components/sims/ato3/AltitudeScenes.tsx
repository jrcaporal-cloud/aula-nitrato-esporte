import { motion } from 'framer-motion';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { barX } from './barsMath';
import { DeltaBrace, HBars, type BarRow } from './Bars';
import { SCORE } from './altitude.content';

/** Cenas do slide 47 (viewBox 700 × 360, escala 1:1). */
export const AW = 700;
export const AH = 360;

interface SceneProps { reduce: boolean }

const caption = (text: string) => <SvgText x={4} y={28} text={text} size={17} weight={600} color="#CBD5E1" />;

/** VANHATALO2011: tolerância (s) em hipóxia com placebo, normóxia e hipóxia com beterraba. */
export const HypothesisScene = ({ reduce }: SceneProps) => {
    const rows: BarRow[] = [
        { id: 'hp', label: 'Hipóxia + placebo', value: 393, text: '393 s', color: C.hypoxia },
        { id: 'n', label: 'Normóxia', value: 471, text: '471 s', color: C.o2 },
        { id: 'hb', label: 'Hipóxia + beterraba', value: 477, text: '477 s', color: C.nitrate },
    ];
    const gx = barX(471, 4, 210, 300, 560);
    return (
        <g>
            {caption('Extensão de joelho até o limite de tolerância (14,5% de O₂ × 20,9%)')}
            <HBars rows={rows} x={4} y={60} labelW={210} barW={300} rowH={62} max={560} reduce={reduce} />
            <line x1={gx} x2={gx} y1={54} y2={250} stroke="#fff" strokeOpacity={0.5} strokeDasharray="4 5" />
            <DeltaBrace x={barX(560, 4, 210, 300, 560) + 28} y1={91} y2={215} text="+21%" color={C.nitrate} reduce={reduce} size={24} />
            <SvgText x={4} y={286} text="a beterraba iguala a normóxia (477 × 471 s); ≈ +21% sobre o placebo (cálculo)" size={16} weight={600} color={C.nitrateSoft} />
            <SvgText x={4} y={314} text="recuperação da PCr: 29 s (placebo), 23 s (normóxia), 24 s (beterraba)" size={16} weight={500} color={C.muted} />
        </g>
    );
};

/** SHANNON2016: 12 corredores, todos melhores no 1.500 m em hipóxia. Sem valores individuais publicados no resumo. */
export const TwelveScene = ({ reduce }: SceneProps) => {
    const rows: BarRow[] = [
        { id: 'p', label: 'placebo', value: 341.9, text: '341,9 s', color: C.placebo },
        { id: 'b', label: 'beterraba', value: 331.1, text: '331,1 s', color: C.nitrate },
    ];
    return (
        <g>
            {caption('1.500 m em hipóxia (FiO₂ ~15%, equivale a ~2.500 m)')}
            <HBars rows={rows} x={4} y={48} labelW={130} barW={340} rowH={54} max={400} reduce={reduce} />
            <DeltaBrace x={barX(400, 4, 130, 340, 400) + 40} y1={75} y2={129} text="−3,2%" color={C.nitrate} reduce={reduce} size={24} />
            <SvgText x={4} y={190} text="12 corredores, VO₂max de 47,1 a 76,8 mL/kg/min: cada um é um ponto" size={16} weight={600} color="#CBD5E1" />
            {Array.from({ length: 12 }, (_, i) => (
                <motion.g key={i} initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : 0.5 + i * 0.06 }}>
                    <circle cx={34 + i * 56} cy={236} r={22} fill={`${C.no}33`} stroke={C.no} strokeWidth={2.5} />
                    <path d={`M ${34 + i * 56} 247 v -20 m -7 7 l 7 -8 l 7 8`} fill="none" stroke={C.no} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                </motion.g>
            ))}
            <SvgText x={4} y={292} text="12 de 12 melhoraram" size={22} weight={700} color={C.no} />
            <SvgText x={4} y={320} text="sem relação com o VO₂max (r² = 0,05)" size={17} weight={500} color={C.muted} />
        </g>
    );
};

const CI = { lo: -60, hi: 38, est: 11, mid: 51 } as const;

/** ARNOLD2015: IC95% do ganho no 10 km contra a diferença mínima importante; MACLEOD, BOURDILLON e NYBÄCK embaixo. */
export const NullsScene = ({ reduce }: SceneProps) => {
    const sx = (v: number) => 350 + v * 4.1;
    const pills = [
        { who: 'MacLeod 2015', what: '11 ciclistas · 10 km: nulo' },
        { who: 'Bourdillon 2015', what: '12 ciclistas · 15 km: nulo' },
        { who: 'Nybäck 2017', what: '8 esquiadores · 1 km: nulo' },
    ];
    return (
        <g>
            {caption('Arnold 2015: 10 corredores (VO₂max 66), 10 km a ~2.500 m simulados')}
            {[-60, -30, 0, 30, 60].map(t => (
                <g key={t}>
                    <line x1={sx(t)} x2={sx(t)} y1={60} y2={150} stroke={t === 0 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.08)'} strokeDasharray={t === 0 ? '5 5' : undefined} />
                    <SvgText x={sx(t)} y={176} text={`${t > 0 ? '+' : t < 0 ? '−' : ''}${Math.abs(t)} s`} size={16} anchor="middle" weight={500} color={C.muted} />
                </g>
            ))}
            <line x1={sx(CI.mid)} x2={sx(CI.mid)} y1={52} y2={150} stroke={C.no} strokeWidth={2.5} strokeDasharray="6 5" />
            <SvgText x={sx(CI.mid)} y={46} text="51 s: o que valeria a pena" size={16} weight={700} anchor="middle" color={C.noSoft} />
            <motion.g initial={{ opacity: reduce ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : 0.6 }}>
                <line x1={sx(CI.lo)} x2={sx(CI.hi)} y1={105} y2={105} stroke={C.nitrate} strokeWidth={5} strokeLinecap="round" />
                <rect x={sx(CI.est) - 9} y={96} width={18} height={18} fill={C.nitrate} stroke="#fff" strokeWidth={2} />
                <SvgText x={sx(CI.est)} y={88} text={`+${CI.est} s (IC95% ${CI.lo.toString().replace('-', '−')} a ${CI.hi})`} size={18} weight={700} anchor="middle" color="#fff" />
            </motion.g>
            <SvgText x={350} y={206} text="melhora no 10 km com beterraba × placebo" size={16} anchor="middle" weight={500} color="#CBD5E1" />
            {pills.map((p, i) => (
                <g key={p.who} transform={`translate(${4 + i * 232}, 232)`}>
                    <rect width={222} height={86} rx={12} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" />
                    <SvgText x={14} y={32} text={p.who} size={18} weight={700} color="#fff" />
                    <SvgText x={14} y={60} text={p.what} size={16} weight={500} color={C.muted} />
                </g>
            ))}
            <SvgText x={4} y={348} text={`TT 2862 × 2874 s (p = 0,6); só 3 de 10 com melhora provável`} size={16} weight={600} color={C.nitrateSoft} />
        </g>
    );
};

/** Placar: positivos × nulos em hipóxia. HTML, 2 colunas. */
export const ScoreCols = () => (
    <div className="grid grid-cols-2 gap-3" style={{ width: AW, height: AH - 8 }}>
        {([['Positivos', SCORE.pos, C.no], ['Nulos', SCORE.nulls, C.hypoxia]] as const).map(([title, list, color]) => (
            <div key={title} className="rounded-xl border bg-white/[0.03] px-4 py-3 flex flex-col gap-2" style={{ borderColor: `${color}66` }}>
                <span className="font-mono text-[15px] tracking-wide" style={{ color }}>{title.toUpperCase()} · {br(list.length, 0)}</span>
                {list.map(s => (
                    <div key={s.who} className="leading-tight">
                        <span className="block text-[16px] font-bold text-white">{s.who}</span>
                        <span className="block text-[15px] text-gray-300">{s.what}</span>
                    </div>
                ))}
            </div>
        ))}
    </div>
);
