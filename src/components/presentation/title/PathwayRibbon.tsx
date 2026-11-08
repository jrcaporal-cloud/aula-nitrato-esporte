import { motion } from 'framer-motion';

/**
 * A ideia da aula num traço: o nitrato da comida vira nitrito na boca e óxido nítrico no músculo.
 * Sem números de propósito: é símbolo, não dado. O ponto que viaja usa <animateMotion> do SVG,
 * que não passa pelo React a cada quadro.
 */
const PATH = 'M 60 52 C 150 52, 170 52, 260 52 S 370 52, 460 52';
const NODES = [
    { x: 60, label: 'NO₃⁻', note: 'na comida', color: '#F0437E' },
    { x: 260, label: 'NO₂⁻', note: 'na boca', color: '#FBBF24' },
    { x: 460, label: 'NO', note: 'no músculo', color: '#34D399' },
] as const;

export const PathwayRibbon = () => (
    <svg width={540} height={124} viewBox="0 0 520 124" aria-hidden className="overflow-visible">
        <defs>
            <linearGradient id="pr-grad" x1="0" x2="1">
                <stop offset="0%" stopColor="#F0437E" />
                <stop offset="50%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
        </defs>
        <motion.path
            d={PATH}
            fill="none"
            stroke="url(#pr-grad)"
            strokeWidth={3}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 1.0, duration: 2.0, ease: 'easeInOut' }}
        />
        <circle r={6} fill="#fff" opacity={0.9} style={{ filter: 'drop-shadow(0 0 8px #fff)' }}>
            <animateMotion dur="4.2s" begin="3.2s" repeatCount="indefinite" path={PATH} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
            <animate attributeName="opacity" values="0;0.95;0.95;0" keyTimes="0;0.1;0.85;1" dur="4.2s" begin="3.2s" repeatCount="indefinite" />
        </circle>
        {NODES.map((n, i) => (
            <motion.g
                key={n.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + i * 0.8, duration: 0.6 }}
            >
                <circle cx={n.x} cy={52} r={30} fill="#07050B" stroke={n.color} strokeWidth={2.5} style={{ filter: `drop-shadow(0 0 10px ${n.color})` }} />
                <text x={n.x} y={53} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={19} fontWeight={700} fontFamily="'Clash Display', sans-serif">{n.label}</text>
                <text x={n.x} y={108} textAnchor="middle" fill="#D1D5DB" fontSize={16} fontFamily="'Satoshi', sans-serif">{n.note}</text>
            </motion.g>
        ))}
    </svg>
);
