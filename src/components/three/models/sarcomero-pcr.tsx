import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { LocateFixed, X } from 'lucide-react';
import type { Modal3DProps } from '../registry';
import { advance, makeClock, type Clock, type Targets, type View } from '../sarcomero-pcr/clock';
import { COL } from '../sarcomero-pcr/colors';
import { Hud } from '../sarcomero-pcr/Hud';
import { LOOP_S } from '../sarcomero-pcr/kinetics';
import { LoadingVeil } from '../sarcomero-pcr/LoadingVeil';
import { Legend, SchematicChip, StepText, StructureCard, ViewSwitch } from '../sarcomero-pcr/Panel';
import { Scene } from '../sarcomero-pcr/Scene';
import { useSelection } from '../sarcomero-pcr/selection';
import { LAST_STEP, SARCO_STEPS } from '../sarcomero-pcr/steps';
import { Timeline } from '../sarcomero-pcr/Timeline';
import { useSarcoKeys } from '../sarcomero-pcr/useSarcoKeys';

/*
 * Modelo 3D "sarcomero-pcr" (slides 28 e 29): um sarcômero contra uma carga fixa, placebo × nitrato, com o
 * espectro de ³¹P ao vivo no HUD. Cinco etapas: custo de PCr e ATP, componente lento, fibras (camundongo),
 * perfusão (rato) e torque-frequência em humanos. Esquemático; só os números do dossiê aparecem como valor.
 */

const PANEL_W = 'clamp(400px, 30vw, 540px)';
const AUTOPLAY_MS: readonly number[] = [15000, 19000, 15000, 14000, 20000];

const FADE_BOTTOM = {
    maskImage: 'linear-gradient(to bottom, #000 calc(100% - 24px), transparent)',
    WebkitMaskImage: 'linear-gradient(to bottom, #000 calc(100% - 24px), transparent)',
} as const;

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const nextView = (v: View): View => (v === 'both' ? 'placebo' : v === 'placebo' ? 'nitrate' : 'both');

