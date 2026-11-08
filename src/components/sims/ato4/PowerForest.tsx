import { ForestPlot, type ForestRow } from '../kit/ForestPlot';
import { C } from '../kit/palette';

/** Passo 4 do slide 52: torque isocinético (Lago 2020) × potência máxima (Coggan 2021) na mesma régua. */

const ROWS: readonly ForestRow[] = [
    { id: 'lago', label: 'Torque isocinético', sub: 'Lago 2020 · 5 estudos · 60 pessoas', est: -0.01, lo: -0.01, hi: -0.01, kind: 'study', color: C.placebo, right: 'ES −0,01' },
    { id: 'geral', label: 'Potência máxima', sub: 'Coggan 2021 · 19 estudos · 268 pessoas', est: 0.45, lo: 0.3, hi: 0.61, kind: 'pooled', color: C.nitrate },
    { id: 'aguda', label: 'Dose aguda', sub: 'subgrupo', est: 0.54, lo: 0.37, hi: 0.71, kind: 'pooled', color: C.nitrateSoft },
    { id: 'varias', label: 'Várias doses', sub: 'subgrupo', est: 0.22, lo: 0.01, hi: 0.43, kind: 'pooled', color: C.nitrateSoft },
];

export const PowerForest = () => (
    <div className="flex h-full flex-col">
        <div className="px-5 pt-4 text-[18px] font-bold text-gray-100">Força × potência, meta-análises</div>
        <div className="min-h-0 flex-1 px-3">
            <ForestPlot rows={ROWS} width={694} height={290} domain={[-0.2, 0.8]} ticks={[0, 0.2, 0.4, 0.6, 0.8]}
                axisLabel="tamanho de efeito padronizado" labelWidth={290} valueWidth={170} sides={['piora', 'melhora']} />
        </div>
        <div className="mx-5 mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5">
                <div className="font-display text-[2rem] font-semibold leading-none" style={{ color: C.placebo }}>≈ 0</div>
                <div className="mt-1 text-[15px] text-gray-300">força isocinética (a velocidades de 90 a 360°/s: −0,11 a 0,16)</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5">
                <div className="font-display text-[2rem] font-semibold leading-none" style={{ color: C.nitrateSoft }}>≈ 5%</div>
                <div className="mt-1 text-[15px] text-gray-300">efeito médio na potência máxima muscular</div>
            </div>
        </div>
    </div>
);
