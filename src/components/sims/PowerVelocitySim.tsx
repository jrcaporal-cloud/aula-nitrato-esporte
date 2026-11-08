import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { useTween } from './kit/useTween';
import { FvChart } from './ato4/FvChart';
import { peakVelocity } from './ato4/fvModel';
import { PowerForest } from './ato4/PowerForest';
import { ResponderCloud } from './ato4/ResponderCloud';
import { SimFrame, StoryPanel, Tag } from './ato4/shell';
import { VELOCITY_STEPS } from './ato4/velocityContent';

/**
 * Slide 52 — "Mais Rápido, não Mais Forte". Curva força-velocidade e parábola de potência (força igual,
 * velocidade e potência sobem), os forests de Lago 2020 e Coggan 2021 e a nuvem de respondedores.
 */

/** Onde o cursor para em cada passo do gráfico (rad/s). */
const CURSOR_AT = [0.3, 11.5, peakVelocity('nitrate')] as const;

interface Drag { step: number; v: number }

const PowerVelocitySim = () => {
    const { step, setStep } = useSlideSteps(VELOCITY_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const info = VELOCITY_STEPS[step];
    const [drag, setDrag] = useState<Drag | null>(null);
    const home = useTween(CURSOR_AT[Math.min(step, CURSOR_AT.length - 1)], reduce, 900);
    const cursor = drag?.step === step ? drag.v : home;

    const visual = step <= 2
        ? <FvChart step={step} cursor={cursor} onCursor={v => setDrag({ step, v })} />
        : step === 3 ? <PowerForest /> : <ResponderCloud reduce={reduce} />;

    return (
        <SimFrame tabs={VELOCITY_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato4-velocity-tab"
            chips={<Tag color={C.nitrite}>{info.chip}</Tag>}>
            <div className="h-full grid gap-3" style={{ gridTemplateColumns: '720px 1fr' }}>
                <Panel className="min-h-0">
                    <motion.div key={step <= 2 ? 'chart' : step} className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
                        {visual}
                    </motion.div>
                </Panel>
                <StoryPanel stepKey={step} kicker={info.kicker} headline={info.headline} text={info.text} facts={info.facts}
                    takeaway={info.takeaway} source={info.source} />
            </div>
        </SimFrame>
    );
};

export default PowerVelocitySim;
