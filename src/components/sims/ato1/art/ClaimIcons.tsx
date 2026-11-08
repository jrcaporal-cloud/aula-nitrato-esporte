import { C } from '../../kit/palette';

/**
 * Selos ilustrados das seis frases (caixa 64×64). Geometria simples, um tema por frase:
 * 1 beterraba · 2 atleta · 3 frasco de dose · 4 gota de pigmento · 5 molécula = beterraba · 6 cronômetro.
 */

const Beet = () => (
    <g>
        <path d="M32 24 C29 14 22 7 14 7 C17 14 22 19 30 25Z" fill={C.no} />
        <path d="M32 24 C33 12 38 4 46 3 C46 11 41 18 34 25Z" fill={C.noSoft} />
        <path d="M32 24 V16" stroke={C.nitrateDeep} strokeWidth={2.5} strokeLinecap="round" />
        <path d="M32 21 C47 21 56 31 52 42 C49 50 41 56 34 60 L32 63 L30 60 C23 56 15 50 12 42 C8 31 17 21 32 21Z" fill={C.nitrate} />
        <path d="M17 33 C19 28 24 25 30 25 M15 41 C20 40 26 40 32 41" stroke="#fff" strokeOpacity={0.28} strokeWidth={2.5} strokeLinecap="round" fill="none" />
        <path d="M20 31 C22 28 26 26 29 26" stroke="#fff" strokeOpacity={0.5} strokeWidth={3} strokeLinecap="round" fill="none" />
    </g>
);

const Runner = () => (
    <g fill="none" stroke={C.o2Soft} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx={41} cy={11} r={6} fill={C.o2Soft} stroke="none" />
        <path d="M39 21 L31 38" />
        <path d="M38 25 L48 31 L55 26" />
        <path d="M36 27 L26 31 L21 40" />
        <path d="M31 38 L44 46 L42 59" />
        <path d="M31 38 L21 49 L8 47" />
        <path d="M6 18 H16 M2 26 H12" stroke={C.o2} strokeWidth={3} opacity={0.7} />
    </g>
);

const Flask = () => (
    <g>
        <path d="M24 28 H40 L53 52 Q56 59 48 59 H16 Q8 59 11 52Z" fill={C.nitrate} opacity={0.85} />
        <path d="M25 6 H39 M27 6 V26 L11 52 Q8 59 16 59 H48 Q56 59 53 52 L37 26 V6" fill="none" stroke={C.nitrateSoft} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={26} cy={46} r={3} fill="#fff" opacity={0.5} />
        <circle cx={36} cy={40} r={2.2} fill="#fff" opacity={0.5} />
        <circle cx={31} cy={51} r={2} fill="#fff" opacity={0.5} />
        <path d="M44 14 h8 M48 10 v8" stroke={C.nitriteSoft} strokeWidth={3} strokeLinecap="round" />
    </g>
);

const Drop = () => (
    <g>
        <path d="M30 7 C30 7 12 28 12 41 A18 18 0 0 0 48 41 C48 28 30 7 30 7Z" fill={C.nitrate} />
        <path d="M20 42 C20 48 24 52 29 53" stroke="#fff" strokeOpacity={0.45} strokeWidth={3.5} strokeLinecap="round" fill="none" />
        <path d="M52 10 l2.2 5.8 5.8 2.2 -5.8 2.2 -2.2 5.8 -2.2 -5.8 -5.8 -2.2 5.8 -2.2Z" fill={C.nitriteSoft} />
        <path d="M10 14 l1.6 4.2 4.2 1.6 -4.2 1.6 -1.6 4.2 -1.6 -4.2 -4.2 -1.6 4.2 -1.6Z" fill={C.o2Soft} />
    </g>
);

const Equal = () => (
    <g>
        <path d="M14 20 L24 25 V37 L14 42 L4 37 V25Z" fill="none" stroke={C.o2} strokeWidth={3} strokeLinejoin="round" />
        <circle cx={14} cy={31} r={4} fill={C.o2Soft} />
        <path d="M27 27 H37 M27 36 H37" stroke="#fff" strokeWidth={4} strokeLinecap="round" />
        <g transform="translate(40 18) scale(0.4)"><Beet /></g>
    </g>
);

const Watch = () => (
    <g>
        <rect x={27} y={4} width={10} height={6} rx={2} fill={C.nitriteSoft} />
        <path d="M32 10 V14" stroke={C.nitriteSoft} strokeWidth={3} />
        <circle cx={32} cy={37} r={21} fill="rgba(251,191,36,0.12)" stroke={C.nitrite} strokeWidth={3.5} />
        <path d="M32 37 V24 M32 37 L41 43" stroke={C.nitriteSoft} strokeWidth={3.5} strokeLinecap="round" />
        <circle cx={32} cy={37} r={3} fill={C.nitrite} />
        <path d="M50 14 C46 8 52 4 54 2 C54 6 58 8 56 14 C55 17 51 17 50 14Z" fill={C.hypoxia} />
    </g>
);

const ICONS: Readonly<Record<number, () => React.JSX.Element>> = { 1: Beet, 2: Runner, 3: Flask, 4: Drop, 5: Equal, 6: Watch };

/** Selo da frase `id` (1…6) no tamanho pedido. */
export const ClaimIcon = ({ id, size = 64 }: { id: number; size?: number }) => {
    const Icon = ICONS[id] ?? Beet;
    return (
        <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden className="block overflow-visible">
            <Icon />
        </svg>
    );
};