const SarcomeroPcrModal = ({ onClose }: Modal3DProps) => {
    const [step, setStep] = useState(0);
    const [settled, setSettled] = useState(-1);
    const [view, setView] = useState<View>('both');
    const [playing, setPlaying] = useState(false);
    const [ready, setReady] = useState(false);
    const [recenterKey, setRecenterKey] = useState(0);
    const [reduced] = useState(prefersReduced);
    const clockRef = useRef<Clock>(makeClock(reduced));
    const targetRef = useRef<Targets>({ step: 0, view: 'both', reduced });
    const stepRef = useRef(0);
    const pin = useSelection(s => s.pin);
    const hovering = useSelection(s => s.hoverId !== null);
    const release = useSelection(s => s.release);

    // relógio do modelo: o 3D e o HUD leem o mesmo objeto por quadro, sem re-render
    useEffect(() => { targetRef.current = { step, view, reduced }; }, [step, view, reduced]);
    useEffect(() => {
        let raf = 0;
        let last = performance.now();
        const loop = (now: number) => {
            const dt = Math.min((now - last) / 1000, 0.1);
            last = now;
            const tg = targetRef.current;
            clockRef.current = advance(clockRef.current, dt, tg, LOOP_S[tg.step]);
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, []);
    useEffect(() => {
        useSelection.getState().reset();
        return () => useSelection.getState().reset();
    }, []);

    const go = useCallback((target: number) => {
        const next = Math.min(Math.max(target, 0), LAST_STEP);
        if (next === stepRef.current) return;
        stepRef.current = next;
        release();
        setSettled(-1);
        setStep(next);
    }, [release]);
    const onSettled = useCallback((s: number) => setSettled(s), []);
    const onReady = useCallback(() => setReady(true), []);
    const recenter = useCallback(() => { release(); setRecenterKey(k => k + 1); }, [release]);
    const togglePlay = useCallback(() => setPlaying(p => !p), []);
    const cycleView = useCallback(() => {
        setView(v => (stepRef.current >= 3 ? (v === 'placebo' ? 'nitrate' : 'placebo') : nextView(v)));
    }, []);

    // avanço automático (▶): uma volta do laço por etapa; para na última
    useEffect(() => {
        if (!playing) return;
        const id = window.setTimeout(() => {
            if (step >= LAST_STEP) setPlaying(false);
            else go(step + 1);
        }, AUTOPLAY_MS[step]);
        return () => window.clearTimeout(id);
    }, [playing, step, go]);

    useSarcoKeys({
        next: () => go(stepRef.current + 1),
        prev: () => go(stepRef.current - 1),
        escape: () => { if (useSelection.getState().pin) release(); else onClose(); },
        close: onClose,
        cycleView,
        togglePlay,
        recenter,
    });

    const data = SARCO_STEPS[step];
    return (
        <motion.div
            role="dialog"
            aria-label="Sarcômero, custo de ATP e fibras musculares com nitrato, em 3D"
            className="absolute inset-0 z-50 font-body"
            style={{ background: COL.bg }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
        >
            <div className="absolute top-0 bottom-0 left-0 flex flex-col" style={{ right: PANEL_W }}>
                <div className="relative flex-1 min-h-0">
                    <Canvas
                        dpr={[1, 1.75]}
                        camera={{ position: [...SARCO_STEPS[0].pose.pos], fov: 40, near: 0.1, far: 300 }}
                        gl={{ antialias: true, powerPreference: 'high-performance' }}
                        resize={{ offsetSize: true }}
                        className={`${pin || hovering ? 'cursor-pointer' : 'cursor-grab'} active:cursor-grabbing`}
                    >
                        <Suspense fallback={null}>
                            <Scene step={step} settled={settled} recenterKey={recenterKey} reduced={reduced}
                                onSettled={onSettled} onReady={onReady} clockRef={clockRef} />
                        </Suspense>
                    </Canvas>
                    <div aria-hidden className="absolute inset-0 pointer-events-none z-[5]"
                        style={{ background: 'radial-gradient(ellipse 75% 70% at 50% 46%, transparent 55%, rgba(7,5,11,0.55) 85%, rgba(7,5,11,0.85) 100%)' }} />
                    <header className="absolute z-[45] top-0 left-0 right-0 flex items-center gap-4 px-5 pt-3.5 pb-6 pointer-events-none bg-gradient-to-b from-[#07050B]/85 to-transparent">
                        <div className="shrink-0">
                            <p className="text-[14px] font-mono uppercase tracking-[0.2em] leading-none" style={{ color: COL.nitrateSoft }}>Modelo 3D</p>
                            <h2 className="font-display text-[22px] font-semibold text-white leading-tight mt-1">O custo de contrair</h2>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <Timeline steps={SARCO_STEPS} step={step} playing={playing} onGo={go} onPlay={togglePlay} />
                        </div>
                        <button type="button" onClick={recenter} aria-label="Recentrar a câmera na pose da etapa (R)" title="Recentrar (R)"
                            className="pointer-events-auto shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-gray-100 hover:text-white bg-black/60 hover:bg-white/15 border border-white/15 backdrop-blur-xl">
                            <LocateFixed size={17} aria-hidden />
                        </button>
                    </header>
                    <AnimatePresence>{!ready && <LoadingVeil reduced={reduced} />}</AnimatePresence>
                </div>
                <Hud step={step} clockRef={clockRef} />
            </div>

            <aside className="absolute right-5 top-5 bottom-5 flex flex-col rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden"
                style={{ width: `calc(${PANEL_W} - 30px)`, background: 'rgba(12,8,20,0.88)' }}>
                <button type="button" onClick={onClose} aria-label="Fechar modelo 3D (Esc)"
                    className="absolute z-10 top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-gray-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10">
                    <X size={17} />
                </button>
                <div className="flex-1 overflow-y-auto px-5 pt-5 pb-6" style={FADE_BOTTOM}>
                    <StepText data={data} step={step} last={LAST_STEP} />
                    <ViewSwitch view={view} single={step >= 3} onChange={setView} />
                    <Legend step={step} />
                    <SchematicChip />
                </div>
                <div className="shrink-0 px-5 pb-4 pt-2.5 border-t border-white/10">
                    <StructureCard />
                </div>
            </aside>
        </motion.div>
    );
};

export default SarcomeroPcrModal;
