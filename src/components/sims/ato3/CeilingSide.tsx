import { br, signed } from '../kit/format';
import { C } from '../kit/palette';
import { Reveal } from '../kit/rhythm';
import { Big, Card } from './Frame';
import { CHARACTERS, readingFor, trendAt } from './ceiling.content';

/** Coluna de leitura do slide 45: um quadro por passo. */
export const CeilingSide = ({ step, vo2 }: { step: number; vo2: number }) => {
    if (step === 0) return <Reveal order={2}><Card tag="COMO LER O GRÁFICO" color={C.nitrate} lines={['Cheio: melhora significativa; vazio: sem diferença', 'Δ% calculado das médias publicadas (tempo, distância ou potência)', 'n de 8 a 20 por estudo; VO₂max entre 56 e 80']} /></Reveal>;
    if (step === 1) {
        return (
            <Card tag="SENEFELD 2020 · VO₂PICO ≥65" color={C.hypoxia}>
                <Reveal order={1}><Big value="d 0,02" label="IC95% −0,10 a 0,14 · p = 0,745" color={C.hypoxia} count hit /></Reveal>
                <Reveal order={2}><p className="text-[16px] leading-snug text-gray-200">26 conjuntos de dados. O efeito aparece de ~40 a ~65 e some acima disso. A linha tracejada vem de Porcelli 2015 (3% / 1,5% / 0,2%), resumido por Senefeld.</p></Reveal>
            </Card>
        );
    }
    if (step === 2) return <Reveal order={2}><Card tag="DE ONDE VÊM OS CORTES" color={C.nitrite} lines={['Delphi 2022: efeito reduzido acima de VO₂pico 60', 'Senefeld 2020: faixas de 5 em 5; a de ≥65 dá zero', 'Porcelli 2015: o efeito cai de forma contínua, 28 a 82']} /></Reveal>;
    if (step === 3) {
        return (
            <Card tag="PORCELLI 2015 · 21 PESSOAS" color={C.nitrate}>
                <Reveal order={1} className="grid grid-cols-2 gap-3">
                    <Big value="r 0,86" label="aptidão × subida do nitrato" color={C.nitrate} size="2.2rem" count hit />
                    <Big value="r 0,75" label="aptidão × subida do nitrito" color={C.nitrite} size="2.2rem" count />
                </Reveal>
                <Reveal order={2}><p className="text-[16px] leading-snug text-gray-200">Mesma dose de 5,5 mmol por 6 dias. Daí a sugestão de dose maior ou prazo mais longo para quem é muito treinado.</p></Reveal>
            </Card>
        );
    }
    if (step === 4) return <Reveal order={2}><Card tag="FONTES" color={C.bacteria} lines={['As quatro vêm de Jones 2014 (texto completo)', 'Delphi 2022: 60,4% das afirmações sem evidência suficiente', 'O corte de 60 é o único critério quantitativo do consenso']} /></Reveal>;
    const rd = readingFor(vo2);
    const t = trendAt(vo2);
    return (
        <Reveal order={1}><Card tag={`VO₂MAX ${vo2} · FAIXA ${rd.range.toUpperCase()}`} color={rd.color}>
            <Big value={vo2 < 40 ? '≥ ~3%' : `≈ ${br(t, 1)}%`} label="tendência no contrarrelógio (ilustrativa)" color={rd.color} size="2.2rem" />
            <p className="text-[16px] leading-snug text-gray-100">{rd.text}</p>
            <p className="text-[15px] leading-snug text-gray-400">
                Casos fictícios: {CHARACTERS.map(c => `${c.name} ${c.vo2}`).join(' · ')}. Diferença para o 65: {signed(vo2 - 65, 0)}.
            </p>
        </Card></Reveal>
    );
};
