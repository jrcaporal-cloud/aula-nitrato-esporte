import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { IllustrativeChip } from './ato2b/ui';
import { BodyArt, GaugesArt, HypothesisArt, VerdictArt } from './ato2b/art/MitoArt';
import { Stat, WideFrame } from './ato2b/art/WideFrame';
import { MITO_SHORT } from './ato2b/art/copy';
import { MITO_STEPS } from './ato2b/mito.content';

/**
 * Slide 27 · "A Hipótese que Não Sobreviveu". 2011: ↑P/O e ↓ANT (só direção, sem valores de P/O);
 * 2016: VO₂ do corpo −3% igual, mas todos os medidores mitocondriais parados e só o H₂O₂ sobe.
 * O fenótipo replicou, o mecanismo não: o risco cai sobre a hipótese e o olhar vai para o sarcômero.
 */

const MitoVerdictSim = () => {
    const { step, setStep } = useSlideSteps(MITO_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = MITO_STEPS[step];
    const props = { reduce, step };
    const scene = step <= 1 ? <HypothesisArt {...props} /> : step === 2 ? <BodyArt {...props} /> : step === 3 ? <GaugesArt {...props} /> : <VerdictArt {...props} />;

    return (
        <WideFrame tabs={MITO_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato2b-mito-tab"
            chips={<IllustrativeChip text="esquema · sem valores de P/O" />} label={plan.headline}
            glow={step === 4 ? C.nitrate : undefined}
            scene={<g key={step <= 1 ? 0 : step}>{scene}</g>}
            headline={plan.headline} text={MITO_SHORT[step]} color={step >= 2 ? C.nitrateSoft : C.noSoft}
            stat={step === 2 ? <Stat value="−3%" label="VO₂ do corpo todo (p < 0,05)" color={C.nitrate} keyFact />
                : step === 3 ? <Stat value="H₂O₂ ↑" label="única medida que mudou" color={C.hypoxia} size={28} keyFact /> : undefined}
            facts={plan.facts} source={step === 3 ? plan.source.replace('barras ilustram', 'ponteiros ilustram') : plan.source} />
    );
};

export default MitoVerdictSim;
