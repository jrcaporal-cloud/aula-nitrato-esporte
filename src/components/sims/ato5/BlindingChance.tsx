import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import { VIS_H, VIS_W } from './ui';
import { Person } from './arte/figures';
import { Glow, T } from './arte/text';
import { Count, SvgKeyFact } from './countText';
import { Ord } from './svgOrderA';

/** Passo 2 do BlindingSim: 3 escaladores acertaram de 10; ao lado, o que o acaso daria. Caixa 672 × 440. */

/** Probabilidade binomial P(X = k) para n = 10 e p = 0,5. */
const BINOM = [1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1].map(c => c / 1024);
const CORRECT = new Set([1, 5, 8]);
const BASE_Y = 330;
const bx = (k: number) => 334 + k * 29;
const hOf = (p: number) => (p / 0.25) * 176;

export const UrnVsChance = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Três acertos em dez, comparados ao acaso">
            <defs>
                <linearGradient id="bc-hill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#64748B" stopOpacity="0.4" /><stop offset="1" stopColor="#64748B" stopOpacity="0.04" /></linearGradient>
                <linearGradient id="bc-ok" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={C.noSoft} /><stop offset="1" stopColor={C.noDeep} /></linearGradient>
            </defs>
            <T x={140} y={34} size={19} color="#fff" weight={700} anchor="middle">Os 10 escaladores</T>
            <path d="M14 340L96 150L146 236L196 168L290 340Z" fill="url(#bc-hill)" />
            <path d="M14 340L96 150L146 236L196 168L290 340" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={2} strokeLinejoin="round" />
            {Array.from({ length: 10 }, (_, k) => {
                const cx = 48 + (k % 5) * 54;
                const cy = 238 + Math.floor(k / 5) * 66;
                const ok = CORRECT.has(k);
                return (
                    <motion.g key={k} initial={{ opacity: 0, y: -26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: reduce ? 0 : 0.08 * k }}>
                        {ok && <Glow id={`bc-g${k}`} cx={cx} cy={cy} r={34} color={C.no} opacity={0.6} pulse={!reduce} />}
                        <Person cx={cx} cy={cy} s={1.9} color={ok ? C.no : C.placebo} opacity={ok ? 1 : 0.5} />
                        {ok ? (
                            <g><circle cx={cx + 17} cy={cy - 20} r={10} fill="#064E3B" stroke={C.no} strokeWidth={2} /><path d={`M${cx + 12} ${cy - 20}L${cx + 16} ${cy - 16}L${cx + 23} ${cy - 25}`} stroke={C.noSoft} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
                        ) : <T x={cx + 14} y={cy - 18} size={16} color={C.muted} weight={700} anchor="middle">?</T>}
                    </motion.g>
                );
            })}
            <Ord at={0.75}>
                <circle cx={50} cy={390} r={8} fill={C.no} /><T x={66} y={396} size={17} color={C.noSoft} weight={700}>acertou: 3</T>
                <circle cx={50} cy={418} r={8} fill={C.placebo} fillOpacity={0.6} /><T x={66} y={424} size={17} color="#E5E7EB" weight={600}>errou: 7</T>
            </Ord>

            <T x={482} y={34} size={19} color="#fff" weight={700} anchor="middle">Se todos chutassem</T>
            <T x={482} y={58} size={16} color={C.muted} weight={500} anchor="middle">acertos em 10 palpites entre 2 opções</T>
            <line x1={322} x2={646} y1={BASE_Y} y2={BASE_Y} stroke="rgba(255,255,255,0.3)" />
            {BINOM.map((p, k) => (
                <motion.rect key={k} x={bx(k)} width={24} rx={4} y={BASE_Y - hOf(p)} height={hOf(p)}
                    fill={k <= 3 ? 'url(#bc-ok)' : C.placebo} fillOpacity={k <= 3 ? 1 : 0.35} stroke={k === 3 ? '#fff' : 'none'} strokeWidth={1.5}
                    initial={{ opacity: 0, scaleY: 0.2 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: reduce ? 0 : 0.5 + 0.05 * k, duration: 0.4 }}
                    style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
            ))}
            {[0, 2, 4, 6, 8, 10].map(k => <T key={k} x={bx(k) + 12} y={BASE_Y + 24} size={17} color={C.muted} weight={600} anchor="middle">{k}</T>)}
            <line x1={bx(5) + 12} x2={bx(5) + 12} y1={96} y2={BASE_Y} stroke="rgba(255,255,255,0.5)" strokeDasharray="5 5" />
            <Ord at={0.8}>
                <T x={bx(5) + 20} y={110} size={17} color="#E5E7EB" weight={700}>esperado: 5</T>
                <T x={bx(3) + 12} y={BASE_Y - hOf(BINOM[3]) - 12} size={17} color="#fff" weight={700} anchor="middle">observado: 3</T>
            </Ord>
            <Ord at={1.0}>
                <path d={`M${bx(0)} ${BASE_Y + 42}V${BASE_Y + 52}H${bx(3) + 24}V${BASE_Y + 42}`} stroke={C.noSoft} strokeWidth={2} fill="none" />
                <SvgKeyFact color={C.no} delay={1.1}>
                    <T x={bx(0) - 6} y={BASE_Y + 80} size={26} color={C.noSoft} weight={700} display><Count text="17%" delayMs={1000} ms={800} /></T>
                </SvgKeyFact>
            </Ord>
            <Ord at={1.25}>
                <T x={bx(0) + 58} y={BASE_Y + 80} size={16} color={C.noSoft} weight={600}>das vezes dão 3 ou menos (cálculo)</T>
            </Ord>
        </svg>
    );
};
