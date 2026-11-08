import { C } from '../kit/palette';
import { Calc, Card, GrowBar, Kicker } from './ui';
import { CULTIVO } from './foodContent';
import { num } from './shared';

/** Passo 4 do FoodNitrateSim: o mesmo vegetal muda de 5 a 10× conforme cultivo, variedade e estação. */

const AXIS_MAX = 6500;
const GROUPS = [
    { id: 'SP', title: 'Pirassununga-SP · alface lisa, mesma semente e mesma colheita' },
    { id: 'RS', title: 'Vale do Taquari-RS · cultivo hidropônico' },
] as const;

export const CultivoView = () => (
    <Card className="flex min-w-0 flex-1 flex-col justify-center gap-3 p-6">
        {GROUPS.map(g => (
            <div key={g.id} className="flex flex-col gap-2">
                <Kicker>{g.title} · mg/kg</Kicker>
                {CULTIVO.filter(b => b.group === g.id).map((b, i) => (
                    <div key={b.id} className="flex items-center gap-4">
                        <span className="w-[190px] shrink-0 text-[17px] font-semibold text-gray-100">{b.label}</span>
                        <div className="h-7 min-w-0 flex-1 rounded-md bg-white/5"><GrowBar pct={(b.mgPerKg / AXIS_MAX) * 100} color={b.color} delay={i * 0.1} /></div>
                        <span className="w-[80px] shrink-0 text-right font-display text-[22px] font-semibold text-white">{num(b.mgPerKg)}</span>
                    </div>
                ))}
            </div>
        ))}
        <div className="mt-1 grid grid-cols-3 gap-3">
            <div className="rounded-xl border px-3 py-2" style={{ borderColor: `${C.nitrate}88` }}>
                <p className="m-0 font-display text-[28px] font-semibold leading-none text-white">5,5×</p>
                <p className="m-0 mt-1 text-[15px] leading-snug text-gray-200">entre cultivos da mesma alface (3.093 ÷ 565). Orgânico não é “mais nitrato”.</p>
            </div>
            <div className="rounded-xl border px-3 py-2" style={{ borderColor: `${C.nitrate}88` }}>
                <p className="m-0 font-display text-[28px] font-semibold leading-none text-white">10×</p>
                <p className="m-0 mt-1 text-[15px] leading-snug text-gray-200">entre 7 variedades de beterraba cultivadas na mesma região (Áustria).</p>
            </div>
            <div className="rounded-xl border px-3 py-2" style={{ borderColor: `${C.no}88` }}>
                <p className="m-0 flex items-center gap-2 font-display text-[28px] font-semibold leading-none text-white">≈ 5 mmol <Calc /></p>
                <p className="m-0 mt-1 text-[15px] leading-snug text-gray-200">em 50 g de rúcula hidropônica gaúcha (313 mg): a dose mínima do IOC numa salada.</p>
            </div>
        </div>
    </Card>
);
