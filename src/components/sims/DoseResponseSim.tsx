import { useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { br, signed } from './kit/format';
import { C } from './kit/palette';
import { Big, Card, Frame, Swap, Tag } from './ato3/Frame';
import { DoseChart, DW } from './ato3/DoseChart';
import { CONSENSUS, DOSE_FEET, DOSE_TABS, interpolate, O2_COST, TOLERANCE } from './ato3/dose.content';

/**
 * Slide 42 — "Dose: Mais não é Melhor". A curva de Wylie 2013 (4,2/8,4/16,8 mmol): o nitrito sobe com a dose,
 * o custo de O₂ cai mais, a tolerância para em 8,4 mmol. Depois, as faixas dos consensos e uma dose arrastável.
 */

const zone = (d: number): string => {
    if (d < 4.2) return 'abaixo do limiar: 4,2 mmol não mudou nada';
    if (d < 5) return 'ainda abaixo do que os consensos recomendam';
    if (d <= 9) return 'dentro da faixa do IOC (5–9 mmol) e do Delphi';
    if (d <= 16) return 'dentro do Delphi agudo (8–16 mmol), no platô';
    return 'acima do que o consenso recomenda; sem ganho extra';
};

const SideByStep = ({ step, dose }: { step: number; dose: number }) => {
    if (step === 0) return <Card tag="WYLIE 2013 · 10 HOMENS" color={C.nitrate} lines={['70, 140 e 280 mL de beterraba concentrada', '4,2 · 8,4 · 16,8 mmol (260 · 521 · 1.042 mg)', 'Placebo: beterraba depletada de nitrato', 'Teste de ciclismo 2,5 h após a dose']} />;
    if (step === 1) {
        return (
            <Card tag="TEMPO ATÉ A FALHA" color={C.nitrate}>
                <div className="grid grid-cols-3 gap-2">
                    <Big value="0" label="4,2 mmol" color={C.placebo} size="2.2rem" />
                    <Big value="+14%" label="8,4 mmol" color={C.nitrate} size="2.2rem" />
                    <Big value="+12%" label="16,8 mmol" color={C.nitrate} size="2.2rem" />
                </div>
                <p className="text-[16px] leading-snug text-gray-200">Sem ganho adicional de 8,4 para 16,8 mmol (ambos p &lt; 0,05 contra o placebo).</p>
            </Card>
        );
    }
    if (step === 2) {
        return (
            <Card tag="CUSTO DE O₂ × TOLERÂNCIA" color={C.o2}>
                <div className="grid grid-cols-2 gap-3">
                    <Big value="−3,0%" label="O₂ no esforço moderado (16,8 mmol)" color={C.o2} size="2.2rem" />
                    <Big value="+12%" label="tolerância: igual à de 8,4 mmol" color={C.nitrate} size="2.2rem" />
                </div>
                <p className="text-[16px] leading-snug text-gray-200">Dose-resposta bioquímica não é dose-resposta de desempenho.</p>
            </Card>
        );
    }
    if (step === 3) {
        return (
            <Card tag="ONDE FICAM AS RECOMENDAÇÕES" color={C.no}>
                <ul className="flex flex-col gap-2">
                    {CONSENSUS.map(c => <li key={c.id} className="text-[16px] leading-snug text-gray-100"><span className="font-bold text-white">{c.label}:</span> {c.note}</li>)}
                    <li className="text-[16px] leading-snug text-gray-100"><span className="font-bold text-white">Senefeld 2020:</span> sem efeito com 1,6–5,0 mmol/dia; 5,1 a 28,7 mmol/dia, efeito semelhante.</li>
                </ul>
            </Card>
        );
    }
    const tol = interpolate(TOLERANCE, dose);
    const o2 = interpolate(O2_COST, dose);
    return (
        <Card tag="LEITURA NA DOSE ESCOLHIDA" color={C.no}>
            <div className="grid grid-cols-3 gap-2">
                <Big value={br(dose, 1)} label="mmol" color="#fff" size="2.1rem" />
                <Big value={`${signed(tol, 0)}%`} label="tolerância" color={C.nitrate} size="2.1rem" />
                <Big value={`${signed(-o2, 1)}%`} label="custo de O₂" color={C.o2} size="2.1rem" />
            </div>
            <p className="text-[16px] leading-snug text-gray-200">{br(dose * 62, 0)} mg · {zone(dose)}</p>
        </Card>
    );
};

const DoseResponseSim = () => {
    const { step, setStep } = useSlideSteps(DOSE_TABS.length);
    const reduce = useReducedMotion() ?? false;
    const [dose, setDose] = useState(8.4);
    return (
        <Frame tabs={DOSE_TABS} step={step} setStep={setStep} layoutId="dose-tab" foot={DOSE_FEET[step]}
            chips={step === 4 ? <Tag color={C.nitrite}>interpolação ilustrativa</Tag> : <Tag color={C.nitrate}>n = 10 · 1 mmol = 62 mg</Tag>}>
            <div className="h-full grid gap-5" style={{ gridTemplateColumns: `${DW}px 1fr` }}>
                <DoseChart step={step} dose={dose} onDose={setDose} reduce={reduce} />
                <Swap k={step} className="flex flex-col justify-center gap-3"><SideByStep step={step} dose={dose} /></Swap>
            </div>
        </Frame>
    );
};

export default DoseResponseSim;
