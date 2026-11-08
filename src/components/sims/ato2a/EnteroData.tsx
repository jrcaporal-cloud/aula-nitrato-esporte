import { C } from '../kit/palette';
import { br } from '../kit/format';
import { BigStat } from './ui';

/** Painel de dados de cada passo do circuito entero-salivar. */

const Stats = ({ items }: { items: { value: string; label: string; color: string }[] }) => (
    <div className="flex h-full flex-col justify-center gap-3.5">
        {items.map(s => <BigStat key={s.label} {...s} size={items.length > 2 ? 30 : 40} />)}
    </div>
);

/** Largura (0–100%) de um valor em escala logarítmica entre 10 e 2.000 µmol/L. */
const logWidth = (v: number) => ((Math.log10(v) - 1) / (Math.log10(2000) - 1)) * 100;

const Bar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="flex items-center gap-2">
        <span className="w-[58px] shrink-0 text-[15px] text-gray-300">{label}</span>
        <div className="relative h-3.5 flex-1 rounded bg-white/6">
            <div className="h-full rounded" style={{ width: `${logWidth(value)}%`, background: color }} />
        </div>
        <span className="w-[62px] shrink-0 text-right font-mono text-[15px] font-semibold" style={{ color }}>{br(value, 1)}</span>
    </div>
);

const Gradient = () => (
    <div className="flex h-full flex-col justify-center gap-2">
        {[{ head: 'Em jejum', ratio: '~5×', plasma: 17.9, saliva: 92.6 }, { head: 'Após 2 mmol de nitrato', ratio: '~11×', plasma: 134, saliva: 1516.7 }].map(g => (
            <div key={g.head} className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between">
                    <span className="text-[16px] font-semibold text-gray-100">{g.head}</span>
                    <span className="font-display text-[1.5rem] font-semibold leading-none" style={{ color: C.nitrate }}>{g.ratio}</span>
                </div>
                <Bar label="plasma" value={g.plasma} color={C.nitrateSoft} />
                <Bar label="saliva" value={g.saliva} color={C.nitrate} />
            </div>
        ))}
        <p className="text-[14px] text-gray-400">µmol/L · escala logarítmica</p>
    </div>
);

const SPECIES = [
    { name: 'Veillonella atypica', pct: 34 },
    { name: 'Veillonella dispar', pct: 24 },
    { name: 'Actinomyces odontolyticus', pct: 21 },
    { name: 'Rothia mucilaginosa', pct: 10 },
];

const Species = () => (
    <div className="flex h-full flex-col justify-center gap-1.5">
        <p className="text-[15px] text-gray-300">Isolados da língua com nitrato-redutase (% do total)</p>
        {SPECIES.map(s => (
            <div key={s.name} className="flex flex-col gap-0.5">
                <div className="flex items-baseline justify-between">
                    <span className="text-[16px] italic text-gray-100">{s.name}</span>
                    <span className="font-mono text-[15px] font-semibold" style={{ color: C.bacteria }}>{s.pct}%</span>
                </div>
                <div className="h-2 rounded bg-white/6"><div className="h-full rounded" style={{ width: `${(s.pct / 34) * 100}%`, background: C.bacteria }} /></div>
            </div>
        ))}
    </div>
);

const PANELS: Record<number, () => React.JSX.Element> = {
    0: () => <Stats items={[
        { value: '< 0,1%', label: 'da dose nas fezes: absorção quase total', color: C.nitrateSoft },
        { value: '1–2 h', label: 'pico do nitrato no plasma', color: C.nitrate },
    ]} />,
    1: () => <Stats items={[
        { value: '~25%', label: 'do nitrato circulante é captado pelas glândulas salivares', color: C.nitrate },
        { value: '2 NO₃⁻ : 1 H⁺', label: 'cotransporte eletrogênico pela sialina (SLC17A5)', color: C.nitrateSoft },
    ]} />,
    2: Gradient,
    3: Species,
    4: () => <Stats items={[
        { value: '14,8 → 89,4 ppm', label: 'NO gástrico em 60 min após 2 mmol', color: C.no },
        { value: '−95%', label: 'com omeprazol: a produção depende do ácido', color: C.noSoft },
        { value: '>100×', label: 'o NO do ar da boca, no ar do estômago', color: C.text },
    ]} />,
    5: () => <Stats items={[
        { value: '~4×', label: 'aumento do nitrito plasmático com 10 mg/kg de nitrato', color: C.nitrite },
        { value: 'abolido', label: 'quando o voluntário não engole a saliva', color: C.hypoxia },
    ]} />,
};

export const EnteroData = ({ step }: { step: number }) => {
    const Panel = PANELS[step];
    return Panel ? <Panel /> : null;
};
