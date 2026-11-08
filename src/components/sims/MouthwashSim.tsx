import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { Panel } from './kit/ui';
import { useTween } from './kit/useTween';
import { ExerciseChart } from './ato2a/ExerciseChart';
import { MouthwashChart } from './ato2a/MouthwashChart';
import { MouthwashFacts } from './ato2a/MouthwashFacts';
import { MouthwashSwitch } from './ato2a/MouthwashSwitch';
import { MOUTH_STEPS } from './ato2a/mouthwash.content';
import { POSITIONS } from './ato2a/mouthwash.positions';
import { clamp, useStepValue } from './ato2a/hooks';
import { IllustrativeChip, Narration, SimFrame, SourceLine } from './ato2a/ui';

/**
 * "O Interruptor do Enxaguante" (Ato II). A prova causal: o interruptor da boca (água, enxaguante,
 * clorexidina, cuspir) achata só a curva do nitrito. Webb 2008, McDonagh 2015, Kapil 2013, Clarke 2019;
 * o último passo mostra o que ainda NÃO está provado (cadeia até o desempenho, Zhao 2026).
 */
const TABS = MOUTH_STEPS.map(s => s.tab);

const MouthwashSim = () => {
    const { step, setStep } = useSlideSteps(MOUTH_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = MOUTH_STEPS[step];
    const [position, setPosition] = useStepValue(step, plan.position);
    const pos = Math.round(position);
    const nitrite = clamp(useTween(POSITIONS[pos].nitrite, reduce, 700), 0, 1);

    return (
        <SimFrame tabs={TABS} step={step} setStep={setStep} layoutId="ato2a-mouth"
            chips={<IllustrativeChip text="alturas das curvas ilustrativas" />}>
            <Panel className="flex h-[448px] w-[690px] shrink-0">
                <MouthwashSwitch position={pos} onSelect={setPosition} />
                <div className="shrink-0">
                    {plan.exercise ? <ExerciseChart /> : <MouthwashChart nitrite={nitrite} banner={POSITIONS[pos].banner} />}
                </div>
            </Panel>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Panel className="flex h-[210px] flex-col gap-2 p-3.5">
                    <Narration key={step} headline={plan.headline}>{plan.text}</Narration>
                    <SourceLine key={`src-${step}`}>{plan.source}</SourceLine>
                </Panel>
                <Panel className="min-h-0 flex-1 p-4">
                    <MouthwashFacts key={step} kind={plan.facts} />
                </Panel>
            </div>
        </SimFrame>
    );
};

export default MouthwashSim;
