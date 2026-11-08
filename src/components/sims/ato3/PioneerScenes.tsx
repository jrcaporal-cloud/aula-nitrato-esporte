import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { barX } from './barsMath';
import { DeltaBrace, HBars, type BarRow } from './Bars';
import { SvgReveal } from './beat';
import { CORRECTIONS } from './pioneers.content';

/** Cenas do slide 40 (viewBox 660 × 360, desenhado em escala 1:1). */
export const PW = 660;
export const PH = 360;

const NODES = [
    { x: 90, year: '2007', place: 'Karolinska' },
    { x: 330, year: '2009', place: 'Exeter' },
    { x: 570, year: '2011', place: 'Exeter' },
];

/** Faixa do tempo: acende os marcos já contados. `upTo` = índice do último marco aceso. */
export const TimelineStrip = ({ upTo }: { upTo: number }) => (
    <g>
        <line x1={NODES[0].x} x2={NODES[2].x} y1={16} y2={16} stroke="rgba(255,255,255,0.18)" strokeWidth={3} />
        {NODES.map((n, i) => {
            const on = i <= upTo;
            const now = i === upTo;
            return (
                <g key={n.year + n.x}>
                    <circle cx={n.x} cy={16} r={now ? 9 : 6} fill={on ? C.nitrate : '#1F2937'} stroke={on ? '#fff' : 'rgba(255,255,255,0.3)'} strokeWidth={now ? 2 : 1} />
                    <SvgText x={n.x} y={46} text={`${n.year} · ${n.place}`} size={16} anchor="middle" weight={now ? 700 : 500} color={on ? '#fff' : C.muted} />
                </g>
            );
        })}
    </g>
);

const caption = (text: string) => <SvgText x={4} y={98} text={text} size={17} weight={600} color="#CBD5E1" />;

/** Rodapé de uma cena: pequenas pílulas com os números de apoio. */
const Pills = ({ items, y }: { items: readonly string[]; y: number }) => (
    <SvgReveal order={2}>
        {items.map((t, i) => (
            <g key={t} transform={`translate(${4 + i * 222}, ${y})`}>
                <rect width={210} height={34} rx={8} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.14)" />
                <SvgText x={105} y={23} text={t} size={16} anchor="middle" weight={600} color="#E5E7EB" />
            </g>
        ))}
    </SvgReveal>
);

interface SceneProps { reduce: boolean }

/** 2007: VO₂ submáximo, placebo × nitrato de sódio (L/min). */
export const SaltScene = ({ reduce }: SceneProps) => {
    const rows: BarRow[] = [
        { id: 'pl', label: 'placebo (NaCl)', value: 2.98, text: '2,98 L/min', color: C.placebo },
        { id: 'no3', label: 'nitrato de sódio', value: 2.82, text: '2,82 L/min', color: C.nitrate },
    ];
    const gx = barX(2.98, 4, 170, 290, 3.4);
    return (
        <g>
            {caption('Mesma carga submáxima: quanto O₂ o músculo consome')}
            <HBars rows={rows} x={4} y={120} labelW={170} barW={290} rowH={64} max={3.4} reduce={reduce} />
            <line x1={gx} x2={gx} y1={112} y2={256} stroke="#fff" strokeOpacity={0.5} strokeDasharray="4 5" />
            <DeltaBrace x={barX(3.4, 4, 170, 290, 3.4) + 76} y1={152} y2={216} text="−5,4%" color={C.nitrate} reduce={reduce} hit />
            <Pills y={296} items={['eficiência 19,7 → 21,1%', 'lactato: sem diferença', 'p < 0,02']} />
        </g>
    );
};

/** 2009: tempo até a exaustão, groselha × suco de beterraba (s). */
export const JuiceScene = ({ reduce }: SceneProps) => {
    const rows: BarRow[] = [
        { id: 'pl', label: 'groselha-preta', value: 583, text: '583 s', color: C.placebo },
        { id: 'br', label: 'suco de beterraba', value: 675, text: '675 s', color: C.nitrate },
    ];
    const gx = barX(583, 4, 170, 290, 800);
    return (
        <g>
            {caption('Exercício intenso até a exaustão (tempo até a falha)')}
            <HBars rows={rows} x={4} y={120} labelW={170} barW={290} rowH={64} max={800} reduce={reduce} />
            <line x1={gx} x2={gx} y1={112} y2={256} stroke="#fff" strokeOpacity={0.5} strokeDasharray="4 5" />
            <DeltaBrace x={barX(800, 4, 170, 290, 800) + 76} y1={152} y2={216} text="+16%" color={C.nitrate} reduce={reduce} hit />
            <Pills y={296} items={['500 mL/dia · 5,6 mmol', '6 dias · n = 8', 'p < 0,05']} />
        </g>
    );
};

