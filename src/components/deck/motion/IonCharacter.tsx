import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { DECK } from '../slides';
import { DESIGN_WIDTH } from '../FitStage';
import { GLYPH_PX, IonGlyph } from './IonGlyph';
import { ionStateFor, type IonSpecies } from './ionPath';
import { useMotionStore, type IonStop } from './motionStore';

interface IonCharacterProps {
    index: number;
    /** Visão geral, modelo 3D ou outro painel por cima: o íon se recolhe. */
    hidden: boolean;
}

const SPRING_X = { type: 'spring', stiffness: 150, damping: 22, mass: 1 } as const;
const SPRING_Y = { type: 'spring', stiffness: 95, damping: 17, mass: 1 } as const;

/** Converte a posição do palco (1280 px) do slide `index` em px da tela, como o FitStage escala. */
const measureSlide = (index: number): IonStop | null => {
    const section = document.querySelector<HTMLElement>(`section[data-deck-index="${index}"]`);
    const outer = section?.querySelector<HTMLElement>('.deck-stage');
    const wrap = outer?.firstElementChild as HTMLElement | null | undefined;
    if (!outer || !wrap || wrap.offsetWidth === 0) return null;
    const scale = wrap.offsetWidth / DESIGN_WIDTH;
    const ion = ionStateFor(DECK[index].slide.id);
    return {
        x: wrap.offsetLeft + ion.x * scale,
        y: wrap.offsetTop - outer.scrollTop + ion.y * scale,
        size: ion.size * scale,
    };
};

/**
 * O íon personagem: uma molécula que mora acima do slide e abaixo dos controles e viaja de um
 * slide ao outro num arco (mola horizontal + pulo), trocando de espécie conforme a história.
 * Posição por quadro em motion values (sem re-render); ignora o mouse.
 */
export const IonCharacter = ({ index, hidden }: IonCharacterProps) => {
    const reduced = useReducedMotion() ?? false;
    const hopRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(-300);
    const y = useMotionValue(-300);
    const scale = useMotionValue(0.46);
    const opacity = useMotionValue(0);
    const stop = useMotionStore(s => s.ionStop);
    const slideState = ionStateFor(DECK[index].slide.id);
    const visible = !hidden && (stop !== null || slideState.visible);

    // Nos slides em que se recolhe, mantém a última espécie (não troca de cor enquanto some).
    const [species, setSpecies] = useState<IonSpecies>(slideState.species);
    if (slideState.visible && slideState.species !== species) setSpecies(slideState.species);

    useEffect(() => {
        let frame = 0;
        const travel = (target: IonStop, hop: boolean) => {
            const shown = opacity.get() > 0.05;
            const s = target.size / GLYPH_PX;
            if (!shown || reduced) {
                x.set(target.x); y.set(target.y); scale.set(s);
            } else {
                animate(x, target.x, SPRING_X);
                animate(y, target.y, SPRING_Y);
                animate(scale, s, { duration: 0.4 });
                const far = Math.hypot(target.x - x.get(), target.y - y.get()) > 6;
                if (hop && far && hopRef.current) {
                    animate(hopRef.current, { y: [0, -target.size * 0.75, 0], scale: [1, 1.14, 1] }, { duration: 0.6, ease: 'easeInOut' });
                }
            }
            animate(opacity, visible ? 1 : 0, { duration: visible ? 0.35 : 0.25 });
        };
        const place = (hop: boolean) => {
            const target = stop ?? measureSlide(index);
            if (target) travel(target, hop);
            else animate(opacity, 0, { duration: 0.2 });
        };
        frame = requestAnimationFrame(() => place(true));

        // O slide muda de altura (simulador carregando, janela redimensionada): acompanha sem pulo.
        const wrap = document.querySelector(`section[data-deck-index="${index}"] .deck-stage > div`);
        const observer = new ResizeObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => place(false)); });
        if (wrap && !stop) observer.observe(wrap);
        const onResize = () => place(false);
        window.addEventListener('resize', onResize);
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener('resize', onResize);
        };
    }, [index, stop, visible, reduced, x, y, scale, opacity]);

    return (
        <div aria-hidden className="absolute inset-0 z-[25] pointer-events-none overflow-hidden">
            <motion.div
                data-ion
                className="absolute left-0 top-0"
                style={{ x, y, scale, opacity, width: GLYPH_PX, height: GLYPH_PX, marginLeft: -GLYPH_PX / 2, marginTop: -GLYPH_PX / 2, willChange: 'transform' }}
            >
                <div ref={hopRef}>
                    <IonGlyph species={species} reduced={reduced} />
                </div>
            </motion.div>
        </div>
    );
};
