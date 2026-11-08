import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { useTweenNum } from './useTweenNum';
import { br } from '../kit/format';
import { FadeG } from './DrawPath';
import { DOSE_ARGININE, DOSE_NITRATE, EFFECT_NITRATE } from './arginine.content';

interface SceneProps { reduce: boolean; step: number }

const Box = ({ x, y, w, h, text, color, sub, glow = 0 }: { x: number; y: number; w: number; h: number; text: string; color: string; sub?: string; glow?: number }) => (
    <g style={{ filter: glow > 0.2 ? `drop-shadow(0 0 ${6 + glow * 10}px ${color}aa)` : undefined }}>
        <rect x={x} y={y} width={w} height={h} rx={12} fill="rgba(10,6,14,0.85)" stroke={color} strokeWidth={2.5} />
        <SvgText x={x + w / 2} y={y + h / 2 + (sub ? 0 : 7)} text={text} anchor="middle" size={20} color={color} weight={800} />
        {sub && <SvgText x={x + w / 2} y={y + h / 2 + 22} text={sub} anchor="middle" size={16} color={C.muted} weight={500} />}
    </g>
);

const Arrow = ({ d, color, dim = 1, id }: { d: string; color: string; dim?: number; id: string }) => (
    <g opacity={dim}>
        <defs>
            <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                <path d="M0 0 L10 5 L0 10 z" fill={color} />
            </marker>
        </defs>
        <path d={d} fill="none" stroke={color} strokeWidth={3} markerEnd={`url(#${id})`} strokeLinecap="round" />
    </g>
);

/** Passos 1 e 4: as duas vias até o NO e o medidor de O₂ (cai no passo 4: a NOS apaga, o nitrito acende). */
export const Pathways = ({ reduce, step }: SceneProps) => {
    const o2 = useTweenNum(step === 3 ? 0.12 : 1, reduce, 1800);
    const dimA = 0.22 + 0.78 * o2;
    const glowB = 1 - o2;
    return (
        <g>
            <SvgText x={24} y={44} text="via clássica · L-arginina → NOS" size={18} color={C.o2Soft} weight={700} />
            <g opacity={dimA}>
                <Box x={24} y={84} w={150} h={56} text="L-arginina" color={C.o2Soft} sub="ou L-citrulina" />
                <Box x={250} y={84} w={150} h={56} text="NOS" color={C.o2} sub="precisa de O₂" />
            </g>
            <Arrow id="agA1" d="M176 112 H246" color={C.o2Soft} dim={dimA} />
            <g opacity={dimA}>
                <circle cx={325} cy={50} r={17} fill={C.o2} fillOpacity={0.25} stroke={C.o2} strokeWidth={2} />
                <SvgText x={325} y={57} text="O₂" anchor="middle" size={18} color={C.o2Soft} weight={800} />
                <path d="M325 68 V82" stroke={C.o2} strokeWidth={2.5} />
            </g>
            <Arrow id="agA2" d="M402 116 L520 190" color={C.o2Soft} dim={dimA} />

            <SvgText x={24} y={238} text="via alternativa · nitrato → nitrito → NO" size={18} color={C.nitrateSoft} weight={700} />
            <Box x={24} y={274} w={150} h={56} text="nitrato" color={C.nitrate} sub="beterraba, folhas" glow={glowB} />
            <Box x={250} y={274} w={150} h={56} text="nitrito" color={C.nitrite} sub="boca → sangue" glow={glowB} />
            <Arrow id="agB1" d="M176 302 H246" color={C.nitrateSoft} />
            <Arrow id="agB2" d="M402 296 L520 224" color={C.nitriteSoft} />
            <SvgText x={325} y={368} text="favorecida por hipóxia e acidez" anchor="middle" size={16} color={C.hypoxia} weight={600} />

            <g style={{ filter: `drop-shadow(0 0 ${8 + glowB * 8}px ${C.no}aa)` }}>
                <circle cx={570} cy={207} r={50} fill={C.no} fillOpacity={0.18} stroke={C.no} strokeWidth={3} />
                <SvgText x={570} y={216} text="NO" anchor="middle" size={30} color={C.noSoft} weight={800} />
            </g>

            <rect x={676} y={60} width={26} height={290} rx={8} fill="none" stroke={C.o2} strokeWidth={2} />
            <rect x={680} y={64 + 282 * (1 - o2)} width={18} height={282 * o2} rx={5} fill={C.o2} />
            <SvgText x={689} y={42} text="O₂" anchor="middle" size={18} color={C.o2Soft} weight={800} />
            <SvgText x={689} y={376} text="tecido" anchor="middle" size={16} color={C.muted} weight={500} />
            <FadeG show={step === 3} reduce={reduce} delay={600}>
                <SvgText x={640} y={412} text="exercício intenso: O₂ cai, a NOS apaga, o nitrito acende" anchor="end" size={16} color={C.text} weight={600} />
            </FadeG>
        </g>
    );
};

