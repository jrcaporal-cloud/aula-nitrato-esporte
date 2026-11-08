import { useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { SvgText } from './kit/ui';
import { Funnel } from './ato2b/Funnel';
import { GH, GW, GraphicPanel, IllustrativeChip, Segmented, SidePanel, SimFrame } from './ato2b/ui';
import { CASCADE_STEPS, COHORT_OPTIONS, COHORT_TITLE, stagesOf, type Cohort } from './ato2b/cascade.content';

/**
 * Slide 31 · "A Cascata com Vazamentos". Funil de 4 barras (Coggan 2020: nitrato +1051% → nitrito +138% → NO exalado +111%
 * → potência +4,4%) e o controle "quem toma" (idoso / recreacional / elite) com os dados do dossiê; degraus sem valor
 * medido ficam tracejados (direção, ilustrativo).
 */

const SCALES = [{ value: 'linear', label: 'linear' }, { value: 'log', label: 'log' }] as const;
const MULTIPLES: readonly Cohort[] = ['idoso', 'recreacional', 'elite'];

interface Override { step: number; cohort: Cohort }

const CascadeSim = () => {
    const { step, setStep } = useSlideSteps(CASCADE_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = CASCADE_STEPS[step];
    const [override, setOverride] = useState<Override | null>(null);
    const [scale, setScale] = useState<'linear' | 'log'>('linear');
    const planCohort: Cohort = plan.cohort === 'todos' ? 'idoso' : plan.cohort;
    const cohort: Cohort = override?.step === step ? override.cohort : planCohort;
    const log = scale === 'log';
    const multiples = plan.cohort === 'todos';

    return (
        <SimFrame tabs={CASCADE_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato2b-cascade-tab"
            chips={<IllustrativeChip text="tracejado = ilustrativo" />}>
            <GraphicPanel>
                <svg viewBox={`0 0 ${GW} ${GH}`} width="100%" height="100%" className="block" role="img" aria-label={plan.headline}>
                    {!multiples && (
                        <>
                            <SvgText x={24} y={34} text={`${COHORT_TITLE[cohort]} · variação após o bolus de nitrato`} size={18} color={C.text} weight={600} />
                            <Funnel id="fn-main" cx={398} top={64} maxW={330} rowH={54} gap={36} stages={stagesOf(cohort)} log={log} reduce={reduce}
                                focus={step === 1 && cohort === 'idoso' ? 3 : null} />
                            <SvgText x={24} y={GH - 14} text={log ? 'escala logarítmica: log(1 + variação)' : 'escala linear: largura = variação percentual'} size={16} color={C.muted} weight={500} />
                        </>
                    )}
                    {multiples && MULTIPLES.map((c, i) => (
                        <g key={c}>
                            <SvgText x={125 + i * 242} y={46} text={COHORT_TITLE[c]} anchor="middle" size={18} color={C.text} weight={700} />
                            <Funnel id={`fn-${c}`} cx={125 + i * 242} top={84} maxW={200} rowH={46} gap={34} stages={stagesOf(c)} log={log} reduce={reduce} compact />
                        </g>
                    ))}
                    {multiples && <SvgText x={GW / 2} y={GH - 20} text="largura de cada barra = tamanho do degrau · tracejado = só direção" anchor="middle" size={16} color={C.muted} weight={500} />}
                </svg>
            </GraphicPanel>
            <SidePanel stepKey={step} headline={plan.headline} text={plan.text} source={plan.source} facts={plan.facts}>
                {!multiples && (
                    <Segmented label="quem toma" options={COHORT_OPTIONS} value={cohort} onChange={v => setOverride({ step, cohort: v })} color={C.nitrate} />
                )}
                <Segmented label="escala" options={SCALES} value={scale} onChange={setScale} color={C.nitrate} />
            </SidePanel>
        </SimFrame>
    );
};

export default CascadeSim;
