import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { JUDO_STEPS } from './ato4/judoContent';
import { JudoMats } from './ato4/JudoMats';
import { FactList, Narration, SimFrame, Src, Tag } from './ato4/shell';

/**
 * Slide 54 — "O Dia de Judô" (Karabağ 2026). 35 judocas, 5 lutas no dia: a cafeína ajuda cedo e "acaba" na quinta,
 * o suco de beterraba ajuda justamente na quinta. Estudo único e recente: o selo "hipótese" fica visível o tempo todo.
 */

const JudoDaySim = () => {
    const { step, setStep } = useSlideSteps(JUDO_STEPS.length);
    const info = JUDO_STEPS[step];
    const last = step === JUDO_STEPS.length - 1;
    return (
        <SimFrame tabs={JUDO_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato4-judo-tab"
            chips={<Tag color={C.nitrite}>estudo único · hipótese</Tag>}>
            <div className="flex h-full flex-col gap-2">
                <Panel state={last ? 'active' : 'idle'} glow={C.nitrite} className="relative" >
                    <div style={{ height: 292 }}><JudoMats step={step} /></div>
                    {last && (
                        <motion.div initial={{ opacity: 0, scale: 1.4, rotate: -9 }} animate={{ opacity: 1, scale: 1, rotate: -6 }} transition={{ duration: 0.45 }}
                            className="pointer-events-none absolute left-5 top-4 rounded-lg border-[3px] px-3 py-1 font-display text-[1.5rem] font-bold tracking-wide"
                            style={{ borderColor: C.nitrite, color: C.nitrite, background: 'rgba(7,5,11,0.82)' }}>
                            HIPÓTESE
                        </motion.div>
                    )}
                </Panel>
                <Panel className="flex flex-1 min-h-0 gap-5 px-5 py-3">
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                        <Narration stepKey={step} headline={info.headline} text={info.text} />
                        <p className="border-l-4 pl-3 text-[16px] font-medium leading-snug text-white" style={{ borderColor: C.nitrateSoft }}>{info.takeaway}</p>
                    </div>
                    <div className="flex w-[330px] shrink-0 flex-col justify-between gap-2">
                        <FactList rows={info.facts} dense />
                        <Src>{info.source}</Src>
                    </div>
                </Panel>
            </div>
        </SimFrame>
    );
};

export default JudoDaySim;
