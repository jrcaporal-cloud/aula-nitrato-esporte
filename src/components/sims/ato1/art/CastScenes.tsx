import { SceneBox, GROUND_Y, SCENE_W } from './SceneBox';
import { Runner } from './Runner';
import { JOG, SPRINT } from './poses';
import type { Sport } from './castLook';

/**
 * Mini-cenas de prova (268×128): ciclista no contrarrelógio, corredor de 1.500 m na pista, meio-campista com a bola
 * e corredora ao amanhecer. Tudo geométrico; o movimento (rodas, passadas, pista) é SMIL e some com `animate = false`.
 */

interface SceneProps {
    color: string;
    soft: string;
    animate: boolean;
    ghost?: boolean;
}

/** Linhas tracejadas que deslizam para a esquerda: dá a sensação de velocidade. */
const Slide = ({ y, x1 = 0, x2 = SCENE_W, dash, dur, color, opacity = 0.35, width = 2, animate }: {
    y: number; x1?: number; x2?: number; dash: string; dur: number; color: string; opacity?: number; width?: number; animate: boolean;
}) => {
    const total = dash.split(' ').reduce((s, n) => s + Number(n), 0);
    return (
        <line x1={x1} x2={x2} y1={y} y2={y} stroke={color} strokeOpacity={opacity} strokeWidth={width} strokeDasharray={dash} strokeLinecap="round">
            {animate && <animate attributeName="stroke-dashoffset" from={total} to={0} dur={`${dur}s`} repeatCount="indefinite" />}
        </line>
    );
};

const BB = [126, 92] as const;
const crank = (phase: number, axis: 0 | 1) =>
    Array.from({ length: 9 }, (_, k) => {
        const a = ((((k + phase) % 8) / 8) * 2 * Math.PI);
        return (BB[axis] + 11 * (axis === 0 ? Math.cos(a) : Math.sin(a))).toFixed(1);
    }).join(';');

