import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { BigStat, GH, GW, GraphicPanel, IllustrativeChip, SidePanel, SimFrame } from './ato2b/ui';
import { MouseHumanScene } from './ato2b/MouseHumanScene';
import { MOUSE_STEPS } from './ato2b/mouse.content';

/**
 * Slide 30 · "Camundongo × Humano". A mesma pergunta em duas espécies: o fenótipo replicou (twitch 164,0 × 136,5 N)
 * mas as proteínas de Ca²⁺ não mudaram (Whitfield 2017; Hernández 2012; Haider 2014). Sabemos o quê, não sabemos por quê.
 */

const MouseHumanSim = () => {
    const { step, setStep } = useSlideSteps(MOUSE_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = MOUSE_STEPS[step];

    return (
        <SimFrame tabs={MOUSE_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato2b-mouse-tab"
            chips={<IllustrativeChip text="↑ subiu · = sem mudança · — sem dado" />}>
            <GraphicPanel>
                <svg viewBox={`0 0 ${GW} ${GH}`} width="100%" height="100%" className="block" role="img" aria-label={plan.headline}>
                    <MouseHumanScene step={step} reduce={reduce} />
                </svg>
            </GraphicPanel>
            <SidePanel stepKey={step} headline={plan.headline} text={plan.text} source={plan.source} facts={plan.facts}
                color={step === 4 ? C.nitrateSoft : C.noSoft}>
                {step === 1 && <BigStat value="~35%" label="mais rápida a ~100 Hz, só na fibra rápida" color={C.noSoft} />}
                {step === 2 && <BigStat value="164 × 136,5 N" label="twitch de pico, nitrato × placebo" color={C.noSoft} size={28} />}
                {step === 3 && <BigStat value="nenhuma" label="das proteínas de Ca²⁺ mudou" color={C.hypoxia} size={28} />}
                {step === 4 && (
                    <>
                        <BigStat value="o quê ✓" label="replicado em humanos" color={C.noSoft} size={28} />
                        <BigStat value="por quê ?" label="desconhecido" color={C.hypoxia} size={28} />
                    </>
                )}
            </SidePanel>
        </SimFrame>
    );
};

export default MouseHumanSim;
