import { motion, useReducedMotion } from 'framer-motion';
import { CircleCheck, TriangleAlert } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { ACTIVE_BY_STEP, RULES_TABS, RULE_STEPS, TONE_COLOR } from './ato6/rulesContent';
import { ArteShell, Glass, Kick } from './ato6/arte-b/kit';
import { SealPanel } from './ato6/arte-b/rules/Seals';
import { LadderStage, ListStage } from './ato6/arte-b/rules/stageA';
import { BrEuStage, ScaleStage } from './ato6/arte-b/rules/stageB';

/**
 * Slide 84 — Regras do Jogo. Painel de árbitros: cinco selos com semáforo (WADA 2026, AIS, IOC 2018, ISSN 2018,
 * Anvisa); o passador acende os que o passo discute e troca a arte embaixo (Lista varrida, escada de evidência,
 * texto da Anvisa e da UE, balança regra × laudo). O que o dossiê não conferiu continua marcado “não conferido”.
 */
const STAGES = [<ListStage />, <LadderStage />, <BrEuStage />, <ScaleStage />];

const RulesSim = () => {
    const { step, setStep } = useSlideSteps(RULES_TABS.length);
    const reduce = useReducedMotion() ?? false;
    const info = RULE_STEPS[step];
    const color = TONE_COLOR[info.flagTone];
    return (
        <ArteShell tabs={RULES_TABS} step={step} setStep={setStep} layoutId="rules-tabs">
            <SealPanel active={ACTIVE_BY_STEP[step]} />
            <motion.div key={step} className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_292px] gap-3"
                initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                {STAGES[step]}
                <Glass color={color} glow={1} dashed={info.flagTone === 'unknown'} className="flex flex-col gap-2 p-4">
                    <Kick color={color}>{info.flagTitle}</Kick>
                    <p className="m-0 text-[17px] leading-snug text-gray-100">{info.flag}</p>
                    <div className="mt-auto flex justify-end opacity-30">
                        {info.flagTone === 'ok' ? <CircleCheck size={64} color={color} strokeWidth={1.4} /> : <TriangleAlert size={64} color={color} strokeWidth={1.4} />}
                    </div>
                </Glass>
            </motion.div>
        </ArteShell>
    );
};

export default RulesSim;