/** Passos 2 e 3: espelho dose × efeito. Dose para cima, efeito no VO₂ para baixo; cada eixo com escala própria. */
export const DoseEffect = ({ reduce, step }: SceneProps) => {
    const dose = useTweenNum(step >= 1 ? 1 : 0, reduce, 1100);
    const effect = useTweenNum(step >= 2 ? 1 : 0, reduce, 1100);
    const base = 220;
    const doseH = (g: number) => Math.max((g / DOSE_ARGININE) * 150, 4) * dose;
    const effH = (Math.abs(EFFECT_NITRATE) / 5.4) * 140 * effect;
    const cols = [
        { x: 230, name: 'NITRATO', color: C.nitrate, soft: C.nitrateSoft, dose: DOSE_NITRATE, label: `${br(DOSE_NITRATE, 2)} g/dia` },
        { x: 504, name: 'L-ARGININA', color: C.o2, soft: C.o2Soft, dose: DOSE_ARGININE, label: `${br(DOSE_ARGININE, 1)} g/dia` },
    ] as const;
    return (
        <g>
            <line x1={90} x2={660} y1={base} y2={base} stroke="rgba(255,255,255,0.35)" />
            <SvgText x={24} y={base - 60} text="dose" size={16} color={C.muted} weight={600} />
            <SvgText x={24} y={base + 84} text="efeito" size={16} color={C.muted} weight={600} />
            <SvgText x={24} y={base + 106} text="no VO₂" size={16} color={C.muted} weight={600} />
            {cols.map(c => (
                <g key={c.name}>
                    <SvgText x={c.x} y={34} text={c.name} anchor="middle" size={20} color={c.soft} weight={800} />
                    <rect x={c.x - 56} y={base - doseH(c.dose)} width={112} height={doseH(c.dose)} rx={5} fill={c.color} fillOpacity={0.85} />
                    <SvgText x={c.x} y={base - doseH(c.dose) - 12} text={c.label} anchor="middle" size={22} color={c.soft} weight={800} />
                </g>
            ))}
            <rect x={230 - 56} y={base} width={112} height={effH} rx={5} fill={C.nitrate} />
            <FadeG show={step >= 2} reduce={reduce} delay={500}>
                <SvgText x={230} y={base + 140 + 32} text={`${br(EFFECT_NITRATE, 1).replace('-', '−')}% de VO₂`} anchor="middle" size={24} color={C.nitrateSoft} weight={800} />
                <line x1={504 - 56} x2={504 + 56} y1={base + 3} y2={base + 3} stroke={C.o2} strokeWidth={5} strokeLinecap="round" />
                <SvgText x={504} y={base + 52} text="nada" anchor="middle" size={24} color={C.o2Soft} weight={800} />
                <SvgText x={504} y={base + 78} text="nem no nitrato plasmático" anchor="middle" size={16} color={C.muted} weight={500} />
            </FadeG>
            <FadeG show={step === 1} reduce={reduce} delay={600}>
                <SvgText x={367} y={base + 60} text="≈ 48× mais massa (cálculo)" anchor="middle" size={20} color={C.text} weight={700} />
            </FadeG>
        </g>
    );
};
