import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Chip } from './kit/ui';
import { CLAIMS, readVotes, type Votes } from './ato6/claimsBridge';
import { REVEALED_BY_STEP, VERDICT_TABS } from './ato6/verdictContent';
import { ArteShell } from './ato6/arte-b/kit';
import { EvidencePair, Urn } from './ato6/arte-b/verdict/Evidence';
import { Scoreboard } from './ato6/arte-b/verdict/Scoreboard';

/**
 * Slide 87 — O Veredito da Turma. Placar da plenária: as 6 frases do slide 10 com o voto gravado neste navegador
 * (localStorage, chave `aula-nitrato:votos`) e, a cada passo, duas frases ganham o carimbo e o número que as decide.
 * Passo 1: os votos em pilhas. Sem votos (ou sem storage), o placar mostra só as respostas e avisa.
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
    const pair = CLAIMS.filter(c => c.id > revealed - 2 && c.id <= revealed);

    return (
        <ArteShell tabs={VERDICT_TABS} step={step} setStep={setStep} layoutId="verdict-tabs" chips={chips}>
            <div className="flex min-h-0 flex-1 gap-3">
                <Scoreboard claims={CLAIMS} votes={votes} revealed={revealed} />
                <div className="flex w-[452px] shrink-0 flex-col" key={step}>
                    {revealed === 0 ? <Urn votes={votes} claims={CLAIMS} /> : <EvidencePair claims={pair} votes={votes} />}
                </div>
            </div>
        </ArteShell>
    );
};

export default VerdictRevealSim;
