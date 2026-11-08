import { motion } from 'framer-motion';
import { Info, Pin, X } from 'lucide-react';
import { C } from '../../sims/kit/palette';
import type { View } from './clock';
import { COL } from './colors';
import { STRUCTURES } from './content';
import { useSelection } from './selection';
import type { SarcoStep } from './steps';

/* Peças do painel lateral: texto da etapa, foco placebo × nitrato, legenda e cartão da estrutura. */

export const StepText = ({ data, step, last }: { data: SarcoStep; step: number; last: number }) => (
    <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center gap-3 mb-2.5 pr-12">
            <span className="inline-block px-3 py-1 text-[14px] font-mono tracking-widest rounded-full border"
                style={{ color: COL.nitrateSoft, background: `${COL.nitrate}1A`, borderColor: `${COL.nitrate}55` }}>{data.badge}</span>
            <span className="text-[14px] font-mono text-gray-400" aria-label={`Etapa ${step + 1} de ${last + 1}`}>{step + 1}/{last + 1}</span>
        </div>
        <h3 className="font-display text-[24px] font-semibold text-white leading-tight mb-2">{data.title}</h3>
        <p className="text-[15px] text-gray-200 leading-relaxed">{data.text}</p>
        <ul className="mt-2 space-y-0.5">
            {data.sources.map(s => <li key={s} className="text-[14px] text-gray-400 leading-snug">{s}</li>)}
        </ul>
    </motion.div>
);

const OPTIONS: readonly { view: View; text: string }[] = [
    { view: 'both', text: 'Lado a lado' },
    { view: 'placebo', text: 'Placebo' },
    { view: 'nitrate', text: 'Nitrato' },
];

/** Foco do par (tecla P). Nas etapas 4 e 5 só existem placebo e nitrato (o nitrato é o padrão). */
export const ViewSwitch = ({ view, single, onChange }: { view: View; single: boolean; onChange: (v: View) => void }) => {
    const shown = single ? OPTIONS.slice(1) : OPTIONS;
    const active = single && view === 'both' ? 'nitrate' : view;
    return (
        <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-[14px] font-semibold text-gray-200">Mostrar</span>
                <span className="text-[14px] font-mono text-gray-400">tecla P</span>
            </div>
            <div className="flex gap-1.5" role="group" aria-label="Foco entre placebo e nitrato">
                {shown.map(o => {
                    const on = o.view === active;
                    const color = o.view === 'placebo' ? COL.placebo : o.view === 'nitrate' ? COL.nitrate : '#E5E7EB';
                    return (
                        <button key={o.view} type="button" aria-pressed={on} onClick={() => onChange(o.view)}
                            className="flex-1 h-10 rounded-lg border text-[14px] font-semibold transition-colors"
                            style={on ? { borderColor: color, background: `${color}26`, color: '#fff' } : { borderColor: 'rgba(255,255,255,0.12)', color: '#D1D5DB' }}>
                            {o.text}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const LEGENDS: readonly (readonly [string, string][])[] = [
    [[COL.placebo, 'Placebo'], [COL.nitrate, 'Nitrato'], [COL.ca, 'Ca²⁺'], [COL.atp, 'ATP gasto (faíscas)'], [COL.pcr, 'PCr'], [COL.cr, 'Creatina livre'], [COL.pi, 'Pi'], [COL.adp, 'ADP']],
    [[COL.placebo, 'Placebo'], [COL.nitrate, 'Nitrato'], [COL.ca, 'Ca²⁺'], [COL.atp, 'ATP gasto (faíscas)'], [COL.pcr, 'PCr'], [COL.cr, 'Creatina livre'], [COL.pi, 'Pi'], [COL.adp, 'ADP']],
    [[COL.fiberII, 'Fibra tipo II'], [COL.fiberI, 'Fibra tipo I'], [COL.ca, 'Ca²⁺'], [COL.nitrate, 'CASQ1 / DHPR ↑']],
    [[COL.fiberII, 'Fibra tipo II'], [COL.fiberI, 'Fibra tipo I'], [C.no, 'Ganho de fluxo (NO)'], [C.o2Soft, 'Glóbulos']],
    [[COL.fiberII, 'Fibra tipo II'], [COL.fiberI, 'Fibra tipo I'], [COL.placebo, 'Contorno: placebo'], [COL.nitrate, 'Contorno: nitrato']],
];

export const Legend = ({ step }: { step: number }) => (
    <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5">
        {LEGENDS[step].map(([c, l]) => (
            <span key={l} className="flex items-center gap-2 text-[14px] text-gray-200 whitespace-nowrap">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />{l}
            </span>
        ))}
    </div>
);

/** Selo obrigatório de todo modelo 3D da aula. */
export const SchematicChip = () => (
    <p className="mt-4 inline-block px-3 py-1 rounded-full text-[14px] font-mono tracking-wide text-amber-200 bg-amber-400/10 border border-amber-300/30">
        representação esquemática · escalas fora de proporção
    </p>
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
                <Info size={15} aria-hidden /> Arraste para girar, role para aproximar; passe o mouse ou clique numa estrutura para ler o cartão.
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
                    <button type="button" onClick={release} aria-label="Soltar a estrutura fixada (Esc)"
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
