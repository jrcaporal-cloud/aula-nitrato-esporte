import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { Panel } from './kit/ui';
import { EnteroData } from './ato2a/EnteroData';
import { EnteroScene } from './ato2a/EnteroScene';
import { ENTERO_STEPS } from './ato2a/entero.content';
import { Narration, SimFrame, SourceLine } from './ato2a/ui';

/**
 * "A Boca Trabalha por Você" (Ato II). O circuito boca → estômago → intestino → sangue → glândula
 * salivar → boca, um trecho por passo: absorção, sialina (~25%), gradiente salivar, bactérias da
 * língua, NO gástrico e o fecho no sangue. Números de Wagner 1983, Qin 2012, McKnight 1997,
 * Doel 2005, Lundberg 1994 e 2004.
 */
const TABS = ENTERO_STEPS.map(s => s.tab);

const EnterosalivarySim = () => {
    const { step, setStep } = useSlideSteps(ENTERO_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = ENTERO_STEPS[step];
    return (
        <SimFrame tabs={TABS} step={step} setStep={setStep} layoutId="ato2a-entero" hint3d>
            <Panel className="h-[448px] w-[690px] shrink-0">
                <EnteroScene step={step} caption={plan.caption} captionColor={plan.captionColor} reduce={reduce} />
            </Panel>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Panel className="flex h-[210px] flex-col gap-2 p-3.5">
                    <Narration key={step} headline={plan.headline}>{plan.text}</Narration>
                    <SourceLine>{plan.source}</SourceLine>
                </Panel>
                <Panel className="min-h-0 flex-1 p-4">
                    <EnteroData step={step} />
                </Panel>
            </div>
        </SimFrame>
    );
};

export default EnterosalivarySim;
