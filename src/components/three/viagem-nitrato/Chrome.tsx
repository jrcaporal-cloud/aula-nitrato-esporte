import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Info, Pause, Pin, Play, X } from 'lucide-react';
import { C } from '../../sims/kit/palette';
import { STEPS } from './content';
import { useSelection } from './selection';
import { STRUCTURES } from './structures';

/* Peças fixas do modal: linha do tempo das etapas, véu de carregamento e cartão da estrutura. */

const ACCENT = C.nitrate;

interface StepTimelineProps { step: number; playing: boolean; onGo: (i: number) => void; onTogglePlay: () => void }

export const StepTimeline = ({ step, playing, onGo, onTogglePlay }: StepTimelineProps) => {
    const last = STEPS.length - 1;
    return (
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-2.5 rounded-full bg-black/65 border border-white/10 backdrop-blur-xl">
            <button type="button" aria-label="Etapa anterior (←)" onClick={() => onGo(step - 1)} disabled={step === 0}
                className="w-9 h-9 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-25">
                <ChevronLeft size={18} />
            </button>
            {STEPS.map((s, i) => (
                <div key={s.badge + i} className="flex items-center gap-2">
                    {i > 0 && (
                        <div className="w-3 h-px bg-white/15 relative overflow-hidden">
                            <div className={`absolute inset-0 transition-transform duration-700 ${i <= step ? 'translate-x-0' : '-translate-x-full'}`} style={{ background: ACCENT }} />
                        </div>
                    )}
                    <button
                        type="button" onClick={() => onGo(i)} title={s.short}
                        aria-label={`Etapa ${i + 1}: ${s.short}`} aria-current={i === step ? 'step' : undefined}
                        className={`w-9 h-9 rounded-full text-[14px] font-semibold transition-all duration-300 ${i === step ? 'text-white border-2 scale-110' : i < step ? 'bg-white/5 border' : 'bg-white/5 border border-white/15 text-gray-400 hover:text-gray-100'}`}
                        style={i === step ? { background: `${ACCENT}33`, borderColor: ACCENT, boxShadow: `0 0 16px ${ACCENT}80` } : i < step ? { borderColor: `${ACCENT}66`, color: ACCENT } : undefined}
                    >
                        {i + 1}
                    </button>
                </div>
            ))}
            <button type="button" aria-label="Próxima etapa (→)" onClick={() => onGo(step + 1)} disabled={step === last}
                className="w-9 h-9 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-25">
                <ChevronRight size={18} />
            </button>
            <span className="w-px h-6 bg-white/10" />
            <button type="button" onClick={onTogglePlay} aria-label={playing ? 'Pausar (Espaço)' : 'Reproduzir (Espaço)'}
                className="flex items-center gap-2 pl-3 pr-4 h-9 rounded-full text-[14px] text-gray-200 hover:text-white hover:bg-white/10">
                {playing ? <Pause size={15} /> : <Play size={15} />}
                {playing ? 'Pausar' : 'Reproduzir'}
            </button>
        </div>
    );
};

export const LoadingVeil = ({ reduced }: { reduced: boolean }) => (
    <motion.div
        role="status" aria-live="polite"
        className="absolute inset-0 z-[44] flex flex-col items-center justify-center gap-5 bg-[#07050B] pointer-events-none"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.5 } }}
        transition={{ duration: 0.4, delay: 0.25 }}
    >
        <div className="relative w-16 h-16 flex items-center justify-center">
            {!reduced && (
                <motion.span aria-hidden className="absolute inset-0 rounded-full border-2 border-pink-500/60"
                    animate={{ scale: [1, 1.7], opacity: [0.7, 0] }} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeOut' }} />
            )}
            <span aria-hidden className="w-7 h-7 rounded-full" style={{ background: C.nitrate, boxShadow: `0 0 28px ${C.nitrate}b3` }} />
        </div>
        <p className="text-[14px] font-mono tracking-wider text-pink-200/90">Montando a viagem…</p>
    </motion.div>
);

/** Cartão da estrutura fixada (ou sob o ponteiro), com a fonte; vazio, vira uma dica de uma linha. */
export const StructureCard = () => {
    const pin = useSelection(s => s.pin);
    const hoverId = useSelection(s => s.hoverId);
    const release = useSelection(s => s.release);
    const id = pin ?? hoverId;
    const shown = id ? STRUCTURES[id] : null;
    return (
        <div
            className="px-3.5 py-2.5 rounded-xl border transition-colors duration-300"
            style={shown ? { borderColor: `${ACCENT}80`, background: `${ACCENT}0d` } : { borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}
        >
            <div className="flex items-center gap-2">
                {pin ? <Pin size={15} style={{ color: ACCENT }} aria-hidden /> : <Info size={15} style={{ color: shown ? ACCENT : C.muted }} aria-hidden />}
                <span className="flex-1 text-[14px] font-semibold text-gray-200 uppercase tracking-wider">
                    {shown ? shown.name : 'Clique numa estrutura'}
                </span>
                {pin && (
                    <button type="button" onClick={release} aria-label="Soltar a estrutura fixada (Esc)"
                        className="inline-flex items-center gap-1.5 pl-2 pr-2.5 h-7 rounded-full text-[14px] text-gray-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15">
                        <X size={14} aria-hidden /> Soltar
                        <kbd className="ml-0.5 px-1 rounded border border-white/20 bg-white/10 text-[14px] font-mono text-gray-300">Esc</kbd>
                    </button>
                )}
            </div>
            {shown && (
                <>
                    <p className="mt-1 text-[14px] text-gray-300 leading-relaxed" aria-live="polite">{shown.info}</p>
                    <p className="mt-1 text-[14px] font-mono" style={{ color: `${C.nitrateSoft}cc` }}>Fonte: {shown.source}</p>
                </>
            )}
        </div>
    );
};
