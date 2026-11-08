import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { useTween } from './kit/useTween';
import { br } from './kit/format';
import { Ec50Chart } from './ato2a/Ec50Chart';
import { HbCard, MbCard, XorCard } from './ato2a/ReductaseCards';
import { PEAK_BAND, mbActivity, nitriteReduction, xorActivity } from './ato2a/pathwayModel';
import { REDUCTASE_STEPS } from './ato2a/reductases.content';
import { clamp, useStepValue } from './ato2a/hooks';
import { IllustrativeChip, Narration, SimFrame, Slider, SourceLine } from './ato2a/ui';

/**
 * "Onde Falta Oxigênio, Nasce NO" (Ato II). Três redutases do nitrito (desoxi-Hb, desoxi-Mb, XOR) reagem
 * à saturação de O₂ e ao pH. Dados: Hb com taxa máxima a 40–60% (Huang 2005), Mb ~36× (Shiva 2007),
 * XOR só em hipóxia (Millar 1998), EC₅₀ 200 → 40 µM (Modin 2001). Limiares e formas são ilustrativos.
 */
const TABS = REDUCTASE_STEPS.map(s => s.tab);

const NitriteReductasesSim = () => {
    const { step, setStep } = useSlideSteps(REDUCTASE_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = REDUCTASE_STEPS[step];
    const [satTarget, setSat, satManual] = useStepValue(step, plan.sat);
    const [phTarget, setPh, phManual] = useStepValue(step, plan.ph);
    const sat = clamp(useTween(satTarget, reduce, satManual ? 120 : 900), 0, 100);
    const ph = clamp(useTween(phTarget, reduce, phManual ? 120 : 900), 6.6, 7.4);
    const lit = (k: 'hb' | 'mb' | 'xor') => plan.focus === k || plan.focus === 'all';

    return (
        <SimFrame tabs={TABS} step={step} setStep={setStep} layoutId="ato2a-reductases" hint3d
            chips={<IllustrativeChip text="limiares ilustrativos" />}>
            <div className="flex w-[690px] shrink-0 flex-col gap-2">
                <Panel className="h-[336px]">
                    <svg width={690} height={336} viewBox="0 0 690 336" role="img" aria-label="Três redutases do nitrito: desoxi-hemoglobina, desoxi-mioglobina e xantina oxidorredutase">
                        <HbCard sat={sat} level={nitriteReduction(sat, ph)} lit={lit('hb')} reduce={reduce} />
                        <MbCard sat={sat} level={mbActivity(sat, ph)} lit={lit('mb')} reduce={reduce} />
                        <XorCard sat={sat} level={xorActivity(sat, ph)} lit={lit('xor')} reduce={reduce} />
                    </svg>
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
                    <Ec50Chart ph={ph} />
                </Panel>
            </div>
        </SimFrame>
    );
};

export default NitriteReductasesSim;
