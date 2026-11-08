import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { TitleSlide } from '../presentation/TitleSlide';
import { ProseSlide } from '../presentation/ProseSlide';
import { QuoteSlide } from '../presentation/QuoteSlide';
import { FitStage } from './FitStage';
import { SlideErrorBoundary } from './SlideErrorBoundary';
import { preloadAllSims } from '../presentation/slideContent';
import { DeckChrome } from './DeckChrome';
import { ActOpening } from './motion/ActOpening';
import { IonCharacter } from './motion/IonCharacter';
import { KEEP_JS_ANIMATION, SECTION_VARIANTS, SlideMotionContext } from './motion/transitions';
import { useSlideTransition } from './motion/useSlideTransition';
import { Overview } from './Overview';
import { DECK, MODEL_3D_BY_SLIDE, type DeckSlide, type Model3D } from './slides';
import { useDeckNavigation } from './useDeckNavigation';
import { useSlideStepStore } from '../../store/useSlideSteps';
import { PRESENTER_CHANNEL, openPresenterWindow, type PresenterMessage } from './presenterChannel';
import { toggleDetails } from '../../lib/detailsEvent';
import { MODALS_3D, preloadAll3D } from '../three/registry';
import { Morph3D } from '../three/morph/Morph3D';
import { accentOf } from '../three/morph/accent';
import { useMorph3D } from '../three/morph/useMorph3D';

const renderSlide = ({ slide }: DeckSlide) => {
    if (slide.id === 0) return <TitleSlide slide={slide} />;
    if (!slide.title.trim()) return <QuoteSlide slide={slide} />;
    return <ProseSlide slide={slide} />;
};

const IDLE_MS = 2600;

// Os modelos 3D (cena + pós-processamento) só são baixados quando alguém os abre (ou na pré-carga).
// Cada arquivo de `three/models/` é um modelo: export default de um modal que recebe `onClose`.

