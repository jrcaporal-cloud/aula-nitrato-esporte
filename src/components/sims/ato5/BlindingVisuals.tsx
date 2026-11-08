import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import { br } from '../kit/format';
import { VIS_H, VIS_W } from './ui';
import { Glow, T } from './arte/text';

/** Passo 1 do BlindingSim: cena do experimento cego e o índice de Bang. Caixa 672 × 440. */

const TRACK_Y = 308;
const x = (v: number) => 336 + v * 296;
const TICKS = [-1, -0.5, 0, 0.5, 1];
const fmt = (t: number) => (t === 0 ? '0' : t > 0 ? br(t, Number.isInteger(t) ? 0 : 1) : `−${br(-t, Number.isInteger(t) ? 0 : 1)}`);

/** Copo opaco igual para os dois braços: tampa, canudo, corpo cinza. */
const Cup = ({ cx, leak, reduce }: { cx: number; leak: boolean; reduce: boolean }) => (
    <g>
        <path d={`M${cx - 30} 120H${cx + 30}L${cx + 24} 178H${cx - 24}Z`} fill="url(#bs-cup)" stroke="rgba(255,255,255,0.55)" strokeWidth={2} strokeLinejoin="round" />
        <path d={`M${cx - 34} 120Q${cx} 98 ${cx + 34} 120Z`} fill="#64748B" stroke="rgba(255,255,255,0.55)" strokeWidth={2} />
        <path d={`M${cx + 8} 104L${cx + 20} 66`} stroke="#F1F5F9" strokeWidth={5} strokeLinecap="round" />
        <path d={`M${cx - 20} 130L${cx - 17} 168`} stroke="#fff" strokeOpacity={0.22} strokeWidth={5} strokeLinecap="round" />
        {leak && (
            <g fill="none" stroke={C.nitrate} strokeWidth={3.2} strokeLinecap="round" strokeDasharray="10 12">
                {[0, 1, 2].map(i => (
                    <path key={i} d={`M${cx - 10 + i * 12} 96C${cx - 22 + i * 14} 86 ${cx + 2 + i * 12} 80 ${cx - 8 + i * 14} 70S${cx + 6 + i * 10} 58 ${cx - 2 + i * 12} 52`} strokeOpacity={0.9 - i * 0.2}>
                        {!reduce && <animate attributeName="stroke-dashoffset" values="0;-44" dur={`${1.8 + i * 0.3}s`} repeatCount="indefinite" />}
                    </path>
                ))}
            </g>
        )}
    </g>
);

/** Cobaia de olhos vendados: cabeça, venda, tronco e um braço estendido ao copo. */
const Athlete = () => (
    <g>
        <ellipse cx={104} cy={190} rx={70} ry={7} fill="rgba(0,0,0,0.5)" />
        <path d="M54 188V132Q54 108 80 108H128Q154 108 154 132V188Z" fill="url(#bs-shirt)" stroke="rgba(255,255,255,0.35)" strokeWidth={1.6} />
        <rect x={94} y={90} width={20} height={20} fill="#CBD5E1" />
        <circle cx={104} cy={70} r={27} fill="#E2E8F0" />
        <rect x={74} y={62} width={60} height={15} rx={5} fill="#0B1020" stroke="#94A3B8" strokeWidth={1.6} />
        <path d="M134 66L150 56M134 72L152 78" stroke="#0B1020" strokeWidth={5} strokeLinecap="round" />
        <path d="M148 124L206 150" stroke="#475569" strokeWidth={14} strokeLinecap="round" />
        <circle cx={212} cy={153} r={8} fill="#E2E8F0" />
    </g>
);

