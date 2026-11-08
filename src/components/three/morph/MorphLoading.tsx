import { motion, useReducedMotion } from 'framer-motion';
import type { MorphAccent } from './accent';

/** Indicador discreto enquanto o arquivo do modelo 3D ainda está chegando (o véu escuro fica atrás). */
export const MorphLoading = ({ accent }: { accent: MorphAccent }) => {
    const reduced = useReducedMotion() ?? false;
    return (
        <div role="status" aria-live="polite" className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
            <div className="relative w-12 h-12 flex items-center justify-center">
                {!reduced && (
                    <motion.span
                        aria-hidden
                        className="absolute inset-0 rounded-full border-2"
                        style={{ borderColor: accent.core }}
                        animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                    />
                )}
                <span aria-hidden className="w-5 h-5 rounded-full" style={{ background: accent.core, boxShadow: `0 0 22px ${accent.core}` }} />
            </div>
            <p className="text-[14px] font-mono tracking-wider text-gray-300">Abrindo o modelo 3D…</p>
        </div>
    );
};
