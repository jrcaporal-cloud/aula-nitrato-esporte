import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { IllustrativeChip } from './ato2b/ui';
import { DoseArt, PathwaysArt } from './ato2b/art/ArginineArt';
import { Stat, WideFrame } from './ato2b/art/WideFrame';
import { ARGININE_SHORT } from './ato2b/art/copy';
import { ARGININE_STEPS } from './ato2b/arginine.content';

/**
 * Slide 33 · "A Arginina não Resolve". 0,43 g/dia de nitrato por 3 dias → −5,4% de VO₂ (Larsen 2007) contra
 * 20,5 g/dia de L-arginina → nada, nem no nitrato plasmático (Bescós 2009). Vias opostas em relação ao O₂,
 * que aparece como gradiente vertical: quando cai, a via da NOS apaga e a do nitrito acende.
 */

const ArginineSim = () => {
    const { step, setStep } = useSlideSteps(ARGININE_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = ARGININE_STEPS[step];
    const mirror = step === 1 || step === 2;

    return (
        <WideFrame tabs={ARGININE_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato2b-arginine-tab"
            chips={<IllustrativeChip text="esquema · escalas próprias por eixo" />} label={plan.headline}
            glow={step === 3 ? C.hypoxia : undefined}
            scene={mirror ? <DoseArt reduce={reduce} step={step} /> : <PathwaysArt reduce={reduce} step={step} />}
            headline={plan.headline} text={ARGININE_SHORT[step]} color={step === 3 ? C.hypoxia : C.noSoft}
            stat={step === 1 ? <Stat value="0,43 × 20,5" label="g/dia de nitrato × L-arginina" />
                : step === 2 ? <Stat value="−5,4% × 0%" label="VO₂ submáximo: nitrato × arginina" color={C.nitrateSoft} /> : undefined}
            facts={plan.facts} source={plan.source} />
    );
};

export default ArginineSim;
