import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { ALT_FEET, ALT_TABS } from './ato3/altitude.content';
import { Backdrop } from './ato3/altitudeArt/Backdrop';
import { HypothesisArt } from './ato3/altitudeArt/HypothesisArt';
import { MetaArt } from './ato3/altitudeArt/MetaArt';
import { NullsArt } from './ato3/altitudeArt/NullsArt';
import { RunnersArt } from './ato3/altitudeArt/RunnersArt';
import { ScoreArt } from './ato3/altitudeArt/ScoreArt';
import { ArtFrame, ArtSvg } from './ato3/artKit/ArtFrame';
import { Tag } from './ato3/Frame';

/**
 * Slide 27 — "Na Altitude". Plausibilidade forte × evidência mista: a hipótese (Vanhatalo 2011), os 12 corredores
 * (Shannon 2016), os nulos em atletas ≥60–66, a meta-análise (Kang 2025) e o placar. A arte é uma montanha:
 * o ar rareia com a altura, e cada passo planta algo nela (cronômetros, corredores, pista, indicadores, bandeiras).
 */

const CHIPS = ['n = 9 · extensão de joelho', 'n = 12 · todos melhoraram', 'nulos em VO₂ ≥60', 'meta-análise · 9 ECRs', 'plausível × misto'];

/** Quanto da serra principal aparece em cada passo (a cena do passo ocupa o resto). */
const MOUNTAIN = [1, 1, 0.5, 0.3, 0.35] as const;

const AltitudeSim = () => {
    const { step, setStep } = useSlideSteps(ALT_TABS.length);
    const reduce = useReducedMotion() ?? false;
    return (
        <ArtFrame tabs={ALT_TABS} step={step} setStep={setStep} layoutId="alt-tab" caption={ALT_FEET[step]} chips={<Tag color={C.o2}>{CHIPS[step]}</Tag>}>
            <ArtSvg label="Nitrato em hipóxia e altitude">
                <Backdrop reduce={reduce} mountain={MOUNTAIN[step]} gauge={step < 2} dots={step !== 3} />
                <g key={step}>
                    {step === 0 && <HypothesisArt reduce={reduce} />}
                    {step === 1 && <RunnersArt reduce={reduce} />}
                    {step === 2 && <NullsArt reduce={reduce} />}
                    {step === 3 && <MetaArt reduce={reduce} />}
                    {step === 4 && <ScoreArt reduce={reduce} />}
                </g>
            </ArtSvg>
        </ArtFrame>
    );
};

export default AltitudeSim;
