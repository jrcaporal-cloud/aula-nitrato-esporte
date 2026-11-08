import { C } from '../kit/palette';

/** Slide 84 — dados do RulesSim. Fontes: WADA2026, AIS-A, IOC2018, KERKSICK2018 (ISSN), ANVISA-IN28, ESTEVAN2026, SHANNON2022. */

export const RULES_TABS = ['O esporte', 'Quem classifica', 'No Brasil e na UE', 'O produto'] as const;

export type Tone = 'ok' | 'mid' | 'unknown';

export const TONE_COLOR: Readonly<Record<Tone, string>> = { ok: C.no, mid: C.nitrite, unknown: C.placebo };

export type RuleId = 'wada' | 'ais' | 'ioc' | 'issn' | 'br';

export interface RuleCard {
    id: RuleId;
    org: string;
    seal: string;
    tone: Tone;
    line: string;
}

export const RULE_CARDS: readonly RuleCard[] = [
    { id: 'wada', org: 'WADA 2026', seal: 'não consta', tone: 'ok', line: 'nitrato fora da Lista Proibida' },
    { id: 'ais', org: 'AIS', seal: 'Grupo A', tone: 'ok', line: 'ao lado de cafeína e creatina' },
    { id: 'ioc', org: 'IOC 2018', seal: 'boa evidência', tone: 'ok', line: 'consenso de especialistas' },
    { id: 'issn', org: 'ISSN 2018', seal: 'limitada ou mista', tone: 'mid', line: 'categoria II' },
    { id: 'br', org: 'Anvisa · IN 28/2018', seal: 'não conferido', tone: 'unknown', line: 'texto original sem sal de nitrato' },
];

/** Quais selos acendem em cada passo (o último passo deixa todos acesos). */
export const ACTIVE_BY_STEP: readonly (readonly RuleId[])[] = [['wada'], ['ais', 'ioc', 'issn'], ['br'], ['wada', 'ais', 'ioc', 'issn', 'br']];

export interface RuleStep {
    kicker: string;
    title: string;
    items: readonly { text: string; src: string }[];
    flagTitle: string;
    flag: string;
    flagTone: Tone;
}

export const RULE_STEPS: readonly RuleStep[] = [
    {
        kicker: 'o esporte', title: 'O esporte não proíbe',
        items: [
            { text: 'Nitrato inorgânico não é substância proibida: a busca no texto integral da Lista 2026 (26 páginas) achou 0 ocorrências de “nitrate”, “nitrite”, “beetroot” e “nitric oxide”.', src: 'WADA 2026' },
            { text: 'No consenso Delphi, o painel respondeu “não” à afirmação de que o nitrato viola o espírito do esporte.', src: 'Shannon 2022' },
        ],
        flagTitle: 'não conferido', flag: 'A Lista 2027 entra em vigor em 01/01/2027 e deve ter sido publicada por volta de outubro de 2026. Reconferir antes de apresentar.', flagTone: 'unknown',
    },
    {
        kicker: 'quem classifica', title: 'Três instituições, três graus',
        items: [
            { text: 'AIS: “Dietary Nitrate / Beetroot Juice” no Grupo A (Performance Supplements), junto com cafeína, beta-alanina, bicarbonato, creatina e glicerol.', src: 'AIS' },
            { text: 'IOC 2018: um dos poucos suplementos de desempenho com “boa evidência”, com cafeína, creatina e tamponantes. Dose de 5–9 mmol, 2–3 h antes.', src: 'Maughan 2018' },
            { text: 'ISSN 2018: categoria II, “evidência limitada ou mista”. Não existe position stand da ISSN só de nitrato (busca de 04/11/2026).', src: 'Kerksick 2018' },
        ],
        flagTitle: 'por que divergem', flag: 'A revisão da ISSN é anterior ao consenso Delphi (2022) e às meta-análises de 2020 em diante. Consenso envelhece; a data entra na leitura.', flagTone: 'mid',
    },
    {
        kicker: 'brasil e europa', title: 'No Brasil, zona cinzenta',
        items: [
            { text: 'IN 28/2018, texto original: nitrato de sódio ou de potássio e “extrato de beterraba como fonte de nitrato” não constam. As únicas ocorrências são nitrato de tiamina e fibra de beterraba.', src: 'Anvisa 2018' },
            { text: 'Na União Europeia não há alegação de saúde autorizada para nitrato. Em 18 produtos, 61,1% tinham dose na faixa recomendada e 55,6% usavam celebridades ou influenciadores.', src: 'Estevan Navarro 2026' },
        ],
        flagTitle: 'não conferido', flag: 'Alterações posteriores da IN 28 (IN 76/2020, IN 304/2024, IN 438/2026) e o enquadramento do pó de beterraba (alimento ou suplemento). Consultar a lista de constituintes da Anvisa.', flagTone: 'unknown',
    },
    {
        kicker: 'o produto', title: 'A regra permite; o laudo decide',
        items: [
            { text: 'Escolha produto de ingrediente único, com dose declarada e laudo de terceiro (por exemplo, Informed Sport). A certificação reduz o risco; não zera.', src: 'IOC 2018' },
            { text: 'E lembre do slide 81: o rótulo pode errar. Só 5 de 24 produtos deram ≥ 5 mmol por porção, de forma consistente.', src: 'Gallardo 2019' },
        ],
        flagTitle: 'em uma linha', flag: 'Regra de esporte e regra sanitária respondem “pode?”. Quem responde “quanto chega ao copo?” é o laudo.', flagTone: 'ok',
    },
];
