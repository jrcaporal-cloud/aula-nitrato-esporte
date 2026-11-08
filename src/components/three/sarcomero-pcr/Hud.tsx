import type { ClockRef } from './clock';
import { COL } from './colors';
import type { HudKind } from './content';
import { HUMAN_PANELS, MOUSE_PANELS } from './curves';
import type { DrawFn } from './draw/common';
import { makeFreqDraw } from './draw/freq';
import { drawScatter } from './draw/scatter';
import { drawSpectrum } from './draw/spectrum';
import { drawVo2 } from './draw/vo2';
import { LiveCanvas } from './LiveCanvas';
import { NumbersCard } from './NumbersCard';
import { SARCO_STEPS } from './steps';

/*
 * Faixa de HUD sob o 3D: um gráfico vivo (muda por etapa) e o cartão de números do dossiê.
 * Formas dos gráficos são esquemáticas; o chip diz isso.
 */

export const HUD_H = 252;

const mouseDraw = makeFreqDraw({ panels: MOUSE_PANELS, scale: 'linear', fMin: 0, fMax: 150, ticks: [50, 100, 150], sweep: false });
const humanDraw = makeFreqDraw({ panels: HUMAN_PANELS, scale: 'log', fMin: 1, fMax: 100, ticks: [1, 10, 100], sweep: true });

interface ChartSpec { title: string; draw: DrawFn; note: string; legend: boolean }

const CHARTS: Readonly<Record<HudKind, ChartSpec>> = {
    spectrum: { title: 'Espectro de ³¹P-MRS ao vivo', draw: drawSpectrum, note: 'tempo comprimido · forma ilustrativa', legend: true },
    vo2: { title: 'VO₂ até a exaustão', draw: drawVo2, note: 'tempo comprimido · forma ilustrativa', legend: true },
    mouse: { title: 'Força × frequência · camundongo', draw: mouseDraw, note: 'curvas esquemáticas', legend: true },
    scatter: { title: 'Ganho de fluxo × % de fibras tipo II', draw: drawScatter, note: 'pontos ilustrativos · r do dossiê', legend: false },
    human: { title: 'Torque × frequência · humanos', draw: humanDraw, note: 'desvio esquemático · topo igual', legend: true },
};

const Dot = ({ color, text }: { color: string; text: string }) => (
    <span className="inline-flex items-center gap-1.5 text-[14px] text-gray-200">
        <span className="w-4 h-[3px] rounded-full" style={{ background: color }} />{text}
    </span>
);

export const Hud = ({ step, clockRef }: { step: number; clockRef: ClockRef }) => {
    const spec = CHARTS[SARCO_STEPS[step].hud];
    return (
        <div className="flex gap-3 px-3 pb-3" style={{ height: HUD_H }}>
            <div className="flex-1 min-w-0 flex flex-col rounded-2xl border border-white/10 px-4 pt-2.5 pb-1" style={{ background: 'rgba(10,6,14,0.74)' }}>
                <div className="flex items-center gap-4">
                    <h3 className="text-[16px] font-semibold text-white whitespace-nowrap">{spec.title}</h3>
                    {spec.legend && (
                        <span className="flex items-center gap-3 ml-auto">
                            <Dot color={COL.placebo} text="placebo" />
                            <Dot color={COL.nitrate} text="nitrato" />
                        </span>
                    )}
                </div>
                <p className="text-[14px] font-mono text-amber-200/90 whitespace-nowrap leading-tight mb-0.5">{spec.note}</p>
                <div className="flex-1 min-h-0">
                    <LiveCanvas key={SARCO_STEPS[step].hud} clockRef={clockRef} draw={spec.draw} label={spec.title} />
                </div>
            </div>
            <NumbersCard step={step} clockRef={clockRef} />
        </div>
    );
};
