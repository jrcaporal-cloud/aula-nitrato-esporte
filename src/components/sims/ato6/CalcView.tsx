import { C } from '../kit/palette';
import { Calc, Card, GrowBar, Kicker, RangeRow } from './ui';
import { FOODS } from './foodContent';
import { SHOT_MMOL, gramsFor, mmolToMg, num } from './shared';

/** Passo 3 do ProtocolSim: a dose escolhida convertida em shots e em gramas de vegetal (medianas EFSA). */

export const CalcView = ({ dose, onDose }: { dose: number; onDose: (v: number) => void }) => {
    const shots = dose / SHOT_MMOL;
    const rows = FOODS.slice(0, 3);
    const maxG = gramsFor(dose, FOODS[2].mgPerKg);
    return (
        <Card className="flex min-w-0 flex-1 flex-col justify-center gap-3 p-5">
            <div className="flex items-center justify-between">
                <Kicker>como chegar à dose</Kicker>
                <Calc />
            </div>
            <RangeRow label="Dose" value={dose} min={1} max={16.8} step={0.2} onChange={onDose} color={C.nitrate}
                right={<><span className="font-display text-[26px] font-semibold text-white">{num(dose, 1)} mmol</span>
                    <span className="ml-2 font-mono text-[14px] text-gray-300">{num(mmolToMg(dose))} mg</span></>} />
            <div className="mt-1 flex items-center gap-4 rounded-xl border px-4 py-3" style={{ borderColor: `${C.nitrate}88`, background: `${C.nitrate}12` }}>
                <div className="flex shrink-0 items-end gap-1">
                    {Array.from({ length: Math.ceil(shots) }, (_, i) => {
                        const fill = Math.min(Math.max(shots - i, 0), 1);
                        return (
                            <div key={i} className="relative h-12 w-7 overflow-hidden rounded-b-lg rounded-t border border-white/40 bg-white/5">
                                <div className="absolute inset-x-0 bottom-0" style={{ height: `${fill * 100}%`, background: C.nitrate }} />
                            </div>
                        );
                    })}
                </div>
                <p className="m-0 text-[19px] leading-snug text-gray-100">
                    <strong className="font-display text-[30px] text-white">{num(shots, 1)}</strong> shots de 70 mL
                    <span className="block text-[15px] text-gray-300">cada shot = {num(SHOT_MMOL, 2)} mmol medido (≈ 397 mg)</span>
                </p>
            </div>
            {rows.map((f, i) => (
                <div key={f.id} className="flex items-center gap-4">
                    <span className="w-[118px] shrink-0 text-[18px] font-semibold text-white">{f.name}</span>
                    <div className="h-8 min-w-0 flex-1 rounded-md bg-white/5"><GrowBar pct={(gramsFor(dose, f.mgPerKg) / maxG) * 100} color={f.color} delay={i * 0.08} /></div>
                    <span className="w-[100px] shrink-0 text-right font-display text-[24px] font-semibold text-white">{num(gramsFor(dose, f.mgPerKg))} g</span>
                </div>
            ))}
            <p className="m-0 text-[16px] leading-snug text-gray-300">
                Abaixo de 4 mmol (≈ 250 mg) em dose única, o consenso não vê efeito. A dose se conta em mmol, não em kg de atleta.
            </p>
        </Card>
    );
};
