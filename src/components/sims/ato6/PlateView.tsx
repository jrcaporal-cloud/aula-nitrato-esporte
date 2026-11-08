import { C } from '../kit/palette';
import { Calc, Card, Kicker, RangeRow } from './ui';
import { FOODS, type FoodId, type Plate } from './foodContent';
import { DOSE_BANDS, MG_PER_MMOL, SHOT_MMOL, mgToMmol, num } from './shared';

/** Passo 3 do FoodNitrateSim: o prato montado com sliders vira mmol, mg e "shots" equivalentes. */

const AXIS_MAX = 20;
const pct = (mmol: number): number => (Math.min(mmol, AXIS_MAX) / AXIS_MAX) * 100;

interface PlateViewProps {
    plate: Plate;
    onChange: (id: FoodId, grams: number) => void;
}

export const PlateView = ({ plate, onChange }: PlateViewProps) => {
    const parts = FOODS.map(f => ({ food: f, mg: (plate[f.id] * f.mgPerKg) / 1000 }));
    const totalMg = parts.reduce((sum, p) => sum + p.mg, 0);
    const totalMmol = mgToMmol(totalMg);
    // Soma acumulada (mg) até o fim de cada ingrediente: a largura de cada fatia sai da diferença entre duas somas.
    const cumulative = parts.reduce<number[]>((acc, p) => [...acc, (acc[acc.length - 1] ?? 0) + p.mg], [0]);

    return (
        <Card className="flex min-w-0 flex-1 flex-col justify-center gap-3 p-6">
            <div className="flex items-center justify-between gap-3">
                <Kicker>arraste os gramas do prato</Kicker>
                <Calc />
            </div>
            {FOODS.map(f => (
                <RangeRow key={f.id} label={f.name} value={plate[f.id]} min={0} max={f.max} step={f.step}
                    onChange={v => onChange(f.id, v)} color={f.color}
                    right={<><span className="font-display text-[22px] font-semibold text-white">{plate[f.id]} g</span>
                        <span className="ml-2 font-mono text-[14px] text-gray-300">{num(mgToMmol((plate[f.id] * f.mgPerKg) / 1000), 1)} mmol</span></>} />
            ))}
            <div className="mt-1 flex items-end justify-between gap-4">
                <p className="m-0 font-display text-[44px] font-semibold leading-none text-white">
                    {num(totalMmol, 1)} <span className="text-[24px] text-gray-300">mmol</span>
                </p>
                <p className="m-0 pb-1 text-right text-[17px] leading-snug text-gray-100">
                    {num(totalMg)} mg de nitrato<br />
                    <span style={{ color: C.nitrate }}>≈ {num(totalMmol / SHOT_MMOL, 1)} shot{totalMmol / SHOT_MMOL >= 1.95 ? 's' : ''} de 70 mL</span>
                </p>
            </div>
            <div className="relative">
                <div className="flex h-8 overflow-hidden rounded-md bg-white/5">
                    {parts.map((p, i) => {
                        const w = pct(mgToMmol(cumulative[i + 1])) - pct(mgToMmol(cumulative[i]));
                        return <div key={p.food.id} className="h-full transition-[width] duration-300" style={{ width: `${w}%`, background: p.food.color }} />;
                    })}
                </div>
                <div className="relative mt-1 h-6">
                    <div className="absolute top-0 h-[6px] rounded-sm" style={{ left: `${pct(DOSE_BANDS.ioc.lo)}%`, width: `${pct(DOSE_BANDS.ioc.hi) - pct(DOSE_BANDS.ioc.lo)}%`, background: C.no }} />
                    <div className="absolute top-2 h-[6px] rounded-sm" style={{ left: `${pct(DOSE_BANDS.delphi.lo)}%`, width: `${pct(DOSE_BANDS.delphi.hi) - pct(DOSE_BANDS.delphi.lo)}%`, background: C.o2 }} />
                </div>
                <div className="flex gap-5 text-[15px] text-gray-200">
                    <span><span style={{ color: C.no }}>▬</span> IOC 5–9 mmol</span>
                    <span><span style={{ color: C.o2 }}>▬</span> Delphi 8–16 mmol</span>
                    <span className="text-gray-400">eixo 0–{AXIS_MAX} mmol · 1 mmol = {MG_PER_MMOL} mg</span>
                </div>
            </div>
        </Card>
    );
};
