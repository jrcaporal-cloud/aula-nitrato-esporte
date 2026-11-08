import { motion } from 'framer-motion';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { NUMBER_DELAY_MS } from './countText';
import { SvgCount, SvgKeyFact, SvgReveal } from './beat';
import { NOISE_S, RESPONDERS } from './elite.content';
import { EH, EW } from './EliteForest';

/** Passo 5: os dois "respondedores" de Boorsma contra o ruído típico do teste (viewBox 740 × 360). */
const X0 = 250;
const PX = 36; // px por segundo
const sx = (s: number) => X0 + s * PX;

export const RespondersScene = ({ reduce }: { reduce: boolean }) => (
    <svg viewBox={`0 0 ${EW} ${EH}`} width={EW} height={EH} role="img" aria-label="Ganhos individuais de Boorsma 2014 contra o ruído do teste">
        <rect x={sx(0)} y={52} width={sx(NOISE_S) - sx(0)} height={232} fill={C.placebo} fillOpacity={0.18} />
        <SvgKeyFact color={C.placebo} delay={reduce ? 0 : 0.8}>
            <SvgText x={sx(NOISE_S / 2)} y={40} text={`ruído do teste ≈ ${NOISE_S.toString().replace('.', ',')} s`} size={17} weight={700} anchor="middle" color={C.placebo} />
        </SvgKeyFact>
        {[0, 2, 4, 6, 8, 10].map(t => (
            <g key={t}>
                <line x1={sx(t)} x2={sx(t)} y1={52} y2={284} stroke="rgba(255,255,255,0.07)" />
                <SvgText x={sx(t)} y={310} text={`${t} s`} size={16} anchor="middle" weight={500} color={C.muted} />
            </g>
        ))}
        <SvgReveal order={2}>
            <SvgText x={(sx(0) + sx(10)) / 2} y={338} text="melhora no 1.500 m com beterraba (segundos)" size={16} anchor="middle" weight={500} color="#CBD5E1" />
        </SvgReveal>
        {RESPONDERS.map((r, i) => {
            const y = 76 + i * 54;
            return (
                <g key={r.id}>
                    <SvgText x={X0 - 12} y={y + 22} text={r.label} size={17} weight={600} anchor="end" color="#E5E7EB" />
                    <motion.rect x={sx(0)} y={y} width={r.s * PX} height={32} rx={6} fill={C.no} fillOpacity={0.9}
                        style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
                        initial={{ scaleX: reduce ? 1 : 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : i * 0.12 }} />
                    <SvgReveal order={1} delay={i * 0.12}>
                        <SvgCount x={sx(r.s) + 10} y={y + 24} text={`${br(r.s, 1)} s`} size={20} weight={700} color="#fff"
                            count={{ delayMs: NUMBER_DELAY_MS + i * 120, ms: 600 }} />
                    </SvgReveal>
                </g>
            );
        })}
    </svg>
);
