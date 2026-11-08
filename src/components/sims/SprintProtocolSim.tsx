import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Reveal } from './kit/rhythm';
import { Panel } from './kit/ui';
import { ProtocolResults } from './ato4/ProtocolResults';
import { ProtocolStrip } from './ato4/ProtocolStrip';
import { ExhaustCard, HeatCard } from './ato4/ProtocolStress';
import {
    PROTOCOLS, PROTOCOL_STEPS, REST_SECONDS, REST_TICKS, SPRINT_SECONDS, SPRINT_TICKS, STEP_PICKS, findProtocol, type Pick,
} from './ato4/protocolContent';
import { FactList, Narration, SimFrame, Slider, Src, Tag, type FactHit } from './ato4/shell';

/**
 * Slide 51 — "O Protocolo Decide". Controles de duração do sprint e de pausa acendem o resultado dos três
 * protocolos de Wylie 2016 (+5% / 0 / 0); o último passo traz calor (Smith 2019) e exaustão (Martin 2014).
 * Combinações que ninguém testou ficam apagadas: só três cantos do mapa têm dado.
 */

interface Override extends Pick { step: number }

/** Dado-chave de cada passo na lista de números: a potência com beterraba parte da do placebo. */
const HITS: readonly (FactHit | undefined)[] = [{ index: 1 }, { index: 1, from: 539 }, { index: 1, from: 562 }, { index: 1, from: 375 }, undefined];

const SprintProtocolSim = () => {
    const { step, setStep } = useSlideSteps(PROTOCOL_STEPS.length);
    const info = PROTOCOL_STEPS[step];
    const [override, setOverride] = useState<Override | null>(null);
    const touched = override?.step === step;
    const pick: Pick = touched ? override : STEP_PICKS[step];
    const tested = findProtocol(pick.sprint, pick.rest);
    // Resultado já visto: os protocolos dos passos anteriores ficam na tela (apagados); o escolhido pelo aluno também.
    const shown = new Set(PROTOCOLS.filter((_, i) => i + 1 <= step).map(p => p.id));
    if (touched && tested) shown.add(tested.id);
    const stress = step === PROTOCOL_STEPS.length - 1;

    const update = (next: Partial<Pick>) => setOverride({ step, ...pick, ...next });

    return (
        <SimFrame tabs={PROTOCOL_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato4-protocol-tab"
            chips={<Tag color={C.nitrateSoft}>Bruno · caso fictício</Tag>}>
            <div className="flex h-full flex-col gap-2">
                {stress ? (
                    <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr', height: 304 }}>
                        <HeatCard />
                        <ExhaustCard />
                    </div>
                ) : (
                    <div className="grid gap-3" style={{ gridTemplateColumns: '520px 1fr', height: 282 }}>
                        <Panel className="p-3 flex flex-col gap-2">
                            <Slider label="Duração de cada sprint" value={pick.sprint} min={0} max={2} step={1} color={C.nitrate}
                                ticks={SPRINT_TICKS} readout={`${SPRINT_SECONDS[pick.sprint]} s`} onChange={v => update({ sprint: v })} />
                            <Slider label="Pausa entre os sprints" value={pick.rest} min={0} max={2} step={1} color={C.nitrite}
                                ticks={REST_TICKS} readout={`${REST_SECONDS[pick.rest]} s`} onChange={v => update({ rest: v })} />
                            <ProtocolStrip sprint={SPRINT_SECONDS[pick.sprint]} rest={REST_SECONDS[pick.rest]} tested={tested} />
                        </Panel>
                        <ProtocolResults selected={tested?.id} shown={shown}
                            onPick={id => {
                                const p = PROTOCOL_PICK[id];
                                if (p) update(p);
                            }} />
                    </div>
                )}
                <Panel className="flex flex-1 min-h-0 gap-5 px-5 py-3">
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                        <Narration stepKey={step} headline={info.headline} text={info.text} />
                        <Reveal key={step} order={2}>
                            <p className="border-l-4 pl-3 text-[16px] font-medium leading-snug text-white" style={{ borderColor: C.nitrateSoft }}>{info.takeaway}</p>
                        </Reveal>
                    </div>
                    <div className="flex w-[330px] shrink-0 flex-col justify-between gap-2">
                        <FactList key={step} rows={info.facts} dense hit={HITS[step]} />
                        <Reveal key={`${step}-src`} order={2}><Src>{info.source}</Src></Reveal>
                    </div>
                </Panel>
            </div>
        </SimFrame>
    );
};

const PROTOCOL_PICK: Record<string, Pick> = {
    p6: { sprint: 0, rest: 0 },
    p30: { sprint: 1, rest: 2 },
    p60: { sprint: 2, rest: 1 },
};

export default SprintProtocolSim;
