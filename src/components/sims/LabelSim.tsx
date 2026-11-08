import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { LabelGlassesArt } from './ato6/arte-a/LabelGlassesArt';
import { LabelShelfArt } from './ato6/arte-a/LabelShelfArt';
import { LabelWhyArt } from './ato6/arte-a/LabelWhyArt';
import { LABEL_SOURCE, LABEL_TABS } from './ato6/labelContent';
import { FadeSwap, Illustrative, Shell, Story } from './ato6/ui';
import { CountText } from './ato5/countText';
import { KeyFact } from './kit/rhythm';

/**
 * Slide 45 — O Rótulo Confere? Quatro passos: a gôndola (24 produtos, 21 empresas, 45 lotes), só 5 acendem acima de 5 mmol,
 * rótulo × medido em copos e a balança com as causas da variação. A posição dos frascos é ilustrativa:
 * o estudo não publica o valor de cada um dos 24.
 */
const LabelSim = () => {
    const { step, setStep } = useSlideSteps(LABEL_TABS.length);

    const stories = [
        { kicker: 'a gôndola', color: C.nitrate, title: '24 frascos, uma pergunta', text: 'Comprados nos EUA e dosados em laboratório: o nitrato de cada produto, lote a lote.', source: LABEL_SOURCE },
        { kicker: 'o corte de 5 mmol', color: C.no, title: 'Só 5 chegam à dose mínima', text: 'Só 5 dos 24 deram 5 mmol ou mais por porção, de forma consistente. O resto fica abaixo ou oscila de lote para lote.', source: LABEL_SOURCE },
        { kicker: 'rótulo × medido', color: C.hypoxia, title: 'O rótulo pode errar por 3×', text: 'O shot de 70 mL confere (6,41 ± 0,60 mmol, ≈ 400 mg). Um produto com 8,06 mmol no rótulo mediu 2,39; os pós ficaram entre 0,4 e 2,6.', source: LABEL_SOURCE },
        { kicker: 'por que erra', color: C.nitrite, title: 'Dose é uma conta, não uma marca', text: 'Concentração, lote e formato mudam o que chega ao copo. No consultório: pedir laudo e fazer a conta em mmol por porção.', source: LABEL_SOURCE },
    ] as const;
    const s = stories[step];
    const counts = (
        <div className="grid grid-cols-3 gap-2 text-center">
            {[['24', 'produtos'], ['21', 'empresas'], ['45', 'lotes']].map(([n, l]) => (
                <div key={l} className="rounded-xl border border-white/15 py-1.5">
                    <p className="m-0 font-display text-[28px] font-semibold leading-none text-white"><CountText text={n} /></p>
                    <p className="m-0 mt-1 text-[14px] text-gray-300">{l}</p>
                </div>
            ))}
        </div>
    );

    return (
        <Shell tabs={LABEL_TABS} step={step} setStep={setStep} layoutId="label-tabs" chips={step <= 1 ? <Illustrative>ilustrativo na disposição</Illustrative> : undefined}>
            <Story id={step} width={284} {...s}>
                {step === 0 && counts}
                {step === 1 && <p className="m-0 font-display text-[44px] font-semibold leading-none" style={{ color: C.no }}><KeyFact color={C.no}><CountText text="5" /></KeyFact> <span className="text-[26px] text-gray-200">de 24</span></p>}
            </Story>
            {step <= 1 ? <LabelShelfArt lit={step === 1} /> : <FadeSwap id={step} className="flex min-w-0 flex-1">{step === 2 ? <LabelGlassesArt /> : <LabelWhyArt />}</FadeSwap>}
        </Shell>
    );
};

export default LabelSim;
