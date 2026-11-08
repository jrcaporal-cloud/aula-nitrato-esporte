import { useId } from 'react';
import { C } from '../../kit/palette';
import type { ProductKind } from './artData';

/** Embalagens geométricas dos quatro tipos de produto do estudo de Gallardo & Coggan 2019. Base em y=0, ~70 px de altura. */


interface ProductProps {
    kind: ProductKind;
    /** Cor do líquido ou da tarja (magenta = nitrato; verde = passou de 5 mmol). */
    accent?: string;
    /** Nível do líquido (0–1), onde houver visor. */
    level?: number;
}

const GLASS = 'rgba(255,255,255,0.1)';
const EDGE = 'rgba(255,255,255,0.55)';

export const Product = ({ kind, accent = C.nitrate, level = 0.7 }: ProductProps) => {
    const id = useId();
    const fill = `url(#${id}-a)`;
    const grad = (
        <defs>
            <linearGradient id={`${id}-a`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} /><stop offset="100%" stopColor={accent} stopOpacity={0.6} />
            </linearGradient>
        </defs>
    );
    if (kind === 'po') {
        return (
            <g>{grad}
                <rect x={-20} y={-52} width={40} height={52} rx={7} fill="#2A2336" stroke={EDGE} strokeWidth={1.4} />
                <rect x={-23} y={-62} width={46} height={12} rx={5} fill="#463C5A" stroke={EDGE} strokeWidth={1.2} />
                <rect x={-20} y={-38} width={40} height={20} fill={fill} />
                <rect x={-11} y={-34} width={22} height={5} rx={2.5} fill="#fff" opacity={0.75} />
                <rect x={-11} y={-26} width={14} height={4} rx={2} fill="#fff" opacity={0.5} />
            </g>
        );
    }
    if (kind === 'mista') {
        return (
            <g>{grad}
                <rect x={-16} y={-64} width={32} height={64} rx={9} fill="#2A2336" stroke={EDGE} strokeWidth={1.4} />
                <rect x={-16} y={-64 + 64 * (1 - level)} width={32} height={64 * level} rx={9} fill={fill} opacity={0.85} />
                <rect x={-9} y={-44} width={18} height={20} rx={3} fill="#fff" opacity={0.75} />
                <rect x={-10} y={-68} width={20} height={6} rx={3} fill="#463C5A" stroke={EDGE} strokeWidth={1} />
            </g>
        );
    }
    if (kind === 'conc') {
        return (
            <g>{grad}
                <rect x={-7} y={-62} width={14} height={14} rx={3} fill="#463C5A" stroke={EDGE} strokeWidth={1.2} />
                <path d="M-7,-48 L7,-48 L19,-36 L19,-6 Q19,0 13,0 L-13,0 Q-19,0 -19,-6 L-19,-36Z" fill={GLASS} stroke={EDGE} strokeWidth={1.4} />
                <path d="M-18,-26 L18,-26 L18,-6 Q18,-1 13,-1 L-13,-1 Q-18,-1 -18,-6Z" fill={fill} />
                <rect x={-10} y={-24} width={20} height={14} rx={3} fill="#fff" opacity={0.7} />
            </g>
        );
    }
    return (
        <g>{grad}
            <rect x={-6} y={-70} width={12} height={9} rx={3} fill="#463C5A" stroke={EDGE} strokeWidth={1.2} />
            <path d="M-6,-61 L6,-61 L6,-48 Q16,-44 16,-34 L16,-6 Q16,0 10,0 L-10,0 Q-16,0 -16,-6 L-16,-34 Q-16,-44 -6,-48Z" fill={GLASS} stroke={EDGE} strokeWidth={1.4} />
            <path d="M-15,-30 L15,-30 L15,-6 Q15,-1 10,-1 L-10,-1 Q-15,-1 -15,-6Z" fill={fill} />
            <rect x={-9} y={-24} width={18} height={14} rx={3} fill="#fff" opacity={0.7} />
        </g>
    );
};
