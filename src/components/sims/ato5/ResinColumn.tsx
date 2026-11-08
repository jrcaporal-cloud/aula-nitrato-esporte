import { useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import { VIS_H, VIS_W } from './ui';
import { Glow, T } from './arte/text';
import { Glass, VesselDefs } from './arte/vessels';

/**
 * A coluna de resina (passo 1 do PlaceboSim): nitratos descem e ficam presos nas esferas;
 * pigmento e açúcar atravessam. Animação por <animate> do SVG (sem keyframes do framer).
 */

const CX = VIS_W / 2;
const COL_L = CX - 62;
const COL_R = CX + 62;
const COL_T = 104;
const COL_B = 322;
const RESIN_T = 160;
const RESIN_B = 272;
const PIGMENT = '#8E1F52';

/** Esferas da resina: grade fixa, deslocada nas linhas pares. */
const BEADS = Array.from({ length: 7 * 6 }, (_, k) => {
    const row = Math.floor(k / 6);
    const col = k % 6;
    return { x: COL_L + 17 + col * 18 + (row % 2) * 9, y: RESIN_T + 13 + row * 15 };
});

interface Particle {
    x: number;
    delay: number;
    stop: number;
}

const NITRATES: readonly Particle[] = [
    { x: CX - 40, delay: 0, stop: 192 }, { x: CX - 14, delay: 0.5, stop: 224 }, { x: CX + 14, delay: 1.0, stop: 202 },
    { x: CX + 40, delay: 1.5, stop: 248 }, { x: CX - 26, delay: 2.0, stop: 240 }, { x: CX + 28, delay: 2.5, stop: 216 },
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
    const end = mode === 'caught' ? p.stop : 380;
    if (reduce) {
        return <circle cx={p.x} cy={mode === 'caught' ? p.stop : COL_B - 40 - p.delay * 12} r={r} fill={fill} stroke={stroke} strokeWidth={1.2} />;
    }
    return (
        <circle cx={p.x} cy={COL_T + 8} r={r} fill={fill} stroke={stroke} strokeWidth={1.2} opacity={0}>
            <animate attributeName="cy" values={`${COL_T + 8};${end};${end}`} keyTimes="0;0.8;1" dur={`${CYCLE}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes={mode === 'caught' ? '0;0.08;0.9;1' : '0;0.08;0.78;1'}
                dur={`${CYCLE}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
        </circle>
    );
};

/** Medidor vertical de nitrato: cheio na entrada, quase vazio na saída. */
const Meter = ({ y, fill, label }: { y: number; fill: number; label: string }) => (
    <g>
        <rect x={150} y={y} width={16} height={64} rx={8} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.45)" strokeWidth={1.6} />
        <rect x={153} y={y + 3 + 58 * (1 - fill)} width={10} height={Math.max(58 * fill, 3)} rx={5} fill={C.nitrate} />
        <T x={176} y={y + 38} size={16} color={C.nitrateSoft} weight={700}>{label}</T>
    </g>
);

export const ResinColumn = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Suco passando por resina de troca aniônica">
            <VesselDefs />
            <defs>
                <linearGradient id="resin-glow" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor={C.o2} stopOpacity="0.05" />
                    <stop offset="1" stopColor={C.o2} stopOpacity="0.2" />
                </linearGradient>
                <radialGradient id="resin-bead" cx="0.35" cy="0.3" r="0.8">
                    <stop offset="0" stopColor="#DBEAFE" />
                    <stop offset="0.45" stopColor="#60A5FA" />
                    <stop offset="1" stopColor="#1E3A8A" />
                </radialGradient>
            </defs>

            {/* béquer de entrada e de saída: o mesmo líquido, a mesma cor */}
            <Glass id="rc-in" x={CX - 104} y={12} w={208} h={76} level={0.88} taper={0.03} />
            <T x={CX} y={60} size={19} color="#fff" weight={700} anchor="middle">Suco de beterraba</T>
            <Glass id="rc-out" x={CX - 104} y={352} w={208} h={76} level={0.88} taper={0.03} />
            <T x={CX} y={400} size={19} color="#fff" weight={700} anchor="middle">Placebo depletado</T>

            {/* tubos com o líquido correndo */}
            {[{ y1: 88, y2: COL_T }, { y1: COL_B, y2: 352 }].map((t, i) => (
                <g key={i}>
                    <rect x={CX - 8} y={t.y1} width={16} height={t.y2 - t.y1} fill="url(#av-juice)" />
                    <rect x={CX - 8} y={t.y1} width={16} height={t.y2 - t.y1} fill="none" stroke="rgba(255,255,255,0.4)" />
                    <line x1={CX} x2={CX} y1={t.y1} y2={t.y2} stroke="#fff" strokeOpacity={0.5} strokeWidth={3} strokeDasharray="4 8" strokeLinecap="round">
                        {!reduce && <animate attributeName="stroke-dashoffset" values="0;-24" dur="0.9s" repeatCount="indefinite" />}
                    </line>
                </g>
            ))}

            {/* coluna */}
            <Glow id="rc-glow" cx={CX} cy={232} r={104} color={C.nitrate} opacity={0.4} pulse={!reduce} />
            <rect x={COL_L} y={COL_T} width={COL_R - COL_L} height={COL_B - COL_T} rx={18} fill={C.nitrateDeep} fillOpacity={0.3}
                stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
            <rect x={COL_L + 2} y={RESIN_T} width={COL_R - COL_L - 4} height={RESIN_B - RESIN_T} fill="url(#resin-glow)" />
            {BEADS.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={7.4} fill="url(#resin-bead)" stroke={C.o2Soft} strokeOpacity={0.5} />)}
            <path d={`M${COL_L + 8} ${COL_T + 12}V${COL_B - 12}`} stroke="#fff" strokeOpacity={0.22} strokeWidth={5} strokeLinecap="round" />

            {/* partículas */}
            {PIGMENTS.map((p, i) => <Droplet key={`p${i}`} p={p} r={5.5} fill={PIGMENT} stroke={C.nitrateSoft} mode="through" reduce={reduce} />)}
            {SUGARS.map((p, i) => <Droplet key={`s${i}`} p={p} r={3.6} fill="#F8FAFC" stroke="#CBD5E1" mode="through" reduce={reduce} />)}
            {NITRATES.map((p, i) => <Droplet key={`n${i}`} p={p} r={6.8} fill={C.nitrate} stroke="#fff" mode="caught" reduce={reduce} />)}

            {/* medidores de nitrato */}
            <Meter y={16} fill={1} label="NO₃⁻" />
            <Meter y={360} fill={0.02} label="NO₃⁻" />

            {/* legenda à esquerda */}
            <rect x={14} y={112} width={246} height={122} rx={14} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
            <circle cx={36} cy={142} r={6.8} fill={C.nitrate} stroke="#fff" strokeWidth={1.2} />
            <T x={54} y={148} size={17} color={C.nitrateSoft} weight={700}>nitrato: fica preso</T>
            <circle cx={36} cy={176} r={5.5} fill={PIGMENT} stroke={C.nitrateSoft} strokeWidth={1.2} />
            <T x={54} y={182} size={17}>pigmento: atravessa</T>
            <circle cx={36} cy={210} r={3.8} fill="#F8FAFC" stroke="#CBD5E1" strokeWidth={1.2} />
            <T x={54} y={216} size={17}>açúcar e sabor: passam</T>

            {/* valores à direita */}
            <T x={CX + 122} y={46} size={19} color={C.nitrateSoft} weight={700}>entra: 7,5 mmol</T>
            <T x={CX + 122} y={68} size={16} color={C.muted} weight={500}>de nitrato por 250 mL</T>
            <T x={CX + 80} y={212} size={17} color={C.o2Soft} weight={700}>resina Purolite A520e</T>
            <T x={CX + 80} y={234} size={16} color={C.muted} weight={500}>troca o ânion nitrato</T>
            <T x={CX + 122} y={386} size={19} color="#E5E7EB" weight={700}>sai: 0,002 mmol</T>
            <T x={CX + 122} y={408} size={16} color={C.muted} weight={500}>por 250 mL</T>
        </svg>
    );
};
