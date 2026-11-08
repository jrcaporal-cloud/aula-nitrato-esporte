/** Texto e números do slide 52 (dossiê 03, blocos C e D; dossiê 01, seção 11). */

export interface VelocityStep {
    tab: string;
    kicker: string;
    headline: string;
    text: string;
    facts: readonly (readonly [string, string])[];
    takeaway: string;
    source: string;
    chip: string;
}

export const VELOCITY_STEPS: readonly VelocityStep[] = [
    {
        tab: 'Força',
        kicker: 'Lago-Rodríguez 2020 · 5 estudos',
        headline: 'Primeiro, o que não muda',
        text: 'O torque isocinético não se mexe: ES −0,01, e de −0,11 a 0,16 em cada velocidade de 90 a 360°/s. A força máxima voluntária também fica onde estava: a curva parte do mesmo ponto.',
        facts: [['torque isocinético', 'ES −0,01'], ['por velocidade', '−0,11 a 0,16']],
        takeaway: 'Não fica mais forte.',
        source: 'Lago-Rodríguez 2020 · Haider 2014.',
        chip: 'curva ilustrativa · âncoras medidas',
    },
    {
        tab: 'Velocidade',
        kicker: 'Coggan 2015 · 12 pessoas · 11,2 mmol',
        headline: 'Onde aparece: na velocidade',
        text: 'Nos extensores do joelho, a velocidade máxima calculada subiu de 13,1 para 14,5 rad/s e o NO exalado subiu 61%. A curva desliza para a direita; o ponto de partida continua igual.',
        facts: [['placebo', '13,1 rad/s'], ['beterraba', '14,5 rad/s'], ['NO exalado', '+61%']],
        takeaway: 'Mais rápido, não mais forte.',
        source: 'Coggan 2015, Nitric Oxide.',
        chip: 'curva ilustrativa · âncoras medidas',
    },
    {
        tab: 'Potência',
        kicker: 'mesmo estudo · potência calculada',
        headline: 'A parábola da potência sobe',
        text: 'Potência é força × velocidade, então o topo da parábola sobe: 7,44 → 7,90 W/kg. O pico medido na maior velocidade (6,28 rad/s) foi +4%. Em 50 extensões a 3,14 rad/s, a fadiga não mudou.',
        facts: [['placebo', '7,44 W/kg'], ['beterraba', '7,90 W/kg'], ['a 6,28 rad/s', '+4%']],
        takeaway: 'O ganho está no topo da parábola, não na base.',
        source: 'Coggan 2015, Nitric Oxide.',
        chip: 'curva ilustrativa · âncoras medidas',
    },
    {
        tab: 'Meta-análise',
        kicker: 'Coggan 2021 · 19 estudos · 268 pessoas',
        headline: 'Em média, ~5% de potência',
        text: 'Dados individuais de 19 estudos: g 0,45 (0,30 a 0,61), maior com dose aguda (0,54) que com várias (0,22). Em idosos, uma dose elevou a velocidade 10,9% e a potência 4,4%.',
        facts: [['potência máxima', 'g 0,45'], ['idosos · velocidade', '+10,9%'], ['idosos · potência', '+4,4%']],
        takeaway: 'O desfecho de força mais consistente.',
        source: 'Coggan 2021 · Coggan 2020.',
        chip: 'dados publicados · IC95%',
    },
    {
        tab: 'Cada um é um',
        kicker: 'Coggan 2018 · 20 pessoas · 12,3 mmol',
        headline: 'A média esconde −9,6 a +26,8%',
        text: 'Potência máxima +4,4 ± 8,1% em média. Quem mais converteu nitrato em nitrito ganhou mais (r = 0,60); idade, massa, IMC e tipo de fibra não explicaram. Quanto é resposta verdadeira? Ato V.',
        facts: [['média', '+4,4 ± 8,1%'], ['faixa', '−9,6 a +26,8%'], ['r com Δ nitrito', '0,60']],
        takeaway: 'Pontos do meio ilustrativos; extremos, média e r são do estudo.',
        source: 'Coggan 2018, Physiol Rep.',
        chip: 'pontos intermediários ilustrativos',
    },
];

/**
 * Nuvem de 20 respondedores: [variação da potência máxima em %, posição (0–1) do aumento de nitrito].
 * Extremos (−9,6 e +26,8), média (+4,4) e DP (8,1) reproduzem COGGAN2018R; os pontos intermediários e o
 * ranking de nitrito (r ≈ 0,60 com a resposta) são sintéticos, gerados só para desenhar a nuvem.
 */
export const RESPONDERS: readonly (readonly [number, number])[] = [
    [-9.6, 0.26], [-4.2, 0.32], [-3.2, 0.37], [-2.2, 0.11], [-1.4, 0], [-0.5, 0.16], [0.3, 0.21], [1.1, 0.84],
    [1.9, 0.47], [2.7, 0.58], [3.6, 0.63], [4.5, 0.95], [5.5, 0.05], [6.6, 0.42], [7.8, 0.79], [9.1, 0.74],
    [10.7, 0.89], [12.8, 0.53], [15.7, 0.68], [26.8, 1],
];
