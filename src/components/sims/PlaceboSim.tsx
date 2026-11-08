import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { PLACEBO_STEPS } from './ato5/placeboContent';
import { SameJuice, ThreeArms } from './ato5/PlaceboVisuals';
import { PlaceboTimeline } from './ato5/PlaceboHistory';
import { JuiceVsSalt } from './ato5/PlaceboJuiceSalt';
import { ResinColumn } from './ato5/ResinColumn';
import { StoryLayout, SimFrame, Tag, BigStat } from './ato5/ui';

/**
 * "O Melhor Placebo da Nutrição Esportiva" (Ato V). A resina que troca o ânion, o suco igual ao
 * original, o desenho de três braços, a autocorreção do campo e a pergunta suco × sal.
 */

const VISUALS = [ResinColumn, SameJuice, ThreeArms, PlaceboTimeline, JuiceVsSalt];
const TONES = [C.o2, C.no, C.nitrate, C.no, C.nitrite];

const PlaceboSim = () => {
    const { step, setStep } = useSlideSteps(PLACEBO_STEPS.length);
    const plan = PLACEBO_STEPS[step];
    const Visual = VISUALS[step];
    const last = step === PLACEBO_STEPS.length - 1;

    return (
        <SimFrame tabs={PLACEBO_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato5-placebo-tab"
            chips={last ? <Tag color={C.nitrite}>não resolvido</Tag> : step === 0 ? <Tag color={C.nitrite}>estudo em diabéticos: só o placebo</Tag> : null}>
            <StoryLayout step={step} headline={plan.headline} text={plan.text} source={plan.source} takeaway={plan.takeaway} tone={TONES[step]}
                aside={step === 0 ? (
                    <div className="flex gap-6 pt-1">
                        <BigStat value="7,5" label="mmol de nitrato por 250 mL, no suco" color={C.nitrate} size={34} count keyFact />
                        <BigStat value="0,002" label="mmol por 250 mL, no placebo" color="#E5E7EB" size={34} count />
                    </div>
                ) : undefined}>
                <Visual />
            </StoryLayout>
        </SimFrame>
    );
};

export default PlaceboSim;
