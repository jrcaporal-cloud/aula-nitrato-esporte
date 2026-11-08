import { ForestPlot, type ForestRow } from '../kit/ForestPlot';
import { C } from '../kit/palette';

/** Passo 5 do slide 55: 46% dos estudos clínicos "positivos", agrupado nulo (Derella 2024). */

const ROWS: readonly ForestRow[] = [
    { id: 'tte', label: 'TTE máximo', est: 0.11, lo: -0.12, hi: 0.34, kind: 'pooled', color: C.placebo },
    { id: 'tte-sub', label: 'TTE submáximo', est: 0.16, lo: -0.13, hi: 0.46, kind: 'pooled', color: C.placebo },
    { id: 'vo2', label: 'VO₂pico', est: 0.002, lo: -0.37, hi: 0.38, kind: 'pooled', color: C.placebo, right: '0,002 (−0,37 a 0,38)' },
    { id: '6mwt', label: 'Caminhada de 6 min', est: 0.01, lo: -0.29, hi: 0.28, kind: 'pooled', color: C.placebo, right: '0,01 (−0,29 a 0,28)' },
];

export const DerellaView = () => (
    <div className="flex h-full flex-col">
        <div className="px-5 pt-4">
            <div className="flex items-baseline justify-between">
                <span className="text-[18px] font-bold text-gray-100">Estudos individuais: quantos deram certo?</span>
                <span className="font-display text-[1.6rem] font-semibold" style={{ color: C.no }}>46%</span>
            </div>
            <div className="mt-1.5 h-[16px] rounded-full bg-white/[0.07]">
                <div className="h-full rounded-full" style={{ width: '46%', background: `linear-gradient(90deg, ${C.no}55, ${C.no})`, boxShadow: `0 0 14px ${C.no}66` }} />
            </div>
        </div>
        <div className="px-5 pt-3 text-[18px] font-bold text-gray-100">Agrupado (SMD, IC95%): nulo em todos</div>
        <div className="min-h-0 flex-1 px-3">
            <ForestPlot rows={ROWS} width={694} height={236} domain={[-0.6, 0.8]} ticks={[-0.5, 0, 0.5]}
                axisLabel="tamanho de efeito padronizado" labelWidth={250} valueWidth={200} sides={['piora', 'melhora']} />
        </div>
        <div className="mx-5 mb-4 rounded-xl border px-4 py-2.5 text-center font-display text-[1.7rem] font-semibold"
            style={{ borderColor: `${C.nitrite}88`, background: `${C.nitrite}14`, color: C.nitriteSoft }}>
            Piloto positivo ≠ terapia
        </div>
    </div>
);
