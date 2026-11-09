import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { LocateFixed, X } from 'lucide-react';
import type { Modal3DProps } from '../registry';
import { SEAL, STEPS } from '../vaso-hipoxia/content';
import { CurveChart } from '../vaso-hipoxia/CurveChart';
import { STEP_POSES } from '../vaso-hipoxia/director';
import { LoadingVeil } from '../vaso-hipoxia/LoadingVeil';
import { Legend, StepText, StructureCard } from '../vaso-hipoxia/Panel';
import { useSelection } from '../vaso-hipoxia/selection';
import { createCtl, createSim } from '../vaso-hipoxia/sim';
import { Sliders } from '../vaso-hipoxia/Sliders';
import { Timeline } from '../vaso-hipoxia/Timeline';
import { playPreset, SWEEP_STAGE } from '../vaso-hipoxia/tween';
import { useVasoKeys } from '../vaso-hipoxia/useVasoKeys';
import { VasoScene } from '../vaso-hipoxia/VasoScene';
import { Vignette } from '../vaso-hipoxia/Vignette';

/*
 * Modelo 3D "vaso-hipoxia" (slides 20 e 24): corte de capilar com eritrócitos e, ao lado, uma fibra
 * muscular. Dois controles (saturação de O₂ e pH) mostram que as duas vias de NO são complementares:
 * onde a NOS apaga, a redução do nitrito acende.
 */

const PANEL_W = 420;
const ACCENT = '#34D399';
const LAST = STEPS.length - 1;
/** Tempo de cada etapa na reprodução automática (ms). */
const DWELL_MS = 14000;

