import { motion } from 'framer-motion';
import { ForestPlot, type ForestRow } from '../../kit/ForestPlot';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { Runner } from '../../ato3/artKit/Figures';
import { Turf } from './Pitch';

/**
 * Passo 5 — Alsharif 2023: no gramado, os três ensaios de Yo-Yo terminam um pouco à frente da "sombra" do placebo
 * (o sentido se repete); embaixo, a floresta agrupada, menor. A vantagem desenhada é proporcional ao % de cada ensaio.
 */

const POOLED: readonly ForestRow[] = [
    { id: 'yoyo', label: 'Yo-Yo IR1 · distância', sub: 'k = 4 · I² 25%', est: 0.17, lo: 0.09, hi: 0.24, kind: 'pooled', color: C.nitrate },
    { id: 'media', label: 'Potência média', sub: 'I² 79%', est: 0.2, lo: 0.03, hi: 0.36, kind: 'pooled', color: C.nitrateSoft },
    { id: 'pico', label: 'Pico de potência', sub: 'não muda', est: 0.01, lo: -0.06, hi: 0.08, kind: 'pooled', color: C.placebo },
];

const TRIALS = [['Wylie 2013', '+4,2%', 4.2], ['Nyakayiru 2017', '+3,4%', 3.4], ['Thompson 2016', '+3,9%', 3.9]] as const;
const GHOST_X = 430;
const PX_PCT = 9;

export const PooledArt = ({ reduce }: { reduce: boolean }) => (
    <div className="flex h-full flex-col">
        <div style={{ height: 182 }}>
            <svg viewBox="0 0 720 182" width="100%" height="100%" role="img" aria-label="Três ensaios de Yo-Yo, todos um pouco à frente do placebo">
                <SvgText x={24} y={28} text="Ensaios individuais de Yo-Yo (em %, outra régua que o SMD)" size={17} weight={700} color="#E5E7EB" />
                <Turf x={24} y={36} w={672} h={140} band={56} id="pooled-turf" />
                <line x1={GHOST_X} x2={GHOST_X} y1={40} y2={172} stroke="#fff" strokeOpacity={0.35} strokeDasharray="4 5" />
                <SvgText x={GHOST_X - 30} y={60} text="placebo" size={16} weight={600} anchor="end" color="#CBD5E1" />
                {TRIALS.map(([name, pct, v], i) => {
                    const y = 74 + i * 44;
                    const lead = v * PX_PCT;
                    return (
                        <g key={name}>
                            <SvgText x={40} y={y - 4} text={name} size={17} weight={700} color="#fff" />
                            <g opacity={0.55}><Runner x={GHOST_X} y={y + 6} s={0.72} color={C.placebo} still /></g>
                            <motion.g initial={{ x: reduce ? 0 : -lead }} animate={{ x: 0 }} transition={{ duration: reduce ? 0 : 1.1, delay: reduce ? 0 : 0.2 + i * 0.15, ease: 'easeOut' }}>
                                <Runner x={GHOST_X + lead} y={y + 6} s={0.72} color={C.nitrate} still={reduce} />
                            </motion.g>
                            <SvgText x={GHOST_X + lead + 22} y={y - 4} text={pct} size={20} weight={700} color={C.nitrateSoft} />
                        </g>
                    );
                })}
            </svg>
        </div>
        <div className="px-4 pt-1 text-[16px] font-bold text-gray-100">Alsharif 2023 · meta-análise de esforços curtos e intensos</div>
        <div className="min-h-0 flex-1 px-3">
            <ForestPlot rows={POOLED} width={694} height={236} domain={[-0.2, 0.5]} ticks={[-0.2, 0, 0.2, 0.4]}
                axisLabel="diferença padronizada (SMD)" decimals={2} labelWidth={250} valueWidth={196} sides={['piora', 'melhora']} />
        </div>
    </div>
);
