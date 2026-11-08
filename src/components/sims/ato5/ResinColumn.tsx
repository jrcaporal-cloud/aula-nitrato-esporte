import { useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { VIS_H, VIS_W } from './ui';

/**
 * A coluna de resina (passo 1 do PlaceboSim): nitratos descem e ficam presos nas esferas;
 * pigmento e açúcar atravessam. Animação por <animate> do SVG (sem keyframes do framer).
 */

const CX = VIS_W / 2;
const COL_L = CX - 62;
const COL_R = CX + 62;
const COL_T = 98;
const COL_B = 318;
const RESIN_T = 158;
const RESIN_B = 268;
const PIGMENT = '#8E1F52';

/** Esferas da resina: grade fixa, deslocada nas linhas pares. */
const BEADS = Array.from({ length: 7 * 6 }, (_, k) => {
    const row = Math.floor(k / 6);
    const col = k % 6;
    return { x: COL_L + 17 + col * 18 + (row % 2) * 9, y: RESIN_T + 12 + row * 15 };
});

interface Particle {
    x: number;
    delay: number;
    stop: number;
}

const NITRATES: readonly Particle[] = [
    { x: CX - 40, delay: 0, stop: 190 }, { x: CX - 14, delay: 0.5, stop: 222 }, { x: CX + 14, delay: 1.0, stop: 200 },
    { x: CX + 40, delay: 1.5, stop: 246 }, { x: CX - 26, delay: 2.0, stop: 238 }, { x: CX + 28, delay: 2.5, stop: 214 },
];
const PIGMENTS: readonly Particle[] = [
    { x: CX - 48, delay: 0.25, stop: 0 }, { x: CX - 6, delay: 0.95, stop: 0 }, { x: CX + 34, delay: 1.7, stop: 0 },
    { x: CX + 6, delay: 2.35, stop: 0 },
];
const SUGARS: readonly Particle[] = [
    { x: CX - 30, delay: 0.7, stop: 0 }, { x: CX + 48, delay: 1.25, stop: 0 }, { x: CX - 2, delay: 1.95, stop: 0 },
    { x: CX + 22, delay: 2.6, stop: 0 },
];
const CYCLE = 3.1;

const Droplet = ({ p, r, fill, stroke, mode, reduce }: { p: Particle; r: number; fill: string; stroke: string; mode: 'caught' | 'through'; reduce: boolean }) => {
    const end = mode === 'caught' ? p.stop : 372;
    if (reduce) {
        return <circle cx={p.x} cy={mode === 'caught' ? p.stop : COL_B - 40 - p.delay * 12} r={r} fill={fill} stroke={stroke} strokeWidth={1.2} />;
    }
    return (
        <circle cx={p.x} cy={COL_T + 8} r={r} fill={fill} stroke={stroke} strokeWidth={1.2} opacity={0}>
            <animate attributeName="cy" values={`${COL_T + 8};${end};${end}`} keyTimes="0;0.8;1" dur={`${CYCLE}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values={mode === 'caught' ? '0;1;1;0' : '0;1;1;0'} keyTimes={mode === 'caught' ? '0;0.08;0.9;1' : '0;0.08;0.78;1'}
                dur={`${CYCLE}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
        </circle>
    );
};

export const ResinColumn = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Suco passando por resina de troca aniônica">
            <defs>
                <linearGradient id="resin-glow" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor={C.o2} stopOpacity="0.05" />
                    <stop offset="1" stopColor={C.o2} stopOpacity="0.18" />
                </linearGradient>
            </defs>

            {/* béquer de entrada e de saída: o mesmo líquido */}
            <rect x={CX - 96} y={20} width={192} height={66} rx={12} fill={C.nitrateDeep} fillOpacity={0.85} stroke={C.nitrateSoft} strokeOpacity={0.7} />
            <SvgText x={CX} y={60} text="Suco de beterraba" anchor="middle" size={18} color="#fff" weight={700} />
            <rect x={CX - 96} y={354} width={192} height={66} rx={12} fill={C.nitrateDeep} fillOpacity={0.85} stroke={C.placebo} strokeOpacity={0.9} strokeWidth={2} />
            <SvgText x={CX} y={394} text="Placebo depletado" anchor="middle" size={18} color="#fff" weight={700} />

            {/* tubos de ligação */}
            <rect x={CX - 6} y={86} width={12} height={COL_T - 86} fill={C.nitrateDeep} />
            <rect x={CX - 6} y={COL_B} width={12} height={354 - COL_B} fill={C.nitrateDeep} />

            {/* coluna */}
            <rect x={COL_L} y={COL_T} width={COL_R - COL_L} height={COL_B - COL_T} rx={16} fill={C.nitrateDeep} fillOpacity={0.28}
                stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
            <rect x={COL_L + 2} y={RESIN_T} width={COL_R - COL_L - 4} height={RESIN_B - RESIN_T} fill="url(#resin-glow)" />
            {BEADS.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={7} fill={C.o2} fillOpacity={0.5} stroke={C.o2Soft} strokeOpacity={0.55} />)}

            {/* partículas */}
            {PIGMENTS.map((p, i) => <Droplet key={`p${i}`} p={p} r={5.5} fill={PIGMENT} stroke={C.nitrateSoft} mode="through" reduce={reduce} />)}
            {SUGARS.map((p, i) => <Droplet key={`s${i}`} p={p} r={3.6} fill="#F8FAFC" stroke="#CBD5E1" mode="through" reduce={reduce} />)}
            {NITRATES.map((p, i) => <Droplet key={`n${i}`} p={p} r={6.5} fill={C.nitrate} stroke="#fff" mode="caught" reduce={reduce} />)}

            {/* legenda à esquerda */}
            <circle cx={40} cy={128} r={6.5} fill={C.nitrate} stroke="#fff" strokeWidth={1.2} />
            <SvgText x={58} y={134} text="nitrato: fica preso" size={17} color={C.nitrateSoft} weight={700} />
            <circle cx={40} cy={168} r={5.5} fill={PIGMENT} stroke={C.nitrateSoft} strokeWidth={1.2} />
            <SvgText x={58} y={174} text="pigmento: atravessa" size={17} color="#E5E7EB" />
            <circle cx={40} cy={208} r={3.6} fill="#F8FAFC" stroke="#CBD5E1" strokeWidth={1.2} />
            <SvgText x={58} y={214} text="açúcar e sabor: passam" size={17} color="#E5E7EB" />

            {/* valores à direita */}
            <SvgText x={CX + 112} y={52} text="entra: 7,5 mmol" size={18} color={C.nitrateSoft} weight={700} />
            <SvgText x={CX + 112} y={74} text="de nitrato por 250 mL" size={16} color={C.muted} weight={500} />
            <SvgText x={CX + 76} y={206} text="resina Purolite A520e" size={17} color={C.o2Soft} weight={700} />
            <SvgText x={CX + 76} y={228} text="troca o ânion nitrato" size={16} color={C.muted} weight={500} />
            <SvgText x={CX + 112} y={388} text="sai: 0,002 mmol" size={18} color="#E5E7EB" weight={700} />
            <SvgText x={CX + 112} y={410} text="por 250 mL" size={16} color={C.muted} weight={500} />
        </svg>
    );
};
