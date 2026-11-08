import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { FadeG } from './DrawPath';
import { Mito } from './Mito';
import { PairBars, type PairRow } from './PairBars';
import { Sarcomere } from './Sarcomere';
import { MITO_GAUGES } from './mito.content';

interface SceneProps { reduce: boolean; step: number }

/** Barras de "consumo de O₂" e "ATP produzido" sob uma mitocôndria. */
const Meters = ({ x, y, o2, atp, ghost, show, reduce }: { x: number; y: number; o2: number; atp: number; ghost?: number; show: boolean; reduce: boolean }) => (
    <FadeG show={show} reduce={reduce} delay={200}>
        <SvgText x={x} y={y} text="O₂ consumido" size={16} color={C.o2Soft} weight={600} />
        <rect x={x} y={y + 8} width={o2} height={14} rx={4} fill={C.o2} />
        {ghost && <rect x={x + o2} y={y + 8} width={ghost - o2} height={14} rx={4} fill="none" stroke={C.o2} strokeDasharray="4 4" opacity={0.7} />}
        <SvgText x={x} y={y + 52} text="ATP produzido" size={16} color={C.ok} weight={600} />
        <rect x={x} y={y + 60} width={atp} height={14} rx={4} fill={C.ok} />
    </FadeG>
);

/** Passos 1–2: a hipótese de 2011 (menos ANT, menos vazamento) e a lógica "mesmo ATP, menos O₂". */
export const HypothesisScene = ({ reduce, step }: SceneProps) => (
    <g>
        <SvgText x={185} y={36} text="PLACEBO" anchor="middle" size={20} color={C.placebo} weight={700} />
        <SvgText x={549} y={36} text="NITRATO · hipótese de 2011" anchor="middle" size={20} color={C.nitrateSoft} weight={700} />
        <Mito cx={185} cy={158} leaks={5} reduce={reduce} />
        <Mito cx={549} cy={158} leaks={2} accent={C.nitrate} glow reduce={reduce} />
        <SvgText x={185} y={262} text="ANT em quantidade: prótons vazam" anchor="middle" size={16} color={C.hypoxia} weight={600} />
        <SvgText x={549} y={262} text="menos ANT: menos vazamento de H⁺" anchor="middle" size={16} color={C.hypoxia} weight={600} />
        <Meters x={65} y={300} o2={240} atp={200} show={step >= 1} reduce={reduce} />
        <Meters x={429} y={300} o2={190} ghost={240} atp={200} show={step >= 1} reduce={reduce} />
        <FadeG show={step >= 1} reduce={reduce} delay={500}>
            <SvgText x={549} y={404} text="mesmo ATP, menos O₂" anchor="middle" size={20} color={C.nitrateSoft} weight={800} />
        </FadeG>
        <SvgText x={367} y={436} text="comprimentos ilustram a direção · nenhum valor de P/O" anchor="middle" size={16} color={C.muted} weight={500} />
    </g>
);

/** Passo 3: o efeito apareceu no corpo (−3% de VO₂ a 70% do VO₂pico); e dentro da fibra? */
export const BodyScene = ({ reduce }: SceneProps) => (
    <g>
        <SvgText x={150} y={36} text="VO₂ do corpo, a 70% do VO₂pico" anchor="middle" size={18} color={C.text} weight={600} />
        <rect x={80} y={90} width={60} height={290} rx={6} fill={C.placebo} />
        <rect x={170} y={90 + 290 * 0.03} width={60} height={290 * 0.97} rx={6} fill={C.nitrate} />
        <path d="M244 90 h10 V99 h-10" fill="none" stroke={C.text} strokeWidth={2} />
        <SvgText x={262} y={104} text="−3%" size={24} color={C.nitrateSoft} weight={800} />
        <SvgText x={110} y={406} text="placebo" anchor="middle" size={16} color={C.placebo} weight={600} />
        <SvgText x={200} y={406} text="beterraba" anchor="middle" size={16} color={C.nitrateSoft} weight={600} />
        <line x1={330} x2={330} y1={60} y2={400} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 6" />
        <SvgText x={540} y={36} text="e dentro da fibra?" anchor="middle" size={18} color={C.text} weight={600} />
        <Mito cx={540} cy={186} s={0.9} leaks={5} accent={C.placebo} reduce={reduce} />
        <SvgText x={540} y={218} text="?" anchor="middle" size={46} color={C.nitrateSoft} weight={800} />
        <SvgText x={540} y={318} text="fibras permeabilizadas" anchor="middle" size={18} color={C.muted} weight={500} />
        <SvgText x={540} y={344} text="e mitocôndrias isoladas" anchor="middle" size={18} color={C.muted} weight={500} />
        <SvgText x={540} y={370} text="(subsarcolemais e intermiofibrilares)" anchor="middle" size={16} color={C.muted} weight={500} />
    </g>
);

const GAUGE_ROWS: readonly PairRow[] = MITO_GAUGES.map(g => ({ ...g }));

/** Passo 4: o quadro de medidores; só o H₂O₂ sobe. */
export const GaugeScene = ({ reduce }: SceneProps) => (
    <PairBars rows={GAUGE_ROWS} reduce={reduce} title="mitocôndrias de placebo × beterraba (7 dias)" top={58} gap={50} barX={272} barW={250} />
);

/** Passo 5: VO₂ = demanda de ATP ÷ P/O. P/O parado, VO₂ caiu: a demanda é que caiu. O olhar vai ao sarcômero. */
export const VerdictScene = ({ reduce }: SceneProps) => (
    <g>
        <SvgText x={112} y={70} text="↓ VO₂" anchor="middle" size={30} color={C.o2Soft} weight={800} />
        <SvgText x={196} y={70} text="=" anchor="middle" size={30} color={C.muted} weight={700} />
        <SvgText x={352} y={70} text="demanda de ATP" anchor="middle" size={30} color={C.nitrateSoft} weight={800} />
        <SvgText x={510} y={70} text="÷" anchor="middle" size={30} color={C.muted} weight={700} />
        <SvgText x={600} y={70} text="P/O" anchor="middle" size={30} color={C.placebo} weight={800} />
        <SvgText x={112} y={100} text="caiu ~3%" anchor="middle" size={16} color={C.muted} weight={500} />
        <SvgText x={352} y={100} text="caiu (inferido)" anchor="middle" size={16} color={C.nitrateSoft} weight={600} />
        <SvgText x={600} y={100} text="não mudou" anchor="middle" size={16} color={C.muted} weight={500} />
        <Mito cx={165} cy={260} s={0.62} leaks={5} accent={C.placebo} opacity={0.5} reduce={reduce} />
        <SvgText x={165} y={346} text="mitocôndria: parada" anchor="middle" size={18} color={C.muted} weight={600} />
        <path d="M268 262 h72" stroke={C.nitrateSoft} strokeWidth={3.5} strokeLinecap="round" strokeDasharray="2 9" fill="none">
            {!reduce && <animate attributeName="stroke-dashoffset" from="22" to="0" dur="1.2s" repeatCount="indefinite" />}
        </path>
        <path d="M338 252 l16 10 l-16 10" fill="none" stroke={C.nitrateSoft} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
        <Sarcomere x={380} y={262} w={310} h={110} beat={!reduce} glow={C.nitrate} />
        <SvgText x={535} y={346} text="sarcômero: aqui está o custo" anchor="middle" size={18} color={C.nitrateSoft} weight={700} />
        <SvgText x={367} y={412} text="próximo slide: quanto ATP a contração gasta?" anchor="middle" size={18} color={C.text} weight={600} />
    </g>
);
