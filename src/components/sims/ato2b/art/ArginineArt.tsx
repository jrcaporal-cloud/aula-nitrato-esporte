import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { br } from '../../kit/format';
import { useTweenNum } from '../useTweenNum';
import { DOSE_ARGININE, DOSE_NITRATE, EFFECT_NITRATE } from '../arginine.content';
import { SCENE_FULL_W, SCENE_H, SCENE_X0 } from './WideFrame';

/**
 * Slide 33 em grande escala. Passos 1 e 4: as duas vias até o NO com o O₂ como gradiente vertical; partículas correm nos
 * canos; quando o O₂ cai, a via da NOS apaga e a do nitrito acende. Passos 2 e 3: frascos de dose e o efeito no VO₂.
 */

interface SceneProps { reduce: boolean; step: number }

const NO_X = 868;
const NO_Y = 166;
const A_Y = 96;
const B_Y = 240;
const PIPE_A = `M236 ${A_Y} H560 C700 ${A_Y} 760 ${A_Y + 20} ${NO_X - 66} ${NO_Y - 26}`;
const PIPE_B = `M236 ${B_Y} H560 C700 ${B_Y} 760 ${B_Y - 20} ${NO_X - 66} ${NO_Y + 26}`;

const Node = ({ x, y, w, title, sub, color, on }: { x: number; y: number; w: number; title: string; sub: string; color: string; on: number }) => (
    <g style={{ transition: 'opacity 900ms' }} opacity={0.3 + 0.7 * on}>
        <rect x={x} y={y - 32} width={w} height={64} rx={18} fill="#0E0915" stroke={color} strokeWidth={2.5 + on}
            strokeDasharray={on < 0.4 ? '6 6' : undefined} style={{ filter: on > 0.5 ? `drop-shadow(0 0 ${6 + 10 * on}px ${color})` : undefined }} />
        <rect x={x + 3} y={y - 29} width={w - 6} height={26} rx={14} fill={color} opacity={0.12 * on + 0.04} />
        <SvgText x={x + w / 2} y={y + 2} text={title} anchor="middle" size={22} color={color} weight={800} />
        <SvgText x={x + w / 2} y={y + 22} text={sub} anchor="middle" size={16} color={C.muted} weight={500} />
    </g>
);

const Flow = ({ d, color, n, dur, opacity, reduce }: { d: string; color: string; n: number; dur: number; opacity: number; reduce: boolean }) => (
    <g opacity={opacity} style={{ transition: 'opacity 900ms' }}>
        <path d={d} fill="none" stroke={color} strokeOpacity={0.22} strokeWidth={16} strokeLinecap="round" />
        <path d={d} fill="none" stroke={color} strokeOpacity={0.7} strokeWidth={3} strokeLinecap="round" />
        {!reduce && Array.from({ length: n }, (_, i) => (
            <circle key={`${dur}-${i}`} r={5} fill="#fff" stroke={color} strokeWidth={2.5}>
                <animateMotion dur={`${dur}s`} begin={`${-(i * dur) / n}s`} repeatCount="indefinite" path={d} />
            </circle>
        ))}
    </g>
);

