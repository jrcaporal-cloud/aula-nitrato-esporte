import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { BigStat, GH, GW, GraphicPanel, IllustrativeChip, SidePanel, SimFrame } from './ato2b/ui';
import { FIBER_STEPS } from './ato2b/fiber.content';
import { CadenceScene, MouseFibersScene, Po2Scene } from './ato2b/FiberScenes';
import { HumanCurvesScene } from './ato2b/FiberCurves';
import { RatLimbScene } from './ato2b/RatLimb';

/**
 * Slide 29 · "A Fibra Rápida". O fio da fibra tipo II em cinco passos: camundongo (Hernández 2012), 28 músculos de rato
 * com r = 0,74 (Ferguson 2013), PO₂ microvascular +43% (Ferguson 2015), ciclismo a 35 × 115 rpm (Bailey 2015) e a relação
 * torque-frequência humana em sentidos opostos (Zoughaib 2026). Só os valores citados são dados; o resto é esquema.
 */

const FiberTypeSim = () => {
    const { step, setStep } = useSlideSteps(FIBER_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = FIBER_STEPS[step];

    return (
        <SimFrame tabs={FIBER_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato2b-fiber-tab"
            chips={<IllustrativeChip text="esquemas · só os números citados são dados" />}>
            <GraphicPanel hint3d>
                <svg key={step} viewBox={`0 0 ${GW} ${GH}`} width="100%" height="100%" className="block" role="img" aria-label={plan.headline}>
                    {step === 0 && <MouseFibersScene reduce={reduce} />}
                    {step === 1 && <RatLimbScene reduce={reduce} />}
                    {step === 2 && <Po2Scene reduce={reduce} />}
                    {step === 3 && <CadenceScene reduce={reduce} />}
                    {step === 4 && <HumanCurvesScene reduce={reduce} />}
                </svg>
            </GraphicPanel>
            <SidePanel stepKey={step} headline={plan.headline} text={plan.text} source={plan.source} facts={plan.facts}>
                {step === 0 && <BigStat value="~35%" label="mais rápida a ~100 Hz, só na fibra rápida" color={C.noSoft} />}
                {step === 1 && <BigStat value="r = 0,74" label="fluxo × % de fibra IIb + d/x, 28 músculos" color={C.text} size={30} />}
                {step === 2 && <BigStat value="14 → 19" label="mmHg de PO₂ no gastrocnêmio" color={C.nitrateSoft} size={30} />}
                {step === 3 && <BigStat value="297 → 362 s" label="tempo limite a 115 rpm (+22%)" color={C.noSoft} size={28} />}
            </SidePanel>
        </SimFrame>
    );
};

export default FiberTypeSim;
