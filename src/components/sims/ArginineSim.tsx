import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { BigStat, GH, GW, GraphicPanel, IllustrativeChip, SidePanel, SimFrame } from './ato2b/ui';
import { DoseEffect, Pathways } from './ato2b/ArginineScenes';
import { ARGININE_STEPS } from './ato2b/arginine.content';

/**
 * Slide 33 · "A Arginina não Resolve". 0,43 g/dia de nitrato por 3 dias → −5,4% de VO₂ (Larsen 2007) contra
 * 20,5 g/dia de L-arginina → nada, nem no nitrato plasmático (Bescós 2009). Vias opostas em relação ao O₂.
 */

const ArginineSim = () => {
    const { step, setStep } = useSlideSteps(ARGININE_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = ARGININE_STEPS[step];
    const props = { reduce, step };
    const mirror = step === 1 || step === 2;

    return (
        <SimFrame tabs={ARGININE_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato2b-arginine-tab"
            chips={<IllustrativeChip text="esquema · escalas próprias por eixo" />}>
            <GraphicPanel>
                <svg viewBox={`0 0 ${GW} ${GH}`} width="100%" height="100%" className="block" role="img" aria-label={plan.headline}>
                    {mirror ? <DoseEffect {...props} /> : <Pathways {...props} />}
                </svg>
            </GraphicPanel>
            <SidePanel stepKey={step} headline={plan.headline} text={plan.text} source={plan.source} facts={plan.facts}
                color={step === 3 ? C.hypoxia : C.noSoft}>
                {step === 1 && <BigStat value="0,43 × 20,5" label="g/dia de nitrato × L-arginina" color={C.text} size={30} />}
                {step === 2 && <BigStat value="−5,4% × 0%" label="VO₂ submáximo: nitrato × arginina" color={C.nitrateSoft} size={30} />}
            </SidePanel>
        </SimFrame>
    );
};

export default ArginineSim;
