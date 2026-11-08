import { describe, expect, it } from 'vitest';
import { formatLike, splitNumber } from './countText';

/** O contador só pode animar o caminho: remontar o número do fim tem que dar o texto do dossiê, letra por letra. */
const rebuild = (text: string, after?: number): string => {
    const p = splitNumber(text, after);
    return p ? `${p.pre}${formatLike(p.value, p.decimals, p.grouped)}${p.post}` : text;
};

describe('splitNumber / formatLike', () => {
    const texts = [
        '−5,4%', '+16%', '−2,7%', '×8', '×30', '+14%', '−3,0%', '0,17', '+25 s', '−2 s', 'd 0,02', 'r 0,86', '~2,5×',
        '+60%', '19,5', '8 dias', '12 / 12', '−3,2%', '393 s', 'SMD 2,25', '−0,08 (−0,36 a 0,20)', 'POSITIVOS · 5',
        '+11 s (IC95% −60 a +38)', '29,35 km', '43,83 km', '−0,4% · p = 0,6', '1.704 m', '568 W', 'ES −0,01', '14,5 rad/s',
        '7,90 W/kg', 'g 0,45', '−9,6 a +26,8%', '−2,8% · P 0,007', 'SMD −0,92', '12,6', 'P = 0,27', '10,23 vs 10,17',
        '+60 m', '46%', '35 (23 ± 5 anos)', '+237%', '0,09 (0,00 a 0,17)', '−0,9% · p 0,12', '5,8 s', '+4,2%',
    ];
    it.each(texts)('remonta "%s" idêntico', t => expect(rebuild(t)).toBe(t));

    it('acha o número certo', () => {
        expect(splitNumber('×30')).toMatchObject({ pre: '×', value: 30, decimals: 0, post: '' });
        expect(splitNumber('1.704 m')).toMatchObject({ value: 1704, grouped: true, post: ' m' });
        expect(splitNumber('d 0,02')).toMatchObject({ pre: 'd ', value: 0.02, decimals: 2 });
        expect(splitNumber('12 / 12')).toMatchObject({ value: 12, post: ' / 12' });
    });

    it('ignora número colado a letra e texto sem número', () => {
        expect(splitNumber('Yo-Yo IR1 · 4,2')).toMatchObject({ value: 4.2 });
        expect(splitNumber('menos hipóxia')).toBeNull();
    });

    it('formata com vírgula e milhar como o original', () => {
        expect(formatLike(1636.4, 0, true)).toBe('1.636');
        expect(formatLike(3.14159, 2, false)).toBe('3,14');
    });
});
