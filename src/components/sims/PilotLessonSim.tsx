import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { DerellaView } from './ato4/DerellaView';
import { PILOT_STEPS } from './ato4/pilotContent';
import { PilotBubbles } from './ato4/PilotBubbles';
import { SimFrame, StoryPanel, Tag } from './ato4/shell';

/**
 * Slide 55 — "O Arco da Insuficiência Cardíaca". Linha do tempo com bolhas proporcionais ao n (17 → 105 → 84),
 * o efeito no VO₂pico encolhendo até zero, a DPOC (+30 m só com reabilitação) e o agrupado clínico nulo.
 */

const PilotLessonSim = () => {
    const { step, setStep } = useSlideSteps(PILOT_STEPS.length);
    const info = PILOT_STEPS[step];
    const last = step === PILOT_STEPS.length - 1;
    return (
        <SimFrame tabs={PILOT_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato4-pilot-tab"
            chips={<Tag color={C.nitrite}>{last ? 'dados publicados · IC95%' : 'área da bolha = n'}</Tag>}>
            <div className="h-full grid gap-3" style={{ gridTemplateColumns: '720px 1fr' }}>
                <Panel className="min-h-0">
                    <motion.div key={last ? 'derella' : 'bubbles'} className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
                        {last ? <DerellaView /> : <PilotBubbles step={step} />}
                    </motion.div>
                </Panel>
                <StoryPanel stepKey={step} kicker={info.kicker} headline={info.headline} text={info.text} facts={info.facts}
                    takeaway={info.takeaway} source={info.source} />
            </div>
        </SimFrame>
    );
};

export default PilotLessonSim;
