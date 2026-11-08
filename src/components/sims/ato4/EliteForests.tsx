import { ForestPlot, type ForestRow } from '../kit/ForestPlot';
import { C } from '../kit/palette';

/** Passos 3 e 4 do slide 53: forests de Xie 2026 (atletas) e de Eroglu 2026 / Poon 2025 (tempo até o pico). */

const XIE: readonly ForestRow[] = [
    { id: 'pico', label: 'Pico de potência', sub: '45 ECRs · 659 atletas · I² 0%', est: 0.13, lo: -0.07, hi: 0.32, kind: 'pooled', color: C.nitrate },
    { id: 'media', label: 'Potência média', sub: 'I² 0%', est: 0.04, lo: -0.13, hi: 0.21, kind: 'pooled', color: C.nitrateSoft },
    { id: 'homens', label: 'Pico · só homens', sub: 'exploratório · interação P = 0,11', est: 0.29, lo: 0.02, hi: 0.56, kind: 'study', color: C.placebo },
];

const TIME: readonly ForestRow[] = [
    { id: 'eroglu', label: 'Tempo até o pico', sub: 'Eroglu 2026 · 4 estudos de Wingate', est: -0.92, lo: -1.29, hi: -0.54, kind: 'pooled', color: C.nitrate },
    { id: 'poon', label: 'Tempo até o pico', sub: 'Poon 2025 · umbrella de 20 revisões', est: -0.76, lo: -1.18, hi: -0.33, kind: 'pooled', color: C.nitrateSoft },
];

export const XieForest = () => (
    <div className="flex h-full flex-col">
        <div className="px-5 pt-4 text-[18px] font-bold text-gray-100">Só atletas (Tier ≥ 2) · potência no Wingate e afins</div>
        <div className="min-h-0 flex-1 px-3">
            <ForestPlot rows={XIE} width={694} height={330} domain={[-0.4, 0.8]} ticks={[-0.4, 0, 0.4, 0.8]}
                axisLabel="g de Hedges" labelWidth={300} valueWidth={170} sides={['piora', 'melhora']} />
        </div>
        <p className="mx-5 mb-4 text-[15px] leading-snug text-gray-300">
            Só 1 dos 45 ECRs teve baixo risco de viés (RoB 2). O subgrupo de homens é exploratório e a interação com os estudos mistos não foi significativa.
        </p>
    </div>
);

const GRADE = ['muito baixa', 'baixa', 'moderada', 'alta'] as const;

export const TimeForest = () => (
    <div className="flex h-full flex-col">
        <div className="px-5 pt-4 text-[18px] font-bold text-gray-100">Tempo até o pico de potência</div>
        <div className="min-h-0 flex-1 px-3">
            <ForestPlot rows={TIME} width={694} height={250} domain={[-1.6, 0.6]} ticks={[-1.5, -1, -0.5, 0, 0.5]}
                axisLabel="SMD (negativo = chega mais cedo)" labelWidth={290} valueWidth={190} sides={['mais cedo', 'mais tarde']} decimals={2} />
        </div>
        <div className="mx-5 mb-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="mb-2 text-[15px] text-gray-300">Certeza da evidência para o sprint (GRADE, Eroglu 2026)</div>
            <div className="grid grid-cols-4 gap-1.5">
                {GRADE.map((g, i) => (
                    <span key={g} className="rounded-md px-2 py-1.5 text-center font-mono text-[15px] font-bold"
                        style={{ background: i < 2 ? `${C.nitrite}33` : 'rgba(255,255,255,0.05)', color: i < 2 ? C.nitriteSoft : C.muted,
                            border: `1px solid ${i < 2 ? `${C.nitrite}99` : 'rgba(255,255,255,0.08)'}` }}>
                        {g}
                    </span>
                ))}
            </div>
        </div>
    </div>
);
