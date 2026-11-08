import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Reveal } from './kit/rhythm';
import { Big, Card, Frame, Swap, Tag } from './ato3/Frame';
import { FOREST_FEET, FOREST_TABS, FOREST_VIEW, META_ROWS } from './ato3/forest.content';
import { MetaForest, MW } from './ato3/MetaForest';

/**
 * Slide 44 — "O Que Dizem as Meta-análises". Floresta revelada por passo: geral → TTE × contrarrelógio →
 * em segundos (Gao 2021) → atleta × não atleta (Campos 2018) → certeza. Faixa cinza = efeito trivial.
 */

const Side = ({ step }: { step: number }) => {
    if (step === 0) {
        return (
            <Card tag="SENEFELD 2020 · EFEITOS ALEATÓRIOS" color={C.nitrate}>
                <Reveal order={1}><Big value="0,17" label="d geral (IC95% 0,12 a 0,23)" color={C.nitrate} count hit /></Reveal>
                <Reveal order={2}><p className="text-[16px] leading-snug text-gray-200">"Objetivamente pequeno". Nenhum estudo relatou piora; só ~32% tiveram melhora significativa.</p></Reveal>
            </Card>
        );
    }
    if (step === 1) return <Reveal order={2}><Card tag="A MESMA PILHA, DOIS DESFECHOS" color={C.nitrite} lines={['TTE: d 0,32 a 0,33, intervalo longe do zero', 'Contrarrelógio: d 0,09, e o umbrella não achou melhora significativa', 'Maior no TTE, menor no que se parece com prova']} /></Reveal>;
    if (step === 2) {
        return (
            <Card tag="GAO 2021 · 73 ESTUDOS" color={C.no}>
                <Reveal order={1} className="grid grid-cols-2 gap-3">
                    <Big value="+25 s" label="TTE (12,7 a 37,8)" color={C.nitrite} size="2.2rem" count />
                    <Big value="−2 s" label="contrarrelógio (−4,4 a 0,4), n.s." color={C.no} size="2.2rem" count hit />
                </Reveal>
                <Reveal order={2}><p className="text-[16px] leading-snug text-gray-200">n = 1.061; certeza GRADE baixa; no contrarrelógio, p = 0,1.</p></Reveal>
            </Card>
        );
    }
    if (step === 3) return <Reveal order={2}><Card tag="CAMPOS 2018 · Br J Nutr" color={C.o2} lines={['Não atletas: 0,25 (0,11 a 0,38), mais em testes abertos longos', 'Atletas: 0,04 (−0,05 a 0,15)', 'O nível de desempenho separa o efeito']} /></Reveal>;
    return <Reveal order={2}><Card tag="O QUE NÃO COMPARAR" color={C.risk} lines={['SMD de TTE e de TT medem coisas diferentes', 'Poon 2025: a maioria das revisões tem qualidade baixa a criticamente baixa (AMSTAR-2)', 'Gao 2021: certeza GRADE baixa a muito baixa']} /></Reveal>;
};

/** Dado-chave de cada passo na floresta (os passos 1 e 3 destacam no gráfico; 0 e 2, no número grande). */
const HITS = [undefined, 'tt1', undefined, 'pop2', undefined] as const;

const EnduranceForestSim = () => {
    const { step, setStep } = useSlideSteps(FOREST_TABS.length);
    const view = FOREST_VIEW[step];
    return (
        <Frame tabs={FOREST_TABS} step={step} setStep={setStep} layoutId="forest-tab" foot={FOREST_FEET[step]}
            chips={<Tag color={C.no}>{step === 2 ? 'em segundos' : 'tamanhos de efeito · IC95%'}</Tag>}>
            <div className="h-full grid gap-5" style={{ gridTemplateColumns: `${MW}px 1fr` }}>
                <MetaForest rows={META_ROWS} shown={view.shown} focus={view.focus} hit={HITS[step]} />
                <Swap k={step} className="flex flex-col justify-center"><Side step={step} /></Swap>
            </div>
        </Frame>
    );
};

export default EnduranceForestSim;
