import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../../kit/palette';

/** Dois grupos de barras (controle × nitrato) a partir do zero. Usado em 2006–07 (Larsen) e 2009 (Bailey). */

export interface BarSide {
    label: string;
    value: number;
    shown: string;
}

export interface BarGroup {
    title: string;
    max: number;
    control: BarSide;
    nitrate: BarSide;
    /** Variação em destaque entre as barras (só quando o dossiê traz o número). */
    delta?: string;
}

const BAR_AREA = 160;

const Bar = ({ side, max, color, delay }: { side: BarSide; max: number; color: string; delay: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex w-[96px] flex-col items-center justify-end">
            <span className="mb-1.5 text-[17px] font-bold leading-none text-white">{side.shown}</span>
            <motion.div className="w-full rounded-t-lg" style={{ background: color }}
                initial={{ height: 0 }} animate={{ height: (side.value / max) * BAR_AREA }}
                transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : delay, ease: 'easeOut' }} />
        </div>
    );
};

const Group = ({ group, order }: { group: BarGroup; order: number }) => (
    <div className="flex flex-col items-center">
        <p className="text-center text-[16px] leading-none text-gray-200">{group.title}</p>
        <div className="my-2 flex h-9 items-center">
            {group.delta && (
                <span className="rounded-md border px-2.5 py-0.5 font-display text-[1.3rem] font-bold leading-tight"
                    style={{ borderColor: `${C.nitrate}99`, color: C.nitrateSoft, background: `${C.nitrate}1a` }}>
                    {group.delta}
                </span>
            )}
        </div>
        <div className="flex items-end gap-3 border-b-2 border-white/30" style={{ height: BAR_AREA + 26 }}>
            <Bar side={group.control} max={group.max} color={C.placebo} delay={0.2 + order * 0.15} />
            <Bar side={group.nitrate} max={group.max} color={C.nitrate} delay={0.35 + order * 0.15} />
        </div>
        <div className="mt-1.5 flex gap-3">
            <span className="w-[96px] text-center text-[16px] leading-tight text-gray-400">{group.control.label}</span>
            <span className="w-[96px] text-center text-[16px] leading-tight text-gray-300">{group.nitrate.label}</span>
        </div>
    </div>
);

export const PairBars = ({ groups, footnote }: { groups: readonly BarGroup[]; footnote?: string }) => (
    <div className="flex h-full flex-col justify-center gap-3">
        <div className="flex items-start justify-center gap-16">
            {groups.map((group, i) => <Group key={group.title} group={group} order={i} />)}
        </div>
        {footnote && <p className="text-center font-mono text-[16px] text-gray-400">{footnote}</p>}
    </div>
);
