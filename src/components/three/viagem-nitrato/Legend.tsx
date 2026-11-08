import { C } from '../../sims/kit/palette';

/*
 * Legenda de cores do modelo. O que aparece na etapa fica aceso; o resto, esmaecido (a cor é a mesma
 * em toda a aula: magenta = nitrato, âmbar = nitrito, verde = NO, violeta = bactérias, laranja = acidez/hipóxia).
 */

interface Item { key: string; label: string; color: string; steps: readonly number[] }

const ITEMS: readonly Item[] = [
    { key: 'nitrato', label: 'Nitrato NO₃⁻', color: C.nitrate, steps: [0, 1, 2, 3, 4, 5, 6, 7] },
    { key: 'nitrito', label: 'Nitrito NO₂⁻', color: C.nitrite, steps: [3, 4, 5, 6] },
    { key: 'no', label: 'NO', color: C.no, steps: [4, 6] },
    { key: 'bac', label: 'Bactérias', color: C.bacteria, steps: [3] },
    { key: 'acid', label: 'Acidez · hipóxia', color: C.hypoxia, steps: [4, 6] },
];

export const Legend = ({ step, chx }: { step: number; chx: boolean }) => (
    <div className="inline-flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3.5 py-2 rounded-full border border-white/10 bg-black/45 backdrop-blur-md" aria-label="Legenda de cores">
        {ITEMS.map(it => {
            const on = it.steps.includes(step);
            return (
                <span key={it.key} className="inline-flex items-center gap-2 text-[14px] leading-none transition-opacity duration-500" style={{ opacity: on ? 1 : 0.38, color: on ? '#F3F4F6' : '#9CA3AF' }}>
                    <span aria-hidden className="w-3 h-3 rounded-full" style={{ background: it.color, boxShadow: on ? `0 0 10px ${it.color}` : 'none' }} />
                    {it.label}
                </span>
            );
        })}
        {chx && (
            <span className="inline-flex items-center gap-2 text-[14px] leading-none font-semibold" style={{ color: C.bacteria }}>
                <span aria-hidden className="w-2.5 h-2.5 rounded-sm rotate-45" style={{ background: C.bacteria }} />
                bochecho ligado
            </span>
        )}
    </div>
);
