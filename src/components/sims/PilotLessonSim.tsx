import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { ClinicalArt } from './ato4/arcoArt/ClinicalArt';
import { MonitorArt } from './ato4/arcoArt/MonitorArt';
import { PILOT_STEPS } from './ato4/pilotContent';
import { SimFrame, StoryPanel, Tag, type FactHit } from './ato4/shell';

/**
 * Slide 34 — "O Arco da Insuficiência Cardíaca". Um monitor cardíaco: cada ensaio de ICFEp é um batimento cuja altura
 * é o efeito no VO₂pico (17 → 105 → 84 pacientes, bolha = n) e o sinal encolhe até a linha reta; a DPOC acende embaixo
 * (+30 m só com reabilitação); no fim, a barra viva dos 46% "positivos" contra o agrupado clínico nulo.
 */

/** Dado-chave de cada passo na lista de números (contador + destaque). */
const HITS: readonly FactHit[] = [{ index: 1, from: 11.6 }, { index: 2 }, { index: 1 }, { index: 0 }, { index: 0 }];

const PilotLessonSim = () => {
    const { step, setStep } = useSlideSteps(PILOT_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const info = PILOT_STEPS[step];
    const last = step === PILOT_STEPS.length - 1;
    return (
        <SimFrame tabs={PILOT_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato4-pilot-tab"
            chips={<Tag color={C.nitrite}>{last ? 'dados publicados · IC95%' : 'área da bolha = n'}</Tag>}>
            <div className="h-full grid gap-3" style={{ gridTemplateColumns: '720px 1fr' }}>
                <Panel className="min-h-0">
                    <motion.div key={last ? 'derella' : 'monitor'} className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
                        {last ? <ClinicalArt reduce={reduce} /> : <MonitorArt step={step} reduce={reduce} />}
                    </motion.div>
                </Panel>
                <StoryPanel stepKey={step} kicker={info.kicker} headline={info.headline} text={info.text} facts={info.facts}
                    takeaway={info.takeaway} source={info.source} hit={HITS[step]} />
            </div>
        </SimFrame>
    );
};

export default PilotLessonSim;
