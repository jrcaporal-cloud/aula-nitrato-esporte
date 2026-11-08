import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { COL } from './colors';
import type { SarcoStep } from './steps';

/* Linha das etapas sobre o 3D: anterior, cinco números, próxima e ▶ (avanço automático). */

interface Props { steps: readonly SarcoStep[]; step: number; playing: boolean; onGo: (i: number) => void; onPlay: () => void }

export const Timeline = ({ steps, step, playing, onGo, onPlay }: Props) => {
    const last = steps.length - 1;
    return (
        <div className="pointer-events-auto flex items-center gap-1 px-2 py-1.5 rounded-full bg-black/65 border border-white/10 backdrop-blur-xl">
            <button type="button" aria-label="Etapa anterior (←)" onClick={() => onGo(step - 1)} disabled={step === 0}
                className="w-9 h-9 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-25">
                <ChevronLeft size={18} />
            </button>
            {steps.map((s, i) => (
                <button key={s.short} type="button" onClick={() => onGo(i)} title={s.short} aria-label={`${i + 1}. ${s.short}`}
                    aria-current={i === step ? 'step' : undefined}
                    className={`h-9 rounded-full text-[14px] font-semibold transition-all duration-300 ${i === step ? 'px-3.5 text-white border-2' : 'w-9 bg-white/5 border border-white/15 text-gray-300 hover:text-white'}`}
                    style={i === step ? { background: `${COL.nitrate}33`, borderColor: COL.nitrate, boxShadow: `0 0 14px ${COL.nitrate}80` } : i < step ? { borderColor: `${COL.nitrate}66`, color: COL.nitrateSoft } : undefined}>
                    <span className="font-mono">{i + 1}</span>{i === step && <span className="ml-1.5">{s.short}</span>}
                </button>
            ))}
            <button type="button" aria-label="Próxima etapa (→)" onClick={() => onGo(step + 1)} disabled={step === last}
                className="w-9 h-9 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-25">
                <ChevronRight size={18} />
            </button>
            <button type="button" aria-label={playing ? 'Pausar avanço automático' : 'Avanço automático das etapas'} aria-pressed={playing} onClick={onPlay}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-white/15 hover:bg-white/10"
                style={playing ? { color: COL.nitrate, borderColor: COL.nitrate } : { color: '#D1D5DB' }}>
                {playing ? <Pause size={16} /> : <Play size={16} />}
            </button>
        </div>
    );
};
