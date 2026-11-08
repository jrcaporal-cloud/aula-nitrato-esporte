import { useReducedMotion } from 'framer-motion';
import { useId } from 'react';
import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { PASS_INDEXES, SHELVES } from '../labelContent';
import { ArtSvg, Stage } from './stage';
import { KINDS } from './artData';
import { Product } from './products';

/**
 * Passos 1 e 2 do slide 45: a gôndola de 24 produtos (4 prateleiras × 6). Com `lit`, só os 5 que passaram de 5 mmol acendem
 * (holofote e brilho verde); os outros apagam. A posição dos 5 é ilustrativa: o estudo não publica o valor de cada um dos 24.
 */

const X0 = 214;
const DX = 100;
const Y0 = 104;
const DY = 108;
const S = 1.1;

export const LabelShelfArt = ({ lit }: { lit: boolean }) => {
    const id = useId();
    const reduce = useReducedMotion();
    return (
        <Stage glow={lit ? C.no : C.nitrate}>
            <ArtSvg label="Gôndola com 24 produtos de nitrato em quatro prateleiras">
                <defs>
                    <linearGradient id={`${id}-cone`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.no} stopOpacity={0.5} /><stop offset="100%" stopColor={C.no} stopOpacity={0} />
                    </linearGradient>
                    <radialGradient id={`${id}-halo`}>
                        <stop offset="0%" stopColor={C.no} stopOpacity={0.5} /><stop offset="100%" stopColor={C.no} stopOpacity={0} />
                    </radialGradient>
                    <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4A3F5C" /><stop offset="100%" stopColor="#241D30" />
                    </linearGradient>
                </defs>
                {SHELVES.map((name, r) => {
                    const y = Y0 + r * DY;
                    return (
                        <g key={name}>
                            <SvgText x={20} y={y - 22} text={name} size={16} color="#D1D5DB" weight={600} />
                            <rect x={176} y={y + 4} width={620} height={9} rx={4} fill={`url(#${id}-wood)`} stroke="rgba(255,255,255,0.18)" />
                        </g>
                    );
                })}
                {Array.from({ length: 24 }, (_, i) => {
                    const r = Math.floor(i / 6);
                    const c = i % 6;
                    const x = X0 + c * DX;
                    const y = Y0 + r * DY;
                    const pass = PASS_INDEXES.includes(i);
                    return (
                        <g key={i} transform={`translate(${x} ${y})`}>
                            <g style={{ opacity: lit && pass ? 1 : 0, transition: 'opacity 0.7s' }}>
                                <path d="M-8,-104 L8,-104 L46,6 L-46,6Z" fill={`url(#${id}-cone)`} />
                                <ellipse cx={0} cy={-34} rx={52} ry={50} fill={`url(#${id}-halo)`}>
                                    {!reduce && <animate attributeName="opacity" values="0.55;1;0.55" dur="2.6s" repeatCount="indefinite" />}
                                </ellipse>
                            </g>
                            <g transform={`scale(${S})`} style={{ opacity: lit && !pass ? 0.24 : 1, transition: 'opacity 0.7s' }}>
                                <Product kind={KINDS[r]} accent={lit && pass ? C.no : C.nitrate} level={0.45 + ((i * 37) % 40) / 100} />
                            </g>
                            <g style={{ opacity: lit && pass ? 1 : 0, transition: 'opacity 0.7s 0.2s' }}>
                                <SvgText x={0} y={-84} text="≥ 5 mmol" anchor="middle" size={16} color={C.no} weight={700} />
                            </g>
                        </g>
                    );
                })}
            </ArtSvg>
        </Stage>
    );
};
