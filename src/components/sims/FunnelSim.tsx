import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { FUNNEL_STEPS, LAYER_OPTIONS } from './ato5/funnelContent';
import { FunnelPlot, QualityPanel } from './ato5/FunnelVisuals';
import { BigStat, Segmented, SimFrame, StoryLayout, Tag } from './ato5/ui';

/**
 * "O Funil que Zera o Efeito" (Ato V). Doze pontos ilustrativos reproduzem o resumo de Xie 2026 em
 * atletas: funil assimétrico, Egger (z 3,03; p 0,01), trim-and-fill com 5 fantasmas e a qualidade (RoB 2, GRADE).
 */

const TONES = [C.no, C.nitrite, C.nitrite, C.risk, C.risk];

interface LayerOverride { step: number; layer: number }

const FunnelSim = () => {
    const { step, setStep } = useSlideSteps(FUNNEL_STEPS.length);
    const plan = FUNNEL_STEPS[step];
    const [override, setOverride] = useState<LayerOverride | null>(null);
    const layer = override?.step === step ? override.layer : step;
    const plot = step <= 3;

    return (
        <SimFrame tabs={FUNNEL_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato5-funnel-tab"
            chips={plot ? <Tag color={C.nitrite}>pontos ilustrativos · agregados do artigo</Tag> : null}>
            <StoryLayout step={step} visualKey={plot ? 'plot' : step} headline={plan.headline} text={plan.text} source={plan.source}
                takeaway={plan.takeaway} tone={TONES[step]}
                controls={plot ? <Segmented label="camada" options={LAYER_OPTIONS} value={layer} onChange={v => setOverride({ step, layer: v })} /> : undefined}
                aside={step === 2 ? (
                    <div className="flex gap-5 pt-1">
                        <BigStat value="3,03" label="z de Egger, potência de pico (p = 0,01)" color={C.nitrite} size={32} />
                        <BigStat value="2,33" label="z de Egger, potência média (p = 0,03)" color={C.nitriteSoft} size={32} />
                    </div>
                ) : step === 3 ? (
                    <div className="flex gap-5 pt-1">
                        <BigStat value="5" label="estudos imputados" color={C.nitrite} size={32} />
                        <BigStat value="0,13 → ≈ 0" label="efeito agrupado (g)" color={C.risk} size={32} />
                    </div>
                ) : undefined}>
                {plot ? <FunnelPlot layer={layer} /> : <QualityPanel />}
            </StoryLayout>
        </SimFrame>
    );
};

export default FunnelSim;
