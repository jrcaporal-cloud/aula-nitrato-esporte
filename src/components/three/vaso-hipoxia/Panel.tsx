import { motion } from 'framer-motion';
import { Info, Pin, X } from 'lucide-react';
import { LEGEND, STRUCTURES, type StepContent } from './content';
import { useSelection } from './selection';

/* Peças do painel lateral: texto da etapa, legenda de cores e cartão da estrutura. */

export const StepText = ({ data, step, last }: { data: StepContent; step: number; last: number }) => (
    <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center gap-3 mb-2 pr-12">
            <span className="inline-block px-3 py-1 text-[14px] font-mono tracking-widest text-cyan-200 bg-cyan-500/10 border border-cyan-400/25 rounded-full">{data.badge}</span>
            <span className="text-[14px] font-mono text-gray-400" aria-label={`Etapa ${step + 1} de ${last + 1}`}>{step + 1}/{last + 1}</span>
        </div>
        <h3 className="font-display text-[22px] font-semibold text-white leading-tight mb-1.5">{data.title}</h3>
        <p className="text-[15px] text-gray-200 leading-snug">{data.text}</p>
        <div className="mt-2.5 flex items-baseline gap-3 rounded-lg border px-3 py-2" style={{ borderColor: `${data.stat.color}55`, background: `${data.stat.color}12` }}>
            <span className="font-mono text-[22px] font-bold leading-none whitespace-nowrap" style={{ color: data.stat.color }}>{data.stat.value}</span>
            <span className="text-[14px] leading-snug text-gray-200">{data.stat.label}</span>
        </div>
        <ul className="mt-1.5">
            {data.sources.map(s => <li key={s} className="text-[14px] text-gray-400 leading-snug">{s}</li>)}
        </ul>
    </motion.div>
);

export const Legend = () => (
    <div className="mt-2.5 grid grid-cols-3 gap-x-2 gap-y-1">
        {LEGEND.map(([c, l]) => (
            <span key={l} className="flex items-center gap-1.5 text-[14px] text-gray-200 whitespace-nowrap">
                <span className="w-3 h-3 rounded-full shrink-0 border border-white/40" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />{l}
            </span>
        ))}
    </div>
);

/** Estrutura fixada (com "Soltar") ou, sem nada fixado, a que está sob o ponteiro. */
export const StructureCard = () => {
    const pin = useSelection(s => s.pin);
    const hoverId = useSelection(s => s.hoverId);
    const release = useSelection(s => s.release);
    const id = pin ?? hoverId;
    const shown = id ? STRUCTURES[id] : null;
    if (!shown) {
        return (
            <p className="flex items-center gap-2 text-[14px] text-gray-400">
                <Info size={15} aria-hidden /> Arraste para girar, role para aproximar; passe o mouse ou clique numa estrutura para o cartão.
            </p>
        );
    }
    const color = shown.color;
    return (
        <div className="p-3 rounded-xl border transition-colors duration-300" style={{ borderColor: `${color}80`, background: `${color}10` }}>
            <div className="flex items-center gap-2 mb-1">
                {pin ? <Pin size={15} style={{ color }} aria-hidden /> : <Info size={15} style={{ color }} aria-hidden />}
                <span className="flex-1 text-[14px] font-semibold text-gray-100 uppercase tracking-wider">{shown.name}</span>
                {pin && (
                    <button type="button" onClick={release} aria-label="Soltar a estrutura fixada"
                        className="inline-flex items-center gap-1.5 pl-2 pr-2.5 h-7 rounded-full text-[14px] text-gray-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15">
                        <X size={14} aria-hidden /> Soltar
                    </button>
                )}
            </div>
            <p className="text-[14px] text-gray-300 leading-snug" aria-live="polite">{shown.info}</p>
            <p className="mt-1 text-[14px] text-gray-400 leading-snug">{shown.source}</p>
        </div>
    );
};
