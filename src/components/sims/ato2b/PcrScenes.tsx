import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { useTweenNum } from './useTweenNum';
import { br } from '../kit/format';
import { seeded } from './geom';
import { PairBars, type PairRow } from './PairBars';
import { Sarcomere } from './Sarcomere';
import { ATP_HIGH, ATP_LOW, DPCR_NITRATE, DPCR_PLACEBO } from './pcr.content';

interface SceneProps { reduce: boolean; step: number }

const PX_PER_MM = 6;
const BASE_Y = 318;
const CENTERS = { placebo: 185, nitrate: 549 } as const;

/** Picos do espectro de ³¹P: posição em ppm, largura e altura em repouso (px, ilustrativas). */
const PEAKS = [
    { key: 'pi', ppm: 5, w: 5, h: 20 },
    { key: 'pcr', ppm: 0, w: 3.5, h: 150 },
    { key: 'g', ppm: -2.5, w: 6, h: 62 },
    { key: 'a', ppm: -7.5, w: 6, h: 58 },
    { key: 'b', ppm: -16, w: 7, h: 46 },
] as const;

const xOf = (cx: number, ppm: number) => cx - 150 + ((6 - ppm) / 24) * 300;

/** Espectro como soma de lorentzianas; `dPcr` (mM) tira altura da PCr e põe parte dela no Pi. */
const spectrumPath = (cx: number, dPcr: number, seed: number): string => {
    const rnd = seeded(seed);
    const drop = dPcr * PX_PER_MM;
    const hs = PEAKS.map(p => (p.key === 'pcr' ? p.h - drop : p.key === 'pi' ? p.h + drop * 0.5 : p.h));
    const pts: string[] = [];
    for (let x = cx - 150; x <= cx + 150; x += 1.5) {
        const y = BASE_Y - PEAKS.reduce((acc, p, i) => acc + hs[i] / (1 + ((x - xOf(cx, p.ppm)) / p.w) ** 2), 0) + (rnd() - 0.5) * 1.6;
        pts.push(`${pts.length === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
};

const Spectrum = ({ cx, dPcr, color, label, reduce }: { cx: number; dPcr: number; color: string; label: string; reduce: boolean }) => {
    const p = useTweenNum(1, reduce, 1800);
    const pcrRest = PEAKS[1].h;
    const yRest = BASE_Y - pcrRest;
    const yNow = BASE_Y - (pcrRest - dPcr * PX_PER_MM * p);
    const xp = xOf(cx, 0);
    return (
        <g>
            <path d={spectrumPath(cx, 0, 3)} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} strokeDasharray="4 4" />
            <path d={spectrumPath(cx, dPcr * p, 7)} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" />
            <line x1={cx - 150} x2={cx + 150} y1={BASE_Y} y2={BASE_Y} stroke="rgba(255,255,255,0.25)" />
            <line x1={xp} x2={xp + 30} y1={yRest} y2={yRest} stroke={C.text} strokeOpacity={0.6} strokeDasharray="3 4" />
            <line x1={xp} x2={xp + 30} y1={yNow} y2={yNow} stroke={C.text} strokeOpacity={0.6} strokeDasharray="3 4" />
            <path d={`M${xp + 22} ${yRest} v${Math.max(yNow - yRest - 2, 0)}`} stroke={C.text} strokeWidth={2.5} markerEnd="url(#pcrArrow)" fill="none" opacity={p > 0.05 ? 1 : 0} />
            <SvgText x={xp + 36} y={yRest + 28} text={`ΔPCr ${br(dPcr, 1)} mM`} size={20} color={color === C.placebo ? C.text : C.nitrateSoft} weight={800} />
            <SvgText x={xOf(cx, 5)} y={BASE_Y + 24} text="Pi" anchor="middle" size={16} color={C.muted} weight={600} />
            <SvgText x={xp} y={BASE_Y + 24} text="PCr" anchor="middle" size={16} color={C.text} weight={700} />
            <SvgText x={xOf(cx, -9)} y={BASE_Y + 24} text="ATP (γ, α, β)" anchor="middle" size={16} color={C.muted} weight={600} />
            <SvgText x={cx} y={BASE_Y + 56} text={label} anchor="middle" size={16} color={C.muted} weight={500} />
        </g>
    );
};

/** Quatro barras de turnover de ATP (baixa e alta intensidade), escala única. */
const AtpBars = ({ reduce }: { reduce: boolean }) => {
    const k = useTweenNum(1, reduce, 1200);
    const base = 372;
    const scale = 160 / ATP_HIGH.placebo;
    const group = (x: number, name: string, v: { placebo: number; nitrate: number }) => (
        <g>
            {([['placebo', C.placebo, x], ['nitrate', C.nitrate, x + 92]] as const).map(([key, color, bx]) => {
                const h = v[key] * scale * k;
                return (
                    <g key={key}>
                        <rect x={bx} y={base - h} width={70} height={h} rx={5} fill={color} />
                        <SvgText x={bx + 35} y={base - h - 8} text={String(v[key])} anchor="middle" size={22} color={key === 'nitrate' ? C.nitrateSoft : C.text} weight={800} />
                    </g>
                );
            })}
            <SvgText x={x + 81} y={base + 30} text={name} anchor="middle" size={18} color={C.text} weight={700} />
        </g>
    );
    return (
        <g>
            <line x1={60} x2={680} y1={base} y2={base} stroke="rgba(255,255,255,0.25)" />
            <SvgText x={60} y={176} text="turnover de ATP estimado (µM/s)" size={18} color={C.muted} weight={600} />
            {group(110, 'carga baixa', ATP_LOW)}
            {group(430, 'carga alta', ATP_HIGH)}
            <rect x={560} y={162} width={14} height={14} rx={3} fill={C.placebo} />
            <SvgText x={580} y={176} text="placebo" size={16} color={C.placebo} weight={600} />
            <rect x={560} y={186} width={14} height={14} rx={3} fill={C.nitrate} />
            <SvgText x={580} y={200} text="nitrato" size={16} color={C.nitrateSoft} weight={600} />
        </g>
    );
};

/** pH muscular: as duas linhas coincidem; a tracejada mostra o que a glicólise compensatória faria. */
const PhLines = ({ reduce }: { reduce: boolean }) => (
    <g>
        <SvgText x={60} y={180} text="pH muscular durante o exercício" size={18} color={C.muted} weight={600} />
        <line x1={60} x2={680} y1={372} y2={372} stroke="rgba(255,255,255,0.25)" />
        <path d="M60 214 H680" stroke={C.placebo} strokeWidth={6} strokeLinecap="round" />
        <path d="M60 214 H680" stroke={C.nitrate} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="14 10" />
        <path d="M60 214 C260 216 420 270 680 332" fill="none" stroke={C.hypoxia} strokeWidth={3} strokeDasharray="3 8" strokeLinecap="round">
            {!reduce && <animate attributeName="stroke-dashoffset" from="22" to="0" dur="1.4s" repeatCount="indefinite" />}
        </path>
        <SvgText x={680} y={196} text="placebo e nitrato: iguais" anchor="end" size={18} color={C.text} weight={700} />
        <SvgText x={680} y={362} text="o que a glicólise compensatória faria (hipotético)" anchor="end" size={16} color={C.hypoxia} weight={600} />
        <SvgText x={367} y={404} text="tempo de exercício →" anchor="middle" size={16} color={C.muted} weight={500} />
    </g>
);

/** Passo 5: carga intensa. Comprimentos em proporção real (o nitrato tem barra menor nos dois componentes lentos e maior no tempo). */
const SLOW_ROWS: readonly PairRow[] = [
    { label: 'Comp. lento do VO₂', ratio: 100 / 209, note: '209 → 100 mL/min', accent: true },
    { label: 'Comp. lento da PCr', ratio: 1.6 / 3.9, note: '3,9 → 1,6 mM', accent: true },
    { label: 'Tempo até a exaustão', ratio: 734 / 586, note: '586 → 734 s', accent: true, noteColor: C.noSoft },
];

const SlowBars = ({ reduce }: { reduce: boolean }) => (
    <PairBars rows={SLOW_ROWS} reduce={reduce} top={176} gap={74} barX={250} barW={210} />
);

/** Halter simples: a "mesma carga" nas duas condições. */
const Dumbbell = ({ cx, y }: { cx: number; y: number }) => (
    <g opacity={0.85}>
        <line x1={cx - 46} x2={cx + 46} y1={y} y2={y} stroke={C.muted} strokeWidth={7} strokeLinecap="round" />
        {[-52, 40].map(dx => <rect key={dx} x={cx + dx} y={y - 22} width={12} height={44} rx={4} fill={C.text} />)}
        {[-64, 52].map(dx => <rect key={dx} x={cx + dx} y={y - 15} width={12} height={30} rx={4} fill={C.muted} />)}
    </g>
);

/** Cena única: o sarcômero no topo conta a história e a parte de baixo troca por passo. */
export const PcrScene = ({ reduce, step }: SceneProps) => {
    const dy = step === 0 ? 96 : 0;
    const dur = step === 4 ? 1.0 : 1.6;
    return (
        <g>
            <defs>
                <marker id="pcrArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                    <path d="M0 0 L10 5 L0 10 z" fill={C.text} />
                </marker>
            </defs>
            <SvgText x={CENTERS.placebo} y={34} text="PLACEBO" anchor="middle" size={20} color={C.placebo} weight={700} />
            <SvgText x={CENTERS.nitrate} y={34} text="NITRATO" anchor="middle" size={20} color={C.nitrateSoft} weight={700} />
            <g style={{ transform: `translateY(${dy}px)`, transition: reduce ? 'none' : 'transform 800ms ease' }}>
                <Sarcomere key={`p${dur}`} x={CENTERS.placebo - 130} y={92} w={260} h={70} beat={!reduce} dur={dur} thick={C.placebo} />
                <Sarcomere key={`n${dur}`} x={CENTERS.nitrate - 130} y={92} w={260} h={70} beat={!reduce} dur={dur} thick={C.nitrate} glow={C.nitrate} />
                <SvgText x={367} y={102} text="=" anchor="middle" size={34} color={C.text} weight={800} />
                {step === 0 && [CENTERS.placebo, CENTERS.nitrate].map(cx => <Dumbbell key={cx} cx={cx} y={168} />)}
                {step === 0 && <SvgText x={367} y={226} text="mesma carga · mesma duração" anchor="middle" size={18} color={C.text} weight={600} />}
            </g>
            {step === 1 && (
                <g>
                    <Spectrum cx={CENTERS.placebo} dPcr={DPCR_PLACEBO} color={C.placebo} label="espectro de ³¹P · esquemático" reduce={reduce} />
                    <Spectrum cx={CENTERS.nitrate} dPcr={DPCR_NITRATE} color={C.nitrate} label="tracejado = repouso" reduce={reduce} />
                </g>
            )}
            {step === 2 && <AtpBars reduce={reduce} />}
            {step === 3 && <PhLines reduce={reduce} />}
            {step === 4 && <SlowBars reduce={reduce} />}
        </g>
    );
};
