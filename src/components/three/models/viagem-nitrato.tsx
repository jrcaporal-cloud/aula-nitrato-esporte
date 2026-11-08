import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { LocateFixed, X } from 'lucide-react';
import type { Modal3DProps } from '../registry';
import type { TimeState } from '../shared/Label3D';
import { LoadingVeil, StepTimeline, StructureCard } from '../viagem-nitrato/Chrome';
import { LAST_STEP, STEPS } from '../viagem-nitrato/content';
import { Hud } from '../viagem-nitrato/Hud';
import { Legend } from '../viagem-nitrato/Legend';
import { FADE_STYLE, useScrollFade } from '../viagem-nitrato/useScrollFade';
import { ChxSwitch } from '../viagem-nitrato/Panel';
import { Scene } from '../viagem-nitrato/Scene';
import { useSelection } from '../viagem-nitrato/selection';
import { makeState, type VnState } from '../viagem-nitrato/state';
import { useVnKeys } from '../viagem-nitrato/useKeys';

/*
 * Modelo 3D "A viagem do nitrato" (slides 21 e 22): do copo à urina, em 8 etapas, com câmera dirigida,
 * rótulos 3D, clique para fixar uma estrutura, relógio da dose e o interruptor do bochecho.
 */

/** Tempo de leitura depois que a câmera assenta, no modo ▶ (a varredura do relógio leva ~6,5 s). */
const DWELL_MS = 8200;
const PANEL_W = 412;
const VIGNETTE = 'radial-gradient(ellipse 75% 70% at 50% 46%, transparent 52%, rgba(7,5,11,0.55) 82%, rgba(7,5,11,0.9) 100%)';
const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ViagemNitrato = ({ onClose }: Modal3DProps) => {
    const [step, setStepLocal] = useState(0);
    const [settled, setSettled] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [ready, setReady] = useState(false);
    const [recenterKey, setRecenterKey] = useState(0);
    const [chx, setChx] = useState(false);
    const [reduced] = useState(prefersReduced);
    const timeRef = useRef<TimeState>({ t: 0 });
    const stateRef = useRef<VnState>(makeState());
    /** Etapa atual, atualizada na hora: várias teclas no mesmo quadro somam em vez de repetir o alvo. */
    const stepRef = useRef(0);
    const scroller = useRef<HTMLDivElement>(null);
    const moreBelow = useScrollFade(scroller, `${step}-${chx}`);
    const pin = useSelection(s => s.pin);
    const hovering = useSelection(s => s.hoverId !== null);
    const release = useSelection(s => s.release);

    useEffect(() => { stateRef.current.in.chx = chx; }, [chx]);

    // trocar de etapa solta a fixação e invalida o "assentou" até a câmera chegar à etapa nova
    const go = useCallback((target: number) => {
        const next = Math.min(Math.max(target, 0), LAST_STEP);
        if (next === stepRef.current) return;
        stepRef.current = next;
        release();
        setSettled(-1);
        setStepLocal(next);
    }, [release]);
    const goManual = useCallback((target: number) => { setPlaying(false); go(target); }, [go]);
    const onSettled = useCallback((s: number) => setSettled(s), []);
    const onReady = useCallback(() => setReady(true), []);
    const recenter = useCallback(() => { release(); setRecenterKey(k => k + 1); }, [release]);
    const toggleChx = useCallback(() => setChx(v => !v), []);

    // a etapa nova começa pelo topo do texto, não de onde a rolagem ficou
    useEffect(() => { scroller.current?.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); }, [step, reduced]);
    // ligar o bochecho rola o painel até os efeitos dele (em telas baixas eles ficariam fora da vista)
    useEffect(() => {
        const el = scroller.current;
        if (!chx || !el) return;
        const t = window.setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: reduced ? 'auto' : 'smooth' }), 60);
        return () => window.clearTimeout(t);
    }, [chx, reduced]);
    useEffect(() => {
        useSelection.getState().reset();
        return () => useSelection.getState().reset();
    }, []);

    // ▶: espera a câmera assentar, dá tempo de leitura e avança; para na última.
    useEffect(() => {
        if (!playing || settled !== step) return;
        const t = window.setTimeout(() => {
            if (step >= LAST_STEP) setPlaying(false);
            else go(step + 1);
        }, step >= LAST_STEP ? 0 : DWELL_MS);
        return () => window.clearTimeout(t);
    }, [playing, settled, step, go]);

    const togglePlay = useCallback(() => {
        setPlaying(p => {
            if (!p && stepRef.current === LAST_STEP) go(0);
            return !p;
        });
    }, [go]);

    useVnKeys({
        next: () => goManual(stepRef.current + 1),
        prev: () => goManual(stepRef.current - 1),
        togglePlay,
        recenter,
        toggleChx,
        escape: () => { if (useSelection.getState().pin) release(); else onClose(); },
        close: onClose,
    });

    // depois de mexer num controle, o foco sai dele: o passador (setas) volta a trocar etapas
    const dropFocus = useCallback(() => {
        const el = document.activeElement;
        if (el instanceof HTMLElement && el !== document.body) window.setTimeout(() => el.blur(), 0);
    }, []);

    const data = STEPS[step];
    return (
        <motion.div
            role="dialog" aria-label="A viagem do nitrato em 3D"
            className="absolute inset-0 z-50 bg-[#07050B] font-body"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
            onPointerUp={dropFocus}
        >
            <div className="absolute top-0 bottom-0 left-0" style={{ right: PANEL_W }}>
                <Canvas
                    dpr={[1, 1.75]}
                    camera={{ position: [...STEPS[0].pose.pos], fov: 40, near: 0.1, far: 400 }}
                    gl={{ antialias: true, powerPreference: 'high-performance' }}
                    resize={{ offsetSize: true }}
                    className={`${pin || hovering ? 'cursor-pointer' : 'cursor-grab'} active:cursor-grabbing`}
                >
                    <Suspense fallback={null}>
                        <Scene
                            step={step} settled={settled} reduced={reduced} pin={pin} recenterKey={recenterKey}
                            onSettled={onSettled} onReady={onReady} stateRef={stateRef} timeRef={timeRef}
                        />
                    </Suspense>
                </Canvas>
                {/* o relógio entra na etapa 2: na 1 (t = 0) a câmera mostra o corpo inteiro e precisa do espaço */}
                <div className="absolute z-[8] left-4 right-4 bottom-[88px] pointer-events-none transition-opacity duration-500" style={{ opacity: step > 0 ? 1 : 0 }}>
                    <Hud stateRef={stateRef} />
                </div>
                <div aria-hidden className="absolute inset-0 z-[5] pointer-events-none" style={{ background: VIGNETTE }} />
                <button
                    type="button" onClick={recenter} aria-label="Recentrar a câmera na pose da etapa (R)"
                    className="absolute z-[46] top-6 right-6 flex items-center gap-2 pl-3.5 pr-4 h-10 rounded-full text-[14px] font-semibold text-gray-100 hover:text-white bg-black/60 hover:bg-white/15 border border-white/15 backdrop-blur-xl"
                >
                    <LocateFixed size={16} aria-hidden /> Recentrar
                </button>
                <AnimatePresence>{!ready && <LoadingVeil reduced={reduced} />}</AnimatePresence>
            </div>

            <header className="absolute z-[45] top-0 left-0 px-7 pt-5 pb-6 pointer-events-none bg-gradient-to-b from-[#07050B]/90 to-transparent" style={{ right: PANEL_W + 150 }}>
                <p className="text-[14px] font-mono uppercase tracking-[0.24em] text-pink-300/90">Modelo 3D · nitrato inorgânico</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <h2 className="font-display text-[26px] font-semibold text-white leading-tight">A viagem do nitrato</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[14px] font-mono tracking-wide text-amber-200 bg-amber-400/10 border border-amber-300/30">
                        representação esquemática · escalas fora de proporção
                    </span>
                </div>
                {/* em telas baixas (≤ 820 px) a legenda cobriria os rótulos 3D do alto: some */}
                <div className="mt-2.5 [@media(max-height:820px)]:hidden"><Legend step={step} chx={chx} /></div>
            </header>

            <aside className="absolute right-5 top-5 bottom-5 flex flex-col rounded-2xl bg-[rgba(12,7,18,0.88)] border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden" style={{ width: PANEL_W - 30 }}>
                <div className="flex items-center gap-3 px-5 pt-4 pb-3">
                    <span className="inline-block px-3 py-1 text-[14px] font-mono tracking-widest text-pink-200 bg-pink-500/15 border border-pink-400/25 rounded-full">
                        {data.badge}
                    </span>
                    <span className="flex-1 text-[14px] font-mono text-gray-400" aria-label={`Etapa ${step + 1} de ${STEPS.length}`}>etapa {step + 1}/{STEPS.length}</span>
                    <button type="button" onClick={onClose} aria-label="Fechar modelo 3D (Esc)"
                        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-gray-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10">
                        <X size={17} />
                    </button>
                </div>
                <div ref={scroller} className="flex-1 min-h-0 overflow-y-auto px-6 pb-5 border-t border-white/10 pt-3" style={moreBelow ? FADE_STYLE : undefined}>
                    {/* sem AnimatePresence: trocar de etapa depressa deixaria o texto antigo preso na saída */}
                    <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        <h3 className="font-display text-[25px] font-semibold text-white leading-tight mb-2">{data.title}</h3>
                        <p className="text-[16px] text-gray-200 leading-[1.5]">{data.text}</p>
                        <p className="mt-2 text-[14px] font-mono text-gray-400">Fontes: {data.sources}</p>
                    </motion.div>
                    <ChxSwitch on={chx} onChange={setChx} />
                </div>
                <div className="shrink-0 px-5 pb-4 pt-2.5 border-t border-white/10">
                    <StructureCard />
                </div>
            </aside>

            <footer className="absolute bottom-6 left-0 flex justify-center pointer-events-none" style={{ right: PANEL_W }}>
                <StepTimeline step={step} playing={playing} onGo={goManual} onTogglePlay={togglePlay} />
            </footer>
        </motion.div>
    );
};

export default ViagemNitrato;
