import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { Card, Frame, Swap, Tag } from './ato3/Frame';
import { CorrectionScene, JuiceScene, PH, PlaceboScene, PW, SaltScene, TimelineStrip, TrialScene } from './ato3/PioneerScenes';
import { PIONEER_CARDS, PIONEER_FEET, PIONEER_TABS } from './ato3/pioneers.content';
import { CountText } from './ato3/beat';
import { C } from './kit/palette';
import { KeyFact, Reveal } from './kit/rhythm';

/**
 * Slide 40 — "Do Sal à Beterraba". Três estudos em dois anos (Karolinska 2007 → Exeter 2009 → Exeter 2011)
 * e o passo final com as três correções do campo: a fonte, o placebo e a régua.
 */

/** Passo final: o mesmo efeito, três réguas. */
const LessonCard = () => (
    <Card tag="O MESMO ÍON, TRÊS RÉGUAS" color={C.nitrate}>
        <Reveal order={1} className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-baseline">
            <CountText text="−5,4%" className="font-display text-[2rem] font-semibold" style={{ color: C.nitrite }} />
            <span className="text-[16px] text-gray-100 leading-snug">de O₂ na carga submáxima (2007)</span>
            <CountText text="+16%" className="font-display text-[2rem] font-semibold" style={{ color: C.nitrate }} />
            <span className="text-[16px] text-gray-100 leading-snug">no tempo até a exaustão (2009)</span>
            <span className="font-display text-[2rem] font-semibold" style={{ color: C.no }}>
                <KeyFact color={C.no}><CountText text="−2,7%" /></KeyFact>
            </span>
            <span className="text-[16px] text-gray-100 leading-snug">no tempo de prova de 16,1 km (2011)</span>
        </Reveal>
        <Reveal order={2}><p className="text-[16px] leading-snug text-gray-300">Cada correção deixou o número menor e mais parecido com uma competição.</p></Reveal>
    </Card>
);

const COLORS = { sal: C.nitrite, suco: C.nitrate, placebo: C.placebo, prova: C.no } as const;

const PioneersSim = () => {
    const { step, setStep } = useSlideSteps(PIONEER_TABS.length);
    const reduce = useReducedMotion() ?? false;
    const card = step < 4 ? PIONEER_CARDS[step] : null;
    const upTo = [0, 1, 2, 2, 2][step];

    return (
        <Frame tabs={PIONEER_TABS} step={step} setStep={setStep} layoutId="pioneers-tab" foot={PIONEER_FEET[step]}
            chips={<Tag color={C.nitrate}>{['n = 9', 'n = 8', 'n = 9', 'n = 9', 'três correções'][step]}</Tag>}>
            <div className="h-full grid gap-5" style={{ gridTemplateColumns: `${PW}px 1fr` }}>
                <svg viewBox={`0 0 ${PW} ${PH}`} width={PW} height={PH} role="img" aria-label="Estudos pioneiros do nitrato">
                    <TimelineStrip upTo={upTo} />
                    <motion.g key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        {step === 0 && <SaltScene reduce={reduce} />}
                        {step === 1 && <JuiceScene reduce={reduce} />}
                        {step === 2 && <PlaceboScene reduce={reduce} />}
                        {step === 3 && <TrialScene reduce={reduce} />}
                        {step === 4 && <CorrectionScene reduce={reduce} />}
                    </motion.g>
                </svg>
                <Swap k={step} className="flex flex-col justify-center gap-3">
                    {card ? (
                        <>
                            <Reveal order={1}><span className="font-display text-[3.2rem] leading-none font-semibold" style={{ color: COLORS[card.color] }}>{card.year}</span></Reveal>
                            <Reveal order={2}><Card tag={card.tag} title={card.title} lines={card.lines} color={COLORS[card.color]} /></Reveal>
                        </>
                    ) : <LessonCard />}
                </Swap>
            </div>
        </Frame>
    );
};

export default PioneersSim;
