import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Chip, Panel, StepTabs } from './kit/ui';
import { ACTS, TAB_LABELS } from './ato1/acts';
import { ActDetail } from './ato1/ActDetail';
import { ActRoute } from './ato1/ActRoute';

/**
 * "O Mapa da Aula" (slide 13). A viagem do íon como rota de seis atos. Passos 1–6: cada ato acende, com a
 * pergunta que ele responde. Passo 7: todo o caminho aceso e a pergunta da aula, "para quem e quando?", com o prêmio realista.
 */

const LAST_ACT = ACTS.length - 1;

const AulaMapSim = () => {
    const { step, setStep } = useSlideSteps(ACTS.length + 1);
    const asking = step > LAST_ACT;
    const detailColor = asking ? C.nitrate : ACTS[step].color;

    return (
        <div className="not-prose flex w-full select-none flex-col gap-3 font-body text-white" style={{ height: 516 }}>
            <div className="flex h-10 items-center justify-between gap-3">
                <StepTabs labels={TAB_LABELS} step={step} onSelect={setStep} layoutId="map-tabs" />
                <Chip color={C.placebo}>a viagem de um íon</Chip>
            </div>

            <ActRoute lit={Math.min(step, LAST_ACT)} current={asking ? LAST_ACT : step} />

            <Panel state="active" glow={detailColor} className="min-h-0 flex-1">
                <ActDetail step={step} />
            </Panel>
        </div>
    );
};

export default AulaMapSim;
