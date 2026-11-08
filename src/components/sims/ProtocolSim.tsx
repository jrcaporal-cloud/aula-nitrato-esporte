import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { ProtoCalcArt } from './ato6/arte-a/ProtoCalcArt';
import { ProtoDayArt } from './ato6/arte-a/ProtoDayArt';
import { ProtoDoseArt } from './ato6/arte-a/ProtoDoseArt';
import { ProtoHabitsArt } from './ato6/arte-a/ProtoHabitsArt';
import { ProtoTimeArt } from './ato6/arte-a/ProtoTimeArt';
import { PROTOCOL_SOURCES, PROTOCOL_TABS } from './ato6/protocolContent';
import { FadeSwap, Fictional, Illustrative, Shell, Story } from './ato6/ui';

/**
 * Slide 46 — Dose, Hora e Hábitos. Cinco passos: quanto (fitas dos consensos e o platô de Wylie 2013), quando (shot, onda de
 * nitrito e bandeira da largada), a conta (copos e pratos), o dia da dose (quatro cuidados ilustrados) e o dia dos quatro casos
 * fictícios numa régua de 24 h. Dose e hora ficam em estado compartilhado entre os passos 1–3.
 */
const ProtocolSim = () => {
    const { step, setStep } = useSlideSteps(PROTOCOL_TABS.length);
    const [dose, setDose] = useState(8);
    const [hours, setHours] = useState(3);

    const stories = [
        { kicker: 'quanto', color: C.no, title: 'Platô acima de ~8 mmol', text: 'Em 10 homens, 4,2 mmol não fez nada; 8,4 e 16,8 mmol deram o mesmo efeito. IOC e Delphi se encontram em 8–9 mmol.', source: PROTOCOL_SOURCES.dose },
        { kicker: 'quando', color: C.nitrite, title: '2 a 4 horas antes da largada', text: 'O nitrito no sangue pica 2 a 3 h depois da dose. No aquecimento é tarde; 6 a 8 h antes, cedo demais.', source: PROTOCOL_SOURCES.time },
        { kicker: 'a conta', color: C.o2, title: 'Da dose ao prato', text: 'Fixada a dose em mmol, a conta vira shots ou gramas. Com 8 mmol: 1,2 shot, ou uns 100 g de rúcula na mediana europeia.', source: PROTOCOL_SOURCES.calc },
        { kicker: 'no dia da dose', color: C.bacteria, title: 'Quatro cuidados de bancada', text: 'Pouco glamour, muito efeito prático: o enxaguante, a cor da urina, o teste no treino e o exame que não se deve pedir.', source: PROTOCOL_SOURCES.day },
    ] as const;

    const chips = step === 4 ? <><Illustrative>horários ilustrativos</Illustrative><Fictional /></> : undefined;
    const visual = [
        <ProtoDoseArt dose={dose} onDose={setDose} />,
        <ProtoTimeArt hours={hours} onHours={setHours} />,
        <ProtoCalcArt dose={dose} onDose={setDose} />,
        <ProtoHabitsArt />,
        <ProtoDayArt />,
    ][step];

    return (
        <Shell tabs={PROTOCOL_TABS} step={step} setStep={setStep} layoutId="protocol-tabs" chips={chips}>
            {step < 4 && <Story id={step} width={284} {...stories[step]} />}
            <FadeSwap id={step} className="flex min-w-0 flex-1">{visual}</FadeSwap>
        </Shell>
    );
};

export default ProtocolSim;
