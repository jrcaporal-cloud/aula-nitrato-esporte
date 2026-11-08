import { useSlideSteps } from '../../store/useSlideSteps';
import { ACTIVE_BY_STEP, RULES_TABS, RULE_STEPS } from './ato6/rulesContent';
import { DetailPanel, SealRow } from './ato6/RuleParts';
import { Shell } from './ato6/ui';

/**
 * Slide 84 — Regras do Jogo. Cinco selos (WADA 2026, AIS, IOC 2018, ISSN 2018, Anvisa) sempre na tela;
 * o passador acende os que o passo discute e abre o detalhe. O que o dossiê não conferiu aparece como “não conferido”.
 */
const RulesSim = () => {
    const { step, setStep } = useSlideSteps(RULES_TABS.length);
    return (
        <Shell tabs={RULES_TABS} step={step} setStep={setStep} layoutId="rules-tabs">
            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <SealRow active={ACTIVE_BY_STEP[step]} />
                <DetailPanel step={RULE_STEPS[step]} id={step} />
            </div>
        </Shell>
    );
};

export default RulesSim;
