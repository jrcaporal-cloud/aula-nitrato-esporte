import { useSlideSteps } from '../../store/useSlideSteps';
import { BpChart } from './ato6/BpChart';
import { BP_COHORT, BP_STORIES, BP_TABS } from './ato6/bpContent';
import { Shell, Story } from './ato6/ui';
import { C } from './kit/palette';

/**
 * Slide 85 — Além da Pista: Pressão Arterial. O gráfico divergente em mmHg acumula as linhas: meta-análise (−4,4 na sistólica),
 * hipertensos (−7,7), dieta japonesa (−4,5 na diastólica) e o interruptor do enxaguante (+2 a +3,5). Contexto, não meta de prova.
 */
const BloodPressureSim = () => {
    const { step, setStep } = useSlideSteps(BP_TABS.length);
    const s = BP_STORIES[step];
    return (
        <Shell tabs={BP_TABS} step={step} setStep={setStep} layoutId="bp-tabs">
            <Story id={step} width={340} {...s}>
                {step === 3 && <p className="m-0 rounded-xl border px-3 py-2 text-[15px] leading-snug text-gray-200" style={{ borderColor: `${C.nitrite}77` }}>{BP_COHORT}</p>}
            </Story>
            <BpChart step={step} />
        </Shell>
    );
};

export default BloodPressureSim;
