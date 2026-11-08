import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { Chip, Panel, StepTabs } from './kit/ui';
import { C } from './kit/palette';
import { EVENTS } from './ato1/nobel/events';
import { renderFigure } from './ato1/nobel/figures';
import { NobelStrip } from './ato1/nobel/NobelStrip';

/**
 * "O Gás que Virou Nobel" (slide 12). Linha do tempo proporcional de 1994 a 2009; cada passo acende um marco
 * com o que aconteceu e uma figura do achado: estômago, língua, Nobel, custo de O₂, Exeter.
 */

const TABS = EVENTS.map(e => e.year);

const NobelTimelineSim = () => {
    const { step, setStep } = useSlideSteps(EVENTS.length);
    const reduce = useReducedMotion() ?? false;
    const event = EVENTS[step];

    return (
        <div className="not-prose flex w-full select-none flex-col gap-3 font-body text-white" style={{ height: 516 }}>
            <div className="flex h-10 items-center justify-between gap-3">
                <StepTabs labels={TABS} step={step} onSelect={setStep} layoutId="nobel-tabs" />
                <Chip color={C.placebo}>linha do tempo em escala de anos</Chip>
            </div>

            <NobelStrip step={step} />

            <Panel state="active" glow={event.color} className="min-h-0 flex-1">
                <motion.div key={step} className="flex h-full gap-8 px-7 py-5"
                    initial={{ opacity: 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.4 }}>
                    <div className="flex w-[440px] shrink-0 flex-col">
                        <p className="font-mono text-[16px] leading-tight" style={{ color: event.color }}>{event.kicker}</p>
                        <h3 className="mt-2 font-display text-[2rem] font-semibold leading-tight text-white">{event.title}</h3>
                        <p className="mt-3 text-[18px] leading-snug text-gray-200">{event.body}</p>
                        <p className="mt-auto border-t border-white/10 pt-2 font-mono text-[16px] leading-tight text-gray-400">{event.source}</p>
                    </div>
                    <div className="min-w-0 flex-1">{renderFigure(event.figure)}</div>
                </motion.div>
            </Panel>
        </div>
    );
};

export default NobelTimelineSim;
