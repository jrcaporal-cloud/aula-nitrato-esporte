import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { BigStat, GH, GW, GraphicPanel, IllustrativeChip, SidePanel, SimFrame } from './ato2b/ui';
import { BodyScene, GaugeScene, HypothesisScene, VerdictScene } from './ato2b/MitoScenes';
import { MITO_STEPS } from './ato2b/mito.content';

/**
 * Slide 27 · "A Hipótese que Não Sobreviveu". 2011: ↑P/O e ↓ANT (só direção, sem valores de P/O);
 * 2016: VO₂ do corpo −3% igual, mas todos os medidores mitocondriais parados e só o H₂O₂ sobe.
 * O fenótipo replicou, o mecanismo não — e o olhar se desloca para o sarcômero.
 */

const MitoVerdictSim = () => {
    const { step, setStep } = useSlideSteps(MITO_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = MITO_STEPS[step];
    const scene = step <= 1 ? 0 : step - 1;
    const props = { reduce, step };

    return (
        <SimFrame tabs={MITO_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato2b-mito-tab"
            chips={<IllustrativeChip text="esquema · sem valores de P/O" />}>
            <GraphicPanel>
                <svg key={scene} viewBox={`0 0 ${GW} ${GH}`} width="100%" height="100%" className="block" role="img" aria-label={plan.headline}>
                    {scene === 0 && <HypothesisScene {...props} />}
                    {scene === 1 && <BodyScene {...props} />}
                    {scene === 2 && <GaugeScene {...props} />}
                    {scene === 3 && <VerdictScene {...props} />}
                </svg>
            </GraphicPanel>
            <SidePanel stepKey={step} headline={plan.headline} text={plan.text} source={plan.source} facts={plan.facts}
                color={step >= 2 ? C.nitrateSoft : C.noSoft}>
                {step === 2 && <BigStat value="−3%" label="VO₂ do corpo todo (p < 0,05)" color={C.nitrate} />}
                {step === 3 && <BigStat value="H₂O₂ ↑" label="única medida que mudou" color={C.hypoxia} size={30} />}
            </SidePanel>
        </SimFrame>
    );
};

export default MitoVerdictSim;
