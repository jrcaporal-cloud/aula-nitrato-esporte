import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';

/** Peças do slide de Londres: chão de laboratório (frio), pista do estádio (quente), mostrador e atleta de pódio. */

/** Parede e piso quadriculado do laboratório entre x0 e x1. */
export const LabRoom = ({ x0, x1, floor = 330 }: { x0: number; x1: number; floor?: number }) => {
    const w = x1 - x0;
    const cols = Array.from({ length: 13 }, (_, i) => x0 + (i / 12) * w);
    return (
        <g>
            <defs>
                <linearGradient id="lon-lab" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#0B1426" />
                    <stop offset="1" stopColor="#0E1C33" />
                </linearGradient>
            </defs>
            <rect x={x0} y={-10} width={w} height={floor + 10} fill="url(#lon-lab)" />
            <rect x={x0} y={floor} width={w} height={130} fill="#0A1120" />
            <g stroke={C.o2} strokeOpacity={0.16}>
                {cols.map(x => <line key={x} x1={x} x2={x0 + w / 2 + (x - x0 - w / 2) * 1.8} y1={floor} y2={floor + 120} />)}
                {[0, 18, 42, 74].map(d => <line key={d} x1={x0} x2={x1} y1={floor + d} y2={floor + d} />)}
            </g>
            <line x1={x0} x2={x1} y1={floor} y2={floor} stroke={C.o2} strokeOpacity={0.4} />
        </g>
    );
};

/** Arquibancada escura e pista oval vista de cima, entre x0 e x1 (as raias cruzam a base da cena). */
export const Stadium = ({ x0, x1, top = 250 }: { x0: number; x1: number; top?: number }) => {
    const cx = (x0 + x1) / 2;
    return (
        <g>
            <defs>
                <linearGradient id="lon-stand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#1A0B0E" />
                    <stop offset="1" stopColor="#24110F" />
                </linearGradient>
                <radialGradient id="lon-spot" cx="0.5" cy="0" r="0.9">
                    <stop offset="0" stopColor={C.nitrite} stopOpacity={0.22} />
                    <stop offset="1" stopColor={C.nitrite} stopOpacity={0} />
                </radialGradient>
            </defs>
            <rect x={x0} y={-10} width={x1 - x0} height={480} fill="url(#lon-stand)" />
            <rect x={x0} y={-10} width={x1 - x0} height={420} fill="url(#lon-spot)" />
            {Array.from({ length: 6 }, (_, k) => (
                <ellipse key={k} cx={cx} cy={top + 300} rx={(x1 - x0) * 0.42 + k * 26} ry={250 + k * 16}
                    fill="none" stroke={k === 0 || k === 5 ? '#fff' : '#7C2D12'} strokeOpacity={k === 0 || k === 5 ? 0.35 : 0.9} strokeWidth={k === 0 || k === 5 ? 2 : 24} />
            ))}
        </g>
    );
};

/** Mostrador semicircular: com agulha (mede) ou vazio com "?" (não mede). */
export const Gauge = ({ x, y, r = 58, value, color, label }: { x: number; y: number; r?: number; value: number | null; color: string; label: string }) => {
    const angle = value === null ? 0 : Math.PI * (1 - value);
    return (
        <g>
            <path d={`M ${x - r} ${y} A ${r} ${r} 0 0 1 ${x + r} ${y}`} fill="rgba(7,5,11,0.7)" stroke={color} strokeWidth={4} />
            {Array.from({ length: 9 }, (_, i) => {
                const a = Math.PI * (1 - i / 8);
                return <line key={i} x1={x + Math.cos(a) * (r - 6)} y1={y - Math.sin(a) * (r - 6)} x2={x + Math.cos(a) * (r - 16)} y2={y - Math.sin(a) * (r - 16)} stroke={color} strokeOpacity={value === null ? 0.3 : 0.8} strokeWidth={2} />;
            })}
            {value === null
                ? <SvgText x={x} y={y - 10} text="?" size={36} weight={700} anchor="middle" color={color} />
                : <g>
                    <line x1={x} y1={y} x2={x + Math.cos(angle) * (r - 14)} y2={y - Math.sin(angle) * (r - 14)} stroke="#fff" strokeWidth={4} strokeLinecap="round" />
                    <circle cx={x} cy={y} r={6} fill="#fff" />
                </g>}
            <SvgText x={x} y={y + 26} text={label} size={17} weight={700} anchor="middle" color={color} />
        </g>
    );
};

/** Atleta de pé (pictograma); braços erguidos para o primeiro lugar. (x, y) é o pé. */
export const Athlete = ({ x, y, s = 1, up = false }: { x: number; y: number; s?: number; up?: boolean }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#F3F4F6" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <circle cy={-62} r={8} fill="#F3F4F6" stroke="none" />
        <path d="M 0 -52 V -24 M 0 -24 L -7 0 M 0 -24 L 7 0" />
        <path d={up ? 'M 0 -48 L -14 -64 L -16 -78 M 0 -48 L 14 -64 L 16 -78' : 'M 0 -48 L -11 -34 M 0 -48 L 11 -34'} />
        <circle cy={-40} r={5} fill={C.nitrite} stroke="none" />
    </g>
);
