/** Textos do CrossoverSim (slide 62). Números: dossiê 04 (HOPKINS2001, VANHATALO2018, XIE2026_DESENHO, NYAKAYIRU2017, BESCOS2020). */

export interface CrossoverStep {
    tab: string;
    headline: string;
    text: string;
    source: string;
    takeaway: string;
    /** Parte do cronograma que fica acesa. */
    focus: 'all' | 'famil' | 'order' | 'wash';
}

export const CROSSOVER_STEPS: readonly CrossoverStep[] = [
    {
        tab: 'O desenho',
        headline: 'Cada pessoa é o próprio controle',
        text: 'Dois braços, ordem sorteada e um intervalo entre eles. Nos ECRs com atletas, o washout mediano é de 7 dias (de 4 a 14). Todos os 80 estudos de Senefeld tinham familiarização.',
        source: 'Xie 2026, Sports (45 ECRs, 659 atletas); Senefeld 2020, Med Sci Sports Exerc.',
        takeaway: 'Mais poder que o paralelo, com três armadilhas próprias.',
        focus: 'all',
    },
    {
        tab: 'Familiarização',
        headline: 'A 2ª visita ganha 1,2% de graça',
        text: 'Entre as duas primeiras tentativas o desempenho melhora 1,2%; nas seguintes, 0,2%. Sem familiarização, o braço da 2ª visita herda um bônus da ordem de grandeza do efeito procurado.',
        source: 'Hopkins 2001, Sports Med (101 estudos de confiabilidade).',
        takeaway: 'Familiarização é obrigatória, não cortesia.',
        focus: 'famil',
    },
    {
        tab: 'Ordem',
        headline: 'Sorteie a ordem e o bônus se anula',
        text: 'Sem efeito algum, ordem fixa fabrica +1,2% para o braço que vem depois. Sorteada, o bônus cai nos dois braços e a média volta a zero. Bescós 2020 usou ordem fixa: tudo se confunde com “ser a 2ª semana”.',
        source: 'Hopkins 2001; Bescós 2020, Sci Rep (cego simples, não randomizado); ilustração nossa.',
        takeaway: 'Pergunte sempre: a ordem foi sorteada?',
        focus: 'order',
    },
    {
        tab: 'Efeito biológico',
        headline: 'O 1º braço muda a boca do 2º',
        text: 'Dez dias de ~12 mmol/dia mudaram o microbioma salivar. O efeito de ordem pode ser biológico, não só de aprendizado. Sete dias de washout bastam? A literatura não responde.',
        source: 'Vanhatalo 2018, Free Radic Biol Med (n = 18, 10 dias de nitrato).',
        takeaway: 'O suplemento muda o sistema que o ativa.',
        focus: 'wash',
    },
    {
        tab: 'Bem-feito',
        headline: 'Como é um cruzado que se sustenta',
        text: 'Nyakayiru 2017: 32 jogadores, washout de pelo menos 8 dias, placebo depletado, desfecho primário único. O efeito no Yo-Yo foi de +3,4%, não de +15%.',
        source: 'Nyakayiru 2017, Nutrients (Yo-Yo IR1, 1.574 → 1.623 m).',
        takeaway: 'Bom desenho e efeito pequeno andam juntos.',
        focus: 'all',
    },
];
