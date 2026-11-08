import { motion, useReducedMotion } from 'framer-motion';
import { useId } from 'react';
import { C } from '../../kit/palette';
import type { FoodId } from '../foodContent';
import { VEG_COLOR } from './artData';

/**
 * Hortaliças em formas geométricas e peças de cena do Ato VI (arte A): prato, pilha, copo de shot.
 * Folhas em verde-musgo (não confundir com o verde brilhante do NO); o nitrato é sempre o líquido magenta.
 */

const VEIN = '#2F5F43';

/** Uma unidade da hortaliça, desenhada em torno da origem (cerca de 30 px de altura). */
export const Glyph = ({ kind }: { kind: FoodId }) => {
    if (kind === 'rucula') {
        return (
            <g>
                {[-38, 0, 38].map(a => (
                    <g key={a} transform={`rotate(${a})`}>
                        <path d="M0,0 C-7,-8 -9,-20 0,-30 C9,-20 7,-8 0,0Z" fill={VEG_COLOR.rucula} />
                        <path d="M0,-2 L0,-24" stroke={VEIN} strokeWidth={1.3} />
                    </g>
                ))}
            </g>
        );
    }
    if (kind === 'espinafre') {
        return (
            <g>
                <path d="M0,6 L0,0" stroke={VEIN} strokeWidth={2} />
                <path d="M0,0 C-17,-6 -19,-24 0,-33 C19,-24 17,-6 0,0Z" fill={VEG_COLOR.espinafre} />
                <path d="M0,-1 L0,-28 M0,-12 L-8,-18 M0,-12 L8,-18" stroke={VEIN} strokeWidth={1.3} fill="none" />
            </g>
        );
    }
    if (kind === 'aipo') {
        return (
            <g>
                <rect x={-6} y={-32} width={12} height={38} rx={6} fill={VEG_COLOR.aipo} />
                {[-2.4, 2.4].map(x => <path key={x} d={`M${x},-27 L${x},1`} stroke="#7FA85E" strokeWidth={1.2} />)}
                <circle cx={-5} cy={-33} r={5} fill="#7FB36A" />
                <circle cx={5} cy={-34} r={5} fill="#8FC27A" />
            </g>
        );
    }
    return (
        <g>
            <path d="M0,-17 L-5,-30 M0,-17 L5,-31" stroke={C.nitrateSoft} strokeWidth={2.2} strokeLinecap="round" />
            <ellipse cx={-6} cy={-31} rx={4} ry={2.6} fill={VEG_COLOR.espinafre} />
            <ellipse cx={7} cy={-32} rx={4} ry={2.6} fill={VEG_COLOR.espinafre} />
            <circle cx={0} cy={-6} r={13} fill={VEG_COLOR.beterraba} />
            <path d="M-4,-14 C-9,-9 -9,-2 -4,3" stroke={C.nitrateSoft} strokeWidth={1.4} fill="none" opacity={0.7} />
            <path d="M0,7 L1,15" stroke="#7A1747" strokeWidth={1.6} strokeLinecap="round" />
        </g>
    );
};

const GOLDEN = 0.6180339887;

interface PileProps {
    kind: FoodId;
    cx: number;
    cy: number;
    /** Raio da área do prato em que a pilha se espalha. */
    radius: number;
    /** Quantas unidades aparecem e a capacidade total (fixa a posição de cada uma). */
    count: number;
    cap: number;
    /** Setor do prato (radianos); sem setor, a pilha ocupa o prato inteiro. */
    sector?: readonly [number, number];
    scale?: number;
    /** Capacidade usada só para espalhar (menor que `cap` = a pilha se abre mais depressa). */
    spread?: number;
}

/** Pilha de unidades: cada uma tem lugar fixo (girassol), então mexer no slider só acrescenta ou tira peças. */
export const Pile = ({ kind, cx, cy, radius, count, cap, sector, scale = 1, spread = cap }: PileProps) => {
    const reduce = useReducedMotion();
    const items = Array.from({ length: Math.min(Math.max(Math.round(count), 0), cap) }, (_, i) => {
        const frac = ((i * GOLDEN + 0.13) % 1);
        const theta = sector ? sector[0] + (sector[1] - sector[0]) * (0.1 + 0.8 * frac) : i * 2.39996;
        const r = radius * Math.min(Math.sqrt((i + 0.6) / (spread + 0.6)), 1);
        return { i, x: cx + Math.cos(theta) * r, y: cy + Math.sin(theta) * r, rot: ((i * 47) % 80) - 40 };
    });
    return (
        <g>
            {items.map(it => (
                <g key={it.i} transform={`translate(${it.x.toFixed(1)} ${it.y.toFixed(1)}) rotate(${it.rot}) scale(${scale})`}>
                    <motion.g style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
                        initial={reduce ? false : { opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: Math.min(it.i * 0.012, 0.5) }}>
                        <Glyph kind={kind} />
                    </motion.g>
                </g>
            ))}
        </g>
    );
};

/** Prato visto de cima: borda, fundo e brilho. */
export const PlateDisc = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => {
    const id = useId();
    return (
        <g>
            <defs>
                <radialGradient id={`${id}-pl`} cx="38%" cy="32%" r="80%">
                    <stop offset="0%" stopColor="#3A3446" />
                    <stop offset="100%" stopColor="#14101C" />
                </radialGradient>
            </defs>
            <ellipse cx={cx} cy={cy + r * 0.08} rx={r + 4} ry={r + 4} fill="#000" opacity={0.35} />
            <circle cx={cx} cy={cy} r={r + 6} fill={`url(#${id}-pl)`} stroke="rgba(255,255,255,0.22)" strokeWidth={1.2} />
            <circle cx={cx} cy={cy} r={r - 4} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
        </g>
    );
};

interface ShotProps {
    x: number;
    y: number;
    w?: number;
    h?: number;
    /** 0–1: nível do líquido; é animado por transição de CSS. */
    fill?: number;
    color?: string;
}

/** Copo de shot (70 mL) com o nível de nitrato. */
export const ShotGlass = ({ x, y, w = 38, h = 54, fill = 1, color = C.nitrate }: ShotProps) => {
    const id = useId();
    const path = `M0,0 L${w},0 L${w * 0.82},${h} L${w * 0.18},${h}Z`;
    return (
        <g transform={`translate(${x} ${y})`}>
            <defs>
                <clipPath id={`${id}-c`}><path d={path} /></clipPath>
                <linearGradient id={`${id}-l`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.62} />
                </linearGradient>
            </defs>
            <path d={path} fill="rgba(255,255,255,0.07)" />
            <g clipPath={`url(#${id}-c)`}>
                <rect x={0} y={0} width={w} height={h} fill={`url(#${id}-l)`}
                    style={{ transform: `translateY(${(1 - Math.min(Math.max(fill, 0), 1)) * h}px)`, transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)' }} />
                <path d={`M${w * 0.16},3 L${w * 0.3},${h * 0.8}`} stroke="#fff" strokeOpacity={0.35} strokeWidth={2.2} strokeLinecap="round" />
            </g>
            <path d={path} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={1.8} strokeLinejoin="round" />
        </g>
    );
};

/** Gota de nitrato (1 mmol). */
export const Drop = ({ x, y, s = 1, color = C.nitrate, opacity = 1 }: { x: number; y: number; s?: number; color?: string; opacity?: number }) => (
    <path d="M0,-12 C6,-4 9,1 9,5 A9,9 0 0 1 -9,5 C-9,1 -6,-4 0,-12Z" transform={`translate(${x} ${y}) scale(${s})`} fill={color} opacity={opacity} />
);
