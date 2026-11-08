import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { useEntered } from './hooks';
import { SPRINT_ROWS, YOYO_SD } from './teamContent';

/**
 * Metade de cima: tempos de sprint de 5, 10 e 20 m (barras proporcionais ao tempo, diferença minúscula).
 * Metade de baixo: o Yo-Yo de Thompson 2016 como duas curvas quase iguais (média ± DP; formato ilustrativo).
 * viewBox 720 × 448.
 */

const BX = 96;
const SC = 118; // px por segundo
const rowY = (i: number) => 58 + i * 58;

const SprintBars = ({ go }: { go: boolean }) => (
    <g>
        <SvgText x={32} y={32} text="Tempo de sprint (s) · menor é melhor" size={18} weight={700} color="#E5E7EB" />
        {SPRINT_ROWS.map((r, i) => {
            const y = rowY(i);
            const t = (d: number) => `transform 1.1s cubic-bezier(0.22, 0.8, 0.24, 1) ${d}s`;
            return (
                <g key={r.dist}>
                    <SvgText x={32} y={y + 32} text={r.dist} size={20} weight={700} color="#fff" />
                    {([['placebo', r.placebo, C.placebo, 0], ['nitrate', r.nitrate, C.nitrate, 0.1]] as const).map(([k, v, color, d], j) => (
                        <g key={k}>
                            <rect x={BX} y={y + j * 24} width={v * SC} height={20} rx={5} fill={color} fillOpacity={k === 'nitrate' ? 0.9 : 0.55}
                                style={{ transformBox: 'fill-box', transformOrigin: 'left center', transform: `scaleX(${go ? 1 : 0})`, transition: t(d + i * 0.12) }} />
                            <SvgText x={BX + v * SC - 8} y={y + j * 24 + 16} text={`${br(v, 2)} s`} size={16} weight={600} color="#fff" anchor="end" />
                        </g>
                    ))}
                    <g style={{ opacity: go ? 1 : 0, transition: `opacity 0.4s ease ${0.8 + i * 0.1}s` }}>
                        <SvgText x={BX + r.placebo * SC + 14} y={y + 33} text={r.delta} size={20} weight={700} color={C.nitrateSoft} />
                    </g>
                </g>
            );
        })}
    </g>
);

const GX0 = 96;
const GX1 = 690;
const GMAX = 2800;
const gx = (m: number) => GX0 + (m / GMAX) * (GX1 - GX0);
const BASE = 414;
const PEAK = 108;

/** Curva normal como caminho SVG fechado até a linha de base. */
const bell = (mean: number, sd: number): string => {
    const pts: string[] = [];
    for (let m = 0; m <= GMAX; m += 40) {
        const h = Math.exp(-0.5 * ((m - mean) / sd) ** 2);
        pts.push(`${gx(m).toFixed(1)},${(BASE - h * PEAK).toFixed(1)}`);
    }
    return `M ${gx(0)},${BASE} L ${pts.join(' L ')} L ${gx(GMAX)},${BASE} Z`;
};

const YoYoBells = ({ go }: { go: boolean }) => {
    const { placebo, nitrate } = YOYO_SD;
    return (
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.6s ease 0.4s' }}>
            <line x1={24} x2={696} y1={250} y2={250} stroke="rgba(255,255,255,0.1)" />
            <SvgText x={32} y={282} text="Yo-Yo IR1 · distância (m) · curvas ilustrativas (média ± DP)" size={17} weight={700} color="#E5E7EB" />
            <path d={bell(placebo.mean, placebo.sd)} fill={C.placebo} fillOpacity={0.3} stroke={C.placebo} strokeWidth={2.5} />
            <path d={bell(nitrate.mean, nitrate.sd)} fill={C.nitrate} fillOpacity={0.25} stroke={C.nitrate} strokeWidth={2.5} />
            <line x1={GX0} x2={GX1} y1={BASE} y2={BASE} stroke="rgba(255,255,255,0.3)" />
            {[0, 1000, 2000].map(m => (
                <SvgText key={m} x={gx(m)} y={BASE + 20} text={m.toLocaleString('pt-BR')} size={16} weight={500} color={C.muted} anchor="middle" />
            ))}
            <path d={`M ${gx(placebo.mean)} ${BASE - 24} H ${gx(placebo.mean + placebo.sd)}`} stroke="#fff" strokeWidth={3} strokeLinecap="round" />
            <SvgText x={gx(placebo.mean + placebo.sd) + 8} y={BASE - 18} text="1 DP ≈ 500 m" size={17} weight={700} color="#fff" />
            <path d={`M ${gx(placebo.mean)} ${BASE - 56} H ${gx(nitrate.mean)}`} stroke={C.nitrateSoft} strokeWidth={4} strokeLinecap="round" />
            <SvgText x={gx(nitrate.mean) + 10} y={BASE - 50} text="+53 m (cálculo)" size={17} weight={700} color={C.nitrateSoft} />
            <SvgText x={560} y={308} text="beterraba" size={16} weight={600} color={C.nitrateSoft} anchor="middle" />
            <SvgText x={560} y={330} text="placebo" size={16} weight={600} color="#CBD5E1" anchor="middle" />
        </g>
    );
};

export const SprintTimes = ({ reduce }: { reduce: boolean }) => {
    const go = useEntered(reduce);
    return (
        <svg viewBox="0 0 720 448" width="100%" height="100%" role="img" aria-label="Tempos de sprint e Yo-Yo de Thompson 2016">
            <SprintBars go={go} />
            <YoYoBells go={go} />
        </svg>
    );
};
