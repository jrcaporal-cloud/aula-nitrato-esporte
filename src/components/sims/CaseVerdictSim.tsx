import { useSlideSteps } from '../../store/useSlideSteps';
import { CASES, CASE_TABS } from './ato6/cases';
import { CaseBoard, CaseCard } from './ato6/arte-a/CaseCards';
import { FadeSwap, Fictional, Shell } from './ato6/ui';

/**
 * Slide 47 — Veredito dos Quatro Casos. Um passo por personagem (fictício): carta com retrato geométrico (mesmo disco do slide 3),
 * evidência com a fonte, três mostradores qualitativos (chance, magnitude, certeza GRADE) e o selo. Último passo: as quatro cartas.
 */
const CaseVerdictSim = () => {
    const { step, setStep } = useSlideSteps(CASE_TABS.length);
    const isBoard = step >= CASES.length;
    const c = CASES[Math.min(step, CASES.length - 1)];

    return (
        <Shell tabs={CASE_TABS} step={step} setStep={setStep} layoutId="case-tabs" chips={<Fictional />}>
            <FadeSwap id={isBoard ? 'board' : c.id} className="flex min-w-0 flex-1">
                {isBoard ? <CaseBoard cases={CASES} /> : <CaseCard c={c} />}
            </FadeSwap>
        </Shell>
    );
};

export default CaseVerdictSim;
