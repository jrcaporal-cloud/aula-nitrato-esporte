import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { CUT_OPTIONS, META_STEPS, type CutId } from './ato5/metaContent';
import { AllTogether, DiamondRows } from './ato5/MetaVisuals';
import { Segmented, SimFrame, StoryLayout, Tag } from './ato5/ui';

/**
 * "Mesmos Dados, Vereditos Opostos" (Ato V). Os diamantes de cinco meta-análises na mesma escala:
 * o recorte (TTE, contrarrelógio, agrupado, atletas) move o diamante sem mudar nenhum dado.
 */

interface CutOverride { step: number; cut: CutId }

const MetaDisagreeSim = () => {
    const { step, setStep } = useSlideSteps(META_STEPS.length);
    const plan = META_STEPS[step];
    const [override, setOverride] = useState<CutOverride | null>(null);
    const together = plan.cut === 'every';
    const cut: CutId = override?.step === step ? override.cut : plan.cut === 'every' ? 'tte' : plan.cut;
    const title = META_STEPS.find(s => s.cut === cut)?.title ?? '';

    return (
        <SimFrame tabs={META_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato5-meta-tab"
            chips={<Tag color={C.nitrite}>mesma escala · SMD</Tag>}>
            <StoryLayout step={step} visualKey={together ? 'all' : 'rows'} headline={plan.headline} text={plan.text} source={plan.source}
                takeaway={plan.takeaway} tone={together ? C.risk : C.nitrite}
                controls={together ? undefined : <Segmented label="recorte" options={CUT_OPTIONS} value={cut} onChange={v => setOverride({ step, cut: v })} />}>
                {together ? <AllTogether /> : <DiamondRows cut={cut} title={title} />}
            </StoryLayout>
        </SimFrame>
    );
};

export default MetaDisagreeSim;
