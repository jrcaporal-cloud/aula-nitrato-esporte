import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { useEntered } from '../../ato4/hooks';
import { LAB_BARS } from '../london.content';
import { Cyclist } from '../artKit/Figures';
import { LabRoom } from './Stage';

/** Passo 2 — no laboratório: quatro ergômetros (controle e três condições) com a torre de potência de cada um. */

const BASE = 230;
const PX = 26;
const FLOOR = 336;
const COLS = [150, 410, 670, 930] as const;

const ROWS = [
    { id: 'ctrl', label: 'Controle', value: 0, text: '0', note: 'referência', color: C.placebo },
    ...LAB_BARS,
] as const;

export const LabArt = ({ reduce }: { reduce: boolean }) => {
    const go = useEntered(reduce);
    return (
        <g>
            <LabRoom x0={-10} x1={1110} floor={FLOOR} />
            <SvgText x={24} y={34} text="Potência média no percurso simulado, em relação ao controle" size={17} weight={700} color="#E5E7EB" />
            <SvgText x={24} y={58} text="nutrição de melhor prática: refeição rica em carboidrato e bebida esportiva" size={16} weight={500} color={C.muted} />
            <line x1={40} x2={1060} y1={BASE} y2={BASE} stroke="#fff" strokeOpacity={0.45} strokeDasharray="6 6" />
            <SvgText x={1060} y={BASE + 22} text="controle = 0" size={16} weight={500} anchor="end" color={C.muted} />
            {ROWS.map((b, i) => {
                const x = COLS[i];
                const h = Math.abs(b.value) * PX;
                const y = b.value >= 0 ? BASE - h : BASE;
                const valueY = b.value >= 0 ? BASE - h - 34 : BASE - 34;
                return (
                    <g key={b.id}>
                        <rect x={x - 32} y={y} width={64} height={Math.max(h, 2)} rx={6} fill={b.color} fillOpacity={0.9}
                            style={{ transformBox: 'fill-box', transformOrigin: b.value >= 0 ? 'center bottom' : 'center top', transform: `scaleY(${go ? 1 : 0})`, transition: `transform 1s cubic-bezier(0.22,0.8,0.24,1) ${0.15 * i}s`, filter: `drop-shadow(0 0 10px ${b.color}88)` }} />
                        {i > 0 && (
                            <g style={{ opacity: go ? 1 : 0, transition: `opacity 0.4s ease ${0.7 + 0.15 * i}s` }}>
                                <SvgText x={x} y={valueY} text={b.text} size={28} weight={700} anchor="middle" color="#fff" />
                                <SvgText x={x} y={valueY + 22} text={b.note} size={16} weight={600} anchor="middle" color={b.value < 0 ? C.nitrateSoft : C.muted} />
                            </g>
                        )}
                        <Cyclist x={x + 6} y={FLOOR} s={0.92} color={b.color} still={reduce} />
                        <SvgText x={x} y={FLOOR + 22} text={b.label} size={16} weight={700} anchor="middle" color="#E5E7EB" />
                    </g>
                );
            })}
            <SvgText x={1076} y={34} text="beterraba + cafeína × cafeína: −0,9% (p = 0,4)" size={16} weight={600} anchor="end" color={C.nitrateSoft} />
        </g>
    );
};
