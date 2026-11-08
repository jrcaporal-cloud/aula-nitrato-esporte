import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { DumbbellView, WhyView } from './ato6/LabelViews';
import { LABEL_SOURCE, LABEL_TABS } from './ato6/labelContent';
import { Shelf } from './ato6/Shelf';
import { Card, FadeSwap, Illustrative, Shell, Story } from './ato6/ui';

/**
 * Slide 81 — O Rótulo Confere? Quatro passos: a gôndola (24 produtos, 21 empresas, 45 lotes), só 5 passam de 5 mmol,
 * rótulo × medido em cinco produtos e as causas da variação (categoria, lote, shot de 2013 × de hoje).
 * A posição dos frascos é ilustrativa: o estudo não publica o valor de cada um dos 24.
 */
const LabelSim = () => {
    const { step, setStep } = useSlideSteps(LABEL_TABS.length);

    const stories = [
        { kicker: 'a gôndola', color: C.nitrate, title: '24 frascos, uma pergunta', text: 'Foram comprados nos EUA 24 produtos de 21 empresas, em 45 lotes, e o nitrato de cada um foi dosado em laboratório.', source: LABEL_SOURCE },
        { kicker: 'o corte de 5 mmol', color: C.no, title: 'Só 5 chegam à dose mínima', text: 'Apenas 5 dos 24 produtos deram 5 mmol ou mais por porção, de forma consistente. O resto fica abaixo ou oscila de lote para lote.', source: LABEL_SOURCE },
        { kicker: 'rótulo × medido', color: C.hypoxia, title: 'O rótulo pode errar por 3×', text: 'O shot de 70 mL confere (6,41 ± 0,60 mmol, ≈ 400 mg). Mas um produto com 8,06 mmol no rótulo mediu 2,39, e os pós ficaram entre 0,4 e 2,6 mmol.', source: LABEL_SOURCE },
        { kicker: 'por que erra', color: C.nitrite, title: 'Dose é uma conta, não uma marca', text: 'Concentração, lote e formato mudam o que chega ao copo. Para o consultório: pedir laudo e fazer a conta em mmol por porção.', source: LABEL_SOURCE },
    ] as const;
    const s = stories[step];

    const left = (
        <Story id={step} width={330} {...s}>
            {step === 0 && (
                <div className="grid grid-cols-3 gap-2 text-center">
                    {[['24', 'produtos'], ['21', 'empresas'], ['45', 'lotes']].map(([n, l]) => (
                        <div key={l} className="rounded-xl border border-white/15 py-2">
                            <p className="m-0 font-display text-[30px] font-semibold leading-none text-white">{n}</p>
                            <p className="m-0 mt-1 text-[15px] text-gray-300">{l}</p>
                        </div>
                    ))}
                </div>
            )}
            {step === 1 && <p className="m-0 font-display text-[44px] font-semibold leading-none" style={{ color: C.no }}>5 <span className="text-[26px] text-gray-200">de 24</span></p>}
        </Story>
    );

    return (
        <Shell tabs={LABEL_TABS} step={step} setStep={setStep} layoutId="label-tabs" chips={step <= 1 ? <Illustrative>ilustrativo na disposição</Illustrative> : undefined}>
            {left}
            {step <= 1 ? (
                <Card className="flex min-w-0 flex-1"><Shelf phase={step === 0 ? 'shelf' : 'sorted'} /></Card>
            ) : (
                <FadeSwap id={step} className="flex min-w-0 flex-1">{step === 2 ? <DumbbellView /> : <WhyView />}</FadeSwap>
            )}
        </Shell>
    );
};

export default LabelSim;
