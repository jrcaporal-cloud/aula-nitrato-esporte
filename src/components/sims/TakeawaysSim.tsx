import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { Source } from './kit/ui';
import { TakeawayVisual } from './ato6/TakeawayVisuals';
import { TAKEAWAYS, TAKEAWAYS_BY_STEP, TAKEAWAY_TABS, type Takeaway } from './ato6/takeawaysContent';
import { Card, Kicker, Shell } from './ato6/ui';

/**
 * Slide 88 — O Que Levar para o Consultório. Seis mensagens em três passos de duas (efeito, prática, lacunas),
 * cada uma com o número que a sustenta; o último passo põe as seis lado a lado como um cartaz.
 */
const Big = ({ t, i }: { t: Takeaway; i: number }) => {
    const reduce = useReducedMotion();
    return (
        <motion.div className="min-w-0 flex-1" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15, duration: 0.45 }}>
            <Card color={t.color} className="flex h-full flex-col gap-3 p-5">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full font-display text-[22px] font-semibold text-[#07050B]" style={{ background: t.color }}>{t.n}</span>
                    <Kicker color={t.color}>mensagem {t.n} de 6</Kicker>
                </div>
                <h3 className="m-0 font-display text-[28px] font-semibold leading-tight text-white">{t.headline}</h3>
                <p className="m-0 font-display text-[50px] font-semibold leading-none" style={{ color: t.color }}>{t.key}</p>
                <TakeawayVisual id={t.visual} color={t.color} />
                <p className="m-0 text-[19px] leading-snug text-gray-100">{t.text}</p>
                <div className="mt-auto"><Source>{t.source}</Source></div>
            </Card>
        </motion.div>
    );
};

const Small = ({ t, i }: { t: Takeaway; i: number }) => {
    const reduce = useReducedMotion();
    return (
        <motion.div initial={reduce ? false : { opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08, duration: 0.4 }}>
            <Card color={t.color} className="flex h-full flex-col gap-2 p-4">
                <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-[18px] font-semibold text-[#07050B]" style={{ background: t.color }}>{t.n}</span>
                    <p className="m-0 font-display text-[30px] font-semibold leading-none" style={{ color: t.color }}>{t.key}</p>
                </div>
                <h3 className="m-0 font-display text-[21px] font-semibold leading-tight text-white">{t.headline}</h3>
                <div className="mt-auto"><TakeawayVisual id={t.visual} color={t.color} narrow /></div>
            </Card>
        </motion.div>
    );
};

const TakeawaysSim = () => {
    const { step, setStep } = useSlideSteps(TAKEAWAY_TABS.length);
    const shown = TAKEAWAYS.filter(t => TAKEAWAYS_BY_STEP[step].includes(t.n));
    const poster = step === TAKEAWAY_TABS.length - 1;
    return (
        <Shell tabs={TAKEAWAY_TABS} step={step} setStep={setStep} layoutId="takeaway-tabs">
            {poster
                ? <div className="grid min-w-0 flex-1 grid-cols-3 grid-rows-2 gap-3">{shown.map((t, i) => <Small key={t.n} t={t} i={i} />)}</div>
                : <div key={step} className="flex min-w-0 flex-1 gap-3">{shown.map((t, i) => <Big key={t.n} t={t} i={i} />)}</div>}
        </Shell>
    );
};

export default TakeawaysSim;
