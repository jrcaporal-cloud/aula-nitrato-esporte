import { motion } from 'framer-motion';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { useEntered } from '../../ato4/hooks';
import { KANG_ROWS } from '../altitude.content';
import { Lungs } from '../artKit/Figures';

/** Passo 4 — Kang 2025 (9 ECRs, n = 161): o nitrito sobe (SMD 2,25), mas SpO₂ e VO₂max ficam colados no zero. */

const X0 = 380;
const PX = 188.6;
const ZERO = X0 + PX;
const sx = (v: number) => X0 + (v + 1) * PX;
const ROW_Y = [150, 226, 302] as const;

const Drop = ({ x, y }: { x: number; y: number }) => (
    <path transform={`translate(${x} ${y})`} d="M 0 -17 C 10 -4 14 2 14 7 A 14 14 0 0 1 -14 7 C -14 2 -10 -4 0 -17 Z" fill={`${C.nitrite}40`} stroke={C.nitrite} strokeWidth={3} />
);

const Forest = ({ row, y, delay, icon }: { row: (typeof KANG_ROWS)[number]; y: number; delay: number; icon: 'o2' | 'lung' }) => (
    <motion.g initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.45 }}>
        {icon === 'o2'
            ? <><circle cx={64} cy={y} r={18} fill={`${C.o2}30`} stroke={C.o2} strokeWidth={3} /><SvgText x={64} y={y + 6} text="O₂" size={17} weight={700} anchor="middle" color={C.o2Soft} /></>
            : <Lungs x={64} y={y} s={0.7} color={C.nitrate} />}
        <SvgText x={100} y={y - 2} text={row.label} size={20} weight={700} color="#fff" />
        <SvgText x={100} y={y + 22} text={row.sub ?? ''} size={16} weight={500} color={C.muted} />
        <line x1={sx(row.lo)} x2={sx(row.hi)} y1={y} y2={y} stroke={row.color ?? C.o2} strokeWidth={4} strokeLinecap="round" />
        <polygon points={`${sx(row.lo)},${y} ${sx(row.est)},${y - 13} ${sx(row.hi)},${y} ${sx(row.est)},${y + 13}`} fill={row.color ?? C.o2} stroke="#fff" strokeOpacity={0.7} />
        <SvgText x={sx(row.hi) + 18} y={y + 6} text={row.right ?? ''} size={17} weight={700} color={row.color ?? C.o2} />
    </motion.g>
);

export const MetaArt = ({ reduce }: { reduce: boolean }) => {
    const go = useEntered(reduce);
    return (
        <g>
            <SvgText x={24} y={32} text="KANG 2025 · 9 ECRs, n = 161 · desfechos fisiológicos, não de desempenho" size={17} weight={700} color={C.o2Soft} />
            <SvgText x={24} y={58} text="Senefeld 2020: a FiO₂ não moderou o efeito" size={16} weight={500} color="#CBD5E1" />
            <SvgText x={24} y={82} text="altitude terrestre: poucos estudos e nada em VO₂ ou SpO₂ (Shannon 2017)" size={16} weight={500} color={C.muted} />
            <SvgText x={ZERO - 10} y={118} text="← pior" size={16} weight={500} anchor="end" color={C.muted} />
            <SvgText x={ZERO + 10} y={118} text="melhor →" size={16} weight={500} color={C.muted} />
            <line x1={ZERO} x2={ZERO} y1={124} y2={330} stroke="#fff" strokeOpacity={0.5} strokeDasharray="5 5" />
            {[-1, 0, 1, 2].map(t => (
                <g key={t}>
                    <line x1={sx(t)} x2={sx(t)} y1={124} y2={330} stroke="rgba(255,255,255,0.07)" />
                    <SvgText x={sx(t)} y={352} text={t < 0 ? `−${Math.abs(t)}` : String(t)} size={16} weight={500} anchor="middle" color={C.muted} />
                </g>
            ))}
            <SvgText x={(X0 + 1040) / 2} y={374} text="SMD (nitrato × placebo) em altitude" size={16} weight={500} anchor="middle" color="#CBD5E1" />
            <g>
                <Drop x={64} y={ROW_Y[0]} />
                <SvgText x={100} y={ROW_Y[0] - 2} text="Nitrito" size={20} weight={700} color="#fff" />
                <SvgText x={100} y={ROW_Y[0] + 22} text="subiu · I² 70%" size={16} weight={500} color={C.muted} />
                <rect x={ZERO} y={ROW_Y[0] - 15} width={sx(2.25) - ZERO} height={30} rx={6} fill={C.nitrite} fillOpacity={0.85}
                    style={{ transformBox: 'fill-box', transformOrigin: 'left center', transform: `scaleX(${go ? 1 : 0})`, transition: 'transform 1.1s cubic-bezier(0.22,0.8,0.24,1) 0.1s' }} />
                <SvgText x={sx(2.25) - 10} y={ROW_Y[0] + 6} text="SMD 2,25" size={19} weight={700} anchor="end" color="#fff" />
            </g>
            <Forest row={KANG_ROWS[0]} y={ROW_Y[1]} delay={0.5} icon="o2" />
            <Forest row={KANG_ROWS[1]} y={ROW_Y[2]} delay={0.7} icon="lung" />
            <SvgText x={1056} y={ROW_Y[2] + 6} text="I² 0% nos dois" size={16} weight={600} anchor="end" color={C.muted} />
        </g>
    );
};
