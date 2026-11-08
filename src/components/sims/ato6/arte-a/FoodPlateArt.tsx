import { useId } from 'react';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { Calc } from '../ui';
import { FOODS, type FoodId, type Plate } from '../foodContent';
import { DOSE_BANDS, MG_PER_MMOL, SHOT_MMOL, mgToMmol, num } from '../shared';
import { ArtSvg, Stage } from './stage';
import { VEG_COLOR } from './artData';
import { PlateDisc, Pile } from './veg';

/** Passo 3 do slide 44: prato dividido em quatro setores (cada slider acrescenta peças) e um tubo que sobe de 0 a 20 mmol. */

const UNIT_G: Record<FoodId, number> = { rucula: 10, beterraba: 50, espinafre: 25, aipo: 40 };
const SECTORS: Record<FoodId, readonly [number, number]> = {
    rucula: [Math.PI, 1.5 * Math.PI], beterraba: [1.5 * Math.PI, 2 * Math.PI], espinafre: [0, 0.5 * Math.PI], aipo: [0.5 * Math.PI, Math.PI],
};
const R = 108;
const AXIS = 20;

const GaugeTube = ({ mmol }: { mmol: number }) => {
    const id = useId();
    const top = 22;
    const h = 292;
    const yOf = (v: number): number => top + h - (Math.min(v, AXIS) / AXIS) * h;
    return (
        <ArtSvg w={200} h={352} label="Tubo de mmol de 0 a 20 com as faixas do IOC e do Delphi" className="h-full w-[200px] shrink-0">
            <defs>
                <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.nitrate} />
                    <stop offset="100%" stopColor={C.nitrateDeep} />
                </linearGradient>
            </defs>
            <rect x={56} y={top} width={46} height={h} rx={14} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" strokeWidth={1.6} />
            <rect x={59} y={top + 3} width={40} height={h - 6} rx={11} fill={`url(#${id}-g)`}
                style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', transform: `scaleY(${Math.max(Math.min(mmol, AXIS) / AXIS, 0.004)})`, transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)', filter: `drop-shadow(0 0 8px ${C.nitrate}77)` }} />
            {[0, 5, 10, 15, 20].map(t => <SvgText key={t} x={44} y={yOf(t) + 5} text={String(t)} anchor="end" size={16} color="#D1D5DB" weight={500} />)}
            <rect x={112} y={yOf(DOSE_BANDS.ioc.hi)} width={9} height={yOf(DOSE_BANDS.ioc.lo) - yOf(DOSE_BANDS.ioc.hi)} rx={4} fill={C.no} />
            <rect x={125} y={yOf(DOSE_BANDS.delphi.hi)} width={9} height={yOf(DOSE_BANDS.delphi.lo) - yOf(DOSE_BANDS.delphi.hi)} rx={4} fill={C.o2} />
            <SvgText x={142} y={yOf((DOSE_BANDS.ioc.lo + DOSE_BANDS.ioc.hi) / 2) + 6} text="IOC" size={16} color={C.no} />
            <SvgText x={142} y={yOf((DOSE_BANDS.delphi.lo + DOSE_BANDS.delphi.hi) / 2) + 6} text="Delphi" size={16} color={C.o2} />
            <line x1={50} x2={110} y1={yOf(SHOT_MMOL)} y2={yOf(SHOT_MMOL)} stroke={C.nitrite} strokeWidth={2} strokeDasharray="4 4" />
            <SvgText x={44} y={yOf(SHOT_MMOL) - 26} text="1 shot" anchor="end" size={16} color={C.nitrite} />
            <SvgText x={88} y={344} text="mmol" anchor="middle" size={16} color="#9CA3AF" weight={500} />
        </ArtSvg>
    );
};

interface PlateArtProps {
    plate: Plate;
    onChange: (id: FoodId, grams: number) => void;
}

export const FoodPlateArt = ({ plate, onChange }: PlateArtProps) => {
    const totalMg = FOODS.reduce((s, f) => s + (plate[f.id] * f.mgPerKg) / 1000, 0);
    const mmol = mgToMmol(totalMg);
    const shots = mmol / SHOT_MMOL;
    return (
        <Stage glow={C.no}>
            <div className="absolute right-4 top-3"><Calc /></div>
            <div className="flex min-h-0 flex-1 items-center gap-2 px-3 pt-4">
                <ArtSvg w={264} h={300} label="Prato dividido em quatro setores" className="h-[300px] w-[264px] shrink-0">
                    <PlateDisc cx={132} cy={150} r={R} />
                    <path d="M132,46 L132,254 M28,150 L236,150" stroke="rgba(255,255,255,0.14)" strokeWidth={1.5} />
                    {FOODS.map(f => <Pile key={f.id} kind={f.id} cx={132} cy={150} radius={R * 0.8} count={plate[f.id] / UNIT_G[f.id]} cap={Math.ceil(f.max / UNIT_G[f.id])} spread={Math.ceil(f.max / UNIT_G[f.id]) * 0.42} sector={SECTORS[f.id]} scale={1.15} />)}
                </ArtSvg>
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <p className="m-0 font-mono text-[14px] uppercase tracking-wider text-gray-400">arraste os gramas do prato</p>
                    {FOODS.map(f => (
                        <div key={f.id} className="flex flex-col gap-1">
                            <div className="flex items-baseline justify-between">
                                <span className="flex items-center gap-2 text-[17px] font-semibold text-white">
                                    <span className="h-3 w-3 rounded-full" style={{ background: VEG_COLOR[f.id] }} />{f.name}
                                </span>
                                <span><span className="font-display text-[20px] font-semibold text-white">{plate[f.id]} g</span>
                                    <span className="ml-2 font-mono text-[14px] text-gray-300">{num(mgToMmol((plate[f.id] * f.mgPerKg) / 1000), 1)} mmol</span></span>
                            </div>
                            <input type="range" aria-label={f.name} min={0} max={f.max} step={f.step} value={plate[f.id]}
                                onChange={e => onChange(f.id, Number(e.target.value))} onPointerUp={e => e.currentTarget.blur()}
                                className="h-2 w-full cursor-pointer" style={{ accentColor: VEG_COLOR[f.id] }} />
                        </div>
                    ))}
                </div>
                <GaugeTube mmol={mmol} />
            </div>
            <div className="flex items-end justify-between gap-4 border-t border-white/10 px-5 py-3">
                <p className="m-0 font-display text-[44px] font-semibold leading-none text-white">{num(mmol, 1)} <span className="text-[24px] text-gray-300">mmol</span></p>
                <p className="m-0 text-right text-[17px] leading-snug text-gray-100">{num(totalMg)} mg de nitrato · 1 mmol = {MG_PER_MMOL} mg<br />
                    <span style={{ color: C.nitrate }}>≈ {num(shots, 1)} shot{shots >= 1.95 ? 's' : ''} de 70 mL</span></p>
            </div>
        </Stage>
    );
};
