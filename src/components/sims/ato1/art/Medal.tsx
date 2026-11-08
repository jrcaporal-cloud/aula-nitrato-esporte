import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface MedalProps {
    color: string;
    size: number;
    /** Distintivo no canto (voto, resultado). */
    badge?: ReactNode;
    float?: boolean;
    children: ReactNode;
}

/** Medalhão de vidro com brilho na cor do tema e o selo no centro; flutua devagar quando `float`. */
export const Medal = ({ color, size, badge, float = true, children }: MedalProps) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <motion.div className="absolute inset-0 flex items-center justify-center rounded-full border"
                style={{
                    borderColor: `${color}88`,
                    background: `radial-gradient(circle at 32% 26%, ${color}55, ${color}14 62%, rgba(7,5,11,0.6))`,
                    boxShadow: `0 0 28px -6px ${color}, inset 0 0 18px -8px ${color}`,
                }}
                animate={float && !reduce ? { y: [0, -3, 0] } : { y: 0 }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}>
                {children}
            </motion.div>
            {badge}
        </div>
    );
};
