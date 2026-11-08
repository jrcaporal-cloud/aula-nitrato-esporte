import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { IllustrativeChip } from './ato2b/ui';
import { MouseHumanArt } from './ato2b/art/MouseArt';
import { Stat, WideFrame } from './ato2b/art/WideFrame';
import { MOUSE_SHORT } from './ato2b/art/copy';
import { MOUSE_STEPS } from './ato2b/mouse.content';

/**
 * Slide 30 · "Camundongo × Humano". A mesma pergunta em duas espécies, com os achados como interruptores entre os dois
 * organismos: o fenótipo replicou (twitch 164,0 × 136,5 N), mas as proteínas de Ca²⁺ não mudaram
 * (Whitfield 2017; Hernández 2012; Haider 2014). Sabemos o quê, não sabemos por quê.
 */

const MouseHumanSim = () => {
    const { step, setStep } = useSlideSteps(MOUSE_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = MOUSE_STEPS[step];
    const stat = step === 1 ? <Stat value="~35%" label="mais rápida a ~100 Hz, só na fibra rápida" color={C.noSoft} keyFact />
        : step === 2 ? <Stat value="164 × 136,5 N" label="twitch de pico, nitrato × placebo" color={C.noSoft} size={26} keyFact />
        : step === 3 ? <Stat value="nenhuma" label="das proteínas de Ca²⁺ mudou" color={C.hypoxia} size={26} keyFact />
        : step === 4 ? (
            <>
                <Stat value="o quê ✓" label="replicado em humanos" color={C.noSoft} size={24} />
                <Stat value="por quê ?" label="desconhecido" color={C.hypoxia} size={24} keyFact />
            </>
        ) : undefined;

    return (
        <WideFrame tabs={MOUSE_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato2b-mouse-tab"
            chips={<IllustrativeChip text="ligado ↑ subiu · no meio = sem mudança · tracejado — sem dado" />} label={plan.headline}
            glow={step === 4 ? C.nitrate : undefined}
            scene={<MouseHumanArt step={step} reduce={reduce} />}
            headline={plan.headline} text={MOUSE_SHORT[step]} color={step === 4 ? C.nitrateSoft : C.noSoft}
            stat={stat} facts={plan.facts} source={plan.source} />
    );
};

export default MouseHumanSim;
