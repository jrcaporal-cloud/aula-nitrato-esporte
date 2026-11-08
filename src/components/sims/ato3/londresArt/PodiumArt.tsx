import { motion } from 'framer-motion';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { Athlete, Stadium } from './Stage';

/** Passo 3 — no pódio: estádio, holofote, três atletas e, ao lado, o comunicado de 2012 com o carimbo RELATO. */

const STEPS = [{ x: 110, h: 92, n: '2' }, { x: 230, h: 136, n: '1' }, { x: 350, h: 66, n: '3' }] as const;
const GROUND = 330;

/** As três afirmações do comunicado (PODIUM_CLAIMS), quebradas em linhas para caber no papel. */
const CLAIMS = [
    { who: 'Team GB', lines: ['citada como usuária do suco'] },
    { who: 'EUA, Canadá, Austrália, Nova Zelândia e Holanda', lines: ['atletas citados como usuários'] },
    { who: 'David Weir', lines: ['disse à mídia britânica que o suco ajudou', 'nas quatro medalhas de ouro paralímpicas'] },
] as const;

export const PodiumArt = ({ reduce }: { reduce: boolean }) => (
    <g>
        <Stadium x0={-10} x1={1110} top={250} />
        <path d="M 230 -10 L 120 330 L 360 330 Z" fill={C.nitrite} opacity={0.07} />
        {STEPS.map((p, i) => (
            <motion.g key={p.n} initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.1 + i * 0.15 }}>
                <rect x={p.x} y={GROUND - p.h} width={116} height={p.h} rx={6} fill="#2A1618" stroke="rgba(255,255,255,0.25)" />
                <rect x={p.x} y={GROUND - p.h} width={116} height={8} rx={4} fill={C.nitrite} opacity={0.55} />
                <SvgText x={p.x + 58} y={GROUND - p.h / 2 + 14} text={p.n} size={36} weight={700} anchor="middle" color="rgba(255,255,255,0.75)" />
                <Athlete x={p.x + 58} y={GROUND - p.h} s={1.05} up={p.n === '1'} />
            </motion.g>
        ))}
        <SvgText x={230} y={GROUND + 28} text="atletas que teriam usado o suco" size={16} weight={600} anchor="middle" color="#E5E7EB" />
        <motion.g initial={{ opacity: reduce ? 1 : 0, rotate: reduce ? -2 : 4, x: reduce ? 0 : 30 }} animate={{ opacity: 1, rotate: -2, x: 0 }}
            transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.4 }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <rect x={520} y={26} width={540} height={300} rx={10} fill="#F5EFE4" opacity={0.95} />
            <rect x={520} y={26} width={540} height={46} rx={10} fill="#E9DFCC" />
            <text x={540} y={56} fontSize={17} fontWeight={700} fill="#3B2A1A" style={{ fontFamily: 'var(--font-body)' }}>COMUNICADO · 19/09/2012 · Universidade de Exeter</text>
            {CLAIMS.map((c, i) => {
                const y = 100 + i * 56;
                return (
                    <g key={c.who}>
                        <circle cx={546} cy={y - 6} r={5} fill="#9D174D" />
                        <text x={562} y={y} fontSize={17} fontWeight={700} fill="#1F1410" style={{ fontFamily: 'var(--font-body)' }}>{c.who}</text>
                        {c.lines.map((l, j) => (
                            <text key={l} x={562} y={y + 22 + j * 21} fontSize={16} fontWeight={500} fill="#4A3B2E" style={{ fontFamily: 'var(--font-body)' }}>{l}</text>
                        ))}
                    </g>
                );
            })}
            <g transform="rotate(-8 935 294)">
                <rect x={850} y={270} width={170} height={48} rx={8} fill="none" stroke={C.risk} strokeWidth={4} />
                <text x={935} y={304} textAnchor="middle" fontSize={28} fontWeight={800} fill={C.risk} letterSpacing={3} style={{ fontFamily: 'var(--font-display)' }}>RELATO</text>
            </g>
        </motion.g>
        <SvgText x={520} y={354} text="Desenho esquemático. O comunicado não traz contagem independente." size={16} weight={500} color={C.muted} />
    </g>
);
