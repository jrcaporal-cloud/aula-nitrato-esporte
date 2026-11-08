import type { CSSProperties, ReactNode } from 'react';
import { Card } from '../ui';

/** Palco da arte: cartão com luz de fundo na cor do passo; o SVG ocupa o espaço todo (proporção fixa, sem rolagem). */

export const ART_W = 812;
export const ART_H = 458;

export const Stage = ({ glow, children, className = '', style }: { glow: string; children: ReactNode; className?: string; style?: CSSProperties }) => (
    <Card className={`relative flex min-w-0 flex-1 flex-col ${className}`}
        style={{ background: `radial-gradient(110% 80% at 50% 0%, ${glow}22, rgba(10,6,14,0.84) 62%)`, ...style }}>
        {children}
    </Card>
);

/** SVG que preenche o palco; o viewBox 1:1 com o palco mantém o texto ≥ 16 px. */
export const ArtSvg = ({ w = ART_W, h = ART_H, label, children, className = 'min-h-0 w-full flex-1' }:
    { w?: number; h?: number; label: string; children: ReactNode; className?: string }) => (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
        {children}
    </svg>
);

/** Número grande com legenda (HTML), para os selos do palco. */
export const BigNum = ({ n, label, color }: { n: ReactNode; label: string; color: string }) => (
    <div className="rounded-xl border px-3 py-2" style={{ borderColor: `${color}88`, background: `${color}12` }}>
        <p className="m-0 flex items-center gap-2 font-display text-[28px] font-semibold leading-none text-white">{n}</p>
        <p className="m-0 mt-1 text-[15px] leading-snug text-gray-200">{label}</p>
    </div>
);
