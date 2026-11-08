import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { br } from './kit/format';
import { PkChart } from './ato2a/PkChart';
import { DOSES, axisOf, timeOf } from './ato2a/pkModel';
import { DOSE_RESULTS, PK_STEPS } from './ato2a/pk.content';
import { useStepValue } from './ato2a/hooks';
import { Reveal } from './kit/rhythm';
import { IllustrativeChip, Narration, SimFrame, Slider, SourceLine, StatList } from './ato2a/ui';

/**
 * "Do Copo ao Sangue" (Ato II). Linha do tempo de uma dose: nitrato plasmático, nitrito plasmático e
 * nitrato muscular nas 24 h, com cursor de tempo arrastável. Picos e meia-vida são dados; a forma
 * entre eles é ilustrativa. No último passo o nitrito aparece nas doses de 4,2, 8,4 e 16,8 mmol.
 */
const TABS = PK_STEPS.map(s => s.tab);

const PharmacokineticsSim = () => {
    const { step, setStep } = useSlideSteps(PK_STEPS.length);
    const plan = PK_STEPS[step];
    const [t, setT] = useStepValue(step, plan.t);
    const [dose, setDose] = useState(1);
    const byDose = plan.byDose === true;

    return (
        <SimFrame tabs={TABS} step={step} setStep={setStep} layoutId="ato2a-pk" hint3d
            chips={<IllustrativeChip text="forma entre os picos: ilustrativa" />}>
            <div className="flex w-[690px] shrink-0 flex-col gap-2">
                <Panel className="h-[336px]">
                    <PkChart t={t} onTime={setT} focus={plan.focus} byDose={byDose} doseIndex={dose} />
                </Panel>
                <Panel className="flex h-[104px] flex-col justify-center gap-1 px-5">
                    <div className="flex items-end gap-8">
                        <Slider label="Tempo após a dose" value={axisOf(t)} from={0} to={1} onChange={u => setT(timeOf(u))}
                            color="#fff" display={`${br(t, 1)} h`} />
                        {byDose && (
                            <div className="flex shrink-0 gap-1 pb-1">
                                {DOSES.map((d, i) => (
                                    <button key={d.mmol} type="button" onClick={() => setDose(i)}
                                        className="cursor-pointer rounded-lg border px-2.5 py-1 font-mono text-[15px] transition-colors"
                                        style={{ borderColor: i === dose ? C.nitrite : 'rgba(255,255,255,0.15)', color: i === dose ? '#07050B' : '#E5E7EB',
                                            background: i === dose ? C.nitrite : 'transparent', fontWeight: i === dose ? 700 : 500 }}>
                                        {br(d.mmol, 1)} mmol
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <p className="text-[14px] text-gray-400">Arraste o cursor no gráfico ou no controle. Cada curva está na escala do seu próprio pico.</p>
                </Panel>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Panel className="flex h-[210px] flex-col gap-2 p-3.5">
                    <Narration key={step} headline={plan.headline}>{plan.text}</Narration>
                    <SourceLine key={`src-${step}`}>{plan.source}</SourceLine>
                </Panel>
                <Panel key={step} className="flex min-h-0 flex-1 flex-col justify-center gap-3 p-4">
                    {byDose ? (
                        DOSE_RESULTS.map((r, i) => (
                            <Reveal key={r.head} order={1} delay={i * 0.08} className="flex flex-col rounded-lg border px-3 py-1.5 transition-colors"
                                style={{ borderColor: i === dose ? `${C.nitrite}b3` : 'rgba(255,255,255,0.08)', background: i === dose ? 'rgba(251,191,36,0.07)' : 'transparent' }}>
                                <span className="font-mono text-[15px] font-semibold" style={{ color: C.nitrite }}>{r.head}</span>
                                <span className="text-[16px] leading-snug text-gray-100">{r.body}</span>
                            </Reveal>
                        ))
                    ) : (
                        <StatList items={plan.stats} size={42} />
                    )}
                </Panel>
            </div>
        </SimFrame>
    );
};

export default PharmacokineticsSim;
