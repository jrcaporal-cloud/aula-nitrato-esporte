import { useSlideSteps } from '../../store/useSlideSteps';
import { Source } from './kit/ui';
import { MYTHS, MYTH_TABS } from './ato6/mythsContent';
import { ArteShell, Glass, Rise } from './ato6/arte-b/kit';
import { DepletionArt, NitriteArt } from './ato6/arte-b/myths/artA';
import { ForceArt, Vo2Art } from './ato6/arte-b/myths/artB';
import { BRIEF } from './ato6/arte-b/myths/content';
import { FlipCard } from './ato6/arte-b/myths/FlipCard';
import { PowderArt } from './ato6/arte-b/myths/Powder';

/**
 * Slide 86 — Cinco Mitos de Consultório. Uma carta por passo: nasce com o mito riscado e vira para o avesso; ao lado,
 * a arte do número que o decide (tubos, barras, mostrador, béqueres) e a fonte.
 */
const ARTS = [<DepletionArt />, <NitriteArt />, <ForceArt />, <Vo2Art />, <PowderArt />];

const MythsSim = () => {
    const { step, setStep } = useSlideSteps(MYTH_TABS.length);
    const m = MYTHS[step];
    return (
        <ArteShell tabs={MYTH_TABS} step={step} setStep={setStep} layoutId="myths-tabs">
            <div className="flex min-h-0 flex-1 gap-3">
                <FlipCard key={m.id} myth={m} index={step} />
                <Glass color={m.color} glow={1} className="flex min-w-0 flex-1 flex-col gap-2 p-4">
                    <div key={m.id} className="flex min-h-0 flex-1 flex-col gap-2">
                        <div className="flex flex-1 flex-col justify-center">{ARTS[step]}</div>
                        <Rise delay={0.2} className="flex flex-col gap-1.5">
                            <p className="m-0 text-[16px] leading-snug text-gray-100">{BRIEF[m.id]}</p>
                            <Source>{m.source}</Source>
                        </Rise>
                    </div>
                </Glass>
            </div>
        </ArteShell>
    );
};

export default MythsSim;
