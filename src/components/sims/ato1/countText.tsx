import type { CSSProperties } from 'react';
import type { CountUpOptions } from '../kit/countUp';
import { useCountText } from './countFrame';

/** Contador em HTML para número que já vem como texto (ver ./countFrame.ts). Termina no texto original. */

interface CountTextProps extends Omit<CountUpOptions, 'from'> {
    text: string;
    className?: string;
    style?: CSSProperties;
}

/** Versão HTML: <CountText text={claim.stat} delayMs={…} />. */
export const CountText = ({ text, className, style, ...opts }: CountTextProps) => (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>{useCountText(text, opts)}</span>
);
