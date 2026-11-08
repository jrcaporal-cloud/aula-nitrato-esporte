import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { BigStat, GH, GW, GraphicPanel, IllustrativeChip, SidePanel, SimFrame } from './ato2b/ui';
import { BubbleScene } from './ato2b/OralBubbles';
import { ThresholdChart, WashoutTimeline, WomenList } from './ato2b/OralCharts';
import { ORAL_STEPS } from './ato2b/oral.content';

/**
 * Slide 32 · "A Boca de Cada Um". Bactérias da língua antes e depois de 10 dias de nitrato (Neisseria +351%, Rothia +127%,
 * Prevotella −60%), o limiar funcional (Burleigh 2018), mulheres só em direção (Kapil 2018) e a pergunta do washout.
 */

const OralMicrobiomeSim = () => {
    const { step, setStep } = useSlideSteps(ORAL_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = ORAL_STEPS[step];

    return (
        <SimFrame tabs={ORAL_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato2b-oral-tab"
            chips={<IllustrativeChip text="tamanhos ilustrativos · variações são dados" />}>
            <GraphicPanel>
                <svg key={step <= 2 ? 0 : step} viewBox={`0 0 ${GW} ${GH}`} width="100%" height="100%" className="block" role="img" aria-label={plan.headline}>
                    {step <= 2 && <BubbleScene reduce={reduce} step={step} />}
                    {step === 3 && <ThresholdChart reduce={reduce} />}
                    {step === 4 && <WomenList reduce={reduce} />}
                    {step === 5 && <WashoutTimeline reduce={reduce} />}
                </svg>
            </GraphicPanel>
            <SidePanel stepKey={step} headline={plan.headline} text={plan.text} source={plan.source} facts={plan.facts}
                color={step === 5 ? C.nitrite : C.noSoft}>
                {step === 1 && <BigStat value="+351%" label="Neisseria em 10 dias" color={C.noSoft} keyFact />}
                {step === 3 && <BigStat value="limiar" label="acima dele, mais bactérias não dão mais NO" color={C.text} size={28} />}
            </SidePanel>
        </SimFrame>
    );
};

export default OralMicrobiomeSim;
