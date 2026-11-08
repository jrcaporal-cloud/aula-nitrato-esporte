/** Textos do ResponderSim (slide 65). Números: COGGAN2018, ATKINSON2015, HECKSTEDEN2018, MILLER2020 (dossiê 04, bloco G). */

export interface ResponderStep {
    tab: string;
    headline: string;
    text: string;
    source: string;
    takeaway: string;
}

export const RESPONDER_STEPS: readonly ResponderStep[] = [
    {
        tab: 'Mesma',
        headline: 'Doze atletas, uma única resposta',
        text: 'Todos respondem exatamente igual: +4,4% de potência. Cada um é medido uma vez com o suplemento e uma vez com o placebo, como na maioria dos ensaios.',
        source: 'Ilustração nossa. Média +4,4% e DP 8,1% das mudanças: Coggan 2018, Physiol Rep (n = 20).',
        takeaway: 'Aqui a verdade é conhecida: nenhuma diferença entre atletas.',
    },
    {
        tab: 'Gráfico',
        headline: 'O erro de medida fabrica respondedores',
        text: 'Medidas com o ruído de Coggan (DP 8,1%), as barras se espalham quase como na literatura, de −9,6% a +26,8%. Surgem respondedores e não respondedores que não existem.',
        source: 'Ilustração nossa (semente fixa); faixa real: Coggan 2018. Limiares de +10% e 0%: nossos.',
        takeaway: 'O gráfico de barras individuais não separa gente de ruído.',
    },
    {
        tab: '2 mundos',
        headline: 'Dois gráficos, quase o mesmo',
        text: 'Em um mundo todos respondem igual. No outro, metade responde (+8,8%) e metade não. Só olhando as barras, qual é qual?',
        source: 'Ilustração nossa: mesmo erro de medida nos dois mundos; média verdadeira +4,4% em ambos.',
        takeaway: 'Se você não sabe dizer, o gráfico não serve de prova.',
    },
    {
        tab: 'Teste certo',
        headline: 'Compare o desvio-padrão das mudanças',
        text: 'Resposta individual verdadeira só aparece comparando o DP das mudanças do braço ativo com o do placebo. Iguais: nada a explicar. Maior no ativo: há diferença verdadeira.',
        source: 'Atkinson & Batterham 2015, Exp Physiol. Com n = 12 a resolução é baixa; ilustração nossa.',
        takeaway: 'O campo do nitrato quase nunca faz essa conta.',
    },
    {
        tab: 'Medir 2×',
        headline: 'Medir duas vezes encolhe a ilusão',
        text: 'Com duas medidas por condição, o erro cai por √2 e as barras do mundo igual voltam para perto da verdade. O remédio de desenho é repetir o teste dentro de cada condição.',
        source: 'Hecksteden 2018, J Appl Physiol (testes repetidos). Efeito de 1, 2 e 4 medidas: cálculo nosso.',
        takeaway: 'Um teste por braço não define respondedor.',
    },
    {
        tab: 'Rótulo',
        headline: 'Nem o rótulo nem o nitrito são estáveis',
        text: 'Num ensaio de treino, só 11 de 20 pessoas foram classificadas igual por métodos diferentes. E a conversão a nitrito varia de −7% a +1.324% entre semanas na mesma pessoa.',
        source: 'Hecksteden 2018; Miller & Collins 2020, Curr Dev Nutr (resumo de congresso, n = 6 no braço ativo).',
        takeaway: 'Respondedor ainda não é uma entidade medida.',
    },
];

export const MEASURE_OPTIONS = [
    { value: 1, label: '1×' },
    { value: 2, label: '2×' },
    { value: 4, label: '4×' },
] as const;