export const BangScale = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Índice de cegamento de Bang">
            <defs>
                <linearGradient id="bang-grad" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0" stopColor={C.bacteria} stopOpacity="0.9" />
                    <stop offset="0.5" stopColor={C.no} stopOpacity="0.95" />
                    <stop offset="1" stopColor={C.risk} stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="bs-cup" x1="0" x2="1"><stop offset="0" stopColor="#64748B" /><stop offset="1" stopColor="#334155" /></linearGradient>
                <linearGradient id="bs-shirt" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#475569" /><stop offset="1" stopColor="#1E293B" /></linearGradient>
            </defs>

            {/* cena: copos idênticos, a beterraba "vaza" cor e sabor */}
            <Glow id="bs-gl" cx={262} cy={110} r={90} color={C.nitrate} opacity={0.28} pulse={!reduce} />
            <rect x={200} y={176} width={290} height={13} rx={6.5} fill="rgba(255,255,255,0.18)" />
            <Athlete />
            <Cup cx={262} leak reduce={reduce} />
            <Cup cx={392} leak={false} reduce={reduce} />
            <rect x={146} y={12} width={236} height={36} rx={18} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.5)" strokeWidth={1.6} />
            <path d="M154 46L134 62L166 48Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.5)" strokeWidth={1.6} strokeLinejoin="round" />
            <T x={264} y={36} size={16} color="#fff" weight={600} anchor="middle">“o que você acha que tomou?”</T>
            <T x={298} y={86} size={16} color={C.nitrateSoft} weight={700}>cor e sabor vazam</T>
            <circle cx={262} cy={208} r={6} fill={C.nitrate} /><T x={274} y={214} size={16} color={C.nitrateSoft} weight={700}>beterraba</T>
            <circle cx={392} cy={208} r={6} fill={C.placebo} /><T x={404} y={214} size={16} color="#E5E7EB" weight={700}>placebo</T>
            <rect x={496} y={22} width={156} height={34} rx={17} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" />
            <T x={574} y={45} size={16} color="#E5E7EB" weight={600} anchor="middle">12 velocistas</T>

            {/* escala de Bang */}
            <T x={VIS_W / 2} y={246} size={18} color="#fff" weight={700} anchor="middle">Índice de cegamento de Bang</T>
            <Glow id="bs-g0" cx={x(0.1)} cy={TRACK_Y + 15} r={90} color={C.no} opacity={0.3} />
            <rect x={40} y={TRACK_Y} width={592} height={30} rx={15} fill="url(#bang-grad)" />
            {TICKS.map(t => (
                <g key={t}>
                    <line x1={x(t)} x2={x(t)} y1={TRACK_Y + 30} y2={TRACK_Y + 40} stroke="rgba(255,255,255,0.6)" />
                    <T x={x(t)} y={TRACK_Y + 60} size={17} color={C.muted} weight={600} anchor="middle">{fmt(t)}</T>
                </g>
            ))}
            <T x={40} y={TRACK_Y + 90} size={16} color={C.bacteria} weight={600}>−1  palpite invertido</T>
            <T x={336} y={TRACK_Y + 90} size={16} color={C.noSoft} weight={700} anchor="middle">0  cego perfeito</T>
            <T x={632} y={TRACK_Y + 90} size={16} color={C.risk} weight={600} anchor="end">1  cego quebrado</T>
            {[{ v: 0.08, c: C.nitrate, label: 'beterraba', num: '0,08', anchor: 'end' as const, dx: -92, nx: -12, delay: 0.5 },
              { v: 0.16, c: C.placebo, label: 'placebo', num: '0,16', anchor: 'start' as const, dx: 12, nx: 70, delay: 0.1 }].map(p => (
                <motion.g key={p.label} initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: p.delay }}>
                    <line x1={x(p.v)} x2={x(p.v)} y1={TRACK_Y - 26} y2={TRACK_Y + 15} stroke={p.c} strokeWidth={3} />
                    <circle cx={x(p.v)} cy={TRACK_Y + 15} r={13} fill={p.c} stroke="#fff" strokeWidth={2.5} />
                    <T x={x(p.v) + p.dx} y={TRACK_Y - 34} size={24} color="#fff" weight={700} anchor={p.anchor} display>{p.num}</T>
                    <T x={x(p.v) + p.nx} y={TRACK_Y - 34} size={16} color={p.c === C.placebo ? '#E5E7EB' : C.nitrateSoft} weight={700} anchor={p.anchor}>{p.label}</T>
                </motion.g>
            ))}
            <T x={VIS_W / 2} y={VIS_H - 8} size={18} color={C.noSoft} weight={700} anchor="middle" display>quase perfeito, segundo os autores</T>
        </svg>
    );
};
