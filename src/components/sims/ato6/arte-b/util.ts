import type { CSSProperties } from 'react';

/** Utilitários sem componente da arte do Ato VI (separados para o fast refresh). */

/** Atalho para passar variáveis CSS (--ab-*) no style sem brigar com o tipo. */
export const cv = (vars: Record<string, string | number>): CSSProperties => vars as CSSProperties;

/** Pontos pequenos de brilho (fundo de profundidade) — posições fixas, sem aleatório no render. */
export const SPARKS: readonly { x: number; y: number; d: number }[] = Array.from({ length: 22 }, (_, i) => ({
    x: (i * 137.5) % 100, y: (i * 61.8 + 13) % 100, d: (i % 7) * 0.6,
}));
