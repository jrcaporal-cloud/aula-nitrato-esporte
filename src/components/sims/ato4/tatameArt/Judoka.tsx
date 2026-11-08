import { C } from '../../kit/palette';
import { Beet, Cup } from '../../ato3/artKit/Figures';

/** Peças do dia de judô: dupla de judocas no tatame, ícones das condições e quebra de linha simples. */

const JUDOKA_ARMS = 'M 8 -40 L 20 -34 L 27 -39';

/** Judoca de perfil (pé em 0,0), de frente para a direita; `gi` = cor do quimono. */
const Judoka = ({ gi, belt }: { gi: string; belt: string }) => (
    <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M -6 -21 L -12 0 M 5 -21 L 10 0" stroke={gi} strokeWidth={7} fill="none" />
        <path d="M -9 -43 L 11 -43 L 9 -20 L -9 -20 Z" fill={gi} stroke="rgba(7,5,11,0.6)" strokeWidth={1.2} />
        <path d="M 0 -43 L 5 -32 M 6 -43 L 1 -33" stroke="rgba(7,5,11,0.45)" strokeWidth={1.5} fill="none" />
        <rect x={-10} y={-25} width={21} height={4} rx={1.5} fill={belt} />
        <path d={JUDOKA_ARMS} stroke={gi} strokeWidth={6} fill="none" />
        <circle cx={3} cy={-51} r={6.5} fill="#E7C9A9" />
    </g>
);

interface PairProps {
    x: number;
    y: number;
    s?: number;
    /** Gotas de suor (cansaço ilustrativo). */
    sweat: number;
    reduce: boolean;
    delay: number;
}

/** Dupla em pegada, balançando de leve; o suor aumenta ao longo do dia. */
export const JudoPair = ({ x, y, s = 1, sweat, reduce, delay }: PairProps) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
        <g>
            <g transform="translate(-17 0)"><Judoka gi="#F3F4F6" belt="#111827" /></g>
            <g transform="translate(17 0) scale(-1 1)"><Judoka gi="#334155" belt="#111827" /></g>
            {!reduce && <animateTransform attributeName="transform" type="rotate" values="-3 0 0;3 0 0;-3 0 0" dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" />}
        </g>
        {Array.from({ length: sweat }, (_, i) => (
            <path key={i} transform={`translate(${(i % 2 === 0 ? -30 : 30) + (i > 1 ? (i % 2 === 0 ? -8 : 8) : 0)} ${-56 + (i > 1 ? 12 : 0)})`}
                d="M 0 -6 C 3 -1 4 1 4 3 A 4 4 0 0 1 -4 3 C -4 1 -3 -1 0 -6 Z" fill="#E0F2FE" opacity={0.8}>
                {!reduce && <animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 6;0 0" dur="1.6s" begin={`${i * 0.3}s`} repeatCount="indefinite" />}
            </path>
        ))}
    </g>
);

/** Ícone da condição: xícara (cafeína), beterraba (suco) ou os dois. */
export const ConditionIcon = ({ id, x, y, s = 1, color }: { id: 'caf' | 'bj' | 'both'; x: number; y: number; s?: number; color: string }) => {
    if (id === 'caf') return <Cup x={x} y={y + 1} s={0.95 * s} color={color} />;
    if (id === 'bj') return <Beet x={x} y={y - 1} s={0.8 * s} color={C.nitrate} />;
    return (
        <g>
            <Cup x={x - 9 * s} y={y + 2} s={0.62 * s} color={C.hypoxia} />
            <Beet x={x + 9 * s} y={y} s={0.52 * s} color={C.nitrate} />
        </g>
    );
};
