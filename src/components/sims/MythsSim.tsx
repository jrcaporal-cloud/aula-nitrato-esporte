import { Check } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Source } from './kit/ui';
import { DepletionVisual, ForceVisual, NitriteVisual, PowderVisual, Vo2Visual } from './ato6/MythVisuals';
import { MYTHS, MYTH_TABS } from './ato6/mythsContent';
import { Card, FadeSwap, Kicker, Shell } from './ato6/ui';

/**
 * Slide 86 — Cinco Mitos de Consultório. Lista dos cinco mitos à esquerda; o passador vira um por vez:
 * o mito riscado, o avesso em uma frase, o número que o decide (gráfico) e a fonte.
 */
const VISUALS = [<DepletionVisual />, <NitriteVisual />, <ForceVisual />, <Vo2Visual />, <PowderVisual />];

const MythsSim = () => {
    const { step, setStep } = useSlideSteps(MYTH_TABS.length);
    const m = MYTHS[step];
    return (
        <Shell tabs={MYTH_TABS} step={step} setStep={setStep} layoutId="myths-tabs">
            <Card className="flex w-[290px] shrink-0 flex-col gap-2 p-4">
                <Kicker>cinco mitos</Kicker>
                {MYTHS.map((x, i) => {
                    const done = i < step;
                    const current = i === step;
                    return (
                        <button key={x.id} type="button" onClick={() => setStep(i)}
                            className="flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors"
                            style={{ borderColor: current ? `${x.color}cc` : 'rgba(255,255,255,0.1)', background: current ? `${x.color}1f` : 'transparent', opacity: current || done ? 1 : 0.55 }}>
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[15px]" style={{ background: done ? C.no : `${x.color}33`, color: done ? '#07050B' : x.color }}>
                                {done ? <Check size={16} strokeWidth={3} aria-hidden /> : i + 1}
                            </span>
                            <span className="text-[17px] font-semibold leading-tight text-white">{x.short}</span>
                        </button>
                    );
                })}
            </Card>
            <Card className="min-w-0 flex-1 p-5">
                <FadeSwap id={m.id} className="flex h-full flex-col gap-3">
                    <Kicker color={m.color}>mito {step + 1} · do avesso</Kicker>
                    <p className="m-0 text-[17px] italic leading-snug text-gray-400 line-through decoration-white/40">{m.myth}</p>
                    <h3 className="m-0 font-display text-[30px] font-semibold leading-tight text-white">{m.flip}</h3>
                    {VISUALS[step]}
                    <p className="m-0 text-[16px] leading-snug text-gray-100">{m.text}</p>
                    <div className="mt-auto"><Source>{m.source}</Source></div>
                </FadeSwap>
            </Card>
        </Shell>
    );
};

export default MythsSim;
