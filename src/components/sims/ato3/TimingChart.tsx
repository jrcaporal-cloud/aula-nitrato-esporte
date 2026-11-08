import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { curveMuscle, curveNitrate, curveNitrite, WINDOW } from './timing.content';

/** Eixo de 0 a 24 h após a dose (viewBox 660 × 360, escala 1:1). Curvas ilustrativas ancoradas nos picos medidos. */
export const CW = 660;
export const CH = 360;
const X0 = 50;
const X1 = 640;
const TOP = 80;
const BASE = 262;
const sx = (t: number) => X0 + (t / 24) * (X1 - X0);
const sy = (v: number) => BASE - v * (BASE - TOP);

const pathOf = (f: (t: number) => number, tMax = 24) => {
    const pts: string[] = [];
    for (let t = 0; t <= tMax + 1e-6; t += 0.25) pts.push(`${pts.length ? 'L' : 'M'} ${sx(t).toFixed(1)} ${sy(f(t)).toFixed(1)}`);
    return pts.join(' ');
};

/** Anotação à direita do gráfico (também faz o papel de legenda). */
const Note = ({ y, color, text, square = false }: { y: number; color: string; text: string; square?: boolean }) => (
    <g>
        {square ? <rect x={338} y={y - 13} width={14} height={16} fill={color} fillOpacity={0.4} stroke={color} /> : <circle cx={345} cy={y - 5} r={6} fill={color} />}
        <SvgText x={362} y={y} text={text} size={16} weight={600} color="#E5E7EB" />
    </g>
);

interface Props { hours: number; reduce: boolean }

export const TimingChart = ({ hours, reduce }: Props) => (
    <svg viewBox={`0 0 ${CW} ${CH}`} width={CW} height={CH} role="img" aria-label="Nitrato, nitrito e nitrato muscular nas 24 horas após uma dose">
        {[0, 3, 6, 9, 12, 15, 18, 21, 24].map(t => (
            <g key={t}>
                <line x1={sx(t)} x2={sx(t)} y1={TOP} y2={BASE} stroke="rgba(255,255,255,0.07)" />
                <SvgText x={sx(t)} y={BASE + 26} text={`${t}`} size={16} anchor="middle" weight={500} color={C.muted} />
            </g>
        ))}
        <line x1={X0} x2={X1} y1={BASE} y2={BASE} stroke="rgba(255,255,255,0.35)" />
        <SvgText x={(X0 + X1) / 2} y={BASE + 52} text="horas após a dose" size={17} anchor="middle" weight={500} color="#CBD5E1" />
        <rect x={sx(WINDOW.from)} y={TOP - 8} width={sx(WINDOW.to) - sx(WINDOW.from)} height={BASE - TOP + 8} fill={C.no} fillOpacity={0.2} stroke={C.no} strokeOpacity={0.7} />
        <path d={pathOf(curveMuscle)} fill="none" stroke={C.nitrateSoft} strokeWidth={3} strokeDasharray="7 5" strokeLinecap="round" />
        <path d={pathOf(curveNitrate)} fill="none" stroke={C.nitrate} strokeWidth={3.5} strokeLinecap="round" />
        <path d={pathOf(curveNitrite)} fill="none" stroke={C.nitrite} strokeWidth={4.5} strokeLinecap="round" />
        <circle cx={sx(1.5)} cy={sy(1)} r={6} fill={C.nitrate} stroke="#fff" strokeWidth={2} />
        <circle cx={sx(2.5)} cy={sy(1)} r={7} fill={C.nitrite} stroke="#fff" strokeWidth={2} />
        <circle cx={sx(3)} cy={sy(1)} r={6} fill={C.nitrateSoft} stroke="#fff" strokeWidth={2} />
        <Note y={96} color={C.nitrate} text="nitrato: pico em 1–2 h" />
        <Note y={122} color={C.nitrite} text="nitrito: pico em 2–3 h" />
        <Note y={148} color={C.nitrateSoft} text="músculo: 181 nmol/g em 3 h" />
        <Note y={174} color={C.nitrateSoft} text="músculo: basal a partir de 9 h" />
        <Note y={200} color={C.no} text="janela 2–3,5 h (Senefeld 2020)" square />
        <motion.g animate={{ x: 0 }} transition={{ duration: reduce ? 0 : 0.2 }}>
            <line x1={sx(hours)} x2={sx(hours)} y1={34} y2={BASE} stroke="#fff" strokeWidth={2.5} strokeDasharray="5 4" />
            <path d={`M ${sx(hours) - 9} ${20} h 18 l -9 14 z`} fill="#fff" />
            <SvgText x={Math.min(Math.max(sx(hours), 70), 600)} y={16} text={`prova · ${hours.toFixed(1).replace('.', ',')} h`} size={17} weight={700} anchor="middle" color="#fff" />
        </motion.g>
    </svg>
);
