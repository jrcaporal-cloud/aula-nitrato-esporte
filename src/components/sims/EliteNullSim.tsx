import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Reveal } from './kit/rhythm';
import { ELITE_FEET, ELITE_TABS } from './ato3/elite.content';
import { EliteForest, EW } from './ato3/EliteForest';
import { RespondersScene } from './ato3/EliteScenes';
import { Big, Card, Frame, Swap, Tag } from './ato3/Frame';

/**
 * Slide 46 — "A Floresta de Nulos". Estudos em atletas de elite entrando em grupos; depois o poder
 * (n de 8 a 24 × 16–65 necessários, Hopkins 1999) e os dois "respondedores" de Boorsma 2014 contra o ruído do teste.
 */

const Side = ({ step }: { step: number }) => {
    if (step === 0) return <Reveal order={2}><Card tag="PEACOCK 2012 · CHRISTENSEN 2013" color={C.nitrate} lines={['Esquiadores juniores: KNO₃ ≈ 9,9 mmol, 2,5 h antes; 5 km: 1005 × 996 s', 'Ciclistas VO₂ 72: beterraba por 6 dias; 18:20 × 18:37', 'Nenhum dos dois diferiu do placebo']} /></Reveal>;
    if (step === 1) {
        return (
            <Card tag="BOORSMA 2014 · 1.500 m" color={C.no}>
                <Reveal order={1} className="grid grid-cols-2 gap-3">
                    <Big value="19,5" label="mmol por dose (210 mL)" color={C.no} size="2.2rem" count hit />
                    <Big value="8 dias" label="de uso crônico" color={C.no} size="2.2rem" count />
                </Reveal>
                <Reveal order={2}><p className="text-[16px] leading-snug text-gray-200">Nitrato plasmático 37 → 615 µM (agudo) e 870 µM (crônico). VO₂ submáximo igual.</p></Reveal>
            </Card>
        );
    }
    if (step === 2) return <Reveal order={2}><Card tag="O QUE A FIGURA MOSTRA" color={C.nitrite} lines={['Pontos: diferença observada, calculada das médias', 'Barras: precisão esperada, cálculo com CV de 2% e o n de cada estudo', 'Todas incluem o zero; as cinco com n de 8 a 13 também incluem ganhos de 1% ou mais']} /></Reveal>;
    if (step === 3) {
        return (
            <Card tag="HOPKINS 1999" color={C.risk}>
                <Reveal order={1} className="grid grid-cols-2 gap-3">
                    <Big value="8–24" label="atletas nos estudos" color={C.nitrite} size="2.2rem" />
                    <Big value="16–65" label="necessários (cruzado)" color={C.risk} size="2.2rem" hit />
                </Reveal>
                <Reveal order={2}><p className="text-[16px] leading-snug text-gray-200">Dobrar o ruído do teste exige quadruplicar o n. Cinco dos sete têm n de 8 a 13.</p></Reveal>
            </Card>
        );
    }
    return <Reveal order={2}><Card tag="O CUIDADO COM O RESPONDEDOR" color={C.hypoxia} lines={['Agudo: 2 dos 8 melhoraram 5,8 e 5,0 s', 'Crônico: 7,0 e 0,5 s', 'Com ruído de ~8 s (cálculo, CV 3,3%), ainda não é resposta medida (Atkinson 2015)']} /></Reveal>;
};

const EliteNullSim = () => {
    const { step, setStep } = useSlideSteps(ELITE_TABS.length);
    const reduce = useReducedMotion() ?? false;
    return (
        <Frame tabs={ELITE_TABS} step={step} setStep={setStep} layoutId="elite-tab" foot={ELITE_FEET[step]}
            chips={<Tag color={C.nitrite}>{step === 4 ? 'dados reais · ruído calculado' : 'barras: cálculo ilustrativo'}</Tag>}>
            <div className="h-full grid gap-5" style={{ gridTemplateColumns: `${EW}px 1fr` }}>
                {step === 4 ? <RespondersScene reduce={reduce} /> : <EliteForest step={step} />}
                <Swap k={step} className="flex flex-col justify-center"><Side step={step} /></Swap>
            </div>
        </Frame>
    );
};

export default EliteNullSim;
