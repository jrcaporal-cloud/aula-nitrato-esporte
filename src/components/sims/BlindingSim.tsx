import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { BLINDING_STEPS } from './ato5/blindingContent';
import { BangScale } from './ato5/BlindingVisuals';
import { UrnVsChance } from './ato5/BlindingChance';
import { BeeturiaGrids } from './ato5/BlindingBeeturia';
import { ReportSeals } from './ato5/BlindingReport';
import { SimFrame, StoryLayout, Tag } from './ato5/ui';

/**
 * "Dá para Cegar?" (Ato V). O índice de Bang, a urna de 3 acertos em 10 contra o acaso, a beterrúria
 * que aparece nos dois braços e a diferença entre medir o cego e reportá-lo.
 */

const VISUALS = [BangScale, UrnVsChance, BeeturiaGrids, ReportSeals];
const TONES = [C.no, C.no, C.nitrate, C.nitrite];

const BlindingSim = () => {
    const { step, setStep } = useSlideSteps(BLINDING_STEPS.length);
    const plan = BLINDING_STEPS[step];
    const Visual = VISUALS[step];
    const chip = step === 1 ? 'cálculo binomial' : step === 2 ? 'ilustração: 4 de 100 aplicado ao cruzado' : null;

    return (
        <SimFrame tabs={BLINDING_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato5-blind-tab"
            chips={chip ? <Tag color={C.nitrite}>{chip}</Tag> : null}>
            <StoryLayout step={step} headline={plan.headline} text={plan.text} source={plan.source} takeaway={plan.takeaway} tone={TONES[step]}>
                <Visual />
            </StoryLayout>
        </SimFrame>
    );
};

export default BlindingSim;
