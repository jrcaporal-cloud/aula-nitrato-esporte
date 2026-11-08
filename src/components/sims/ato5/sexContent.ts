/** Textos do SexGapSim (slide 68). Números: SENEFELD2020, HE2026, FRY2026, BRENNAN2026 (dossiê 04 bloco J e 03). Helena: caso fictício. */

export interface SexStep {
    tab: string;
    headline: string;
    text: string;
    source: string;
    takeaway: string;
}

export const SEX_STEPS: readonly SexStep[] = [
    {
        tab: 'Quem foi estudado',
        headline: 'Em cada 100 participantes, 12 eram mulheres',
        text: 'Nos 80 estudos da meta-análise de Senefeld: 1.179 homens e 156 mulheres. Os autores falam em cerca de 10% da amostra; 156 ÷ 1.335 dá 11,7%.',
        source: 'Senefeld 2020, Med Sci Sports Exerc (80 estudos, 2009–2019). Pictograma e 11,7%: cálculo nosso.',
        takeaway: '“E nas mulheres?” começa por um denominador desigual.',
    },
    {
        tab: 'Os conjuntos',
        headline: 'Quase todo conjunto de dados é só de homens',
        text: 'Dos conjuntos de dados, 79% eram só de homens, 16% mistos e 5% só de mulheres: seis conjuntos, no total.',
        source: 'Senefeld 2020 (percentuais e n como no artigo, 111 conjuntos).',
        takeaway: 'Seis conjuntos não sustentam uma conclusão.',
    },
    {
        tab: 'O nulo',
        headline: 'Um nulo com seis conjuntos não é ausência',
        text: 'Só mulheres: d = 0,116 (−0,126 a 0,358; p = 0,347). O intervalo é largo e contém o efeito geral, 0,174. Os autores chamam a ausência de efeito de provavelmente espúria.',
        source: 'Senefeld 2020 (efeito geral d = 0,174; IC 0,120 a 0,229).',
        takeaway: 'p = 0,347 com seis conjuntos é falta de dado.',
    },
    {
        tab: 'O ensaio',
        headline: 'Quando o ensaio é desenhado para as duas',
        text: 'He 2026 reuniu 19 homens e 17 mulheres e testou a interação sexo × suplemento: nenhuma. Com o ciclo menstrual controlado, Fry 2026 e Brennan 2026 não acharam efeito.',
        source: 'He 2026, Biol Sport; Fry 2026, J Appl Physiol; Brennan 2026, Eur J Appl Physiol.',
        takeaway: 'Ausência de dado não é ausência de efeito.',
    },
    {
        tab: 'Helena',
        headline: 'E a Helena?',
        text: 'Helena tem aptidão baixa, o perfil em que o efeito tende a aparecer, mas quase nenhum dado vem de mulheres como ela. A pergunta honesta: quantas das 156 se pareciam com ela?',
        source: 'Caso fictício. Senefeld 2020; Porcelli 2015 citado por Senefeld (dado secundário).',
        takeaway: 'Dado de mulher é a lacuna, não a resposta.',
    },
];
