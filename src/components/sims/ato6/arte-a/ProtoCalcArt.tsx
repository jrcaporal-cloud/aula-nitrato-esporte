import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { Calc, RangeRow } from '../ui';
import { FOODS, type FoodId } from '../foodContent';
import { SHOT_MMOL, gramsFor, mmolToMg, num } from '../shared';
import { ArtSvg, Stage } from './stage';
import { PlateDisc, Pile, ShotGlass } from './veg';

/** Passo 3 do slide 46: a dose do slider vira copos de shot e três pratos (área do prato = gramas, medianas EFSA). */

const UNIT_G: Record<FoodId, number> = { rucula: 10, beterraba: 50, espinafre: 25, aipo: 40 };
const K = 2.35;
const CENTERS = [356, 530, 706];
const CY = 156;

export const ProtoCalcArt = ({ dose, onDose }: { dose: number; onDose: (v: number) => void }) => {
    const shots = dose / SHOT_MMOL;
    const glasses = Math.ceil(shots);
    return (
        <Stage glow={C.o2}>
            <div className="absolute right-4 top-3"><Calc /></div>
            <ArtSvg w={812} h={330} label="A dose em shots e em gramas de vegetal" className="min-h-0 w-full flex-1">
                {Array.from({ length: glasses }, (_, i) => (
                    <ShotGlass key={i} x={34 + i * 62} y={78} w={52} h={74} fill={Math.min(Math.max(shots - i, 0), 1)} />
                ))}
                <SvgText x={30} y={206} text={num(shots, 1)} size={52} color="#fff" weight={800} />
                <SvgText x={30} y={234} text="shots de 70 mL" size={18} color="#F3F4F6" weight={600} />
                <SvgText x={30} y={258} text={`cada um = ${num(SHOT_MMOL, 2)} mmol`} size={16} color="#D1D5DB" weight={500} />
                <SvgText x={30} y={278} text="medido (≈ 397 mg)" size={16} color="#D1D5DB" weight={500} />
                <SvgText x={256} y={CY + 6} text="ou" anchor="middle" size={20} color={C.o2} weight={700} />
                {FOODS.slice(0, 3).map((f, i) => {
                    const g = gramsFor(dose, f.mgPerKg);
                    const r = K * Math.sqrt(g);
                    const cap = Math.min(Math.ceil(g / UNIT_G[f.id]), 40);
                    return (
                        <g key={f.id}>
                            <PlateDisc cx={CENTERS[i]} cy={CY} r={r} />
                            <Pile kind={f.id} cx={CENTERS[i]} cy={CY + 6} radius={r * 0.78} count={cap} cap={cap} scale={f.id === 'rucula' ? 0.75 : 0.85} />
                            <SvgText x={CENTERS[i]} y={292} text={`${num(g)} g`} anchor="middle" size={28} color="#fff" weight={800} />
                            <SvgText x={CENTERS[i]} y={318} text={f.name} anchor="middle" size={17} color={C.nitrateSoft} weight={600} />
                        </g>
                    );
                })}
            </ArtSvg>
            <div className="flex flex-col gap-2 px-5 pb-4">
                <RangeRow label="Dose" value={dose} min={1} max={16.8} step={0.2} onChange={onDose} color={C.nitrate}
                    right={<><span className="font-display text-[24px] font-semibold text-white">{num(dose, 1)} mmol</span>
                        <span className="ml-2 font-mono text-[14px] text-gray-300">{num(mmolToMg(dose))} mg</span></>} />
                <p className="m-0 text-[16px] leading-snug text-gray-300">Abaixo de 4 mmol (≈ 250 mg) em dose única, o consenso não vê efeito. A dose se conta em mmol, não em kg de atleta.</p>
            </div>
        </Stage>
    );
};
