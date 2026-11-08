import { C } from '../kit/palette';
import { Calc, Card, GrowBar, Kicker } from './ui';
import { ELITE_INTAKE, FOODS } from './foodContent';
import { MG_PER_MMOL, SHOT_MMOL, DOSE_BANDS, mgToMmol, num } from './shared';

/** Passos 1, 2 e 5 do FoodNitrateSim: ranking por quilo, gramas por shot e a ingestão do atleta de elite. */

const MAX_KG = 4800;
const SHOT_MG = SHOT_MMOL * MG_PER_MMOL;
const shotGramsExact = (mgPerKg: number): number => SHOT_MG / (mgPerKg / 1000);
const MAX_SHOT_G = shotGramsExact(693);

/** Passo 1 — nitrato por quilo (medianas EFSA). */
export const PerKgView = () => (
    <Card className="flex min-w-0 flex-1 flex-col justify-center gap-5 p-6">
        <Kicker>mediana de nitrato · mg por kg de vegetal fresco</Kicker>
        {FOODS.map((f, i) => (
            <div key={f.id} className="flex items-center gap-4">
                <span className="w-[120px] shrink-0 text-[19px] font-semibold text-white">{f.name}</span>
                <div className="h-9 min-w-0 flex-1 rounded-md bg-white/5"><GrowBar pct={(f.mgPerKg / MAX_KG) * 100} color={f.color} delay={i * 0.12} /></div>
                <div className="w-[170px] shrink-0 leading-tight">
                    <p className="m-0 font-display text-[24px] font-semibold text-white">{num(f.mgPerKg)}</p>
                    <p className="m-0 font-mono text-[14px] text-gray-300">{num(mgToMmol(f.mgPerKg / 10), 1)} mmol / 100 g</p>
                </div>
            </div>
        ))}
        <p className="m-0 rounded-xl border border-white/10 px-4 py-2 text-[17px] text-gray-100">
            Por quilo, a rúcula tem <strong className="text-white">≈ 4×</strong> o nitrato da beterraba.
            <span className="ml-2 text-gray-300">A raiz famosa nem lidera a lista.</span>
        </p>
    </Card>
);

/** Passo 2 — quantos gramas de cada vegetal fazem 1 shot. */
export const PerShotView = () => (
    <Card className="flex min-w-0 flex-1 flex-col justify-center gap-5 p-6">
        <div className="flex items-center justify-between gap-3">
            <Kicker>gramas de vegetal para 1 shot de 70 mL</Kicker>
            <Calc />
        </div>
        <p className="m-0 text-[18px] text-gray-100">
            1 shot = <strong className="text-white">{num(SHOT_MMOL, 2)} mmol</strong> ≈ <strong className="text-white">{num(SHOT_MG)} mg</strong> de nitrato
            <span className="text-gray-300"> (medido, Beet It Sport)</span>
        </p>
        {FOODS.map((f, i) => (
            <div key={f.id} className="flex items-center gap-4">
                <span className="w-[120px] shrink-0 text-[19px] font-semibold text-white">{f.name}</span>
                <div className="h-9 min-w-0 flex-1 rounded-md bg-white/5"><GrowBar pct={(shotGramsExact(f.mgPerKg) / MAX_SHOT_G) * 100} color={f.color} delay={i * 0.12} /></div>
                <p className="m-0 w-[110px] shrink-0 text-right font-display text-[26px] font-semibold text-white">≈ {f.shotGrams} g</p>
            </div>
        ))}
        <p className="m-0 text-[17px] text-gray-300">Mesma dose, pratos muito diferentes: de um punhado de folhas a meio quilo.</p>
    </Card>
);

const AXIS_MAX = 16;
const pos = (mmol: number): string => `${(Math.min(mmol, AXIS_MAX) / AXIS_MAX) * 100}%`;
const TICKS = [0, 2, 4, 6, 8, 10, 12, 14, 16];

const Band = ({ lo, hi, color, label }: { lo: number; hi: number; color: string; label: string }) => (
    <div className="relative h-9">
        <div className="absolute inset-y-0 flex items-center justify-center rounded-md border px-2"
            style={{ left: pos(lo), width: `calc(${pos(hi)} - ${pos(lo)})`, borderColor: `${color}aa`, background: `${color}26` }}>
            <span className="whitespace-nowrap text-[15px] font-semibold" style={{ color }}>{label}</span>
        </div>
    </div>
);

/** Passo 5 — o atleta de elite come ~1,7 mmol/dia; a dose esportiva é outra ordem de grandeza. */
export const EliteView = () => {
    const { median, q1, q3, min, max } = ELITE_INTAKE;
    return (
        <Card className="flex min-w-0 flex-1 flex-col justify-center gap-4 p-6">
            <div className="flex items-end gap-5">
                <p className="m-0 font-display text-[54px] font-semibold leading-none" style={{ color: C.nitrate }}>{median} mg</p>
                <p className="m-0 pb-1 text-[18px] leading-snug text-gray-100">por dia, mediana de 553 atletas<br />
                    <span className="text-gray-300">≈ {num(mgToMmol(median), 1)} mmol · intervalo interquartil {q1}–{q3} mg</span></p>
            </div>
            <div className="relative mt-2 flex flex-col gap-3">
                <div className="relative h-9">
                    <div className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded bg-white/30" style={{ left: pos(mgToMmol(min)), width: `calc(${pos(mgToMmol(max))} - ${pos(mgToMmol(min))})` }} />
                    <div className="absolute top-1/2 h-6 -translate-y-1/2 rounded-md" style={{ left: pos(mgToMmol(q1)), width: `calc(${pos(mgToMmol(q3))} - ${pos(mgToMmol(q1))})`, background: C.nitrate }} />
                    <div className="absolute top-1/2 h-9 w-[4px] -translate-x-1/2 -translate-y-1/2 rounded bg-white" style={{ left: pos(mgToMmol(median)) }} />
                    <span className="absolute -top-1 whitespace-nowrap text-[15px] text-gray-200" style={{ left: `calc(${pos(mgToMmol(max))} + 8px)` }}>
                        faixa {min}–{max} mg
                    </span>
                </div>
                <Band lo={DOSE_BANDS.ioc.lo} hi={DOSE_BANDS.ioc.hi} color={C.no} label={DOSE_BANDS.ioc.label} />
                <Band lo={DOSE_BANDS.delphi.lo} hi={DOSE_BANDS.delphi.hi} color={C.o2} label={DOSE_BANDS.delphi.label} />
                <div className="relative mt-1 h-6 border-t border-white/20">
                    {TICKS.map(t => (
                        <span key={t} className="absolute top-1 -translate-x-1/2 font-mono text-[14px] text-gray-300" style={{ left: pos(t) }}>{t}</span>
                    ))}
                </div>
                <p className="m-0 -mt-2 text-right font-mono text-[14px] text-gray-400">mmol de nitrato</p>
            </div>
            <p className="m-0 text-[17px] leading-snug text-gray-200">
                74% do total vem de vegetais, batata e frutas (alface e espinafre à frente). Comer normalmente não chega à dose esportiva.
            </p>
        </Card>
    );
};
