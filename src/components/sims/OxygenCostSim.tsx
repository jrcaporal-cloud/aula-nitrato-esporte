import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { BigStat, GH, GW, GraphicPanel, IllustrativeChip, SidePanel, SimFrame } from './ato2b/ui';
import { EfficiencyRings, SlowChart, SteadyChart, UnchangedBars } from './ato2b/OxygenScenes';
import { OXYGEN_STEPS } from './ato2b/oxygen.content';

/**
 * Slide 26 · "O Custo de O₂ Cai". O achado fundador (Larsen 2007): VO₂ submáximo 2,98 → 2,82 L/min (−5,4%),
 * eficiência bruta 19,7 → 21,1%, lactato igual; e o componente lento do exercício severo (Bailey 2009).
 * Forma das curvas ilustrativa; os pontos finais são dados do dossiê.
 */

const SIDE_STATS = [
    null,
    [{ v: '2,98 → 2,82', l: 'L/min (placebo → nitrato)', c: C.nitrateSoft }, { v: '−5,4%', l: 'de consumo de O₂', c: C.nitrate }],
    [{ v: '19,7 → 21,1%', l: 'eficiência bruta', c: C.nitrateSoft }],
    [{ v: '0', l: 'diferença em FC, lactato, ventilação, VE/VO₂ e RER', c: C.placebo }],
    [{ v: '0,74 → 0,57', l: 'L/min de componente lento', c: C.nitrateSoft }, { v: '583 → 675 s', l: 'tempo até a exaustão (+15,8%)', c: C.nitrate }],
] as const;

const OxygenCostSim = () => {
    const { step, setStep } = useSlideSteps(OXYGEN_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = OXYGEN_STEPS[step];
    const stats = SIDE_STATS[step];
    const scene = step <= 1 ? 0 : step;
    const props = { reduce, step };

    return (
        <SimFrame tabs={OXYGEN_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato2b-oxygen-tab"
            chips={<IllustrativeChip text="curvas ilustrativas · pontos são dados" />}>
            <GraphicPanel>
                <svg key={scene} viewBox={`0 0 ${GW} ${GH}`} width="100%" height="100%" className="block" role="img" aria-label={plan.headline}>
                    {scene === 0 && <SteadyChart {...props} />}
                    {scene === 2 && <EfficiencyRings {...props} />}
                    {scene === 3 && <UnchangedBars {...props} />}
                    {scene === 4 && <SlowChart {...props} />}
                </svg>
            </GraphicPanel>
            <SidePanel stepKey={step} headline={plan.headline} text={plan.text} source={plan.source} facts={plan.facts}>
                {stats?.map(s => <BigStat key={s.v} value={s.v} label={s.l} color={s.c} size={s.v.length > 8 ? 28 : 34} />)}
            </SidePanel>
        </SimFrame>
    );
};

export default OxygenCostSim;
