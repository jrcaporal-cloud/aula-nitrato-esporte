import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { br } from '../kit/format';
import { ForestPlot, type ForestRow } from '../kit/ForestPlot';
import { SvgText } from '../kit/ui';
import { META_ROWS, type CutId, type Estimate, type MetaRow } from './metaContent';
import { VIS_H, VIS_W } from './ui';
import { T } from './arte/text';
import { Count, SvgKeyFact } from './countText';

/** Desenhos do MetaDisagreeSim. Caixa 672 × 440. */

const X0 = 196;
const X1 = 470;
const D_LO = -0.4;
const D_HI = 1.5;
const px = (v: number) => X0 + ((v - D_LO) / (D_HI - D_LO)) * (X1 - X0);
const ROW_Y = [112, 176, 240, 304, 368];

/** A linha onde o professor bate em cada recorte (o diamante que mais conta a história). */
const KEY_ROW: Record<CutId, MetaRow['id']> = { tte: 'hoon', tt: 'hoon', all: 'mcm', athlete: 'sen' };

const minus = (t: string): string => t.replace(/-/g, '−');
const fmt = (e: Estimate): string => minus(`${br(e.est, 2)} (${br(e.lo, 2)} a ${br(e.hi, 2)})`);

const Diamond = ({ e, color }: { e: Estimate; color: string }) => {
    const spring = { duration: 0.8, ease: 'easeInOut' as const };
    return (
        <motion.g initial={{ x: px(e.est), opacity: 0 }} animate={{ x: px(e.est), opacity: 1 }} transition={spring}>
            <motion.rect x={-1} y={-2.5} width={1} height={5} fill={color} initial={{ scaleX: px(e.est) - px(e.lo) }} animate={{ scaleX: px(e.est) - px(e.lo) }}
                transition={spring} style={{ originX: 1, originY: 0.5 }} />
            <motion.rect x={0} y={-2.5} width={1} height={5} fill={color} initial={{ scaleX: px(e.hi) - px(e.est) }} animate={{ scaleX: px(e.hi) - px(e.est) }}
                transition={spring} style={{ originX: 0, originY: 0.5 }} />
            <polygon points="0,-12 12,0 0,12 -12,0" fill={color} fillOpacity={0.92} stroke="#fff" strokeWidth={1.5} />
        </motion.g>
    );
};

/** Uma meta-análise: nome, diamante (ou texto em segundos) e os números à direita. */
const RowView = ({ row, cut, y }: { row: MetaRow; cut: CutId; y: number }) => {
    const e = row.cuts[cut];
    const seconds = row.seconds?.[cut];
    return (
        <g>
            <SvgText x={14} y={y - 2} text={row.name} size={18} color={row.color} weight={700} />
            <SvgText x={14} y={y + 19} text={row.sub} size={16} color={C.muted} weight={500} />
            <g transform={`translate(0 ${y})`}>{e && <Diamond e={e} color={row.color} />}</g>
            {!e && !seconds && <SvgText x={(X0 + X1) / 2} y={y + 6} text="sem estimativa neste recorte" anchor="middle" size={16} color={C.muted} weight={500} />}
            {e && (KEY_ROW[cut] === row.id ? (
                <SvgKeyFact key={cut} color={row.color}>
                    <T x={VIS_W - 12} y={y - 2} anchor="end" size={17} color="#fff" weight={700}><Count text={fmt(e)} /></T>
                </SvgKeyFact>
            ) : <T x={VIS_W - 12} y={y - 2} anchor="end" size={17} color="#fff" weight={700}><Count text={fmt(e)} /></T>)}
            {e?.note && <SvgText x={VIS_W - 12} y={y + 19} text={e.note} anchor="end" size={16} color={C.muted} weight={500} />}
            {seconds && <T x={VIS_W - 12} y={y - 2} anchor="end" size={17} color="#fff" weight={700}><Count text={seconds} /></T>}
            {seconds && <SvgText x={VIS_W - 12} y={y + 19} text="em segundos, fora da escala" anchor="end" size={16} color={C.muted} weight={500} />}
        </g>
    );
};

/** Passos 1 a 4: um diamante por meta-análise, que se move quando muda o recorte. */
export const DiamondRows = ({ cut, title }: { cut: CutId; title: string }) => (
    <svg width={VIS_W} height={VIS_H} viewBox={`0 0 ${VIS_W} ${VIS_H}`} role="img" aria-label="Diamantes das meta-análises na mesma escala">
        <SvgText x={VIS_W / 2} y={28} text={title} anchor="middle" size={18} color="#fff" weight={700} />
        <SvgText x={VIS_W / 2} y={54} text="nenhum estudo foi adicionado ou removido desta tela" anchor="middle" size={16} color={C.nitrite} weight={600} />
        <rect x={px(-0.2)} y={80} width={px(0.2) - px(-0.2)} height={314} fill="rgba(255,255,255,0.04)" />
        <SvgText x={px(0) - 4} y={390} text="trivial" anchor="middle" size={16} color={C.muted} weight={500} />
        {[0, 0.5, 1, 1.5].map(t => (
            <g key={t}>
                <line x1={px(t)} x2={px(t)} y1={80} y2={394} stroke={t === 0 ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.07)'} strokeDasharray={t === 0 ? '5 5' : undefined} />
                <SvgText x={px(t)} y={418} text={t === 0 ? '0' : br(t, 1)} anchor="middle" size={16} color={C.muted} weight={600} />
            </g>
        ))}
        {META_ROWS.map((row, i) => <RowView key={row.id} row={row} cut={cut} y={ROW_Y[i]} />)}
    </svg>
);

const ALL_ROWS: readonly ForestRow[] = [
    { id: 'h1', label: 'Hoon 2013 · TTE', est: 0.79, lo: 0.23, hi: 1.35, kind: 'pooled', color: C.nitrate },
    { id: 'h2', label: 'Hoon 2013 · TT', est: 0.11, lo: -0.16, hi: 0.37, kind: 'pooled', color: C.nitrate },
    { id: 'm1', label: 'McMahon 2017 · TTE', est: 0.33, lo: 0.15, hi: 0.5, kind: 'pooled', color: C.nitrite },
    { id: 'm2', label: 'McMahon 2017 · agrupado', est: -0.1, lo: -0.27, hi: 0.06, kind: 'pooled', color: C.nitrite },
    { id: 's1', label: 'Senefeld 2020 · TTE', est: 0.324, lo: 0.213, hi: 0.436, kind: 'pooled', color: C.no },
    { id: 's2', label: 'Senefeld 2020 · TT', est: 0.086, lo: 0.002, hi: 0.173, kind: 'pooled', color: C.no },
    { id: 's3', label: 'Senefeld 2020 · elite', est: 0.021, lo: -0.103, hi: 0.144, kind: 'pooled', color: C.no },
    { id: 'x1', label: 'Xie 2026 · atletas', est: 0.13, lo: -0.07, hi: 0.32, kind: 'pooled', color: C.bacteria },
];

/** Passo 5: todas as estimativas na mesma escala (kit/ForestPlot). */
export const AllTogether = () => (
    <div className="h-full p-3">
        <ForestPlot rows={ALL_ROWS} width={VIS_W - 24} height={VIS_H - 24} domain={[-0.5, 1.5]} ticks={[-0.5, 0, 0.5, 1, 1.5]}
            axisLabel="tamanho de efeito (SMD) · Gao 2021 está em segundos" labelWidth={216} valueWidth={170} decimals={2} sides={['contra o nitrato', 'a favor']} />
    </div>
);
