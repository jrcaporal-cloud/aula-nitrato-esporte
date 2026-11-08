import { useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { br } from './kit/format';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { AmannBars } from './ato3/AmannBars';
import { Big, Card, Frame, Swap, Tag } from './ato3/Frame';
import { Slider } from './ato3/Slider';
import { TW, TteBars, type GroupSpec } from './ato3/TteBars';
import { CV_TT, CV_TTE, RATE_AMANN, RATE_JONES, RATE_SPREAD, TTE_FEET, TTE_PRESETS, TTE_TABS } from './ato3/tteTt.content';

/**
 * Slide 41 — "+16% ou 1%?". Simulador do porquê o TTE infla o efeito: a mudança real no contrarrelógio,
 * multiplicada pela taxa de câmbio, vira o "por cento" do TTE — e o ruído do teste cresce junto.
 * Passos 1–3 usam o modelo (ilustrativo); o 4º mostra dados reais de Amann 2008; o 5º traduz uma manchete.
 */

interface Knobs { step: number; real: number; rate: number; headline: number }
const PCT = (n: number, d = 1) => `${br(n, d)}%`;

const groupsFor = (step: number, real: number, rate: number, headline: number): readonly GroupSpec[] => {
    const tte = real * rate;
    const tteBar = (id: string, v: number) => ({ id, value: v, text: `+${br(v, 1)}%`, color: C.nitrite });
    const ttBar = { id: 'tt', value: real, text: `+${br(real, 1)}%`, color: C.no };
    if (step === 1) {
        const rates = [rate * (1 - RATE_SPREAD), rate, rate * (1 + RATE_SPREAD)];
        return [
            { id: 'tte', label: 'TTE de três atletas', sub: 'mesma melhora real', bars: rates.map((r, i) => tteBar(`a${i}`, real * r)) },
            { id: 'tt', label: 'Contrarrelógio', sub: 'o mesmo para todos', bars: [ttBar] },
        ];
    }
    if (step === 2) {
        return [
            { id: 'tte', label: 'Tempo até a exaustão', sub: 'carga fixa até falhar', bars: [tteBar('tte', tte), { id: 'n1', value: CV_TTE, text: `±${br(CV_TTE, 1)}%`, color: C.nitrite, ghost: true }] },
            { id: 'tt', label: 'Contrarrelógio', sub: 'trabalho fixo, o mais rápido', bars: [ttBar, { id: 'n2', value: CV_TT, text: `±${br(CV_TT, 2)}%`, color: C.no, ghost: true }] },
        ];
    }
    if (step === 4) {
        return [
            { id: 'tte', label: 'Manchete: TTE', sub: 'o número que circula', bars: [tteBar('h', headline)] },
            { id: 'tt', label: 'No relógio da prova', sub: 'de ÷15 a ÷7,9 (cálculo)', bars: [{ id: 'w', value: headline / RATE_JONES, text: `${br(headline / RATE_JONES, 1)}–${br(headline / RATE_AMANN, 1)}%`, color: C.no, range: [headline / RATE_JONES, headline / RATE_AMANN] }] },
        ];
    }
    return [
        { id: 'tte', label: 'Tempo até a exaustão', sub: 'carga fixa até falhar', bars: [tteBar('tte', tte)] },
        { id: 'tt', label: 'Contrarrelógio', sub: 'trabalho fixo, o mais rápido', bars: [ttBar] },
    ];
};

const SideCard = ({ step, real }: { step: number; real: number }) => {
    if (step === 0) return <Card tag="BAILEY 2009 · A ORIGEM DO NÚMERO" color={C.nitrate} lines={['TTE de 583 para 675 s (+16%)', '500 mL/dia de suco, 5,6 mmol, 6 dias', 'Jones 2014: ~15% de TTE ≈ 1% de contrarrelógio']} />;
    if (step === 1) return <Card tag="HINCKSON 2005 · 8 CORREDORES" color={C.nitrite} lines={['TTE equivale a 1,0–2,6% de contrarrelógio', 'Os fatores de conversão variam ~28% entre corredores', 'Taxa típica: cerca de 1 para 10']} />;
    if (step === 2) {
        return (
            <Card tag="SINAL ÷ RUÍDO (CÁLCULO)" color={C.no}>
                <div className="grid grid-cols-2 gap-3">
                    <Big value={br(real * RATE_AMANN / CV_TTE, 2)} label={`TTE: ${br(real * RATE_AMANN, 1)} ÷ ${br(CV_TTE, 1)}`} color={C.nitrite} size="2rem" />
                    <Big value={br(real / CV_TT, 2)} label={`TT: ${br(real, 1)} ÷ ${br(CV_TT, 2)}`} color={C.no} size="2rem" />
                </div>
                <p className="text-[15px] leading-snug text-gray-300">CV: Jeukendrup 1996 (30 treinados). Laursen 2007: 15,1% × 2,0% em 5 km.</p>
            </Card>
        );
    }
    return null;
};

const TteTtSim = () => {
    const { step, setStep } = useSlideSteps(TTE_TABS.length);
    const reduce = useReducedMotion() ?? false;
    const preset = TTE_PRESETS[step];
    const [ov, setOv] = useState<Knobs | null>(null);
    const knobs: Knobs = ov?.step === step ? ov : { step, real: preset.real, rate: preset.rate, headline: 16 };
    const set = (patch: Partial<Knobs>) => setOv({ ...knobs, ...patch, step });
    const chip = step === 3 ? <Tag color={C.no}>dados reais · n = 8</Tag> : step === 4 ? <Tag color={C.nitrite}>cálculo</Tag> : <Tag>valores ilustrativos</Tag>;

    return (
        <Frame tabs={TTE_TABS} step={step} setStep={setStep} layoutId="tte-tab" foot={TTE_FEET[step]} chips={chip}>
            <div className="h-full grid gap-5" style={{ gridTemplateColumns: `${TW}px 1fr` }}>
                {step === 3 ? <AmannBars /> : <TteBars groups={groupsFor(step, knobs.real, knobs.rate, knobs.headline)} reduce={reduce} />}
                <Swap k={step} className="flex flex-col justify-center gap-3">
                    {step === 3 && (
                        <Card tag="AMANN 2008 · 3 TTE + 3 TT DE 5 KM POR CICLISTA" color={C.no}>
                            <div className="grid grid-cols-2 gap-3">
                                <Big value="×8" label="TTE ÷ TT em hipóxia" color={C.nitrite} size="2.2rem" />
                                <Big value="×30" label="TTE ÷ TT em hiperóxia" color={C.nitrite} size="2.2rem" />
                            </div>
                            <p className="text-[16px] leading-snug text-gray-200">Os mesmos 8 ciclistas, o mesmo ar. A sensibilidade (mudança ÷ erro) dos dois testes é semelhante.</p>
                        </Card>
                    )}
                    {step === 4 && (
                        <Panel className="p-4 flex flex-col gap-3">
                            <Slider label="TTE da manchete" value={knobs.headline} min={4} max={30} step={1} onChange={v => set({ headline: v })}
                                shown={`+${PCT(knobs.headline, 0)}`} color={C.nitrite} />
                            <Big value={`≈ ${br(knobs.headline / RATE_JONES, 1)} a ${br(knobs.headline / RATE_AMANN, 1)}%`} label="no tempo de prova (taxas 1:15 e 1:7,9)" color={C.no} size="2.2rem" />
                            <p className="text-[15px] leading-snug text-gray-300">Detecta? Sim, a sensibilidade é igual. Comunica? Não: a taxa muda de estudo para estudo e de atleta para atleta.</p>
                        </Panel>
                    )}
                    {step < 3 && (
                        <>
                            <Panel className="p-4 flex flex-col gap-4">
                                <Slider label="mudança real (contrarrelógio)" value={knobs.real} min={0.5} max={2} step={0.1} onChange={v => set({ real: v })}
                                    shown={`+${PCT(knobs.real)}`} color={C.no} />
                                <Slider label="taxa de câmbio do atleta (TTE ÷ TT)" value={knobs.rate} min={RATE_AMANN} max={RATE_JONES} step={0.1} onChange={v => set({ rate: v })}
                                    shown={`1 : ${br(knobs.rate, 1)}`} color={C.nitrite} ends={['1 : 7,9 Amann', '1 : 15 Jones']} />
                            </Panel>
                            <SideCard step={step} real={knobs.real} />
                        </>
                    )}
                </Swap>
            </div>
        </Frame>
    );
};

export default TteTtSim;
