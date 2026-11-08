import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import { VIS_H, VIS_W } from './ui';
import { Glow, T } from './arte/text';
import { Flask, Glass, VesselDefs } from './arte/vessels';

/** Passo 5 do PlaceboSim: suco × sal (mesma dose, mesmo nitrito, VO₂ diferente) e as duas hipóteses. Caixa 672 × 440. */

const PX = 176;
const BEAM_Y = 62;

/** Balança em equilíbrio: sal de nitrato × suco, a mesma dose em mmol. Balança leve e contínua (SVG animate). */
const Scale = ({ reduce }: { reduce: boolean }) => (
    <g>
        <rect x={PX - 5} y={BEAM_Y} width={10} height={140} rx={4} fill="rgba(255,255,255,0.22)" />
        <rect x={PX - 46} y={196} width={92} height={12} rx={6} fill="rgba(255,255,255,0.28)" />
        <g>
            {!reduce && <animateTransform attributeName="transform" type="rotate" values={`-2.2 ${PX} ${BEAM_Y};2.2 ${PX} ${BEAM_Y};-2.2 ${PX} ${BEAM_Y}`} dur="5.5s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />}
            <line x1={PX - 100} x2={PX + 100} y1={BEAM_Y} y2={BEAM_Y} stroke="#E5E7EB" strokeWidth={6} strokeLinecap="round" />
            {[PX - 96, PX + 96].map(bx => (
                <g key={bx}>
                    <path d={`M${bx} ${BEAM_Y}L${bx - 30} 124M${bx} ${BEAM_Y}L${bx + 30} 124`} stroke="#CBD5E1" strokeWidth={1.8} />
                    <rect x={bx - 34} y={122} width={68} height={7} rx={3.5} fill="#CBD5E1" />
                </g>
            ))}
            <Flask id="js-f" cx={PX - 96} y={80} s={0.58} />
            <Glass id="js-g" x={PX + 76} y={82} w={40} h={42} level={0.8} />
        </g>
        <circle cx={PX} cy={BEAM_Y} r={9} fill={C.no} stroke="#fff" strokeWidth={2} />
    </g>
);

const WOBBLE = [0.55, 0.2, 0.75, 0.35, 0.85, 0.25, 0.6] as const;

/** Hipótese B: sete visitas, sete pontos que oscilam sozinhos. */
const Noise = ({ x, y, reduce }: { x: number; y: number; reduce: boolean }) => (
    <g>
        <line x1={x} x2={x + 86} y1={y + 62} y2={y + 62} stroke="rgba(255,255,255,0.3)" />
        <line x1={x} x2={x + 86} y1={y + 30} y2={y + 30} stroke={C.nitrite} strokeOpacity={0.55} strokeDasharray="4 4" />
        {WOBBLE.map((v, i) => {
            const cy = y + 6 + (1 - v) * 52;
            return (
                <circle key={i} cx={x + 6 + i * 12} cy={cy} r={5} fill={C.nitrite} stroke="#fff" strokeWidth={1}>
                    {!reduce && <animate attributeName="cy" values={`${cy};${cy + (i % 2 ? -9 : 9)};${cy}`} dur={`${2.2 + i * 0.25}s`} repeatCount="indefinite" />}
                </circle>
            );
        })}
    </g>
);

export const JuiceVsSalt = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Sal e suco com a mesma dose; o suco baixou o VO₂ em cerca de 4%">
            <VesselDefs />
            <defs>
                <linearGradient id="js-slate" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#B6C2D3" /><stop offset="1" stopColor="#566277" /></linearGradient>
            </defs>

            {/* balança: a mesma dose em mmol */}
            <Scale reduce={reduce} />
            <T x={PX - 96} y={168} size={22} color="#E5E7EB" weight={700} anchor="middle" display>6 mmol</T>
            <T x={PX + 96} y={168} size={22} color={C.nitrateSoft} weight={700} anchor="middle" display>6 mmol</T>
            <T x={PX - 96} y={190} size={16} color="#fff" weight={600} anchor="middle">Sal (NaNO₃)</T>
            <T x={PX + 96} y={190} size={16} color="#fff" weight={600} anchor="middle">Suco</T>
            <T x={PX} y={232} size={16} color={C.noSoft} weight={700} anchor="middle">mesma dose em mmol</T>

            {/* nitrito igual */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <rect x={14} y={244} width={324} height={34} rx={12} fill="rgba(251,191,36,0.1)" stroke={C.nitrite} strokeOpacity={0.6} />
                <T x={28} y={267} size={16} color="#E5E7EB" weight={500}>nitrito no plasma:</T>
                <T x={168} y={268} size={19} color={C.nitrite} weight={700} display>igual</T>
                <T x={232} y={267} size={16} color={C.muted} weight={500}>p = 0,27</T>
            </motion.g>

            {/* resultado: VO₂ */}
            <T x={500} y={30} size={17} color="#fff" weight={700} anchor="middle">VO₂ ao fim do exercício severo</T>
            <line x1={376} x2={640} y1={226} y2={226} stroke="rgba(255,255,255,0.3)" />
            {[{ x: 384, h: 142, n: 'Sal', g: 'url(#js-slate)', c: '#E5E7EB' }, { x: 472, h: 136, n: 'Suco', g: 'url(#av-juice)', c: C.nitrateSoft }].map((b, i) => (
                <motion.g key={b.n} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 + 0.25 * i }}>
                    <rect x={b.x} y={226 - b.h} width={70} height={b.h} rx={10} fill={b.g} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
                    <path d={`M${b.x + 10} ${226 - b.h + 14}V${226 - 14}`} stroke="#fff" strokeOpacity={0.25} strokeWidth={5} strokeLinecap="round" />
                    <T x={b.x + 35} y={246} size={16} color={b.c} weight={700} anchor="middle">{b.n}</T>
                </motion.g>
            ))}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                <path d="M384 84H548" stroke="#E5E7EB" strokeOpacity={0.6} strokeDasharray="5 5" />
                <path d="M542 84V90" stroke={C.nitrateSoft} strokeWidth={2} />
                <Glow id="js-gl" cx={590} cy={120} r={60} color={C.nitrate} opacity={0.3} pulse={!reduce} />
                <T x={590} y={112} size={28} color={C.nitrateSoft} weight={700} anchor="middle" display>≈ −4%</T>
                <T x={590} y={134} size={16} color="#E5E7EB" weight={500} anchor="middle">com suco</T>
                <T x={590} y={154} size={16} color={C.muted} weight={500} anchor="middle">p = 0,003</T>
            </motion.g>

            {/* as duas hipóteses em cena */}
            {[{ x: 14, c: C.nitrate, t: 'A · algo na beterraba', l: ['cofator além do nitrato', 'age no músculo'] }, { x: 340, c: C.nitrite, t: 'B · ruído', l: ['sete visitas por pessoa', 'e várias comparações'] }].map((h, i) => (
                <motion.g key={h.t} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + 0.15 * i, duration: 0.4 }}>
                    <rect x={h.x} y={292} width={318} height={92} rx={14} fill="rgba(255,255,255,0.035)" stroke={h.c} strokeOpacity={0.7} strokeWidth={1.6} />
                    <T x={h.x + 116} y={322} size={19} color={h.c} weight={700} display>{h.t}</T>
                    {h.l.map((l, j) => <T key={l} x={h.x + 116} y={346 + 21 * j} size={16} color="#E5E7EB" weight={500}>{l}</T>)}
                </motion.g>
            ))}
            <Glass id="js-hy" x={34} y={318} w={44} h={52} level={0.8} />
            <circle cx={74} cy={332} r={21} fill="rgba(251,191,36,0.12)" stroke={C.nitrite} strokeWidth={3} />
            <path d="M89 347L104 362" stroke={C.nitrite} strokeWidth={5} strokeLinecap="round" />
            <T x={74} y={340} size={20} color={C.nitriteSoft} weight={700} anchor="middle" display>?</T>
            <Noise x={350} y={314} reduce={reduce} />

            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                <rect x={14} y={392} width={VIS_W - 28} height={44} rx={12} fill="rgba(52,211,153,0.07)" stroke={C.no} strokeOpacity={0.5} />
                <T x={28} y={411} size={16} color={C.no} weight={700}>Contrarrelógio de 10 km em handbike:</T>
                <T x={338} y={411} size={16} color="#E5E7EB" weight={500}>suco, sal e água, sem diferença</T>
                <T x={28} y={430} size={16} color={C.muted} weight={500}>(p = 0,80 sem deficiência; p = 0,61 paraciclistas)</T>
            </motion.g>
        </svg>
    );
};
