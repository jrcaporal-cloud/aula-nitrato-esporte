import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { ForestPlot, type ForestRow } from './kit/ForestPlot';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { SprintTimes } from './ato4/SprintTimes';
import { StoryPanel, SimFrame, Tag } from './ato4/shell';
import { TeamPitch } from './ato4/TeamPitch';
import { TEAM_STEPS, YOYO_NYAKAYIRU, YOYO_WYLIE } from './ato4/teamContent';
import { YoYoLanes } from './ato4/YoYoLanes';

/**
 * Slide 50 — "Bola Rolando". Bruno (caso fictício) em campo e os quatro números do Yo-Yo e dos sprints:
 * Wylie 2013, Nyakayiru 2017, Thompson 2016 e o agrupado de Alsharif 2023 (SMD 0,17).
 */

const POOLED: readonly ForestRow[] = [
    { id: 'yoyo', label: 'Yo-Yo IR1 · distância', sub: 'k = 4 · I² 25%', est: 0.17, lo: 0.09, hi: 0.24, kind: 'pooled', color: C.nitrate },
    { id: 'media', label: 'Potência média', sub: 'I² 79%', est: 0.2, lo: 0.03, hi: 0.36, kind: 'pooled', color: C.nitrateSoft },
    { id: 'pico', label: 'Pico de potência', sub: 'não muda', est: 0.01, lo: -0.06, hi: 0.08, kind: 'pooled', color: C.placebo },
];

const INDIVIDUAL: readonly (readonly [string, string])[] = [
    ['Wylie 2013', '+4,2%'],
    ['Nyakayiru 2017', '+3,4%'],
    ['Thompson 2016', '+3,9%'],
];

const PooledView = () => (
    <div className="h-full flex flex-col">
        <div className="px-5 pt-4 text-[18px] font-bold text-gray-100">Alsharif 2023 · meta-análise de esforços curtos e intensos</div>
        <div className="flex-1 min-h-0 px-3">
            <ForestPlot rows={POOLED} width={694} height={250} domain={[-0.2, 0.5]} ticks={[-0.2, 0, 0.2, 0.4]}
                axisLabel="diferença padronizada (SMD)" decimals={2} labelWidth={250} valueWidth={196} sides={['piora', 'melhora']} />
        </div>
        <div className="mx-5 mb-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5">
            <div className="text-[15px] text-gray-300">Ensaios individuais de Yo-Yo (em %, outra régua que o SMD)</div>
            <div className="mt-1 flex gap-6">
                {INDIVIDUAL.map(([k, v]) => (
                    <span key={k} className="text-[16px] text-gray-100">{k} <b className="font-mono" style={{ color: C.nitrateSoft }}>{v}</b></span>
                ))}
            </div>
        </div>
    </div>
);

const TeamSportSim = () => {
    const { step, setStep } = useSlideSteps(TEAM_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const info = TEAM_STEPS[step];

    const visual = [
        <TeamPitch key="p" reduce={reduce} />,
        <YoYoLanes key="w" run={YOYO_WYLIE} reduce={reduce} />,
        <YoYoLanes key="n" run={YOYO_NYAKAYIRU} reduce={reduce} />,
        <SprintTimes key="s" reduce={reduce} />,
        <PooledView key="a" />,
    ][step];

    return (
        <SimFrame tabs={TEAM_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato4-team-tab"
            chips={<Tag color={C.nitrateSoft}>Bruno · caso fictício</Tag>}>
            <div className="h-full grid gap-3" style={{ gridTemplateColumns: '720px 1fr' }}>
                <Panel className="min-h-0">
                    <motion.div key={step} className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
                        {visual}
                    </motion.div>
                </Panel>
                <StoryPanel stepKey={step} kicker={info.kicker} headline={info.headline} text={info.text} facts={info.facts} takeaway={info.takeaway} source={info.source} />
            </div>
        </SimFrame>
    );
};

export default TeamSportSim;
