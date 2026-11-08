import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { ALT_FEET, ALT_TABS, KANG_ROWS } from './ato3/altitude.content';
import { AH, AW, HypothesisScene, NullsScene, ScoreCols, TwelveScene } from './ato3/AltitudeScenes';
import { Big, Card, Frame, Swap, Tag } from './ato3/Frame';
import { ForestScene } from './ato3/TimingPanels';

/**
 * Slide 47 — "Na Altitude". Plausibilidade forte × evidência mista: a hipótese (Vanhatalo 2011), os 12 corredores
 * (Shannon 2016), os nulos em atletas ≥60–66, a meta-análise (Kang 2025) e o placar.
 */

const CHIPS = ['n = 9 · extensão de joelho', 'n = 12 · todos melhoraram', 'nulos em VO₂ ≥60', 'meta-análise · 9 ECRs', 'plausível × misto'];

const Side = ({ step }: { step: number }) => {
    if (step === 0) return <Card tag="VANHATALO 2011" color={C.nitrate} lines={['9 saudáveis, beterraba 0,75 L em 24 h (9,3 mmol) × depletada (0,006 mmol)', 'Nitrito 194 × 129 nM (hipóxia) e 142 nM (normóxia)', 'O nitrito vira NO justamente onde falta O₂']} />;
    if (step === 1) {
        return (
            <Card tag="SHANNON 2016" color={C.no}>
                <Big value="12 / 12" label="melhoraram o 1.500 m" color={C.no} size="2.4rem" />
                <p className="text-[16px] leading-snug text-gray-200">138 mL de beterraba (~15,2 mmol) 3 h antes. SpO₂ 88,4 × 86,5%. Contrasta com o "teto" do nível do mar.</p>
            </Card>
        );
    }
    if (step === 2) return <Card tag="O MESMO CENÁRIO, OUTRO RESULTADO" color={C.hypoxia} lines={['Arnold: ~7 mmol, 2,5 h antes; economia, SpO₂ e VO₂ iguais', 'MacLeod: ~6 mmol, 2 h antes; normóxia e hipóxia sem efeito', 'Faixa de dúvida inclui zero e vai de −60 a +38 s']} />;
    if (step === 3) return <Card tag="O QUE A META-ANÁLISE VÊ" color={C.o2} lines={['Kang 2025: 9 ECRs, n = 161; nitrito subiu (SMD 2,25; I² 70%)', 'Senefeld 2020: a FiO₂ não moderou o efeito', 'Altitude terrestre: poucos estudos e nada em VO₂ ou SpO₂ (Shannon 2017)']} />;
    return <Card tag="COMO CONTAR ISSO" color={C.nitrite} lines={['Plausibilidade: forte (nitrito → NO quando falta O₂)', 'Evidência: mista, n de 8 a 15, quase tudo em altitude simulada', 'Não confundir com certeza de ganho em atleta de elite']} />;
};

const AltitudeSim = () => {
    const { step, setStep } = useSlideSteps(ALT_TABS.length);
    const reduce = useReducedMotion() ?? false;
    return (
        <Frame tabs={ALT_TABS} step={step} setStep={setStep} layoutId="alt-tab" foot={ALT_FEET[step]} chips={<Tag color={C.o2}>{CHIPS[step]}</Tag>}>
            <div className="h-full grid gap-5" style={{ gridTemplateColumns: `${AW}px 1fr` }}>
                {step === 3 ? (
                    <ForestScene rows={KANG_ROWS} domain={[-1, 1]} ticks={[-1, -0.5, 0, 0.5, 1]} label="SMD (nitrato × placebo) em altitude" sides={['pior', 'melhor']}
                        foot="9 ECRs, n = 161: desfechos fisiológicos, não de desempenho. I² 0% nos dois." />
                ) : step === 4 ? <ScoreCols /> : (
                    <svg viewBox={`0 0 ${AW} ${AH}`} width={AW} height={AH} role="img" aria-label="Nitrato em hipóxia e altitude">
                        {step === 0 && <HypothesisScene reduce={reduce} />}
                        {step === 1 && <TwelveScene reduce={reduce} />}
                        {step === 2 && <NullsScene reduce={reduce} />}
                    </svg>
                )}
                <Swap k={step} className="flex flex-col justify-center"><Side step={step} /></Swap>
            </div>
        </Frame>
    );
};

export default AltitudeSim;
