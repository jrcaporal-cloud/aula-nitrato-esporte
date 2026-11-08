import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { BrunoArt } from './ato4/campoArt/BrunoArt';
import { PooledArt } from './ato4/campoArt/PooledArt';
import { SprintArt } from './ato4/campoArt/SprintArt';
import { YoYoArt } from './ato4/campoArt/YoYoArt';
import { StoryPanel, SimFrame, Tag } from './ato4/shell';
import { TEAM_STEPS, YOYO_NYAKAYIRU, YOYO_WYLIE } from './ato4/teamContent';

/**
 * Slide 29 — "Bola Rolando". Bruno (caso fictício) em campo e os quatro números do Yo-Yo e dos sprints:
 * Wylie 2013, Nyakayiru 2017, Thompson 2016 e o agrupado de Alsharif 2023 (SMD 0,17). Arte: o gramado —
 * o vaivém do Yo-Yo com placar, as raias de sprint e a "vantagem de centímetros"; a floresta fica menor no fim.
 */

const TeamSportSim = () => {
    const { step, setStep } = useSlideSteps(TEAM_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const info = TEAM_STEPS[step];

    const visual = [
        <BrunoArt key="p" reduce={reduce} />,
        <YoYoArt key="w" run={YOYO_WYLIE} dose="490 mL de suco em ~30 h" reduce={reduce} />,
        <YoYoArt key="n" run={YOYO_NYAKAYIRU} dose="140 mL/dia · ≈ 12,9 mmol · 6 dias" reduce={reduce} />,
        <SprintArt key="s" reduce={reduce} />,
        <PooledArt key="a" reduce={reduce} />,
    ][step];

    return (
        <SimFrame tabs={TEAM_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato4-team-tab"
            chips={<Tag color={C.nitrateSoft}>Bruno · caso fictício</Tag>}>
            <div className="h-full grid gap-3" style={{ gridTemplateColumns: '720px 1fr' }}>
                <Panel className="min-h-0">
                    <motion.div key={step} className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
                        {visual}
                    </motion.div>
                </Panel>
                <StoryPanel stepKey={step} kicker={info.kicker} headline={info.headline} text={info.text} facts={info.facts} takeaway={info.takeaway} source={info.source}
                    hit={step === 4 ? { index: 0 } : undefined} />
            </div>
        </SimFrame>
    );
};

export default TeamSportSim;
