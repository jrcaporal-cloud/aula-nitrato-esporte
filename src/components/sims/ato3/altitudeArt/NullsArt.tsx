import { motion } from 'framer-motion';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { Flag } from '../artKit/Figures';
import { SvgCount, SvgKeyFact, SvgReveal } from '../beat';

/** Passo 3 — os nulos: bandeiras cinzas na serra e, na pista, o IC95% de Arnold 2015 que não chega à linha de chegada (51 s). */

const PILLS = [
    { who: 'MacLeod 2015', what: '11 ciclistas · 10 km: nulo', x: 60 },
    { who: 'Bourdillon 2015', what: '12 ciclistas · 15 km: nulo', x: 400 },
    { who: 'Nybäck 2017', what: '8 esquiadores · 1 km: nulo', x: 740 },
];

const CI = { lo: -60, hi: 38, est: 11, mid: 51 } as const;
const sx = (v: number) => 550 + v * 7;
const TRACK_Y = 232;
const SIGNED = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n)} s`;

export const NullsArt = ({ reduce }: { reduce: boolean }) => (
    <g>
        {PILLS.map((p, i) => (
            <motion.g key={p.who} initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : i * 0.15 }}>
                <Flag x={p.x} y={104} h={62} color={C.placebo} />
                <rect x={p.x + 34} y={30} width={248} height={70} rx={12} fill="rgba(7,5,11,0.72)" stroke={`${C.placebo}88`} />
                <SvgText x={p.x + 48} y={58} text={p.who} size={18} weight={700} color="#fff" />
                <SvgText x={p.x + 48} y={84} text={p.what} size={16} weight={500} color="#CBD5E1" />
            </motion.g>
        ))}
        <rect x={24} y={146} width={1052} height={232} rx={16} fill="rgba(7,5,11,0.82)" stroke="rgba(255,255,255,0.12)" />
        <SvgText x={44} y={178} text="Arnold 2015 · 10 corredores (VO₂max 66) · 10 km a ~2.500 m simulados" size={18} weight={700} color="#fff" />
        <rect x={sx(-62)} y={TRACK_Y} width={sx(66) - sx(-62)} height={58} rx={10} fill={`${C.hypoxia}1c`} stroke={`${C.hypoxia}55`} />
        <line x1={sx(-62)} x2={sx(66)} y1={TRACK_Y + 29} y2={TRACK_Y + 29} stroke="#fff" strokeOpacity={0.14} strokeDasharray="14 12" />
        {[-60, -30, 0, 30, 60].map(t => (
            <g key={t}>
                <line x1={sx(t)} x2={sx(t)} y1={TRACK_Y} y2={TRACK_Y + 58} stroke={t === 0 ? '#fff' : 'rgba(255,255,255,0.12)'} strokeOpacity={t === 0 ? 0.6 : 1} strokeDasharray={t === 0 ? '5 5' : undefined} />
                <SvgText x={sx(t)} y={TRACK_Y + 82} text={t === 0 ? 'largada · 0' : SIGNED(t)} size={16} weight={500} anchor="middle" color={C.muted} />
            </g>
        ))}
        <g>
            <line x1={sx(CI.mid)} x2={sx(CI.mid)} y1={TRACK_Y - 18} y2={TRACK_Y + 58} stroke={C.no} strokeWidth={4} />
            <path d={`M ${sx(CI.mid)} ${TRACK_Y - 18} l 30 9 l -30 9 Z`} fill={C.no} />
            <SvgText x={sx(CI.mid) - 10} y={TRACK_Y - 5} text="51 s: o que valeria a pena" size={17} weight={700} anchor="end" color={C.noSoft} />
        </g>
        <motion.g initial={{ opacity: reduce ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.5 }}>
            <line x1={sx(CI.lo)} x2={sx(CI.hi)} y1={TRACK_Y + 29} y2={TRACK_Y + 29} stroke={C.nitrate} strokeWidth={8} strokeLinecap="round" />
            <line x1={sx(CI.hi) + 6} x2={sx(CI.mid) - 6} y1={TRACK_Y + 29} y2={TRACK_Y + 29} stroke={C.risk} strokeWidth={3} strokeDasharray="3 6" strokeLinecap="round" />
            <rect x={sx(CI.est) - 12} y={TRACK_Y + 17} width={24} height={24} fill={C.nitrate} stroke="#fff" strokeWidth={2.5} />
            <SvgKeyFact color={C.nitrate} delay={reduce ? 0 : 0.8}>
                <SvgCount x={sx(CI.est)} y={TRACK_Y - 34} text={`+${CI.est} s (IC95% −60 a +38)`} size={19} weight={700} anchor="middle" color="#fff" count={{ delayMs: 500 }} />
            </SvgKeyFact>
            <SvgText x={(sx(CI.hi) + sx(CI.mid)) / 2} y={TRACK_Y + 82} text="não chega" size={16} weight={700} anchor="middle" color={C.risk} />
        </motion.g>
        <SvgReveal order={2} delay={0.5}>
            <SvgText x={44} y={TRACK_Y + 112} text="melhora no 10 km com beterraba × placebo · TT 2862 × 2874 s (p = 0,6)" size={16} weight={500} color="#CBD5E1" />
            <SvgText x={1056} y={TRACK_Y + 112} text="só 3 de 10 com melhora provável" size={16} weight={600} anchor="end" color={C.nitrateSoft} />
        </SvgReveal>
    </g>
);
