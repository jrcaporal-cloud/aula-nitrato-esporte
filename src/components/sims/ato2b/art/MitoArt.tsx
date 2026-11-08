import { motion } from 'framer-motion';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { DrawPath, FadeG } from '../DrawPath';
import { Mito } from '../Mito';
import { Sarcomere } from '../Sarcomere';
import { MITO_GAUGES } from '../mito.content';

/**
 * Slide 27 em grande escala. 1–2: duas mitocôndrias grandes (placebo × hipótese de 2011) e, depois, os medidores
 * "mesmo ATP, menos O₂". 3: o corpo gasta ~3% menos O₂, e a lupa entra na fibra. 4: o painel de sete medidores
 * (seis parados, só o H₂O₂ sobe). 5: o risco vermelho sobre a hipótese antiga e o olhar indo para o sarcômero.
 */

interface SceneProps { reduce: boolean; step: number }

const Meter = ({ x, y, o2, atp, ghost }: { x: number; y: number; o2: number; atp: number; ghost?: number }) => (
    <g>
        <SvgText x={x} y={y} text="O₂ consumido" size={16} color={C.o2Soft} />
        <rect x={x + 120} y={y - 14} width={o2} height={18} rx={6} fill={C.o2} style={{ filter: `drop-shadow(0 0 6px ${C.o2})` }} />
        {ghost && <rect x={x + 120 + o2} y={y - 14} width={ghost - o2} height={18} rx={6} fill="none" stroke={C.o2} strokeDasharray="4 4" />}
        <SvgText x={x} y={y + 34} text="ATP produzido" size={16} color={C.ok} />
        <rect x={x + 120} y={y + 20} width={atp} height={18} rx={6} fill={C.ok} style={{ filter: `drop-shadow(0 0 6px ${C.ok})` }} />
    </g>
);

const shrink = (logic: boolean, reduce: boolean) => ({
    transform: logic ? 'translateY(-34px) scale(0.78)' : 'none', transformBox: 'fill-box' as const, transformOrigin: 'center',
    transition: reduce ? 'none' : 'transform 900ms cubic-bezier(.2,.7,.2,1)',
});

/** Passos 1–2: a hipótese de 2011. */
export const HypothesisArt = ({ reduce, step }: SceneProps) => {
    const logic = step >= 1;
    return (
        <g>
            <circle cx={810} cy={150} r={190} fill={C.nitrate} opacity={0.08} />
            <SvgText x={290} y={30} text="PLACEBO" anchor="middle" size={20} color={C.placebo} weight={800} />
            <SvgText x={810} y={30} text="NITRATO · hipótese de 2011" anchor="middle" size={20} color={C.nitrateSoft} weight={800} />
            <line x1={555} x2={555} y1={50} y2={300} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 7" />
            <g style={shrink(logic, reduce)}><Mito cx={290} cy={150} s={1.12} leaks={5} reduce={reduce} /></g>
            <g style={shrink(logic, reduce)}><Mito cx={810} cy={150} s={1.12} leaks={2} accent={C.nitrate} glow reduce={reduce} /></g>
            <FadeG show={!logic} reduce={reduce}>
                <SvgText x={290} y={268} text="ANT em quantidade: prótons vazam" anchor="middle" size={17} color={C.hypoxia} />
                <SvgText x={810} y={268} text="menos ANT: menos vazamento de H⁺" anchor="middle" size={17} color={C.hypoxia} />
                {['P/O ↑', 'estado 4 ↓', 'ANT ↓'].map((t, i) => (
                    <g key={t}>
                        <rect x={990} y={70 + i * 46} width={112} height={34} rx={17} fill={`${C.nitrate}26`} stroke={C.nitrateSoft} strokeOpacity={0.7} />
                        <SvgText x={1046} y={93 + i * 46} text={t} anchor="middle" size={17} color={C.nitrateSoft} weight={700} />
                    </g>
                ))}
            </FadeG>
            <FadeG show={logic} reduce={reduce} delay={350}>
                <Meter x={110} y={238} o2={300} atp={250} />
                <Meter x={630} y={238} o2={240} ghost={300} atp={250} />
                <SvgText x={810} y={304} text="mesmo ATP, menos O₂" anchor="middle" size={20} color={C.nitrateSoft} weight={800} />
                <SvgText x={290} y={304} text="comprimentos ilustram a direção · nenhum valor de P/O" anchor="middle" size={16} color={C.muted} weight={500} />
            </FadeG>
        </g>
    );
};

