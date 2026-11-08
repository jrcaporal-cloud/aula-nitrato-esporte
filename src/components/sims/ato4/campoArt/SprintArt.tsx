import { br } from '../../kit/format';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { SPRINT_ROWS, YOYO_SD } from '../teamContent';
import { Turf } from './Pitch';

/**
 * Passo 4 — Thompson 2016: três raias de sprint (5, 10, 20 m) com placebo e beterraba largando juntos; cada um
 * cruza a linha no seu tempo (câmera lenta, mesma escala). Embaixo, o Yo-Yo como duas curvas quase iguais. viewBox 720 × 448.
 */

const START = 90;
const PX_M = 22;
const SLOW = 1.15;
const LOOP = 6.5;
const laneY = (i: number) => 52 + i * 56;
const DIST = [5, 10, 20] as const;

const Racer = ({ y, finish, time, color, reduce }: { y: number; finish: number; time: number; color: string; reduce: boolean }) => {
    const f = ((time * SLOW) / LOOP).toFixed(4);
    return (
        <circle cx={reduce ? finish : START} cy={y} r={8} fill={color} stroke="#fff" strokeWidth={2}>
            {!reduce && <animate attributeName="cx" values={`${START};${finish};${finish}`} keyTimes={`0;${f};1`} dur={`${LOOP}s`}
                repeatCount="indefinite" calcMode="spline" keySplines="0.55 0 0.75 1;0 0 1 1" />}
        </circle>
    );
};

const GX0 = 70;
const GX1 = 690;
const GMAX = 2800;
const gx = (m: number) => GX0 + (m / GMAX) * (GX1 - GX0);
const BASE = 424;
const PEAK = 92;
const bell = (mean: number, sd: number): string => {
    const pts: string[] = [];
    for (let m = 0; m <= GMAX; m += 40) pts.push(`${gx(m).toFixed(1)},${(BASE - Math.exp(-0.5 * ((m - mean) / sd) ** 2) * PEAK).toFixed(1)}`);
    return `M ${gx(0)},${BASE} L ${pts.join(' L ')} L ${gx(GMAX)},${BASE} Z`;
};

export const SprintArt = ({ reduce }: { reduce: boolean }) => {
    const { placebo, nitrate } = YOYO_SD;
    return (
        <svg viewBox="0 0 720 448" width="100%" height="100%" role="img" aria-label="Sprints de 5, 10 e 20 m e Yo-Yo de Thompson 2016">
            <SvgText x={24} y={30} text="Thompson 2016 · tempo de sprint (menor é melhor)" size={18} weight={700} color="#E5E7EB" />
            <SvgText x={696} y={30} text="70 mL/dia · 6,4 mmol · 5 dias" size={16} weight={600} anchor="end" color={C.nitrateSoft} />
            {SPRINT_ROWS.map((r, i) => {
                const y = laneY(i);
                const fin = START + DIST[i] * PX_M;
                return (
                    <g key={r.dist}>
                        <Turf x={24} y={y - 4} w={fin - 4} h={48} band={44} id={`sprint-${i}`} rx={8} />
                        <line x1={START} x2={START} y1={y - 4} y2={y + 44} stroke="#fff" strokeOpacity={0.6} strokeWidth={2} />
                        <rect x={fin - 3} y={y - 4} width={6} height={48} fill="#fff" opacity={0.85} />
                        <SvgText x={40} y={y + 27} text={r.dist} size={20} weight={700} color="#fff" />
                        <Racer y={y + 10} finish={fin} time={r.placebo} color={C.placebo} reduce={reduce} />
                        <Racer y={y + 30} finish={fin} time={r.nitrate} color={C.nitrate} reduce={reduce} />
                        <SvgText x={fin + 16} y={y + 16} text={`${br(r.placebo, 2)} → ${br(r.nitrate, 2)} s`} size={16} weight={600} color="#E5E7EB" />
                        <SvgText x={fin + 16} y={y + 40} text={r.delta} size={20} weight={700} color={C.nitrateSoft} />
                    </g>
                );
            })}
            <SvgText x={24} y={232} text="na linha de chegada, a vantagem é de centímetros" size={16} weight={600} color={C.muted} />
            <line x1={24} x2={696} y1={246} y2={246} stroke="rgba(255,255,255,0.1)" />
            <SvgText x={24} y={274} text="Yo-Yo IR1 · distância (m) · curvas ilustrativas (média ± DP)" size={17} weight={700} color="#E5E7EB" />
            <path d={bell(placebo.mean, placebo.sd)} fill={C.placebo} fillOpacity={0.3} stroke={C.placebo} strokeWidth={2.5} />
            <path d={bell(nitrate.mean, nitrate.sd)} fill={C.nitrate} fillOpacity={0.25} stroke={C.nitrate} strokeWidth={2.5} />
            <line x1={GX0} x2={GX1} y1={BASE} y2={BASE} stroke="rgba(255,255,255,0.3)" />
            {[0, 1000, 2000].map(m => <SvgText key={m} x={gx(m)} y={BASE + 20} text={m.toLocaleString('pt-BR')} size={16} weight={500} color={C.muted} anchor="middle" />)}
            <path d={`M ${gx(placebo.mean)} ${BASE - 20} H ${gx(placebo.mean + placebo.sd)}`} stroke="#fff" strokeWidth={3} strokeLinecap="round" />
            <SvgText x={gx(placebo.mean + placebo.sd) + 8} y={BASE - 14} text="1 DP ≈ 500 m" size={17} weight={700} color="#fff" />
            <path d={`M ${gx(placebo.mean)} ${BASE - 50} H ${gx(nitrate.mean)}`} stroke={C.nitrateSoft} strokeWidth={4} strokeLinecap="round" />
            <SvgText x={gx(nitrate.mean) + 10} y={BASE - 44} text="+53 m (cálculo)" size={17} weight={700} color={C.nitrateSoft} />
            <SvgText x={600} y={306} text="beterraba" size={16} weight={600} color={C.nitrateSoft} anchor="middle" />
            <SvgText x={600} y={328} text="placebo" size={16} weight={600} color="#CBD5E1" anchor="middle" />
        </svg>
    );
};
