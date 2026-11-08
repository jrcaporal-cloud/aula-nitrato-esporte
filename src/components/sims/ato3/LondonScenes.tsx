import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { LAB_BARS } from './london.content';

/** Cenas do slide 48 (viewBox 700 × 360, escala 1:1). */
export const LW = 700;
export const LH = 360;

interface SceneProps { reduce: boolean }

/** Passo 1: do ergômetro de laboratório ao percurso olímpico simulado. */
export const CourseScene = ({ reduce }: SceneProps) => (
    <svg viewBox={`0 0 ${LW} ${LH}`} width={LW} height={LH} role="img" aria-label="Percurso olímpico de contrarrelógio simulado em laboratório">
        <rect x={4} y={20} width={250} height={200} rx={16} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" />
        <SvgText x={129} y={52} text="Laboratório" size={20} weight={700} anchor="middle" color="#fff" />
        <circle cx={90} cy={150} r={32} fill="none" stroke={C.o2} strokeWidth={4} />
        <circle cx={180} cy={150} r={32} fill="none" stroke={C.o2} strokeWidth={4} />
        <path d="M 90 150 L 128 100 L 170 100 L 180 150 M 128 100 L 142 150 L 90 150 M 124 92 h 20" fill="none" stroke={C.o2} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        <SvgText x={129} y={208} text="ergômetro, 24 ciclistas" size={16} weight={500} anchor="middle" color={C.muted} />
        <path d="M 270 120 h 130 m -14 -12 l 14 12 l -14 12" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        <SvgText x={335} y={100} text="simula" size={17} weight={600} anchor="middle" color={C.muted} />
        <rect x={416} y={20} width={280} height={200} rx={16} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" />
        <SvgText x={556} y={52} text="Percurso olímpico 2012" size={20} weight={700} anchor="middle" color="#fff" />
        <motion.path d="M 450 170 C 450 100, 520 80, 570 110 S 660 170, 640 130 S 600 190, 540 190 S 450 200, 450 170 Z" fill="none" stroke={C.nitrate} strokeWidth={5} strokeLinecap="round"
            strokeDasharray="1 0" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduce ? 0 : 1.6 }} />
        <circle cx={450} cy={170} r={8} fill={C.no} stroke="#fff" strokeWidth={2} />
        <SvgText x={556} y={212} text="contrarrelógio de estrada" size={16} weight={500} anchor="middle" color={C.muted} />
        {[['Mulheres', '29,35 km'], ['Homens', '43,83 km'], ['Duração', '~50–60 min']].map(([k, v], i) => (
            <g key={k} transform={`translate(${4 + i * 232}, 250)`}>
                <rect width={222} height={86} rx={12} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" />
                <SvgText x={14} y={30} text={k} size={16} weight={500} color={C.muted} />
                <SvgText x={14} y={64} text={v} size={26} weight={700} color="#fff" />
            </g>
        ))}
    </svg>
);

/** Passo 2: barras divergentes — a mudança de potência com cafeína, cafeína + beterraba e só beterraba. */
export const LabScene = ({ reduce }: SceneProps) => {
    const Z = 300;
    const PX = 48;
    return (
        <svg viewBox={`0 0 ${LW} ${LH}`} width={LW} height={LH} role="img" aria-label="Mudança de potência no contrarrelógio simulado de Londres">
            <SvgText x={4} y={28} text="Potência média no percurso simulado, em relação ao controle" size={17} weight={600} color="#CBD5E1" />
            <line x1={Z} x2={Z} y1={50} y2={290} stroke="rgba(255,255,255,0.5)" strokeDasharray="5 5" />
            {LAB_BARS.map((b, i) => {
                const y = 66 + i * 74;
                const w = Math.abs(b.value) * PX;
                const x = b.value >= 0 ? Z : Z - w;
                return (
                    <g key={b.id}>
                        <SvgText x={4} y={y + 30} text={b.label} size={17} weight={600} color="#E5E7EB" />
                        <motion.rect x={x} y={y} width={w} height={42} rx={6} fill={b.color} fillOpacity={0.92}
                            style={{ transformBox: 'fill-box', transformOrigin: b.value >= 0 ? 'left center' : 'right center' }}
                            initial={{ scaleX: reduce ? 1 : 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : i * 0.15 }} />
                        <SvgText x={b.value >= 0 ? Z + w + 12 : Z + 12} y={y + 30} text={b.text} size={26} weight={700} color="#fff" />
                        <SvgText x={b.value >= 0 ? Z + w + 104 : Z + 112} y={y + 30} text={b.note} size={16} weight={500} color={C.muted} />
                    </g>
                );
            })}
            <SvgText x={4} y={318} text="Nutrição de melhor prática: refeição rica em carboidrato e bebida esportiva." size={16} weight={500} color={C.muted} />
            <SvgText x={4} y={344} text="Beterraba + cafeína × cafeína: −0,9% (p = 0,4)." size={16} weight={600} color={C.nitrateSoft} />
        </svg>
    );
};

/** Passo 3: pódio esquemático com as três afirmações do comunicado. */
export const PodiumScene = ({ reduce }: SceneProps) => (
    <svg viewBox={`0 0 ${LW} ${LH}`} width={LW} height={LH} role="img" aria-label="Pódio: afirmações do comunicado de 2012">
        {[{ x: 40, h: 110, n: '2' }, { x: 160, h: 160, n: '1' }, { x: 280, h: 80, n: '3' }].map((p, i) => (
            <motion.g key={p.n} initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.15 }}>
                <rect x={p.x} y={300 - p.h} width={110} height={p.h} rx={8} fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.2)" />
                <SvgText x={p.x + 55} y={300 - p.h / 2 + 12} text={p.n} size={34} weight={700} anchor="middle" color="rgba(255,255,255,0.7)" />
                <circle cx={p.x + 55} cy={300 - p.h - 22} r={16} fill="none" stroke={C.nitrite} strokeWidth={3} />
            </motion.g>
        ))}
        <rect x={430} y={20} width={266} height={110} rx={14} fill={`${C.nitrite}1a`} stroke={`${C.nitrite}aa`} />
        <SvgText x={563} y={58} text="RELATO" size={22} weight={700} anchor="middle" color={C.nitrite} />
        <SvgText x={563} y={86} text="comunicado de 19/09/2012" size={16} weight={600} anchor="middle" color="#E5E7EB" />
        <SvgText x={563} y={108} text="Universidade de Exeter" size={16} weight={500} anchor="middle" color={C.muted} />
        <SvgText x={20} y={330} text="Desenho esquemático. O comunicado não traz contagem independente." size={16} weight={500} color={C.muted} />
    </svg>
);
