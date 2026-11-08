import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { useTween } from './kit/useTween';
import { br } from './kit/format';
import { ActivityChart } from './ato2a/ActivityChart';
import { PathwayLanes } from './ato2a/PathwayLanes';
import { PEAK_BAND, nitriteReduction, nosActivity } from './ato2a/pathwayModel';
import { clamp, useStepValue } from './ato2a/hooks';
import { PATHWAY_STEPS } from './ato2a/twoPathways.content';
import { IllustrativeChip, Narration, Slider, SimFrame, SourceLine } from './ato2a/ui';

/**
 * "Duas Vias para um Gás" (Ato II). A via clássica (L-arginina → NOS) precisa de O₂; a via
 * alternativa (nitrato → nitrito → NO) rende mais com hipóxia e acidose. Os dois controles
 * mexem nas duas vias ao mesmo tempo; o passador leva os controles de um passo ao outro.
 */
const TABS = PATHWAY_STEPS.map(s => s.tab);

const TwoPathwaysSim = () => {
    const { step, setStep } = useSlideSteps(PATHWAY_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = PATHWAY_STEPS[step];
    const [satTarget, setSat, satManual] = useStepValue(step, plan.sat);
    const [phTarget, setPh, phManual] = useStepValue(step, plan.ph);
    const sat = clamp(useTween(satTarget, reduce, satManual ? 120 : 900), 0, 100);
    const ph = clamp(useTween(phTarget, reduce, phManual ? 120 : 900), 6.6, 7.4);

    return (
        <SimFrame tabs={TABS} step={step} setStep={setStep} layoutId="ato2a-pathways" hint3d chips={<IllustrativeChip text="curvas ilustrativas" />}>
            <div className="flex w-[690px] shrink-0 flex-col gap-2">
                <Panel className="h-[336px]">
                    <PathwayLanes sat={sat} nos={nosActivity(sat)} reduction={nitriteReduction(sat, ph)} focus={plan.focus} reduce={reduce} />
                </Panel>
                <Panel className="flex h-[104px] flex-col justify-center gap-1 px-5">
                    <div className="flex gap-8">
                        <Slider label="Saturação de O₂" value={sat} from={100} to={0} onChange={setSat} color={C.o2}
                            display={`${Math.round(sat)}%`} band={PEAK_BAND} />
                        <Slider label="pH do tecido" value={ph} from={7.4} to={6.6} onChange={setPh} color={C.hypoxia}
                            display={br(ph, 2)} />
                    </div>
                    <p className="text-[14px] text-gray-400">Arraste para explorar — o passador sempre volta à posição do passo.</p>
                </Panel>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Panel className="flex h-[210px] flex-col gap-2 p-3.5">
                    <Narration key={step} headline={plan.headline}>{plan.text}</Narration>
                    <SourceLine>{plan.source}</SourceLine>
                </Panel>
                <Panel className="min-h-0 flex-1">
                    <ActivityChart sat={sat} ph={ph} />
                </Panel>
            </div>
        </SimFrame>
    );
};

export default TwoPathwaysSim;
