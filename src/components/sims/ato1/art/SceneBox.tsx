import type { ReactNode } from 'react';

export const SCENE_W = 268;
export const SCENE_H = 128;
export const GROUND_Y = 112;

interface SceneBoxProps {
    id: string;
    color: string;
    label: string;
    /** Silhueta apagada (caso que ainda não entrou). */
    ghost?: boolean;
    children: ReactNode;
}

/** Moldura comum das cenas de prova: céu em degradê na cor do personagem, faixa de chão e brilho no horizonte. */
export const SceneBox = ({ id, color, label, ghost = false, children }: SceneBoxProps) => (
    <svg viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} width="100%" height={SCENE_H} role="img" aria-label={label} className="block"
        style={{ opacity: ghost ? 0.22 : 1, filter: ghost ? 'grayscale(1)' : undefined }}>
        <defs>
            <linearGradient id={`${id}-sky`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#0B0710" />
                <stop offset="0.7" stopColor={color} stopOpacity={0.3} />
                <stop offset="1" stopColor={color} stopOpacity={0.46} />
            </linearGradient>
            <linearGradient id={`${id}-ground`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#1A1222" />
                <stop offset="1" stopColor="#09060D" />
            </linearGradient>
        </defs>
        <rect width={SCENE_W} height={SCENE_H} fill={`url(#${id}-sky)`} />
        {children}
        <rect y={GROUND_Y} width={SCENE_W} height={SCENE_H - GROUND_Y} fill={`url(#${id}-ground)`} />
        <line x1={0} x2={SCENE_W} y1={GROUND_Y} y2={GROUND_Y} stroke={color} strokeOpacity={0.55} strokeWidth={1.5} />
    </svg>
);
