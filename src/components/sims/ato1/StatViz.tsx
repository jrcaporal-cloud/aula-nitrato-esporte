import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import type { Viz } from './claims';

/** Gráfico pequeno do veredito: barras (efeito presente em magenta, ausente em ardósia) ou a janela do nitrito. */

const BarsViz = ({ viz }: { viz: Extract<Viz, { kind: 'bars' }> }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex flex-col gap-2">
            {viz.bars.map((bar, i) => (
                <div key={bar.label}>
                    <div className="flex items-baseline justify-between gap-2 leading-none">
                        <span className="text-[16px] text-gray-300">{bar.label}</span>
                        <span className="whitespace-nowrap text-[17px] font-bold" style={{ color: bar.hit ? C.nitrateSoft : C.muted }}>{bar.shown}</span>
                    </div>
                    <div className="mt-1.5 h-3 rounded-full bg-white/10">
                        <motion.div className="h-full rounded-full" style={{ background: bar.hit ? C.nitrate : C.placebo, minWidth: 4 }}
                            initial={{ width: 0 }} animate={{ width: `${Math.max((bar.value / viz.max) * 100, 0)}%` }}
                            transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.25 + i * 0.12, ease: 'easeOut' }} />
                    </div>
                </div>
            ))}
        </div>
    );
};

/** Eixo de 0 a 4 h: a dose no zero (tomada no aquecimento) e a faixa de 2 a 3 h em que o nitrito do plasma chega ao pico. */
const WindowViz = () => (
    <div className="relative mt-1 h-[74px]">
        <div className="absolute inset-x-0 top-[34px] h-1.5 rounded-full bg-white/10" />
        <div className="absolute top-[24px] h-[26px] rounded-md border" style={{ left: '50%', width: '25%', background: `${C.nitrite}38`, borderColor: C.nitrite }} />
        <div className="absolute top-[22px] h-[30px] w-1 -translate-x-1/2 rounded-full" style={{ left: 0, background: C.nitrate }} />
        {[0, 1, 2, 3, 4].map(h => (
            <span key={h} className="absolute top-[56px] -translate-x-1/2 font-mono text-[16px] text-gray-400" style={{ left: `${h * 25}%` }}>{h}</span>
        ))}
        <span className="absolute top-0 text-[16px] font-semibold" style={{ left: 0, color: C.nitrateSoft }}>aquecimento</span>
        <span className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-[16px] font-semibold" style={{ left: '62.5%', color: C.nitriteSoft }}>pico do nitrito</span>
    </div>
);

export const StatViz = ({ viz }: { viz: Viz }) => (
    <div>
        <p className="mb-2 font-mono text-[16px] leading-tight text-gray-400">{viz.title}</p>
        {viz.kind === 'bars' ? <BarsViz viz={viz} /> : <WindowViz />}
    </div>
);