const Wheel = ({ cx, animate, soft }: { cx: number; animate: boolean; soft: string }) => (
    <g>
        <circle cx={cx} cy={92} r={18} fill="rgba(7,5,11,0.35)" stroke={soft} strokeWidth={3} />
        <g stroke={soft} strokeOpacity={0.6} strokeWidth={1.5}>
            <line x1={cx - 18} x2={cx + 18} y1={92} y2={92} />
            <line x1={cx} x2={cx} y1={74} y2={110} />
            <line x1={cx - 13} x2={cx + 13} y1={79} y2={105} />
            {animate && <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} 92`} to={`360 ${cx} 92`} dur="0.8s" repeatCount="indefinite" />}
        </g>
    </g>
);

const Cyclist = ({ color, soft, animate, ghost }: SceneProps) => (
    <SceneBox id="cs-cycle" color={color} label="Lia pedalando num contrarrelógio" ghost={ghost}>
        <path d={`M0 108 Q46 84 96 100 T190 96 T${SCENE_W} 94 V${GROUND_Y} H0Z`} fill={color} fillOpacity={0.16} />
        <Slide y={56} x1={4} x2={54} dash="22 14" dur={0.5} color={soft} animate={animate} />
        <Slide y={74} x1={0} x2={44} dash="14 12" dur={0.4} color={soft} animate={animate} opacity={0.25} />
        <Slide y={GROUND_Y + 10} dash="18 14" dur={0.45} color="#fff" opacity={0.3} animate={animate} />
        <g transform="translate(-24 0)">
        <Wheel cx={92} animate={animate} soft="#E5E7EB" />
        <Wheel cx={176} animate={animate} soft="#E5E7EB" />
        <g stroke="#F3F4F6" strokeWidth={3} strokeLinecap="round" fill="none">
            <path d="M92 92 L116 60 L126 92 Z M116 60 L160 66 L126 92 M160 66 L176 92 M160 66 L166 58 M108 58 H122" />
        </g>
        {[0, 4].map(ph => (
            <line key={ph} x1={118} y1={58} x2={BB[0]} y2={BB[1]} stroke={ph ? color : soft} strokeWidth={6} strokeLinecap="round">
                {animate && <animate attributeName="x2" values={crank(ph, 0)} dur="0.9s" repeatCount="indefinite" />}
                {animate && <animate attributeName="y2" values={crank(ph, 1)} dur="0.9s" repeatCount="indefinite" />}
            </line>
        ))}
        <path d="M118 58 L152 42" stroke={soft} strokeWidth={10} strokeLinecap="round" />
        <path d="M150 45 L166 60" stroke={soft} strokeWidth={5} strokeLinecap="round" />
        <circle cx={160} cy={33} r={7.5} fill={soft} />
        <path d="M153 31 q8 -10 17 -2 l-6 5z" fill={color} />
        </g>
    </SceneBox>
);

const Sprinter = ({ color, soft, animate, ghost }: SceneProps) => (
    <SceneBox id="cs-sprint" color={color} label="Tomás correndo 1.500 m na pista" ghost={ghost}>
        <path d={`M0 104 Q60 92 130 102 T${SCENE_W} 100 V${GROUND_Y} H0Z`} fill={color} fillOpacity={0.14} />
        {[0, 1, 2].map(i => (
            <Slide key={i} y={GROUND_Y + 4 + i * 6} dash={`${26 - i * 4} 14`} dur={0.35 + i * 0.05} color="#fff" opacity={0.35 - i * 0.07} animate={animate} />
        ))}
        <Slide y={52} x1={4} x2={56} dash="26 16" dur={0.4} color={soft} animate={animate} />
        <Slide y={70} x1={0} x2={42} dash="16 12" dur={0.3} color={soft} opacity={0.25} animate={animate} />
        <Runner pose={SPRINT} x={104} y={70} scale={1.04} color={color} soft={soft} dur={0.3} animate={animate} />
    </SceneBox>
);

const Football = ({ color, soft, animate, ghost }: SceneProps) => (
    <SceneBox id="cs-foot" color={color} label="Bruno correndo com a bola no jogo de 90 minutos" ghost={ghost}>
        <ellipse cx={206} cy={GROUND_Y + 8} rx={46} ry={7} fill="none" stroke="#fff" strokeOpacity={0.3} strokeWidth={1.5} />
        <path d={`M0 106 Q50 94 100 104 T${SCENE_W} 100 V${GROUND_Y} H0Z`} fill={color} fillOpacity={0.14} />
        <g stroke={soft} strokeLinecap="round" strokeWidth={2}>
            {[48, 62, 76].map((y, i) => (
                <line key={y} x1={4 + i * 6} x2={44 + i * 4} y1={y} y2={y} strokeOpacity={0.4}>
                    {animate && <animate attributeName="opacity" values="0;1;1;0;0" dur="2.4s" begin={`${i * 0.15}s`} repeatCount="indefinite" />}
                </line>
            ))}
        </g>
        <Runner pose={SPRINT} x={92} y={70} color={color} soft={soft} shirt={color} dur={0.34} animate={animate} />
        <g>
            <circle cx={146} cy={86} r={8} fill="#F3F4F6" />
            <path d="M146 81 l5 4 -2 6 h-6 l-2 -6z" fill="#1F1830" />
            {animate && <animateTransform attributeName="transform" type="translate" values="0 0;6 -14;12 0;6 -6;0 0" dur="0.68s" repeatCount="indefinite" />}
        </g>
    </SceneBox>
);

const Jogger = ({ color, soft, animate, ghost }: SceneProps) => (
    <SceneBox id="cs-jog" color={color} label="Helena correndo a primeira meia maratona" ghost={ghost}>
        <circle cx={168} cy={GROUND_Y - 6} r={30} fill="#FDE68A" fillOpacity={0.28} />
        <circle cx={168} cy={GROUND_Y - 6} r={20} fill="#FBBF24" fillOpacity={0.55} />
        <path d={`M0 104 Q70 90 140 102 T${SCENE_W} 98 V${GROUND_Y} H0Z`} fill={color} fillOpacity={0.18} />
        <path d={`M120 ${GROUND_Y} L190 ${GROUND_Y - 4} L214 ${GROUND_Y - 4} L${SCENE_W} ${GROUND_Y} Z`} fill="#fff" fillOpacity={0.06} />
        <Slide y={GROUND_Y + 8} dash="16 22" dur={0.9} color="#fff" opacity={0.28} animate={animate} />
        <Runner pose={JOG} x={90} y={72} color={color} soft={soft} dur={0.5} animate={animate}>
            <path d="M3 -46 q-12 -3 -17 6 q-2 6 -6 8" fill="none" stroke={soft} strokeWidth={4} strokeLinecap="round">
                {animate && <animate attributeName="d" values="M3 -46 q-12 -3 -17 6 q-2 6 -6 8;M3 -46 q-12 -8 -18 0 q-3 6 -8 6;M3 -46 q-12 -3 -17 6 q-2 6 -6 8" dur="1s" repeatCount="indefinite" />}
            </path>
        </Runner>
    </SceneBox>
);

const SCENES: Readonly<Record<Sport, (p: SceneProps) => React.JSX.Element>> = { cycle: Cyclist, sprint: Sprinter, football: Football, jog: Jogger };

export const CastScene = ({ sport, ...rest }: SceneProps & { sport: Sport }) => {
    const Scene = SCENES[sport];
    return <Scene {...rest} />;
};
