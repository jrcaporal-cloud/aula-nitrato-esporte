import { C } from '../kit/palette';

/** Ícones esquemáticos (40×40) dos cinco pontos do circuito entero-salivar. */
const STROKE = '#CBD5E1';

export type GlyphKey = 'mouth' | 'stomach' | 'gut' | 'blood' | 'gland';

export const Glyph = ({ kind, x, y, tint = STROKE }: { kind: GlyphKey; x: number; y: number; tint?: string }) => (
    <g transform={`translate(${x} ${y})`} fill="none" stroke={tint} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
        {kind === 'mouth' && (
            <>
                <path d="M3 18 C12 8 28 8 37 18 C28 32 12 32 3 18 Z" />
                <ellipse cx={20} cy={24} rx={9} ry={5} fill="rgba(244,114,182,0.35)" stroke="none" />
                {[[15, 24], [20, 26], [25, 24]].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r={2.4} fill={C.bacteria} stroke="none" />)}
            </>
        )}
        {kind === 'stomach' && (
            <>
                <path d="M10 6 C10 12 12 14 18 14 C30 14 37 20 35 29 C33 36 22 38 14 33 C6 28 8 20 12 18" />
                <path d="M6 5 L14 5" />
            </>
        )}
        {kind === 'gut' && <path d="M4 8 L34 8 Q38 8 38 12 Q38 16 34 16 L8 16 Q4 16 4 20 Q4 24 8 24 L34 24 Q38 24 38 28 Q38 32 34 32 L10 32" />}
        {kind === 'blood' && <path d="M20 4 C20 4 7 19 7 27 A13 13 0 0 0 33 27 C33 19 20 4 20 4 Z" />}
        {kind === 'gland' && (
            <>
                <circle cx={13} cy={12} r={7} /><circle cx={27} cy={12} r={7} /><circle cx={20} cy={24} r={7} />
                <path d="M20 31 L20 38" />
            </>
        )}
    </g>
);
