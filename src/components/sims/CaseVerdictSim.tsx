import { useSlideSteps } from '../../store/useSlideSteps';
import { CASES, CASE_TABS } from './ato6/cases';
import { Board, EvidenceColumn, ProfileColumn, VerdictColumn } from './ato6/CaseParts';
import { FadeSwap, Fictional, Shell } from './ato6/ui';

/**
 * Slide 83 — Veredito dos Quatro Casos. Um passo por personagem (fictício): ficha, evidência com a fonte e o veredito em
 * três barras qualitativas (chance, magnitude, certeza GRADE). Último passo: o quadro dos quatro, lado a lado.
 */
const CaseVerdictSim = () => {
    const { step, setStep } = useSlideSteps(CASE_TABS.length);
    const isBoard = step >= CASES.length;
    const c = CASES[Math.min(step, CASES.length - 1)];

    return (
        <Shell tabs={CASE_TABS} step={step} setStep={setStep} layoutId="case-tabs" chips={<Fictional />}>
            <FadeSwap id={isBoard ? 'board' : c.id} className="flex min-w-0 flex-1 gap-3">
                {isBoard ? <Board cases={CASES} /> : <><ProfileColumn c={c} /><EvidenceColumn c={c} /><VerdictColumn c={c} /></>}
            </FadeSwap>
        </Shell>
    );
};

export default CaseVerdictSim;
