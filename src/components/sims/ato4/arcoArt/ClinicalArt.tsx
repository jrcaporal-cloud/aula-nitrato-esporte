import { ForestPlot, type ForestRow } from '../../kit/ForestPlot';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { Heart, Lungs } from '../../ato3/artKit/Figures';

/**
 * Passo 5 do slide 34 — Derella 2024: a barra viva dos 46% de estudos "positivos" (líquido com onda) contra o agrupado
 * nulo em todos os desfechos (floresta com a faixa do zero acesa) e o carimbo "piloto positivo ≠ terapia".
 */

const ROWS: readonly ForestRow[] = [
    { id: 'tte', label: 'TTE máximo', est: 0.11, lo: -0.12, hi: 0.34, kind: 'pooled', color: C.placebo },
    { id: 'tte-sub', label: 'TTE submáximo', est: 0.16, lo: -0.13, hi: 0.46, kind: 'pooled', color: C.placebo },
    { id: 'vo2', label: 'VO₂pico', est: 0.002, lo: -0.37, hi: 0.38, kind: 'pooled', color: C.placebo, right: '0,002 (−0,37 a 0,38)' },
    { id: '6mwt', label: 'Caminhada de 6 min', est: 0.01, lo: -0.29, hi: 0.28, kind: 'pooled', color: C.placebo, right: '0,01 (−0,29 a 0,28)' },
];

const BAR_X = 24;
const BAR_W = 520;
const FILL = BAR_W * 0.46;

const LiveBar = ({ reduce }: { reduce: boolean }) => (
    <svg viewBox="0 0 720 116" width="100%" height="100%" role="img" aria-label="46% dos estudos individuais relataram benefício">
        <defs>
            <clipPath id="arc-live"><rect x={BAR_X} y={52} width={FILL} height={40} rx={20} /></clipPath>
            <pattern id="arc-stripes" width="28" height="40" patternUnits="userSpaceOnUse" patternTransform="skewX(-25)">
                <rect width="14" height="40" fill="#fff" opacity={0.14} />
            </pattern>
        </defs>
        <SvgText x={24} y={32} text="Estudos individuais: quantos deram certo?" size={18} weight={700} color="#F3F4F6" />
        <rect x={BAR_X} y={52} width={BAR_W} height={40} rx={20} fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.14)" />
        <g clipPath="url(#arc-live)">
            <rect x={BAR_X} y={52} width={FILL} height={40} fill={C.no} opacity={0.8} />
            <path d={`M ${BAR_X - 40} 64 q 20 -10 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 V 92 H ${BAR_X - 40} Z`} fill={C.noDeep} opacity={0.5}>
                {!reduce && <animateTransform attributeName="transform" type="translate" values="0 0;80 0" dur="2.4s" repeatCount="indefinite" />}
            </path>
            <rect x={BAR_X - 60} y={52} width={FILL + 120} height={40} fill="url(#arc-stripes)">
                {!reduce && <animateTransform attributeName="transform" type="translate" values="0 0;28 0" dur="1s" repeatCount="indefinite" />}
            </rect>
        </g>
        <line x1={BAR_X + FILL} x2={BAR_X + FILL} y1={44} y2={100} stroke="#fff" strokeWidth={2.5} />
        <text x={BAR_X + BAR_W + 24} y={88} fontSize={50} fontWeight={700} fill={C.no} style={{ fontFamily: 'var(--font-display)' }}>46%</text>
        <SvgText x={BAR_X + FILL + 10} y={112} text="relataram benefício" size={16} weight={600} color={C.noSoft} />
    </svg>
);

export const ClinicalArt = ({ reduce }: { reduce: boolean }) => (
    <div className="flex h-full flex-col">
        <div style={{ height: 118 }}><LiveBar reduce={reduce} /></div>
        <div className="flex items-baseline justify-between px-6 pt-1">
            <span className="text-[17px] font-bold text-gray-100">Agrupado (SMD, IC95%): nulo em todos</span>
            <span className="font-mono text-[15px] text-gray-300">22 estudos clínicos</span>
        </div>
        <div className="relative min-h-0 flex-1 px-3">
            <div className="pointer-events-none absolute inset-y-2 rounded-lg" style={{ left: '51%', width: 10, transform: 'translateX(-50%)', background: `${C.nitrite}22`, boxShadow: `0 0 24px ${C.nitrite}55` }} />
            <ForestPlot rows={ROWS} width={694} height={214} domain={[-0.6, 0.8]} ticks={[-0.5, 0, 0.5]}
                axisLabel="tamanho de efeito padronizado" labelWidth={250} valueWidth={200} sides={['piora', 'melhora']} />
        </div>
        <div className="mx-5 mb-3 flex items-center justify-center gap-4 rounded-xl border px-4 py-2"
            style={{ borderColor: `${C.nitrite}88`, background: `${C.nitrite}14` }}>
            <svg viewBox="0 0 110 52" width={110} height={52} aria-hidden="true">
                <Heart x={28} y={26} s={0.85} color={C.nitrate} beat={!reduce} />
                <Lungs x={82} y={28} s={0.75} color={C.o2} />
            </svg>
            <span className="font-display text-[1.7rem] font-semibold" style={{ color: C.nitriteSoft }}>Piloto positivo ≠ terapia</span>
        </div>
    </div>
);
