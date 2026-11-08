import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { Card, Illustrative, RangeRow } from './ui';
import { nitriteAt } from './protocolContent';
import { num } from './shared';

/** Passo 2 do ProtocolSim: a linha do tempo da prova (8 h → largada) com a janela de 2–4 h e a curva ilustrativa do nitrito. */

const W = 754;
const H = 250;
const X0 = 22;
const X1 = W - 44;
const SPAN = 8;
const xOf = (hoursBefore: number): number => X0 + ((SPAN - hoursBefore) / SPAN) * (X1 - X0);
const Y_BASE = 176;
const Y_TOP = 62;
const yOf = (v: number): number => Y_BASE - v * (Y_BASE - Y_TOP);

const curvePath = (doseAt: number): string => {
    const pts: string[] = [];
    for (let h = doseAt; h >= 0; h -= 0.1) {
        const v = nitriteAt(doseAt - h);
        pts.push(`${pts.length === 0 ? 'M' : 'L'}${xOf(h).toFixed(1)},${yOf(v).toFixed(1)}`);
    }
    return pts.join(' ');
};

const Zone = ({ from, to, color, label }: { from: number; to: number; color: string; label: string }) => (
    <g>
        <rect x={xOf(from)} y={28} width={xOf(to) - xOf(from)} height={Y_BASE - 28} fill={color} opacity={0.16} />
        <SvgText x={(xOf(from) + xOf(to)) / 2} y={48} text={label} anchor="middle" size={16} color={color} />
    </g>
);

export const TimeView = ({ hours, onHours }: { hours: number; onHours: (v: number) => void }) => {
    const atStart = nitriteAt(hours);
    return (
        <Card className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-5">
            <div className="flex items-center justify-between">
                <p className="m-0 font-mono text-[14px] uppercase tracking-wider text-gray-400">horas antes da largada · nitrito plasmático</p>
                <Illustrative>forma ilustrativa da curva</Illustrative>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Linha do tempo da dose até a largada">
                <Zone from={8} to={6} color={C.placebo} label="cedo demais" />
                <Zone from={4} to={2} color={C.no} label="janela 2–4 h" />
                <Zone from={1.5} to={0} color={C.hypoxia} label="tarde" />
                <rect x={xOf(3)} y={Y_BASE + 2} width={xOf(2) - xOf(3)} height={6} fill={C.no} />
                <SvgText x={xOf(2.5)} y={Y_BASE + 28} text="IOC 2–3 h" anchor="middle" size={16} color={C.no} />
                <line x1={X0} x2={X1} y1={Y_BASE} y2={Y_BASE} stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} />
                {[8, 7, 6, 5, 4, 3, 2, 1, 0].map(h => (
                    <SvgText key={h} x={xOf(h)} y={Y_BASE + 54} text={h === 0 ? 'largada' : `−${h} h`} anchor="middle" size={16} color="#D1D5DB" />
                ))}
                <path d={curvePath(hours)} fill="none" stroke={C.nitrite} strokeWidth={4} strokeLinecap="round" />
                <circle cx={xOf(hours)} cy={yOf(0)} r={7} fill={C.nitrate} />
                <SvgText x={xOf(hours)} y={Y_BASE - 12} text="dose" anchor="middle" size={16} color={C.nitrateSoft} />
                <line x1={xOf(0)} x2={xOf(0)} y1={28} y2={Y_BASE} stroke="#fff" strokeWidth={2.5} />
                <circle cx={xOf(0)} cy={yOf(atStart)} r={6} fill="#fff" />
                <SvgText x={xOf(0.75)} y={Y_BASE - 52} text="aquecimento" anchor="middle" size={16} color={C.hypoxia} />
            </svg>
            <p className="m-0 text-[17px] leading-snug text-gray-100">
                Dose {num(hours, 1)} h antes: na largada o nitrito está em <strong style={{ color: C.nitrite }}>{num(atStart * 100)}% do pico</strong>.
                <span className="text-gray-300"> Nitrato no plasma: meia-vida de ~5 h.</span>
            </p>
            <RangeRow label="Hora da dose" value={hours} min={0.5} max={8} step={0.5} onChange={onHours} color={C.nitrite}
                right={<span className="font-display text-[24px] font-semibold text-white">{num(hours, 1)} h antes</span>} />
        </Card>
    );
};
