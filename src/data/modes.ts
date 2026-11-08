/**
 * Versões da aula por tempo disponível. A aula completa dura cerca de 2h50 com discussão.
 * Abrir com `?tempo=90` ou `?tempo=60` esconde os slides de aprofundamento (ids do JSON);
 * nada é apagado — sem o parâmetro a aula vem completa.
 */
export type Tempo = 'completa' | '90' | '60';

/**
 * 90 min: mantém a viagem do íon (boca, redutases, custo de O₂, mecanismo refutado, cascata), os ensaios
 * de endurance e de potência essenciais, a metodologia que muda a leitura e o veredito prático.
 */
const SKIP_90 = new Set<number>([12, 13, 21, 24, 25, 29, 30, 32, 33, 43, 47, 48, 51, 53, 54, 55, 61, 62, 63, 64, 67, 85, 86]);

/** 60 min: só a espinha — votação, casos, a boca, o custo de O₂, TTE × TT, dose, o teto do treinado, respondedores e o veredito. */
const KEEP_60 = new Set<number>([0, 10, 11, 20, 22, 23, 26, 28, 31, 41, 42, 45, 46, 52, 65, 66, 82, 83, 88, 99]);

export const readTempo = (search: string): Tempo => {
    const value = new URLSearchParams(search).get('tempo');
    return value === '90' || value === '60' ? value : 'completa';
};

export const keepsSlide = (tempo: Tempo, slideId: number): boolean => {
    if (tempo === '90') return !SKIP_90.has(slideId);
    if (tempo === '60') return KEEP_60.has(slideId);
    return true;
};
