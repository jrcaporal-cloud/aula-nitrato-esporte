import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { Panel } from './kit/ui';
import { useTween } from './kit/useTween';
import { FiberScene, RatNotes } from './ato2a/FiberScene';
import { ReservoirBars } from './ato2a/ReservoirBars';
import { BARS_BY_MODE, RESERVOIR_STEPS } from './ato2a/reservoir.content';
import { IllustrativeChip, Narration, SimFrame, SourceLine, StatList } from './ato2a/ui';

/**
 * "O Músculo Guarda Nitrato" (Ato II). Músculo × plasma: nitrato ~4× e nitrito ~29× em repouso, o que a dose
 * muda, a maquinaria (sialina e XOR), o consumo de ~39% no exercício intenso (Wylie 2019) e o rato que corre
 * (Piknova 2016). Barras em escala linear com plasma basal = 1; o esquema de pontos é proporcional, não exato.
 */
const TABS = RESERVOIR_STEPS.map(s => s.tab);

const MuscleReservoirSim = () => {
    const { step, setStep } = useSlideSteps(RESERVOIR_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = RESERVOIR_STEPS[step];
    const target = BARS_BY_MODE[plan.mode];
    const nitratePlasma = useTween(target.nitratePlasma, reduce, 800);
    const nitrateMuscle = useTween(target.nitrateMuscle, reduce, 800);
    const nitritePlasma = useTween(target.nitritePlasma, reduce, 800);
    const nitriteMuscle = useTween(target.nitriteMuscle, reduce, 800);
    const dilate = useTween(plan.mode === 'rat' ? 1 : 0, reduce, 900);

    return (
        <SimFrame tabs={TABS} step={step} setStep={setStep} layoutId="ato2a-reservoir"
            chips={<IllustrativeChip text="barras pós-dose: cálculo · pontos: esquema" />}>
            <Panel className="h-[448px] w-[690px] shrink-0">
                <svg width={688} height={446} viewBox="0 0 688 446" role="img"
                    aria-label="Nitrato e nitrito no plasma e no músculo, e o esquema do capilar e da fibra muscular">
                    {plan.mode === 'rat' ? <RatNotes /> : (
                        <ReservoirBars bars={{ nitratePlasma, nitrateMuscle, nitritePlasma, nitriteMuscle }} />
                    )}
                    <g transform="translate(344 0)"><FiberScene mode={plan.mode} dilate={dilate} reduce={reduce} /></g>
                </svg>
            </Panel>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Panel className="flex h-[210px] flex-col gap-2 p-3.5">
                    <Narration key={step} headline={plan.headline}>{plan.text}</Narration>
                    <SourceLine key={`src-${step}`}>{plan.source}</SourceLine>
                </Panel>
                <Panel key={step} className="flex min-h-0 flex-1 flex-col justify-center gap-3 p-4">
                    <StatList items={plan.stats} size={plan.stats.length > 2 ? 30 : 38} />
                </Panel>
            </div>
        </SimFrame>
    );
};

export default MuscleReservoirSim;
