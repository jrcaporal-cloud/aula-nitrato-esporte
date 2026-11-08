import { useReducedMotion } from 'framer-motion';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';

/**
 * 1995: o mesmo caminho do nitrato pela língua do rato convencional e do rato germ-free (Duncan 1995).
 * Sem bactérias, o íon passa sem mudar. SVG com viewBox igual à caixa (600×292): o texto fica no tamanho real.
 */

const W = 600;
const H = 292;
const TONGUE = 'M12 130 C12 70 90 46 160 52 C220 56 262 82 262 128 C262 174 220 200 160 204 C90 210 12 188 12 130 Z';
/** Pontos das bactérias no dorso posterior (fixos: a figura não muda entre renderizações). */
const BACTERIA: readonly (readonly [number, number])[] = [
    [168, 84], [190, 100], [212, 86], [176, 118], [204, 126], [226, 106], [186, 146], [214, 152], [236, 130], [170, 168], [196, 178], [226, 172],
];
const ION_PATH = 'M-4 86 C60 90 120 120 178 128 S250 130 290 130';

const IONS = ['0s', '-1.5s', '-3s'] as const;

/** Três íons em fila: o que passa pela zona das bactérias muda de cor (nitrato → nitrito) quando há bactérias. */
const Ions = ({ converts, animate }: { converts: boolean; animate: boolean }) => (
    <>
        {IONS.map(begin => (
            <circle key={begin} r={8} cx={animate ? 0 : 60} cy={animate ? 0 : 100} fill={C.nitrate} stroke="#07050B" strokeWidth={2}>
                {animate && (
                    <>
                        <animateMotion path={ION_PATH} dur="4.5s" begin={begin} repeatCount="indefinite" />
                        {converts && (
                            <animate attributeName="fill" values={`${C.nitrate};${C.nitrate};${C.nitrite};${C.nitrite}`}
                                keyTimes="0;0.42;0.56;1" dur="4.5s" begin={begin} repeatCount="indefinite" />
                        )}
                    </>
                )}
            </circle>
        ))}
    </>
);

const TonguePanel = ({ x, germFree, animate }: { x: number; germFree: boolean; animate: boolean }) => (
    <g transform={`translate(${x} 0)`}>
        <SvgText x={150} y={24} text={germFree ? 'rato germ-free' : 'rato convencional'} anchor="middle" size={19} color="#fff" weight={700} />
        <g transform="translate(0 18)">
            <path d={TONGUE} fill="#2A1520" stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
            <path d="M34 128 L168 128" stroke="rgba(255,255,255,0.12)" strokeWidth={3} strokeLinecap="round" fill="none" />
            <ellipse cx={206} cy={128} rx={52} ry={58} fill="none" stroke={germFree ? C.placebo : C.bacteria} strokeWidth={2} strokeDasharray="5 6" strokeOpacity={0.7} />
            {!germFree && BACTERIA.map(([bx, by]) => <circle key={`${bx}-${by}`} cx={bx} cy={by} r={5.5} fill={C.bacteria} />)}
            <Ions converts={!germFree} animate={animate} />
        </g>
        <SvgText x={150} y={260} text={germFree ? 'nitrato passa sem mudar' : 'nitrato vira nitrito'} anchor="middle" size={18}
            color={germFree ? '#CBD5E1' : C.nitriteSoft} weight={700} />
        <SvgText x={150} y={284} text={germFree ? 'sem bactérias, sem nitrito' : 'bactérias do dorso da língua'} anchor="middle" size={16} color="#9CA3AF" weight={500} />
    </g>
);

export const TongueFigure = () => {
    const animate = !(useReducedMotion() ?? false);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label="Língua de rato convencional converte nitrato em nitrito; a de rato germ-free não converte"
            className="block max-w-full">
            <TonguePanel x={4} germFree={false} animate={animate} />
            <TonguePanel x={W / 2 + 4} germFree animate={animate} />
        </svg>
    );
};
