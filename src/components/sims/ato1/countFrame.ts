import { useCountUp, type CountUpOptions } from '../kit/countUp';
import { br } from '../kit/format';

/**
 * Contador para números que já vêm como texto pronto ("583 → 675 s", "d = 0,02", "+15% × 0").
 * Cada número do texto sobe de 0 até o valor, com as mesmas casas decimais (vírgula); sinais, setas e unidades ficam como estão.
 * Ao terminar, devolve o texto ORIGINAL, idêntico ao de antes. Usa o useCountUp do kit (respeita movimento reduzido).
 * Atos I e II (ato1/, ato2a/, ato2b/). Componente HTML em ./countText.tsx.
 */

/** "6.000" (milhar com ponto), "0,74", "583". */
const NUMBER = /\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?/g;

const decimalsOf = (token: string) => (token.includes(',') ? token.split(',')[1].length : 0);

const valueOf = (token: string) => Number(token.replace(/\./g, '').replace(',', '.'));

/** Mesmo formato do token original: vírgula decimal e, se ele tinha, ponto de milhar. */
const formatLike = (token: string, n: number) => {
    const text = br(n, decimalsOf(token));
    if (!token.includes('.')) return text;
    const [int, dec] = text.split(',');
    const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return dec === undefined ? grouped : `${grouped},${dec}`;
};

/** Texto no quadro `p` (0…1) da subida. */
export const countFrame = (text: string, p: number): string => {
    if (p >= 1) return text;
    return text.replace(NUMBER, token => formatLike(token, valueOf(token) * p));
};

/** Hook: o texto do quadro atual (use em SVG: <SvgText text={useCountText('8,4 ≈ 16,8')} …/>). */
export const useCountText = (text: string, opts: Omit<CountUpOptions, 'from'> = {}): string => countFrame(text, useCountUp(1, opts));
