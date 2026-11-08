import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { BigStat, GH, GW, GraphicPanel, IllustrativeChip, SidePanel, SimFrame } from './ato2b/ui';
import { PcrScene } from './ato2b/PcrScenes';
import { PCR_STEPS } from './ato2b/pcr.content';

/**
 * Slide 28 · "Menos PCr para a Mesma Força". Sarcômero contraindo contra a mesma carga e o espectro de ³¹P embaixo:
 * ΔPCr 8,1 × 5,2 mM, turnover de ATP 296 → 192 µM/s, pH inalterado; carga alta: componente lento 209 → 100 mL/min
 * e tempo até a exaustão 586 → 734 s (Bailey 2010). A contração ficou mais barata, não chegou mais oxigênio.
 */

const PcrCostSim = () => {
    const { step, setStep } = useSlideSteps(PCR_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = PCR_STEPS[step];

    return (
        <SimFrame tabs={PCR_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato2b-pcr-tab"
            chips={<IllustrativeChip text="esquema · números são dados" />}>
            <GraphicPanel hint3d>
                <svg viewBox={`0 0 ${GW} ${GH}`} width="100%" height="100%" className="block" role="img" aria-label={plan.headline}>
                    <PcrScene reduce={reduce} step={step} />
                </svg>
            </GraphicPanel>
            <SidePanel stepKey={step} headline={plan.headline} text={plan.text} source={plan.source} facts={plan.facts}>
                {step === 1 && <BigStat value="8,1 → 5,2" label="mM de PCr gasta (placebo → nitrato)" color={C.nitrateSoft} keyFact />}
                {step === 2 && <BigStat value="−35%" label="turnover na carga baixa (cálculo: 296 → 192)" color={C.nitrateSoft} keyFact />}
                {step === 4 && <BigStat value="586 → 734 s" label="tempo até a exaustão (+25%)" color={C.noSoft} size={30} keyFact />}
            </SidePanel>
        </SimFrame>
    );
};

export default PcrCostSim;
