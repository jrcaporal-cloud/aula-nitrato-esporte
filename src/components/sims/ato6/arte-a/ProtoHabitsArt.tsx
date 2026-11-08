import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { C } from '../../kit/palette';
import { HABITS } from '../protocolContent';
import { Card } from '../ui';
import { ShotGlass } from './veg';
import { Reveal } from '../../kit/rhythm';

/** Passo 4 do slide 46: os quatro cuidados do dia da dose, cada um com uma ilustração geométrica grande. */

const COLORS: Record<string, string> = { rinse: C.bacteria, beeturia: C.nitrate, trial: C.no, marker: C.nitrite };

/** Textos encurtados para a tela (mesmo conteúdo e mesmos números de `HABITS`). */
const SHORT: Record<string, string> = {
    rinse: 'A clorexidina apaga as bactérias da língua que fazem nitrato virar nitrito e pode anular parte do efeito. Mecanismo: não testado em desempenho.',
    beeturia: 'Urina ou fezes avermelhadas depois do suco concentrado são esperadas. Avisar antes evita susto.',
    trial: 'Algumas pessoas sentem desconforto gastrointestinal. Dose, hora e produto se testam no treino, nunca na prova.',
    marker: 'Não mede o efeito: com 6 mmol/dia o VO₂ seguiu 3% menor com o nitrito já de volta ao basal.',
};

const Forbid = () => (
    <g><circle cx={60} cy={60} r={46} fill="none" stroke={C.risk} strokeWidth={7} /><path d="M28,28 L92,92" stroke={C.risk} strokeWidth={7} strokeLinecap="round" /></g>
);

const ART: Record<string, ReactNode> = {
    rinse: (
        <g>
            {[[18, 98], [34, 108], [86, 104], [102, 94], [20, 20]].map(([x, y], i) => (
                <g key={i} transform={`translate(${x} ${y})`}><circle r={8} fill={C.bacteria} /><circle cx={-3} cy={-3} r={2.4} fill="#fff" opacity={0.5} /></g>
            ))}
            <rect x={44} y={26} width={32} height={60} rx={8} fill="#5B7FD6" opacity={0.85} />
            <rect x={52} y={14} width={16} height={14} rx={3} fill="#C7D2FE" />
            <rect x={48} y={48} width={24} height={16} rx={3} fill="#fff" opacity={0.75} />
            <Forbid />
        </g>
    ),
    beeturia: (
        <g>
            <path d="M30,30 L90,30 L84,104 Q60,112 36,104Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.6)" strokeWidth={2} />
            <path d="M33,62 L87,62 L84,104 Q60,112 36,104Z" fill={C.nitrate} opacity={0.85} />
            <circle cx={92} cy={26} r={16} fill={C.no} /><path d="M84,26 L90,32 L100,20" stroke="#07050B" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        </g>
    ),
    trial: (
        <g>
            <circle cx={50} cy={66} r={38} fill="rgba(255,255,255,0.06)" stroke={C.no} strokeWidth={4} />
            <rect x={44} y={18} width={12} height={10} rx={2} fill={C.no} />
            <path d="M50,66 L50,40 M50,66 L68,74" stroke="#fff" strokeWidth={4} strokeLinecap="round" />
            <ShotGlass x={86} y={60} w={28} h={40} />
        </g>
    ),
    marker: (
        <g>
            <g transform="rotate(-24 60 62)">
                <rect x={48} y={18} width={24} height={84} rx={12} fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.6)" strokeWidth={2} />
                <rect x={50} y={52} width={20} height={48} rx={10} fill="#B91C1C" />
                <rect x={46} y={10} width={28} height={14} rx={4} fill={C.nitrite} />
            </g>
            <Forbid />
        </g>
    ),
};

export const ProtoHabitsArt = () => {
    const reduce = useReducedMotion();
    return (
        <div className="grid min-w-0 flex-1 grid-cols-2 grid-rows-2 gap-3">
            {HABITS.map((h, i) => {
                const color = COLORS[h.id];
                return (
                    <motion.div key={h.id} className="min-h-0" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.14, duration: 0.4 }}>
                        <Card color={color} className="flex h-full items-center gap-3 p-3" style={{ background: `radial-gradient(90% 120% at 0% 50%, ${color}26, rgba(10,6,14,0.84) 60%)` }}>
                            <svg viewBox="0 0 120 120" className="h-[118px] w-[118px] shrink-0" aria-hidden>{ART[h.id]}</svg>
                            <div className="flex min-w-0 flex-col gap-1.5">
                                <h4 className="m-0 font-display text-[19px] font-semibold leading-tight text-white">{h.title}</h4>
                                <Reveal order={1} delay={i * 0.14}><p className="m-0 text-[16px] leading-snug text-gray-100">{SHORT[h.id]}</p></Reveal>
                                <Reveal order={2} delay={i * 0.14}><p className="m-0 font-mono text-[14px] text-gray-400">{h.source}</p></Reveal>
                            </div>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
};
