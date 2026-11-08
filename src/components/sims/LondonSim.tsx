import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Card, Frame, Swap, Tag } from './ato3/Frame';
import { CourseScene, LabScene, LW, PodiumScene } from './ato3/LondonScenes';
import { LONDON_FEET, LONDON_TABS, PODIUM_CLAIMS } from './ato3/london.content';

/**
 * Slide 48 — "A Reta de Londres". O ensaio que simulou o percurso olímpico (Lane 2014) e o comunicado
 * de 2012 (Exeter), que é relato e não ensaio. O último passo coloca as duas fontes lado a lado.
 */

const CHIPS = [
    <Tag key="0" color={C.o2}>Lane 2014 · n = 24</Tag>,
    <Tag key="1" color={C.nitrite}>ensaio duplo-cego</Tag>,
    <Tag key="2" color={C.risk}>relato, não ensaio</Tag>,
    <Tag key="3" color={C.nitrate}>laboratório × pódio</Tag>,
];

const Compare = () => (
    <div className="h-full flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-4">
            <Card tag="LABORATÓRIO · LANE 2014" color={C.o2} title="Mede, mas é cenário controlado"
                lines={['Duplo-cego, quadrado latino, 4 condições, 24 ciclistas', 'Prova: com nutrição de melhor prática, a beterraba sozinha não mudou a potência (−0,4%, p = 0,6)', 'Limite: a nutrição de melhor prática pode mascarar efeito']} />
            <Card tag="PÓDIO · EXETER 2012" color={C.nitrite} title="É real, mas não mede nada"
                lines={['Sem grupo controle, sem cegamento, sem desfecho medido', 'Prova: que atletas teriam usado o suco. Não prova que funcionou', 'Fonte: comunicado do próprio grupo que pesquisa o tema']} />
        </div>
        <div className="rounded-xl border px-5 py-3 flex items-center gap-4" style={{ borderColor: `${C.risk}66`, background: `${C.risk}12` }}>
            <span className="font-display text-[1.5rem] font-semibold text-white">Uso por atleta de elite não é prova de eficácia.</span>
            <span className="text-[16px] leading-snug text-gray-300">Jones 2014 trata o uso em Londres 2012 como relato anedótico.</span>
        </div>
    </div>
);

const Side = ({ step }: { step: number }) => {
    if (step === 0) return <Card tag="LANE 2014 · APPL PHYSIOL NUTR METAB" color={C.o2} lines={['12 homens e 12 mulheres, ciclistas competitivos', 'Beterraba 8,4 mmol, 2 h antes; cafeína 40 min antes', 'Quatro condições, duplo-cego, quadrado latino']} />;
    if (step === 1) return <Card tag="O QUE SE LÊ" color={C.nitrite} lines={['Cafeína ajudou, 3–4% em homens e mulheres', 'Beterraba sozinha: sem efeito neste cenário', 'Não somou à cafeína']} />;
    return (
        <Card tag="O QUE O COMUNICADO DIZ" color={C.nitrite}>
            <ul className="flex flex-col gap-2">
                {PODIUM_CLAIMS.map(c => (
                    <li key={c.who} className="text-[16px] leading-snug text-gray-100"><span className="font-bold text-white">{c.who}:</span> {c.what}</li>
                ))}
            </ul>
        </Card>
    );
};

const LondonSim = () => {
    const { step, setStep } = useSlideSteps(LONDON_TABS.length);
    const reduce = useReducedMotion() ?? false;
    return (
        <Frame tabs={LONDON_TABS} step={step} setStep={setStep} layoutId="london-tab" foot={LONDON_FEET[step]} chips={CHIPS[step]}>
            {step === 3 ? <Swap k={step} className="h-full"><Compare /></Swap> : (
                <div className="h-full grid gap-5" style={{ gridTemplateColumns: `${LW}px 1fr` }}>
                    {step === 0 && <CourseScene reduce={reduce} />}
                    {step === 1 && <LabScene reduce={reduce} />}
                    {step === 2 && <PodiumScene reduce={reduce} />}
                    <Swap k={step} className="flex flex-col justify-center"><Side step={step} /></Swap>
                </div>
            )}
        </Frame>
    );
};

export default LondonSim;
