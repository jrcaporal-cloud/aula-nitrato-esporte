import { motion } from 'framer-motion';
import { enterLayer, useSlideMotion } from '../deck/motion/transitions';

interface SlideHeaderProps {
    title: string;
    subtitle?: string | null;
}

const tidy = (text: string) => text.replace(/\s+/g, ' ').trim();

/** Cabeçalho único de todos os slides: barra vermelha à esquerda, título e subtítulo. */
export const SlideHeader = ({ title, subtitle }: SlideHeaderProps) => {
    const subText = subtitle ? tidy(subtitle) : '';
    // Parallax de entrada: título primeiro (anda menos), subtítulo logo atrás; o conteúdo vem depois.
    const m = useSlideMotion();
    const titleIn = enterLayer(m, 24, 0);
    const subIn = enterLayer(m, 36, 0.03);
    return (
        <div className="mb-6 border-l-4 border-brand-deep pl-7 pointer-events-none">
            <motion.h2
                {...titleIn}
                className="text-[2.9rem] leading-[1.06] font-display font-semibold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
            >
                {tidy(title)}
            </motion.h2>
            {subText && (
                <motion.p
                    {...subIn}
                    className="mt-2 text-[1.45rem] leading-snug text-brand-accent font-light max-w-4xl drop-shadow-md"
                >
                    {subText}
                </motion.p>
            )}
        </div>
    );
};
