import { useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { Card, Frame, Swap, Tag } from './ato3/Frame';
import { Slider } from './ato3/Slider';
import { CW, TimingChart } from './ato3/TimingChart';
import { ForestScene, SustainGrid } from './ato3/TimingPanels';
import { TIMING_FEET, TIMING_TABS, TRAINING_ROWS, verdictFor, WONG_ROWS } from './ato3/timing.content';

/**
 * Slide 43 — "Agudo ou Crônico?". 1) o eixo de 24 h com a janela de 2–3,5 h e uma prova arrastável;
 * 2) agudo × crônico no contrarrelógio curto; 3) 15 dias sem tolerância (Vanhatalo 2010); 4) somado ao treino.
 */

const TimingSim = () => {
    const { step, setStep } = useSlideSteps(TIMING_TABS.length);
    const reduce = useReducedMotion() ?? false;
    const [hours, setHours] = useState(2.5);
    const v = verdictFor(hours);
    return (
        <Frame tabs={TIMING_TABS} step={step} setStep={setStep} layoutId="timing-tab" foot={TIMING_FEET[step]}
            chips={step === 0 ? <Tag color={C.nitrite}>curvas ilustrativas · picos medidos</Tag> : <Tag color={C.nitrate}>{['', 'WONG 2022 · 24 estudos', 'n = 8 · 15 dias', 'HOGWOOD 2023 · n = 228'][step]}</Tag>}>
            <div className="h-full grid gap-5" style={{ gridTemplateColumns: `${CW}px 1fr` }}>
                {step === 0 && <TimingChart hours={hours} reduce={reduce} />}
                {step === 1 && (
                    <ForestScene rows={WONG_ROWS} domain={[-0.4, 0.8]} ticks={[-0.4, 0, 0.4, 0.8]} label="g de Hedges (contrarrelógio de 5–30 min)" sides={['piora', 'melhora']}
                        foot="POON 2025: o tempo até a exaustão rende mais com ≥6 mmol/dia e uso crônico. SENEFELD 2020: 1 a 15 dias de uso, sem diferença." />
                )}
                {step === 2 && <SustainGrid reduce={reduce} />}
                {step === 3 && (
                    <ForestScene rows={TRAINING_ROWS} domain={[-0.4, 0.8]} ticks={[-0.4, 0, 0.4, 0.8]} label="SMD: nitrato + treino × treino sozinho" sides={['pior', 'melhor']}
                        foot="9 estudos, ≥3 semanas de treino, 228 pessoas (72 mulheres), VO₂pico médio 40 ± 18. Nenhum moderador." />
                )}
                <Swap k={step} className="flex flex-col justify-center gap-3">
                    {step === 0 && (
                        <>
                            <Panel className="p-4 flex flex-col gap-2">
                                <Slider label="dose tomada antes da prova" value={hours} min={0} max={12} step={0.5} onChange={setHours}
                                    shown={`${hours.toFixed(1).replace('.', ',')} h`} color={C.no} ends={['na hora', '12 h antes']} />
                                <p className="text-[17px] leading-snug font-semibold" style={{ color: v.color }}>{v.text}</p>
                            </Panel>
                            <Card tag="DE ONDE VÊM OS NÚMEROS" color={C.nitrite} lines={['Nitrato 1–2 h, nitrito 2–3 h; ambos de volta ao basal em ~24 h (Jones 2014)', 'Músculo: 181 nmol/g em 3 h (Kadach 2022)', 'Janela 2–3,5 h (Senefeld 2020); Delphi: 2–4 h']} />
                        </>
                    )}
                    {step === 1 && <Card tag="LEITURA HONESTA" color={C.no} lines={['Crônico g 0,30 e agudo g 0,10: os dois intervalos tocam o zero', 'O sinal do crônico é maior, mas não é um teste de diferença', 'Quase tudo é laboratório e n pequeno']} />}
                    {step === 2 && <Card tag="VANHATALO 2010 · 0,5 L/DIA (5,2 mmol)" color={C.o2} lines={['VO₂ e PA já caem na primeira dose e seguem iguais aos 15 dias', 'Nitrito basal 454 nM; subiu +39%, +25% e +46%', 'Potência de pico só mudou aos 15 dias (322 → 331 W)']} />}
                    {step === 3 && <Card tag="O QUE ISSO SIGNIFICA" color={C.nitrite} lines={['VO₂pico: SMD 0,18 (−0,09 a 0,44), p = 0,19', 'Tempo até a exaustão: SMD 0,08 (−0,21 a 0,37)', 'Não é potencializador de adaptação ao treino']} />}
                </Swap>
            </div>
        </Frame>
    );
};

export default TimingSim;
