import { motion, useReducedMotion } from 'framer-motion';
import { ClipboardCheck, Droplets, Palette, TestTubeDiagonal } from 'lucide-react';
import type { ComponentType } from 'react';
import { C } from '../kit/palette';
import { HABITS } from './protocolContent';
import { Card } from './ui';

/** Passo 4 do ProtocolSim: quatro hábitos do dia da dose (enxaguante, beterrúria, teste no treino, biomarcador). */

const ICONS: Record<string, ComponentType<{ size?: number; color?: string }>> = {
    rinse: Droplets, beeturia: Palette, trial: ClipboardCheck, marker: TestTubeDiagonal,
};
const COLORS: Record<string, string> = { rinse: C.bacteria, beeturia: C.nitrate, trial: C.no, marker: C.nitrite };

export const HabitsView = () => {
    const reduce = useReducedMotion();
    return (
        <div className="grid min-w-0 flex-1 grid-cols-2 grid-rows-2 gap-3">
            {HABITS.map((h, i) => {
                const Icon = ICONS[h.id];
                const color = COLORS[h.id];
                return (
                    <motion.div key={h.id} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12, duration: 0.4 }}>
                        <Card color={color} className="flex h-full flex-col gap-2 p-4">
                            <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `${color}22` }}><Icon size={22} color={color} /></span>
                                <h4 className="m-0 font-display text-[20px] font-semibold leading-tight text-white">{h.title}</h4>
                            </div>
                            <p className="m-0 text-[16px] leading-snug text-gray-100">{h.text}</p>
                            <p className="m-0 mt-auto font-mono text-[14px] text-gray-400">{h.source}</p>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
};
