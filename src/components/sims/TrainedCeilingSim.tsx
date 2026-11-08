import { useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { CEILING_FEET, CEILING_TABS } from './ato3/ceiling.content';
import { CeilingChart, KW } from './ato3/CeilingChart';
import { PkScene, ReasonsGrid } from './ato3/CeilingScenes';
import { CeilingSide } from './ato3/CeilingSide';
import { Frame, Swap, Tag } from './ato3/Frame';

/**
 * Slide 45 — "O Teto do Treinado". Oito ensaios no eixo de VO₂max, a linha que cai até ~0, o corte de consenso,
 * a farmacocinética que responde menos, as quatro razões e um atleta arrastável (leitura qualitativa, ilustrativa).
 */

const CHIPS = [
    <Tag key="0" color={C.nitrate}>Δ% calculado das médias</Tag>,
    <Tag key="1" color={C.hypoxia}>linha: dado secundário</Tag>,
    <Tag key="2" color={C.nitrite}>consenso × meta-análise</Tag>,
    <Tag key="3" color={C.nitrite}>alturas ilustrativas</Tag>,
    <Tag key="4" color={C.bacteria}>hipóteses de Jones 2014</Tag>,
    <Tag key="5" color={C.nitrite}>ilustrativo · caso fictício</Tag>,
];

const TrainedCeilingSim = () => {
    const { step, setStep } = useSlideSteps(CEILING_TABS.length);
    const reduce = useReducedMotion() ?? false;
    const [vo2, setVo2] = useState(52);
    return (
        <Frame tabs={CEILING_TABS} step={step} setStep={setStep} layoutId="ceiling-tab" foot={CEILING_FEET[step]} chips={CHIPS[step]}>
            <div className="h-full grid gap-5" style={{ gridTemplateColumns: `${KW}px 1fr` }}>
                {step === 3 ? <PkScene reduce={reduce} /> : step === 4 ? <ReasonsGrid /> : <CeilingChart step={step} vo2={vo2} onVo2={setVo2} reduce={reduce} />}
                <Swap k={step} className="flex flex-col justify-center"><CeilingSide step={step} vo2={vo2} /></Swap>
            </div>
        </Frame>
    );
};

export default TrainedCeilingSim;
