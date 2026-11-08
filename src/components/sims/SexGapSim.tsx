import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { SEX_STEPS } from './ato5/sexContent';
import { DatasetSquares, DesignedTrial, HelenaCard, ParticipantPictogram, WomenInterval } from './ato5/SexVisuals';
import { SimFrame, StoryLayout, Tag } from './ato5/ui';

/**
 * "Elas Faltam" (Ato V). O pictograma 1.179 × 156, os conjuntos só de homens (79%), o nulo de seis
 * conjuntos "provavelmente espúrio", o ensaio desenhado para as duas e a Helena (caso fictício).
 */

const VISUALS = [ParticipantPictogram, DatasetSquares, WomenInterval, DesignedTrial, HelenaCard];
const TONES = [C.o2, C.o2, C.nitrate, C.no, C.nitrateSoft];

const SexGapSim = () => {
    const { step, setStep } = useSlideSteps(SEX_STEPS.length);
    const plan = SEX_STEPS[step];
    const Visual = VISUALS[step];

    return (
        <SimFrame tabs={SEX_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato5-sex-tab"
            chips={step === 4 ? <Tag color={C.nitrite}>caso fictício</Tag> : step === 0 ? <Tag color={C.nitrite}>pictograma: cálculo</Tag> : null}>
            <StoryLayout step={step} headline={plan.headline} text={plan.text} source={plan.source} takeaway={plan.takeaway} tone={TONES[step]}>
                <Visual />
            </StoryLayout>
        </SimFrame>
    );
};

export default SexGapSim;
