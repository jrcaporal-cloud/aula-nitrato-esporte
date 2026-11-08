import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { signed } from './kit/format';
import { useTween } from './kit/useTween';
import { MEASURE_OPTIONS, RESPONDER_STEPS } from './ato5/responderContent';
import {
    NOISE_SD, RESPONDER_CUT, THETA_ALL, THETA_HALF, TRUE_MEAN, Z_PLAC_ALL, Z_PLAC_HALF, Z_SUPP_ALL, Z_SUPP_HALF,
    ascending, countAbove, countBelow, observed, trueSd,
} from './ato5/responderModel';
import { MarkerNoise, OneWorld, TwoWorlds, type WorldData } from './ato5/ResponderVisuals';
import { sd } from './ato5/stats';
import { BigStat, Segmented, SimFrame, StoryLayout, Tag } from './ato5/ui';

/**
 * "Respondedor Verdadeiro × Falso" (Ato V). Doze atletas com a MESMA resposta verdadeira: o erro de
 * medida gera a dispersão da literatura; dois mundos indistinguíveis no gráfico; o teste certo
 * (DP das mudanças); medir 2× por condição; e a instabilidade do rótulo e do marcador.
 */

const ZEROS = THETA_ALL.map(() => 0);
const Z_SORTED = ascending(Z_SUPP_ALL);

const world = (theta: readonly number[], zSupp: readonly number[], zPlac: readonly number[]): WorldData => {
    const supp = ascending(observed(theta, zSupp, 1));
    const plac = ascending(observed(ZEROS, zPlac, 1));
    return { supp, plac, sdSupp: sd(supp), sdPlac: sd(plac), sdTrue: trueSd(supp, plac) };
};
const HALF = world(THETA_HALF, Z_SUPP_HALF, Z_PLAC_HALF);
const ALL = world(THETA_ALL, Z_SUPP_ALL, Z_PLAC_ALL);

const TONES = [C.nitrite, C.nitrate, C.bacteria, C.no, C.no, C.nitrite];

interface MeasureOverride { step: number; m: number }

const ResponderSim = () => {
    const { step, setStep } = useSlideSteps(RESPONDER_STEPS.length);
    const plan = RESPONDER_STEPS[step];
    const reduce = useReducedMotion() ?? false;
    const [override, setOverride] = useState<MeasureOverride | null>(null);
    const measures = override?.step === 4 ? override.m : 2;
    const kTarget = step === 0 ? 0 : step === 4 ? 1 / Math.sqrt(measures) : 1;
    const k = useTween(kTarget, reduce, 900);

    const values = Z_SORTED.map(z => TRUE_MEAN + NOISE_SD * k * z);
    const settled = Math.abs(k - 1) < 0.02;
    const full = Z_SORTED.map(z => TRUE_MEAN + NOISE_SD * z);
    const shown = step === 4 ? values : step === 1 ? values : values;
    const stats = { above: countAbove(shown, RESPONDER_CUT), below: countBelow(shown, 0), min: Math.min(...shown), max: Math.max(...shown) };
    const singleVisual = step <= 1 || step === 4;

    const title = step === 0  ? 'Resposta verdadeira de cada atleta' : step === 1 ? 'Mudança observada, 1 teste por braço' : `Mudança observada, ${measures} medida${measures > 1 ? 's' : ''} por condição`;
    const sub = step === 0 ? 'os 12 têm o mesmo valor: +4,4%' : 'cada boneco = 1 atleta · linha tracejada = verdade';

    const aside = step === 1 ? (
        <div className="flex gap-5 pt-1">
            <BigStat value={`${signed(Math.min(...full), 0)} a ${signed(Math.max(...full), 0)}%`} label="faixa só por erro de medida" color={C.nitrite} size={28} />
            <BigStat value={`${countAbove(full, RESPONDER_CUT)} e ${countBelow(full, 0)}`} label="“respondedores” e “não”" color={C.noSoft} size={28} />
        </div>
    ) : step === 4 ? (
        <div className="flex gap-5 pt-1">
            <BigStat value={`${stats.min.toFixed(0).replace('-', '−')} a ${signed(stats.max, 0)}%`} label={`faixa com ${measures} medida${measures > 1 ? 's' : ''}`} color={C.nitrite} size={28} />
            <BigStat value={`${stats.above} e ${stats.below}`} label="“respondedores” e “não”" color={C.noSoft} size={28} />
        </div>
    ) : undefined;

    return (
        <SimFrame tabs={RESPONDER_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato5-resp-tab"
            chips={step === 5 ? <Tag color={C.nitrite}>resumo de congresso</Tag> : <Tag color={C.nitrite}>valores ilustrativos</Tag>}>
            <StoryLayout step={step} visualKey={singleVisual ? 'one' : step} headline={plan.headline} text={plan.text} source={plan.source}
                takeaway={plan.takeaway} tone={TONES[step]} aside={aside}
                controls={step === 4 ? <Segmented label="medidas por condição" options={MEASURE_OPTIONS} value={measures} onChange={m => setOverride({ step, m })} /> : undefined}>
                {singleVisual && <OneWorld values={values} colored={settled || step === 4} title={title} sub={sub} stats={step === 0 ? null : stats} showLiterature={step === 1} />}
                {(step === 2 || step === 3) && <TwoWorlds half={HALF} all={ALL} revealed={step === 3} />}
                {step === 5 && <MarkerNoise />}
            </StoryLayout>
        </SimFrame>
    );
};

export default ResponderSim;
