import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { useTween } from './kit/useTween';
import { DELTA_OPTIONS, NOISE_STEPS } from './ato5/noiseContent';
import { CV_TT, NOISE_STUDIES, TYPICAL_N, athletesNeeded, looksBetter } from './ato5/noiseModel';
import { AmannPanels, BellsAndN, NoiseRuler, RepeatStrips } from './ato5/NoiseVisuals';
import { pairedPower } from './ato5/stats';
import { BigStat, Segmented, SimFrame, StoryLayout, Tag } from './ato5/ui';

/**
 * "O Ruído do Teste" (Ato V). O TTE e o contrarrelógio medidos de novo no mesmo atleta, a régua do
 * efeito contra o ruído, o sinal/ruído igual de Amann 2008 e o n necessário para enxergar 1% ou 3%.
 */

interface DeltaOverride { step: number; delta: number }

const TestNoiseSim = () => {
    const { step, setStep } = useSlideSteps(NOISE_STEPS.length);
    const plan = NOISE_STEPS[step];
    const reduce = useReducedMotion() ?? false;
    const [studyId, setStudyId] = useState(NOISE_STUDIES[0].id);
    const [override, setOverride] = useState<DeltaOverride | null>(null);
    const study = NOISE_STUDIES.find(s => s.id === studyId) ?? NOISE_STUDIES[0];

    const target = override?.step === step ? override.delta : (plan.delta ?? 1);
    const delta = useTween(target, reduce, 600);
    const need = athletesNeeded(target);
    const calc = plan.delta !== null;

    const controls = step === 0 ? (
        <Segmented label="" options={NOISE_STUDIES.map(s => ({ value: s.id, label: s.label.replace(' 2007 · ', ' ').replace(' 1996', '') }))}
            value={studyId} onChange={setStudyId} />
    ) : calc ? (
        <Segmented label="efeito real (contrarrelógio)" options={DELTA_OPTIONS} value={target} onChange={v => setOverride({ step, delta: v })} />
    ) : undefined;

    return (
        <SimFrame tabs={NOISE_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato5-noise-tab"
            chips={step === 0 ? <Tag color={C.nitrite}>pontos ilustrativos · CV reais</Tag> : calc ? <Tag color={C.nitrite}>cálculo · conversão ilustrativa</Tag> : null}>
            <StoryLayout step={step} visualKey={calc ? 'calc' : step} headline={plan.headline} text={plan.text} source={plan.source}
                takeaway={plan.takeaway} tone={calc ? C.no : step === 0 ? C.hypoxia : C.nitrate} controls={controls}
                aside={calc ? (
                    <div className="flex gap-5 pt-1">
                        <BigStat value={`${Math.round(looksBetter(target, CV_TT) * 100)}%`} label="parecem melhorar, 1 medida por braço" color={C.noSoft} size={32} />
                        <BigStat value={`${Math.round(pairedPower(TYPICAL_N, target, CV_TT) * 100)}%`} label={`poder com n = ${TYPICAL_N}`} color={C.nitrite} size={32} keyFact />
                    </div>
                ) : undefined}>
                {step === 0 && <RepeatStrips study={study} />}
                {step === 1 && <NoiseRuler />}
                {step === 2 && <AmannPanels />}
                {calc && <BellsAndN delta={delta} nTT={need.tt} nTTE={need.tte} shareTT={looksBetter(delta, CV_TT)} shareTTE={looksBetter(delta * 10, 26.6)} />}
            </StoryLayout>
        </SimFrame>
    );
};

export default TestNoiseSim;
