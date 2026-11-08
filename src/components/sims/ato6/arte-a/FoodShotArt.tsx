import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { Calc } from '../ui';
import { FOODS, type FoodId } from '../foodContent';
import { MG_PER_MMOL, SHOT_MMOL, num } from '../shared';
import { ArtSvg, Stage } from './stage';
import { PlateDisc, Pile, ShotGlass } from './veg';
import { SvgCount, SvgReveal } from './rhythm';
import { SvgKeyFact } from '../../ato5/countText';
import { REVEAL_GAP } from '../../kit/countUp';

/** Passo 2 do slide 44: quatro pratos com a mesma carga de nitrato (1 shot); a área do prato é proporcional aos gramas. */

/** Gramas por unidade desenhada em cada prato. */
const UNIT_G: Record<FoodId, number> = { rucula: 10, beterraba: 50, espinafre: 25, aipo: 40 };
const GAP = 24;
const CY = 252;

export const FoodShotArt = () => {
    const reduce = useReducedMotion();
    const plates = FOODS.map(f => {
        const g = Number(f.shotGrams);
        return { f, g, r: 4.4 * Math.sqrt(g) };
    });
    const total = plates.reduce((s, p) => s + 2 * (p.r + 6), 0) + GAP * (plates.length - 1);
    const start = (812 - total) / 2;
    const placed = plates.map((p, i) => {
        const before = plates.slice(0, i).reduce((s, q) => s + 2 * (q.r + 6) + GAP, 0);
        return { ...p, cx: start + before + p.r + 6 };
    });
    return (
        <Stage glow={C.o2}>
            <div className="absolute right-4 top-3"><Calc /></div>
            <ArtSvg label="Quantos gramas de cada vegetal equivalem a um shot de nitrato">
                <ShotGlass x={26} y={34} w={44} h={62} />
                <SvgText x={90} y={58} text={`1 shot = ${num(SHOT_MMOL, 2)} mmol ≈ ${num(SHOT_MMOL * MG_PER_MMOL)} mg`} size={24} color="#fff" weight={700} />
                <SvgText x={90} y={86} text="de nitrato (medido, Beet It Sport) · a área do prato = gramas" size={16} color="#D1D5DB" weight={500} />
                {placed.map(({ f, g, r, cx }, i) => (
                    <motion.g key={f.id} style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
                        initial={reduce ? false : { opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}>
                        <PlateDisc cx={cx} cy={CY} r={r} />
                        <Pile kind={f.id} cx={cx} cy={CY + 6} radius={r * 0.78} count={g / UNIT_G[f.id]} cap={Math.ceil(g / UNIT_G[f.id])} scale={f.id === 'rucula' ? 0.8 : 1} />
                        <ShotGlass x={cx + r * 0.62} y={CY - r - 26} w={26} h={38} />
                        {i === 0 ? (
                            <SvgKeyFact color={C.o2} delay={REVEAL_GAP + i * 0.12}>
                                <SvgCount x={cx} y={394} text={`≈ ${f.shotGrams} g`} anchor="middle" size={28} color="#fff" weight={700} delayMs={(REVEAL_GAP + i * 0.12) * 1000} />
                            </SvgKeyFact>
                        ) : <SvgCount x={cx} y={394} text={`≈ ${f.shotGrams} g`} anchor="middle" size={28} color="#fff" weight={700} delayMs={(REVEAL_GAP + i * 0.12) * 1000} />}
                        <SvgReveal order={2} delay={i * 0.12}>
                            <SvgText x={cx} y={422} text={f.name} anchor="middle" size={18} color={C.nitrateSoft} weight={600} />
                        </SvgReveal>
                    </motion.g>
                ))}
                <SvgReveal order={2} delay={0.4}>
                    <SvgText x={406} y={448} text="mesma dose, pratos muito diferentes" anchor="middle" size={16} color="#9CA3AF" weight={500} />
                </SvgReveal>
            </ArtSvg>
        </Stage>
    );
};