/** Passos 1 e 4: o O₂ decide qual via acende. */
export const PathwaysArt = ({ reduce, step }: SceneProps) => {
    const o2 = useTweenNum(step === 3 ? 0.1 : 1, reduce, 1800);
    const low = 1 - o2;
    return (
        <g>
            <defs>
                <linearGradient id="arg-o2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor={C.o2} stopOpacity={0.42} />
                    <stop offset="1" stopColor={C.o2} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="arg-hyp" x1="0" x2="0" y1="1" y2="0">
                    <stop offset="0" stopColor={C.hypoxia} stopOpacity={0.45} />
                    <stop offset="1" stopColor={C.hypoxia} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="arg-tube" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor={C.o2Soft} />
                    <stop offset="1" stopColor={C.o2} />
                </linearGradient>
                <radialGradient id="arg-no"><stop offset="0" stopColor={C.no} stopOpacity={0.55} /><stop offset="1" stopColor={C.no} stopOpacity={0} /></radialGradient>
            </defs>
            <rect x={SCENE_X0} width={SCENE_FULL_W} height={SCENE_H * (0.35 + 0.65 * o2)} fill="url(#arg-o2)" />
            <rect x={SCENE_X0} y={SCENE_H * 0.3} width={SCENE_FULL_W} height={SCENE_H * 0.7} fill="url(#arg-hyp)" opacity={0.25 + 0.75 * low} />
            {Array.from({ length: 16 }, (_, i) => (
                <g key={i} opacity={o2 > (i + 1) / 17 ? 0.75 : 0} style={{ transition: 'opacity 600ms' }}>
                    <circle cx={140 + ((i * 173) % 860)} cy={26 + ((i * 37) % 40)} r={4} fill={C.o2Soft} />
                    <circle cx={147 + ((i * 173) % 860)} cy={26 + ((i * 37) % 40)} r={4} fill={C.o2Soft} />
                    {!reduce && <animateTransform attributeName="transform" type="translate" values={`0 0;${(i % 3) * 6 - 6} 10;0 0`} dur={`${3 + (i % 4)}s`} repeatCount="indefinite" />}
                </g>
            ))}

            <rect x={34} y={30} width={30} height={262} rx={15} fill="#0E0915" stroke={C.o2} strokeWidth={2} />
            <rect x={39} y={35 + 252 * (1 - o2)} width={20} height={252 * o2} rx={10} fill="url(#arg-tube)" />
            <SvgText x={49} y={22} text="O₂" anchor="middle" size={18} color={C.o2Soft} weight={800} />
            <SvgText x={86} y={44} text="muito" size={16} color={C.o2Soft} weight={600} />
            <SvgText x={86} y={290} text="pouco" size={16} color={C.hypoxia} weight={600} />

            <SvgText x={140} y={A_Y - 48} text="via clássica · precisa de O₂" size={18} color={C.o2Soft} weight={700} />
            <SvgText x={140} y={B_Y - 48} text="via alternativa · favorecida por hipóxia e acidez" size={18} color={C.nitrateSoft} weight={700} />
            <Flow d={PIPE_A} color={C.o2Soft} n={7} dur={3.2} opacity={0.12 + 0.88 * o2} reduce={reduce} />
            <Flow d={PIPE_B} color={C.nitrite} n={step === 3 ? 10 : 5} dur={step === 3 ? 2.2 : 4} opacity={0.45 + 0.55 * low} reduce={reduce} />
            <Node x={140} y={A_Y} w={180} title="L-arginina" sub="ou L-citrulina" color={C.o2Soft} on={o2} />
            <Node x={430} y={A_Y} w={170} title="NOS" sub={o2 < 0.4 ? 'sem O₂: apaga' : 'precisa de O₂'} color={C.o2} on={o2} />
            <Node x={140} y={B_Y} w={180} title="nitrato" sub="beterraba, folhas" color={C.nitrate} on={0.55 + 0.45 * low} />
            <Node x={430} y={B_Y} w={170} title="nitrito" sub="boca → sangue" color={C.nitrite} on={0.55 + 0.45 * low} />

            <circle cx={NO_X} cy={NO_Y} r={130} fill="url(#arg-no)" />
            <circle cx={NO_X} cy={NO_Y} r={64} fill={C.no} fillOpacity={0.16} stroke={C.no} strokeWidth={3.5} style={{ filter: `drop-shadow(0 0 16px ${C.no})` }}>
                {!reduce && <animate attributeName="r" values="62;67;62" dur="2.4s" repeatCount="indefinite" />}
            </circle>
            <SvgText x={NO_X} y={NO_Y + 13} text="NO" anchor="middle" size={40} color={C.noSoft} weight={800} />
            <g opacity={step === 3 ? 1 : 0} style={{ transition: 'opacity 600ms 700ms' }}>
                <SvgText x={1090} y={298} text="exercício intenso: O₂ cai, a NOS apaga, o nitrito acende" anchor="end" size={17} color={C.text} weight={700} />
            </g>
        </g>
    );
};

const JAR = { w: 150, top: 44, base: 194 } as const;
const JAR_H = JAR.base - JAR.top;

