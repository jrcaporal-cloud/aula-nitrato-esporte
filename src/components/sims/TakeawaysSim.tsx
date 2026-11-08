import { useSlideSteps } from '../../store/useSlideSteps';
import { Source } from './kit/ui';
import { TakeawayVisual } from './ato6/TakeawayVisuals';
import { TAKEAWAYS, TAKEAWAYS_BY_STEP, TAKEAWAY_TABS, type Takeaway } from './ato6/takeawaysContent';
import { ArteShell, Glass, Kick, Rise } from './ato6/arte-b/kit';
import { KitRail, Medal } from './ato6/arte-b/takeaways/Kit';
import { KeyFact, Reveal } from './kit/rhythm';
import { REVEAL_GAP } from './kit/countUp';
import { CountText } from './ato5/countText';

/**
 * Slide 88 — O Que Levar para o Consultório. Kit de consultório: seis ícones grandes, um por mensagem; cada passo
 * acende dois (efeito, prática, lacunas) e abre as mensagens com o número que as sustenta; o último põe as seis num cartaz.
 */
/** Ritmo: cartão e medalha (arte) → número-chave sobe (ordem 1, destaque no 1º cartão do passo) → texto e fonte (ordem 2). */
const Big = ({ t, i }: { t: Takeaway; i: number }) => {
    const delay = 0.15 + i * 0.15;
    const key = <CountText text={t.key} delayMs={(delay + REVEAL_GAP) * 1000} />;
    return (
    <Rise delay={delay} className="min-w-0 flex-1">
        <Glass color={t.color} glow={1} className="flex h-full flex-col gap-2.5 p-5">
            <div className="flex items-center gap-4">
                <Medal t={t} size={84} lit />
                <div className="min-w-0">
                    <Kick color={t.color}>mensagem {t.n} de 6</Kick>
                    <p className="m-0 font-display text-[40px] font-semibold leading-none" style={{ color: t.color }}>{i === 0 ? <KeyFact color={t.color} delay={delay + REVEAL_GAP}>{key}</KeyFact> : key}</p>
                </div>
            </div>
            <h3 className="m-0 font-display text-[25px] font-semibold leading-tight text-white">{t.headline}</h3>
            <TakeawayVisual id={t.visual} color={t.color} />
            <Reveal order={2} delay={delay}><p className="m-0 text-[17px] leading-snug text-gray-100">{t.text}</p></Reveal>
            <Reveal order={2} delay={delay} className="mt-auto"><Source>{t.source}</Source></Reveal>
        </Glass>
    </Rise>
    );
};

const Small = ({ t, i }: { t: Takeaway; i: number }) => (
    <Rise delay={i * 0.08} className="min-h-0">
        <Glass color={t.color} glow={1} className="flex h-full flex-col gap-1.5 px-4 py-3">
            <div className="flex items-center gap-3">
                <Medal t={t} size={52} lit />
                <p className="m-0 font-display text-[28px] font-semibold leading-none" style={{ color: t.color }}>{t.key}</p>
            </div>
            <h3 className="m-0 font-display text-[20px] font-semibold leading-tight text-white">{t.headline}</h3>
            <div className="mt-auto"><TakeawayVisual id={t.visual} color={t.color} narrow /></div>
        </Glass>
    </Rise>
);

const TakeawaysSim = () => {
    const { step, setStep } = useSlideSteps(TAKEAWAY_TABS.length);
    const shownIds = TAKEAWAYS_BY_STEP[step];
    const shown = TAKEAWAYS.filter(t => shownIds.includes(t.n));
    const poster = step === TAKEAWAY_TABS.length - 1;
    const done = TAKEAWAYS_BY_STEP.slice(0, step).flat();
    return (
        <ArteShell tabs={TAKEAWAY_TABS} step={step} setStep={setStep} layoutId="takeaway-tabs">
            {poster
                ? <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-2 gap-3">{shown.map((t, i) => <Small key={t.n} t={t} i={i} />)}</div>
                : <>
                    <KitRail shown={shownIds} done={done} />
                    <div key={step} className="flex min-h-0 flex-1 gap-3">{shown.map((t, i) => <Big key={t.n} t={t} i={i} />)}</div>
                </>}
        </ArteShell>
    );
};

export default TakeawaysSim;