/** Passo 3: o corpo gasta menos O₂; a lupa entra na fibra. */
export const BodyArt = ({ reduce }: SceneProps) => (
    <g>
        <SvgText x={230} y={30} text="VO₂ do corpo, a 70% do VO₂pico" anchor="middle" size={19} color={C.text} />
        <rect x={110} y={60} width={100} height={224} rx={10} fill={C.placebo} opacity={0.85} />
        <rect x={250} y={60 + 224 * 0.03} width={100} height={224 * 0.97} rx={10} fill={C.nitrate} style={{ filter: `drop-shadow(0 0 14px ${C.nitrate})` }} />
        <path d="M362 60 h12 V67 h-12" fill="none" stroke={C.text} strokeWidth={2} />
        <SvgText x={382} y={74} text="−3%" size={30} color={C.nitrateSoft} weight={800} />
        <SvgText x={160} y={308} text="placebo" anchor="middle" size={17} color={C.placebo} />
        <SvgText x={300} y={308} text="beterraba" anchor="middle" size={17} color={C.nitrateSoft} />
        <path d="M450 170 C520 170 540 160 600 160" fill="none" stroke={C.nitrateSoft} strokeWidth={3} strokeDasharray="2 10" strokeLinecap="round">
            {!reduce && <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1s" repeatCount="indefinite" />}
        </path>
        <SvgText x={520} y={146} text="e dentro da fibra?" anchor="middle" size={19} color={C.text} />
        <circle cx={790} cy={158} r={126} fill="#0E0915" stroke={C.nitrateSoft} strokeWidth={6} style={{ filter: `drop-shadow(0 0 18px ${C.nitrate}88)` }} />
        <path d="M880 250 L960 314" stroke={C.nitrateSoft} strokeWidth={18} strokeLinecap="round" />
        <Mito cx={790} cy={150} s={0.78} leaks={5} accent={C.placebo} reduce={reduce} />
        <SvgText x={790} y={170} text="?" anchor="middle" size={58} color={C.nitrateSoft} weight={800} />
        <SvgText x={1000} y={92} text="fibras permeabilizadas" size={17} color={C.muted} anchor="start" />
        <SvgText x={1000} y={114} text="e mitocôndrias" size={17} color={C.muted} anchor="start" />
        <SvgText x={1000} y={136} text="isoladas" size={17} color={C.muted} anchor="start" />
    </g>
);

const GAUGE_LINES: readonly (readonly string[])[] = [['Vazamento', '(leak)'], ['UCP3'], ['ANT1 e', 'ANT2'], ['Razão', 'P/O'], ['Potencial de', 'membrana'], ['Sensib. ao', 'ADP (Km)'], ['Emissão', 'de H₂O₂']];
const ARC = 'M-60 0 A60 60 0 0 1 60 0';

/** Passo 4: sete medidores; seis parados no "igual", só o H₂O₂ sobe (ângulo ilustrativo, sem valor). */
export const GaugesArt = ({ reduce }: SceneProps) => (
    <g>
        <SvgText x={555} y={30} text="mitocôndrias de placebo × beterraba (7 dias)" anchor="middle" size={19} color={C.text} />
        {MITO_GAUGES.map((g, i) => {
            const cx = 80 + i * 158;
            const up = 'accent' in g;
            const color = up ? C.hypoxia : C.placebo;
            return (
                <g key={g.label} transform={`translate(${cx} 150)`}>
                    <circle r={74} fill={up ? `${C.hypoxia}1c` : 'rgba(255,255,255,0.03)'} stroke={up ? C.hypoxia : 'rgba(255,255,255,0.12)'} strokeWidth={up ? 2.5 : 1.5}
                        style={up ? { filter: `drop-shadow(0 0 14px ${C.hypoxia})` } : undefined} />
                    <path d={ARC} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={10} strokeLinecap="round" />
                    <path d="M-60 0 A60 60 0 0 1 0 -60" fill="none" stroke={C.placebo} strokeOpacity={0.35} strokeWidth={10} strokeLinecap="round" />
                    {[-60, -30, 0, 30, 60].map(a => (
                        <line key={a} x1={0} y1={-46} x2={0} y2={-38} stroke="#fff" strokeOpacity={a === 0 ? 0.8 : 0.3} strokeWidth={2} transform={`rotate(${a})`} />
                    ))}
                    <motion.g initial={{ rotate: reduce ? (g.ratio - 1) * 180 : -80 }} animate={{ rotate: (g.ratio - 1) * 180 }}
                        transition={{ type: 'spring', stiffness: 90, damping: up ? 6 : 12, delay: reduce ? 0 : 0.15 + i * 0.12 }}>
                        <rect x={-6} y={-54} width={12} height={108} fill="transparent" />
                        <line x1={0} y1={0} x2={0} y2={-52} stroke={color} strokeWidth={5} strokeLinecap="round" />
                    </motion.g>
                    <circle r={8} fill={color} />
                    <SvgText x={0} y={32} text={up ? 'sobe' : '='} anchor="middle" size={up ? 18 : 22} color={up ? C.hypoxia : C.muted} weight={800} />
                    {GAUGE_LINES[i].map((line, k) => (
                        <SvgText key={line} x={0} y={104 + k * 20} text={line} anchor="middle" size={16} color={up ? C.hypoxia : C.text} weight={600} />
                    ))}
                </g>
            );
        })}
    </g>
);

/** Passo 5: VO₂ = demanda de ATP ÷ P/O. O risco cai sobre a hipótese antiga; o olhar vai ao sarcômero. */
export const VerdictArt = ({ reduce }: SceneProps) => (
    <g>
        <SvgText x={150} y={46} text="↓ VO₂" anchor="middle" size={32} color={C.o2Soft} weight={800} />
        <SvgText x={250} y={46} text="=" anchor="middle" size={32} color={C.muted} weight={700} />
        <SvgText x={440} y={46} text="demanda de ATP" anchor="middle" size={32} color={C.nitrateSoft} weight={800} />
        <SvgText x={635} y={46} text="÷" anchor="middle" size={32} color={C.muted} weight={700} />
        <SvgText x={730} y={46} text="P/O" anchor="middle" size={32} color={C.placebo} weight={800} />
        <SvgText x={150} y={74} text="caiu ~3%" anchor="middle" size={16} color={C.muted} weight={500} />
        <SvgText x={440} y={74} text="caiu (inferido)" anchor="middle" size={16} color={C.nitrateSoft} />
        <SvgText x={730} y={74} text="não mudou" anchor="middle" size={16} color={C.muted} weight={500} />

        <Mito cx={210} cy={200} s={0.72} leaks={2} accent={C.placebo} opacity={0.55} reduce={reduce} />
        <SvgText x={210} y={118} text="hipótese de 2011: eficiência" anchor="middle" size={16} color={C.muted} />
        <DrawPath d="M110 140 L310 272" color={C.risk} show reduce={reduce} width={9} delay={250} ms={500} />
        <DrawPath d="M310 140 L110 272" color={C.risk} show reduce={reduce} width={9} delay={650} ms={500} />
        <SvgText x={210} y={300} text="mitocôndria: parada" anchor="middle" size={18} color={C.muted} />

        <path d="M370 200 H560" stroke={C.ok} strokeWidth={10} strokeOpacity={0.15} strokeLinecap="round" />
        {!reduce && [0, 1, 2, 3].map(i => (
            <g key={i}>
                <circle r={9} fill={C.ok} />
                <animateMotion dur="2s" begin={`${-i * 0.5}s`} repeatCount="indefinite" path="M370 200 H560" />
            </g>
        ))}
        <SvgText x={465} y={232} text="mesmo ATP por O₂" anchor="middle" size={16} color={C.ok} />
        <circle cx={790} cy={200} r={150} fill={C.nitrate} opacity={0.1} />
        <Sarcomere x={600} y={200} w={380} h={130} beat={!reduce} glow={C.nitrate} />
        <SvgText x={790} y={284} text="sarcômero: aqui está o custo" anchor="middle" size={19} color={C.nitrateSoft} weight={800} />
        <SvgText x={790} y={308} text="próximo slide: quanto ATP a contração gasta?" anchor="middle" size={16} color={C.text} />
    </g>
);
