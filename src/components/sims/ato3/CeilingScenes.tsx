import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { REASONS } from './ceiling.content';
import { KH, KW } from './CeilingChart';

/** Cenas dos passos 4 e 5 do slide 45 (700 × 360). */

const Cup = ({ x, y, color }: { x: number; y: number; color: string }) => (
    <g>
        <path d={`M ${x - 22} ${y} h 44 l -6 52 h -32 z`} fill={`${color}33`} stroke={color} strokeWidth={3} strokeLinejoin="round" />
        <rect x={x - 17} y={y + 18} width={34} height={28} rx={3} fill={color} fillOpacity={0.7} />
    </g>
);

const Column = ({ x, title, sub, nitrate, nitrite, reduce }: { x: number; title: string; sub: string; nitrate: number; nitrite: number; reduce: boolean }) => {
    const base = 296;
    const maxH = 150;
    const bar = (cx: number, v: number, color: string, label: string, delay: number) => (
        <g>
            <motion.rect x={cx - 34} y={base - v * maxH} width={68} height={v * maxH} rx={6} fill={color} fillOpacity={0.9}
                style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
                initial={{ scaleY: reduce ? 1 : 0 }} animate={{ scaleY: 1 }} transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : delay }} />
            <SvgText x={cx} y={base + 24} text={label} size={16} weight={600} anchor="middle" color="#E5E7EB" />
        </g>
    );
    return (
        <g>
            <SvgText x={x} y={28} text={title} size={20} weight={700} anchor="middle" color="#fff" />
            <SvgText x={x} y={50} text={sub} size={16} weight={500} anchor="middle" color={C.muted} />
            <Cup x={x} y={72} color={C.nitrate} />
            <SvgText x={x} y={146} text="mesma dose: 5,5 mmol" size={16} weight={600} anchor="middle" color={C.nitrateSoft} />
            {bar(x - 50, nitrate, C.nitrate, 'nitrato', 0.1)}
            {bar(x + 50, nitrite, C.nitrite, 'nitrito', 0.25)}
            <line x1={x - 100} x2={x + 100} y1={base} y2={base} stroke="rgba(255,255,255,0.35)" />
        </g>
    );
};

/** Esquema: mesma dose, o mais apto sobe menos nitrato e nitrito no plasma. Alturas ilustrativas. */
export const PkScene = ({ reduce }: { reduce: boolean }) => (
    <svg viewBox={`0 0 ${KW} ${KH}`} width={KW} height={KH} role="img" aria-label="Mesma dose, menor aumento de nitrato e nitrito no mais apto">
        <Column x={180} title="Pouco treinado" sub="VO₂pico ~40" nitrate={0.92} nitrite={0.82} reduce={reduce} />
        <Column x={520} title="Muito treinado" sub="VO₂pico ~70" nitrate={0.5} nitrite={0.5} reduce={reduce} />
        <path d="M 270 190 h 70 m -10 -9 l 10 9 l -10 9" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        <SvgText x={350} y={176} text="aumento no plasma" size={16} weight={600} anchor="middle" color={C.muted} />
    </svg>
);

/** As quatro razões do teto, em cartões 2 × 2. */
export const ReasonsGrid = () => (
    <div className="grid grid-cols-2 gap-3" style={{ width: KW, height: KH - 8 }}>
        {REASONS.map((r, i) => (
            <motion.div key={r.id} className="rounded-xl border bg-white/[0.03] px-4 py-3 flex flex-col gap-1" style={{ borderColor: `${r.color}66` }}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.12 }}>
                <span className="font-mono text-[15px]" style={{ color: r.color }}>{i + 1} · {r.title.toUpperCase()}</span>
                <span className="font-display text-[2rem] leading-none font-semibold tabular-nums" style={{ color: r.color }}>{r.big}</span>
                {r.lines.map(l => <span key={l} className="text-[16px] leading-snug text-gray-200">{l}</span>)}
            </motion.div>
        ))}
    </div>
);
