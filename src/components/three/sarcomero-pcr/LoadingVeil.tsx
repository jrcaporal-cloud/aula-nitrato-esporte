import { motion } from 'framer-motion';
import { COL } from './colors';

/* Véu de carregamento: escondido nos primeiros 250 ms; some quando a cena desenha os primeiros quadros. */
export const LoadingVeil = ({ reduced }: { reduced: boolean }) => (
    <motion.div
        role="status"
        aria-live="polite"
        className="absolute inset-0 z-[44] flex flex-col items-center justify-center gap-5 bg-[#07050B] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        transition={{ duration: 0.4, delay: 0.25 }}
    >
        <div className="relative w-16 h-16 flex items-center justify-center">
            {!reduced && (
                <motion.span aria-hidden className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: `${COL.nitrate}99` }}
                    animate={{ scale: [1, 1.7], opacity: [0.7, 0] }} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeOut' }} />
            )}
            <span aria-hidden className="w-7 h-7 rounded-full" style={{ background: COL.nitrate, boxShadow: `0 0 28px ${COL.nitrate}b3` }} />
        </div>
        <p className="text-[14px] font-mono tracking-wider text-pink-200/90">Montando o sarcômero…</p>
    </motion.div>
);
