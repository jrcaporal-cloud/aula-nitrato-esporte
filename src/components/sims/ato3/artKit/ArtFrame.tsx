import type { ReactNode } from 'react';
import { Reveal } from '../../kit/rhythm';
import { StepTabs } from '../../kit/ui';

/** Altura total da caixa dos simuladores com arte grande (teto do palco: 516 px). */
export const SIM_H = 500;
/** Área da arte (abaixo da linha de abas): 446 px menos as bordas. O viewBox das cenas usa essas medidas. */
export const ART_W = 1100;
export const ART_H = 444;

interface ArtFrameProps {
    tabs: readonly string[];
    step: number;
    setStep: (step: number) => void;
    layoutId: string;
    /** Selos à direita das abas. */
    chips?: ReactNode;
    /** Frase do passo, sobre a base da arte (fade a cada passo). */
    caption: ReactNode;
    children: ReactNode;
}

/**
 * Moldura de arte grande: abas do passador, painel sem padding (a cena ocupa tudo) e a frase do passo
 * numa faixa escura sobre a base. As cenas desenham em ART_W × ART_H e deixam os ~58 px de baixo para a faixa.
 */
export const ArtFrame = ({ tabs, step, setStep, layoutId, chips, caption, children }: ArtFrameProps) => (
    <div className="not-prose w-full font-body text-white select-none flex flex-col gap-2" style={{ height: SIM_H }}>
        <div className="flex items-center justify-between gap-3" style={{ height: 46 }}>
            <StepTabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
            {chips && <div className="flex items-center gap-2">{chips}</div>}
        </div>
        <div className="relative flex-1 min-h-0 overflow-hidden rounded-2xl border border-white/10" style={{ background: '#08050D' }}>
            {children}
            <div className="absolute inset-x-0 bottom-0 px-6 pb-3 pt-6 text-[16.5px] font-medium leading-snug text-white"
                style={{ background: 'linear-gradient(to top, rgba(7,5,11,0.96) 0%, rgba(7,5,11,0.9) 62%, rgba(7,5,11,0) 100%)' }}>
                <Reveal key={step} order={2}><p>{caption}</p></Reveal>
            </div>
        </div>
    </div>
);

/** Palco SVG das cenas: preenche o painel, recorta o que passa das bordas e mantém a escala do viewBox. */
export const ArtSvg = ({ label, children, h = ART_H }: { label: string; children: ReactNode; h?: number }) => (
    <svg viewBox={`0 0 ${ART_W} ${h}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full"
        role="img" aria-label={label}>
        {children}
    </svg>
);
