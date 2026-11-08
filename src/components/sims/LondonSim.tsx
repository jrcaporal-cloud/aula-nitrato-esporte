import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { ArtFrame, ArtSvg } from './ato3/artKit/ArtFrame';
import { Tag } from './ato3/Frame';
import { CompareArt } from './ato3/londresArt/CompareArt';
import { CourseArt } from './ato3/londresArt/CourseArt';
import { LabArt } from './ato3/londresArt/LabArt';
import { PodiumArt } from './ato3/londresArt/PodiumArt';
import { LONDON_FEET, LONDON_TABS } from './ato3/london.content';

/**
 * Slide 28 — "A Reta de Londres". O ensaio que simulou o percurso olímpico (Lane 2014) e o comunicado
 * de 2012 (Exeter), que é relato e não ensaio. Arte: laboratório frio (ergômetros, potência medida) ×
 * estádio quente (pódio, comunicado); o último passo põe os dois mostradores lado a lado.
 */

const CHIPS = [
    <Tag key="0" color={C.o2}>Lane 2014 · n = 24</Tag>,
    <Tag key="1" color={C.nitrite}>ensaio duplo-cego</Tag>,
    <Tag key="2" color={C.risk}>relato, não ensaio</Tag>,
    <Tag key="3" color={C.nitrate}>laboratório × pódio</Tag>,
];

const LondonSim = () => {
    const { step, setStep } = useSlideSteps(LONDON_TABS.length);
    const reduce = useReducedMotion() ?? false;
    return (
        <ArtFrame tabs={LONDON_TABS} step={step} setStep={setStep} layoutId="london-tab" caption={LONDON_FEET[step]} chips={CHIPS[step]}>
            <ArtSvg label="Londres 2012: laboratório e pódio">
                <g key={step}>
                    {step === 0 && <CourseArt reduce={reduce} />}
                    {step === 1 && <LabArt reduce={reduce} />}
                    {step === 2 && <PodiumArt reduce={reduce} />}
                    {step === 3 && <CompareArt reduce={reduce} />}
                </g>
            </ArtSvg>
        </ArtFrame>
    );
};

export default LondonSim;
