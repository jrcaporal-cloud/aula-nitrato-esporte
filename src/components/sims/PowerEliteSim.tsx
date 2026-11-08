import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { EliteLadder } from './ato4/EliteLadder';
import { TimeForest, XieForest } from './ato4/EliteForests';
import { ELITE_STEPS } from './ato4/eliteContent';
import { useEntered } from './ato4/hooks';
import { SimFrame, StoryPanel, Tag, type FactHit } from './ato4/shell';
import { WingateChart } from './ato4/WingateChart';

/**
 * Slide 53 — "A Elite da Potência". Jonvik 2018 (todos chegam ao pico ~2,8% mais cedo, pico igual, do amador ao
 * olímpico) × Xie 2026 (nulo agregado em atletas) × Eroglu 2026 (só o tempo até o pico se mexe; certeza baixa).
 */

/** Dado-chave de cada passo na lista de números (o passo 2 destaca no desenho dos níveis). */
const HITS: readonly (FactHit | undefined)[] = [{ index: 2 }, undefined, { index: 0 }, { index: 0 }];

const Ladder = ({ reduce }: { reduce: boolean }) => <EliteLadder lit={useEntered(reduce, 500)} />;

const PowerEliteSim = () => {
    const { step, setStep } = useSlideSteps(ELITE_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const info = ELITE_STEPS[step];
    const visual = [
        <WingateChart key="w" reduce={reduce} />,
        <Ladder key="l" reduce={reduce} />,
        <XieForest key="x" />,
        <TimeForest key="t" />,
    ][step];
    return (
        <SimFrame tabs={ELITE_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato4-elite-tab"
            chips={<Tag color={C.nitrite}>{info.chip}</Tag>}>
            <div className="h-full grid gap-3" style={{ gridTemplateColumns: '720px 1fr' }}>
                <Panel className="min-h-0">
                    <motion.div key={step} className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
                        {visual}
                    </motion.div>
                </Panel>
                <StoryPanel stepKey={step} kicker={info.kicker} headline={info.headline} text={info.text} facts={info.facts}
                    takeaway={info.takeaway} source={info.source} hit={HITS[step]} />
            </div>
        </SimFrame>
    );
};

export default PowerEliteSim;
