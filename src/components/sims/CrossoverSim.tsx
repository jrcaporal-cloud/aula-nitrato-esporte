import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { CROSSOVER_STEPS } from './ato5/crossoverContent';
import { CrossoverVisual } from './ato5/CrossoverVisuals';
import { SimFrame, StoryLayout, Tag } from './ato5/ui';

/**
 * "O Cruzado e seus Efeitos" (Ato V). Cronograma de um ensaio cruzado com familiarização, ordem
 * sorteada e washout: o ganho de graça da 2ª visita, o efeito de ordem e o efeito de ordem biológico.
 */

const TONES = [C.o2, C.nitrite, C.nitrate, C.bacteria, C.no];

const CrossoverSim = () => {
    const { step, setStep } = useSlideSteps(CROSSOVER_STEPS.length);
    const plan = CROSSOVER_STEPS[step];

    return (
        <SimFrame tabs={CROSSOVER_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato5-xover-tab"
            chips={step === 2 ? <Tag color={C.nitrite}>valores ilustrativos</Tag> : null}>
            <StoryLayout step={step} visualKey="xo" headline={plan.headline} text={plan.text} source={plan.source} takeaway={plan.takeaway} tone={TONES[step]}>
                <CrossoverVisual step={step} focus={plan.focus} />
            </StoryLayout>
        </SimFrame>
    );
};

export default CrossoverSim;
