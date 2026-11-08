import { describe, expect, it } from 'vitest';
import { countFrame } from './countFrame';

const TEXTS = ['800–6.000 ppb · mais de 100×', '−95%', '583 → 675 s', 'd = 0,02', '8,4 ≈ 16,8', '+15% × 0', '2–3 h', 'H₂O₂ ↑', '164 × 136,5 N'];

describe('countFrame', () => {
    it('termina no texto original', () => {
        for (const text of TEXTS) expect(countFrame(text, 1)).toBe(text);
    });
    it('no meio, mantém casas decimais, milhar e símbolos', () => {
        expect(countFrame('800–6.000 ppb · mais de 100×', 0.5)).toBe('400–3.000 ppb · mais de 50×');
        expect(countFrame('d = 0,02', 0.5)).toBe('d = 0,01');
        expect(countFrame('164 × 136,5 N', 0.5)).toBe('82 × 68,3 N');
        expect(countFrame('H₂O₂ ↑', 0.5)).toBe('H₂O₂ ↑');
    });
    it('começa em zero', () => {
        expect(countFrame('583 → 675 s', 0)).toBe('0 → 0 s');
    });
});