export const Deck = () => {
    const rootRef = useRef<HTMLDivElement>(null);
    const setSlide = useStore(s => s.setSlide);
    const modalOpen = useStore(s => s.modalOpen);
    const setModalOpen = useStore(s => s.setModalOpen);
    const [overview, setOverview] = useState(false);
    const [idle, setIdle] = useState(false);

    const toggleOverview = useCallback(() => setOverview(o => !o), []);
    const closeOverlays = useCallback(() => setOverview(false), []);

    const { index, goTo, next, prev } = useDeckNavigation({
        total: DECK.length,
        paused: modalOpen,
        rootRef,
        onToggleOverview: toggleOverview,
        onCloseOverlays: closeOverlays,
    });

    const current = DECK[index];
    const model3D = MODEL_3D_BY_SLIDE.get(current.slide.id) ?? null;
    const has3D = model3D !== null;
    // Tecla 3: a arte do slide cresce e vira a cena 3D (e volta para ela ao fechar).
    const morph = useMorph3D(rootRef, index);
    const openMorph = morph.open;
    const open3D: Model3D | null = morph.name;
    const show3D = open3D !== null;
    const Open3D = open3D ? MODALS_3D[open3D] : undefined;

    useEffect(() => setSlide(index), [index, setSlide]);

    // Depois que a capa aparece, baixa o resto da aula em segundo plano.
    useEffect(() => {
        const start = window.setTimeout(() => {
            void preloadAllSims().then(preloadAll3D);
        }, 2500);
        return () => window.clearTimeout(start);
    }, []);

    // Sincroniza com a janela do apresentador (P): envia estado, recebe comandos.
    const step = useSlideStepStore(st => st.step);
    const stepCount = useSlideStepStore(st => st.count);
    const channelRef = useRef<BroadcastChannel | null>(null);
    const navRef = useRef({ next, prev, goTo });
    useEffect(() => { navRef.current = { next, prev, goTo }; }, [next, prev, goTo]);
    const stateRef = useRef({ index, step, stepCount });

    useEffect(() => {
        stateRef.current = { index, step, stepCount };
        channelRef.current?.postMessage({ type: 'state', index, step, stepCount } satisfies PresenterMessage);
    }, [index, step, stepCount]);

    useEffect(() => {
        const channel = new BroadcastChannel(PRESENTER_CHANNEL);
        channelRef.current = channel;
        channel.onmessage = (e: MessageEvent<PresenterMessage>) => {
            const msg = e.data;
            if (msg.type === 'next') navRef.current.next();
            else if (msg.type === 'prev') navRef.current.prev();
            else if (msg.type === 'goto') navRef.current.goTo(msg.index);
            else if (msg.type === 'hello') channel.postMessage({ type: 'state', ...stateRef.current } satisfies PresenterMessage);
        };
        return () => { channel.close(); channelRef.current = null; };
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (modalOpen || e.metaKey || e.ctrlKey || e.altKey) return;
            if (e.key === 'p' || e.key === 'P') openPresenterWindow(stateRef.current.index);
            if (e.key === 'd' || e.key === 'D') toggleDetails();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [modalOpen]);
    useEffect(() => setModalOpen(show3D), [show3D, setModalOpen]);

    // Atalho "3" abre o modelo 3D do slide, quando ele tem um.
    useEffect(() => {
        if (!model3D || modalOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== '3' || e.metaKey || e.ctrlKey || e.altKey || useStore.getState().modalOpen) return;
            openMorph(model3D);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [model3D, modalOpen, openMorph]);

    // Controles e cursor somem quando o mouse fica parado (projeção limpa).
    useEffect(() => {
        let timer = window.setTimeout(() => setIdle(true), IDLE_MS);
        const wake = () => {
            setIdle(false);
            window.clearTimeout(timer);
            timer = window.setTimeout(() => setIdle(true), IDLE_MS);
        };
        window.addEventListener('mousemove', wake);
        window.addEventListener('mousedown', wake);
        return () => {
            window.clearTimeout(timer);
            window.removeEventListener('mousemove', wake);
            window.removeEventListener('mousedown', wake);
        };
    }, []);

    // Direção da troca e abertura de ato (camadas em ./motion).
    const slideMotion = useSlideTransition(index);

    return (
        <div
            ref={rootRef}
            data-idle={idle || undefined}
            className={`deck-root absolute inset-0 z-10 overflow-hidden font-body selection:bg-brand-deep selection:text-white ${idle && !overview ? 'cursor-none' : ''}`}
        >
            {/* Troca de slide: lateral com parallax no mesmo ato; abertura de ato cobre a troca entre atos. */}
            <AnimatePresence initial={false} custom={slideMotion.motion}>
                <motion.section
                    key={index}
                    custom={slideMotion.motion}
                    data-deck-index={index}
                    className="absolute inset-0"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} de ${DECK.length}: ${current.label}`}
                    variants={SECTION_VARIANTS}
                    onUpdate={KEEP_JS_ANIMATION}
                    initial="enter"
                    animate="center"
                    exit="exit"
                >
                    <SlideMotionContext.Provider value={slideMotion.motion}>
                        <FitStage><SlideErrorBoundary resetKey={index}>{renderSlide(current)}</SlideErrorBoundary></FitStage>
                    </SlideMotionContext.Provider>
                </motion.section>
            </AnimatePresence>

            <ActOpening act={slideMotion.cardAct} cardKey={slideMotion.cardKey} onClose={slideMotion.closeCard} />
            <IonCharacter index={index} hidden={overview || modalOpen} />

            <DeckChrome
                index={index}
                total={DECK.length}
                section={current.section}
                idle={idle}
                has3D={has3D}
                onPrev={prev}
                onNext={next}
                onOverview={toggleOverview}
                on3D={() => morph.open(model3D)}
                onPresenter={() => openPresenterWindow(index)}
            />

            <AnimatePresence>
                {overview && (
                    <Overview
                        current={index}
                        onSelect={i => { goTo(i); setOverview(false); }}
                        onClose={() => setOverview(false)}
                    />
                )}
            </AnimatePresence>

            <Suspense fallback={null}>
                <AnimatePresence custom={morph.from} onExitComplete={morph.onExitComplete}>
                    {Open3D && (
                        <Morph3D key={open3D} from={morph.from} accent={accentOf(open3D)} onClose={morph.close}>
                            <Open3D onClose={morph.close} />
                        </Morph3D>
                    )}
                </AnimatePresence>
            </Suspense>
        </div>
    );
};
