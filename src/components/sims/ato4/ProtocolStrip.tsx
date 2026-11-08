import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import type { Protocol } from './protocolContent';

/**
 * Tira de tempo dos primeiros 5 minutos do protocolo escolhido: cada bloco é um sprint, o vazio é a pausa.
 * Escala única (1 px ≈ 0,64 s) para o contraste de densidade entre os desenhos ficar honesto. viewBox 488 × 108.
 */

const W = 488;
const WINDOW_S = 300;
const X0 = 10;
const SCALE = (W - 2 * X0) / WINDOW_S;

interface StripProps {
    sprint: number;
    rest: number;
    tested: Protocol | undefined;
}

export const ProtocolStrip = ({ sprint, rest, tested }: StripProps) => {
    const blocks: { x: number; w: number }[] = [];
    for (let start = 0; start < WINDOW_S; start += sprint + rest) {
        blocks.push({ x: X0 + start * SCALE, w: Math.max(Math.min(sprint, WINDOW_S - start) * SCALE, 2) });
    }
    const color = tested ? C.nitrate : C.placebo;
    return (
        <svg viewBox={`0 0 ${W} 108`} width="100%" height={108} role="img" aria-label={`Sprints de ${sprint} s com pausa de ${rest} s`}>
            <SvgText x={X0} y={20} size={17} weight={700} color={tested ? C.nitrateSoft : C.nitrite}
                text={tested ? `${tested.reps} sprints no total · primeiros 5 min:` : 'combinação não testada · primeiros 5 min:'} />
            <line x1={X0} x2={W - X0} y1={72} y2={72} stroke="rgba(255,255,255,0.3)" />
            {[0, 1, 2, 3, 4, 5].map(m => (
                <g key={m}>
                    <line x1={X0 + m * 60 * SCALE} x2={X0 + m * 60 * SCALE} y1={68} y2={78} stroke="rgba(255,255,255,0.4)" />
                    <SvgText x={X0 + m * 60 * SCALE} y={100} text={m === 0 ? '0' : `${m} min`} size={16} weight={500} color={C.muted}
                        anchor={m === 0 ? 'start' : m === 5 ? 'end' : 'middle'} />
                </g>
            ))}
            {blocks.map((b, i) => (
                <rect key={i} x={b.x} y={32} width={b.w} height={40} rx={3} fill={color} fillOpacity={0.95} />
            ))}
        </svg>
    );
};
