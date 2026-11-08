import { useCountUp } from '../../kit/countUp';
import { br } from '../../kit/format';
import { SvgPulse } from '../../ato2a/SvgKey';
import { VO2_MAX, VO2_MIN } from '../cast';

/** Medidor semicircular de VO₂max (30 a 80 mL/kg/min); o número sobe junto com o arco e ganha o destaque do passo
 * (anel dentro do próprio SVG, para não vazar da ficha). Sem valor informado, o arco fica tracejado e vazio. */
const R = 30;
const ARC = `M${42 - R} 46 A${R} ${R} 0 0 1 ${42 + R} 46`;

export const VoGauge = ({ value, color, soft }: { value: number | null; color: string; soft: string }) => {
    const frac = value === null ? 0 : (value - VO2_MIN) / (VO2_MAX - VO2_MIN);
    const shown = useCountUp(value ?? 0, { delayMs: 300, ms: 1100 });
    return (
        <div className="flex flex-col items-center rounded-xl border px-1.5 pb-1 pt-1 backdrop-blur-sm" style={{ borderColor: `${color}66`, background: 'rgba(7,5,11,0.62)' }}>
            <span className="font-mono text-[14px] leading-none text-gray-300">VO₂max</span>
            <svg viewBox="0 0 84 52" width={84} height={52} role="img" aria-label={value === null ? 'VO₂max não informado' : `VO₂max ${value} mL/kg/min`} className="block">
                <path d={ARC} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={8} strokeLinecap="round" strokeDasharray={value === null ? '3 7' : undefined} />
                {value !== null && (
                    <path d={ARC} fill="none" stroke={soft} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - frac}
                        style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.2,.7,.2,1) 0.3s', filter: `drop-shadow(0 0 5px ${color})` }} />
                )}
                {value !== null && <SvgPulse x={19} y={24} w={46} h={27} color={soft} delay={0.3} />}
                <text x={42} y={value === null ? 44 : 45} textAnchor="middle" fontSize={value === null ? 16 : 24} fontWeight={700} fill="#fff"
                    style={{ fontFamily: 'var(--font-display)' }}>{value === null ? 'n/i' : br(shown, 0)}</text>
            </svg>
            <span className="text-[14px] leading-none text-gray-300">{value === null ? 'não informado' : 'mL/kg/min'}</span>
        </div>
    );
};
