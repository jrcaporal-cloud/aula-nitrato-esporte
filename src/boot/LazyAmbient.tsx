import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Fundo 3D (three.js + R3F, ~1 MB sem gzip) fora da carga inicial: a capa aparece primeiro,
 * o fundo baixa logo depois e entra com fade, por trás do slide (o fundo da página já é #07050B).
 */
const AmbientBackground = lazy(() =>
    import('../components/three/AmbientBackground').then(m => ({ default: m.AmbientBackground })),
);

/** Começa a baixar depois do primeiro desenho, quando o navegador estiver livre (teto de 1,2 s). */
const afterFirstPaint = (run: () => void): (() => void) => {
    let idle = 0;
    let timer = 0;
    const raf = requestAnimationFrame(() => {
        timer = window.setTimeout(() => {
            if ('requestIdleCallback' in window) idle = window.requestIdleCallback(run, { timeout: 1200 });
            else run();
        }, 0);
    });
    return () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(timer);
        if (idle) window.cancelIdleCallback(idle);
    };
};

const FadeIn = ({ children }: { children: ReactNode }) => {
    const reduce = useReducedMotion();
    return (
        <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0 : 0.9, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    );
};

export const LazyAmbient = () => {
    const [ready, setReady] = useState(false);
    useEffect(() => afterFirstPaint(() => setReady(true)), []);
    if (!ready) return null;
    return (
        // Fallback nulo: enquanto o pedaço baixa, fica o fundo liso da página — nada pisca.
        <Suspense fallback={null}>
            <FadeIn><AmbientBackground /></FadeIn>
        </Suspense>
    );
};
