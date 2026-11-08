import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Reveal } from './kit/rhythm';
import { Panel } from './kit/ui';
import { JUDO_STEPS } from './ato4/judoContent';
import { FactList, Narration, SimFrame, Src, Tag } from './ato4/shell';
import { DojoArt } from './ato4/tatameArt/DojoArt';

/**
 * Slide 33 — "O Dia de Judô" (Karabağ 2026). 35 judocas, 5 lutas no dia: a cafeína ajuda cedo e "acaba" na quinta,
 * o suco de beterraba ajuda justamente na quinta. Arte: cinco tatames em linha do tempo, o cansaço subindo e uma
 * faixa de efeito por condição. Estudo único e recente: o selo "hipótese" fica visível o tempo todo e vira carimbo no fim.
 */

const JudoDaySim = () => {
    const { step, setStep } = useSlideSteps(JUDO_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const info = JUDO_STEPS[step];
    const last = step === JUDO_STEPS.length - 1;
    return (
        <SimFrame tabs={JUDO_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato4-judo-tab"
            chips={<Tag color={C.nitrite}>estudo único · hipótese</Tag>}>
            <div className="flex h-full flex-col gap-2">
                <Panel state={last ? 'active' : 'idle'} glow={C.nitrite}>
                    <div style={{ height: 300 }}><DojoArt step={step} reduce={reduce} /></div>
                </Panel>
                <Panel className="flex flex-1 min-h-0 gap-5 px-5 py-2">
                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <Narration stepKey={step} headline={info.headline} text={info.text} />
                    </div>
                    <div className="flex w-[330px] shrink-0 flex-col justify-between gap-1.5">
                        <FactList key={step} rows={info.facts} dense hit={step === 0 ? { index: 0 } : undefined} />
                        <Reveal key={`${step}-src`} order={2}><Src>{info.source}</Src></Reveal>
                    </div>
                </Panel>
            </div>
        </SimFrame>
    );
};

export default JudoDaySim;
