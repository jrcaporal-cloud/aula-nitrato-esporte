import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Chip, Panel, StepTabs } from './kit/ui';
import { ACTS, TAB_LABELS } from './ato1/acts';
import { ActDetail } from './ato1/ActDetail';
import { RouteMap } from './ato1/art/RouteMap';

/**
 * "O Mapa da Aula" (slide 13). A viagem do íon como trilha de seis atos em grande formato: o íon (NO₃⁻ → NO₂⁻ → NO)
 * caminha até o ato da vez e acende o caminho. Passos 1–6: cada ato, com a pergunta que ele responde.
 * Passo 7: todo o caminho aceso e a pergunta da aula, "para quem e quando?", com o prêmio realista.
 */

const LAST_ACT = ACTS.length - 1;

const AulaMapSim = () => {
    const { step, setStep } = useSlideSteps(ACTS.length + 1);
    const asking = step > LAST_ACT;
    const detailColor = asking ? C.nitrate : ACTS[step].color;

    return (
        <div className="not-prose flex w-full select-none flex-col gap-2.5 font-body text-white" style={{ height: 500 }}>
            <div className="flex h-10 items-center justify-between gap-3">
                <StepTabs labels={TAB_LABELS} step={step} onSelect={setStep} layoutId="map-tabs" />
                <Chip color={C.placebo}>a viagem de um íon</Chip>
            </div>

            <div className="relative shrink-0 overflow-hidden rounded-2xl border border-white/10" style={{ height: 272, background: 'radial-gradient(ellipse at 50% 0%, #1A1024, #07050B 70%)' }}>
                <RouteMap current={Math.min(step, LAST_ACT)} done={asking} />
            </div>

            <Panel state="active" glow={detailColor} className="min-h-0 flex-1">
                <ActDetail step={step} />
            </Panel>
        </div>
    );
};

export default AulaMapSim;
