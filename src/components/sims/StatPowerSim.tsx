import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { br } from './kit/format';
import { useTween } from './kit/useTween';
import { EFFECT_OPTIONS, POWER_STEPS } from './ato5/powerContent';
import { FILTER_STUDIES, TYPICAL_N, nAt80, powerAt } from './ato5/powerModel';
import { FilterDots, MbiBars, PowerChart, ThirtyTests, TypicalStudy } from './ato5/PowerVisuals';
import { BigStat, Segmented, SimFrame, StoryLayout, Tag } from './ato5/ui';

/**
 * "Dez Atletas e uma Esperança" (Ato V). O n típico, os 30 testes por artigo, o poder de um cruzado
 * com 10 atletas para enxergar 1%, o n que faltaria, o filtro da significância e a MBI.
 */

const TONES = [C.nitrite, C.nitrite, C.nitrate, C.no, C.nitrite, C.risk];

const StatPowerSim = () => {
    const { step, setStep } = useSlideSteps(POWER_STEPS.length);
    const plan = POWER_STEPS[step];
    const reduce = useReducedMotion() ?? false;
    const [effect, setEffect] = useState(1);
    const chart = step === 2 || step === 3;
    const nTarget = step === 2 ? TYPICAL_N : nAt80(effect);
    const n = useTween(nTarget, reduce, 800);
    const sig = FILTER_STUDIES.filter(s => s.significant);
    const meanSig = sig.reduce((a, s) => a + s.effect, 0) / Math.max(sig.length, 1);

    return (
        <SimFrame tabs={POWER_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato5-power-tab"
            chips={step >= 1 && step <= 4 ? <Tag color={C.nitrite}>{step === 1 || step === 4 ? 'valores ilustrativos' : 'cálculo · ilustrativo'}</Tag> : null}>
            <StoryLayout step={step} visualKey={chart ? 'chart' : step} headline={plan.headline} text={plan.text} source={plan.source}
                takeaway={plan.takeaway} tone={TONES[step]}
                controls={chart ? <Segmented label="efeito real" options={EFFECT_OPTIONS} value={effect} onChange={setEffect} /> : undefined}
                aside={chart ? (
                    <div className="flex gap-5 pt-1">
                        <BigStat value={`${Math.round(powerAt(Math.round(n), effect) * 100)}%`} label={`poder com n = ${Math.round(n)}`} color={C.nitrate} size={32} />
                        <BigStat value={String(nAt80(effect))} label="atletas para 80% de poder" color={C.noSoft} size={32} />
                    </div>
                ) : step === 4 ? (
                    <div className="flex gap-5 pt-1">
                        <BigStat value={`${sig.length}`} label="de 100 passam de p < 0,05" color={C.nitrite} size={32} />
                        <BigStat value={`${br(meanSig, 1)}%`} label="efeito médio entre eles (real: 1%)" color="#fff" size={32} />
                    </div>
                ) : undefined}>
                {step === 0 && <TypicalStudy />}
                {step === 1 && <ThirtyTests />}
                {chart && <PowerChart effect={effect} n={n} />}
                {step === 4 && <FilterDots />}
                {step === 5 && <MbiBars />}
            </StoryLayout>
        </SimFrame>
    );
};

export default StatPowerSim;
