import { motion, useReducedMotion } from 'framer-motion';
import { useId } from 'react';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { Calc } from '../ui';
import { CULTIVO } from '../foodContent';
import { num } from '../shared';
import { ArtSvg, BigNum, Stage } from './stage';
import { Glyph } from './veg';

/** Passo 4 do slide 44: cinco potes com o mesmo vegetal; o nível é o mg/kg de cada cultivo (SP: alface lisa; RS: hidroponia). */

const BASE = 248;
const JAR_H = 150;
const JAR_W = 78;
const AXIS_MAX = 6500;
const XS = [74, 192, 310, 556, 700];
const LABEL: Record<string, [string, string]> = {
    'sp-org': ['Alface', 'orgânica'], 'sp-conv': ['Alface', 'convencional'], 'sp-hid': ['Alface', 'hidropônica'],
    'rs-alface': ['Alface', 'hidropônica'], 'rs-rucula': ['Rúcula', 'hidropônica'],
};

export const FoodCultivoArt = () => {
    const id = useId();
    const reduce = useReducedMotion();
    const yOrg = BASE - (565 / AXIS_MAX) * JAR_H;
    const yHid = BASE - (3093 / AXIS_MAX) * JAR_H;
    return (
        <Stage glow={C.hypoxia}>
            <ArtSvg w={812} h={326} label="Nitrato em cinco cultivos de alface e rúcula" className="min-h-0 w-full flex-1">
                <defs>
                    <linearGradient id={`${id}-l`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.nitrate} /><stop offset="100%" stopColor={C.nitrateDeep} />
                    </linearGradient>
                </defs>
                <SvgText x={24} y={28} text="Pirassununga-SP · alface lisa · mg/kg" size={16} color="#D1D5DB" weight={500} />
                <SvgText x={500} y={28} text="Vale do Taquari-RS · hidroponia · mg/kg" size={16} color="#D1D5DB" weight={500} />
                <line x1={474} x2={474} y1={14} y2={300} stroke="rgba(255,255,255,0.14)" strokeDasharray="4 6" />
                {CULTIVO.map((b, i) => {
                    const x = XS[i];
                    const h = (b.mgPerKg / AXIS_MAX) * JAR_H;
                    return (
                        <g key={b.id}>
                            <g transform={`translate(${x} ${BASE - JAR_H - 12}) scale(1.35)`}><Glyph kind={b.id === 'rs-rucula' ? 'rucula' : 'espinafre'} /></g>
                            <rect x={x - JAR_W / 2} y={BASE - JAR_H} width={JAR_W} height={JAR_H} rx={14} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.28)" strokeWidth={1.6} />
                            <motion.rect x={x - JAR_W / 2 + 3} y={BASE - h} width={JAR_W - 6} height={h} rx={11} fill={`url(#${id}-l)`}
                                style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', filter: `drop-shadow(0 0 7px ${C.nitrate}66)` }}
                                initial={reduce ? false : { scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }} />
                            <SvgText x={x} y={BASE + 22} text={LABEL[b.id][0]} anchor="middle" size={16} color="#fff" weight={600} />
                            <SvgText x={x} y={BASE + 41} text={LABEL[b.id][1]} anchor="middle" size={16} color="#D1D5DB" weight={500} />
                            <SvgText x={x} y={BASE + 70} text={num(b.mgPerKg)} anchor="middle" size={22} color={C.nitrateSoft} weight={700} />
                        </g>
                    );
                })}
                <g stroke={C.nitrite} strokeWidth={2.2} fill="none" strokeLinecap="round">
                    <line x1={380} x2={380} y1={yHid + 3} y2={yOrg - 3} />
                    <path d={`M373,${yHid + 12} L380,${yHid + 3} L387,${yHid + 12} M373,${yOrg - 12} L380,${yOrg - 3} L387,${yOrg - 12}`} />
                </g>
                <SvgText x={392} y={(yHid + yOrg) / 2 + 8} text="5,5×" size={26} color={C.nitrite} weight={800} />
            </ArtSvg>
            <div className="grid grid-cols-3 gap-3 px-4 pb-4">
                <BigNum n="5,5×" color={C.nitrate} label="entre cultivos da mesma alface (3.093 ÷ 565). Orgânico não é “mais nitrato”." />
                <BigNum n="10×" color={C.nitrate} label="entre 7 variedades de beterraba cultivadas na mesma região (Áustria)." />
                <BigNum n={<>≈ 5 mmol <Calc /></>} color={C.no} label="em 50 g de rúcula hidropônica gaúcha (313 mg): a dose mínima do IOC numa salada." />
            </div>
        </Stage>
    );
};
