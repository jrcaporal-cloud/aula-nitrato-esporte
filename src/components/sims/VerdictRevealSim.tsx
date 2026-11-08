import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Chip } from './kit/ui';
import { CLAIMS, readVotes, type Votes } from './ato6/claimsBridge';
import { REVEALED_BY_STEP, VERDICT_TABS } from './ato6/verdictContent';
import { VerdictRow } from './ato6/VerdictRow';
import { Shell } from './ato6/ui';

/**
 * Slide 87 — O Veredito da Turma. Volta às 6 frases do slide 10 e lê os votos gravados neste navegador
 * (localStorage, chave `aula-nitrato:votos`). Passo 1: os votos; passos 2–4: o passador vira duas frases por vez
 * com a resposta e a explicação. Sem votos (ou sem storage), mostra só as respostas e avisa.
 */
const VerdictRevealSim = () => {
    const { step, setStep } = useSlideSteps(VERDICT_TABS.length);
    const [votes] = useState<Votes>(readVotes);
    const revealed = REVEALED_BY_STEP[step];
    const voted = CLAIMS.filter(c => votes[c.id]);
    const seen = voted.filter(c => c.id <= revealed);
    const hits = seen.filter(c => votes[c.id] === c.answer).length;

    const score = voted.length === 0
        ? <Chip color={C.nitrite}>sem votos registrados neste navegador</Chip>
        : <Chip color={C.o2}>{revealed === 0 ? `${voted.length} de ${CLAIMS.length} votos registrados` : `a turma acertou ${hits} de ${seen.length}`}</Chip>;
    const chips = <>{revealed === CLAIMS.length && <Chip color={C.nitrate}>seis frases, nenhuma sobrevive inteira</Chip>}{score}</>;

    return (
        <Shell tabs={VERDICT_TABS} step={step} setStep={setStep} layoutId="verdict-tabs" chips={chips}>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                {CLAIMS.map(c => (
                    <VerdictRow key={c.id} claim={c} vote={votes[c.id]} open={c.id <= revealed} current={c.id === revealed || c.id === revealed - 1} />
                ))}
            </div>
        </Shell>
    );
};

export default VerdictRevealSim;
