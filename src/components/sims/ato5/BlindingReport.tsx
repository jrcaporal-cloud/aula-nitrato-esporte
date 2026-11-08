import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { VIS_H, VIS_W } from './ui';
import { Seal } from './arte/figures';
import { T } from './arte/text';
import { Count, SvgKeyFact } from './countText';
import { Ord } from './svgOrderA';

/** Passo 4 do BlindingSim: veredito de cada estudo como selo grande (mediu e mostrou o cego?). Caixa 672 × 440. */

interface StudyCard {
    who: string[];
    sub: string;
    mark: 'ok' | 'no' | 'dash';
    color: string;
    verdict: string[];
    result: string[];
}

const CARDS: readonly StudyCard[] = [
    { who: ['López-Samanes', '2026'], sub: '12 velocistas', mark: 'ok', color: C.no, verdict: ['mediu e', 'mostrou'], result: ['Bang 0,16 e 0,08'] },
    { who: ['Berlanga', '2023'], sub: '10 escaladores', mark: 'ok', color: C.no, verdict: ['mediu e', 'mostrou'], result: ['3 de 10 acertaram'] },
    { who: ['Brennan', '2026'], sub: '18 mulheres treinadas', mark: 'no', color: C.risk, verdict: ['mediu, não', 'mostrou'], result: ['avaliou; o número', 'não aparece'] },
    { who: ['Xie', '2026'], sub: '45 ECRs em atletas', mark: 'dash', color: C.placebo, verdict: ['13 com', 'reservas'], result: ['placebo, cego ou', 'enxaguante'] },
];
const CW = 155;
const GAP = 8;

/** 45 pontinhos, 13 acesos: os ECRs com reservas sobre o cego. */
const Dots45 = ({ x, y }: { x: number; y: number }) => (
    <g>
        {Array.from({ length: 45 }, (_, i) => (
            <circle key={i} cx={x + (i % 9) * 13} cy={y + Math.floor(i / 9) * 13} r={4.4} fill={i < 13 ? C.nitrite : C.placebo} fillOpacity={i < 13 ? 1 : 0.35} />
        ))}
    </g>
);

export const ReportSeals = () => (
    <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Quem mediu e quem mostrou o cego">
        {CARDS.map((c, i) => {
            const x0 = 14 + i * (CW + GAP);
            const cx = x0 + CW / 2;
            return (
                <g key={c.who[0]}>
                    <rect x={x0} y={12} width={CW} height={364} rx={16} fill="rgba(255,255,255,0.035)" stroke={c.color} strokeOpacity={0.55} strokeWidth={1.6} />
                    {c.who.map((w, j) => <T key={w} x={cx} y={42 + 22 * j} size={17} color="#fff" weight={700} anchor="middle" display>{w}</T>)}
                    <T x={cx} y={96} size={16} color={C.muted} weight={500} anchor="middle">{c.sub}</T>
                    <motion.g initial={{ opacity: 0, scale: 1.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 + 0.2 * i, type: 'spring', stiffness: 240, damping: 15 }}
                        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                        {c.mark === 'no' ? (
                            <SvgKeyFact color={C.risk} delay={0.95}>
                                <Seal cx={cx} cy={166} r={46} color={c.color} mark={c.mark} rotate={i % 2 ? 7 : -7} />
                            </SvgKeyFact>
                        ) : <Seal cx={cx} cy={166} r={46} color={c.color} mark={c.mark} rotate={i % 2 ? 7 : -7} />}
                    </motion.g>
                    <Ord at={0.35 + 0.2 * i}>
                        {c.verdict.map((v, j) => <T key={v} x={cx} y={238 + 21 * j} size={17} color={c.color === C.placebo ? '#E5E7EB' : c.color} weight={700} anchor="middle">{i === 3 && j === 0 ? <Count text={v} delayMs={950} ms={700} /> : v}</T>)}
                        {i === 3 ? <Dots45 x={cx - 52} y={286} /> : null}
                    </Ord>
                    <Ord at={0.5 + 0.2 * i}>
                        {c.result.map((r, j) => <T key={r} x={cx} y={(i === 3 ? 340 : 296) + 21 * j} size={16} color="#E5E7EB" weight={500} anchor="middle">{r}</T>)}
                    </Ord>
                </g>
            );
        })}
        <Ord at={1.25}>
            <T x={VIS_W / 2} y={402} size={16} color={C.muted} weight={500} anchor="middle">Bang 2004: apesar de milhares de ensaios “duplo-cegos” por ano,</T>
            <T x={VIS_W / 2} y={424} size={16} color={C.muted} weight={500} anchor="middle">medir a eficácia do cegamento raramente é discutido.</T>
        </Ord>
    </svg>
);
