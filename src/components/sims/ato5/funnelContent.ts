/** Textos do FunnelSim (slide 66). Números: XIE2026 e SENEFELD2020 (dossiê 04, bloco I). */

export interface FunnelStep {
    tab: string;
    headline: string;
    text: string;
    source: string;
    takeaway: string;
}

export const FUNNEL_STEPS: readonly FunnelStep[] = [
    {
        tab: 'Os estudos',
        headline: 'Doze estudos de potência de pico',
        text: 'Em atletas de nível regional ou acima, o efeito agrupado é g = 0,13 (−0,07 a 0,32), com I² de 0%. Parece pequeno e a favor do nitrato.',
        source: 'Xie 2026, Sports (45 ECRs, 659 atletas). Pontos individuais ilustrativos: só os agregados são do artigo.',
        takeaway: 'Cada ponto é um estudo: efeito à direita, precisão para cima.',
    },
    {
        tab: 'O funil',
        headline: 'Um funil sem um dos lados',
        text: 'Sem viés, os estudos pequenos se espalham dos dois lados do efeito. Aqui o canto dos pequenos com resultado nulo ou negativo está vazio.',
        source: 'Xie 2026; contorno = efeito agrupado ± 1,96 erro padrão (ilustrativo).',
        takeaway: 'Quem não publica nulo deixa um buraco no funil.',
    },
    {
        tab: 'Egger',
        headline: 'O teste de Egger acusa a assimetria',
        text: 'A reta inclina: quanto menor o estudo, maior o efeito. Egger é significativo na potência de pico (z = 3,03; p = 0,01) e na potência média (z = 2,33; p = 0,03).',
        source: 'Xie 2026 (Egger). Reta desenhada sobre os pontos ilustrativos. Senefeld 2020: Egger p = 0,07.',
        takeaway: 'p = 0,07 é “não significativo”, e também não é reconfortante.',
    },
    {
        tab: 'Trim-and-fill',
        headline: 'Cinco fantasmas e o efeito vai a zero',
        text: 'O método imputa 5 estudos que faltam na potência de pico, e o efeito agrupado cai para praticamente zero. É uma estimativa, não um achado: mostra o quanto o sinal depende do que falta.',
        source: 'Xie 2026 (5 estudos imputados). Posição dos fantasmas: ilustrativa.',
        takeaway: 'O único sinal positivo some quando se imputa o que não foi publicado.',
    },
    {
        tab: 'Qualidade',
        headline: 'E os estudos que sobraram?',
        text: 'RoB 2: só 1 dos 45 ECRs em baixo risco, 33 com algumas preocupações, 11 em alto risco. I² de 0% com poucos estudos é falta de poder, não prova de concordância.',
        source: 'Xie 2026 (RoB 2 e GRADE; os autores alertam sobre o I²).',
        takeaway: 'A meta-análise mais rigorosa do campo é a que não acha nada em atletas.',
    },
];

export const LAYER_OPTIONS = [
    { value: 0, label: 'Funil' },
    { value: 2, label: 'Egger' },
    { value: 3, label: 'Trim-and-fill' },
] as const;
