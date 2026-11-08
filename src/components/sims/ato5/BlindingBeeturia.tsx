import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import { VIS_H, VIS_W } from './ui';
import { Person } from './arte/figures';
import { Glow, T } from './arte/text';
import { Glass } from './arte/vessels';

/** Passo 3 do BlindingSim: 100 pessoas, 4 com urina vermelha, as mesmas nos dois braços. Caixa 672 × 440. */

const RED = '#FF3D77';
const BEETURIC = new Set([13, 37, 62, 88]);
const ROW_Y = (i: number) => 98 + Math.floor(i / 10) * 22;

const Crowd = ({ x0, title, color, reduce }: { x0: number; title: string; color: string; reduce: boolean }) => (
    <g>
        <T x={x0 + 110} y={70} size={18} color={color} weight={700} anchor="middle">{title}</T>
        {Array.from({ length: 100 }, (_, i) => {
            const cx = x0 + (i % 10) * 22 + 11;
            const red = BEETURIC.has(i);
            return (
                <g key={i}>
                    {red && <Glow id={`bb-${x0}-${i}`} cx={cx} cy={ROW_Y(i)} r={20} color={RED} opacity={0.7} pulse={!reduce} />}
                    <Person cx={cx} cy={ROW_Y(i)} s={red ? 0.95 : 0.74} color={red ? RED : C.placebo} opacity={red ? 1 : 0.42} />
                </g>
            );
        })}
    </g>
);

/** Frasco de urina vermelha: a pista que não entrega o braço. */
const Vial = ({ id, x }: { id: string; x: number }) => (
    <g>
        <defs><linearGradient id={`${id}-u`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#F43F5E" /><stop offset="1" stopColor="#7F1033" /></linearGradient></defs>
        <Glass id={id} x={x} y={322} w={48} h={62} level={0.72} taper={0.2} fill={`url(#${id}-u)`} surface="#FDA4AF" />
        <rect x={x - 2} y={316} width={52} height={8} rx={4} fill="rgba(255,255,255,0.45)" />
    </g>
);

export const BeeturiaGrids = () => {
    const reduce = useReducedMotion() ?? false;
    const rows = [...BEETURIC].map(i => ROW_Y(i));
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Quatro em cem com beterrúria, nos dois braços">
            <T x={VIS_W / 2} y={32} size={19} color="#fff" weight={700} anchor="middle">100 pessoas, 4 com urina visivelmente vermelha</T>
            <Crowd x0={34} title="braço beterraba" color={C.nitrateSoft} reduce={reduce} />
            <Crowd x0={418} title="braço placebo depletado" color="#E5E7EB" reduce={reduce} />
            {rows.map((y, k) => (
                <g key={y}>
                    <path d={`M262 ${y}H406`} stroke={RED} strokeOpacity={0.85} strokeWidth={2.2} strokeDasharray="7 7">
                        {!reduce && <animate attributeName="stroke-dashoffset" values="0;-28" dur="1.6s" repeatCount="indefinite" />}
                    </path>
                    <motion.path d={`M398 ${y - 6}L408 ${y}L398 ${y + 6}`} stroke={RED} strokeWidth={2.2} fill="none" strokeLinecap="round"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + 0.1 * k }} />
                </g>
            ))}
            <rect x={268} y={176} width={136} height={52} rx={12} fill="#07050B" fillOpacity={0.88} />
            <T x={336} y={198} size={17} color="#fff" weight={700} anchor="middle">as mesmas 4</T>
            <T x={336} y={220} size={17} color="#fff" weight={700} anchor="middle">pessoas</T>

            <Vial id="bb-v1" x={96} />
            <T x={158} y={360} size={17} color={C.nitrateSoft} weight={700}>urina vermelha</T>
            <Vial id="bb-v2" x={480} />
            <T x={542} y={360} size={17} color={C.nitrateSoft} weight={700}>urina vermelha</T>
            <T x={VIS_W / 2} y={VIS_H - 10} size={16} color={C.muted} weight={500} anchor="middle">A resina tirou o ânion, não o pigmento: o placebo continua vermelho.</T>
        </svg>
    );
};
