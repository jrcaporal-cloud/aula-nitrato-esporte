import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Chip, StepTabs } from './kit/ui';
import { CAST, FINAL_QUESTION } from './ato1/cast';
import { CastCard } from './ato1/CastCard';
import { CAST_LOOK } from './ato1/art/castLook';

/**
 * "Quatro Atletas, uma Pergunta" (slide 11). Passos 1–4: um caso fictício entra por vez (esforço numa régua comum,
 * VO₂max, dilema). Passo 5: os quatro acesos e a pergunta da aula. Voltam no Ato VI (slide 83).
 */

const TABS = [...CAST.map(m => m.name), 'A pergunta'] as const;

const CastSim = () => {
    const { step, setStep } = useSlideSteps(CAST.length + 1);
    const reduce = useReducedMotion() ?? false;
    const asking = step === CAST.length;

    return (
        <div className="not-prose flex w-full select-none flex-col gap-3 font-body text-white" style={{ height: 500 }}>
            <div className="flex h-10 items-center justify-between gap-3">
                <StepTabs labels={TABS} step={step} onSelect={setStep} layoutId="cast-tabs" />
                <div className="flex items-center gap-2">
                    <Chip color={C.nitrateSoft}>caso fictício</Chip>
                    <Chip color={C.placebo}>perfil de esforço ilustrativo</Chip>
                </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-4 gap-3">
                {CAST.map((member, i) => (
                    <CastCard key={member.name} member={member} revealed={step >= i}
                        state={asking || i === step ? 'active' : 'idle'} />
                ))}
            </div>

            <div className="relative flex h-[50px] shrink-0 items-center justify-center gap-4 rounded-2xl border px-5 transition-all duration-500"
                style={{
                    borderColor: asking ? `${C.nitrate}b3` : 'rgba(255,255,255,0.1)',
                    background: asking ? `linear-gradient(90deg, ${C.nitrate}26, ${C.o2}1f, ${C.nitrate}26)` : 'rgba(10,6,14,0.74)',
                    boxShadow: asking ? `0 0 34px -8px ${C.nitrate}` : 'none',
                }}>
                <span aria-hidden className="flex gap-1.5">
                    {CAST.map(m => (
                        <span key={m.name} className="size-3.5 rounded-full transition-all duration-500"
                            style={{ background: CAST_LOOK[m.name].color, opacity: asking ? 1 : 0.25, boxShadow: asking ? `0 0 12px ${CAST_LOOK[m.name].color}` : 'none' }} />
                    ))}
                </span>
                <motion.p key={asking ? 'ask' : 'wait'} initial={{ opacity: 0, scale: asking && !reduce ? 0.94 : 1 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduce ? 0 : 0.45 }}
                    className={asking ? 'font-display text-[1.8rem] font-semibold text-white' : 'text-[17px] text-gray-400'}>
                    {asking ? FINAL_QUESTION : 'A pergunta da aula vem depois dos quatro.'}
                </motion.p>
            </div>
        </div>
    );
};

export default CastSim;
