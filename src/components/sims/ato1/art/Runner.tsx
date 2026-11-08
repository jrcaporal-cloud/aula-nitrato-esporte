import type { P, Pose } from './poses';

const limb = (from: P, [mid, end]: readonly [P, P]): string => `M${from[0]} ${from[1]} L${mid[0]} ${mid[1]} L${end[0]} ${end[1]}`;
const HIP: P = [0, 0];

interface RunnerProps {
    pose: Pose;
    x: number;
    y: number;
    scale?: number;
    color: string;
    soft: string;
    /** Duração de meio ciclo, em segundos. */
    dur: number;
    animate: boolean;
    /** Cor da camisa (tronco); padrão = soft. */
    shirt?: string;
    children?: React.ReactNode;
}

const Limb = ({ a, b, animate, dur, color, width }: { a: string; b: string; animate: boolean; dur: number; color: string; width: number }) => (
    <path d={a} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
        {animate && <animate attributeName="d" values={`${a};${b};${a}`} dur={`${dur * 2}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" />}
    </path>
);

/** Corredor geométrico: pernas e braços alternam entre duas poses (SMIL em `d`), com leve balanço vertical. */
export const Runner = ({ pose, x, y, scale = 1, color, soft, dur, animate, shirt, children }: RunnerProps) => {
    const legA = limb(HIP, pose.legF);
    const legB = limb(HIP, pose.legB);
    const armA = limb(pose.shoulder, pose.armF);
    const armB = limb(pose.shoulder, pose.armB);
    return (
        <g transform={`translate(${x} ${y}) scale(${scale})`}>
            <g>
                {animate && <animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur={`${dur}s`} repeatCount="indefinite" />}
                <Limb a={legB} b={legA} animate={animate} dur={dur} color={color} width={6} />
                <Limb a={armA} b={armB} animate={animate} dur={dur} color={color} width={5} />
                <path d={`M${HIP[0]} ${HIP[1]} L${pose.neck[0]} ${pose.neck[1]}`} stroke={shirt ?? soft} strokeWidth={10} strokeLinecap="round" />
                <circle cx={pose.head[0]} cy={pose.head[1]} r={7.5} fill={soft} />
                <Limb a={legA} b={legB} animate={animate} dur={dur} color={soft} width={6.5} />
                <Limb a={armB} b={armA} animate={animate} dur={dur} color={soft} width={5.5} />
                {children}
            </g>
        </g>
    );
};
