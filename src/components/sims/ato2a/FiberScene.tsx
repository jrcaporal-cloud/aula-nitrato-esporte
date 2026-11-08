import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import type { ReservoirMode } from './reservoir.content';

/** Capilar e fibra muscular (região de 340×446): pontos de nitrato, nitrito e NO em número proporcional (esquema). */

/** Quantos pontos de cada espécie aparecem em cada modo. Nitrato 1:4 e nitrito 1:29 vêm de Wylie 2019; o resto é esquema. */
const COUNTS: Record<ReservoirMode, { pn: number; mn: number; pt: number; mt: number; no: number }> = {
    basal: { pn: 2, mn: 8, pt: 1, mt: 29, no: 0 },
    dose: { pn: 19, mn: 20, pt: 3, mt: 29, no: 0 },
    machinery: { pn: 19, mn: 20, pt: 3, mt: 29, no: 0 },
    exercise: { pn: 19, mn: 12, pt: 3, mt: 29, no: 0 },
    rat: { pn: 2, mn: 5, pt: 2, mt: 40, no: 12 },
};

const halton = (i: number, base: number): number => {
    let f = 1;
    let r = 0;
    for (let n = i + 1; n > 0; n = Math.floor(n / base)) {
        f /= base;
        r += f * (n % base);
    }
    return r;
};

interface DotsProps { n: number; max: number; seed: number; box: [number, number, number, number]; color: string; r?: number; reduce: boolean }

/** Pontos espalhados por uma sequência de Halton: o índice fixa a posição, então só o final some ou aparece. */
const Dots = ({ n, max, seed, box, color, r = 4.5, reduce }: DotsProps) => (
    <g>
        {Array.from({ length: max }, (_, i) => {
            const cx = box[0] + halton(i + seed, 2) * box[2];
            const cy = box[1] + halton(i + seed, 3) * box[3];
            return (
                <circle key={i} cx={cx} cy={cy} r={r} fill={color} style={{ opacity: i < n ? 1 : 0, transition: 'opacity 0.6s' }}>
                    {!reduce && i < n && <animate attributeName="cy" values={`${cy};${cy + 4};${cy}`} dur={`${2.2 + (i % 5) * 0.35}s`} repeatCount="indefinite" />}
                </circle>
            );
        })}
    </g>
);

interface Props { mode: ReservoirMode; dilate: number; reduce: boolean }

const TUBE_Y = 72;

export const FiberScene = ({ mode, dilate, reduce }: Props) => {
    const c = COUNTS[mode];
    const tubeH = 54 + Math.min(1, Math.max(0, dilate)) * 24;
    const showXor = mode === 'machinery' || mode === 'exercise' || mode === 'rat';
    const showSialin = mode !== 'basal';
    return (
        <g>
            <SvgText x={14} y={26} text="capilar · plasma" size={16} color={C.muted} />
            <rect x={6} y={TUBE_Y - tubeH / 2} width={328} height={tubeH} rx={tubeH / 2} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
            <Dots n={c.pn} max={19} seed={3} box={[34, 54, 272, 36]} color={C.nitrateSoft} reduce={reduce} />
            <Dots n={c.pt} max={3} seed={40} box={[34, 54, 272, 36]} color={C.nitrite} r={4} reduce={reduce} />

            {/* sialina importa o nitrato para a fibra */}
            <g style={{ opacity: showSialin ? 1 : 0.3, transition: 'opacity 0.4s' }}>
                {[110, 230].map(x => (
                    <path key={x} d={`M${x} ${TUBE_Y + tubeH / 2 + 4} L${x} 134 M${x - 5} 127 L${x} 134 L${x + 5} 127`} fill="none" stroke={C.nitrateSoft} strokeWidth={2} />
                ))}
                <rect x={130} y={118} width={80} height={26} rx={13} fill="#07050B" stroke={C.nitrateSoft} strokeWidth={1.5} />
                <SvgText x={170} y={137} text="sialina" size={16} weight={700} anchor="middle" color={C.nitrateSoft} />
            </g>

            <rect x={6} y={148} width={328} height={260} rx={22} fill="rgba(148,163,184,0.06)" stroke={C.placebo} strokeWidth={2} />
            <SvgText x={20} y={176} text="fibra muscular" size={16} color={C.muted} />
            <Dots n={c.mn} max={20} seed={7} box={[22, 190, 296, 170]} color={C.nitrate} reduce={reduce} />
            <Dots n={c.mt} max={40} seed={90} box={[22, 190, 296, 170]} color={C.nitrite} r={3.5} reduce={reduce} />

            <g style={{ opacity: showXor ? 1 : 0.3, filter: showXor ? `drop-shadow(0 0 8px ${C.hypoxia})` : undefined, transition: 'opacity 0.4s' }}>
                <circle cx={296} cy={350} r={24} fill="rgba(251,146,60,0.25)" stroke={C.hypoxia} strokeWidth={2} />
                <SvgText x={296} y={356} text="XOR" size={16} weight={700} anchor="middle" />
            </g>

            {/* NO que sobe da fibra e dilata o capilar (rato) */}
            <g style={{ opacity: c.no > 0 ? 1 : 0, transition: 'opacity 0.5s' }}>
                {[60, 120, 180, 240, 300].map((x, i) => (
                    <circle key={x} cx={x} cy={reduce ? 140 : undefined} r={5} fill={C.no}>
                        {!reduce && <animate attributeName="cy" values="170;82" dur="1.8s" begin={`${i * 0.36}s`} repeatCount="indefinite" />}
                        {!reduce && <animate attributeName="opacity" values="0;1;0" dur="1.8s" begin={`${i * 0.36}s`} repeatCount="indefinite" />}
                    </circle>
                ))}
            </g>

            {mode === 'exercise' && <SvgText x={170} y={400} text="exercício intenso: −39% do nitrato" size={16} weight={700} anchor="middle" color={C.hypoxia} />}
            {mode === 'rat' && <SvgText x={170} y={400} text="rato na esteira: NO dilata o capilar" size={16} weight={700} anchor="middle" color={C.no} />}
            {(mode === 'dose' || mode === 'machinery') && <SvgText x={170} y={400} text="2 h após 12,8 mmol de nitrato" size={16} anchor="middle" color={C.muted} />}
            {mode === 'basal' && <SvgText x={170} y={400} text="repouso, sem suplemento" size={16} anchor="middle" color={C.muted} />}
        </g>
    );
};

const NOTES = [
    { head: '▼ nitrato no músculo', sub: 'queda muito grande, logo após correr', color: C.nitrate },
    { head: '▲ nitrito no músculo', sub: 'aumento transitório', color: C.nitrite },
    { head: '▼ nitrato no sangue', sub: 'queda significativa', color: C.nitrateSoft },
    { head: 'XOR + leve acidez', sub: 'geram o nitrito e o NO a partir do nitrato', color: C.hypoxia },
];

/** Resumo do que Piknova 2016 mediu no rato que corre, no lugar das barras. */
export const RatNotes = () => (
    <g>
        <SvgText x={20} y={30} text="músculo do rato, após a esteira" size={16} color={C.muted} />
        {NOTES.map((n, i) => (
            <g key={n.head}>
                <SvgText x={20} y={96 + i * 82} text={n.head} size={19} weight={700} color={n.color} />
                <SvgText x={20} y={120 + i * 82} text={n.sub} size={16} color="#D1D5DB" />
            </g>
        ))}
    </g>
);