const FADE_BOTTOM = {
    maskImage: 'linear-gradient(to bottom, #000 calc(100% - 24px), transparent)',
    WebkitMaskImage: 'linear-gradient(to bottom, #000 calc(100% - 24px), transparent)',
} as const;

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const VasoHipoxiaModal = ({ onClose }: Modal3DProps) => {
    const [step, setStep] = useState(0);
    const [settled, setSettled] = useState(-1);
    const [ready, setReady] = useState(false);
    const [recenterKey, setRecenterKey] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [reduced] = useState(prefersReduced);
    const [sim] = useState(createSim);
    const [ctl] = useState(() => createCtl(STEPS[0].preset.sat, STEPS[0].preset.ph, reduced));
    const simRef = useRef(sim);
    const ctlRef = useRef(ctl);
    const tweenRef = useRef<gsap.core.Timeline | null>(null);
    const stepRef = useRef(0);
    const pin = useSelection(s => s.pin);
    const release = useSelection(s => s.release);

    useEffect(() => {
        useSelection.getState().reset();
        return () => {
            useSelection.getState().reset();
            tweenRef.current?.kill();
        };
    }, []);

    // trocar de etapa solta a fixação e leva a saturação e o pH ao preset da etapa
    const go = useCallback((target: number) => {
        const next = Math.min(Math.max(target, 0), LAST);
        if (next === stepRef.current) return;
        stepRef.current = next;
        release();
        setSettled(-1);
        setStep(next);
        ctlRef.current.stage = next;
        tweenRef.current?.kill();
        tweenRef.current = playPreset(ctlRef.current, STEPS[next].preset, next === SWEEP_STAGE, reduced);
    }, [release, reduced]);
    const goManual = useCallback((target: number) => { setPlaying(false); go(target); }, [go]);
    const onTouch = useCallback(() => { tweenRef.current?.kill(); tweenRef.current = null; }, []);
    const onSettled = useCallback((s: number) => setSettled(s), []);
    const onReady = useCallback(() => setReady(true), []);
    const recenter = useCallback(() => { release(); setRecenterKey(k => k + 1); }, [release]);
    const onPlay = useCallback(() => {
        if (stepRef.current >= LAST) { go(0); setPlaying(true); } else setPlaying(p => !p);
    }, [go]);

    // reprodução automática: avança uma etapa por vez e para na última
    const auto = playing && step < LAST;
    useEffect(() => {
        if (!auto) return;
        const id = window.setTimeout(() => go(stepRef.current + 1), DWELL_MS);
        return () => window.clearTimeout(id);
    }, [auto, step, go]);

    useVasoKeys({
        next: () => goManual(stepRef.current + 1),
        prev: () => goManual(stepRef.current - 1),
        close: onClose,
    });

    const data = STEPS[step];
    return (
        <motion.div
            role="dialog"
            aria-label="Capilar e fibra muscular: onde falta oxigênio, nasce NO, em 3D"
            className="absolute inset-0 z-50 bg-[#07050B] font-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
        >
            <div className="absolute top-0 bottom-0 left-0" style={{ right: PANEL_W }}>
                <Canvas
                    dpr={[1, 1.75]}
                    camera={{ position: STEP_POSES[0].pos as [number, number, number], fov: 40, near: 0.1, far: 300 }}
                    gl={{ antialias: true, powerPreference: 'high-performance' }}
                    resize={{ offsetSize: true }}
                >
                    <Suspense fallback={null}>
                        <VasoScene
                            step={step} settled={settled} pin={pin} recenterKey={recenterKey} reduced={reduced}
                            onSettled={onSettled} onReady={onReady} simRef={simRef} ctlRef={ctlRef}
                        />
                    </Suspense>
                </Canvas>
                <Vignette ctlRef={ctlRef} />
                <button
                    type="button"
                    onClick={recenter}
                    aria-label="Recentrar a câmera na pose da etapa"
                    className="absolute z-[46] top-6 right-6 flex items-center gap-2 pl-3.5 pr-4 h-10 rounded-full text-[14px] font-semibold text-gray-100 hover:text-white bg-[rgba(10,6,14,0.88)] hover:bg-white/15 border border-white/15"
                >
                    <LocateFixed size={16} aria-hidden />
                    Recentrar
                </button>
                <div className="absolute z-[45] left-6 bottom-6 pointer-events-none">
                    <CurveChart ctlRef={ctlRef} />
                </div>
                <AnimatePresence>{!ready && <LoadingVeil reduced={reduced} />}</AnimatePresence>
            </div>

            <header className="absolute z-[45] top-0 left-0 px-8 pt-6 pb-10 pointer-events-none bg-gradient-to-b from-[#07050B]/90 to-transparent" style={{ right: PANEL_W }}>
                <p className="text-[14px] font-mono uppercase tracking-[0.28em] text-emerald-300/90 mb-1">Modelo 3D interativo · capilar e fibra</p>
                <h2 className="font-display text-3xl font-semibold text-white">Onde falta oxigênio, nasce NO</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="px-2.5 py-1 rounded-full text-[14px] font-mono tracking-wide text-amber-200 bg-amber-400/10 border border-amber-300/30">
                        {SEAL}
                    </span>
                </div>
            </header>

            <aside className="absolute right-5 top-5 bottom-5 flex flex-col rounded-2xl bg-[rgba(10,6,14,0.96)] border border-white/10 shadow-2xl overflow-hidden" style={{ width: PANEL_W - 30 }}>
                <button type="button" onClick={onClose} aria-label="Fechar modelo 3D (Esc)"
                    className="absolute z-10 top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-gray-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10">
                    <X size={17} />
                </button>
                <div className="flex-1 overflow-y-auto px-5 pt-5 pb-6" style={FADE_BOTTOM}>
                    <StepText data={data} step={step} last={LAST} />
                    <Sliders ctlRef={ctlRef} onTouch={onTouch} />
                    <Legend />
                </div>
                <div className="shrink-0 px-5 pb-4 pt-2.5 border-t border-white/10">
                    <StructureCard />
                </div>
            </aside>

            <footer className="absolute bottom-6 flex justify-end pointer-events-none" style={{ right: PANEL_W + 24, left: 410 }}>
                <Timeline steps={STEPS} step={step} accent={ACCENT} playing={auto} onGo={goManual} onPlay={onPlay} />
            </footer>
        </motion.div>
    );
};

export default VasoHipoxiaModal;
