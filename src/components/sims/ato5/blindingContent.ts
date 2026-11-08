/** Textos do BlindingSim (slide 61). Números: dossiê 04, bloco B (BANG2004, LOPEZSAMANES2026, BERLANGA2023, WATTS1993, EASTWOOD1995). */

export interface BlindingStep {
    tab: string;
    headline: string;
    text: string;
    source: string;
    takeaway: string;
}

export const BLINDING_STEPS: readonly BlindingStep[] = [
    {
        tab: 'Índice de Bang',
        headline: 'Existe um número para “o cego funcionou?”',
        text: 'O índice vai de −1 a 1: 0 é cego perfeito, 1 é cego totalmente quebrado. Em 12 velocistas com 70 mL de suco, deu 0,16 no placebo e 0,08 na beterraba. Os autores chamam de “quase perfeito”.',
        source: 'López-Samanes 2026, J Int Soc Sports Nutr (n = 12); Bang 2004, Control Clin Trials.',
        takeaway: 'Uma pergunta ao fim de cada visita já dá o número.',
    },
    {
        tab: 'Três em dez',
        headline: 'Quem sabe o que tomou?',
        text: 'Em 10 escaladores, só 3 acertaram o que tinham bebido. Chutando entre duas opções, o esperado é 5; três ou menos acontece em 17% das vezes. O cego se manteve.',
        source: 'Berlanga 2023, J Hum Kinet (n = 10); probabilidade binomial: cálculo nosso.',
        takeaway: 'É o antídoto para “todo mundo sabe quando tomou beterraba”.',
    },
    {
        tab: 'Beterrúria',
        headline: 'A urina vermelha não entrega o braço',
        text: 'Em 100 pessoas, 4 tiveram urina visivelmente vermelha com 60 mg de extrato. A resina remove o ânion, não o pigmento: num cruzado, a mesma pessoa fica vermelha nos dois braços.',
        source: 'Watts 1993, Pharmacogenetics (4 de 100; “10–14%” é citação secundária); Eastwood 1995, QJM.',
        takeaway: 'Beterrúria não é marcador de dose de nitrato.',
    },
    {
        tab: 'Quem reporta',
        headline: 'Medir o cego não é reportar o cego',
        text: 'Brennan 2026 avaliou o cego e não mostrou o resultado. Entre 45 ECRs em atletas, 13 tinham reservas sobre o pareamento do placebo, a checagem do cego ou a restrição de enxaguante.',
        source: 'Brennan 2026, Eur J Appl Physiol; Xie 2026, Sports; Bang 2004.',
        takeaway: 'Peça o número do cego antes de aceitar “duplo-cego”.',
    },
];