/** 2011a: três braços, tempo até a exaustão em corrida severa (min). */
export const PlaceboScene = ({ reduce }: SceneProps) => {
    const rows: BarRow[] = [
        { id: 'ctl', label: 'sem bebida', value: 7.6, text: '≈ igual', color: C.placebo, ghost: true },
        { id: 'dep', label: 'beterraba depletada', value: 7.6, text: '7,6 min', color: C.placebo },
        { id: 'br', label: 'beterraba com nitrato', value: 8.7, text: '8,7 min', color: C.nitrate },
    ];
    const gx = barX(7.6, 4, 190, 280, 10);
    return (
        <g>
            {caption('Corrida em intensidade severa, até a exaustão')}
            <HBars rows={rows} x={4} y={116} labelW={190} barW={280} rowH={54} max={10} reduce={reduce} />
            <line x1={gx} x2={gx} y1={110} y2={282} stroke="#fff" strokeOpacity={0.5} strokeDasharray="4 5" />
            <DeltaBrace x={barX(10, 4, 190, 280, 10) + 60} y1={197} y2={251} text="+15%" color={C.nitrate} reduce={reduce} hit size={24} />
            <Pills y={304} items={['nitrato ~0,003 × ~6,2 mmol', 'nitrito 183 × 373 nM', 'p < 0,01']} />
        </g>
    );
};

/** 2011b: contrarrelógio de 4 e 16,1 km (min). Cada distância tem a própria escala. */
export const TrialScene = ({ reduce }: SceneProps) => {
    const g4: BarRow[] = [
        { id: 'p4', label: 'placebo', value: 6.45, text: '6,45 min', color: C.placebo },
        { id: 'b4', label: 'beterraba', value: 6.27, text: '6,27 min', color: C.nitrate },
    ];
    const g16: BarRow[] = [
        { id: 'p16', label: 'placebo', value: 27.7, text: '27,7 min', color: C.placebo },
        { id: 'b16', label: 'beterraba', value: 26.9, text: '26,9 min', color: C.nitrate },
    ];
    return (
        <g>
            {caption('Contrarrelógio de ciclismo: tempo para completar a distância')}
            <SvgText x={4} y={140} text="4 km" size={18} weight={700} color={C.nitrateSoft} />
            <HBars rows={g4} x={4} y={146} labelW={120} barW={330} rowH={42} max={7.2} reduce={reduce} labelSize={16} />
            <DeltaBrace x={barX(7.2, 4, 120, 330, 7.2) + 70} y1={167} y2={209} text="−2,8%" color={C.nitrate} reduce={reduce} size={24} />
            <SvgText x={4} y={262} text="16,1 km" size={18} weight={700} color={C.nitrateSoft} />
            <HBars rows={g16} x={4} y={268} labelW={120} barW={330} rowH={42} max={31} reduce={reduce} labelSize={16} delay={0.3} />
            <DeltaBrace x={barX(31, 4, 120, 330, 31) + 70} y1={289} y2={331} text="−2,7%" color={C.nitrate} reduce={reduce} size={24} delay={0.3} hit />
        </g>
    );
};

/** Passo final: três correções em sequência, cada uma com antes → depois. */
export const CorrectionScene = ({ reduce }: SceneProps) => (
    <g>
        {CORRECTIONS.map((c, i) => {
            const y = 100 + i * 86;
            return (
                <motion.g key={c.what} initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : i * 0.25 }}>
                    <rect x={4} y={y} width={652} height={72} rx={12} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
                    <SvgText x={20} y={y + 28} text={c.what} size={20} weight={700} color="#fff" />
                    <SvgText x={20} y={y + 54} text={c.when} size={16} weight={500} color={C.muted} />
                    <rect x={170} y={y + 14} width={200} height={40} rx={8} fill="rgba(148,163,184,0.16)" stroke={`${C.placebo}88`} />
                    <SvgText x={270} y={y + 40} text={c.from} size={16} anchor="middle" color="#E5E7EB" />
                    <path d={`M 380 ${y + 34} h 36 m -9 -8 l 9 8 l -9 8`} fill="none" stroke={C.nitrate} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                    <rect x={430} y={y + 14} width={214} height={40} rx={8} fill="rgba(240,67,126,0.16)" stroke={`${C.nitrate}aa`} />
                    <SvgText x={537} y={y + 40} text={c.to} size={16} anchor="middle" color="#fff" weight={700} />
                </motion.g>
            );
        })}
    </g>
);