const Jar = ({ cx, frac, color, soft, name, label, capsules }: { cx: number; frac: number; color: string; soft: string; name: string; label: string; capsules?: boolean }) => {
    const h = Math.max(JAR_H * frac, 10);
    const x = cx - JAR.w / 2;
    return (
        <g>
            <SvgText x={cx} y={24} text={name} anchor="middle" size={20} color={soft} weight={800} />
            <rect x={x - 6} y={JAR.top - 10} width={JAR.w + 12} height={14} rx={6} fill="#2A2233" stroke={soft} strokeOpacity={0.5} />
            <rect x={x} y={JAR.top} width={JAR.w} height={JAR_H} rx={18} fill="rgba(255,255,255,0.03)" stroke={soft} strokeOpacity={0.55} strokeWidth={2.5} />
            <rect x={x + 5} y={JAR.base - h} width={JAR.w - 10} height={h - 4} rx={12} fill={color} fillOpacity={0.85} />
            {capsules && h > 40 && Array.from({ length: Math.floor((h - 12) / 22) * 4 }, (_, i) => (
                <rect key={i} x={x + 14 + (i % 4) * 32 + (Math.floor(i / 4) % 2) * 10} y={JAR.base - 26 - Math.floor(i / 4) * 22} width={22} height={11} rx={5.5}
                    fill="#fff" fillOpacity={0.28} />
            ))}
            <rect x={x + 12} y={JAR.top + 10} width={10} height={JAR_H - 30} rx={5} fill="#fff" opacity={0.07} />
            <SvgText x={cx + JAR.w / 2 + 14} y={JAR.base - h + 8} text={label} size={24} color={soft} weight={800} />
        </g>
    );
};

/** Passos 2 e 3: dose (frascos) em cima, efeito no VO₂ embaixo; cada eixo com escala própria. */
export const DoseArt = ({ reduce, step }: SceneProps) => {
    const dose = useTweenNum(step >= 1 ? 1 : 0, reduce, 1200);
    const eff = useTweenNum(step >= 2 ? 1 : 0, reduce, 1200);
    const NX = 300;
    const AX = 760;
    const effH = (Math.abs(EFFECT_NITRATE) / 5.4) * 92 * eff;
    return (
        <g>
            <Jar cx={NX} frac={(DOSE_NITRATE / DOSE_ARGININE) * dose} color={C.nitrate} soft={C.nitrateSoft} name="NITRATO" label={`${br(DOSE_NITRATE, 2)} g/dia`} />
            <Jar cx={AX} frac={dose} color={C.o2} soft={C.o2Soft} name="L-ARGININA" label={`${br(DOSE_ARGININE, 1)} g/dia`} capsules />
            <g opacity={step === 1 ? 1 : 0} style={{ transition: 'opacity 500ms 600ms' }}>
                <SvgText x={(NX + AX) / 2 + 10} y={120} text="≈ 48× mais massa" anchor="middle" size={24} color={C.text} weight={800} />
                <SvgText x={(NX + AX) / 2 + 10} y={146} text="(cálculo)" anchor="middle" size={16} color={C.muted} weight={500} />
            </g>
            <line x1={120} x2={1000} y1={JAR.base + 14} y2={JAR.base + 14} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
            <SvgText x={24} y={JAR.base - 60} text="dose" size={16} color={C.muted} weight={600} />
            <SvgText x={24} y={JAR.base + 60} text="efeito" size={16} color={C.muted} weight={600} />
            <SvgText x={24} y={JAR.base + 80} text="no VO₂" size={16} color={C.muted} weight={600} />
            <rect x={NX - 36} y={JAR.base + 16} width={72} height={effH} rx={6} fill={C.nitrate} style={{ filter: `drop-shadow(0 0 10px ${C.nitrate})` }} />
            <g opacity={step >= 2 ? 1 : 0} style={{ transition: 'opacity 500ms 700ms' }}>
                <SvgText x={NX + 70} y={JAR.base + 70} text={`${br(EFFECT_NITRATE, 1).replace('-', '−')}% de VO₂`} size={26} color={C.nitrateSoft} weight={800} />
                <path d={`M${NX + 70} ${JAR.base + 82} h120`} stroke={C.nitrateSoft} strokeWidth={2} strokeDasharray="4 5" />
                <line x1={AX - 60} x2={AX + 60} y1={JAR.base + 18} y2={JAR.base + 18} stroke={C.o2} strokeWidth={6} strokeLinecap="round" />
                <SvgText x={AX} y={JAR.base + 64} text="nada" anchor="middle" size={26} color={C.o2Soft} weight={800} />
                <SvgText x={AX} y={JAR.base + 88} text="nem no nitrato plasmático" anchor="middle" size={16} color={C.muted} weight={500} />
            </g>
        </g>
    );
};
