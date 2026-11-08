import { motion } from 'framer-motion';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { Cyclist } from '../artKit/Figures';
import { Athlete, Gauge, LabRoom, Stadium } from './Stage';

/** Passo 4 — laboratório × pódio: à esquerda o mostrador com agulha (mede), à direita o mostrador vazio (não mede). */

interface SideProps {
    x: number;
    tag: string;
    title: string;
    color: string;
    lines: readonly string[];
}

const Side = ({ x, tag, title, color, lines }: SideProps) => (
    <g>
        <SvgText x={x} y={180} text={tag} size={16} weight={700} color={color} />
        <SvgText x={x} y={206} text={title} size={22} weight={700} color="#fff" />
        {lines.map((l, i) => <SvgText key={l} x={x} y={232 + i * 21} text={l} size={16} weight={500} color="#E5E7EB" />)}
    </g>
);

const PODIUM = [[640, 110, 46], [706, 90, 66], [772, 124, 32]] as const;

export const CompareArt = ({ reduce }: { reduce: boolean }) => (
    <g>
        <LabRoom x0={-10} x1={550} floor={160} />
        <g opacity={0.55}><Stadium x0={550} x1={1110} top={-60} /></g>
        <line x1={550} x2={550} y1={0} y2={444} stroke="#fff" strokeOpacity={0.2} strokeWidth={2} />
        <circle cx={550} cy={92} r={26} fill="#07050B" stroke="rgba(255,255,255,0.3)" />
        <SvgText x={550} y={101} text="×" size={26} weight={700} anchor="middle" color="#fff" />
        <Cyclist x={150} y={156} s={1.2} color={C.o2} still={reduce} />
        <Gauge x={390} y={124} value={0.48} color={C.o2} label="mede" />
        <SvgText x={390} y={42} text="−0,4% · p = 0,6" size={17} weight={700} anchor="middle" color={C.nitrateSoft} />
        {PODIUM.map(([x, y, h], i) => (
            <g key={x}>
                <rect x={x} y={y} width={66} height={h} rx={4} fill="#2A1618" stroke="rgba(255,255,255,0.25)" />
                <Athlete x={x + 33} y={y} s={0.85} up={i === 1} />
            </g>
        ))}
        <Gauge x={960} y={124} value={null} color={C.nitrite} label="não mede" />
        <Side x={24} tag="LABORATÓRIO · LANE 2014" title="Mede, mas é cenário controlado" color={C.o2Soft}
            lines={['duplo-cego, quadrado latino, 4 condições, 24 ciclistas', 'prova: com nutrição de melhor prática, a beterraba', 'sozinha não mudou a potência (−0,4%, p = 0,6)', 'limite: a nutrição de melhor prática pode mascarar efeito']} />
        <Side x={576} tag="PÓDIO · EXETER 2012" title="É real, mas não mede nada" color={C.nitrite}
            lines={['sem grupo controle, sem cegamento, sem desfecho medido', 'prova: que atletas teriam usado o suco.', 'Não prova que funcionou', 'fonte: comunicado do próprio grupo que pesquisa o tema']} />
        <motion.g initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.5 }}>
            <rect x={24} y={312} width={1052} height={46} rx={12} fill={`${C.risk}1c`} stroke={`${C.risk}77`} />
            <text x={44} y={343} fontSize={22} fontWeight={600} fill="#fff" style={{ fontFamily: 'var(--font-display)' }}>Uso por atleta de elite não é prova de eficácia.</text>
            <SvgText x={1060} y={341} text="Jones 2014 trata o uso em Londres 2012 como relato anedótico." size={16} weight={500} anchor="end" color="#CBD5E1" />
        </motion.g>
    </g>
);
