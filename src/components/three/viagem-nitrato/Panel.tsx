import { motion } from 'framer-motion';
import { C } from '../../sims/kit/palette';
import { CHX_EFFECTS, CHX_NOTE } from './content';

/* Painel lateral: o interruptor do bochecho com clorexidina e o que ele muda (KAPIL2013). */

interface ChxProps { on: boolean; onChange: (v: boolean) => void }

export const ChxSwitch = ({ on, onChange }: ChxProps) => (
    <section className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
                <h4 className="text-[15px] font-semibold text-white leading-tight">Bochechar com clorexidina</h4>
                <p className="text-[14px] text-gray-400 leading-snug">tecla C · veja na língua (etapa 4)</p>
            </div>
            <button
                type="button" role="switch" aria-checked={on} aria-label="Bochechar com clorexidina"
                onClick={() => onChange(!on)}
                className="relative shrink-0 w-14 h-8 rounded-full border transition-colors"
                style={{ background: on ? `${C.bacteria}55` : 'rgba(255,255,255,0.08)', borderColor: on ? C.bacteria : 'rgba(255,255,255,0.2)' }}
            >
                <span className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full transition-transform duration-200"
                    style={{ background: on ? C.bacteria : '#9CA3AF', transform: on ? 'translateX(24px)' : 'translateX(0)' }} />
            </button>
        </div>
        {on && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-2">
                <ul className="space-y-1">
                    {CHX_EFFECTS.map(e => (
                        <li key={e.label} className="flex items-baseline justify-between gap-3 rounded-lg px-3 py-0.5 bg-white/[0.04] border border-white/10">
                            <span className="text-[14px] text-gray-300">{e.label}</span>
                            <span className="font-mono text-[17px] font-semibold whitespace-nowrap" style={{ color: e.color === 'risk' ? C.risk : C.nitrite }}>{e.value}</span>
                        </li>
                    ))}
                </ul>
                <p className="mt-1.5 text-[14px] text-gray-400 leading-snug">{CHX_NOTE}</p>
                <p className="mt-1 text-[14px] font-mono text-gray-400">KAPIL2013 · 19 voluntários · 7 dias</p>
            </motion.div>
        )}
    </section>
);
